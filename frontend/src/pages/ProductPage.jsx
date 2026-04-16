import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/product.service';
import { addToCart, getCart } from '../services/cart.service';
import { setCartItems } from '../store/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setActiveImage(data.imageUrl);
      } catch (error) {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, Number(quantity));
      toast.success(`${product.name.substring(0, 20)}... added to cart`);
      const cartData = await getCart();
      dispatch(setCartItems(cartData));
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to buy');
      navigate('/login');
      return;
    }
    // Navigate directly to checkout with this product as route state.
    // The cart is NOT modified.
    navigate('/checkout', {
      state: {
        buyNowItem: {
          productId: product.id,
          quantity: Number(quantity),
          Product: {
            name: product.name,
            price: product.price,
            imageUrl: activeImage || product.imageUrl,
          },
        },
      },
    });
  };

  if (loading) return <div className="text-center py-20">Loading product...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const rating = product.rating || 4;
  const reviews = product.numReviews || 120;

  // Safely parse images - MySQL sometimes returns JSON as a string
  let allImages = [product.imageUrl];
  try {
    if (product.images) {
      const parsed = typeof product.images === 'string'
        ? JSON.parse(product.images)
        : product.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        allImages = parsed;
      }
    }
  } catch (e) {
    allImages = [product.imageUrl];
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-4">

        {/* Col 1 - Vertical Thumbnail Strip */}
        <div className="hidden md:flex flex-col gap-2 pt-1 w-16 flex-shrink-0 sticky top-24 h-fit">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveImage(img)}
              onClick={() => setActiveImage(img)}
              className={`w-14 h-14 border-2 rounded p-0.5 flex-shrink-0 transition-all bg-white ${
                activeImage === img
                  ? 'border-amazon-orange shadow-sm'
                  : 'border-gray-200 hover:border-gray-500'
              }`}
            >
              <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>

        {/* Col 2 - Main Image */}
        <div className="w-full md:w-72 flex-shrink-0 flex justify-center items-start sticky top-24 h-fit">
          <img
            src={activeImage || product.imageUrl}
            alt={product.name}
            className="w-full max-h-[420px] object-contain transition-all duration-200"
          />
        </div>

        {/* Col 3 - Product Details */}
        <div className="flex-1 flex flex-col pt-1 border-r border-gray-200 pr-5 min-w-0">
          <h1 className="text-xl font-medium leading-snug mb-1">{product.name}</h1>
          <p className="text-sm text-blue-500 mb-2 hover:underline cursor-pointer">Visit the {product.brand} Store</p>

          <div className="flex border-b border-gray-200 pb-2 mb-3 items-center gap-2">
            <div className="flex items-center text-sm">
              <span className="mr-1 text-gray-700">{rating}</span>
              {Array(5).fill(null).map((_, i) => (
                <span key={i} className={i < Math.round(rating) ? "text-yellow-500" : "text-gray-300"}>★</span>
              ))}
            </div>
            <span className="text-blue-500 text-sm hover:underline cursor-pointer">{reviews.toLocaleString()} ratings</span>
          </div>

          <div className="mb-4 border-b border-gray-200 pb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-red-600">-10%</span>
              <span className="text-3xl font-medium text-gray-900">
                <span className="text-lg font-normal">₹</span>{product.price}
              </span>
            </div>
            <p className="text-sm text-gray-500">M.R.P.: <span className="line-through">₹{(parseFloat(product.price) * 1.1).toFixed(2)}</span></p>
            <p className="text-sm font-medium mt-0.5">Inclusive of all taxes</p>
            <p className="text-sm mt-0.5"><span className="font-bold">EMI</span> starts at ₹99. No Cost EMI available.</p>
          </div>

          <div className="text-sm">
            <h3 className="font-bold mb-2">About this item</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-800 leading-relaxed">
              {product.description.split('. ').filter(s => s.trim()).map((point, index) => (
                <li key={index}>{point.trim()}{point.trim().endsWith('.') ? '' : '.'}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Col 4 - Buy Box */}
        <div className="w-full md:w-56 flex-shrink-0 border border-gray-300 rounded p-4 h-fit sticky top-24">
          <h2 className="text-2xl font-medium text-gray-900 mb-1">₹{product.price}</h2>
          <p className="text-sm text-blue-500 hover:underline cursor-pointer mb-1">FREE delivery</p>
          <p className="text-sm text-green-700 font-medium my-3">In stock</p>

          <div className="my-3 flex items-center gap-2">
            <span className="text-sm text-gray-700">Quantity:</span>
            <select
              className="bg-gray-100 border border-gray-300 rounded px-2 py-1 shadow-sm text-sm w-16 outline-none hover:bg-gray-200 cursor-pointer"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="bg-amazon-yellow hover:bg-yellow-500 w-full rounded-full py-2 text-sm shadow-sm transition-colors border border-yellow-600"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-amazon-orange hover:bg-orange-500 w-full rounded-full py-2 text-sm shadow-sm transition-colors border border-orange-600 text-white"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-600 flex flex-col gap-1.5 border-t border-gray-200 pt-3">
            <div className="flex justify-between"><span>Ships from</span><span className="font-medium">Amazon</span></div>
            <div className="flex justify-between"><span>Sold by</span><span className="font-medium">{product.brand}</span></div>
            <div className="flex justify-between"><span>Returns</span><span className="text-blue-500">Refund/Replace</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
