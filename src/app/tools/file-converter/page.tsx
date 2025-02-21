'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'
import { ConversionService } from './services/conversion'

interface ConversionOption {
  from: string
  to: string[]
  description: string
  icon: React.ReactNode
}

interface FileToConvert {
  file: File
  targetFormat: string
  converted: boolean
  converting: boolean
  error?: string
  downloadUrl?: string
  progress?: number
  stage?: string
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const conversionOptions: ConversionOption[] = [
  {
    from: 'image/*',
    to: ['jpg', 'png', 'webp', 'gif', 'bmp'],
    description: 'Images (JPG, PNG, WEBP, GIF, BMP)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    from: 'application/pdf',
    to: ['jpg', 'png', 'txt'],
    description: 'PDF vers Image ou Texte',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    from: 'audio/*',
    to: ['mp3', 'wav', 'ogg', 'm4a'],
    description: 'Audio (MP3, WAV, OGG, M4A)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    from: 'video/*',
    to: ['mp4', 'webm', 'gif'],
    description: 'Vidéo (MP4, WEBM, GIF)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-4.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function FileConverter() {
  const [files, setFiles] = useState<FileToConvert[]>([])
  const [batchFormat, setBatchFormat] = useState<string>('')
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      targetFormat: '',
      converted: false,
      converting: false
    }))
    setFiles(prev => [...prev, ...newFiles])
    setError('')
    setSuccess('')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: conversionOptions.reduce((acc, option) => {
      acc[option.from] = []
      return acc
    }, {} as { [key: string]: string[] }),
  })

  const handleFormatChange = (fileIndex: number, format: string) => {
    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? { ...f, targetFormat: format } : f
    ))
  }

  const handleBatchFormatChange = (format: string) => {
    setBatchFormat(format)
  }

  const convertFile = async (file: File, targetFormat: string): Promise<string> => {
    try {
      const convertedBlob = await ConversionService.convert(
        file,
        targetFormat,
        ({ progress, stage }) => {
          setFiles(prev => prev.map(f => 
            f.file === file ? { ...f, progress, stage } : f
          ));
        }
      );
      return URL.createObjectURL(convertedBlob);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Conversion failed: ${error.message}`);
      } else {
        throw new Error('Conversion failed: Unknown error');
      }
    }
  }

  const handleSingleConversion = async (fileIndex: number) => {
    const fileToConvert = files[fileIndex]
    if (!fileToConvert.targetFormat) {
      setError('Veuillez sélectionner un format de conversion')
      return
    }

    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? { ...f, converting: true, error: undefined } : f
    ))

    try {
      const downloadUrl = await convertFile(fileToConvert.file, fileToConvert.targetFormat)
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, converting: false, converted: true, downloadUrl } : f
      ))
    } catch (err) {
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, converting: false, error: 'Erreur lors de la conversion' } : f
      ))
    }
  }

  const handleBatchConversion = async () => {
    if (!batchFormat) {
      setError('Veuillez sélectionner un format de conversion pour le lot')
      return
    }

    setConverting(true)
    setError('')
    setSuccess('')

    try {
      const conversions = files.map(async (fileItem) => {
        const downloadUrl = await convertFile(fileItem.file, batchFormat)
        return { ...fileItem, converted: true, downloadUrl }
      })

      const convertedFiles = await Promise.all(conversions)
      setFiles(convertedFiles)
      setSuccess('Conversion de tous les fichiers terminée')
    } catch (err) {
      setError('Une erreur est survenue pendant la conversion du lot')
    } finally {
      setConverting(false)
    }
  }

  const downloadAll = async () => {
    const zip = new JSZip()
    
    files.forEach((fileItem) => {
      if (fileItem.converted && fileItem.downloadUrl) {
        const fileName = `${fileItem.file.name.split('.')[0]}.${fileItem.targetFormat || batchFormat}`
        zip.file(fileName, fileItem.downloadUrl)
      }
    })

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = 'converted_files.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getAvailableFormats = (fileType: string) => {
    const option = conversionOptions.find(opt => 
      fileType.startsWith(opt.from.replace('/*', ''))
    )
    return option?.to || []
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
                  Convertisseur de Fichiers
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Convertissez facilement vos fichiers dans différents formats
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg p-6">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-2">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-gray-600 dark:text-gray-300">
                      {isDragActive ? (
                        <p className="text-blue-500 dark:text-blue-400">Déposez les fichiers ici...</p>
                      ) : (
                        <div>
                          <p className="font-medium">Glissez et déposez vos fichiers ici</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ou cliquez pour sélectionner</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-6 space-y-6">
                    {files.map((fileItem, index) => (
                      <div
                        key={index}
                        className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <span className="font-medium">{fileItem.file.name}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                ({formatBytes(fileItem.file.size)})
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <select
                              value={fileItem.targetFormat}
                              onChange={(e) => handleFormatChange(index, e.target.value)}
                              className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                            >
                              <option value="">Sélectionnez un format</option>
                              {getAvailableFormats(fileItem.file.type).map((format) => (
                                <option key={format} value={format}>
                                  .{format}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => handleSingleConversion(index)}
                            disabled={fileItem.converting || !fileItem.targetFormat}
                            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {fileItem.converting ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {fileItem.stage || 'Conversion...'} {fileItem.progress ? `(${fileItem.progress}%)` : ''}
                              </span>
                            ) : fileItem.converted ? (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Télécharger
                              </span>
                            ) : (
                              'Convertir'
                            )}
                          </button>
                        </div>

                        {fileItem.error && (
                          <div className="p-3 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-lg rounded-md">
                            <p className="text-sm text-red-600 dark:text-red-400">{fileItem.error}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <select
                            value={batchFormat}
                            onChange={(e) => handleBatchFormatChange(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                          >
                            <option value="">Sélectionnez un format pour tous les fichiers</option>
                            {Array.from(new Set(files.flatMap(f => getAvailableFormats(f.file.type)))).map((format) => (
                              <option key={format} value={format}>.{format}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleBatchConversion}
                          disabled={converting || !batchFormat || files.length === 0}
                          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {converting ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Conversion en cours...
                            </span>
                          ) : (
                            'Convertir tous les fichiers'
                          )}
                        </button>

                        {files.some(f => f.converted) && (
                          <button
                            onClick={downloadAll}
                            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Télécharger tout (.zip)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-lg rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mt-4 p-4 bg-green-50/80 dark:bg-green-900/30 backdrop-blur-lg rounded-md">
                    <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                  </div>
                )}
              </div>

              <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  À propos du Convertisseur de Fichiers
                </h2>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400">
                    Le Convertisseur de Fichiers ZuTools est un outil puissant et facile à utiliser qui vous permet de convertir vos fichiers entre différents formats. Voici les principales fonctionnalités :
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Formats Supportés
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Images : JPG, PNG, WEBP, GIF, BMP</li>
                        <li>Documents : PDF vers Image/Texte</li>
                        <li>Audio : MP3, WAV, OGG, M4A</li>
                        <li>Vidéo : MP4, WEBM, GIF</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Fonctionnalités
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                        <li>Conversion de plusieurs fichiers à la fois</li>
                        <li>Glisser-déposer de fichiers</li>
                        <li>Conversion par lot avec le même format</li>
                        <li>Téléchargement individuel ou groupé (ZIP)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Comment utiliser
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>Glissez-déposez vos fichiers ou cliquez pour les sélectionner</li>
                      <li>Choisissez le format de sortie pour chaque fichier</li>
                      <li>Cliquez sur "Convertir" pour lancer la conversion</li>
                      <li>Téléchargez vos fichiers convertis individuellement ou en lot</li>
                    </ol>
                  </div>

                  <div className="mt-6 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-lg rounded-lg p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      <strong>Note :</strong> La conversion est effectuée localement dans votre navigateur pour garantir la confidentialité de vos fichiers. Aucun fichier n'est envoyé à un serveur externe.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Formats supportés
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {conversionOptions.map((option) => (
                    <div
                      key={option.from}
                      className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="text-blue-500 dark:text-blue-400">
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {option.description}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Formats de sortie : {option.to.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Espace publicitaire droit */}
        <div className="hidden xl:block w-48 flex-shrink-0">
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
