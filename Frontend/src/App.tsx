import React, { useState } from 'react';
import EntryForm from './components/EntryForm';
import EntriesList from './components/EntriesList';
import MonthlySummary from './components/MonthlySummary';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntryAdded = () => {
    setRefreshKey(prev => prev + 1); // fuerza recarga de la lista
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Administrador del Restaurante</h1>
      <EntryForm onEntryAdded={handleEntryAdded} />
      <EntriesList key={refreshKey} />
      <MonthlySummary />
    </div>
  );
}

export default App;