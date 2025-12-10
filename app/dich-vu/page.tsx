/**
 * Trang Dịch vụ - Services Page
 * Hiển thị các dịch vụ mà công ty cung cấp
 */
import React from 'react';
import Link from 'next/link';

const services = [
  {
    id: 1,
    title: 'Thiết Kế Cổng Nhôm Đúc',
    description: 'Đội ngũ thiết kế chuyên nghiệp sẽ tư vấn và thiết kế cổng nhôm đúc phù hợp với kiến trúc và không gian của bạn.',
    icon: '🎨',
    features: [
      'Tư vấn thiết kế miễn phí',
      'Bản vẽ 3D chi tiết',
      'Nhiều mẫu thiết kế đa dạng',
      'Thiết kế theo yêu cầu'
    ]
  },
  {
    id: 2,
    title: 'Sản Xuất Cổng Nhôm Đúc',
    description: 'Sản xuất cổng nhôm đúc với công nghệ hiện đại, đảm bảo chất lượng và độ bền cao.',
    icon: '🏭',
    features: [
      'Nhà máy sản xuất hiện đại',
      'Chất liệu nhôm đúc cao cấp',
      'Quy trình kiểm tra chất lượng nghiêm ngặt',
      'Sản xuất theo đúng tiến độ'
    ]
  },
  {
    id: 3,
    title: 'Lắp Đặt Cổng Nhôm Đúc',
    description: 'Đội ngũ kỹ thuật chuyên nghiệp, giàu kinh nghiệm sẽ lắp đặt cổng nhôm đúc nhanh chóng, chính xác.',
    icon: '🔧',
    features: [
      'Đội ngũ kỹ thuật chuyên nghiệp',
      'Lắp đặt nhanh chóng, đúng tiến độ',
      'Đảm bảo an toàn trong quá trình thi công',
      'Nghiệm thu và bàn giao đầy đủ'
    ]
  },
  {
    id: 4,
    title: 'Bảo Hành & Bảo Trì',
    description: 'Dịch vụ bảo hành và bảo trì chuyên nghiệp, đảm bảo sản phẩm luôn hoạt động tốt.',
    icon: '🛡️',
    features: [
      'Bảo hành lên đến 5 năm',
      'Bảo trì định kỳ',
      'Sửa chữa nhanh chóng',
      'Hỗ trợ 24/7'
    ]
  },
  {
    id: 5,
    title: 'Tư Vấn Kỹ Thuật',
    description: 'Tư vấn kỹ thuật miễn phí về cổng nhôm đúc, giúp khách hàng lựa chọn sản phẩm phù hợp nhất.',
    icon: '💡',
    features: [
      'Tư vấn miễn phí',
      'Khảo sát tận nơi',
      'Tư vấn chọn mẫu phù hợp',
      'Hỗ trợ giải đáp mọi thắc mắc'
    ]
  },
  {
    id: 6,
    title: 'Vận Chuyển & Giao Hàng',
    description: 'Dịch vụ vận chuyển và giao hàng an toàn, đảm bảo sản phẩm đến tay khách hàng nguyên vẹn.',
    icon: '🚚',
    features: [
      'Vận chuyển toàn quốc',
      'Đóng gói cẩn thận',
      'Giao hàng đúng hẹn',
      'Miễn phí vận chuyển trong nội thành'
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Dịch Vụ Của Chúng Tôi</h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Chúng tôi cung cấp đầy đủ các dịch vụ từ thiết kế, sản xuất đến lắp đặt và bảo hành 
            cổng nhôm đúc với chất lượng cao và dịch vụ chuyên nghiệp.
          </p>
          <div className="w-24 h-1 luxury-gradient mx-auto rounded-full mt-4"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-lg p-8 hover-zoom group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 luxury-gradient rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">{service.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-primary-600 transition-colors">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                    <span className="text-primary-600 mr-3 mt-1">✓</span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="luxury-gradient-dark rounded-3xl p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Bạn Cần Tư Vấn?</h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Liên hệ ngay với chúng tôi để được tư vấn miễn phí và nhận báo giá tốt nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lien-he"
                className="bg-white text-primary-700 px-10 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Liên Hệ Ngay →
              </Link>
              <Link
                href="/bao-gia"
                className="bg-transparent border-2 border-white/50 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                Yêu Cầu Báo Giá
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
