'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const tools = [
  {
    category: 'Texte',
    items: [
      { name: 'Correction de texte', path: '/tools/text-correction' },
    ]
  },
  {
    category: 'Médias',
    items: [
      { name: 'Extracteur de miniatures YouTube', path: '/tools/youtube-thumbnail' },
      { name: 'Convertisseur de fichiers', path: '/tools/file-converter' },
    ]
  },
  {
    category: 'Mesures & Temps',
    items: [
      { name: 'Convertisseur d\'unités', path: '/tools/unit-converter' },
      { name: 'Outils de temps', path: '/tools/timer' },
    ]
  }
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                ZuTools
              </Link>
            </div>
            
            {/* Navigation desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tools.map((category) => (
                <div key={category.category} className="relative group">
                  <button className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    {category.category}
                    <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`block px-4 py-2 text-sm ${
                            pathname === item.path
                              ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton menu mobile */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Ouvrir le menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {tools.map((category) => (
            <div key={category.category}>
              <div className="px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400">
                {category.category}
              </div>
              {category.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block pl-8 pr-4 py-2 text-base font-medium ${
                    pathname === item.path
                      ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
