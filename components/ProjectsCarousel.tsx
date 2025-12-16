/**
 * Component ProjectsCarousel - Slideshow hiển thị công trình tiêu biểu
 * Đơn giản, mượt mà với hiệu ứng trượt
 */
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

type Project = {
  id: string;
  image: string;
  title?: string;
  description?: string;
};

type Props = {
  projects: Project[];
};

export default function ProjectsCarousel({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const dragOffsetRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidthRef = useRef<number>(0);
  const lastMoveTime = useRef<number>(0);
  const lastMoveX = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // Detect desktop và lưu container width - Tối ưu với debounce
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    const updateContainerWidth = () => {
      if (containerRef.current) {
        containerWidthRef.current = containerRef.current.offsetWidth;
      }
    };
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkDesktop();
        updateContainerWidth();
      }, 150); // Debounce 150ms
    };
    checkDesktop();
    updateContainerWidth();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const goPrev = useCallback(() => {
    if (projects.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const goNext = useCallback(() => {
    if (projects.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  // Mouse drag handlers - Hiệu ứng giống Instagram với momentum scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (projects.length <= 1) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    dragOffsetRef.current = 0;
    velocityRef.current = 0;
    lastMoveTime.current = Date.now();
    lastMoveX.current = e.clientX;
    if (containerRef.current) {
      containerWidthRef.current = containerRef.current.offsetWidth;
    }
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || projects.length <= 1) return;
    const now = Date.now();
    const deltaTime = now - lastMoveTime.current;
    const deltaX = e.clientX - dragStartX;
    
    // Tính toán velocity cho momentum scrolling
    if (deltaTime > 0) {
      const moveDelta = e.clientX - lastMoveX.current;
      velocityRef.current = moveDelta / deltaTime; // pixels per ms
    }
    
    lastMoveTime.current = now;
    lastMoveX.current = e.clientX;
    
    // Giới hạn drag offset để có thể preview một phần slide tiếp theo
    const maxDrag = containerWidthRef.current * 0.3; // Cho phép preview 30%
    const clampedDeltaX = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
    setDragOffset(clampedDeltaX);
    dragOffsetRef.current = clampedDeltaX;
  };

  const handleMouseUp = () => {
    if (!isDragging || projects.length <= 1) return;
    
    const threshold = containerWidthRef.current * 0.2; // 20% của container width
    const offset = dragOffsetRef.current;
    const velocity = velocityRef.current;
    
    // Momentum scrolling: Nếu kéo nhanh, tự động chuyển slide
    const momentumThreshold = 0.3; // pixels per ms
    const shouldSnap = Math.abs(offset) > threshold || Math.abs(velocity) > momentumThreshold;
    
    if (shouldSnap) {
      if (offset > 0 || velocity > momentumThreshold) {
        goPrev();
      } else if (offset < 0 || velocity < -momentumThreshold) {
        goNext();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    dragOffsetRef.current = 0;
    velocityRef.current = 0;
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
      dragOffsetRef.current = 0;
    }
  };

  // Global mouse events - Hiệu ứng giống Instagram với momentum scrolling
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const deltaTime = now - lastMoveTime.current;
      const deltaX = e.clientX - dragStartX;
      
      // Tính toán velocity cho momentum scrolling
      if (deltaTime > 0) {
        const moveDelta = e.clientX - lastMoveX.current;
        velocityRef.current = moveDelta / deltaTime; // pixels per ms
      }
      
      lastMoveTime.current = now;
      lastMoveX.current = e.clientX;
      
      // Giới hạn drag offset để có thể preview một phần slide tiếp theo (giống Instagram)
      const maxDrag = containerWidthRef.current * 0.3; // Cho phép preview 30%
      const clampedDeltaX = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
      setDragOffset(clampedDeltaX);
      dragOffsetRef.current = clampedDeltaX;
    };

    const handleGlobalMouseUp = () => {
      const threshold = containerWidthRef.current * 0.2; // 20% của container width
      const offset = dragOffsetRef.current;
      const velocity = velocityRef.current;
      
      // Momentum scrolling: Nếu kéo nhanh, tự động chuyển slide
      const momentumThreshold = 0.3; // pixels per ms
      const shouldSnap = Math.abs(offset) > threshold || Math.abs(velocity) > momentumThreshold;
      
      if (shouldSnap) {
        if (offset > 0 || velocity > momentumThreshold) {
          goPrev();
        } else if (offset < 0 || velocity < -momentumThreshold) {
          goNext();
        }
      }
      
      setIsDragging(false);
      setDragOffset(0);
      dragOffsetRef.current = 0;
      velocityRef.current = 0;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStartX, projects.length, goPrev, goNext]);

  // Touch handlers - Hiệu ứng giống Instagram với momentum scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (projects.length <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    velocityRef.current = 0;
    lastMoveTime.current = Date.now();
    lastMoveX.current = e.touches[0].clientX;
    if (containerRef.current) {
      containerWidthRef.current = containerRef.current.offsetWidth;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || projects.length <= 1) return;
    const now = Date.now();
    const deltaTime = now - lastMoveTime.current;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    
    // Tính toán velocity cho momentum scrolling
    if (deltaTime > 0) {
      const moveDelta = e.touches[0].clientX - lastMoveX.current;
      velocityRef.current = moveDelta / deltaTime;
    }
    
    lastMoveTime.current = now;
    lastMoveX.current = e.touches[0].clientX;
    touchDeltaX.current = deltaX;
    
    // Giới hạn drag offset để preview một phần slide tiếp theo
    const maxDrag = containerWidthRef.current * 0.3;
    const clampedDeltaX = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
    setDragOffset(clampedDeltaX);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || projects.length <= 1) return;
    const threshold = containerWidthRef.current * 0.2;
    const offset = touchDeltaX.current;
    const velocity = velocityRef.current;
    
    // Momentum scrolling: Nếu swipe nhanh, tự động chuyển slide
    const momentumThreshold = 0.3;
    const shouldSnap = Math.abs(offset) > threshold || Math.abs(velocity) > momentumThreshold;
    
    if (shouldSnap) {
      if (offset > 0 || velocity > momentumThreshold) {
        goPrev();
      } else if (offset < 0 || velocity < -momentumThreshold) {
        goNext();
      }
    }
    
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setDragOffset(0);
    velocityRef.current = 0;
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = '';
  };

  const goPrevFullscreen = () => {
    setFullscreenIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goNextFullscreen = () => {
    setFullscreenIndex((prev) => (prev + 1) % projects.length);
  };

  // Close fullscreen on Escape key
  useEffect(() => {
    if (!isFullscreen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullscreen();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 h-64 sm:h-80 md:h-96 lg:h-[500px] select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Images */}
        {isDesktop && projects.length >= 3 ? (
          // Desktop: Hiển thị 3 ảnh cùng lúc với hiệu ứng trượt sang trọng
          <div className="flex items-center justify-center gap-6 h-full px-4 overflow-hidden">
            {/* Ảnh bên trái */}
            <div 
              className={`w-1/3 h-full flex-shrink-0 ${!isDragging ? 'transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]' : ''}`}
              style={{
                transform: `translateX(${isDragging ? dragOffset * 0.3 : 0}px) scale(0.9)`,
              }}
            >
              <div 
                className="relative w-full h-full rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-500 shadow-lg hover:shadow-xl"
                onClick={() => openFullscreen((activeIndex - 1 + projects.length) % projects.length)}
              >
                <img
                  src={projects[(activeIndex - 1 + projects.length) % projects.length].image}
                  alt={projects[(activeIndex - 1 + projects.length) % projects.length].title || `Công trình ${(activeIndex - 1 + projects.length) % projects.length + 1}`}
                  className="w-full h-full object-contain transition-all duration-[1200ms]"
                />
              </div>
            </div>
            
            {/* Ảnh giữa (active) - Nổi bật với hiệu ứng mượt mà */}
            <div 
              className={`w-1/3 h-full flex-shrink-0 z-20 ${!isDragging ? 'transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]' : ''}`}
              style={{
                transform: `translateX(${isDragging ? dragOffset : 0}px) scale(1.05)`,
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))',
                willChange: isDragging ? 'transform' : 'auto',
              }}
            >
              <div 
                className="relative w-full h-full rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-500 shadow-2xl hover:shadow-[0_35px_60px_rgba(0,0,0,0.4)]"
                onClick={() => openFullscreen(activeIndex)}
              >
                <img
                  src={projects[activeIndex].image}
                  alt={projects[activeIndex].title || `Công trình ${activeIndex + 1}`}
                  className="w-full h-full object-contain transition-all duration-[1200ms]"
                />
                {/* Overlay gradient sang trọng */}
                {(projects[activeIndex].title || projects[activeIndex].description) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-[1500ms]"></div>
                )}
                
                {/* Project info với hiệu ứng fade in */}
                {(projects[activeIndex].title || projects[activeIndex].description) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white z-20 transition-all duration-[1500ms]">
                    {projects[activeIndex].title && (
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 drop-shadow-2xl transform transition-transform duration-[1200ms]">{projects[activeIndex].title}</h3>
                    )}
                    {projects[activeIndex].description && (
                      <p className="text-sm sm:text-base text-white/95 line-clamp-2 drop-shadow-lg">{projects[activeIndex].description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Ảnh bên phải */}
            <div 
              className={`w-1/3 h-full flex-shrink-0 ${!isDragging ? 'transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]' : ''}`}
              style={{
                transform: `translateX(${isDragging ? dragOffset * 0.3 : 0}px) scale(0.9)`,
                willChange: isDragging ? 'transform' : 'auto',
              }}
            >
              <div 
                className="relative w-full h-full rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-500 shadow-lg hover:shadow-xl"
                onClick={() => openFullscreen((activeIndex + 1) % projects.length)}
              >
                <img
                  src={projects[(activeIndex + 1) % projects.length].image}
                  alt={projects[(activeIndex + 1) % projects.length].title || `Công trình ${(activeIndex + 1) % projects.length + 1}`}
                  className="w-full h-full object-contain transition-all duration-[1200ms]"
                />
              </div>
            </div>
          </div>
        ) : (
          // Mobile hoặc ít hơn 3 ảnh: Hiệu ứng giống Instagram - mượt mà với momentum scrolling
          <div 
            className={`flex h-full ${!isDragging ? 'transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]' : ''}`}
            style={{
              transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
              willChange: isDragging ? 'transform' : 'auto',
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'pan-y pinch-zoom',
            }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="w-full h-full flex-shrink-0"
              >
                <div className="relative w-full h-full">
                  <img
                    src={project.image}
                    alt={project.title || `Công trình ${index + 1}`}
                    className="w-full h-full object-contain bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      if (!isDragging && Math.abs(dragOffset) < 10) {
                        openFullscreen(index);
                      }
                    }}
                    style={{
                      opacity: (() => {
                        if (isDragging && containerWidthRef.current > 0) {
                          return Math.max(0.3, 1 - Math.abs(dragOffset) / (containerWidthRef.current * 0.5));
                        }
                        return index === activeIndex ? 1 : 0.5;
                      })(),
                      transform: index === activeIndex ? 'scale(1)' : 'scale(0.98)',
                      willChange: isDragging && index === activeIndex ? 'opacity' : 'auto',
                      transition: isDragging ? 'none' : 'opacity 0.2s ease-out',
                    }}
                  />
                  {/* Overlay gradient sang trọng */}
                  {(project.title || project.description) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-[1500ms]"></div>
                  )}
                  
                  {/* Project info với hiệu ứng fade */}
                  {(project.title || project.description) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white z-20 transition-all duration-[1500ms]">
                      {project.title && (
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 drop-shadow-2xl">{project.title}</h3>
                      )}
                      {project.description && (
                        <p className="text-sm sm:text-base text-white/95 line-clamp-2 drop-shadow-lg">{project.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {projects.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Next"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {projects.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeFullscreen}
        >
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={projects[fullscreenIndex].image}
              alt={projects[fullscreenIndex].title || `Công trình ${fullscreenIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Project Info */}
            {(projects[fullscreenIndex].title || projects[fullscreenIndex].description) && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                {projects[fullscreenIndex].title && (
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{projects[fullscreenIndex].title}</h3>
                )}
                {projects[fullscreenIndex].description && (
                  <p className="text-base md:text-lg text-white/90">{projects[fullscreenIndex].description}</p>
                )}
              </div>
            )}

            {/* Navigation Arrows */}
            {projects.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrevFullscreen();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 z-50"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNextFullscreen();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 z-50"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            {projects.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-50">
                {fullscreenIndex + 1} / {projects.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

