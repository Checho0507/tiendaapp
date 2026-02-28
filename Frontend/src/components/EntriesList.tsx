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

  if (loading) return <div className="text-center">Cargando...</div>;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title h4">
          Entradas del día {lastDate ? new Date(lastDate).toLocaleDateString('es-ES') : ''}
        </h2>
        {entries.length === 0 ? (
          <p className="text-muted">No hay entradas para la última fecha registrada.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Gastos</th>
                  <th>Producción</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{new Date(entry.date).toLocaleDateString('es-ES')}</td>
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