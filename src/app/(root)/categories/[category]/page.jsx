'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { get } from '@/app/_hooks/fetch-hook';
import LoadingErrorHandler from '@/app/_components/LoadingErrorHandler';

export default function CategoryProductsPage() {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const fetchAttempted = useRef(false);
  
  const router = useRouter();
  const params = useParams();
  const categoryName = params.category;

  const fetchCategoryData = async () => {
    if (fetchAttempted.current) return;
    
    fetchAttempted.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Decode category name from URL
      const decodedCategoryName = decodeURIComponent(categoryName).replace("%20", " ");
      
      // Fetch category details and products
      const categoryResponse = await get(`/categories/${decodedCategoryName}`);
      
      if (!categoryResponse.success) {
        throw new Error(`Failed to fetch category: ${categoryResponse.data?.message || 'Category not found'}`);
      }

      const categoryData = categoryResponse.data?.data || categoryResponse.data;
      setCategory(categoryData);

      // Set products from response
      const productsData = categoryResponse.data?.data || categoryResponse.data?.products || [];
      setProducts(Array.isArray(productsData) ? productsData : []);

    } catch (error) {
      console.error('Error fetching category data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (categoryName && !fetchAttempted.current) {
      fetchCategoryData();
    }
  }, [categoryName]);

  const retry = () => {
    fetchAttempted.current = false;
    setError(null);
    fetchCategoryData();
  };

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  if (isLoading || error) {
    return (
      <div className="bg-black min-h-screen p-6">
        <div className="container mx-auto py-10 px-4">
          <LoadingErrorHandler 
            loading={isLoading} 
            error={error} 
            onRetry={retry}
          />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-black min-h-screen p-6">
        <div className="container mx-auto py-10 px-4 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-gray-400 mb-6">The category you're looking for doesn't exist.</p>
          <Link
            href="/categories"
            className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const displayCategoryName = category.name || decodeURIComponent(categoryName).replace("%20", " ");

  return (
    <div className="bg-black min-h-screen">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/categories"
              className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </Link>
            <div className="text-sm text-gray-400">
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {category.imageUrl && (
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={category.imageUrl}
                  alt={displayCategoryName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 capitalize">
                {displayCategoryName}
              </h1>
              <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                {category.description || `Explore our premium ${displayCategoryName} collection`}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold">
                  {products.length} Products
                </div>
                {category.tags && Array.isArray(category.tags) && category.tags.map((tag, index) => (
                  <div key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto py-12 px-4">
        {isLoadingProducts ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No Products Available</h3>
              <p className="text-gray-400 mb-6">
                There are no products in this category yet. Check back soon!
              </p>
              <Link
                href="/categories"
                className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-colors"
              >
                Browse Other Categories
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="text-white">
                <span className="text-gray-400">Showing </span>
                <span className="font-semibold">{products.length}</span>
                <span className="text-gray-400"> of {products.length} products</span>
              </div>
              
              <div className="flex gap-4">
                <select className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 focus:border-yellow-500 focus:outline-none">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A to Z</option>
                  <option>Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const productId = product._id || product.id;
                const productName = product.name || 'Unnamed Product';
                const productImage = product.imageUrl || product.images?.[0] || product.image;
                const productPrice = product.price;
                const productDescription = product.shortDescription || product.description;
                const imagesArray = Array.isArray(product.images) ? product.images : [product.images];
                const mainImage = imagesArray[0] || productImage;

                return (
                  <div
                    key={productId}
                    onClick={() => handleProductClick(productId)}
                    className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 w-full overflow-hidden">
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={productName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback when no image or image fails to load */}
                      {!mainImage && (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <button className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                        {productName}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {productDescription || 'No description available'}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="text-yellow-500 font-bold text-lg">
                          {productPrice ? `₦${productPrice}` : 'Price on request'}
                        </div>
                        
                        {product.isPopular && (
                          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Popular
                          </div>
                        )}
                      </div>

                      {/* Vendor and Stock Info */}
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex flex-col gap-2 text-sm text-gray-400">
                          {product.vendor && (
                            <div className="flex items-center">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                              <span>Vendor: {product.vendor}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            <span>Stock: {product.stock || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Features */}
                    {product.features && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Related Categories */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Explore Related Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Business Cards', 'Flyers', 'Brochures', 'Posters'].map((relatedCategory) => (
              <Link
                key={relatedCategory}
                href={`/categories/${encodeURIComponent(relatedCategory)}`}
                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors group"
              >
                <div className="text-yellow-500 text-lg font-semibold group-hover:text-yellow-400 transition-colors">
                  {relatedCategory}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}