const Footer = () => {
  return (
    <footer className="bg-amazon-light text-white text-sm">
      <div className="flex justify-center py-4 bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors" onClick={() => window.scrollTo(0, 0)}>
        Back to top
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-10 max-w-7xl mx-auto">
        <div>
          <h3 className="font-bold mb-3">Get to Know Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Careers</li>
            <li className="hover:underline cursor-pointer">Blog</li>
            <li className="hover:underline cursor-pointer">About Amazon</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-3">Make Money with Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Sell products on Amazon</li>
            <li className="hover:underline cursor-pointer">Become an Affiliate</li>
            <li className="hover:underline cursor-pointer">Advertise Your Products</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-3">Amazon Payment Products</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Amazon Business Card</li>
            <li className="hover:underline cursor-pointer">Shop with Points</li>
            <li className="hover:underline cursor-pointer">Reload Your Balance</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Amazon and COVID-19</li>
            <li className="hover:underline cursor-pointer">Your Account</li>
            <li className="hover:underline cursor-pointer">Your Orders</li>
            <li className="hover:underline cursor-pointer">Shipping Rates & Policies</li>
            <li className="hover:underline cursor-pointer">Help</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-600 py-6 flex flex-col items-center">
        <div className="text-2xl font-bold mb-4 tracking-tighter">amazon</div>
        <div className="flex space-x-4 text-xs text-center text-gray-400">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span className="hover:underline cursor-pointer">Consumer Health Data Privacy Disclosure</span>
          <span className="hover:underline cursor-pointer">Your Ads Privacy Choices</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
};

export default Footer;
