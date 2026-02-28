from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import extract
from typing import List, Optional
from datetime import date, timedelta
import os
import database
import models
import schemas

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Inicializando base de datos y creando tablas...")
    models.Base.metadata.create_all(bind=database.engine)
    print("Tablas listas.")
    yield
    print("Apagando aplicación...")

app = FastAPI(
    title="Restaurant Manager API",
    description="API para gestionar gastos y producción diaria de un restaurante",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
origins = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", ""),
]
origins = [origin for origin in origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints

@app.post("/entries/", response_model=schemas.Entry, status_code=201)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db)):
    db_entry = models.Entry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/entries/", response_model=List[schemas.Entry])
def list_entries(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Entry)
    if month is not None and year is not None:
        query = query.filter(
            extract('month', models.Entry.date) == month,
            extract('year', models.Entry.date) == year
        )
    elif year is not None:
        query = query.filter(extract('year', models.Entry.date) == year)
    return query.all()

@app.get("/summary/by-period", response_model=schemas.SummaryResponse)
def summary_by_period(
    period: schemas.PeriodEnum = Query(...),
    date_ref: date = Query(..., description="Fecha de referencia"),
    db: Session = Depends(get_db)
):
    # Calcular rango según el período
    if period == schemas.PeriodEnum.diario:
        start_date = date_ref
        end_date = date_ref
    elif period == schemas.PeriodEnum.semanal:
        start_date = date_ref - timedelta(days=6)
        end_date = date_ref
    elif period == schemas.PeriodEnum.quincenal:
        start_date = date_ref - timedelta(days=14)
        end_date = date_ref
    elif period == schemas.PeriodEnum.mensual:
        start_date = date(date_ref.year, date_ref.month, 1)
        # Último día del mes
        next_month = date_ref.replace(day=28) + timedelta(days=4)
        end_date = next_month - timedelta(days=next_month.day)
    elif period == schemas.PeriodEnum.anual:
        start_date = date(date_ref.year, 1, 1)
        end_date = date(date_ref.year, 12, 31)
    else:
        raise HTTPException(status_code=400, detail="Período no válido")

    entries = db.query(models.Entry).filter(
        models.Entry.date >= start_date,
        models.Entry.date <= end_date
    ).all()

    total_expenses = sum(e.expenses for e in entries)
    total_production = sum(e.production for e in entries)
    net = total_production - total_expenses

    return schemas.SummaryResponse(
        period=period.value,
        start_date=start_date,
        end_date=end_date,
        total_expenses=total_expenses,
        total_production=total_production,
        net=net
    )

@app.get("/entries/{entry_id}", response_model=schemas.Entry)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return entry

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API funcionando correctamente"}