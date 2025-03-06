'use client'

import React, { useState } from 'react'

export default function PasswordGeneratorPage() {
  const [passwordLength, setPasswordLength] = useState<number>(12)
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true)
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true)
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true)
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true)
  const [generatedPassword, setGeneratedPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState<boolean>(false)

  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numberChars = '0123456789'
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?'

    let allChars = ''
    if (includeUppercase) allChars += uppercaseChars
    if (includeLowercase) allChars += lowercaseChars
    if (includeNumbers) allChars += numberChars
    if (includeSymbols) allChars += symbolChars

    if (!allChars) {
      setError('Veuillez sélectionner au moins un type de caractère.')
      setGeneratedPassword('')
      return
    }

    let newPassword = ''
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length)
      newPassword += allChars[randomIndex]
    }

    setGeneratedPassword(newPassword)
    setError('') // Reset error if password is generated successfully
  }

  const copyToClipboard = async () => {
    if (!generatedPassword) return
    try {
      await navigator.clipboard.writeText(generatedPassword)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000) // Reset success message after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err)
      setCopySuccess(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900 dark:via-gray-900 dark:to-purple-900 py-8">
      {/* Container principal avec espaces publicitaires */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
        {/* Espace publicitaire gauche */}
        <div className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 h-[400px]">
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                Espace publicitaire
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Générateur de Mot de Passe
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Créez un mot de passe sécurisé et personnalisé
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); generatePassword() }} className="space-y-4">
                <div>
                  <label htmlFor="password-length" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Longueur du mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="password-length"
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(Number(e.target.value))}
                      min="4"
                      max="40"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Inclure les caractères suivants :</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                      />
                      <span>Majuscules</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                      />
                      <span>Minuscules</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                      />
                      <span>Chiffres</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                      />
                      <span>Symboles</span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-lg rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Générer le mot de passe
                  </button>
                </div>
              </form>

              {generatedPassword && (
                <div className="mt-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mot de passe généré</h2>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    <p className="text-lg text-gray-800 dark:text-white">{generatedPassword}</p>
                    <button
                      onClick={copyToClipboard}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Copier
                    </button>
                    {copySuccess && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                        Mot de passe copié dans le presse-papier !
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Section À propos */}
              <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  À propos du générateur de mot de passe
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400">
                    Le générateur de mot de passe ZuTools vous aide à créer des mots de passe complexes et sécurisés en fonction de vos critères.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Espace publicitaire droit */}
        <div className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 h-[400px]">
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                Espace publicitaire
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
