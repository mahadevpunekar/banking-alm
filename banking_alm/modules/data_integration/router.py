from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from banking_alm.db import get_db
from banking_alm.modules.data_integration import ingestion_service, reconciliation_service
from banking_alm.modules.data_integration.models import IngestionBatch
from banking_alm.modules.data_integration.schemas import (
    BatchIngestRequest,
    BatchSummary,
    ReconciliationRequest,
    ReconciliationSummary,
)

router = APIRouter(prefix="/data-integration", tags=["Data Integration"])


@router.post("/ingest/batch", response_model=BatchSummary, status_code=status.HTTP_201_CREATED)
async def ingest_batch(body: BatchIngestRequest, db: AsyncSession = Depends(get_db)) -> BatchSummary:
    batch = await ingestion_service.create_batch_and_records(
        db,
        source_system=body.source_system,
        mode=body.mode,
        business_date=body.business_date,
        external_batch_id=body.external_batch_id,
        rows=[r.model_dump() for r in body.rows],
    )
    return BatchSummary.model_validate(batch)


@router.post("/batches/{batch_id}/validate", response_model=BatchSummary)
async def validate_batch(batch_id: UUID, db: AsyncSession = Depends(get_db)) -> BatchSummary:
    try:
        batch = await ingestion_service.run_validation_for_batch(db, batch_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Batch not found") from None
    return BatchSummary.model_validate(batch)


@router.get("/batches/{batch_id}", response_model=BatchSummary)
async def get_batch(batch_id: UUID, db: AsyncSession = Depends(get_db)) -> BatchSummary:
    result = await db.execute(select(IngestionBatch).where(IngestionBatch.id == batch_id))
    batch = result.scalar_one_or_none()
    if batch is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    return BatchSummary.model_validate(batch)


@router.post("/reconcile/cbs-gl", response_model=ReconciliationSummary)
async def reconcile_cbs_gl(
    body: ReconciliationRequest, db: AsyncSession = Depends(get_db)
) -> ReconciliationSummary:
    run = await reconciliation_service.run_cbs_gl_balance_reconciliation(
        db,
        business_date=body.business_date,
        name=body.name or "CBS vs GL balances",
    )
    return ReconciliationSummary.model_validate(run)


@router.get("/reconcile/{run_id}", response_model=ReconciliationSummary)
async def get_reconcile_run(run_id: UUID, db: AsyncSession = Depends(get_db)) -> ReconciliationSummary:
    run = await reconciliation_service.get_reconciliation(db, run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Reconciliation run not found")
    return ReconciliationSummary.model_validate(run)


@router.get("/health/sources")
async def list_sources() -> dict[str, list[str]]:
    return {
        "supported_source_systems": [
            "CBS",
            "LOAN_MANAGEMENT",
            "DEPOSIT",
            "TREASURY",
            "GL",
        ],
        "ingestion_modes": ["BATCH", "REALTIME"],
    }
