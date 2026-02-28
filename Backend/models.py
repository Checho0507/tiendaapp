from sqlalchemy import Column, Integer, Float, Date, String
from database import Base

class Entry(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    description = Column(String, nullable=False)   # nueva columna obligatoria
    expenses = Column(Float, nullable=False)       # gastos
    production = Column(Float, nullable=False)     # producción