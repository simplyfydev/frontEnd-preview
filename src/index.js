import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TableView from './TableView';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddNew from './AddNew';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/table" element={<TableView />} />
        <Route path="/addNew" element={<AddNew />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
