// @ts-nocheck
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { HourlyTrend } from "@/lib/trafficData";

interface TrafficChartsProps {
  hourlyData: HourlyTrend[];
  weeklyData: { day: string; avgCongestion: number; peakVolume: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card-solid rounded-md p-3 text-sm">
      <p className="font-mono-data text-primary mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-mono-data text-xs">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const TrafficCharts = ({ hourlyData, weeklyData }: TrafficChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Hourly Congestion */}
      <div className="glass-card-solid rounded-lg p-4 animate-slide-up">
        <h3 className="text-sm font-semibold text-foreground mb-1">Hourly Congestion & Speed</h3>
        <p className="text-xs text-muted-foreground mb-4">Today's traffic patterns</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="congGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(199, 89%, 60%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(199, 89%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 24%)" />
            <XAxis dataKey="hour" tick={{ fill: "hsl(215, 25%, 62%)", fontSize: 10 }} tickLine={false} interval={3} />
            <YAxis tick={{ fill: "hsl(215, 25%, 62%)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="congestion" name="Congestion %" stroke="hsl(0, 84%, 60%)" fill="url(#congGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="speed" name="Avg Speed" stroke="hsl(199, 89%, 60%)" fill="url(#speedGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Overview */}
      <div className="glass-card-solid rounded-lg p-4 animate-slide-up">
        <h3 className="text-sm font-semibold text-foreground mb-1">Weekly Overview</h3>
        <p className="text-xs text-muted-foreground mb-4">Average congestion by day</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 24%)" />
            <XAxis dataKey="day" tick={{ fill: "hsl(215, 25%, 62%)", fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 25%, 62%)", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "hsl(215, 25%, 62%)" }} />
            <Bar dataKey="avgCongestion" name="Avg Congestion %" fill="hsl(38, 92%, 50%)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="peakVolume" name="Peak Volume" fill="hsl(199, 89%, 60%)" radius={[3, 3, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficCharts;
