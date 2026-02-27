import React, { useState } from 'react';
import { EntryCreate } from '../types';
import { createEntry } from '../api';

interface Props {
  onEntryAdded: () => void;
}

const EntryForm: React.FC<Props> = ({ onEntryAdded }) => {
  const [date, setDate] = useState('');
  const [expenses, setExpenses] = useState('');
  const [production, setProduction] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: EntryCreate = {
      date,
      expenses: parseFloat(expenses),
      production: parseFloat(production),
    };
    try {
      await createEntry(newEntry);
      setDate('');
      setExpenses('');
      setProduction('');
      onEntryAdded();
    } catch (error) {
      console.error(error);
      alert('Error al guardar la entrada');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h2>Registrar entrada diaria</h2>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Fecha: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Gastos: </label>
        <input
          type="number"
          step="0.01"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Producción: </label>
        <input
          type="number"
          step="0.01"
          value={production}
          onChange={(e) => setProduction(e.target.value)}
          required
        />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default EntryForm;