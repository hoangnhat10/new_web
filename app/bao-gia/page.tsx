/**
 * Trang Báo giá - Quote Request Page
 * Form để khách hàng yêu cầu báo giá sản phẩm và dịch vụ
 * Gửi email qua Gmail khi submit
 */
'use client';

import { useState, useEffect } from 'react';
import type { AdminSettings } from '@/lib/settings';

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    productType: '',
    size: '',
    message: ''
  });

  const [images, setImages] = useState<{ name: string; data: string; size: number }[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({
    logo: '',
    primaryColor: '#d97706',
    address: '',
    phone: '0123.456.789',
    email: 'info@congnhomduc.com',
    logoScale: 1,
    logoOffsetX: 0,
    logoOffsetY: 0,
    blogEnabled: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImagesChange = (files?: FileList | null) => {
    if (!files || !files.length) return;
    const list = Array.from(files);
    Promise.all(
      list.map(
        (file) =>
          new Promise<{ name: string; data: string; size: number }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, data: String(reader.result || ''), size: file.size });
            reader.readAsDataURL(file);
          })
      )
    ).then((imgs) => setImages((prev) => [...prev, ...imgs]));
  };

  const handleRemoveImage = (name: string) => {
    setImages((prev) => prev.filter((img) => img.name !== name));
  };

  const getProductTypeLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      'cong-nhom-duc': 'Cổng nhôm đúc',
      'hang-rao-nhom-duc': 'Hàng rào nhôm đúc',
      'cong-va-hang-rao': 'Cổng và hàng rào',
      'khac': 'Khác'
    };
    return labels[value] || value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tạo nội dung email
    const recipientEmail = settings.email || 'info@congnhomduc.com';
    const subject = `Yêu cầu báo giá - ${formData.name}`;
    const imagesText =
      images.length === 0
        ? 'Chưa đính kèm ảnh.'
        : `Ảnh tham khảo (${images.length}):\n${images
            .map((img) => `- ${img.name} (${Math.round(img.size / 1024)} KB): vui lòng đính kèm ảnh này trong email.`)
            .join('\n')}\n`;
    const body = `Kính chào quý công ty,

Tôi tên là: ${formData.name}
Số điện thoại: ${formData.phone}
${formData.email ? `Email: ${formData.email}` : ''}

Địa chỉ lắp đặt: ${formData.address}
Loại sản phẩm: ${getProductTypeLabel(formData.productType)}
${formData.size ? `Kích thước ước tính: ${formData.size}` : ''}

${formData.message ? `Yêu cầu thêm:\n${formData.message}` : ''}

${imagesText}

Xin cảm ơn!`;

    // Tạo mailto link
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${formData.email ? `&cc=${encodeURIComponent(formData.email)}` : ''}`;
    
    // Mở Gmail
    window.location.href = mailtoLink;
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Yêu Cầu Báo Giá</h1>
            <p className="text-gray-600 text-lg">
              Điền thông tin vào form bên dưới, chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất
            </p>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">📧 Gửi email qua Gmail</p>
            <p className="text-sm">Sau khi điền form và nhấn &quot;Gửi Yêu Cầu Báo Giá&quot;, email của bạn sẽ được mở với nội dung đã điền sẵn.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0123.456.789"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nhập địa chỉ lắp đặt"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="productType" className="block text-gray-700 font-medium mb-2">
                  Loại sản phẩm <span className="text-red-500">*</span>
                </label>
                <select
                  id="productType"
                  name="productType"
                  required
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Chọn loại sản phẩm</option>
                  <option value="cong-nhom-duc">Cổng nhôm đúc</option>
                  <option value="hang-rao-nhom-duc">Hàng rào nhôm đúc</option>
                  <option value="cong-va-hang-rao">Cổng và hàng rào</option>
                  <option value="khac">Khác</option>
                </select>
              </div>
              <div>
                <label htmlFor="size" className="block text-gray-700 font-medium mb-2">
                  Kích thước (ước tính)
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="VD: 4m x 2.5m"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Yêu cầu thêm (nếu có)
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nhập yêu cầu hoặc thông tin bổ sung..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Ảnh tham khảo (có thể chọn nhiều ảnh)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImagesChange(e.target.files)}
                className="block w-full text-sm text-gray-700"
              />
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <div key={img.name} className="relative border rounded-lg overflow-hidden">
                      <img src={img.data} alt={img.name} className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 text-red-600 text-xs px-2 py-1 rounded"
                        onClick={() => handleRemoveImage(img.name)}
                      >
                        X
                      </button>
                      <div className="text-[11px] text-gray-600 px-2 py-1 truncate">{img.name}</div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Lưu ý: Email sẽ mở với nội dung đã điền, vui lòng đính kèm các ảnh này trong email nếu cần.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Gửi Yêu Cầu Báo Giá
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Hoặc liên hệ trực tiếp:</h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center">
                <span className="mr-2">📞</span>
                <a href={`tel:${(settings.phone || '0123456789').replace(/\D/g, '')}`} className="hover:text-primary-600">
                  {settings.phone || '0123.456.789'}
                </a>
              </p>
              <p className="flex items-center">
                <span className="mr-2">✉️</span>
                <a href={`mailto:${settings.email || 'info@congnhomduc.com'}`} className="hover:text-primary-600">
                  {settings.email || 'info@congnhomduc.com'}
                </a>
              </p>
              <p className="flex items-center">
                <span className="mr-2">📍</span>
                <span>{settings.address || '123 Đường ABC, Quận XYZ, TP.HCM'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

