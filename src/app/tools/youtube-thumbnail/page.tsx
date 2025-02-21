'use client'

import { useState } from 'react'

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState('')
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [error, setError] = useState('')

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[7].length === 11 ? match[7] : null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setThumbnails([])

    const videoId = extractVideoId(url)
    if (!videoId) {
      setError('URL YouTube invalide')
      return
    }

    const thumbnailUrls = [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    ]

    setThumbnails(thumbnailUrls)
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
                  Extracteur de Miniatures YouTube
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Téléchargez facilement les miniatures de vos vidéos YouTube préférées
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL de la vidéo
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                    />
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
                    Extraire les miniatures
                  </button>
                </div>
              </form>

              {thumbnails.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Miniatures disponibles
                  </h2>
                  <div className="grid gap-6">
                    {thumbnails.map((url, index) => (
                      <div key={index} className="space-y-2">
                        <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                          <img
                            src={url}
                            alt={`Miniature ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement
                              img.style.display = 'none'
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Qualité : {['Maximale', 'Standard HD', 'Haute', 'Moyenne'][index]}
                          </span>
                          <a
                            href={url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Télécharger
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section À propos */}
              <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  À propos de l&apos;Extracteur de Miniatures YouTube
                </h2>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400">
                    L&apos;Extracteur de Miniatures YouTube ZuTools est un outil pratique qui vous permet de télécharger facilement les images de prévisualisation (thumbnails) de n&apos;importe quelle vidéo YouTube en différentes qualités.
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Formats Disponibles
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Maximale (1920x1080)</li>
                        <li>Standard HD (1280x720)</li>
                        <li>Haute qualité (480x360)</li>
                        <li>Qualité moyenne (320x180)</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Fonctionnalités
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Extraction instantanée</li>
                        <li>Prévisualisation des images</li>
                        <li>Téléchargement direct</li>
                        <li>Support de tous les formats d&apos;URL YouTube</li>
                        <li>Interface intuitive</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Comment utiliser
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>Copiez l&apos;URL de la vidéo YouTube souhaitée</li>
                      <li>Collez l&apos;URL dans le champ de saisie</li>
                      <li>Cliquez sur "Extraire les miniatures"</li>
                      <li>Choisissez la qualité d&apos;image souhaitée</li>
                      <li>Cliquez sur "Télécharger" pour sauvegarder l&apos;image</li>
                    </ol>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Formats d&apos;URL Supportés
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>Standard : youtube.com/watch?v=VIDEO_ID</li>
                      <li>Court : youtu.be/VIDEO_ID</li>
                      <li>Intégré : youtube.com/embed/VIDEO_ID</li>
                      <li>Playlist : youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID</li>
                    </ul>
                  </div>

                  <div className="mt-6 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-lg rounded-lg p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      <strong>Note :</strong> Certaines miniatures en haute qualité peuvent ne pas être disponibles pour toutes les vidéos. Dans ce cas, l&apos;outil vous proposera automatiquement la meilleure qualité disponible.
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
