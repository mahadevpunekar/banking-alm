import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { enterprisePalette } from '@/components/charts/chartTheme'

type Props = {
  values: number[]
  /** When true, stroke/fill green; otherwise neutral slate */
  positive?: boolean
}

export function SparklineMini({ values, positive = true }: Props) {
  const data = values.map((v, i) => ({ i, v }))
  const stroke = positive ? enterprisePalette.green : '#64748b'
  return (
    <div className="h-9 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={1.5}
            fill={stroke}
            fillOpacity={0.12}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
