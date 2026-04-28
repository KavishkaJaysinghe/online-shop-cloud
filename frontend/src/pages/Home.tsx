import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Loader2, Search, SlidersHorizontal, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../api/config';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_CONFIG.PRODUCT_SERVICE}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products. Make sure your Product Service URL is correct.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-64 rounded-3xl overflow-hidden bg-primary-600 flex items-center px-12 text-white">
        <div className="z-10 max-w-lg">
          <h1 className="text-4xl font-bold mb-4">Discover Premium Products</h1>
          <p className="text-primary-100 text-lg">Shop the latest trends with our modern e-commerce experience.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-24" />
        <div className="absolute right-12 bottom-0 translate-y-4">
          <ShoppingBag className="w-48 h-48 text-white/10" />
        </div>
      </section>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-600 transition-all outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-12 rounded-3xl text-center">
          <Package className="w-16 h-16 text-red-200 dark:text-red-900/50 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-500 max-w-md mx-auto">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 p-24 rounded-3xl text-center">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No products found</h2>
          <p className="text-slate-500">Check back later for new arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
