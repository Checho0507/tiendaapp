from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import extract
import database, models, schemas

# Crear tablas en la base de datos (solo para desarrollo)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Restaurant Manager API")

# Configurar CORS para permitir peticiones del frontend (React en puerto 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ajusta según tu frontend
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

@app.post("/entries/", response_model=schemas.Entry)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db)):
    db_entry = models.Entry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/entries/", response_model=List[schemas.Entry])
def list_entries(
    month: int = Query(None, ge=1, le=12),
    year: int = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Entry)
    if month and year:
        query = query.filter(
            extract('month', models.Entry.date) == month,
            extract('year', models.Entry.date) == year
        )
    elif year:
        query = query.filter(extract('year', models.Entry.date) == year)
    return query.all()

@app.get("/summary/", response_model=schemas.MonthlySummary)
def monthly_summary(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(...),
    db: Session = Depends(get_db)
):
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
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry