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

  const handleUnitTypeChange = (type: UnitType) => {
    setUnitType(type)
    setFromUnit(units[type][0].value)
    setToUnit(units[type][0].value)
    setValue('')
    setResult('')
  }

  const convert = (value: string) => {
    setValue(value)
    if (!value) {
      setResult('')
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setResult('Valeur invalide')
      return
    }

    if (unitType === 'temperature') {
      const conversion = conversions.temperature[fromUnit as keyof typeof conversions.temperature][toUnit as keyof typeof conversions.temperature]
      const converted = conversion(numValue)
      setResult(converted.toFixed(2))
    } else {
      const conversion = conversions[unitType][fromUnit as keyof typeof conversions.length][toUnit as keyof typeof conversions.length]
      const converted = numValue * conversion
      setResult(converted.toFixed(6))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Espace publicitaire gauche */}
          <div className="hidden lg:block lg:w-64 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 h-[600px]">
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                Espace publicitaire
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Convertisseur d&apos;unités
              </h1>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type d&apos;unité
                    </label>
                    <select
                      value={unitType}
                      onChange={(e) => handleUnitTypeChange(e.target.value as UnitType)}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      {unitTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valeur à convertir
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => convert(e.target.value)}
                      placeholder="Entrez une valeur"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <UnitSelect
                    units={units[unitType]}
                    value={fromUnit}
                    onChange={setFromUnit}
                    label="De"
                  />

                  <UnitSelect
                    units={units[unitType]}
                    value={toUnit}
                    onChange={setToUnit}
                    label="Vers"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Résultat
                  </h2>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result ? `${result} ${units[unitType].find(u => u.value === toUnit)?.label.split(' ')[0]}` : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Espace publicitaire mobile */}
            <div className="lg:hidden mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 h-32">
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                  Espace publicitaire
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                À propos du convertisseur
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Notre convertisseur d&apos;unités vous permet de convertir facilement entre différentes unités de mesure.
                Vous pouvez convertir des longueurs, des poids, des températures, des volumes et des surfaces.
                Les conversions sont précises et instantanées.
              </p>
            </div>
          </div>

          {/* Espace publicitaire droit */}
          <div className="hidden lg:block lg:w-64 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 h-[600px]">
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                Espace publicitaire
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
