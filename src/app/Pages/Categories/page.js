'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import products from "../../../../public/Products/products.json";

export default function CategoriesPage() {
  const router = useRouter();
  
  // Define categories manually with image URLs
  const categories = [
    { 
      id: 'business-cards', 
      name: 'Business Cards', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Professional cards for networking and brand representation'
    },
    { 
      id: 'flyers', 
      name: 'Flyers', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Eye-catching promotional materials for events and marketing'
    },
    { 
      id: 'brochures', 
      name: 'Brochures', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Informative multi-page materials for detailed product or service information'
    },
    { 
      id: 'posters', 
      name: 'Posters', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Large format prints for advertising and decoration'
    },
    { 
      id: 'stickers', 
      name: 'Stickers', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Adhesive designs for branding and personalization'
    },
    { 
      id: 'invitation-cards', 
      name: 'Invitation Cards', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Elegant cards for special events and occasions'
    },
    { 
      id: 'stationery', 
      name: 'Stationery', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Professional office supplies for business communication'
    },
    { 
      id: 'banners', 
      name: 'Banners', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Large displays for events and promotions'
    },
    { 
      id: 'apparel', 
      name: 'Apparel', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Custom printed clothing for teams and brands'
    },
    { 
      id: 'merchandise', 
      name: 'Merchandise', 
      imageUrl: '/api/placeholder/400/300',
      description: 'Branded products for marketing and gifts'
    }
  ];

  // Count products in each category
  const categoryCounts = {};
  categories.forEach(category => {
    // Match product category case-insensitively
    const count = products.filter(product => 
      product.category.toLowerCase() === category.name.toLowerCase() ||
      product.category.toLowerCase() === category.id.toLowerCase()
    ).length;
    categoryCounts[category.id] = count;
  });

  return (
    <div className="bg-black min-h-screen p-6">
      {/* Header Section */}
      <div className="w-[90%] h-60 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center shadow-md rounded-lg mb-8">
        <h1 className="text-3xl font-bold">Shop by Category</h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/Pages/Categories/${encodeURIComponent(category.id)}`}
            className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-gray-800"
          >
            {/* Category Image */}
            <div className="h-48 w-full bg-gray-700 relative">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover group-hover:opacity-80 transition-opacity"
              />
            </div>
            
            {/* Category Info Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 transition-opacity group-hover:bg-opacity-60">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                <p className="text-gray-200 text-sm mt-1">{category.description}</p>
                <p className="text-yellow-400 mt-2">
                  {categoryCounts[category.id] || 0} {(categoryCounts[category.id] || 0) === 1 ? 'product' : 'products'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Promotional Section */}
      <section className="bg-white py-16 mt-12 rounded-lg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Check out our Latest Promotions!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't miss out on exclusive offers and exciting discounts. Grab them while they last!
          </p>
          <button
            onClick={() => router.push("/Products")}
            className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition duration-300 shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}