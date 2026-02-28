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
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('es-ES');
  };

  return (
    <div className="card mb-4 shadow-sm border-0" style={{ backgroundColor: '#fff9e6' }}>
      <div className="card-body">
        <h2 className="card-title h4" style={{ color: '#CE1126', borderBottom: '2px solid #FCD116', paddingBottom: '0.5rem' }}>
          <i className="bi bi-bar-chart-steps me-2"></i>
          Resumen por período
        </h2>
        <form onSubmit={handleSubmit} className="row g-3 mb-3">
          <div className="col-md-4">
            <label htmlFor="period" className="form-label fw-bold">Período</label>
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
            <label htmlFor="date" className="form-label fw-bold">Fecha de referencia</label>
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
            <button type="submit" className="btn w-100" style={{ backgroundColor: '#FCD116', color: '#000', borderColor: '#CE1126' }} disabled={loading}>
              {loading ? 'Consultando...' : 'Ver resumen'}
            </button>
          </div>
        </form>

        {summary && (
          <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#e8f0fe', borderLeft: '5px solid #003893' }}>
            <p><strong>Período:</strong> {summary.period}</p>
            <p><strong>Desde:</strong> {formatDate(summary.start_date)} <strong>Hasta:</strong> {formatDate(summary.end_date)}</p>
            <p><strong>Total gastos:</strong> ${summary.total_expenses.toFixed(2)}</p>
            <p><strong>Total producción:</strong> ${summary.total_production.toFixed(2)}</p>
            <p><strong>Ganancia neta:</strong> <span style={{ color: summary.net >= 0 ? '#003893' : '#CE1126', fontWeight: 'bold' }}>${summary.net.toFixed(2)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarySelector;