// import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import products from '../../../../../public/Products/products.json';

export async function generateStaticParams() {
  // console.log(category)
  const uniqueCategories = [...new Set(products.map(product => product.category))];
  return uniqueCategories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export default function CategoryPage({ params }) {
  const decodedCategory = decodeURIComponent(params.category);
  // alert(params.category)
  const categoryProducts = products.filter(
    product => product.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  // if (categoryProducts.length === 0) {
  //   notFound();
  // }

  return (
    <div className="bg-black min-h-screen p-6">
      {/* Header Section */}
      <div className="w-[90%] h-60 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center shadow-md rounded-lg mb-8">
        <h1 className="text-3xl font-bold capitalize">{decodedCategory}</h1>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryProducts.map((product) => {
          // Ensure product.images is an array; if not, wrap it in an array.
          const imagesArray = Array.isArray(product.images) ? product.images : [product.images];
          const mainImage = imagesArray[0] || "/fallback-image.png";

          return (
            <Link
              key={product.id}
              href={`/Products/${product.id}`}
              className="bg-white rounded-lg shadow-lg flex flex-col m-2 p-3 transition-transform transform hover:scale-105"
            >
              {/* Product Image */}
              <div className="w-full h-48 relative">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              
              {/* Product Details */}
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-yellow-600 font-bold">
                  ₦{typeof product.price === 'string' ? product.price : product.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                <p className="text-sm text-gray-500">Vendor: {product.vendor}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}