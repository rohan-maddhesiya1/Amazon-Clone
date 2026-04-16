import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signup as signupService } from '../services/auth.service';
import { setCredentials } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await signupService(name, email, password);
      dispatch(setCredentials({ user: { id: data.id, name: data.name, email: data.email }, token: data.token }));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign up. Email might already be in use.');
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
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Your name</label>
            <input 
              type="text" 
              placeholder="First and last name"
              className="border border-gray-400 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              className="border border-gray-400 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-amazon-orange focus:border-amazon-orange"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Passwords must be at least 6 characters.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-amazon-yellow hover:bg-yellow-500 border border-yellow-600 rounded py-1.5 shadow-sm mt-2 font-medium"
          >
            {loading ? 'Creating...' : 'Continue'}
          </button>
        </form>

        <p className="text-xs mt-4">
          By creating an account, you agree to Amazon Clone's <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
        </p>

        <div className="mt-6 border-t border-gray-100 pt-4 pb-2">
          <p className="text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 hover:text-amazon-orange hover:underline">Sign in <span>▶</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
