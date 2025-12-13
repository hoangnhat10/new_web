/**
 * Trang Chi tiết Sản phẩm - Product Detail Page
 * Hiển thị thông tin chi tiết về một sản phẩm cụ thể
 */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readAllProducts, readProductById } from '@/lib/products';
import { readSettings } from '@/lib/settings';
import { Product } from '@/data/products';
import ProductGallery from '@/components/ProductGallery';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = (await readProductById(params.id)) as Product | undefined;
  const allProducts = await readAllProducts();
  const related = allProducts.filter((p) => p.id !== params.id).slice(0, 4);
  const settings = await readSettings();
  const phoneNumber = (settings.phone || '0123456789').replace(/\D/g, '') || '0123456789';
  const telHref = `tel:${phoneNumber}`;

  if (!product) {
    notFound();
  }

  const specs = product.specifications || {
    material: '',
    size: '',
    weight: '',
    warranty: '',
  };

  return (
    <div className="py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8 text-xs sm:text-sm overflow-x-auto">
          <ol className="flex items-center space-x-2 text-gray-600 whitespace-nowrap">
            <li><Link href="/" className="hover:text-primary-600">Trang chủ</Link></li>
            <li>/</li>
            <li><Link href="/san-pham" className="hover:text-primary-600">Sản phẩm</Link></li>
            <li>/</li>
            <li className="text-gray-900 truncate max-w-[150px] sm:max-w-none">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.gallery && product.gallery.length ? product.gallery : [product.image].filter(Boolean)} />
          </div>

          {/* Product Info */}
          <div>
            <span className="text-xs sm:text-sm text-primary-600 font-medium">{product.category}</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 mt-2">{product.name}</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">{product.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="font-medium">Chất liệu:</span>
                  <span className="text-right">{specs.material}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="font-medium">Kích thước:</span>
                  <span className="text-right">{specs.size}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="font-medium">Trọng lượng:</span>
                  <span className="text-right">{specs.weight}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="font-medium">Bảo hành:</span>
                  <span className="text-right">{specs.warranty}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Link
                href="/bao-gia"
                className="flex-1 bg-primary-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-700 active:scale-95 transition-all duration-200 text-center text-sm sm:text-base"
              >
                Yêu Cầu Báo Giá
              </Link>
              <Link
                href={telHref}
                className="flex-1 bg-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-300 active:scale-95 transition-all duration-200 text-center text-sm sm:text-base"
              >
                Liên Hệ Tư Vấn
              </Link>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Đặc điểm nổi bật</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 mt-10 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sản phẩm tham khảo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/san-pham/${item.id}`}
                className="block bg-white rounded-xl shadow hover-zoom overflow-hidden"
              >
                <div className="relative luxury-gradient aspect-[4/3] flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-4 bg-white/50" />
                  ) : (
                    <span className="text-6xl">🚪</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-primary-600 uppercase mb-2">{item.category}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-gray-500 text-sm">Liên hệ để được tư vấn</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

