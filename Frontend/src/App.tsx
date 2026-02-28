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
      <div className="colombian-header">
        <div className="sombrero">
          <span role="img" aria-label="sombrero vueltiao">🎩🇨🇴</span>
        </div>
        <h1>
          <i className="bi bi-egg-fried me-2"></i>
          Juliana's FOOD
          <i className="bi bi-cup-straw ms-2"></i>
        </h1>
        <p className="lead">Administración de gastos y producción diaria</p>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <EntryForm onEntryAdded={handleEntryAdded} />
        </div>
        <div className="col-lg-6">
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