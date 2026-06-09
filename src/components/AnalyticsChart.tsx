'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="transaction_date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#ec4899" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}