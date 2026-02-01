'use client'

interface StatsCardProps {
  title: string
  value: string
  symbol: string
  gradient: string
}

export function StatsCard({ title, value, symbol, gradient }: StatsCardProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {parseFloat(value).toLocaleString(undefined, {
            maximumFractionDigits: 4,
          })}
        </p>
        <span className="text-gray-500 text-lg">{symbol}</span>
      </div>
    </div>
  )
}
