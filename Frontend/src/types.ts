// Interfaz para una entrada diaria (cuando viene del backend con ID)
export interface Entry {
  id: number;
  date: string;        // formato ISO "YYYY-MM-DD"
  expenses: number;    // gastos
  production: number;  // producción
}

// Interfaz para crear una nueva entrada (sin ID, se genera en el backend)
export interface EntryCreate {
  date: string;
  expenses: number;
  production: number;
}

// Interfaz para el resumen mensual
export interface MonthlySummary {
  month: number;       // 1-12
  year: number;
  total_expenses: number;
  total_production: number;
  net: number;         // ganancia neta (producción - gastos)
}