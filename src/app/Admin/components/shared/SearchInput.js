import { FiSearch, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function SearchInput({ placeholder = 'Search...', onSearch }) {
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <FiX className="text-gray-400 hover:text-gray-500" />
        </button>
      )}
    </form>
  )
}