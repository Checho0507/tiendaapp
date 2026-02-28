export interface Entry {
  id: number;
  date: string;
  expenses: number;
  production: number;
}

export interface EntryCreate {
  date: string;
  expenses?: number;  // opcional
  production?: number; // opcional
}

export interface SummaryResponse {
  period: string;
  start_date: string;
  end_date: string;
  total_expenses: number;
  total_production: number;
  net: number;
}