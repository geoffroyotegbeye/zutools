'use client'

import { useState, useRef, useEffect } from 'react'

interface Correction {
  message: string
  offset: number
  length: number
  replacements: { value: string }[]
}

interface Props {
  text: string
  corrections: Correction[]
  onTextUpdate: (newText: string) => void
}

export default function InteractiveText({ text, corrections, onTextUpdate }: Props) {
  const [hoveredCorrection, setHoveredCorrection] = useState<Correction | null>(null)
  const [isTooltipHovered, setIsTooltipHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleReplacementClick = (correction: Correction, replacement: string) => {
    const before = text.slice(0, correction.offset)
    const after = text.slice(correction.offset + correction.length)
    const newText = before + replacement + after
    onTextUpdate(newText)
    setHoveredCorrection(null)
  }

  const handleMouseEnter = (correction: Correction) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setHoveredCorrection(correction)
  }

  const handleMouseLeave = () => {
    if (!isTooltipHovered) {
      timeoutRef.current = setTimeout(() => {
        setHoveredCorrection(null)
      }, 500) // 500ms delay before hiding
    }
  }

  const handleTooltipMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsTooltipHovered(true)
  }

  const handleTooltipMouseLeave = () => {
    setIsTooltipHovered(false)
    timeoutRef.current = setTimeout(() => {
      setHoveredCorrection(null)
    }, 500) // 500ms delay before hiding
  }

  const segments = []
  let lastIndex = 0

  // Trier les corrections par position de début
  const sortedCorrections = [...corrections].sort((a, b) => a.offset - b.offset)

  // Créer les segments de texte avec les corrections
  sortedCorrections.forEach((correction) => {
    // Ajouter le texte avant la correction
    if (correction.offset > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, correction.offset),
        isCorrection: false,
      })
    }

    // Ajouter le texte avec correction
    segments.push({
      text: text.slice(correction.offset, correction.offset + correction.length),
      isCorrection: true,
      correction,
    })

    lastIndex = correction.offset + correction.length
  })

  // Ajouter le reste du texte après la dernière correction
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isCorrection: false,
    })
  }

  return (
    <div className="space-y-4">
      <div className="whitespace-pre-wrap break-words text-gray-900 dark:text-white">
        {segments.map((segment, index) => (
          <span key={index}>
            {segment.isCorrection ? (
              <span
                className="relative group cursor-help bg-yellow-100 dark:bg-yellow-900/50 border-b-2 border-red-400 dark:border-red-600"
                onMouseEnter={() => handleMouseEnter(segment.correction)}
                onMouseLeave={handleMouseLeave}
              >
                {segment.text}
                {hoveredCorrection === segment.correction && (
                  <div 
                    className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700"
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                  >
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{segment.correction.message}</p>
                    {segment.correction.replacements.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Suggestions :</p>
                        <ul className="text-sm">
                          {segment.correction.replacements.slice(0, 3).map((replacement, i) => (
                            <li
                              key={i}
                              onClick={() => handleReplacementClick(segment.correction, replacement.value)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50"
                            >
                              {replacement.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </span>
            ) : (
              segment.text
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
