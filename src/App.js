import React from 'react';

import './scss/app.scss';

import Header from './components/Header';
import { Home } from './pages/Home';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import FullPizza from './pages/FullPizza';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/pizza/:id" element={<Cart />} />
          <Route path="/cart" element={<FullPizza />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
