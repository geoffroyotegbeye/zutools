'use client'

import React, { useState } from 'react';
import { Settings, Clock, Calculator, History } from 'lucide-react';
import * as math from 'mathjs';

export default function AdvancedCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState('deg'); // deg or rad
  const [theme, setTheme] = useState('light');
  
  const evaluateExpression = (expr) => {
    try {
      const config = { angle: mode };
      let evaluated = math.evaluate(expr, config);
      
      // Format result to a reasonable number of decimal places
      if (typeof evaluated === 'number') {
        evaluated = math.format(evaluated, { precision: 10 });
      }
      
      return evaluated.toString();
    } catch (error) {
      return 'Error';
    }
  };

  const handleButtonClick = (value) => {
    if (value === '=') {
      const newResult = evaluateExpression(input);
      setResult(newResult);
      if (newResult !== 'Error') {
        setHistory([...history, { expression: input, result: newResult }].slice(-5));
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '←') {
      setInput(input.slice(0, -1));
    } else if (value === 'mode') {
      setMode(mode === 'deg' ? 'rad' : 'deg');
    } else if (value === 'theme') {
      setTheme(theme === 'light' ? 'dark' : 'light');
    } else {
      let newInput = input;
      
      // Handle special functions
      if (['sin', 'cos', 'tan', 'log', 'ln'].includes(value)) {
        newInput += value + '(';
      } else if (value === '√') {
        newInput += 'sqrt(';
      } else if (value === 'π') {
        newInput += 'pi';
      } else if (value === 'e') {
        newInput += 'e';
      } else {
        newInput += value;
      }
      
      setInput(newInput);
    }
  };

  const buttons = [
    [{ label: 'C', class: 'bg-red-500 text-white hover:bg-red-600' },
     { label: '←', class: 'bg-orange-500 text-white hover:bg-orange-600' },
     { label: '(', class: 'bg-gray-200 hover:bg-gray-300' },
     { label: ')', class: 'bg-gray-200 hover:bg-gray-300' },
     { label: 'mode', class: 'bg-purple-500 text-white hover:bg-purple-600' }],
    
    [{ label: 'sin', class: 'bg-blue-500 text-white hover:bg-blue-600' },
     { label: 'cos', class: 'bg-blue-500 text-white hover:bg-blue-600' },
     { label: 'tan', class: 'bg-blue-500 text-white hover:bg-blue-600' },
     { label: 'π', class: 'bg-blue-500 text-white hover:bg-blue-600' },
     { label: 'e', class: 'bg-blue-500 text-white hover:bg-blue-600' }],
    
    [{ label: '7', class: 'bg-white hover:bg-gray-100' },
     { label: '8', class: 'bg-white hover:bg-gray-100' },
     { label: '9', class: 'bg-white hover:bg-gray-100' },
     { label: '/', class: 'bg-gray-200 hover:bg-gray-300' },
     { label: 'log', class: 'bg-blue-500 text-white hover:bg-blue-600' }],
    
    [{ label: '4', class: 'bg-white hover:bg-gray-100' },
     { label: '5', class: 'bg-white hover:bg-gray-100' },
     { label: '6', class: 'bg-white hover:bg-gray-100' },
     { label: '*', class: 'bg-gray-200 hover:bg-gray-300' },
     { label: 'ln', class: 'bg-blue-500 text-white hover:bg-blue-600' }],
    
    [{ label: '1', class: 'bg-white hover:bg-gray-100' },
     { label: '2', class: 'bg-white hover:bg-gray-100' },
     { label: '3', class: 'bg-white hover:bg-gray-100' },
     { label: '-', class: 'bg-gray-200 hover:bg-gray-300' },
     { label: '√', class: 'bg-blue-500 text-white hover:bg-blue-600' }],
    
    [{ label: '0', class: 'bg-white hover:bg-gray-100' },
     { label: '.', class: 'bg-white hover:bg-gray-100' },
     { label: '%', class: 'bg-gray-200 hover:bg-gray-300' },
     { label: '+', class: 'bg-gray-200 hover:bg-gray-300' },
     { label: '=', class: 'bg-green-500 text-white hover:bg-green-600' }]
  ];

  return (
    <div className={`flex flex-col items-center min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Calculatrice Scientifique
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <Settings size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-600'} />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <History size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-600'} />
            </button>
          </div>
        </div>

        {/* Display */}
        <div className={`mb-4 w-full p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className={`text-right text-lg mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {input || '0'}
          </div>
          <div className={`text-right text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {result || '0'}
          </div>
        </div>

        {/* Mode indicator */}
        <div className="mb-4 text-right">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Mode: {mode.toUpperCase()}
          </span>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Historique
            </h2>
            {history.map((entry, index) => (
              <div key={index} className="mb-2">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {entry.expression}
                </div>
                <div className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  = {entry.result}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {buttons.map((row, rowIndex) => (
            row.map((button, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleButtonClick(button.label)}
                className={`p-4 rounded-lg text-center font-medium shadow-sm 
                  ${button.class} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {button.label}
              </button>
            ))
          ))}
        </div>
      </div>
    </div>
  );
}