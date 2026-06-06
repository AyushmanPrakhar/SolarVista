import React from 'react';
import { Lightbulb, TrendingUp, ShieldCheck, MapPin } from 'lucide-react';

export default function InfrastructureInsights({ parks }) {
  const insights = React.useMemo(() => {
    const totalCapacity = parks.reduce((sum, p) => sum + p.capacityMW, 0);
    const sorted = [...parks].sort((a, b) => b.capacityMW - a.capacityMW);
    const largest = sorted[0];
    
    const stateCounts = parks.reduce((acc, p) => {
      acc[p.state] = (acc[p.state] || 0) + p.capacityMW;
      return acc;
    }, {});
    const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0];

    const accelerationYear = 2016;
    const post2016 = parks.filter(p => p.year >= accelerationYear).length;
    const accelPct = (post2016 / parks.length) * 100;

    return [
      {
        title: "State Dominance",
        body: `${topState[0]} currently hosts the highest installed solar park capacity in the country with ${topState[1]} MW.`,
        icon: <MapPin className="text-orange-500" />,
        bg: "bg-orange-50"
      },
      {
        title: "Anchor Asset",
        body: `${largest.name} contributes the largest single-location share (${((largest.capacityMW / totalCapacity) * 100).toFixed(1)}%) of tracked infrastructure.`,
        icon: <TrendingUp className="text-emerald-500" />,
        bg: "bg-emerald-50"
      },
      {
        title: "Growth Acceleration",
        body: `Utility-scale installations have surged, with ${accelPct.toFixed(0)}% of tracked projects commissioned after ${accelerationYear}.`,
        icon: <Lightbulb className="text-amber-500" />,
        bg: "bg-amber-50"
      },
      {
        title: "Strategic Distribution",
        body: "Large-scale deployment is heavily concentrated in Northern and Southern clusters due to high GHI and available arid land.",
        icon: <ShieldCheck className="text-blue-500" />,
        bg: "bg-blue-50"
      }
    ];
  }, [parks]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {insights.map((insight, idx) => (
        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
          <div className={`p-3 rounded-2xl ${insight.bg} shrink-0`}>
            {React.cloneElement(insight.icon, { size: 24 })}
          </div>
          <div>
            <h4 className="font-bold text-[#0B132B] mb-1">{insight.title}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{insight.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
