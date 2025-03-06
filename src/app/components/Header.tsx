'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '../providers/ThemeProvider'
import { usePathname } from 'next/navigation'
import { FaHome, FaFileAlt, FaYoutube, FaFileUpload, FaRulerCombined, FaClock, FaTools, FaCalculator } from 'react-icons/fa'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { RiMenuLine, RiCloseLine } from 'react-icons/ri'

// Fusion de tous les outils dans un seul tableau
const allTools = [
  { 
    name: 'Correction de texte', 
    path: '/tools/text-correction', 
    description: 'Corrigez vos textes en plusieurs langues',
    icon: <FaFileAlt className="h-5 w-5" />,
    category: 'Texte'
  },
  { 
    name: 'Extracteur de miniatures YouTube', 
    path: '/tools/youtube-thumbnail', 
    description: 'Extrayez les miniatures de vidéos',
    icon: <FaYoutube className="h-5 w-5" />,
    category: 'Médias'
  },
  { 
    name: 'Convertisseur de fichiers', 
    path: '/tools/file-converter', 
    description: 'Convertissez vos fichiers',
    icon: <FaFileUpload className="h-5 w-5" />,
    category: 'Médias'
  },
  { 
    name: 'Convertisseur d\'unités', 
    path: '/tools/unit-converter', 
    description: 'Convertissez différentes unités',
    icon: <FaRulerCombined className="h-5 w-5" />,
    category: 'Mesures & Temps'
  },
  { 
    name: 'Outils de temps', 
    path: '/tools/timer', 
    description: 'Gérez votre temps',
    icon: <FaClock className="h-5 w-5" />,
    category: 'Mesures & Temps'
  },
  { 
    name: 'Calculatrice', 
    path: '/tools/calculator', 
    description: 'Faites des calculs',
    icon: <FaCalculator className="h-5 w-5" />,
    category: 'Calcul'
  },
  {
    name: 'Convertisseur de devises',
    path: '/tools/devise-converter',
    description: 'Convertissez vos devises',
    icon: <FaCalculator className="h-5 w-5" />,
    category: 'Calcul'
  },
  {
    name: 'Génrateur de mot de passe',
    path: '/tools/password-generator',
    description: 'Génere un mot de passe',
    icon: <FaCalculator className="h-5 w-5" />,
    category: 'Calcul'
  },
  {
    name: 'Génrateur de code QR',
    path: '/tools/qr-code-generator',
    description: 'Génere un code QR',
    icon: <FaCalculator className="h-5 w-5" />,
    category: 'Calcul'
  },
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
                <img src="/images/zutools.png" alt="logo" className='w-44'/>
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

              {/* Menu Outils avec dropdown en grille */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <FaTools className="h-5 w-5" />
                  <span>Outils</span>
                  <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute z-10 left-0 mt-2 w-auto min-w-max rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 min-w-[600px]">
                      {allTools.map((tool) => (
                        <Link
                          key={tool.path}
                          href={tool.path}
                          className={`group flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 ${
                            pathname === tool.path
                              ? 'bg-gray-50 dark:bg-gray-600'
                              : ''
                          }`}
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-800">
                            {tool.icon}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {tool.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {tool.description}
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                              {tool.category}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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

            {/* Section Outils dans le menu mobile */}
            <div>
              <div className="px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                <FaTools className="h-5 w-5" />
                <span>Outils</span>
              </div>
              <div className="pl-8 space-y-2">
                {allTools.map((tool) => (
                  <Link
                    key={tool.path}
                    href={tool.path}
                    className={`block pr-4 py-2 text-base font-medium ${
                      pathname === tool.path
                        ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900">
                        {tool.icon}
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium">{tool.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {tool.category} - {tool.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}