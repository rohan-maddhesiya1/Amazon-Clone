import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart, getCart, updateCartQuantity } from '../../services/cart.service';
import { setCartItems } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { Product, quantity } = item;

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdating(true);
      await updateCartQuantity(item.id, newQuantity);
      const cartData = await getCart();
      dispatch(setCartItems(cartData));
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeFromCart(item.id);
      toast.success('Item removed from cart');
      const cartData = await getCart();
      dispatch(setCartItems(cartData));
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setRemoving(false);
    }
  };

  if (!Product) return null;

  return (
    <div className="flex bg-white py-4 border-b border-gray-200 gap-4">
      <div className="w-1/4 max-w-[150px]">
        <img 
          src={Product.imageUrl || 'https://dummyimage.com/150x150/cccccc/000000.png&text=Product'} 
          alt={Product.name} 
          className="w-full object-contain h-32"
        />
      </div>

      <div className="w-3/4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-black truncate w-[80%] hover:text-amazon-orange cursor-pointer line-clamp-2">
              {Product.name}
            </h3>
            <p className="text-xl font-bold">₹{Product.price}</p>
          </div>
          
          <p className="text-sm text-green-600 mt-1">In stock</p>
          <div className="flex items-center text-xs mt-1 text-gray-500 gap-1">
             <input type="checkbox" className="mr-1 accent-amazon-orange" />
             This is a gift <span className="text-blue-500 hover:text-amazon-orange cursor-pointer hover:underline mx-1">Learn more</span>
          </div>
        </div>

        <div className="flex items-center mt-3 text-sm gap-4">
          <div className="flex items-center bg-gray-100 rounded border border-gray-300 overflow-hidden shadow-sm shadow-gray-200">
             <button 
                onClick={() => quantity > 1 ? handleUpdateQuantity(quantity - 1) : handleRemove()}
                disabled={updating || removing}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 transition-colors border-r border-gray-300 text-lg leading-none"
             >-</button>
             <span className="px-3 py-1 font-semibold text-gray-700 bg-white min-w-[40px] text-center">{updating ? '...' : quantity}</span>
             <button 
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={updating || removing}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 transition-colors border-l border-gray-300 text-lg leading-none"
             >+</button>
          </div>
          
          <div className="border-l border-gray-300 h-4 mx-2"></div>
          <button 
             onClick={handleRemove} 
             disabled={removing}
             className="text-blue-500 hover:text-amazon-orange hover:underline"
          >
             {removing ? 'Removing...' : 'Delete'}
          </button>
          
          <div className="border-l border-gray-300 h-4 mx-2"></div>
          <span className="text-blue-500 hover:text-amazon-orange hover:underline cursor-pointer">Save for later</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
