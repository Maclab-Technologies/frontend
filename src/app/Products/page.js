"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', vendor: '' });

  useEffect(() => {
    fetch('/Products/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.category ? product.category === filters.category : true) &&
    (filters.vendor ? product.vendor === filters.vendor : true)
  );

  const categories = [...new Set(products.map((product) => product.category))];
  const vendors = [...new Set(products.map((product) => product.vendor).filter((vendor) => vendor !== 'N/A'))];

  return (
    <div className="bg-black w-full min-h-screen p-6">
      <div className="w-[90%] h-40 bg-yellow-500 text-black text-center mx-auto flex items-center justify-center rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">All Products</h1>
      </div>

      <div className="flex flex-wrap gap-4 mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="p-2 border rounded w-full md:w-auto focus:ring-2 focus:ring-yellow-500"
        />
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="p-2 border rounded">
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))} 
        </select>
        <select onChange={(e) => setFilters({ ...filters, vendor: e.target.value })} className="p-2 border rounded">
          <option value="">Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor} value={vendor}>{vendor}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg flex gap-3 items-center p-3 m-2">
            <Image
              src={product.images}
              alt={product.name}
              width={200}
              height={100}
              className="rounded-md object-cover w-100 h-64"
            />
            <div className="text-center mt-3">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-yellow-600 font-bold">${product.price}</p>
              <input
               className='w-20'
                placeholder='Quantity'
                type='number'
              ></input>
              <Link href={`/Products/${product.id}`} passHref>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  View Product
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
