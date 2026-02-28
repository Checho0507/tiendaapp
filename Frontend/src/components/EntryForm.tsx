import React, { useState } from 'react';
import { EntryCreate } from '../types';
import { createEntry } from '../api';

interface Props {
  onEntryAdded: () => void;
}

const EntryForm: React.FC<Props> = ({ onEntryAdded }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [expenses, setExpenses] = useState('');
  const [production, setProduction] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: EntryCreate = {
      date,
      description,
      expenses: expenses === '' ? undefined : parseFloat(expenses),
      production: production === '' ? undefined : parseFloat(production),
    };
    try {
      await createEntry(newEntry);
      setDate('');
      setDescription('');
      setExpenses('');
      setProduction('');
      onEntryAdded();
    } catch (error) {
      console.error(error);
      alert('Error al guardar la entrada');
    }
  };

  return (
    <div className="card mb-4 shadow-sm border-0" style={{ backgroundColor: '#fff9e6' }}>
      <div className="card-body">
        <h2 className="card-title h4" style={{ color: '#CE1126', borderBottom: '2px solid #FCD116', paddingBottom: '0.5rem' }}>
          <i className="bi bi-pencil-square me-2"></i>
          Registrar entrada diaria
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="date" className="form-label fw-bold">Fecha</label>
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
            <label htmlFor="description" className="form-label fw-bold">Descripción</label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Compra de carne, venta del día..."
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="expenses" className="form-label fw-bold">Gastos (opcional)</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
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
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="production" className="form-label fw-bold">Producción (opcional)</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
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
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: '#CE1126', borderColor: '#CE1126' }}>
            <i className="bi bi-save me-2"></i>
            Guardar entrada
          </button>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;