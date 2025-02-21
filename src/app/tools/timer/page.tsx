'use client'

import { useState } from 'react'
import Stopwatch from './components/Stopwatch'
import Countdown from './components/Countdown'
import Alarm from './components/Alarm'

type TimerType = 'stopwatch' | 'countdown' | 'alarm'

export default function Timer() {
  const [activeTab, setActiveTab] = useState<TimerType>('stopwatch')

  const tabs = [
    { id: 'stopwatch', label: 'Chronomètre', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) },
    { id: 'countdown', label: 'Compte à rebours', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) },
    { id: 'alarm', label: 'Alarmes', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ) },
  ]

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
                  Outils de gestion du temps
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Gérez votre temps efficacement avec nos outils de chronométrage
                </p>
              </div>

              <div className="flex justify-center space-x-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TimerType)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg p-6">
                {activeTab === 'stopwatch' && <Stopwatch />}
                {activeTab === 'countdown' && <Countdown />}
                {activeTab === 'alarm' && <Alarm />}
              </div>

              <div className="bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  À propos des outils
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Notre suite d&apos;outils de gestion du temps comprend :
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Un chronomètre précis avec fonction tour et historique</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Un compte à rebours personnalisable avec alerte sonore</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Un gestionnaire d&apos;alarmes avec répétition par jour de la semaine</span>
                    </li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    Ces outils sont parfaits pour le sport, la cuisine, le travail ou toute autre activité
                    nécessitant une gestion précise du temps.
                  </p>
                </div>
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
