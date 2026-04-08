from __future__ import annotations

import enum
from datetime import date, datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, ForeignKey, JSON, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from banking_alm.db import Base


class SourceSystem(str, enum.Enum):
    CBS = "CBS"
    LOAN_MANAGEMENT = "LOAN_MANAGEMENT"
    DEPOSIT = "DEPOSIT"
    TREASURY = "TREASURY"
    GL = "GL"


class IngestionMode(str, enum.Enum):
    BATCH = "BATCH"
    REALTIME = "REALTIME"


class IngestionStatus(str, enum.Enum):
    RECEIVED = "RECEIVED"
    VALIDATING = "VALIDATING"
    VALIDATED = "VALIDATED"
    FAILED = "FAILED"
    RECONCILED = "RECONCILED"


class ReconciliationStatus(str, enum.Enum):
    PENDING = "PENDING"
    MATCHED = "MATCHED"
    VARIANCE = "VARIANCE"
    FAILED = "FAILED"


class IngestionBatch(Base):
    __tablename__ = "ingestion_batches"

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    source_system: Mapped[str] = mapped_column(String(32), index=True)
    mode: Mapped[str] = mapped_column(String(16), default=IngestionMode.BATCH.value)
    business_date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(32), default=IngestionStatus.RECEIVED.value)
    external_batch_id: Mapped[str | None] = mapped_column(String(128), nullable=True, index=True)
    row_count: Mapped[int] = mapped_column(default=0)
    error_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    records: Mapped[list[StagingRecord]] = relationship(back_populates="batch", cascade="all, delete-orphan")


class StagingRecord(Base):
    """Raw → validated → normalized staging row (ALM-ready after validation passes)."""

    __tablename__ = "staging_records"

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    batch_id: Mapped[UUID] = mapped_column(ForeignKey("ingestion_batches.id", ondelete="CASCADE"))
    source_system: Mapped[str] = mapped_column(String(32), index=True)
    entity_type: Mapped[str] = mapped_column(String(64), index=True)
    business_date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    source_record_id: Mapped[str | None] = mapped_column(String(256), nullable=True, index=True)
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    normalized_payload: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    checksum: Mapped[str | None] = mapped_column(String(64), nullable=True)
    validation_errors: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    batch: Mapped[IngestionBatch] = relationship(back_populates="records")


class ValidationRule(Base):
    """Declarative rules evaluated per source / entity (extensible engine)."""

    __tablename__ = "validation_rules"

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(128), unique=True)
    source_system: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    entity_type: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    rule_type: Mapped[str] = mapped_column(String(64))
    definition: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ValidationResult(Base):
    __tablename__ = "validation_results"

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    batch_id: Mapped[UUID] = mapped_column(ForeignKey("ingestion_batches.id", ondelete="CASCADE"), index=True)
    rule_id: Mapped[UUID] = mapped_column(ForeignKey("validation_rules.id", ondelete="CASCADE"))
    passed: Mapped[bool] = mapped_column(default=False)
    detail: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    evaluated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ReconciliationRun(Base):
    """CBS vs GL (or other pair) snapshot comparison."""

    __tablename__ = "reconciliation_runs"

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(128))
    primary_source: Mapped[str] = mapped_column(String(32))
    compare_source: Mapped[str] = mapped_column(String(32))
    business_date: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[str] = mapped_column(String(32), default=ReconciliationStatus.PENDING.value)
    summary: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
