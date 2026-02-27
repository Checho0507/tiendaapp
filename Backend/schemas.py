from pydantic import BaseModel
from datetime import date

class EntryBase(BaseModel):
    date: date
    expenses: float
    production: float

class EntryCreate(EntryBase):
    pass

class Entry(EntryBase):
    id: int

    class Config:
        from_attributes = True

class MonthlySummary(BaseModel):
    month: int
    year: int
    total_expenses: float
    total_production: float
    net: float