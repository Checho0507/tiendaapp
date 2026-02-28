import { Entry, EntryCreate, SummaryResponse } from './types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const BASE_URL = API_BASE.replace(/\/$/, '');

export async function fetchEntries(month?: number, year?: number): Promise<Entry[]> {
  const url = new URL(`${BASE_URL}/entries/`);
  if (month) url.searchParams.append('month', month.toString());
  if (year) url.searchParams.append('year', year.toString());

  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener entradas: ${res.status} ${errorText}`);
  }
  return res.json();
}

export async function createEntry(entry: EntryCreate): Promise<Entry> {
  // Asegurar que los valores opcionales se envíen como 0 si no están definidos
  const payload = {
    date: entry.date,
    expenses: entry.expenses ?? 0,
    production: entry.production ?? 0,
  };
  const res = await fetch(`${BASE_URL}/entries/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al crear entrada: ${res.status} ${errorText}`);
  }
  return res.json();
}

export async function fetchSummaryByPeriod(period: string, dateRef: string): Promise<SummaryResponse> {
  const url = new URL(`${BASE_URL}/summary/by-period`);
  url.searchParams.append('period', period);
  url.searchParams.append('date_ref', dateRef);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener resumen: ${res.status} ${errorText}`);
  }
  return res.json();
}