import React, { useState } from 'react';
import { MonthlySummary as SummaryType } from '../types';
import { fetchSummary } from '../api';

const MonthlySummary: React.FC = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchSummary(month, year);
      setSummary(data);
    } catch (error) {
      console.error(error);
      alert('Error al obtener resumen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <h2>Resumen mensual</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <label>
          Mes:
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString('es', { month: 'long' })}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: '1rem' }}>
          Año:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min="2020"
            max="2030"
          />
        </label>
        <button type="submit" style={{ marginLeft: '1rem' }} disabled={loading}>
          {loading ? 'Cargando...' : 'Consultar'}
        </button>
      </form>

      {summary && (
        <div>
          <p><strong>Mes:</strong> {summary.month}/{summary.year}</p>
          <p><strong>Total gastos:</strong> ${summary.total_expenses.toFixed(2)}</p>
          <p><strong>Total producción:</strong> ${summary.total_production.toFixed(2)}</p>
          <p><strong>Ganancia neta:</strong> ${summary.net.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;