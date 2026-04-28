import React from 'react';
import { ShoppingCart, Tag } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
        <Tag className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full text-sm font-bold text-primary-600 shadow-sm">
          ${product.price}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
          {product.description || "No description available for this amazing product."}
        </p>
        
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 active:scale-95 transition-all"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
