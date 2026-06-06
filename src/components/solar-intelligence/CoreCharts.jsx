import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { METRIC_COLORS } from "../../utils/solarIntelligence/constants";
import { mean } from "../../utils/solarIntelligence/compute";
import { getChartTheme } from "../../utils/solarIntelligence/theme";
import { ChartCard, InterpretationNote, SectionHeading } from "./ui";

export function RegionalGroupedChart({ rows, dark }) {
  const theme = getChartTheme(dark);
  const nationalGhi = mean(rows.map((r) => r.avgGhi));
  const chartRows = useMemo(
    () => rows.map((r) => ({ ...r, generationK: Math.round(r.generation / 1000) })),
    [rows]
  );
  const lagging = [...rows].sort((a, b) => a.adoption - b.adoption)[0];

  return (
    <ChartCard dark={dark}>
      <SectionHeading
        eyebrow="Regional comparison"
        title="Regional metrics at a glance"
        subtitle="Average GHI, readiness, adoption, and generation by macro-region"
        benchmark={`National mean GHI: ${nationalGhi.toFixed(2)} kWh/m²/day`}
        dark={dark}
      />
      <div className="mt-4 h-[380px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chartRows} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="region" tick={{ fill: theme.axis, fontSize: 11 }} angle={-20} textAnchor="end" height={56} />
            <YAxis tick={{ fill: theme.axis, fontSize: 11 }} />
            <Tooltip contentStyle={theme.tooltip} />
            <Legend wrapperStyle={{ fontSize: 12, color: theme.axis }} />
            <ReferenceLine
              y={nationalGhi}
              stroke={METRIC_COLORS.ghi}
              strokeDasharray="5 5"
              label={{ value: "Nat. GHI", fill: METRIC_COLORS.ghi, fontSize: 10 }}
            />
            <Bar name="Avg GHI" dataKey="avgGhi" fill={METRIC_COLORS.ghi} radius={[4, 4, 0, 0]} />
            <Bar name="Readiness %" dataKey="readiness" fill={METRIC_COLORS.readiness} radius={[4, 4, 0, 0]} />
            <Bar name="Adoption %" dataKey="adoption" fill={METRIC_COLORS.adoption} radius={[4, 4, 0, 0]} />
            <Bar name="Generation (k MU)" dataKey="generationK" fill={METRIC_COLORS.generation} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <InterpretationNote dark={dark}>
        {lagging?.region} records the lowest adoption ({lagging.adoption.toFixed(1)}%) in this view. That pattern
        usually reflects DISCOM performance and market depth more than irradiance alone.
      </InterpretationNote>
    </ChartCard>
  );
}
