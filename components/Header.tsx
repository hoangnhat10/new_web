/**
 * Component Header - Thanh điều hướng chính
 * Hiển thị logo, menu điều hướng và thông tin liên hệ
 */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AdminSettings } from '@/lib/settings';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    logo: '',
    primaryColor: '#d4af37',
    theme: 'light',
    address: '',
    phone: '0123.456.789',
    email: 'info@congnhomduc.com',
    logoScale: 1,
    logoOffsetX: 0,
    logoOffsetY: 0,
    blogEnabled: true,
  });
  const phoneNumber = (settings.phone || '0123456789').replace(/\D/g, '') || '0123456789';
  const zaloLink = `https://zalo.me/${phoneNumber}`;

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

  const navItems = [
    { href: '/', label: 'Trang chủ' },
    { href: '/san-pham', label: 'Sản phẩm' },
    { href: '/dich-vu', label: 'Dịch vụ' },
    ...(settings.blogEnabled !== false ? [{ href: '/blog', label: 'Blog' }] : []),
    { href: '/bao-gia', label: 'Báo giá' },
    { href: '/lien-he', label: 'Liên hệ' },
  ];

  return (
    <header className="sticky top-0 z-50 py-3 sm:py-4">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between min-h-16 sm:h-20 md:h-24 px-3 sm:px-4 md:px-6 py-2 sm:py-0">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 group flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 luxury-gradient rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 overflow-visible logo-sparkle logo-shine relative">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    transform: `translate(${settings.logoOffsetX || 0}%, ${settings.logoOffsetY || 0}%) scale(${settings.logoScale || 1})`,
                  }}
                />
              ) : (
                <span className="text-white font-bold text-lg sm:text-xl md:text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300">CND</span>
              )}
              
              {/* Diamond sparkle rays - 8 rays around the logo */}
              <div className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-4 bg-gradient-to-b from-transparent via-white to-transparent rounded-full" style={{ animation: 'diamond-ray 2s ease-in-out infinite', animationDelay: '0s' }}></div>
                {/* Top Right */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-4 h-1 bg-gradient-to-r from-transparent via-yellow-200 to-transparent rounded-full rotate-45" style={{ animation: 'diamond-ray 2s ease-in-out infinite', animationDelay: '0.25s' }}></div>
                {/* Right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-4 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full" style={{ animation: 'diamond-ray 2s ease-in-out infinite', animationDelay: '0.5s' }}></div>
                {/* Bottom Right */}
                <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-4 h-1 bg-gradient-to-r from-transparent via-yellow-200 to-transparent rounded-full -rotate-45" style={{ animation: 'diamond-ray 2s ease-in-out infinite', animationDelay: '0.75s' }}></div>
                {/* Bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-1 h-4 bg-gradient-to-t from-transparent via-white to-transparent rounded-full" style={{ animation: 'diamond-ray 2s ease-in-out infinite', animationDelay: '1s' }}></div>
                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-4 h-1 bg-gradient-to-l from-transparent via-yellow-200 to-transparent rounded-full rotate-45" style={{ animation: 'diamond-ray 2s ease-in-out infinite', animationDelay: '1.25s' }}></div>
                {/* Left */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-4 h-1 bg-gradient-to-l from-transparent via-white to-transparent rounded-full" style={{ animation: 'diamond-ray 2s ease-in-out infinite', animationDelay: '1.5s' }}></div>
                {/* Top Left */}
                <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-4 h-1 bg-gradient-to-l from-transparent via-yellow-200 to-transparent rounded-full -rotate-45" style={{ animation: 'diamond-ray 2s ease-in-out infinite', animationDelay: '1.75s' }}></div>
              </div>

              {/* Diamond center sparkles */}
              <div className="absolute inset-0 pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full" style={{ animation: 'diamond-sparkle 1.5s ease-in-out infinite', animationDelay: '0s', boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)' }}></div>
                <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full" style={{ animation: 'diamond-sparkle 1.5s ease-in-out infinite', animationDelay: '0.3s', boxShadow: '0 0 4px rgba(255, 215, 0, 0.8)' }}></div>
                <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full" style={{ animation: 'diamond-sparkle 1.5s ease-in-out infinite', animationDelay: '0.6s', boxShadow: '0 0 4px rgba(255, 215, 0, 0.8)' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-white rounded-full" style={{ animation: 'diamond-sparkle 1.5s ease-in-out infinite', animationDelay: '0.9s', boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" style={{ animation: 'diamond-sparkle 1.2s ease-in-out infinite', animationDelay: '0.15s', boxShadow: '0 0 6px rgba(255, 255, 255, 1), 0 0 12px rgba(212, 175, 55, 0.6)' }}></div>
              </div>
            </div>
            <div>
              <h1 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">Cổng Nhôm Đúc Hùng Phát</h1>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium">Chất lượng - Uy tín</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 rounded-full group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-primary-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* Contact Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-gradient text-white px-4 xl:px-6 py-2 xl:py-3 rounded-lg xl:rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold shadow-lg text-sm xl:text-base whitespace-nowrap"
            >
              📞 <span className="hidden xl:inline">{settings.phone || '0123.456.789'}</span><span className="xl:hidden">Hotline</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden py-3 border-t border-gray-200 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto px-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 active:bg-primary-100 rounded-full transition-all duration-300 font-medium text-base mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 mx-4 luxury-gradient text-white px-4 py-3 rounded-full text-center hover:shadow-lg active:scale-95 transition-all duration-300 font-semibold shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              📞 Hotline: {settings.phone || '0123.456.789'}
            </a>
          </nav>
          )}
        </div>
      </div>
    </header>
  );
}

