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
      expenses: expenses === '' ? undefined : parseFloat(expenses),
      production: production === '' ? undefined : parseFloat(production),
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
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title h4">Registrar entrada diaria</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="expenses" className="form-label">Gastos (opcional)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="expenses"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="production" className="form-label">Producción (opcional)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="production"
              value={production}
              onChange={(e) => setProduction(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;