'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface ConversionOption {
  from: string
  to: string[]
  description: string
}

const conversionOptions: ConversionOption[] = [
  {
    from: 'image/*',
    to: ['jpg', 'png', 'webp', 'gif', 'bmp'],
    description: 'Images (JPG, PNG, WEBP, GIF, BMP)',
  },
  {
    from: 'application/pdf',
    to: ['jpg', 'png', 'txt'],
    description: 'PDF vers Image ou Texte',
  },
  {
    from: 'audio/*',
    to: ['mp3', 'wav', 'ogg', 'm4a'],
    description: 'Audio (MP3, WAV, OGG, M4A)',
  },
  {
    from: 'video/*',
    to: ['mp4', 'webm', 'gif'],
    description: 'Vidéo (MP4, WEBM, GIF)',
  },
]

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>('')
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setError('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: conversionOptions.reduce((acc, option) => {
      acc[option.from] = []
      return acc
    }, {} as { [key: string]: string[] }),
  })

  const handleConversion = async () => {
    if (!file || !targetFormat) {
      setError('Veuillez sélectionner un fichier et un format cible')
      return
    }

    setConverting(true)
    setError('')

    try {
      // Ici nous utiliserons des bibliothèques côté client pour la conversion
      // Pour l'instant, c'est un placeholder
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // TODO: Implémenter la conversion réelle
      
    } catch (err) {
      setError('Une erreur est survenue pendant la conversion')
    } finally {
      setConverting(false)
    }
  }

  const getAvailableFormats = () => {
    if (!file) return []
    const option = conversionOptions.find(opt => 
      file.type.startsWith(opt.from.replace('/*', ''))
    )
    return option?.to || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Espace publicitaire gauche */}
          <div className="hidden lg:block lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 h-[600px]">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Espace publicitaire
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Convertisseur de Fichiers
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-gray-600 dark:text-gray-300">
                  {isDragActive ? (
                    <p>Déposez le fichier ici...</p>
                  ) : (
                    <p>
                      Glissez et déposez un fichier ici, ou cliquez pour sélectionner
                    </p>
                  )}
                </div>
              </div>

              {file && (
                <div className="mt-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Fichier sélectionné : {file.name}
                  </p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Format de conversion :
                    </label>
                    <select
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <option value="">Sélectionnez un format</option>
                      {getAvailableFormats().map((format) => (
                        <option key={format} value={format}>
                          .{format}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleConversion}
                    disabled={converting || !targetFormat}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {converting ? 'Conversion en cours...' : 'Convertir'}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 text-red-500 dark:text-red-400">{error}</div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Formats supportés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conversionOptions.map((option) => (
                  <div
                    key={option.from}
                    className="p-4 border rounded-lg dark:border-gray-700"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {option.description}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Formats de sortie : {option.to.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Espace publicitaire droit */}
          <div className="hidden lg:block lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 h-[600px]">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Espace publicitaire
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
