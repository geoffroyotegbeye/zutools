'use client'

import { useState } from 'react'
import UnitSelect from './components/UnitSelect'

type UnitType = 'length' | 'weight' | 'temperature' | 'volume' | 'area'

const unitTypes: { value: UnitType; label: string }[] = [
  { value: 'length', label: 'Longueur' },
  { value: 'weight', label: 'Poids' },
  { value: 'temperature', label: 'Température' },
  { value: 'volume', label: 'Volume' },
  { value: 'area', label: 'Surface' },
]

const units = {
  length: [
    { value: 'm', label: 'Mètres (m)' },
    { value: 'km', label: 'Kilomètres (km)' },
    { value: 'cm', label: 'Centimètres (cm)' },
    { value: 'mm', label: 'Millimètres (mm)' },
    { value: 'in', label: 'Pouces (in)' },
    { value: 'ft', label: 'Pieds (ft)' },
    { value: 'yd', label: 'Yards (yd)' },
    { value: 'mi', label: 'Miles (mi)' },
  ],
  weight: [
    { value: 'kg', label: 'Kilogrammes (kg)' },
    { value: 'g', label: 'Grammes (g)' },
    { value: 'mg', label: 'Milligrammes (mg)' },
    { value: 'lb', label: 'Livres (lb)' },
    { value: 'oz', label: 'Onces (oz)' },
  ],
  temperature: [
    { value: 'c', label: 'Celsius (°C)' },
    { value: 'f', label: 'Fahrenheit (°F)' },
    { value: 'k', label: 'Kelvin (K)' },
  ],
  volume: [
    { value: 'l', label: 'Litres (L)' },
    { value: 'ml', label: 'Millilitres (mL)' },
    { value: 'gal', label: 'Gallons (gal)' },
    { value: 'qt', label: 'Quarts (qt)' },
    { value: 'pt', label: 'Pintes (pt)' },
    { value: 'cup', label: 'Tasses (cup)' },
    { value: 'floz', label: 'Onces liquides (fl oz)' },
  ],
  area: [
    { value: 'm2', label: 'Mètres carrés (m²)' },
    { value: 'km2', label: 'Kilomètres carrés (km²)' },
    { value: 'cm2', label: 'Centimètres carrés (cm²)' },
    { value: 'mm2', label: 'Millimètres carrés (mm²)' },
    { value: 'ha', label: 'Hectares (ha)' },
    { value: 'ac', label: 'Acres (ac)' },
    { value: 'ft2', label: 'Pieds carrés (ft²)' },
    { value: 'in2', label: 'Pouces carrés (in²)' },
  ],
}

