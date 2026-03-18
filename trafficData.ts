export type CongestionLevel = "Low" | "Medium" | "High";

export interface TrafficDataPoint {
  timestamp: Date;
  hour: number;
  dayOfWeek: number;
  location: string;
  lat: number;
  lng: number;
  volume: number;
  speed: number;
  congestionLevel: CongestionLevel;
  density: number;
}

export interface RouteOption {
  id: string;
  name: string;
  distance: number;
  estimatedTime: number;
  congestionLevel: CongestionLevel;
  segments: { lat: number; lng: number; congestion: CongestionLevel }[];
}

export interface KPIData {
  avgCongestion: number;
  peakHour: string;
  mostCongestedRoute: string;
  timeSaved: number;
}

export interface HourlyTrend {
  hour: string;
  volume: number;
  speed: number;
  congestion: number;
}

export interface ZoneCongestion {
  zone: string;
  lat: number;
  lng: number;
  congestion: number;
  level: CongestionLevel;
}

const ZONES = [
  { name: "Downtown Core", lat: 40.7128, lng: -74.006 },
  { name: "Midtown", lat: 40.7549, lng: -73.984 },
  { name: "Financial District", lat: 40.7075, lng: -74.0113 },
  { name: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969 },
  { name: "Times Square", lat: 40.758, lng: -73.9855 },
  { name: "Chelsea", lat: 40.7465, lng: -74.0014 },
  { name: "Upper East Side", lat: 40.7736, lng: -73.9566 },
  { name: "Harlem", lat: 40.8116, lng: -73.9465 },
  { name: "SoHo", lat: 40.7233, lng: -74.0030 },
  { name: "East Village", lat: 40.7265, lng: -73.9815 },
  { name: "Hell's Kitchen", lat: 40.7638, lng: -73.9918 },
  { name: "Tribeca", lat: 40.7163, lng: -74.0086 },
];

const ROUTES = [
  "I-278 Expressway",
  "FDR Drive",
  "Broadway",
  "5th Avenue",
  "West Side Highway",
  "Holland Tunnel",
  "Lincoln Tunnel",
  "Queens Blvd",
];

function getCongestionMultiplier(hour: number, dayOfWeek: number): number {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  let base = 0.3;

  if (!isWeekend) {
    if (hour >= 7 && hour <= 9) base = 0.85 + Math.random() * 0.15;
    else if (hour >= 16 && hour <= 19) base = 0.8 + Math.random() * 0.2;
    else if (hour >= 10 && hour <= 15) base = 0.45 + Math.random() * 0.15;
    else if (hour >= 20 && hour <= 23) base = 0.25 + Math.random() * 0.15;
    else base = 0.1 + Math.random() * 0.1;
  } else {
    if (hour >= 10 && hour <= 14) base = 0.4 + Math.random() * 0.15;
    else if (hour >= 15 && hour <= 19) base = 0.5 + Math.random() * 0.15;
    else base = 0.15 + Math.random() * 0.1;
  }

  // Random spikes
  if (Math.random() < 0.05) base = Math.min(1, base + 0.3);

  return base;
}

function getLevel(congestion: number): CongestionLevel {
  if (congestion < 0.4) return "Low";
  if (congestion < 0.7) return "Medium";
  return "High";
}

export function generateHourlyTrends(): HourlyTrend[] {
  const now = new Date();
  const dayOfWeek = now.getDay();

  return Array.from({ length: 24 }, (_, hour) => {
    const mult = getCongestionMultiplier(hour, dayOfWeek);
    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      volume: Math.round(500 + mult * 4500),
      speed: Math.round(60 - mult * 45),
      congestion: Math.round(mult * 100),
    };
  });
}

export function generateZoneCongestion(): ZoneCongestion[] {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  const baseMult = getCongestionMultiplier(hour, dayOfWeek);

  return ZONES.map((zone) => {
    const variance = (Math.random() - 0.5) * 0.3;
    const congestion = Math.max(0, Math.min(1, baseMult + variance));
    return {
      zone: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      congestion: Math.round(congestion * 100),
      level: getLevel(congestion),
    };
  });
}

export function generateKPIs(): KPIData {
  const trends = generateHourlyTrends();
  const peakIdx = trends.reduce((max, t, i) => (t.congestion > trends[max].congestion ? i : max), 0);
  const avg = Math.round(trends.reduce((s, t) => s + t.congestion, 0) / trends.length);

  return {
    avgCongestion: avg,
    peakHour: trends[peakIdx].hour,
    mostCongestedRoute: ROUTES[Math.floor(Math.random() * ROUTES.length)],
    timeSaved: Math.round(8 + Math.random() * 22),
  };
}

export function generateRouteOptions(): RouteOption[] {
  const now = new Date();
  const mult = getCongestionMultiplier(now.getHours(), now.getDay());

  return [
    {
      id: "current",
      name: "Current Route (I-278 → FDR Drive)",
      distance: 12.4,
      estimatedTime: Math.round(25 + mult * 35),
      congestionLevel: getLevel(mult),
      segments: ZONES.slice(0, 5).map((z) => ({
        lat: z.lat,
        lng: z.lng,
        congestion: getLevel(mult + (Math.random() - 0.5) * 0.2),
      })),
    },
    {
      id: "optimized",
      name: "AI Optimized (West Side Hwy → Broadway)",
      distance: 14.1,
      estimatedTime: Math.round(20 + mult * 15),
      congestionLevel: getLevel(Math.max(0, mult - 0.25)),
      segments: ZONES.slice(3, 8).map((z) => ({
        lat: z.lat,
        lng: z.lng,
        congestion: getLevel(Math.max(0, mult - 0.2 + (Math.random() - 0.5) * 0.15)),
      })),
    },
    {
      id: "alt",
      name: "Alternative (Holland Tunnel → 5th Ave)",
      distance: 15.8,
      estimatedTime: Math.round(22 + mult * 22),
      congestionLevel: getLevel(Math.max(0, mult - 0.1)),
      segments: ZONES.slice(5, 10).map((z) => ({
        lat: z.lat,
        lng: z.lng,
        congestion: getLevel(Math.max(0, mult - 0.1 + (Math.random() - 0.5) * 0.15)),
      })),
    },
  ];
}

export function generateWeeklyData(): { day: string; avgCongestion: number; peakVolume: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => {
    const isWeekend = i >= 5;
    const base = isWeekend ? 35 + Math.random() * 15 : 55 + Math.random() * 25;
    return {
      day,
      avgCongestion: Math.round(base),
      peakVolume: Math.round(isWeekend ? 2000 + Math.random() * 1500 : 3500 + Math.random() * 2000),
    };
  });
}

export function predictCongestion(hour: number, dayOfWeek: number, zone: string): {
  level: CongestionLevel;
  density: number;
  confidence: number;
} {
  const mult = getCongestionMultiplier(hour, dayOfWeek);
  const zoneData = ZONES.find((z) => z.name === zone);
  const variance = zoneData ? (Math.random() - 0.5) * 0.15 : 0;
  const density = Math.max(0, Math.min(100, Math.round((mult + variance) * 100)));

  return {
    level: getLevel((mult + variance)),
    density,
    confidence: Math.round(78 + Math.random() * 18),
  };
}
