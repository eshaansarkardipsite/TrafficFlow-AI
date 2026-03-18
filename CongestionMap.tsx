import type { ZoneCongestion } from "@/lib/trafficData";

interface CongestionMapProps {
  zones: ZoneCongestion[];
}

const levelColor = (level: string) => {
  if (level === "High") return "bg-status-high";
  if (level === "Medium") return "bg-status-medium";
  return "bg-status-low";
};

const levelRingColor = (level: string) => {
  if (level === "High") return "bg-status-high/30";
  if (level === "Medium") return "bg-status-medium/30";
  return "bg-status-low/30";
};

const CongestionMap = ({ zones }: CongestionMapProps) => {
  // Create a grid-based map visualization
  const gridCols = 4;
  const gridRows = 3;

  return (
    <div className="glass-card-solid rounded-lg p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Live Congestion Map</h3>
          <p className="text-xs text-muted-foreground">New York City — Zone Overview</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-low" /> Low</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-medium" /> Medium</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-high" /> High</span>
        </div>
      </div>

      {/* Stylized map grid */}
      <div className="relative bg-background/50 rounded-md border border-border overflow-hidden" style={{ minHeight: 320 }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="hsl(199, 89%, 60%)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="hsl(199, 89%, 60%)" strokeWidth="0.5" />
          ))}
        </svg>

        {/* Zone nodes */}
        <div className="relative grid gap-2 p-3" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gridTemplateRows: `repeat(${gridRows}, 1fr)` }}>
          {zones.map((zone, i) => (
            <div
              key={zone.zone}
              className="relative flex flex-col items-center justify-center p-3 rounded-md bg-card/40 border border-border/50 hover:border-primary/50 transition-colors cursor-default group"
            >
              {/* Pulse for high congestion */}
              {zone.level === "High" && (
                <span className={`absolute inset-0 rounded-md ${levelRingColor(zone.level)} pulse-hotspot`} />
              )}
              <span className={`w-3 h-3 rounded-full ${levelColor(zone.level)} relative z-10 mb-1.5`} />
              <span className="text-xs font-medium text-foreground text-center leading-tight relative z-10">{zone.zone}</span>
              <span className="font-mono-data text-xs text-muted-foreground relative z-10 mt-0.5">{zone.congestion}%</span>
              {/* Tooltip-like detail on hover */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 glass-card rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                <span className="font-mono-data text-muted-foreground">{zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CongestionMap;
