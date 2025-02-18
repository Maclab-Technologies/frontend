export default function Products() {
    const sampleProducts = [
      {
        id: 1,
        name: "Business Card",
        price: 10,
        image: "https://source.unsplash.com/400x300/?business,card",
      },
      {
        id: 2,
        name: "Flyer Printing",
        price: 15,
        image: "https://source.unsplash.com/400x300/?flyer,printing",
      },
      {
        id: 3,
        name: "Custom T-Shirts",
        price: 20,
        image: "https://source.unsplash.com/400x300/?tshirt,print",
      },
      {
        id: 4,
        name: "Poster Printing",
        price: 25,
        image: "https://source.unsplash.com/400x300/?poster,printing",
      },
      {
        id: 5,
        name: "Sticker Printing",
        price: 5,
        image: "https://source.unsplash.com/400x300/?sticker,printing",
      },
    ];
  
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Our Products</h1>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sampleProducts.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-2">${product.price}</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  