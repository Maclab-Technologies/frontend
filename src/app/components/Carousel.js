"use client"
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Carousel = () => {
  // Banner data - replace these URLs with your actual image paths
  const banners = [
    {
      id: 1,
      desktopImage: '/images/BANNER1.png',
      // mobileImage: '/images/banners/mobile-banner-1.jpg',
      title: 'Premium Print Solutions',
      subtitle: 'Fast, reliable printing for your business needs',
      ctaLink: '/Products',
      ctaText: 'Order Now',
    },
    {
      id: 2,
      desktopImage: '/images/banners/desktop-banner-2.jpg',
      mobileImage: '/images/banners/mobile-banner-2.jpg',
      title: 'Business Cards & Brochures',
      subtitle: 'Make a lasting impression with our premium finishes',
      ctaLink: '/Pages/Categories/Business-Cards',
      ctaText: 'Explore Options',
    },
    {
      id: 3,
      desktopImage: '/images/banners/desktop-banner-3.jpg',
      mobileImage: '/images/banners/mobile-banner-3.jpg',
      title: 'New Customer Special',
      subtitle: '15% off your first order with code WELCOME15',
      ctaLink: '/sign-up',
      ctaText: 'Get Started',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle auto-play
  useEffect(() => {
    const autoPlay = () => {
      setCurrentSlide((prevSlide) => (prevSlide === banners.length - 1 ? 0 : prevSlide + 1));
    };

    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(autoPlay, 4000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, banners.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
    
    // Reset the timer when manually changing slides
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    
    // Restart autoplay after manual navigation
    if (isAutoPlaying) {
      setIsAutoPlaying(true);
    }
  };

  const nextSlide = () => {
    const newIndex = currentSlide === banners.length - 1 ? 0 : currentSlide + 1;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentSlide === 0 ? banners.length - 1 : currentSlide - 1;
    goToSlide(newIndex);
  };

  return (
    <section className="relative w-full overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Carousel container */}
      <div className="relative h-[300px] md:h-[500px] w-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Desktop Image */}
            <div className="hidden md:block h-full w-full relative">
              <Image
                src={banner.desktopImage}
                alt={banner.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
            
            {/* Mobile Image */}
            <div className="md:hidden h-full w-full relative">
              <Image
                src={banner.mobileImage}
                alt={banner.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-center bg-black bg-opacity-40 z-20">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-lg">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">{banner.title}</h1>
                  <p className="text-lg md:text-xl text-white mb-4 md:mb-8">{banner.subtitle}</p>
                  <a 
                    href={banner.ctaLink} 
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-md transition-colors shadow-lg"
                  >
                    {banner.ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all focus:outline-none"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all focus:outline-none"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {/* Indicator dots */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-yellow-500 w-8' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Carousel;