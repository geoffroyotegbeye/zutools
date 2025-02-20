'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '../providers/ThemeProvider'

const tools = [
  {
    name: 'Correcteur de texte',
    description: 'Corrigez vos textes en plusieurs langues',
    href: '/tools/text-correction',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    name: 'Miniatures YouTube',
    description: 'Extrayez les miniatures de vidéos',
    href: '/tools/youtube-thumbnail',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export function Header() {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">ZuTools</span>
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-8">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="hidden sm:inline">Accueil</span>
          </Link>
          <div className="relative">
            <button
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              onMouseEnter={() => setIsToolsMenuOpen(true)}
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              <span className="ml-2 hidden sm:inline">Outils</span>
              <svg
                className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menu déroulant */}
            {isToolsMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[1000]"
                onMouseLeave={() => setIsToolsMenuOpen(false)}
              >
                <div className="py-1">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900 group-hover:bg-blue-100 dark:group-hover:bg-blue-800">
                        {tool.icon}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {tool.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
