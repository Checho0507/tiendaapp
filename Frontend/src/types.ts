export interface Entry {
  id: number;
  date: string; // formato YYYY-MM-DD
  expenses: number;
  production: number;
}

export interface EntryCreate {
  date: string;
  expenses: number;
  production: number;
}

export interface MonthlySummary {
  month: number;
  year: number;
  total_expenses: number;
  total_production: number;
  net: number;
}export interface Entry {
  id: number;
  date: string; // formato YYYY-MM-DD
  expenses: number;
  production: number;
}

export interface EntryCreate {
  date: string;
  expenses: number;
  production: number;
}

export interface MonthlySummary {
  month: number;
  year: number;
  total_expenses: number;
  total_production: number;
  net: number;
}