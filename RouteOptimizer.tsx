import { Navigation, Clock, ArrowRight, Zap } from "lucide-react";
import type { RouteOption } from "@/lib/trafficData";
import { useState } from "react";

interface RouteOptimizerProps {
  routes: RouteOption[];
}

const levelBadge = (level: string) => {
  const cls =
    level === "High"
      ? "bg-status-high/20 text-status-high"
      : level === "Medium"
        ? "bg-status-medium/20 text-status-medium"
        : "bg-status-low/20 text-status-low";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{level}</span>;
};

const RouteOptimizer = ({ routes }: RouteOptimizerProps) => {
  const [selected, setSelected] = useState("optimized");
  const current = routes.find((r) => r.id === "current");
  const optimized = routes.find((r) => r.id === selected);
  const timeSaved = current && optimized ? current.estimatedTime - optimized.estimatedTime : 0;

  return (
    <div className="glass-card-solid rounded-lg p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Route Optimization</h3>
          <p className="text-xs text-muted-foreground">AI-powered route comparison</p>
        </div>
        {timeSaved > 0 && (
          <div className="flex items-center gap-1 bg-status-low/10 text-status-low rounded-full px-3 py-1 text-xs font-medium">
            <Zap className="w-3 h-3" />
            Save {timeSaved} min
          </div>
        )}
      </div>

      <div className="space-y-2">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => setSelected(route.id)}
            className={`w-full text-left rounded-md p-3 border transition-all ${
              selected === route.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card/30 hover:border-border/80"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Navigation className={`w-3.5 h-3.5 ${route.id === "optimized" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium text-foreground">{route.name}</span>
              </div>
              {levelBadge(route.congestionLevel)}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="font-mono-data">{route.distance} mi</span>
              <ArrowRight className="w-3 h-3" />
              <span className="flex items-center gap-1 font-mono-data">
                <Clock className="w-3 h-3" />
                {route.estimatedTime} min
              </span>
              <div className="flex gap-0.5 ml-auto">
                {route.segments.map((seg, i) => (
                  <span
                    key={i}
                    className={`w-5 h-1.5 rounded-full ${
                      seg.congestion === "High"
                        ? "bg-status-high"
                        : seg.congestion === "Medium"
                          ? "bg-status-medium"
                          : "bg-status-low"
                    }`}
                  />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RouteOptimizer;
