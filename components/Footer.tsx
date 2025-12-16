/**
 * Component Footer - Chân trang website
 * Hiển thị thông tin công ty, liên kết và bản quyền
 */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AdminSettings } from '@/lib/settings';

export default function Footer() {
  const currentYear = new Date().getFullYear();
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
  });
  const phoneNumber = (settings.phone || '0123456789').replace(/\D/g, '') || '0123456789';
  const zaloLink = `https://zalo.me/${phoneNumber}`;
  const address = settings.address || '123 Đường ABC, Quận XYZ, TP.HCM';
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          const base = data.settings.primaryColor || '#d4af37';
          document.documentElement.style.setProperty('--primary-color', base);
          
          // Áp dụng theme
          const theme = data.settings.theme || 'light';
          if (theme === 'auto') {
            // Tự động theo hệ thống
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            // Lắng nghe thay đổi
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
              document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            };
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
          } else {
            document.documentElement.setAttribute('data-theme', theme);
          }
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <footer className="luxury-gradient-dark text-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 luxury-gradient rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {settings.logo ? (
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                    style={{
                      transform: `translate(${settings.logoOffsetX || 0}%, ${settings.logoOffsetY || 0}%) scale(${settings.logoScale || 1})`,
                    }}
                  />
                ) : (
                  <span className="text-white font-bold text-xl sm:text-2xl">CND</span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight group-hover:text-primary-300 transition-colors">Cổng Nhôm Đúc Hùng Phát</h3>
            </Link>
            <p className="mb-4 sm:mb-6 text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
              Chuyên cung cấp cổng nhôm đúc, hàng rào nhôm đúc và các dịch vụ thi công 
              uy tín, chất lượng cao với nhiều năm kinh nghiệm trong ngành.
            </p>
            <div className="space-y-3">
              {/* Địa chỉ */}
              {settings.contactInfo?.addresses && settings.contactInfo.addresses.length > 0 ? (
                <div className="space-y-2">
                  {settings.contactInfo.addresses.map((addr) => {
                    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.address)}`;
                    return (
                      <a
                        key={addr.id}
                        href={mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer group"
                      >
                        <span className="text-xl mt-0.5">📍</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white">
                              {addr.type === 'factory' ? '🏭 Nhà máy' : '🏪 Showroom'}
                            </span>
                            {addr.label && (
                              <span className="text-xs text-gray-400">{addr.label}</span>
                            )}
                          </div>
                          <span className="group-hover:underline text-sm">{addr.address}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <a 
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer group"
                >
                  <span className="text-xl">📍</span>
                  <span className="group-hover:underline">{address}</span>
                </a>
              )}

              {/* Số điện thoại */}
              {settings.contactInfo?.phones && settings.contactInfo.phones.length > 0 ? (
                <div className="space-y-2">
                  {settings.contactInfo.phones.map((phone) => {
                    const phoneNum = phone.number.replace(/\D/g, '');
                    const zaloLink = `https://zalo.me/${phoneNum}`;
                    return (
                      <div key={phone.id} className="flex items-center space-x-3 text-gray-300">
                        <span className="text-xl">📞</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={`tel:${phoneNum}`}
                              className="hover:text-primary-300 font-medium text-sm"
                            >
                              {phone.number}
                            </a>
                            {phone.label && (
                              <span className="text-xs text-gray-400">({phone.label})</span>
                            )}
                          </div>
                          <a
                            href={zaloLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-primary-300 mt-0.5 block"
                          >
                            Zalo: {phone.number}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <span className="text-xl">📞</span>
                  <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 font-medium">
                    {settings.phone || '0123.456.789'}
                  </a>
                </p>
              )}

              {/* Email */}
              <p className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">✉️</span>
                <a href={`mailto:${settings.contactInfo?.email || settings.email || 'info@congnhomduc.com'}`} className="hover:text-primary-300 font-medium">
                  {settings.contactInfo?.email || settings.email || 'info@congnhomduc.com'}
                </a>
              </p>

              {/* Zalo và Facebook (nếu có) */}
              {settings.contactInfo?.zalo && (
                <p className="flex items-center space-x-3 text-gray-300">
                  <span className="text-xl">💬</span>
                  <a
                    href={settings.contactInfo.zalo.startsWith('http') ? settings.contactInfo.zalo : `https://zalo.me/${settings.contactInfo.zalo.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-300 font-medium text-sm"
                  >
                    Zalo: {settings.contactInfo.zalo}
                  </a>
                </p>
              )}
              {settings.contactInfo?.facebook && (
                <p className="flex items-center space-x-3 text-gray-300">
                  <span className="text-xl">📘</span>
                  <a
                    href={settings.contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-300 font-medium text-sm"
                  >
                    Facebook
                  </a>
                </p>
              )}

              {/* Giờ làm việc */}
              {settings.contactInfo?.workingHours && (
                <div className="flex items-start space-x-3 text-gray-300">
                  <span className="text-xl mt-0.5">🕒</span>
                  <div className="text-sm">
                    <p>{settings.contactInfo.workingHours.weekdays || 'Thứ 2 - Thứ 6: 8:00 - 17:30'}</p>
                    <p>{settings.contactInfo.workingHours.saturday || 'Thứ 7: 8:00 - 12:00'}</p>
                    <p>{settings.contactInfo.workingHours.sunday || 'Chủ nhật: Nghỉ'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Liên kết nhanh</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/dich-vu" className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/bao-gia" className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Báo giá
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6">Dịch vụ</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-300 hover:text-primary-300 transition-colors duration-300 cursor-pointer flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Thiết kế cổng nhôm đúc
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-primary-300 transition-colors duration-300 cursor-pointer flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Sản xuất cổng nhôm đúc
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-primary-300 transition-colors duration-300 cursor-pointer flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Lắp đặt cổng nhôm đúc
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-primary-300 transition-colors duration-300 cursor-pointer flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Bảo hành & Bảo trì
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            &copy; {currentYear} <span className="text-white font-semibold">Cổng Nhôm Đúc</span>. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}

