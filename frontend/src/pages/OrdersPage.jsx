import { useState, useEffect } from 'react';
import { getOrders } from '../services/order.service';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, getCart } from '../services/cart.service';
import { setCartItems } from '../store/slices/cartSlice';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const dispatch = useDispatch();

  const handleBuyAgain = async (productId, productName) => {
    try {
      setAddingId(productId);
      await addToCart(productId, 1);
      toast.success(`${productName?.substring(0, 20) || 'Item'} added to cart`);
      const cartData = await getCart();
      dispatch(setCartItems(cartData));
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingId(null);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-medium">Your Orders</h1>
          <div className="flex-grow hidden md:flex mx-4 border border-gray-300 rounded shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-300">
             <div className="bg-gray-100 flex items-center px-4 w-full">
                <input type="text" placeholder="Search all orders" className="bg-transparent outline-none py-1.5 w-full text-sm" />
             </div>
             <button className="bg-gray-800 text-white px-4 text-sm font-medium">Search Orders</button>
          </div>
        </div>
        
        <div className="flex space-x-6 border-b border-gray-200 mb-6 text-sm">
           <span className="font-bold border-b-2 border-amazon-orange pb-2 text-black cursor-pointer">Orders</span>
        </div>

        {loading ? (
          <div className="py-10 text-center">Loading orders...</div>
        ) : orders.length === 0 ? (
           <div className="py-10">
              <h2 className="text-xl">You have no orders.</h2>
              <p className="mt-4"><Link to="/" className="text-blue-600 hover:underline">Continue shopping</Link></p>
           </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-300 rounded overflow-hidden shadow-sm">
                
                {/* Order Header */}
                <div className="bg-[#F0F2F2] flex flex-col sm:flex-row justify-between pt-3 pb-3 px-4 border-b border-gray-300 gap-4 text-sm">
                  <div className="flex sm:gap-16 gap-6 w-full sm:w-auto">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500 mb-0.5">ORDER PLACED</span>
                      <span className="text-gray-700 font-medium whitespace-nowrap">
                         {new Date(order.createdAt || new Date()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500 mb-0.5">TOTAL</span>
                      <span className="text-gray-700 font-medium">₹{order.totalPrice}</span>
                    </div>
                    <div className="flex flex-col hidden md:flex">
                      <span className="text-[11px] text-gray-500 mb-0.5">SHIP TO</span>
                      <span className="text-blue-600 hover:underline cursor-pointer">{order.shippingAddress?.split(',')[0] || 'Your Address'} ▼</span>
                    </div>
                  </div>
                  <div className="flex flex-col text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                    <span className="text-[11px] text-gray-500 mb-0.5">ORDER # {order.id.split('-')[0].toUpperCase()}</span>
                    <span className="text-blue-600 hover:underline cursor-pointer hidden md:block">View order details</span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 bg-white flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-3 text-green-700">
                      {order.status === 'Pending' ? 'Arriving Thursday' : order.status}
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                      {(order.OrderItems || []).map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <img 
                            src={item.Product?.imageUrl || 'https://dummyimage.com/100x100/cccccc/000000.png&text=Product'} 
                            alt={item.Product?.name} 
                            className="w-20 h-20 object-contain"
                          />
                          <div className="flex flex-col flex-1 pl-2">
                            <Link to={`/product/${item.productId}`} className="text-blue-600 hover:underline hover:text-amazon-orange font-medium line-clamp-2">
                              {item.Product?.name || 'Product Details Unavailable'}
                            </Link>
                            <span className="text-[12px] text-gray-500 mt-0.5">Return window closed</span>
                            <div className="mt-2 w-fit">
                               <button 
                                 onClick={() => handleBuyAgain(item.productId, item.Product?.name)}
                                 disabled={addingId === item.productId}
                                 className={`py-1 px-4 rounded shadow-sm border text-sm ${addingId === item.productId ? 'bg-yellow-200 border-yellow-300' : 'bg-amazon-yellow border-yellow-600 hover:bg-yellow-500'}`}
                               >
                                 {addingId === item.productId ? 'Adding...' : 'Buy it again'}
                               </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 mt-6 md:mt-0 flex flex-col gap-2 text-[13px] justify-center md:pl-6">
                     <button className="w-full py-1.5 border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-center bg-white">Track package</button>
                     <button className="w-full py-1.5 border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-center bg-white">Return or replace items</button>
                     <button className="w-full py-1.5 border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-center bg-white">Share gift receipt</button>
                     <button className="w-full py-1.5 border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-center bg-white">Write a product review</button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
