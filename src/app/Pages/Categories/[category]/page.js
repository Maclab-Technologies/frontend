import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function CategoryPage({ params }) {
  const { category } = await params;

  if (!category) {
    notFound();
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${baseUrl}/categories/${category}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch category products: ${res.statusText}`);
    }

    const json = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      throw new Error("Invalid product data received");
    }

    const fetchedProducts = json.data;

    
    if (!Array.isArray(fetchedProducts)) {
      throw new Error("Invalid product data received");
    }
    
    // const filteredProducts = fetchedProducts.filter(
    //   (product) => product.category === decodedCategory
    // );

    if (fetchedProducts.length === 0) {
      return <p className="text-center p-10">No products found in {category}</p>;
    }
    

    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 py-16 mb-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-black capitalize mb-4">
                {category}
              </h1>
              <div className="h-1 w-20 bg-black mb-6"></div>
              <p className="text-gray-800 max-w-xl mx-auto">
                Explore our selection of high-quality {category.toLowerCase()} products, 
                designed to meet your every need with premium quality and fast delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {fetchedProducts.length} {fetchedProducts.length === 1 ? 'Product' : 'Products'} Found
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fetchedProducts.map((product) => {
              const imagesArray = Array.isArray(product.images) ? product.images : [product.images];
              const mainImage = imagesArray[0] || "/fallback-image.png";
              const formattedPrice = typeof product.price === 'string' 
                ? product.price.replace(/\D/g, '') 
                : product.price;
              const price = !isNaN(formattedPrice) 
                ? parseFloat(formattedPrice).toLocaleString() 
                : '0';

              return (
                <Link key={product._id} href={`/Products/${product.id}`} passHref>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group relative">
                    <div className="w-full h-64 relative overflow-hidden">
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        // onError={(e) => {
                        //   e.target.onerror = null;
                        //   e.target.src = "/fallback-image.png";
                        // }}
                      />
                    </div>

                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        <span>Vendor: {product.vendor || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        <span>Stock: {product.stock || 0}</span>
                      </div>
                      <div className="mt-auto pt-4">
                        <p className="text-xl font-bold text-yellow-600">₦{price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* No results fallback */}
          {fetchedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
              <Link href="/Products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Internal error: ', error.message);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">We couldn't load the products for this category. Please try again later.</p>
          <div className="flex justify-center">
            <Link href="/Pages/Categories" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
