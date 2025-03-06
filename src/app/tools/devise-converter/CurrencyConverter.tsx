'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Currency {
  code: string
  description: string
}

interface ExchangeRate {
  date: string
  rate: number
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<string>('EUR')
  const [toCurrency, setToCurrency] = useState<string>('XOF')
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [historicalRates, setHistoricalRates] = useState<ExchangeRate[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [searchFrom, setSearchFrom] = useState<string>('')
  const [searchTo, setSearchTo] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [showFromDropdown, setShowFromDropdown] = useState<boolean>(false)
  const [showToDropdown, setShowToDropdown] = useState<boolean>(false)

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('https://api.exchangerate.host/symbols')
        const data = await response.json()

        if (data.success) {
          const formattedCurrencies = Object.entries(data.symbols).map(([code, details]: [string, any]) => ({
            code,
            description: details.description,
          }))
          setCurrencies(formattedCurrencies)
          setIsLoading(false)
        }
      } catch {
        setError('Erreur lors du chargement des devises')
        setIsLoading(false)
      }
    }
    fetchCurrencies()
  }, [])

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}`)
        const data = await response.json()
        if (data.success) setExchangeRate(data.result)
      } catch {
        setError('Erreur lors du chargement du taux de change')
      }
    }
    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    const fetchHistoricalRates = async () => {
      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 14)

        const response = await fetch(
          `https://api.exchangerate.host/timeseries?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&base=${fromCurrency}&symbols=${toCurrency}`
        )
        const data = await response.json()
        if (data.success) {
          const rates = Object.entries(data.rates).map(([date, rates]: [string, any]) => ({
            date,
            rate: rates[toCurrency],
          }))
          setHistoricalRates(rates)
        }
      } catch {
        setError('Erreur lors du chargement des données historiques')
      }
    }
    fetchHistoricalRates()
  }, [fromCurrency, toCurrency])

  const filteredFromCurrencies = currencies.filter(
    (c) => c.code.toLowerCase().includes(searchFrom.toLowerCase()) || c.description.toLowerCase().includes(searchFrom.toLowerCase())
  )

  const filteredToCurrencies = currencies.filter(
    (c) => c.code.toLowerCase().includes(searchTo.toLowerCase()) || c.description.toLowerCase().includes(searchTo.toLowerCase())
  )

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  if (isLoading) return <div className="text-center">Chargement...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <div className="flex justify-between gap-4">
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="input" />
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>{currencies.map(c => <option key={c.code}>{c.code}</option>)}</select>
        <button onClick={handleSwap} className="btn">⇄</button>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>{currencies.map(c => <option key={c.code}>{c.code}</option>)}</select>
        <input value={(amount * exchangeRate).toFixed(2)} readOnly className="input" />
      </div>

      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalRates}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="#3B82F6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-gray-500 mt-2">Taux fourni par exchangerate.host</div>
    </div>
  )
}
