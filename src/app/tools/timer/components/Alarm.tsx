'use client'

import { useState, useEffect } from 'react'

interface Alarm {
  id: string
  time: string
  isActive: boolean
  title: string
  sound: string
  repeat: boolean
}

const AlarmPopup = ({ isRinging, stopAlarm }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    setPopupVisible(isRinging);
  }, [isRinging]);

  const handleStopAlarm = () => {
    setPopupVisible(false);
    stopAlarm();
  };

  return (
    <>{isPopupVisible && (
      <div className='popup' style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        zIndex: 1000
      }}>
        <div className='alarm-animation'>Alarm is ringing!</div>
        <button onClick={handleStopAlarm}>Stop Alarm</button>
      </div>
    )}</>
  );
};

export default function Alarm() {
  const [currentTime, setCurrentTime] = useState('')
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('alarms')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null)
  const [newAlarm, setNewAlarm] = useState<Alarm>({
    id: '',
    time: '',
    isActive: true,
    title: 'Alarme',
    sound: 'bell',
    repeat: false
  })

  const [isRinging, setIsRinging] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);

  // Mettre à jour l'heure actuelle chaque seconde
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }))
    }

    updateCurrentTime()
    const intervalId = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(intervalId)
  }, [])

  // Sauvegarder les alarmes dans le localStorage
  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms))
  }, [alarms])

  // Vérifier les alarmes chaque seconde
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date()
      const currentTime = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })

      alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentTime) {
          setIsRinging(true);
          setRingingAlarm(alarm);
          // Jouer le son de l'alarme
          const audio = new Audio(`/sounds/${alarm.sound}.wav`)
          audio.play().catch(() => {})
          
          // Notification
          if (Notification.permission === 'granted') {
            new Notification(alarm.title, {
              body: `Il est ${alarm.time}`,
              icon: '/alarm-icon.png'
            })
          }
        }
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [alarms])

  const stopRinging = () => {
    setIsRinging(false);
    setRingingAlarm(null);
  };

  const addOrUpdateAlarm = () => {
    if (newAlarm.time) {
      if (editingAlarm) {
        setAlarms(prev =>
          prev.map(alarm =>
            alarm.id === editingAlarm.id ? { ...newAlarm, id: alarm.id } : alarm
          )
        )
        setEditingAlarm(null)
      } else {
        setAlarms(prev => [...prev, { ...newAlarm, id: Date.now().toString() }])
      }
      setNewAlarm({
        id: '',
        time: '',
        isActive: true,
        title: 'Alarme',
        sound: 'bell',
        repeat: false
      })
    }
  }

  const startEditing = (alarm: Alarm) => {
    setEditingAlarm(alarm)
    setNewAlarm(alarm)
  }

  const cancelEditing = () => {
    setEditingAlarm(null)
    setNewAlarm({
      id: '',
      time: '',
      isActive: true,
      title: 'Alarme',
      sound: 'bell',
      repeat: false
    })
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        {currentTime}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {editingAlarm ? 'Modifier l\'alarme' : 'Nouvelle alarme'}
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Heure
            </label>
            <input
              type="time"
              value={newAlarm.time}
              onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={newAlarm.title}
              onChange={(e) => setNewAlarm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Son
            </label>
            <select
              value={newAlarm.sound}
              onChange={(e) => setNewAlarm(prev => ({ ...prev, sound: e.target.value }))}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="bell">En cloche</option>
              <option value="digital">Digital</option>
              <option value="classic">Classique</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="repeat"
              checked={newAlarm.repeat}
              onChange={(e) => setNewAlarm(prev => ({ ...prev, repeat: e.target.checked }))}
              className="rounded dark:bg-gray-700"
            />
            <label htmlFor="repeat" className="text-sm text-gray-700 dark:text-gray-300">
              Répéter le son
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addOrUpdateAlarm}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {editingAlarm ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingAlarm && (
              <button
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
            )}
          </div>
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
                {alarm.title}
                {alarm.repeat && ' (Répétition)'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAlarm(alarm.id)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  alarm.isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {alarm.isActive ? 'Activée' : 'Désactivée'}
              </button>
              <button
                onClick={() => startEditing(alarm)}
                className="p-1 text-blue-500 hover:text-blue-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => deleteAlarm(alarm.id)}
                className="p-1 text-red-500 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {ringingAlarm && (
        <AlarmPopup
          isRinging={isRinging}
          stopAlarm={stopRinging}
        />
      )}
    </div>
  )
}
