"use client";
import Image from "next/image";
import Link from "next/link";

<<<<<<< HEAD
const CategoryCard = ({ category, index }) => {
  // Safely get category name and create slug
  const categoryName = category?.name || "uncategorized";
  const categorySlug = encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'));
  
  return (
    <Link
      href={`/categories/${categorySlug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col relative border border-gray-100"
    >
      {/* Popular Badge */}
      {index < 3 && (
        <div className="absolute top-0 left-0 z-20">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-br-lg rounded-tl-lg flex items-center shadow-lg">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            TRENDING
          </div>
        </div>
      )}
=======
const CategoryCard = ({ category, index }) => (
  <Link
    href={`/categories/${encodeURIComponent(category.name)}`}
    className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative"
  >
    {/* Popular Badge */}
    {index < 5 && (
      <div className="absolute top-0 left-0 z-20">
        <div className="bg-red-600 text-white text-xs font-bold px-4 py-1 transform rotate-0 origin-top-left flex items-center">
          <svg
            className="w-3 h-3 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          POPULAR
        </div>
      </div>
    )}

    {/* Image Container */}
    <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={category.imageUrl || "/images/brandimage.jpeg"}
          alt={category.name || "Category image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
>>>>>>> b763550786928ca24102b0c6ad774ef1b4c6b437

      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        {category?.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={categoryName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-all duration-300"></div>

        {/* Category Count Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-sm px-3 py-2 rounded-full shadow-lg z-10 backdrop-blur-sm">
          {category?.productCount || 0} {category?.productCount === 1 ? "product" : "products"}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300 line-clamp-1">
          {categoryName}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {category?.description || "Explore our premium collection of quality products and services designed to meet your needs."}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 group-hover:border-yellow-200 transition-colors">
          <span className="text-yellow-600 font-semibold text-sm group-hover:underline transition-all">
            View Products
          </span>
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:bg-yellow-400 transition-all duration-300">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Border Hover Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-500/50 transition-all duration-300 pointer-events-none"></div>
    </Link>
  );
};

export default CategoryCard;