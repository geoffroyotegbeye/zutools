'use client'

interface UnitSelectProps {
  units: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  label: string
}

export default function UnitSelect({ units, value, onChange, label }: UnitSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
      >
        {units.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label}
          </option>
        ))}
      </select>
    </div>
  )
}
