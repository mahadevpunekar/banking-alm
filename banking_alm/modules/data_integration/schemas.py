from __future__ import annotations

from datetime import date, datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class IngestRow(BaseModel):
    entity_type: str = "GENERIC"
    source_record_id: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)


class BatchIngestRequest(BaseModel):
    source_system: str = Field(..., examples=["CBS"])
    mode: str = Field(default="BATCH", pattern="^(BATCH|REALTIME)$")
    business_date: date | None = None
    external_batch_id: str | None = None
    rows: list[IngestRow] = Field(default_factory=list)


class BatchSummary(BaseModel):
    id: UUID
    source_system: str
    mode: str
    business_date: date | None
    status: str
    row_count: int
    external_batch_id: str | None
    error_summary: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ReconciliationRequest(BaseModel):
    business_date: date
    name: str | None = None


class ReconciliationSummary(BaseModel):
    id: UUID
    name: str
    primary_source: str
    compare_source: str
    business_date: date
    status: str
    summary: dict[str, Any] | None
    created_at: datetime

    model_config = {"from_attributes": True}