const conversions = {
  length: {
    m: { m: 1, km: 0.001, cm: 100, mm: 1000, in: 39.3701, ft: 3.28084, yd: 1.09361, mi: 0.000621371 },
    km: { m: 1000, km: 1, cm: 100000, mm: 1000000, in: 39370.1, ft: 3280.84, yd: 1093.61, mi: 0.621371 },
    cm: { m: 0.01, km: 0.00001, cm: 1, mm: 10, in: 0.393701, ft: 0.0328084, yd: 0.0109361, mi: 0.00000621371 },
    mm: { m: 0.001, km: 0.000001, cm: 0.1, mm: 1, in: 0.0393701, ft: 0.00328084, yd: 0.00109361, mi: 6.21371e-7 },
    in: { m: 0.0254, km: 0.0000254, cm: 2.54, mm: 25.4, in: 1, ft: 0.0833333, yd: 0.0277778, mi: 0.0000157828 },
    ft: { m: 0.3048, km: 0.0003048, cm: 30.48, mm: 304.8, in: 12, ft: 1, yd: 0.333333, mi: 0.000189394 },
    yd: { m: 0.9144, km: 0.0009144, cm: 91.44, mm: 914.4, in: 36, ft: 3, yd: 1, mi: 0.000568182 },
    mi: { m: 1609.34, km: 1.60934, cm: 160934, mm: 1609340, in: 63360, ft: 5280, yd: 1760, mi: 1 },
  },
  weight: {
    kg: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274 },
    g: { kg: 0.001, g: 1, mg: 1000, lb: 0.00220462, oz: 0.035274 },
    mg: { kg: 0.000001, g: 0.001, mg: 1, lb: 2.20462e-6, oz: 0.000035274 },
    lb: { kg: 0.453592, g: 453.592, mg: 453592, lb: 1, oz: 16 },
    oz: { kg: 0.0283495, g: 28.3495, mg: 28349.5, lb: 0.0625, oz: 1 },
  },
  temperature: {
    c: { c: (t: number) => t, f: (t: number) => (t * 9/5) + 32, k: (t: number) => t + 273.15 },
    f: { c: (t: number) => (t - 32) * 5/9, f: (t: number) => t, k: (t: number) => (t - 32) * 5/9 + 273.15 },
    k: { c: (t: number) => t - 273.15, f: (t: number) => (t - 273.15) * 9/5 + 32, k: (t: number) => t },
  },
  volume: {
    l: { l: 1, ml: 1000, gal: 0.264172, qt: 1.05669, pt: 2.11338, cup: 4.22675, floz: 33.814 },
    ml: { l: 0.001, ml: 1, gal: 0.000264172, qt: 0.00105669, pt: 0.00211338, cup: 0.00422675, floz: 0.033814 },
    gal: { l: 3.78541, ml: 3785.41, gal: 1, qt: 4, pt: 8, cup: 16, floz: 128 },
    qt: { l: 0.946353, ml: 946.353, gal: 0.25, qt: 1, pt: 2, cup: 4, floz: 32 },
    pt: { l: 0.473176, ml: 473.176, gal: 0.125, qt: 0.5, pt: 1, cup: 2, floz: 16 },
    cup: { l: 0.236588, ml: 236.588, gal: 0.0625, qt: 0.25, pt: 0.5, cup: 1, floz: 8 },
    floz: { l: 0.0295735, ml: 29.5735, gal: 0.0078125, qt: 0.03125, pt: 0.0625, cup: 0.125, floz: 1 },
  },
  area: {
    'm2': { 'm2': 1, 'km2': 0.000001, 'cm2': 10000, 'mm2': 1000000, 'ha': 0.0001, 'ac': 0.000247105, 'ft2': 10.7639, 'in2': 1550.0031 },
    'km2': { 'm2': 1000000, 'km2': 1, 'cm2': 10000000000, 'mm2': 1000000000000, 'ha': 100, 'ac': 247.105, 'ft2': 10763910.4, 'in2': 1550003100 },
    'cm2': { 'm2': 0.0001, 'km2': 1e-10, 'cm2': 1, 'mm2': 100, 'ha': 1e-8, 'ac': 2.47105e-8, 'ft2': 0.00107639, 'in2': 0.155 },
    'mm2': { 'm2': 0.000001, 'km2': 1e-12, 'cm2': 0.01, 'mm2': 1, 'ha': 1e-10, 'ac': 2.47105e-10, 'ft2': 0.0000107639, 'in2': 0.00155 },
    'ha': { 'm2': 10000, 'km2': 0.01, 'cm2': 100000000, 'mm2': 10000000000, 'ha': 1, 'ac': 2.47105, 'ft2': 107639.104, 'in2': 15500031 },
    'ac': { 'm2': 4046.86, 'km2': 0.00404686, 'cm2': 40468600, 'mm2': 4046860000, 'ha': 0.404686, 'ac': 1, 'ft2': 43560, 'in2': 6272640 },
    'ft2': { 'm2': 0.092903, 'km2': 9.2903e-8, 'cm2': 929.03, 'mm2': 92903, 'ha': 9.2903e-6, 'ac': 2.2957e-5, 'ft2': 1, 'in2': 144 },
    'in2': { 'm2': 0.00064516, 'km2': 6.4516e-10, 'cm2': 6.4516, 'mm2': 645.16, 'ha': 6.4516e-8, 'ac': 1.5942e-7, 'ft2': 0.00694444, 'in2': 1 },
  },
}

