'use client'

import { useState, useEffect } from 'react'

interface Alarm {
  id: string
  time: string
  isActive: boolean
  days: string[]
}

export default function Alarm() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alarms')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [newAlarmTime, setNewAlarmTime] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const daysOfWeek = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
  ]

  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms))
  }, [alarms])

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date()
      const currentTime = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
      const currentDay = daysOfWeek[now.getDay() === 0 ? 6 : now.getDay() - 1]

      alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentTime && alarm.days.includes(currentDay)) {
          // Jouer le son de l'alarme
          const audio = new Audio('/sounds/alarm.mp3')
          audio.play().catch(() => {})
          
          // Notification
          if (Notification.permission === 'granted') {
            new Notification('Alarme', {
              body: `Il est ${alarm.time}`,
              icon: '/alarm-icon.png'
            })
          }
        }
      })
    }

    const intervalId = setInterval(checkAlarms, 1000)
    return () => clearInterval(intervalId)
  }, [alarms, daysOfWeek])

  const addAlarm = () => {
    if (newAlarmTime && selectedDays.length > 0) {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: newAlarmTime,
        isActive: true,
        days: selectedDays
      }
      setAlarms(prev => [...prev, newAlarm])
      setNewAlarmTime('')
      setSelectedDays([])
    }
  }

  const toggleAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    )
  }

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id))
  }

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Alarmes</h2>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="time"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
            className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={addAlarm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {daysOfWeek.map(day => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedDays.includes(day)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {alarms.map(alarm => (
          <div
            key={alarm.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {alarm.time}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {alarm.days.map(day => day.slice(0, 3)).join(', ')}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleAlarm(alarm.id)}
                className={`px-4 py-2 rounded-lg ${
                  alarm.isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {alarm.isActive ? 'Activée' : 'Désactivée'}
              </button>
              <button
                onClick={() => deleteAlarm(alarm.id)}
                className="text-red-500 hover:text-red-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
