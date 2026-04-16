import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile } from './services/auth.service';
import { setUser, logout } from './store/slices/authSlice';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getProfile();
          dispatch(setUser(userData));
        } catch (error) {
          console.error("Token verification failed", error);
          dispatch(logout()); // Token expired or invalid
        }
      }
    };
    checkAuthStatus();
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
             <Route path="/" element={<HomePage />} /> 
             <Route path="/search" element={<SearchPage />} /> 
             <Route path="/login" element={<LoginPage />} /> 
             <Route path="/signup" element={<SignupPage />} /> 
             <Route path="/product/:id" element={<ProductPage />} /> 
            
             <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
             } /> 
             <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
             } /> 
             <Route path="/order-success" element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
             } /> 
             <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
              </ProtectedRoute>
            } /> 
          </Routes>
        </main>
         <Footer /> 
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </Router>
  );
}

export default App;
