import { formatGhi, formatMu, formatPercent } from "./format";

export function buildStateInsights(row, nationalAvgGhi) {
  const ghiDelta = ((row.ghi / nationalAvgGhi - 1) * 100).toFixed(1);
  const gap = row.readiness - row.adoption;
  const genRank = row.generation >= 10000 ? "top-tier deployment" : row.generation >= 2000 ? "mid-scale market" : "emerging market";

  const resource =
    row.ghi >= nationalAvgGhi
      ? `${row.state} records ${formatGhi(row.ghi)} (${ghiDelta}% above national average), classifying it as a ${row.resourceBand.toLowerCase()} resource state suitable for ${row.ghi >= 6 ? "utility-scale and green hydrogen" : "C&I and selective utility"} procurement.`
      : `${row.state} at ${formatGhi(row.ghi)} sits ${Math.abs(ghiDelta)}% below the national benchmark — distributed solar and storage-coupled models should precede GW-scale greenfield development.`;

  const investment =
    gap >= 12
      ? `With investment score ${row.investmentScore}/100 and a ${gap}-point readiness–adoption gap, ${row.state} ranks among the highest-return markets for capital deployment without incremental resource assessment.`
      : row.generation >= 5000
        ? `As a ${genRank} (${formatMu(row.generation)}), ${row.state} favours repowering, forecasting upgrades, and curtailment management over greenfield expansion.`
        : `Investment score ${row.investmentScore}/100 with ${formatMu(row.generation)} installed — transmission and land-bank readiness should gate multi-GW commitments.`;

  const policy =
    row.readiness < 50
      ? `Policy priority: grid impact studies and DISCOM reform — readiness at ${formatPercent(row.readiness)} constrains bankability under current MNRE frameworks.`
      : gap >= 12
        ? `MNRE adoption-bridge instruments could unlock ${gap} percentage points of latent readiness; permitting timelines are the binding constraint, not irradiance.`
        : `Execution-ready policy stack (${formatPercent(row.readiness)} readiness) — shift to storage mandates, forecasting compliance, and RTC tender design.`;

  const risk =
    row.riskScore >= 55
      ? `Composite risk ${row.riskScore}/100 reflects adoption lag and grid constraints — structure phased COD, DFI guarantees, and curtailment caps in term sheets.`
      : `Risk score ${row.riskScore}/100 supports standard project finance; tariff indexation and state guarantee packages remain adequate.`;

  const commercial =
    row.ghi >= 6
      ? `Commercial thesis: LCOE competitiveness supports SECI-linked PPAs, with optional green hydrogen and RTC+storage offtake pathways.`
      : `Commercial thesis: prioritize C&I PPAs and KUSUM-aligned distributed models; merchant exposure should remain subordinate to contracted revenue.`;

  const recommendations = [
    row.strategy,
    gap >= 12 ? `Deploy readiness-to-adoption bridge with ${row.state} DISCOM within 12 months.` : null,
    row.ghi >= 6 && row.generation < 2000 ? "Sequence interstate evacuation before financial close on first 500 MW tranche." : null,
    row.riskScore >= 55 ? "Require grid impact study and World Bank-style risk mitigation prior to commitment." : null,
    "Report quarterly against CEA / national solar mission KPIs.",
  ].filter(Boolean);

  return { resource, investment, policy, risk, commercial, recommendations };
}
