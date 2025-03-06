'use client'

import { useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeGenerator() {
  const [text, setText] = useState<string>('')
  const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null)

  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(text)
      setQrCodeSrc(dataUrl)
    } catch (err) {
      console.error('Erreur lors de la génération du code QR:', err)
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
                  Générateur de Code QR
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Générez facilement des codes QR à partir de texte ou d'URL.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); generateQRCode() }} className="space-y-4">
                <div>
                  <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Texte ou lien à encoder
                  </label>
                  <div className="mt-1">
                    <input
                      id="qr-text"
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Entrez le texte ou le lien"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Générer le Code QR
                  </button>
                </div>
              </form>

              {qrCodeSrc && (
                <div className="mt-6 text-center">
                  <img src={qrCodeSrc} alt="Code QR généré" className="mx-auto" />
                  <a
                    href={qrCodeSrc}
                    download="qrcode.png"
                    className="mt-2 inline-block px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Télécharger le Code QR
                  </a>
                </div>
              )}
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
