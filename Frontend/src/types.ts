export interface Entry {
  id: number;
  date: string;          // formato "YYYY-MM-DD"
  description: string;
  expenses: number;
  production: number;
}

export interface EntryCreate {
  date: string;
  description: string;   // obligatoria
  expenses?: number;     // opcional (se enviará 0 si no se provee)
  production?: number;   // opcional
}

export interface SummaryResponse {
  period: string;
  start_date: string;
  end_date: string;
  total_expenses: number;
  total_production: number;
  net: number;
}