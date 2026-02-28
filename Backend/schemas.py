from pydantic import BaseModel, Field
from datetime import date
from typing import Optional
import enum

class EntryBase(BaseModel):
    date: date
    expenses: Optional[float] = Field(0.0, ge=0)
    production: Optional[float] = Field(0.0, ge=0)

class EntryCreate(EntryBase):
    pass

class Entry(EntryBase):
    id: int

    class Config:
        from_attributes = True

class PeriodEnum(str, enum.Enum):
    diario = "diario"
    semanal = "semanal"
    quincenal = "quincenal"
    mensual = "mensual"
    anual = "anual"

class SummaryResponse(BaseModel):
    period: str
    start_date: date
    end_date: date
    total_expenses: float
    total_production: float
    net: float