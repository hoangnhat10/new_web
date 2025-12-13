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
    primaryColor: '#d4af37',
    theme: 'light',
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
              {/* Địa chỉ */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Địa chỉ</h3>
                  {settings.contactInfo?.addresses && settings.contactInfo.addresses.length > 0 ? (
                    <div className="space-y-3">
                      {settings.contactInfo.addresses.map((addr) => {
                        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.address)}`;
                        return (
                          <div key={addr.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold px-2 py-1 rounded bg-primary-100 text-primary-700">
                                {addr.type === 'factory' ? '🏭 Nhà máy' : '🏪 Showroom'}
                              </span>
                              {addr.label && (
                                <span className="text-sm text-gray-600">{addr.label}</span>
                              )}
                            </div>
                            <a
                              href={mapsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 hover:underline block"
                            >
                              {addr.address}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <a 
                      href={googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {address}
                    </a>
                  )}
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Điện thoại</h3>
                  {settings.contactInfo?.phones && settings.contactInfo.phones.length > 0 ? (
                    <div className="space-y-2">
                      {settings.contactInfo.phones.map((phone) => {
                        const phoneNum = phone.number.replace(/\D/g, '');
                        const zaloLink = `https://zalo.me/${phoneNum}`;
                        return (
                          <div key={phone.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={`tel:${phoneNum}`}
                                className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
                              >
                                {phone.number}
                              </a>
                              {phone.label && (
                                <span className="text-sm text-gray-600">({phone.label})</span>
                              )}
                            </div>
                            <a
                              href={zaloLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 hover:underline text-sm mt-1 block"
                            >
                              Zalo: {phone.number}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      <a href={`tel:${phoneNumber}`} className="text-primary-600 hover:text-primary-700 hover:underline block">
                        {settings.phone || '0123.456.789'}
                      </a>
                      <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 hover:underline">
                        Zalo: {settings.phone || '0123.456.789'}
                      </a>
                    </>
                  )}
                  {settings.contactInfo?.zalo && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Zalo:</span>{' '}
                        <a
                          href={settings.contactInfo.zalo.startsWith('http') ? settings.contactInfo.zalo : `https://zalo.me/${settings.contactInfo.zalo.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          {settings.contactInfo.zalo}
                        </a>
                      </p>
                    </div>
                  )}
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
                    {settings.contactInfo?.workingHours?.weekdays || 'Thứ 2 - Thứ 6: 8:00 - 17:30'}<br />
                    {settings.contactInfo?.workingHours?.saturday || 'Thứ 7: 8:00 - 12:00'}<br />
                    {settings.contactInfo?.workingHours?.sunday || 'Chủ nhật: Nghỉ'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps - Hiển thị địa chỉ đầu tiên nếu có */}
          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md" style={{ height: '400px' }}>
            {(() => {
              const firstAddress = settings.contactInfo?.addresses && settings.contactInfo.addresses.length > 0
                ? settings.contactInfo.addresses[0].address
                : address;
              return firstAddress ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(firstAddress)}&output=embed`}
                ></iframe>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Vui lòng cập nhật địa chỉ trong Admin để hiển thị bản đồ</p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

