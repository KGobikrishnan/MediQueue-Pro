import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueueProvider } from './context/QueueContext';
import { AppRoutes } from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueueProvider>
          <AppRoutes />
        </QueueProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