export default function UnitConverter() {
  const [unitType, setUnitType] = useState<UnitType>('length')
  const [fromUnit, setFromUnit] = useState(units[unitType][0].value)
  const [toUnit, setToUnit] = useState(units[unitType][0].value)
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState('')

  const handleUnitTypeChange = (type: UnitType) => {
    setUnitType(type)
    setFromUnit(units[type][0].value)
    setToUnit(units[type][0].value)
    setValue('')
    setResult('')
    setError('')
  }

  const convert = (value: string) => {
    setValue(value)
    setError('')
    
    if (!value) {
      setResult('')
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setError('Veuillez entrer un nombre valide')
      setResult('')
      return
    }

    try {
      if (unitType === 'temperature') {
        const conversion = conversions.temperature[fromUnit as keyof typeof conversions.temperature][toUnit as keyof typeof conversions.temperature]
        const converted = conversion(numValue)
        setResult(converted.toFixed(2))
      } else {
        const conversion = conversions[unitType][fromUnit as keyof typeof conversions.length][toUnit as keyof typeof conversions.length]
        const converted = numValue * conversion
        setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la conversion')
      setResult('')
    }
  }

  const handleCopy = () => {
    if (result) {
      const unitLabel = units[unitType].find(u => u.value === toUnit)?.label.split(' ')[0]
      const textToCopy = `${result} ${unitLabel}`
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
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
                  Convertisseur d&apos;unités
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Convertissez facilement entre différentes unités de mesure
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type d&apos;unité
                  </label>
                  <select
                    value={unitType}
                    onChange={(e) => handleUnitTypeChange(e.target.value as UnitType)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                  >
                    {unitTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Valeur à convertir
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => convert(e.target.value)}
                        placeholder="Entrez une valeur"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                      />
                    </div>

                    <UnitSelect
                      units={units[unitType]}
                      value={fromUnit}
                      onChange={(value) => {
                        setFromUnit(value)
                        if (value && value.trim()) convert(value)
                      }}
                      label="De"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Résultat
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={result ? `${result} ${units[unitType].find(u => u.value === toUnit)?.label.split(' ')[0]}` : ''}
                          readOnly
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                        />
                        {result && (
                          <button
                            onClick={handleCopy}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          >
                            {copySuccess ? (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <UnitSelect
                      units={units[unitType]}
                      value={toUnit}
                      onChange={(value) => {
                        setToUnit(value)
                        if (value && value.trim()) convert(value)
                      }}
                      label="Vers"
                    />
                  </div>
                </div>

                <div className="bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-lg rounded-lg p-6 mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    À propos de l&apos;outil
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      Notre convertisseur d&apos;unités est un outil complet qui permet de convertir facilement entre différentes unités de mesure. Il prend en charge :
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Longueur</strong> : conversions entre mètres, kilomètres, centimètres, millimètres, pouces, pieds, yards et miles</span>
                      </li>
                      <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Poids</strong> : conversions entre kilogrammes, grammes, milligrammes, livres et onces</span>
                      </li>
                      <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Température</strong> : conversions entre Celsius, Fahrenheit et Kelvin</span>
                      </li>
                      <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Volume</strong> : conversions entre litres, millilitres, gallons, quarts, pintes, tasses et onces liquides</span>
                      </li>
                      <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Surface</strong> : conversions entre mètres carrés, kilomètres carrés, centimètres carrés, millimètres carrés, hectares, acres, pieds carrés et pouces carrés</span>
                      </li>
                    </ul>
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-600 dark:text-gray-300">
                        <strong>Caractéristiques principales :</strong>
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Conversion instantanée et précise</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Interface intuitive avec sélection rapide des unités</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copie rapide des résultats avec unités</span>
                        </li>
                        <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Support du mode sombre</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-lg rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {result && !error && (
                  <div className="p-4 bg-green-50/80 dark:bg-green-900/30 backdrop-blur-lg rounded-md">
                    <p className="text-sm text-green-600 dark:text-green-400">Conversion effectuée avec succès !</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Espace publicitaire droite */}
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
