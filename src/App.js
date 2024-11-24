import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './layout/Layout';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import './css/Common.css';

const App = () => {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
};

export default App;
