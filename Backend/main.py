from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import extract
from typing import List, Optional
import os

import database
import models
import schemas

# Lifespan para crear tablas al iniciar la aplicación
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Código que se ejecuta al arrancar
    print("Inicializando base de datos y creando tablas...")
    models.Base.metadata.create_all(bind=database.engine)
    print("Tablas listas.")
    yield
    # Código que se ejecuta al apagar (opcional)
    print("Apagando aplicación...")

app = FastAPI(
    title="Restaurant Manager API",
    description="API para gestionar gastos y producción diaria de un restaurante",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración de CORS
origins = [
    "http://localhost:3000",           # Desarrollo local (React)
    "http://localhost:5000",           # Posiblemente otro puerto
    os.getenv("FRONTEND_URL", ""),      # URL del frontend en producción (definida en Railway)
]

# Filtrar cadenas vacías
origins = [origin for origin in origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------- ENDPOINTS -------------------

@app.post("/entries/", response_model=schemas.Entry, status_code=201)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db)):
    """Registra una nueva entrada diaria (gastos y producción)."""
    db_entry = models.Entry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/entries/", response_model=List[schemas.Entry])
def list_entries(
    month: Optional[int] = Query(None, ge=1, le=12, description="Mes para filtrar (1-12)"),
    year: Optional[int] = Query(None, description="Año para filtrar"),
    db: Session = Depends(get_db)
):
    """
    Lista todas las entradas, opcionalmente filtradas por mes y/o año.
    Si no se proporcionan filtros, devuelve todas.
    """
    query = db.query(models.Entry)
    if month is not None and year is not None:
        query = query.filter(
            extract('month', models.Entry.date) == month,
            extract('year', models.Entry.date) == year
        )
    elif year is not None:
        query = query.filter(extract('year', models.Entry.date) == year)
    return query.all()

@app.get("/summary/", response_model=schemas.MonthlySummary)
def monthly_summary(
    month: int = Query(..., ge=1, le=12, description="Mes del resumen (1-12)"),
    year: int = Query(..., description="Año del resumen"),
    db: Session = Depends(get_db)
):
    """
    Devuelve un resumen mensual: total gastos, total producción y ganancia neta.
    """
    entries = db.query(models.Entry).filter(
        extract('month', models.Entry.date) == month,
        extract('year', models.Entry.date) == year
    ).all()

    total_expenses = sum(e.expenses for e in entries)
    total_production = sum(e.production for e in entries)
    net = total_production - total_expenses

    return schemas.MonthlySummary(
        month=month,
        year=year,
        total_expenses=total_expenses,
        total_production=total_production,
        net=net
    )

@app.get("/entries/{entry_id}", response_model=schemas.Entry)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    """Obtiene una entrada específica por su ID."""
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return entry

# Endpoint opcional para verificar que el servicio está vivo (health check)
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API funcionando correctamente"}