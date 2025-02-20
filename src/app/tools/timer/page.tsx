'use client'

import { useState } from 'react'
import Stopwatch from './components/Stopwatch'
import Countdown from './components/Countdown'
import Alarm from './components/Alarm'

type TimerType = 'stopwatch' | 'countdown' | 'alarm'

export default function Timer() {
  const [activeTab, setActiveTab] = useState<TimerType>('stopwatch')

  const tabs = [
    { id: 'stopwatch', label: 'Chronomètre' },
    { id: 'countdown', label: 'Compte à rebours' },
    { id: 'alarm', label: 'Alarmes' },
  ]

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Outils de gestion du temps
            </h1>

            <div className="mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TimerType)}
                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {activeTab === 'stopwatch' && <Stopwatch />}
              {activeTab === 'countdown' && <Countdown />}
              {activeTab === 'alarm' && <Alarm />}
            </div>

            {/* Espace publicitaire mobile */}
            <div className="lg:hidden my-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 h-32">
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                  Espace publicitaire
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                À propos des outils
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  Notre suite d&apos;outils de gestion du temps comprend :
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
                  <li>Un chronomètre précis avec fonction tour et historique</li>
                  <li>Un compte à rebours personnalisable avec alerte sonore</li>
                  <li>Un gestionnaire d&apos;alarmes avec répétition par jour de la semaine</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  Ces outils sont parfaits pour le sport, la cuisine, le travail ou toute autre activité
                  nécessitant une gestion précise du temps.
                </p>
              </div>
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
