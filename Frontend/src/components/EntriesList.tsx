import React, { useEffect, useState } from 'react';
import { Entry } from '../types';
import { fetchEntries } from '../api';

const EntriesList: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDate, setLastDate] = useState<string | null>(null);

  const loadEntries = async () => {
    try {
      const data = await fetchEntries();
      if (data.length > 0) {
        const dates = data.map(e => e.date);
        const maxDate = dates.reduce((a, b) => a > b ? a : b);
        setLastDate(maxDate);
        const filtered = data.filter(e => e.date === maxDate);
        setEntries(filtered);
      } else {
        setEntries([]);
        setLastDate(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  // Formatear fecha para mostrar en local sin desfase
  const formatLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="text-center">Cargando...</div>;

  return (
    <div className="card mb-4 shadow-sm border-0" style={{ backgroundColor: '#fff9e6' }}>
      <div className="card-body">
        <h2 className="card-title h4" style={{ color: '#CE1126', borderBottom: '2px solid #FCD116', paddingBottom: '0.5rem' }}>
          <i className="bi bi-list-ul me-2"></i>
          Entradas del día {lastDate ? formatLocalDate(lastDate) : ''}
        </h2>
        {entries.length === 0 ? (
          <p className="text-muted">No hay entradas para la última fecha registrada.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark" style={{ backgroundColor: '#003893' }}>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Gastos</th>
                  <th>Producción</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{formatLocalDate(entry.date)}</td>
                    <td>{entry.description}</td>
                    <td>${entry.expenses.toFixed(2)}</td>
                    <td>${entry.production.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntriesList;