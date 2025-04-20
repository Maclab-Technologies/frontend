'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import products from "../../../../public/Products/products.json";

export default async function CategoriesPage() {
  const router = useRouter();
  try{
    const categories = await axios.get(`${process.env.API_KEY}/category`);

    if (!categories.ok){
      // add nice alert
      console.error('Failed to fetch category products')
    }

    const categoryCounts = {};
    categories.data.forEach(category => {
      // Match product category case-insensitively
      const count = products.filter(product => 
        product.category.toLowerCase() === category.name.toLowerCase() ||
        product.category.toSrting() === category._id.toSrting()
      ).length;
      categoryCounts[category.id] = count;
    });
  }catch (err) {
    console.error('Internal error', err.message);
  }

  

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
            href={`/Pages/Categories/${encodeURIComponent(category._id)}`}
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