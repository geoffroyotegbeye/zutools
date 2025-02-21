"use client";

import { useState } from 'react';

export default function PasswordGenerator() {
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let allChars = '';
    if (includeUppercase) allChars += uppercaseChars;
    if (includeLowercase) allChars += lowercaseChars;
    if (includeNumbers) allChars += numberChars;
    if (includeSymbols) allChars += symbolChars;

    if (allChars === '') {
      setGeneratedPassword('');
      alert('Veuillez sélectionner au moins un type de caractère.');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      newPassword += allChars[randomIndex];
    }

    setGeneratedPassword(newPassword);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Générateur de Mots de Passe
        </h1>
        <div className="mb-4">
          <label htmlFor="password-length" className="block mb-2 text-sm font-medium text-gray-700">
            Longueur du mot de passe
          </label>
          <input
            id="password-length"
            type="number"
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
            min="4"
            max="20"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Inclure les caractères suivants :
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="form-checkbox text-blue-600"
              />
              <span>Majuscules</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="form-checkbox text-blue-600"
              />
              <span>Minuscules</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="form-checkbox text-blue-600"
              />
              <span>Chiffres</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="form-checkbox text-blue-600"
              />
              <span>Symboles</span>
            </label>
          </div>
        </div>
        <button
          onClick={generatePassword}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Générer le Mot de Passe
        </button>
        {generatedPassword && (
          <div className="mt-6 text-center">
            <p className="mb-2 text-lg font-semibold text-gray-800">Mot de passe généré :</p>
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedPassword);
                alert('Mot de passe copié !');
              }}
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Copier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
