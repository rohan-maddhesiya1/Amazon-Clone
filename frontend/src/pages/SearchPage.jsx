import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { getProducts, getCategories } from '../services/product.service';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories for sidebar:", error);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(searchQuery, categoryQuery);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryQuery]);

  const handleCategoryClick = (catName) => {
    let url = '/search?';
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (catName !== 'All') url += `category=${encodeURIComponent(catName)}`;
    // clean up trailing ampersand if applicable
    if (url.endsWith('&') || url.endsWith('?')) {
      url = url.slice(0, -1);
    }
    navigate(url);
  };

  return (
    <div className="bg-white min-h-screen border-t border-gray-200">
      
      {/* Top Banner indicating search / context */}
      <div className="py-2 px-4 shadow-sm text-sm text-gray-700 bg-white border-b border-gray-200 shadow-sm flex items-center">
         <span className="font-bold flex items-center gap-2">
            1-{products.length || 0} of over {products.length || 0} results for 
            <span className="text-amazon-orange">
               "{searchQuery || categoryQuery || 'Everything'}"
            </span>
         </span>
      </div>

      <div className="flex max-w-[1500px] mx-auto p-4 gap-6">
        
        {/* Left Sidebar */}
        <div className="w-[200px] flex-shrink-0 hidden md:block">
           <h3 className="font-bold text-sm mb-3">Department</h3>
           <ul className="space-y-2 text-sm text-gray-700">
             <li 
               className={`cursor-pointer hover:text-amazon-orange ${!categoryQuery ? 'font-bold text-black' : ''}`}
               onClick={() => handleCategoryClick('All')}
             >
                All
             </li>
             {categories.map((cat, idx) => (
                <li 
                  key={idx} 
                  className={`cursor-pointer hover:text-amazon-orange ${categoryQuery === cat ? 'font-bold text-black' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </li>
             ))}
           </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
           <div className="mb-4">
              <h2 className="text-xl font-medium">Results for "{searchQuery || categoryQuery || "All"}"</h2>
              <span className="text-sm text-gray-500">{products.length} results</span>
           </div>

           {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {[1, 2, 3, 4].map(n => (
                 <div key={n} className="bg-white p-4 h-[400px] rounded animate-pulse shadow-sm border border-gray-100">
                   <div className="bg-gray-200 h-48 w-full mb-4"></div>
                   <div className="bg-gray-200 h-6 w-3/4 mb-2"></div>
                   <div className="bg-gray-200 h-4 w-1/2 mb-4"></div>
                 </div>
               ))}
             </div>
           ) : products.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
               {products.map(product => (
                  <ProductCard key={product.id} product={product} />
               ))}
             </div>
           ) : (
             <div className="py-20 border border-gray-200 rounded flex items-center justify-center flex-col shadow-sm h-[300px]">
               <h3 className="text-xl font-medium text-gray-700 mb-2">No products found.</h3>
               <p className="text-gray-500">Try a different search or category.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default SearchPage;
