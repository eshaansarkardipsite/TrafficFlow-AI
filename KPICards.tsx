import { Activity, Clock, MapPin, Zap } from "lucide-react";
import type { KPIData } from "@/lib/trafficData";

interface KPICardsProps {
  data: KPIData;
}

const KPICards = ({ data }: KPICardsProps) => {
  const cards = [
    {
      title: "Avg Congestion",
      value: `${data.avgCongestion}%`,
      icon: Activity,
      color: data.avgCongestion > 60 ? "status-high" : data.avgCongestion > 35 ? "status-medium" : "status-low",
    },
    {
      title: "Peak Hour",
      value: data.peakHour,
      icon: Clock,
      color: "text-primary",
      mono: true,
    },
    {
      title: "Most Congested",
      value: data.mostCongestedRoute,
      icon: MapPin,
      color: "status-high",
      small: true,
    },
    {
      title: "Time Saved (AI)",
      value: `${data.timeSaved} min`,
      icon: Zap,
      color: "status-low",
      mono: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.title} className="glass-card rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <card.icon className={`w-4 h-4 ${card.color}`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {card.title}
            </span>
          </div>
          <p className={`${card.small ? "text-lg" : "text-2xl"} font-bold ${card.color} ${card.mono ? "font-mono-data" : ""}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
