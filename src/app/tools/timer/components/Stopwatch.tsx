'use client'

import { useState, useEffect } from 'react'

export default function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prev => prev + 10)
      }, 10)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning])

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
  }

  const handleLap = () => {
    setLaps(prev => [...prev, time])
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Chronomètre</h2>
      
      <div className="text-4xl font-mono text-center mb-6 text-blue-600 dark:text-blue-400">
        {formatTime(time)}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleStartStop}
          className={`px-6 py-2 rounded-lg font-medium ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="px-6 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tour
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white"
        >
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Tours</h3>
          <div className="max-h-48 overflow-y-auto">
            {laps.map((lap, index) => (
              <div
                key={index}
                className="flex justify-between py-2 px-4 odd:bg-gray-50 dark:odd:bg-gray-700"
              >
                <span className="text-gray-600 dark:text-gray-300">Tour {index + 1}</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
