'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '../providers/ThemeProvider'
import { usePathname } from 'next/navigation'
import { FaHome, FaFileAlt, FaYoutube, FaFileUpload, FaRulerCombined, FaClock } from 'react-icons/fa'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { RiMenuLine, RiCloseLine } from 'react-icons/ri'

const tools = [
  {
    category: 'Texte',
    icon: <FaFileAlt className="h-5 w-5" />,
    items: [
      { 
        name: 'Correction de texte', 
        path: '/tools/text-correction', 
        description: 'Corrigez vos textes en plusieurs langues',
        icon: <FaFileAlt className="h-5 w-5" />
      }
    ]
  },
  {
    category: 'Médias',
    icon: <FaYoutube className="h-5 w-5" />,
    items: [
      { 
        name: 'Extracteur de miniatures YouTube', 
        path: '/tools/youtube-thumbnail', 
        description: 'Extrayez les miniatures de vidéos',
        icon: <FaYoutube className="h-5 w-5" />
      },
      { 
        name: 'Convertisseur de fichiers', 
        path: '/tools/file-converter', 
        description: 'Convertissez vos fichiers',
        icon: <FaFileUpload className="h-5 w-5" />
      }
    ]
  },
  {
    category: 'Mesures & Temps',
    icon: <FaRulerCombined className="h-5 w-5" />,
    items: [
      { 
        name: 'Convertisseur d\'unités', 
        path: '/tools/unit-converter', 
        description: 'Convertissez différentes unités',
        icon: <FaRulerCombined className="h-5 w-5" />
      },
      { 
        name: 'Outils de temps', 
        path: '/tools/timer', 
        description: 'Gérez votre temps',
        icon: <FaClock className="h-5 w-5" />
      }
    ]
  }
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
                <img src="images/zutools.png" alt="logo" className='w-44'/>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8 items-center">
              <Link 
                href="/"
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FaHome className="h-5 w-5" />
                <span>Accueil</span>
              </Link>

              {tools.map((category) => (
                <div key={category.category} className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    {category.icon}
                    <span>{category.category}</span>
                    <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute z-10 left-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`group flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                            pathname === item.path
                              ? 'bg-gray-50 dark:bg-gray-600'
                              : ''
                          }`}
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-800">
                            {item.icon}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <MdLightMode className="h-6 w-6" />
              ) : (
                <MdDarkMode className="h-6 w-6" />
              )}
            </button>

            {/* Bouton menu mobile */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="sr-only">Ouvrir le menu</span>
                {isMobileMenuOpen ? (
                  <RiCloseLine className="h-6 w-6" />
                ) : (
                  <RiMenuLine className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`flex items-center px-4 py-2 text-base font-medium ${
                pathname === '/'
                  ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FaHome className="h-5 w-5 mr-3" />
              Accueil
            </Link>

            {tools.map((category) => (
              <div key={category.category}>
                <div className="px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                  {category.icon}
                  <span>{category.category}</span>
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
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900">
                        {item.icon}
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
