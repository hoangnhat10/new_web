/**
 * Client component: lọc danh mục và hiển thị sản phẩm
 */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';

type Props = {
  products: Product[];
  categories: string[];
};

export default function ProductsClient({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Tất cả') return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Sản Phẩm Cổng Nhôm Đúc</h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm cổng nhôm đúc đa dạng của chúng tôi
          </p>
          <div className="w-24 h-1 luxury-gradient mx-auto rounded-full mt-4"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'luxury-gradient text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/san-pham/${product.id}`}
              className="block bg-white rounded-2xl shadow-lg overflow-hidden hover-zoom group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative luxury-gradient aspect-[4/3] flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 bg-white/50"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-300">🚪</span>
                  </>
                )}
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wide bg-primary-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Kích thước:</span> {product.specifications.size}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Chất liệu:</span> {product.specifications.material}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="luxury-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md">
                    Xem chi tiết
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-xl font-medium">Không tìm thấy sản phẩm nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}

