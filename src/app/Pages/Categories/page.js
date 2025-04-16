import Link from 'next/link';
import products from "../../../../public/Products/products.json";

export default function CategoriesPage() {
  // Get unique categories and count products in each
  const categoryCounts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const uniqueCategories = Object.keys(categoryCounts);

  return (
    <div className="bg-black min-h-screen p-6">
      {/* Header Section */}
      <div className="w-[90%] h-60 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center shadow-md rounded-lg mb-8">
        <h1 className="text-3xl font-bold">Shop by Category</h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueCategories.map((category) => (
          <Link
            key={category}
            href={`/Pages/Categories/${encodeURIComponent(category)}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2 capitalize">{category}</h2>
              <p className="text-gray-600">{categoryCounts[category]} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}