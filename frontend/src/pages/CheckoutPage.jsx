import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../services/order.service';
import { setCartItems } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const { items: cartItems, totalPrice: cartTotalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // If coming from "Buy Now", use only that item; otherwise use the full cart
  const buyNowItem = location.state?.buyNowItem || null;
  const items = buyNowItem ? [buyNowItem] : cartItems;
  const totalPrice = buyNowItem
    ? (parseFloat(buyNowItem.Product.price) * buyNowItem.quantity).toFixed(2)
    : cartTotalPrice;

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!shippingAddress.fullName || !shippingAddress.streetAddress || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const formattedAddress = `${shippingAddress.fullName}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}, ${shippingAddress.country}`;

    try {
      setPlacingOrder(true);
      
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price
      }));

      const orderData = {
        shippingAddress: formattedAddress,
        items: orderItems,
        totalPrice: Number(totalPrice).toFixed(2)
      };

      const response = await createOrder(orderData);

      // Only clear cart if this was a normal cart checkout
      if (!buyNowItem) {
        dispatch(setCartItems([]));
      }
      navigate('/order-success', { state: { orderId: response.id } }); // Redirect with ID
    } catch (error) {
       toast.error('Failed to process checkout. Please try again.');
    } finally {
       setPlacingOrder(false);
    }
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const tax = Number(totalPrice) * 0.08;
  const orderTotal = Number(totalPrice) + tax;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-amazon-dark border-b border-gray-300 shadow-sm py-4 mb-8">
         <div className="max-w-[1000px] mx-auto text-center relative">
            <h1 className="text-3xl font-medium text-white">Checkout</h1>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-[1000px] mx-auto gap-6 px-4 pb-12">
        {/* Left Column - Forms */}
        <div className="flex-grow flex flex-col gap-6">
          
          {/* Shipping Address Block */}
          <div className="bg-white p-6 shadow-sm border border-gray-200">
             <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-amazon-orange">
               <span className="text-gray-800">1.</span> Shipping Address
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                   <label className="block text-sm font-medium mb-1">Full Name</label>
                   <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_0_2px_rgba(240,193,75,0.5)]" />
                </div>
                <div className="col-span-1 md:col-span-2">
                   <label className="block text-sm font-medium mb-1">Street Address</label>
                   <input type="text" name="streetAddress" value={shippingAddress.streetAddress} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_0_2px_rgba(240,193,75,0.5)]" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">City</label>
                   <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_0_2px_rgba(240,193,75,0.5)]" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">State</label>
                   <input type="text" name="state" value={shippingAddress.state} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_0_2px_rgba(240,193,75,0.5)]" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">ZIP Code</label>
                   <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-amazon-orange focus:shadow-[0_0_0_2px_rgba(240,193,75,0.5)]" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Country</label>
                   <input type="text" readOnly name="country" value={shippingAddress.country} className="w-full border border-gray-300 rounded px-3 py-2 outline-none bg-gray-50 text-gray-500" />
                </div>
             </div>
          </div>

          {/* Payment Method Block */}
          <div className="bg-white p-6 shadow-sm border border-gray-200">
             <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-amazon-orange">
               <span className="text-gray-800">2.</span> Payment Method
             </h2>
             <div className="border border-amazon-orange bg-[#fcf4e6] p-4 rounded-sm flex items-start gap-3">
                <input type="radio" checked readOnly className="mt-1 accent-amazon-orange" />
                <div>
                   <p className="font-bold">Demo Payment (No real charge)</p>
                   <p className="text-sm text-gray-500">This is a demo — no payment is processed</p>
                </div>
             </div>
          </div>
          
        </div>

        {/* Right Column - Order Summary Box */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-sm sticky top-24">
             <button 
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full bg-amazon-yellow focus:ring-2 focus:ring-yellow-500 hover:bg-yellow-500 border border-yellow-600 rounded py-2 shadow-sm text-sm"
             >
                {placingOrder ? 'Processing...' : 'Place your order'}
             </button>
             <p className="text-xs text-gray-500 mt-2 text-center border-b border-gray-200 pb-4 mb-4">
                By placing your order, you agree to our terms and conditions. This is a demo application.
             </p>
             
             <h3 className="font-bold text-lg mb-2">Order Summary</h3>
             
             {/* All cart items */}
             <div className="flex flex-col gap-3 mb-4 border-b border-gray-200 pb-3 max-h-52 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                   <div key={idx} className="flex items-center gap-2">
                     <img
                       src={item.Product?.imageUrl || 'https://dummyimage.com/50'}
                       alt={item.Product?.name}
                       className="w-10 h-10 object-contain flex-shrink-0"
                     />
                     <div className="text-xs leading-snug flex-1 min-w-0">
                        <p className="truncate font-medium">{item.Product?.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                     </div>
                     <div className="font-medium text-xs whitespace-nowrap">₹{(parseFloat(item.Product?.price) * item.quantity).toFixed(2)}</div>
                   </div>
                ))}
             </div>

             <div className="space-y-1 text-sm pb-2 border-b border-gray-200 mb-2">
                <div className="flex justify-between">
                   <span>Items:</span>
                   <span>₹{Number(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                   <span>Tax (8%):</span>
                   <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                   <span>Shipping:</span>
                   <span className="text-green-600 font-medium">FREE</span>
                </div>
             </div>
             
             <div className="flex justify-between font-bold text-xl text-[#B12704] mt-2 mb-2">
                <span>Order Total:</span>
                <span>₹{orderTotal.toFixed(2)}</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
