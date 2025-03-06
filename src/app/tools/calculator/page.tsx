'use client'

import React, { useState, useEffect } from 'react'
import { Settings, History } from 'lucide-react'
import * as math from 'mathjs'

export default function CalculatorPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [mode, setMode] = useState<'deg' | 'rad'>('deg')
  const [theme, setTheme] = useState<'dark' | 'light'>(getSystemTheme())

  function getSystemTheme() {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  useEffect(() => {
    setTheme(getSystemTheme())
    const listener = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light')
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener)
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener)
  }, [])

  const evaluateExpression = (expr: string) => {
    try {
      const config = { angle: mode }
      let evaluated = math.evaluate(expr, config)

      if (typeof evaluated === 'number') {
        evaluated = math.format(evaluated, { precision: 10 })
      }

      return evaluated.toString()
    } catch {
      return 'Erreur'
    }
  }

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      const newResult = evaluateExpression(input)
      setResult(newResult)
      if (newResult !== 'Erreur') {
        setHistory([...history, { expression: input, result: newResult }].slice(-5))
      }
    } else if (value === 'C') {
      setInput('')
      setResult('')
    } else if (value === '←') {
      setInput(input.slice(0, -1))
    } else if (value === 'mode') {
      setMode(mode === 'deg' ? 'rad' : 'deg')
    } else {
      const specialMapping: Record<string, string> = {
        sin: 'sin(', cos: 'cos(', tan: 'tan(', log: 'log(', ln: 'ln(',
        '√': 'sqrt(', 'π': 'pi', 'e': 'e'
      }
      setInput(input + (specialMapping[value] ?? value))
    }
  }

  const buttons = [
    ['C', '←', '(', ')', 'mode'],
    ['sin', 'cos', 'tan', 'π', 'e'],
    ['7', '8', '9', '/', 'log'],
    ['4', '5', '6', '*', 'ln'],
    ['1', '2', '3', '-', '√'],
    ['0', '.', '%', '+', '=']
  ]

  const buttonClasses = (label: string) => {
    if (['C', '←'].includes(label)) return 'bg-red-500 text-white hover:bg-red-600'
    if (['mode'].includes(label)) return 'bg-purple-500 text-white hover:bg-purple-600'
    if (['=', '+', '-', '*', '/', '%'].includes(label)) return 'bg-gray-300 hover:bg-gray-400 text-black'
    if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'π', 'e'].includes(label)) return 'bg-blue-500 text-white hover:bg-blue-600'
    return 'bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900 dark:via-gray-900 dark:to-purple-900 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">

        {/* Espace publicitaire gauche */}
        <div className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 h-[400px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              Espace publicitaire
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Calculatrice Scientifique</h1>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <History size={24} />
              </button>
            </div>

            {/* Display */}
            <div className={`mb-4 p-4 border rounded-lg t ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 text-black'}`}>
              <div className="text-right text-lg mb-2">{input || '0'}</div>
              <div className="text-right text-3xl font-bold">{result || '0'}</div>
            </div>

            {/* Mode */}
            <div className="text-right mb-4">
              <span className="text-sm">Mode : {mode.toUpperCase()}</span>
            </div>

            {/* Historique */}
            {showHistory && (
              <div className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h2 className="font-semibold">Historique</h2>
                {history.map((entry, idx) => (
                  <div key={idx} className="text-sm">
                    {entry.expression} = {entry.result}
                  </div>
                ))}
              </div>
            )}

            {/* Boutons */}
            <div className="grid grid-cols-5 gap-2">
              {buttons.flat().map((label) => (
                <button
                  key={label}
                  onClick={() => handleButtonClick(label)}
                  className={`p-4 rounded-lg ${buttonClasses(label)}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Espace publicitaire droit */}
        <div className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 h-[400px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              Espace publicitaire
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
