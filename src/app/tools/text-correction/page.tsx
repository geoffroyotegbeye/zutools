'use client'

import { useState } from 'react'
import axios from 'axios'
import InteractiveText from './components/InteractiveText'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
]

export default function TextCorrection() {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('fr')
  const [corrections, setCorrections] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [success, setSuccess] = useState(false)

  const checkText = async (textToCheck: string) => {
    if (!textToCheck.trim()) return

    setLoading(true)
    setError('')
    setSuccess(false)
    setCorrections([])
    
    try {
      const formData = new URLSearchParams()
      formData.append('text', textToCheck)
      formData.append('language', language)
      
      const response = await axios.post('https://api.languagetool.org/v2/check', 
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      setCorrections(response.data.matches)
      if (response.data.matches.length === 0) {
        setSuccess(true)
      }
    } catch (err) {
      console.error('Erreur lors de la vérification:', err)
      setError('Une erreur est survenue lors de la vérification du texte.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    checkText(text)
  }

  const handleTextUpdate = async (newText: string) => {
    setText(newText)
    // Attendre un peu avant de revérifier pour éviter trop de requêtes rapides
    setTimeout(() => {
      checkText(newText)
    }, 500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
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
                  Correcteur de Texte Multilingue
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Corrigez instantanément vos textes dans différentes langues
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Langue
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value)
                      if (text.trim()) {
                        checkText(text)
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Votre texte
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="text"
                      rows={6}
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value)
                        setCorrections([])
                        setSuccess(false)
                      }}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                      placeholder="Entrez votre texte ici..."
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-lg rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50/80 dark:bg-green-900/30 backdrop-blur-lg rounded-md">
                    <p className="text-sm text-green-600 dark:text-green-400">Aucune erreur trouvée dans votre texte !</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !text.trim()}
                    className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading || !text.trim()
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {loading ? 'Vérification en cours...' : 'Vérifier le texte'}
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center py-2 px-4 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {copySuccess ? 'Copié !' : 'Copier le texte'}
                  </button>
                </div>

                {corrections.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Corrections suggérées ({corrections.length})
                    </h2>
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20">
                      <InteractiveText
                        text={text}
                        corrections={corrections}
                        onTextUpdate={handleTextUpdate}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section À propos */}
              <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  À propos du Correcteur de Texte Multilingue
                </h2>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400">
                    Le Correcteur de Texte Multilingue ZuTools est un outil avancé de correction orthographique et grammaticale qui prend en charge plusieurs langues. Il vous aide à améliorer la qualité de vos textes en détectant et en corrigeant les erreurs.
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Langues Supportées
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Français</li>
                        <li>English (Anglais)</li>
                        <li>Español (Espagnol)</li>
                        <li>Deutsch (Allemand)</li>
                        <li>Italiano (Italien)</li>
                        <li>Nederlands (Néerlandais)</li>
                        <li>Português (Portugais)</li>
                        <li>Русский (Russe)</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Types de Corrections
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Orthographe</li>
                        <li>Grammaire</li>
                        <li>Ponctuation</li>
                        <li>Style et clarté</li>
                        <li>Accord des mots</li>
                        <li>Conjugaison des verbes</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Comment utiliser
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>Sélectionnez la langue de votre texte dans le menu déroulant</li>
                      <li>Collez ou tapez votre texte dans la zone de texte</li>
                      <li>Cliquez sur "Vérifier le texte" pour lancer l'analyse</li>
                      <li>Examinez les suggestions de correction proposées</li>
                      <li>Cliquez sur les suggestions pour appliquer les corrections</li>
                      <li>Utilisez le bouton "Copier le texte" pour copier le texte corrigé</li>
                    </ol>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Fonctionnalités Avancées
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>Correction en temps réel pendant la saisie</li>
                      <li>Suggestions contextuelles intelligentes</li>
                      <li>Explication détaillée des erreurs</li>
                      <li>Interface interactive pour les corrections</li>
                      <li>Support du copier-coller rapide</li>
                    </ul>
                  </div>

                  <div className="mt-6 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-lg rounded-lg p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      <strong>Note :</strong> Cet outil utilise l'API LanguageTool pour fournir des corrections précises et pertinentes. Les suggestions sont basées sur des règles linguistiques avancées et sont constamment mises à jour pour améliorer la qualité des corrections.
                    </p>
                  </div>
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
