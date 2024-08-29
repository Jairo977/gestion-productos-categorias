import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Categories from './components/Categories';
import Products from './components/Products';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/products" element={<Products />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
