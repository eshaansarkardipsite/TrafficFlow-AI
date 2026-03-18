import { useState } from "react";
import { Brain, ChevronDown, ChevronUp, Cpu } from "lucide-react";
import { predictCongestion } from "@/lib/trafficData";

const ZONES = [
  "Downtown Core", "Midtown", "Financial District", "Brooklyn Bridge",
  "Times Square", "Chelsea", "Upper East Side", "Harlem", "SoHo",
  "East Village", "Hell's Kitchen", "Tribeca",
];

const PredictionPanel = () => {
  const [zone, setZone] = useState(ZONES[0]);
  const [hour, setHour] = useState(new Date().getHours());
  const [day, setDay] = useState(new Date().getDay());
  const [result, setResult] = useState<ReturnType<typeof predictCongestion> | null>(null);
  const [expanded, setExpanded] = useState(true);

  const handlePredict = () => {
    setResult(predictCongestion(hour, day, zone));
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass-card-solid rounded-lg overflow-hidden animate-slide-up">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">AI Prediction Engine</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Zone</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Hour</label>
              <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground font-mono-data focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, "0")}:00</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Day</label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {days.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePredict}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Cpu className="w-4 h-4" />
            Run Prediction
          </button>

          {result && (
            <div className="bg-background/50 border border-border rounded-md p-3 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Congestion Level</span>
                <span className={`text-sm font-bold ${
                  result.level === "High" ? "status-high" : result.level === "Medium" ? "status-medium" : "status-low"
                }`}>
                  {result.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Traffic Density</span>
                <span className="text-sm font-mono-data text-foreground">{result.density}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-sm font-mono-data text-primary">{result.confidence}%</span>
              </div>
              {/* Density bar */}
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.level === "High" ? "bg-status-high" : result.level === "Medium" ? "bg-status-medium" : "bg-status-low"
                  }`}
                  style={{ width: `${result.density}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;
