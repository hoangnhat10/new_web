/**
 * Trang chủ - Homepage
 * Hiển thị banner, giới thiệu, sản phẩm nổi bật và thông tin công ty
 */
import React from 'react';
import Link from 'next/link';
import { readAllProducts } from '@/lib/products';
import { readAllProjects } from '@/lib/projects';
import ProjectsCarousel from '@/components/ProjectsCarousel';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await readAllProducts();
  const featuredProducts = products.slice(0, 3);
  const projects = await readAllProjects();

  return (
    <div className="overflow-hidden">
      {/* Hero Banner */}
      <section className="relative luxury-gradient-dark text-white py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl animate-fade-in-up">
            <div className="inline-block mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-xs sm:text-sm font-medium">✨ Sản phẩm cao cấp - Dịch vụ chuyên nghiệp</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="block">Cổng Nhôm Đúc Hùng Phát</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-100">
                Chất Lượng Cao
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 text-gray-200 leading-relaxed">
              Chuyên cung cấp cổng nhôm đúc, hàng rào nhôm đúc và các dịch vụ thi công 
              uy tín với nhiều năm kinh nghiệm trong ngành.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/san-pham"
                className="bg-white text-primary-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 text-center shadow-lg text-sm sm:text-base"
              >
                Xem Sản Phẩm →
              </Link>
              <Link
                href="/bao-gia"
                className="bg-transparent border-2 border-white/50 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-white/10 hover:border-white hover:scale-105 active:scale-95 transition-all duration-300 text-center backdrop-blur-sm text-sm sm:text-base"
              >
                Yêu Cầu Báo Giá
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 text-center">
              Công Trình Tiêu Biểu
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-left sm:text-center leading-relaxed">
              Tại Hùng Phát, chúng tôi không ngừng tìm kiếm và áp dụng các công nghệ tiên tiến nhất để tạo ra những sản phẩm vượt trội về chất lượng và thiết kế. Đội ngũ nghệ nhân tài năng của chúng tôi không chỉ là những người thợ lành nghề, mà còn là những nghệ sĩ đam mê, biết cách làm cho mỗi sản phẩm trở nên độc đáo và tinh tế.
            </p>
          </div>
          {projects.length > 0 ? (
            <ProjectsCarousel projects={projects} />
          ) : (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-5xl sm:text-6xl mb-4">🏗️</div>
              <p className="text-gray-600 text-lg sm:text-xl font-medium">Chưa có công trình nào được thêm vào.</p>
              <p className="text-gray-500 text-sm sm:text-base mt-2">Vui lòng thêm công trình từ trang Admin.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Tại Sao Chọn Chúng Tôi
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 luxury-gradient mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover-lift group">
              <div className="w-20 h-20 luxury-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Chất Lượng Cao</h3>
              <p className="text-gray-600 leading-relaxed">
                Sản phẩm được sản xuất từ nhôm đúc hợp kim cao cấp, đảm bảo độ bền và tính thẩm mỹ vượt trội.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover-lift group">
              <div className="w-20 h-20 luxury-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Lắp Đặt Nhanh</h3>
              <p className="text-gray-600 leading-relaxed">
                Đội ngũ kỹ thuật chuyên nghiệp, lắp đặt nhanh chóng, đúng tiến độ cam kết.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover-lift group">
              <div className="w-20 h-20 luxury-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Bảo Hành Dài Hạn</h3>
              <p className="text-gray-600 leading-relaxed">
                Bảo hành lên đến 5 năm, hỗ trợ bảo trì và sửa chữa trong suốt quá trình sử dụng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">Sản Phẩm Nổi Bật</h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl px-4">
              Những sản phẩm được yêu thích nhất của chúng tôi
            </p>
            <div className="w-16 sm:w-20 md:w-24 h-1 luxury-gradient mx-auto rounded-full mt-3 sm:mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/san-pham/${product.id}`}
                className="block bg-white rounded-2xl shadow-lg overflow-hidden hover-zoom group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-72 luxury-gradient flex items-center justify-center relative overflow-hidden">
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
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Premium</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                  <div className="pt-4 border-t border-gray-100">
                    <span className="luxury-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md inline-block">
                      Xem chi tiết
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10 sm:mt-12 md:mt-16">
            <Link
              href="/san-pham"
              className="inline-block luxury-gradient text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-sm sm:text-base"
            >
              Xem Tất Cả Sản Phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section 2 - Slide công trình tiêu biểu bổ sung */}
      {projects.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 text-center">
                Công Trình Nổi Bật
              </h2>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-left sm:text-center leading-relaxed">
                Khám phá thêm những công trình ấn tượng khác của chúng tôi, được thiết kế và thi công với sự tỉ mỉ và chuyên nghiệp.
              </p>
            </div>
            <ProjectsCarousel projects={projects} />
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 luxury-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 animate-fade-in-up">Về Chúng Tôi</h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-white/30 mx-auto rounded-full mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-6 leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.1s' }}>
              Với nhiều năm kinh nghiệm trong lĩnh vực sản xuất và thi công cổng nhôm đúc, 
              chúng tôi tự hào là đơn vị uy tín, chuyên nghiệp hàng đầu tại Việt Nam.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-10 md:mb-12 leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.2s' }}>
              Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao, 
              thiết kế đẹp mắt và dịch vụ chăm sóc khách hàng tận tâm.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12 md:mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-100 mb-2 sm:mb-3">500+</div>
                <div className="text-gray-200 font-medium text-sm sm:text-base">Dự án đã hoàn thành</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-100 mb-2 sm:mb-3">10+</div>
                <div className="text-gray-200 font-medium text-sm sm:text-base">Năm kinh nghiệm</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-100 mb-2 sm:mb-3">100%</div>
                <div className="text-gray-200 font-medium text-sm sm:text-base">Khách hàng hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

