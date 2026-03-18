import { useState, useEffect } from "react";
import { Activity, Radio } from "lucide-react";
import KPICards from "@/components/KPICards";
import TrafficCharts from "@/components/TrafficCharts";
import CongestionMap from "@/components/CongestionMap";
import RouteOptimizer from "@/components/RouteOptimizer";
import PredictionPanel from "@/components/PredictionPanel";
import {
  generateHourlyTrends,
  generateZoneCongestion,
  generateKPIs,
  generateRouteOptions,
  generateWeeklyData,
} from "@/lib/trafficData";

const Index = () => {
  const [hourlyData, setHourlyData] = useState(generateHourlyTrends());
  const [zones, setZones] = useState(generateZoneCongestion());
  const [kpis, setKpis] = useState(generateKPIs());
  const [routes, setRoutes] = useState(generateRouteOptions());
  const [weeklyData] = useState(generateWeeklyData());
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHourlyData(generateHourlyTrends());
      setZones(generateZoneCongestion());
      setKpis(generateKPIs());
      setRoutes(generateRouteOptions());
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">TrafficAI</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Smart Congestion Prediction</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Radio className="w-3 h-3 text-status-low animate-pulse" />
            <span className="font-mono-data">
              Live — {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4 space-y-4">
        {/* KPIs */}
        <KPICards data={kpis} />

        {/* Map + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CongestionMap zones={zones} />
          </div>
          <div className="space-y-4">
            <PredictionPanel />
            <RouteOptimizer routes={routes} />
          </div>
        </div>

        {/* Charts */}
        <TrafficCharts hourlyData={hourlyData} weeklyData={weeklyData} />
      </main>
    </div>
  );
};

export default Index;
