'use client'

import { useState, useEffect } from 'react'

export default function Countdown() {
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')
  const [timeInMs, setTimeInMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRunning && timeInMs > 0) {
      intervalId = setInterval(() => {
        setTimeInMs(prev => {
          if (prev <= 1000) {
            setIsRunning(false)
            // Jouer un son quand le compte à rebours est terminé
            const audio = new Audio('/sounds/notification.mp3')
            audio.play().catch(() => {})
            return 0
          }
          return prev - 1000
        })
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning, timeInMs])

  const handleStart = () => {
    const totalMs = (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000
    if (totalMs > 0) {
      setTimeInMs(totalMs)
      setIsRunning(true)
    }
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeInMs(0)
    setHours('00')
    setMinutes('00')
    setSeconds('00')
  }

  const formatNumber = (value: string) => {
    const number = parseInt(value)
    if (isNaN(number)) return '00'
    return number.toString().padStart(2, '0')
  }

  const handleTimeChange = (value: string, setter: (value: string) => void, max: number) => {
    const number = parseInt(value)
    if (isNaN(number)) {
      setter('00')
    } else if (number >= 0 && number <= max) {
      setter(formatNumber(value))
    }
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Compte à rebours</h2>

      {isRunning ? (
        <div className="text-4xl font-mono text-center mb-6 text-blue-600 dark:text-blue-400">
          {formatTime(timeInMs)}
        </div>
      ) : (
        <div className="flex justify-center gap-2 mb-6">
          <input
            type="number"
            value={hours}
            onChange={(e) => handleTimeChange(e.target.value, setHours, 99)}
            className="w-16 text-2xl text-center border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="HH"
          />
          <span className="text-2xl">:</span>
          <input
            type="number"
            value={minutes}
            onChange={(e) => handleTimeChange(e.target.value, setMinutes, 59)}
            className="w-16 text-2xl text-center border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="MM"
          />
          <span className="text-2xl">:</span>
          <input
            type="number"
            value={seconds}
            onChange={(e) => handleTimeChange(e.target.value, setSeconds, 59)}
            className="w-16 text-2xl text-center border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="SS"
          />
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white"
          >
            Démarrer
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-6 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white"
          >
            Arrêter
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
