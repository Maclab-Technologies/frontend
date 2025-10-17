"use client"
import { useState, useEffect, useRef, useMemo } from 'react';

const Carousel = () => {
  // Enhanced banner data with fallback images
  const banners = useMemo(() => [
    {
      id: 1,
      desktopImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format',
      mobileImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&auto=format',
      title: 'Premium Print Solutions',
      subtitle: 'Fast, reliable printing for your business needs',
      ctaLink: '/products',
      ctaText: 'Order Now',
      gradient: 'from-blue-900/80 via-purple-900/60 to-transparent',
      badge: 'NEW'
    },
    {
      id: 2,
      desktopImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=600&fit=crop&auto=format',
      mobileImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=500&fit=crop&auto=format',
      title: 'Business Cards & Brochures',
      subtitle: 'Make a lasting impression with our premium finishes',
      ctaLink: '/categories/cusiness-Cards',
      ctaText: 'Explore Options',
      gradient: 'from-emerald-900/80 via-teal-900/60 to-transparent',
      badge: 'POPULAR'
    },
    {
      id: 3,
      desktopImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format',
      mobileImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&auto=format',
      title: 'New Customer Special',
      subtitle: '15% off your first order with code WELCOME15',
      ctaLink: '/register',
      ctaText: 'Get Started',
      gradient: 'from-orange-900/80 via-red-900/60 to-transparent',
      badge: 'OFFER'
    },
  ], []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('next');
  const [progress, setProgress] = useState(0);
  const autoPlayRef = useRef(null);
  const progressRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (!isPaused && isAutoPlaying) {
      const startTime = Date.now();
      const duration = 5000; // 5 seconds

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (newProgress < 100) {
          progressRef.current = requestAnimationFrame(updateProgress);
        }
      };

      progressRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (progressRef.current) {
        cancelAnimationFrame(progressRef.current);
      }
    };
  }, [currentSlide, isPaused, isAutoPlaying]);

  // Auto-play functionality
  useEffect(() => {
    const autoPlay = () => {
      setDirection('next');
      setCurrentSlide((prevSlide) => (prevSlide === banners.length - 1 ? 0 : prevSlide + 1));
      setProgress(0);
    };

    if (isAutoPlaying && !isPaused) {
      autoPlayRef.current = setInterval(autoPlay, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isPaused, banners.length]);

  // Mouse event handlers
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Manual navigation
  const goToSlide = (index, slideDirection = 'next') => {
    setDirection(slideDirection);
    setCurrentSlide(index);
    setProgress(0);
    
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const nextSlide = () => {
    const newIndex = currentSlide === banners.length - 1 ? 0 : currentSlide + 1;
    goToSlide(newIndex, 'next');
  };

  const prevSlide = () => {
    const newIndex = currentSlide === 0 ? banners.length - 1 : currentSlide - 1;
    goToSlide(newIndex, 'prev');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <section 
      className="relative w-full overflow-hidden bg-gray-900 shadow-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Image carousel"
    >
      {/* Main carousel container */}
      <div className="relative h-[350px] md:h-[600px] w-full">
        {banners.map((banner, index) => {
          const isActive = index === currentSlide;
          const isNext = index === (currentSlide + 1) % banners.length;
          const isPrev = index === (currentSlide - 1 + banners.length) % banners.length;
          
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out transform ${
                isActive 
                  ? 'opacity-100 scale-100 z-20' 
                  : isNext && direction === 'next'
                  ? 'opacity-0 scale-105 translate-x-full z-10'
                  : isPrev && direction === 'prev'
                  ? 'opacity-0 scale-105 -translate-x-full z-10'
                  : 'opacity-0 scale-95 z-0'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={isMobile ? banner.mobileImage : banner.desktopImage}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-[10s] ease-out transform hover:scale-110"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}></div>
                
                {/* Additional dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Animated geometric patterns */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
                  <div className="absolute bottom-20 left-16 w-24 h-24 border border-white rotate-45 animate-bounce" style={{animationDelay: '1s'}}></div>
                  <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                </div>
              </div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center z-30">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-yellow-500/90 backdrop-blur-sm text-black font-bold text-sm rounded-full mb-6 shadow-lg">
                      <span className="w-2 h-2 bg-black rounded-full mr-2 animate-pulse"></span>
                      {banner.badge}
                    </div>
                    
                    {/* Title with animation */}
                    <h1 className={`text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight transition-all duration-1000 ${
                      isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {banner.title}
                    </h1>
                    
                    {/* Subtitle with staggered animation */}
                    <p className={`text-xl md:text-2xl text-gray-200 mb-6 md:mb-10 leading-relaxed transition-all duration-1000 delay-200 ${
                      isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {banner.subtitle}
                    </p>
                    
                    {/* CTA Button with enhanced styling */}
                    <div className={`transition-all duration-1000 delay-400 ${
                      isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <a 
                        href={banner.ctaLink} 
                        className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
                      >
                        <span>{banner.ctaText}</span>
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Navigation arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-40 group bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 group bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {/* Enhanced indicator dots with progress */}
      <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center items-center gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 focus:outline-none group ${
              index === currentSlide 
                ? 'w-12 h-3' 
                : 'w-3 h-3 hover:w-5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Base dot */}
            <div className={`w-full h-full rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                : 'bg-white/50 group-hover:bg-white/75'
            }`}></div>
            
            {/* Progress indicator for active slide */}
            {index === currentSlide && (
              <div 
                className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Play/Pause button */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-6 right-6 z-40 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-110"
        aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isAutoPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
      
      {/* Slide counter */}
      <div className="absolute top-6 left-6 z-40 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
        {currentSlide + 1} / {banners.length}
      </div>
    </section>
  );
};

export default Carousel;