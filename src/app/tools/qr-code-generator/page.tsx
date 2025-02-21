"use client";

import { useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
  const [text, setText] = useState<string>('');
  const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);

  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(text);
      setQrCodeSrc(dataUrl);
    } catch (err) {
      console.error('Erreur lors de la génération du code QR:', err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Générateur de Code QR
        </h1>
        <div className="mb-4">
          <label htmlFor="qr-text" className="block mb-2 text-sm font-medium text-gray-700">
            Texte ou lien à encoder
          </label>
          <input
            id="qr-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Entrez le texte ou le lien"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={generateQRCode}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Générer le Code QR
        </button>
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
  );
}
