/**
 * Trang Liên hệ - Contact Page
 * Hiển thị thông tin liên hệ
 */
'use client';

import { useState, useEffect } from 'react';
import type { AdminSettings } from '@/lib/settings';

export default function ContactPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    logo: '',
    primaryColor: '#d97706',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
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

  const address = settings.address || '123 Đường ABC, Quận XYZ, TP.HCM';
  const phoneNumber = (settings.phone || '0123456789').replace(/\D/g, '') || '0123456789';
  const zaloLink = `https://zalo.me/${phoneNumber}`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-gray-600 text-lg">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi ngay hôm nay!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Thông Tin Liên Hệ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Địa chỉ</h3>
                  <a 
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {address}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Điện thoại</h3>
                  <a href={`tel:${phoneNumber}`} className="text-primary-600 hover:text-primary-700 hover:underline block">
                    {settings.phone || '0123.456.789'}
                  </a>
                  <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 hover:underline">
                    Zalo: {settings.phone || '0123.456.789'}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">✉️</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href={`mailto:${settings.email || 'info@congnhomduc.com'}`} className="text-primary-600 hover:text-primary-700 hover:underline">
                    {settings.email || 'info@congnhomduc.com'}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">🕒</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Giờ làm việc</h3>
                  <p className="text-gray-600">
                    Thứ 2 - Thứ 6: 8:00 - 17:30<br />
                    Thứ 7: 8:00 - 12:00<br />
                    Chủ nhật: Nghỉ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Bản đồ sẽ được hiển thị ở đây</p>
          </div>
        </div>
      </div>
    </div>
  );
}

