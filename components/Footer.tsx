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
    primaryColor: '#d97706',
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
          const base = data.settings.primaryColor || '#d97706';
          document.documentElement.style.setProperty('--primary-color', base);
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
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-14 h-14 luxury-gradient rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
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
                  <span className="text-white font-bold text-lg">CND</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white">Cổng Nhôm Đúc Hùng Phát</h3>
            </div>
            <p className="mb-6 text-gray-300 leading-relaxed text-lg">
              Chuyên cung cấp cổng nhôm đúc, hàng rào nhôm đúc và các dịch vụ thi công 
              uy tín, chất lượng cao với nhiều năm kinh nghiệm trong ngành.
            </p>
            <div className="space-y-3">
              <a 
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="text-xl">📍</span>
                <span className="group-hover:underline">{address}</span>
              </a>
              <p className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">📞</span>
                <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 font-medium">
                  {settings.phone || '0123.456.789'}
                </a>
              </p>
              <p className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <span className="text-xl">✉️</span>
                <a href={`mailto:${settings.email || 'info@congnhomduc.com'}`} className="hover:text-primary-300 font-medium">{settings.email || 'info@congnhomduc.com'}</a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Liên kết nhanh</h4>
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
            <h4 className="text-white font-bold text-lg mb-6">Dịch vụ</h4>
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

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} <span className="text-white font-semibold">Cổng Nhôm Đúc</span>. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}

