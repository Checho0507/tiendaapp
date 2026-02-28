import React, { useState } from 'react';
import EntryForm from './components/EntryForm';
import EntriesList from './components/EntriesList';
import SummarySelector from './components/SummarySelector';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntryAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Administrador del Restaurante</h1>
      <div className="row">
        <div className="col-md-6">
          <EntryForm onEntryAdded={handleEntryAdded} />
        </div>
        <div className="col-md-6">
          <SummarySelector />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <EntriesList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}

export default App;