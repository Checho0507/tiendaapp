import { Entry, EntryCreate, MonthlySummary } from './types';

// Usa la variable de entorno REACT_APP_API_URL si está definida, si no, localhost:8000
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Obtiene todas las entradas, opcionalmente filtradas por mes y año.
 */
export async function fetchEntries(month?: number, year?: number): Promise<Entry[]> {
  const url = new URL(`${API_BASE}/entries/`);
  if (month) url.searchParams.append('month', month.toString());
  if (year) url.searchParams.append('year', year.toString());

  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener entradas: ${res.status} ${errorText}`);
  }
  return res.json();
}

/**
 * Crea una nueva entrada diaria.
 */
export async function createEntry(entry: EntryCreate): Promise<Entry> {
  const res = await fetch(`${API_BASE}/entries/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al crear entrada: ${res.status} ${errorText}`);
  }
  return res.json();
}

/**
 * Obtiene el resumen mensual (total gastos, producción y neto) para un mes y año dados.
 */
export async function fetchSummary(month: number, year: number): Promise<MonthlySummary> {
  const url = new URL(`${API_BASE}/summary/`);
  url.searchParams.append('month', month.toString());
  url.searchParams.append('year', year.toString());

  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener resumen: ${res.status} ${errorText}`);
  }
  return res.json();
}