import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCart } from '../services/cart.service';
import { setCartItems } from '../store/slices/cartSlice';
import CartItem from '../components/cart/CartItem';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../services/order.service';

const CartPage = () => {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartData = await getCart();
        dispatch(setCartItems(cartData));
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [dispatch]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Left side - Cart Items */}
        <div className="flex-grow bg-white p-6 shadow-sm rounded-sm">
          <div className="flex justify-between items-baseline border-b border-gray-300 pb-2 mb-4">
            <h1 className="text-3xl">Shopping Cart</h1>
            <span className="text-gray-600">Price</span>
          </div>

          {loading ? (
             <div className="flex justify-center py-10">Loading cart...</div>
          ) : items.length === 0 ? (
            <div className="py-10">
              <h2 className="text-xl font-bold mb-2">Your Amazon Cart is empty.</h2>
              <p className="text-sm">Check your Saved for later items below or continue shopping.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
              
              <div className="flex justify-end pt-4">
                <p className="text-lg">Subtotal ({totalItems} items): <span className="font-bold">₹{totalPrice.toFixed(2)}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Checkout section */}
        {items.length > 0 && (
          <div className="w-full md:w-80 bg-white p-5 shadow-sm rounded-sm h-fit">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-2 text-sm text-green-700">
                <div className="w-5 h-5 rounded-full bg-green-700 flex items-center justify-center text-white text-xs">✓</div>
                <span>Part of your order qualifies for FREE Delivery.</span>
              </div>
              <h2 className="text-lg mb-2">
                Subtotal ({totalItems} items): <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
              </h2>
              
              <div className="flex items-center gap-1 mb-4 text-sm">
                <input type="checkbox" className="accent-amazon-orange"/>
                <span>This order contains a gift</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkingOut}
                className="bg-amazon-yellow hover:bg-yellow-500 border border-yellow-600 rounded py-2 shadow-sm text-sm"
              >
                {checkingOut ? 'Processing...' : 'Proceed to Buy'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
