"use client";
import Image from "next/image";
import Link from "next/link";

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

      {/* Category Count Badge */}
      <div className="absolute top-4 right-4 bg-yellow-500 text-black font-semibold text-sm px-3 py-1 rounded-full shadow-md z-10">
        {category.productCount} {category.productCount === 1 ? "product" : "products"}
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6 flex flex-col flex-grow bg-white">
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
        {category.name || "Unnamed Category"}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
        {category.description || "No description available"}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-yellow-600 font-medium text-sm group-hover:underline">
          Browse Products
        </span>
        <svg
          className="w-5 h-5 text-yellow-600 transform group-hover:translate-x-1 transition-transform"
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
  </Link>
);
export default CategoryCard;