import React, { useEffect, useState } from 'react';
import { Entry } from '../types';
import { fetchEntries } from '../api';

const EntriesList: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const loadEntries = async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>Entradas registradas</h2>
      {entries.length === 0 ? (
        <p>No hay entradas aún.</p>
      ) : (
        <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse' }}>
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
                <td>{entry.date}</td>
                <td>${entry.expenses.toFixed(2)}</td>
                <td>${entry.production.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EntriesList;