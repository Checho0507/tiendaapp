import React, { useState } from 'react';
import { fetchSummaryByPeriod } from '../api';
import { SummaryResponse } from '../types';

const SummarySelector: React.FC = () => {
  const [period, setPeriod] = useState<'diario' | 'semanal' | 'quincenal' | 'mensual' | 'anual'>('mensual');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchSummaryByPeriod(period, date);
      setSummary(data);
    } catch (error) {
      console.error(error);
      alert('Error al obtener resumen');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES');
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title h4">Resumen por período</h2>
        <form onSubmit={handleSubmit} className="row g-3 mb-3">
          <div className="col-md-4">
            <label htmlFor="period" className="form-label">Período</label>
            <select
              id="period"
              className="form-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="date" className="form-label">Fecha de referencia</label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Consultando...' : 'Ver resumen'}
            </button>
          </div>
        </form>

        {summary && (
          <div className="mt-3 p-3 bg-light rounded">
            <p><strong>Período:</strong> {summary.period}</p>
            <p><strong>Desde:</strong> {formatDate(summary.start_date)} <strong>Hasta:</strong> {formatDate(summary.end_date)}</p>
            <p><strong>Total gastos:</strong> ${summary.total_expenses.toFixed(2)}</p>
            <p><strong>Total producción:</strong> ${summary.total_production.toFixed(2)}</p>
            <p><strong>Ganancia neta:</strong> ${summary.net.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarySelector;