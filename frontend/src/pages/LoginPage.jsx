import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginService } from '../services/auth.service';
import { setCredentials } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginService(email, password);
      dispatch(setCredentials({ user: { id: data.id, name: data.name, email: data.email }, token: data.token }));
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 flex flex-col items-center">
      <Link to="/">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">amazon.clone</h1>
      </Link>

      <div className="border border-gray-300 rounded p-6 w-[350px]">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Email</label>
            <input 
              type="email" 
              className="border border-gray-400 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Password</label>
            <input 
              type="password" 
              className="border border-gray-400 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-amazon-yellow hover:bg-yellow-500 border border-yellow-600 rounded py-1.5 shadow-sm mt-2 font-medium"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <p className="text-xs mt-4">
          By continuing, you agree to Amazon Clone's <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
        </p>

        <div className="mt-6 flex items-center justify-center space-x-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text-xs text-gray-500">New to Amazon?</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <Link to="/signup">
          <button className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-400 rounded py-1.5 shadow-sm mt-4 text-sm font-medium">
            Create your Amazon account
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
