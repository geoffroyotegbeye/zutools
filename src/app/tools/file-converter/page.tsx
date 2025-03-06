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
    const fileToConvert = files[fileIndex];
    if (!fileToConvert.targetFormat) {
      setError('Veuillez sélectionner un format de conversion');
      return;
    }
  
    setFiles(prev => prev.map((f, i) =>
      i === fileIndex ? { ...f, converting: true, error: undefined } : f
    ));
  
    try {
      // Appel à la méthode de conversion
      const downloadUrl = await ConversionService.convert(fileToConvert.file, fileToConvert.targetFormat, (progress) => {
        // Optionnel: mettre à jour la progression de la conversion
        setFiles(prev => prev.map((f, i) =>
          i === fileIndex ? { ...f, progress: progress.progress, stage: progress.stage } : f
        ));
      });
  
      setFiles(prev => {
        return prev.map((f, i) =>
          i === fileIndex ? { ...f, converting: false, converted: true, downloadUrl: downloadUrl || '' } : f
        );
      });      
  
      setSuccess('Conversion réussie');
    } catch (err) {
      setFiles(prev => prev.map((f, i) =>
        i === fileIndex ? { ...f, converting: false, error: 'Erreur lors de la conversion' } : f
      ));
      setError('Une erreur est survenue pendant la conversion');
    }
  };

  const handleBatchConversion = async () => {
    if (!batchFormat) {
      setError('Veuillez sélectionner un format de conversion pour le lot')
      return
    }

    setConverting(true)
    setError('')
    setSuccess('')

    try {
      const conversions = files.map(async (fileItem, index) => {
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, converting: true, error: undefined } : f
        ))
        
        try {
          const downloadUrl = await convertFile(fileItem.file, batchFormat)
          return { ...fileItem, converted: true, converting: false, downloadUrl, targetFormat: batchFormat }
        } catch (err) {
          return { ...fileItem, converting: false, error: 'Erreur lors de la conversion' }
        }
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
    const zip = new JSZip();
    
    // On utilise un for...of pour garantir que tous les fetch sont terminés avant de continuer
    for (const fileItem of files) {
      if (fileItem.converted && fileItem.downloadUrl) {
        const fileName = `${fileItem.file.name.split('.')[0]}.${fileItem.targetFormat || batchFormat}`;
        
        try {
          // On fetch le fichier blob et on l'ajoute au zip
          const res = await fetch(fileItem.downloadUrl);
          const blob = await res.blob();
          zip.file(fileName, blob);
        } catch (error) {
          console.error(`Erreur lors de la récupération de ${fileItem.file.name}:`, error);
        }
      }
    }
  
    try {
      // Générer le fichier ZIP et le télécharger
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted_files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de la génération du fichier ZIP:', error);
    }
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
                  Convertissez facilement vos fichiers dans différents formats.
                </p>
              </div>

              {/* Zone de drop pour les fichiers */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
                  </svg>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">
                    {isDragActive
                      ? 'Déposez les fichiers ici...'
                      : 'Glissez-déposez vos fichiers ici, ou cliquez pour sélectionner'}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Formats supportés: Images, PDF, Audio, Vidéo
                  </p>
                </div>
              </div>
              
              {/* Messages d'erreur et de succès */}
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md">
                  {success}
                </div>
              )}

              {/* Liste des fichiers */}
              {files.length > 0 && (
                <div className="space-y-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Fichier
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Format
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Statut
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900/40 dark:divide-gray-700">
                        {files.map((fileItem, index) => {
                          const formats = getAvailableFormats(fileItem.file.type)
                          
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                                    {conversionOptions.find(opt => 
                                      fileItem.file.type.startsWith(opt.from.replace('/*', ''))
                                    )?.icon || (
                                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                      {fileItem.file.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {formatBytes(fileItem.file.size)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select 
                                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                                  value={fileItem.targetFormat}
                                  onChange={(e) => handleFormatChange(index, e.target.value)}
                                  disabled={fileItem.converting || fileItem.converted}
                                >
                                  <option value="">Sélectionnez un format</option>
                                  {formats.map(format => (
                                    <option key={format} value={format}>.{format}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {fileItem.converting ? (
                                  <div className="flex flex-col">
                                    <div className="text-sm text-blue-600 dark:text-blue-400">
                                      Conversion en cours...
                                    </div>
                                    {fileItem.progress !== undefined && (
                                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                                        <div 
                                          className="bg-blue-600 h-2.5 rounded-full" 
                                          style={{ width: `${fileItem.progress}%` }}
                                        ></div>
                                      </div>
                                    )}
                                    {fileItem.stage && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {fileItem.stage}
                                      </div>
                                    )}
                                  </div>
                                ) : fileItem.converted ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Converti
                                  </span>
                                ) : fileItem.error ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    Erreur
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                    En attente
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                {fileItem.converted && fileItem.downloadUrl ? (
                                  <a
                                    href={fileItem.downloadUrl}
                                    download={`${fileItem.file.name.split('.')[0]}.${fileItem.targetFormat}`}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    Télécharger
                                  </a>
                                ) : !fileItem.converting && !fileItem.converted ? (
                                  <button
                                    onClick={() => handleSingleConversion(index)}
                                    disabled={!fileItem.targetFormat}
                                    className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 dark:text-blue-400 dark:hover:text-blue-300 dark:disabled:text-gray-600"
                                  >
                                    Convertir
                                  </button>
                                ) : null}
                                <button
                                  onClick={() => removeFile(index)}
                                  disabled={fileItem.converting}
                                  className="text-red-600 hover:text-red-900 disabled:text-gray-400 dark:text-red-400 dark:hover:text-red-300 dark:disabled:text-gray-600"
                                >
                                  Supprimer
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions de lot */}
                  {files.length > 1 && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          Format de lot:
                        </label>
                        <select
                          className="rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                          value={batchFormat}
                          onChange={(e) => handleBatchFormatChange(e.target.value)}
                          disabled={converting}
                        >
                          <option value="">Sélectionnez un format</option>
                          {/* On affiche que les formats communs à tous les fichiers */}
                          {files.length > 0 && 
                            (() => {
                              const allFormats = files.map(f => 
                                getAvailableFormats(f.file.type)
                              )
                              const commonFormats = allFormats.reduce((acc, formats) => 
                                acc.filter(format => formats.includes(format))
                              )
                              return commonFormats.map(format => (
                                <option key={format} value={format}>.{format}</option>
                              ))
                            })()
                          }
                        </select>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleBatchConversion}
                          disabled={converting || !batchFormat}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-500/50 text-white rounded-md"
                        >
                          {converting ? 'Conversion en cours...' : 'Convertir tout'}
                        </button>
                        {files.some(f => f.converted) && (
                          <button
                            onClick={downloadAll}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                          >
                            Télécharger tout (.zip)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Types de conversion supportés */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Types de conversion supportés
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {conversionOptions.map((option, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-blue-500 dark:text-blue-400">
                          {option.icon}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {option.description}
                          </h3>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Formats: {option.to.map(f => `.${f}`).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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