"use client"

import { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react'

// ==============================
// CAROUSEL COMPONENT
// ==============================

const Carousel = () => {
  // ==============================
  // BANNERS CONFIGURATION
  // ==============================
  
  // 🎄 CHRISTMAS BANNERS (ACTIVE FROM DEC 1 - DEC 30, 2025)
  // Comment out this section after Christmas to return to original banners
  const banners = useMemo(() => [
    {
      id: 1,
      desktopImage: '/images/christmas-ads-1.png',
      mobileImage: '/images/christmas-ads-1.png',
      title: 'Christmas Print Deals Are Here!',
      subtitle: 'Get up to 20% off on all Christmas printing. Limited time offers!',
      ctaLink: '/christmas-discount',
      ctaText: 'Claim Christmas Offer',
      gradient: 'from-red-900/80 via-green-900/60 to-transparent',
      badge: 'CHRISTMAS SPECIAL',
      themeColor: 'from-yellow-500 to-amber-500'
    },
    {
      id: 2,
      desktopImage: '/images/christmas-ads-2.png',
      mobileImage: '/images/christmas-ads-2.png',
      title: '₦20,000 Voucher Giveaway',
      subtitle: 'Enter to win ₦20,000 for your Christmas printing needs',
      ctaLink: '/christmas-voucher',
      ctaText: 'Enter Giveaway',
      gradient: 'from-blue-900/80 via-purple-900/60 to-transparent',
      badge: 'GIVEAWAY',
      themeColor: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      desktopImage: '/images/christmas-ads-3.png',
      mobileImage: '/images/christmas-ads-3.png',
      title: 'Christmas Combo Deals',
      subtitle: 'Massive savings on bundled packages for events & businesses',
      ctaLink: '/christmas-combo',
      ctaText: 'View Combos',
      gradient: 'from-green-900/80 via-emerald-900/60 to-transparent',
      badge: 'COMBO DEALS',
      themeColor: 'from-green-500 to-emerald-500'
    },
  ], [])

  // ==============================
  // ORIGINAL BANNERS (COMMENTED OUT DURING CHRISTMAS)
  // Uncomment this section after Christmas to return to original banners
  // ==============================
  /*
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
      ctaLink: '/categories/business-cards',
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
  ], [])
  */

  // ==============================
  // CAROUSEL STATE & LOGIC
  // ==============================
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState('next')
  const [progress, setProgress] = useState(0)
  const autoPlayRef = useRef(null)
  const progressRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // Check if screen is mobile
  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Progress bar animation
  useEffect(() => {
    if (!isPaused && isAutoPlaying) {
      const startTime = Date.now()
      const duration = 5000 // 5 seconds

      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min((elapsed / duration) * 100, 100)
        setProgress(newProgress)

        if (newProgress < 100) {
          progressRef.current = requestAnimationFrame(updateProgress)
        }
      }

      progressRef.current = requestAnimationFrame(updateProgress)
    }

    return () => {
      if (progressRef.current) {
        cancelAnimationFrame(progressRef.current)
      }
    }
  }, [currentSlide, isPaused, isAutoPlaying])

  // Auto-play functionality
  useEffect(() => {
    const autoPlay = () => {
      setDirection('next')
      setCurrentSlide((prevSlide) => (prevSlide === banners.length - 1 ? 0 : prevSlide + 1))
      setProgress(0)
    }

    if (isAutoPlaying && !isPaused) {
      autoPlayRef.current = setInterval(autoPlay, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, isPaused, banners.length])

  // Mouse event handlers
  const handleMouseEnter = useCallback(() => setIsPaused(true), [])
  const handleMouseLeave = useCallback(() => setIsPaused(false), [])

  // Touch event handlers for mobile swipe
  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.touches[0].clientX)
    setTouchEnd(null)
  }, [])

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.touches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
    
    // Reset touch states
    setTouchStart(null)
    setTouchEnd(null)
  }, [touchStart, touchEnd])

  // Manual navigation
  const goToSlide = useCallback((index, slideDirection = 'next') => {
    setDirection(slideDirection)
    setCurrentSlide(index)
    setProgress(0)
    
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }, [])

  const nextSlide = useCallback(() => {
    const newIndex = currentSlide === banners.length - 1 ? 0 : currentSlide + 1
    goToSlide(newIndex, 'next')
  }, [currentSlide, banners.length, goToSlide])

  const prevSlide = useCallback(() => {
    const newIndex = currentSlide === 0 ? banners.length - 1 : currentSlide - 1
    goToSlide(newIndex, 'prev')
  }, [currentSlide, banners.length, goToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextSlide()
      }
      if (e.key === ' ') {
        e.preventDefault()
        setIsAutoPlaying(!isAutoPlaying)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, isAutoPlaying, nextSlide, prevSlide])

  // Helper function to get slide position classes
  const getSlidePosition = useCallback((index) => {
    const isActive = index === currentSlide
    const isNext = index === (currentSlide + 1) % banners.length
    const isPrev = index === (currentSlide - 1 + banners.length) % banners.length

    if (isActive) {
      return 'opacity-100 scale-100 translate-x-0 z-20'
    }

    if (direction === 'next') {
      if (isNext) return 'opacity-0 scale-105 translate-x-full z-10'
    } else {
      if (isPrev) return 'opacity-0 scale-105 -translate-x-full z-10'
    }

    return 'opacity-0 scale-95 z-0'
  }, [currentSlide, direction, banners.length])

  // Helper function to check if banner is Christmas themed
  const isChristmasBanner = useCallback((badge) => {
    return badge.includes('CHRISTMAS')
  }, [])

  // ==============================
  // RENDER
  // ==============================
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
      aria-roledescription="carousel"
    >
      {/* Main carousel container */}
      <div 
        className="relative h-[350px] md:h-[600px] w-full"
        role="group"
        aria-live="polite"
        aria-atomic="true"
      >
        {banners.map((banner, index) => {
          const isActive = index === currentSlide
          
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out transform ${getSlidePosition(index)}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${banners.length}`}
              aria-hidden={!isActive}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={isMobile ? banner.mobileImage : banner.desktopImage}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-[10s] ease-out transform hover:scale-110"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  // Fallback for missing images
                  onError={(e) => {
                    const target = e.target
                    target.onerror = null
                    target.src = 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=1200&h=600&fit=crop&auto=format'
                  }}
                />
                
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}></div>
                
                {/* Additional dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Christmas Animated Elements (only for Christmas banners) */}
                {isChristmasBanner(banner.badge) && (
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    {/* Floating Christmas elements */}
                    <div className="absolute top-4 sm:top-6 md:top-10 right-4 sm:right-6 md:right-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-xl sm:text-2xl md:text-4xl animate-pulse">🎄</div>
                    <div 
                      className="absolute bottom-4 sm:bottom-8 md:bottom-20 left-4 sm:left-8 md:left-16 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-lg sm:text-xl md:text-3xl animate-bounce" 
                      style={{animationDelay: '1s'}}
                    >
                      🎁
                    </div>
                    <div 
                      className="absolute top-1/3 right-1/4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-base sm:text-lg md:text-2xl animate-ping" 
                      style={{animationDelay: '2s'}}
                    >
                      ✨
                    </div>
                  </div>
                )}
              </div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center z-30">
                <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-12">
                  <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
                    {/* Badge */}
                    <div 
                      className={`inline-flex items-center px-3 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 ${
                        banner.themeColor 
                          ? `bg-gradient-to-r ${banner.themeColor}` 
                          : 'bg-yellow-500/90'
                      } backdrop-blur-sm text-black font-bold text-xs sm:text-xs md:text-sm rounded-full mb-3 sm:mb-4 md:mb-5 lg:mb-6 shadow-lg`}
                    >
                      <span className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-black rounded-full mr-1.5 sm:mr-1.5 md:mr-2 animate-pulse"></span>
                      {banner.badge}
                    </div>
                    
                    {/* Title with animation */}
                    <h1 
                      className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight transition-all duration-1000 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 sm:translate-y-6 md:translate-y-8 opacity-0'
                      }`}
                    >
                      {banner.title}
                    </h1>
                    
                    {/* Subtitle with staggered animation */}
                    <p 
                      className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-3 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10 leading-relaxed sm:leading-relaxed md:leading-relaxed transition-all duration-1000 delay-200 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 sm:translate-y-6 md:translate-y-8 opacity-0'
                      }`}
                    >
                      {banner.subtitle}
                    </p>
                    
                    {/* CTA Button with enhanced styling */}
                    <div 
                      className={`transition-all duration-1000 delay-400 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 sm:translate-y-6 md:translate-y-8 opacity-0'
                      }`}
                    >
                      <a 
                        href={banner.ctaLink} 
                        className={`group inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 ${
                          banner.themeColor 
                            ? `bg-gradient-to-r ${banner.themeColor}` 
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        } hover:opacity-90 text-black font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/50`}
                      >
                        <span className="whitespace-nowrap">{banner.ctaText}</span>
                        <svg 
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5 ml-1.5 sm:ml-1.5 md:ml-2 transform group-hover:translate-x-0.5 sm:group-hover:translate-x-0.5 md:group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Enhanced Navigation arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 sm:left-3 md:left-4 lg:left-5 xl:left-6 top-1/2 -translate-y-1/2 z-40 group bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 sm:p-2 md:p-3 lg:p-3 xl:p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg 
          className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 transform group-hover:-translate-x-0.5 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-2 sm:right-3 md:right-4 lg:right-5 xl:right-6 top-1/2 -translate-y-1/2 z-40 group bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 sm:p-2 md:p-3 lg:p-3 xl:p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-110"
        aria-label="Next slide"
      >
        <svg 
          className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 transform group-hover:translate-x-0.5 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {/* Enhanced indicator dots with progress */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-5 xl:bottom-6 left-0 right-0 z-40 flex justify-center items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
        {banners.map((banner, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 focus:outline-none group ${
              index === currentSlide 
                ? 'w-6 h-1.5 sm:w-7 sm:h-2 md:w-8 md:h-2 lg:w-10 lg:h-2.5 xl:w-12 xl:h-3' 
                : 'w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 hover:w-3 sm:hover:w-3.5 md:hover:w-4 lg:hover:w-5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          >
            {/* Base dot */}
            <div className={`w-full h-full rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? `bg-gradient-to-r ${banner.themeColor || 'from-yellow-500 to-orange-500'}` 
                : 'bg-white/50 group-hover:bg-white/75'
            }`}></div>
            
            {/* Progress indicator for active slide */}
            {index === currentSlide && (
              <div 
                className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Play/Pause button */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-3 sm:top-4 md:top-5 lg:top-5 xl:top-6 right-3 sm:right-4 md:right-5 lg:right-5 xl:right-6 z-40 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-1.5 sm:p-2 md:p-2.5 lg:p-2.5 xl:p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-110"
        aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isAutoPlaying ? (
          <svg 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
      
      {/* Slide counter */}
      <div className="absolute top-3 sm:top-4 md:top-5 lg:top-5 xl:top-6 left-3 sm:left-4 md:left-5 lg:left-5 xl:left-6 z-40 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 lg:px-3 lg:py-1 xl:px-4 xl:py-2 rounded-full text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm font-medium">
        {currentSlide + 1} / {banners.length}
      </div>
    </section>
  )
}

export default Carousel;