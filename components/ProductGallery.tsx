/**
 * Gallery sản phẩm với phóng to (zoom/lightbox)
 * Tắt zoom trên mobile, chỉ hoạt động trên desktop
 */
'use client';

import { useRef, useState, useEffect } from 'react';

type Props = {
  images: string[];
  fallbackIcon?: React.ReactNode;
};

export default function ProductGallery({ images, fallbackIcon = '🚪' }: Props) {
  const list = images && images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = list[activeIndex] || null;
  const [isOpen, setIsOpen] = useState(false);
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [animStyle, setAnimStyle] = useState<{ translate: number; opacity: number }>({ translate: 0, opacity: 1 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const zoomScale = 2.5;
  const autoPlayMs = 4500;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint của Tailwind
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset active khi danh sách đổi
  useEffect(() => {
    setActiveIndex(0);
    setSlideDir('next');
  }, [list.length]);

  // Auto slideshow
  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setSlideDir('next');
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [list.length]);

  // Slide + fade transition when active image changes (giống iPhone nhẹ nhàng)
  useEffect(() => {
    const offset = slideDir === 'next' ? 24 : -24;
    // start state
    setAnimStyle({ translate: offset, opacity: 0.3 });
    const frame = requestAnimationFrame(() => {
      setAnimStyle({ translate: 0, opacity: 1 });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, slideDir]);

  const goPrev = () => {
    if (list.length === 0) return;
    setSlideDir('prev');
    setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const goNext = () => {
    if (list.length === 0) return;
    setSlideDir('next');
    setActiveIndex((prev) => (prev + 1) % list.length);
  };

  return (
    <>
      <div className="space-y-3">
        <div
          ref={containerRef}
          className={`relative bg-gradient-to-br from-primary-200 to-primary-400 rounded-lg h-96 flex items-center justify-center overflow-hidden ${
            !isMobile ? 'cursor-zoom-in' : 'cursor-pointer'
          }`}
          onClick={() => active && setIsOpen(true)}
        >
          {active ? (
            <>
              <img
                src={active}
                alt="Ảnh sản phẩm"
                className="w-full h-full object-contain pointer-events-none transition-all duration-400 ease-out"
                style={{
                  transform: `translateX(${animStyle.translate}px)`,
                  opacity: animStyle.opacity,
                }}
              />
              {list.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/60 transition"
                    aria-label="Ảnh trước"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/60 transition"
                    aria-label="Ảnh tiếp theo"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {list.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition ${
                          idx === activeIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`Chọn ảnh ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-9xl">{fallbackIcon}</span>
          )}
        </div>
        {list.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {list.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`border rounded-lg overflow-hidden h-20 ${
                  activeIndex === idx ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && active && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setShowLens(false);
            }
          }}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowLens(false);
              }}
              className="absolute -top-10 right-0 text-white bg-black/50 px-3 py-1 rounded z-10"
            >
              Đóng
            </button>
            {list.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Ảnh trước"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Ảnh tiếp theo"
                >
                  ›
                </button>
              </>
            )}
            <div
              ref={modalRef}
              className="relative bg-black rounded-lg overflow-hidden shadow-2xl h-[75vh] flex items-center justify-center"
              onMouseEnter={() => !isMobile && setShowLens(true)}
              onMouseLeave={() => !isMobile && setShowLens(false)}
              onMouseMove={(e) => {
                if (isMobile || !modalRef.current) return;
                const rect = modalRef.current.getBoundingClientRect();
                const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
                const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
                setLensPos({ x, y });
              }}
              style={{
                backgroundImage: !isMobile && showLens ? `url(${active})` : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundSize: !isMobile && showLens ? `${zoomScale * 100}% ${zoomScale * 100}%` : 'contain',
                backgroundPosition: !isMobile && showLens ? `${lensPos.x}% ${lensPos.y}%` : 'center',
              }}
            >
              {(!showLens || isMobile) && (
                <img
                  src={active}
                  alt="Zoom"
                  className="w-full h-full object-contain pointer-events-none transition-all duration-400 ease-out"
                  style={{
                    transform: `translateX(${animStyle.translate}px)`,
                    opacity: animStyle.opacity,
                  }}
                />
              )}
              {showLens && !isMobile && (
                <div
                  className="absolute w-32 h-32 border-2 border-white/70 rounded-full shadow-xl pointer-events-none"
                  style={{
                    left: `calc(${lensPos.x}% - 4rem)`,
                    top: `calc(${lensPos.y}% - 4rem)`,
                    backdropFilter: 'brightness(1.05)',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

