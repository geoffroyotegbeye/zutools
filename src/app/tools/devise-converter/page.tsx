'use client'

import CurrencyConverter from './CurrencyConverter'

export default function DeviseConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Convertisseur de devises
      </h1>
      <CurrencyConverter />
    </div>
  )
}
