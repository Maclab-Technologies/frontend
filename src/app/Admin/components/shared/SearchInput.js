'use client';

import { FaSearch } from 'react-icons/fa';

export default function SearchInput({ 
  placeholder = 'Search...', 
  value, 
  onChange,
  className = ''
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <FaSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}