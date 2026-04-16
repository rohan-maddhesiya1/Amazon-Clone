import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiShoppingCart, FiMapPin } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { useState, useEffect } from 'react';
import { getCategories } from '../../services/product.service';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCats();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let queryParams = [];
    if (searchTerm.trim()) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
    if (selectedCategory && selectedCategory !== 'All') queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
    
    if (queryParams.length > 0) {
      navigate(`/search?${queryParams.join('&')}`);
    } else {
      navigate('/search');
    }
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-amazon-dark text-white sticky top-0 z-50">
      <div className="flex items-center px-4 py-2 space-x-4 h-16">
        {/* Logo */}
        <Link to="/" className="flex flex-col justify-center px-2 py-1 border border-transparent hover:border-white rounded-sm mt-1">
          <span className="text-2xl font-bold leading-none tracking-tighter hover:text-white">amazon</span>
          <span className="text-xs text-right leading-none -mt-1 text-gray-300">.clone</span>
        </Link>

        {/* Deliver To */}
        <div className="hidden md:flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer">
          <FiMapPin className="text-lg mt-3" />
          <div className="flex flex-col ml-1">
            <span className="text-xs text-gray-300 leading-none">Deliver to</span>
            <span className="text-sm font-bold leading-tight">India</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-grow hidden sm:flex">
          <form onSubmit={handleSearch} className="flex flex-grow rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amazon-orange">
            <select 
              className="bg-gray-100 text-black border-r border-gray-300 px-2 py-2 text-sm outline-none cursor-pointer hover:bg-gray-200 w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat, i) => (
                 <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
            <input 
              type="text" 
              className="flex-grow px-4 py-2 text-black outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Amazon Clone"
            />
            <button type="submit" className="bg-amazon-orange hover:bg-yellow-500 px-4 py-2 text-black transition-colors flex items-center justify-center">
              <FiSearch className="text-xl" />
            </button>
          </form>
        </div>

        {/* Right Links */}
        <div className="flex items-center space-x-2">
          {/* Auth Link */}
          {isAuthenticated ? (
            <div className="group relative px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer flex flex-col">
              <span className="text-xs leading-none">Hello, {user?.name || 'User'}</span>
              <span className="text-sm font-bold leading-tight flex items-center">
                Account & Lists <span className="ml-1 text-[10px]">▼</span>
              </span>
              
              {/* Dropdown menu */}
              <div className="absolute top-10 right-0 w-48 bg-white text-black p-3 rounded shadow-lg hidden group-hover:block border border-gray-200">
                 <div className="mb-2 pb-2 border-b">
                   <h3 className="font-bold mb-1">Your Account</h3>
                   <Link to="/orders" className="text-sm hover:text-amazon-orange block py-1">Your Orders</Link>
                 </div>
                 <button onClick={handleLogout} className="text-sm text-red-600 hover:underline w-full text-left py-1">
                   Sign Out
                 </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="px-2 py-1 border border-transparent hover:border-white rounded-sm flex flex-col">
              <span className="text-xs leading-none">Hello, sign in</span>
              <span className="text-sm font-bold leading-tight">Account & Lists</span>
            </Link>
          )}

          {/* Orders */}
          <Link to={isAuthenticated ? '/orders' : '/login'} className="hidden md:flex px-2 py-1 border border-transparent hover:border-white rounded-sm flex-col">
            <span className="text-xs leading-none">Returns</span>
            <span className="text-sm font-bold leading-tight">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm relative">
            <div className="relative flex items-center">
              <span className="absolute -top-1 left-3.5 text-amazon-orange font-bold text-sm bg-amazon-dark rounded-full px-1 z-10 w-6 text-center leading-none">
                {cartItemCount}
              </span>
              <FiShoppingCart className="text-3xl mt-1" />
            </div>
            <span className="text-sm font-bold mt-3 ml-1 hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>
      
      {/* Search Bar for Mobile */}
      <div className="bg-amazon-light p-2 sm:hidden flex">
        <form onSubmit={handleSearch} className="flex flex-grow rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amazon-orange">
          <input 
            type="text" 
            className="flex-grow px-2 py-2 text-black outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Amazon Clone"
          />
          <button type="submit" className="bg-amazon-orange px-3 py-2 text-black flex items-center justify-center">
            <FiSearch />
          </button>
        </form>
      </div>

      {/* Sub Navigation Strip */}
      <div className="bg-amazon-light text-white px-4 py-1.5 flex items-center space-x-5 text-sm h-10 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <div className="flex items-center font-bold cursor-pointer border border-transparent hover:border-white p-1 rounded-sm gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          All
        </div>
        {categories.slice(0, 8).map((cat, i) => (
          <Link key={i} to={`/search?category=${encodeURIComponent(cat)}`} className="cursor-pointer border border-transparent hover:border-white p-1 rounded-sm">
            {cat}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
