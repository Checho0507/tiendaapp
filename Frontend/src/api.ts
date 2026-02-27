const API_BASE = 'http://localhost:8000';

export async function fetchEntries(month?: number, year?: number): Promise<Entry[]> {
  let url = `${API_BASE}/entries/`;
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  if (params.toString()) url += '?' + params.toString();

  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener entradas');
  return res.json();
}

export async function createEntry(entry: EntryCreate): Promise<Entry> {
  const res = await fetch(`${API_BASE}/entries/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Error al crear entrada');
  return res.json();
}

export async function fetchSummary(month: number, year: number): Promise<MonthlySummary> {
  const res = await fetch(`${API_BASE}/summary/?month=${month}&year=${year}`);
  if (!res.ok) throw new Error('Error al obtener resumen');
  return res.json();
}