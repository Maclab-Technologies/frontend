// import { notFound } from 'next/navigation';
// import axios from 'axios';
// import Link from 'next/link';
// import Image from 'next/image';

// export default async function CategoryPage(params) {
//   const decodedCategory = decodeURIComponent(params.category);

//   try {
//     const baseUrl = process.env.API_KEY;

//     const response = await axios.get(`${baseUrl}/category/product/${decodedCategory}`);
//     const fetchedProducts = response.data;

//     const filteredProducts = fetchedProducts.filter(
//       product => product.category.toLowerCase() === decodedCategory.toLowerCase()
//     );

//     if (filteredProducts.length === 0) {
//       notFound();
//     }

//     return (
//       <div className="bg-black min-h-screen p-6">
//         <div className="w-[90%] h-60 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center shadow-md rounded-lg mb-8">
//           <h1 className="text-3xl font-bold capitalize">{decodedCategory}</h1>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {filteredProducts.map((product) => {
//             const imagesArray = Array.isArray(product.images) ? product.images : [product.images];
//             const mainImage = imagesArray[0] || "/fallback-image.png";

//             return (
//               <Link
//                 key={product.id}
//                 href={`/Products/${product.id}`}
//                 className="bg-white rounded-lg shadow-lg flex flex-col m-2 p-3 transition-transform transform hover:scale-105"
//               >
//                 <div className="w-full h-48 relative">
//                   <Image
//                     src={mainImage}
//                     alt={product.name}
//                     fill
//                     className="rounded-md object-cover"
//                   />
//                 </div>

//                 <div className="p-4 text-center">
//                   <h2 className="text-lg font-semibold">{product.name}</h2>
//                   <p className="text-yellow-600 font-bold">
//                     ₦{typeof product.price === 'string' ? product.price : product.price.toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-500">Stock: {product.stock}</p>
//                   <p className="text-sm text-gray-500">Vendor: {product.vendor}</p>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error('Internal error: ', error.message);
//     return (
//       <div className="text-red-500 text-center p-10">
//         <p>Oops! Could not load products. Try again later.</p>
//       </div>
//     );
//   }
// }
