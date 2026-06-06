import { buildStateTooltipPayload } from "../../utils/solarIntelligence/tooltips";

export default function RichStateTooltip({ active, payload, states, nationalSummary, metricKey, dark }) {
  if (!active || !payload?.length) return null;
  const state = payload[0]?.payload;
  if (!state?.state) return null;

  const data = buildStateTooltipPayload(state, states, nationalSummary, metricKey);

  return (
    <div
      className={`max-w-[280px] rounded-lg border p-3 text-xs shadow-xl ${
        dark ? "border-slate-600 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <p className="text-sm font-bold">{data.state}</p>
      <p className="mt-1.5">
        <span className={dark ? "text-slate-400" : "text-slate-500"}>{data.metricLabel}: </span>
        <span className="font-semibold">{data.valueDisplay}</span>
      </p>
      <p className={dark ? "text-slate-400" : "text-slate-500"}>National average: {data.nationalDisplay}</p>
      <p className="mt-1 font-semibold text-[#C2410C]">
        Rank #{data.rank} of {data.total}
      </p>
      <p className={`mt-2 leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{data.interpretation}</p>
    </div>
  );
}
