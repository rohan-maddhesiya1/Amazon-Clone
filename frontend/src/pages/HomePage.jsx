import { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../services/product.service';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-amazon-bg min-h-screen relative max-w-screen-2xl mx-auto">
      {/* Hero Banner */}
      <div className="relative">
        <div className="absolute w-full h-32 bg-gradient-to-t from-amazon-bg to-transparent bottom-0 z-20" />
        <img 
          src="https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg" 
          alt="Hero Banner" 
          className="w-full object-cover min-h-[200px]"
        />
      </div>

      {/* Main Content / Product Grid */}
      <div className="relative z-30 -mt-16 md:-mt-36 lg:-mt-52 px-4 pb-10">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white p-4 h-[400px] rounded animate-pulse cursor-pointer">
                  <div className="bg-gray-200 h-48 w-full mb-4"></div>
                  <div className="bg-gray-200 h-6 w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 mb-4"></div>
                  <div className="bg-gray-200 h-8 w-1/4"></div>
                </div>
             ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {/* Display first 4 products */}
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Banner ad in middle */}
            <div className="md:col-span-full">
               <img className="w-full object-cover mb-4 rounded shadow-sm min-h-[100px] bg-gray-200" src="https://m.media-amazon.com/images/I/61CiqVtrBEL._SX3000_.jpg" alt="Promo break" />
            </div>

            {/* Display remaining products */}
            {products.slice(4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white shadow-sm rounded-sm">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
