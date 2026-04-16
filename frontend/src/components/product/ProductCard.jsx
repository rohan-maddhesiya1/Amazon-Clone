import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../services/cart.service';
import { getCart } from '../../services/cart.service';
import { setCartItems } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);

  // Generate random stars for demo purposes if rating is missing
  const safeRating = product.rating ? Math.round(Number(product.rating)) : Math.floor(Math.random() * 2) + 3;
  const rating = Math.min(Math.max(safeRating, 0), 5); // ensure between 0 and 5
  const reviews = product.numReviews || Math.floor(Math.random() * 500) + 10;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      setAdding(true);
      // Wait for API
      await addToCart(product.id, 1);
      toast.success(`${product.name.substring(0, 20)}... added to cart`);
      // Update global cart state
      const cartData = await getCart();
      dispatch(setCartItems(cartData));
    } catch (error) {
       // If no token, the API will fail, handle it gracefully
       if (error.response?.status === 401) {
         toast.error('Please login to add items to cart');
       } else {
         toast.error('Failed to add item to cart');
       }
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="bg-white z-30 p-5 flex flex-col m-2 max-w-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer rounded">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">{product.brand}</p>
      
      <div className="w-full flex justify-center h-48 mb-4">
        <img 
          src={product.imageUrl || 'https://dummyimage.com/200x200/cccccc/000000.png&text=Product'} 
          alt={product.name} 
          className="object-contain h-full w-full"
        />
      </div>

      <h4 className="my-3 text-lg line-clamp-2 hover:text-amazon-orange">{product.name}</h4>

      <div className="flex">
        {Array(rating).fill().map((_, i) => (
          <span key={i} className="text-yellow-500">★</span>
        ))}
        {Array(5 - rating).fill().map((_, i) => (
          <span key={i} className="text-gray-300">★</span>
        ))}
        <span className="text-blue-500 hover:text-amazon-orange text-sm ml-2">{reviews}</span>
      </div>

      <p className="text-xs my-2 line-clamp-2 text-gray-600">
        {product.description}
      </p>

      <div className="mb-5 flex items-baseline space-x-1">
        <span className="text-sm">₹</span>
        <span className="text-2xl font-semibold">{product.price}</span>
      </div>

      <button 
        onClick={handleAddToCart}
        disabled={adding}
        className="mt-auto bg-amazon-yellow hover:bg-yellow-500 border border-yellow-600 rounded py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </Link>
  );
};

export default ProductCard;
