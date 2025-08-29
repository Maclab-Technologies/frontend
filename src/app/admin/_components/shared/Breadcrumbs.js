import Link from 'next/link'
import { FiChevronRight } from 'react-icons/fi'

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <FiChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}
            {index === items.length - 1 ? (
              <span className="text-sm font-medium text-gray-500">
                {item.label}
              </span>
            ) : (
              <Link href={item.href}>
                <a className="text-sm font-medium text-yellow-600 hover:text-yellow-700">
                  {item.label}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}