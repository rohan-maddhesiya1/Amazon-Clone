import { useLocation, Link, Navigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  // Calculate estimated delivery
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(deliveryStart.getDate() + 3);
  
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(deliveryEnd.getDate() + 5);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 flex justify-center">
      <div className="bg-white w-full max-w-[600px] border border-gray-200 shadow-sm p-10 flex flex-col items-center h-fit">
         
         <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
         </div>

         <h1 className="text-2xl mb-2 text-gray-800">Order Placed!</h1>
         <p className="text-green-700 font-medium mb-6">Thank you. Your order has been placed.</p>

         <div className="bg-gray-50 w-full py-4 text-center rounded-sm mb-6 flex flex-col gap-1 border border-gray-100">
            <span className="text-sm text-gray-500">Your order ID</span>
            <span className="font-bold text-teal-700">{orderId}</span>
         </div>

         <div className="bg-[#f0f5ff] w-full p-4 mb-8 flex gap-4 items-center rounded-sm border border-blue-100">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <div className="flex flex-col text-sm">
               <span className="text-blue-900 font-medium">Estimated Delivery</span>
               <span className="text-blue-700">{formatDate(deliveryStart)} - {formatDate(deliveryEnd)}</span>
            </div>
         </div>

         <div className="flex gap-4 w-full md:w-auto">
            <Link to="/orders" className="bg-amazon-yellow focus:ring-2 focus:ring-yellow-500 hover:bg-yellow-500 border border-yellow-600 rounded px-6 py-2 shadow-sm text-sm font-medium flex-1 text-center">
               View Your Orders
            </Link>
            <Link to="/" className="bg-white hover:bg-gray-50 border border-gray-300 rounded px-6 py-2 shadow-sm text-sm font-medium flex-1 text-center">
               Continue Shopping
            </Link>
         </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
