import {
  ADOPTION_MODERATE,
  ADOPTION_THRESHOLD,
  READINESS_THRESHOLD,
} from "./constants";
import { formatGhi, formatMu, formatPercent } from "./format";
import { MONTHS, INDIA_SEASONALITY } from "../../data/solarMonthlyProfile";
import { getTopBy } from "./compute";

export function classifyMarketQuadrant(row) {
  const { readiness, adoption } = row;
  if (readiness >= READINESS_THRESHOLD && adoption >= ADOPTION_THRESHOLD) return "Leaders";
  if (readiness >= READINESS_THRESHOLD && adoption < ADOPTION_THRESHOLD) return "Investment Targets";
  if (readiness < READINESS_THRESHOLD && adoption < ADOPTION_MODERATE) return "Policy Focus";
  return "Emerging Markets";
}

export function buildQuadrantSummary(states) {
  const groups = buildInvestmentQuadrants(states);
  return {
    counts: {
      Leaders: groups.Leaders.length,
      "Investment Targets": groups["Investment Targets"].length,
      "Emerging Markets": groups["Emerging Markets"].length,
      "Policy Focus": groups["Policy Focus"].length,
    },
    groups,
    interpretation:
      groups["Investment Targets"].length >= groups.Leaders.length
        ? "More states sit in the investment-target zone than in mature leadership, which suggests national growth will depend on converting readiness into adoption rather than discovering new resource."
        : "A meaningful share of states has achieved adoption–readiness alignment, while the investment-target cohort remains large enough to sustain near-term pipeline growth.",
  };
}

export function buildInvestmentQuadrants(states) {
  const groups = {
    Leaders: [],
    "Investment Targets": [],
    "Emerging Markets": [],
    "Policy Focus": [],
  };
  states.forEach((row) => {
    groups[classifyMarketQuadrant(row)].push(row);
  });
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => b.investmentScore - a.investmentScore);
  });
  return groups;
}

export function buildExecutiveIntelligence(states, regionalRows, nationalSummary) {
  const totalGen = nationalSummary.totalGeneration;
  const topGen = getTopBy(states, "generation");
  const topGhi = getTopBy(states, "ghi");
  const topOpp = getTopBy(states, "opportunityIndex");
  const topAdoption = getTopBy(states, "adoption");
  const topReadiness = getTopBy(states, "readiness");

  const underutilized = [...states]
    .filter((row) => row.ghi >= nationalSummary.avgGhi && row.generation < totalGen * 0.02)
    .sort((a, b) => b.ghi - a.ghi)[0];

  const growthRegion = [...regionalRows].sort((a, b) => b.opportunity - a.opportunity)[0];
  const policyRegion = [...regionalRows]
    .filter((r) => r.readiness < 55 || r.adoption < 45)
    .sort((a, b) => a.adoption - b.adoption)[0];

  const genShare = ((topGen.generation / totalGen) * 100).toFixed(0);

  return [
    {
      title: "Top Solar Resource",
      value: topGhi.state,
      metric: formatGhi(topGhi.ghi),
      what: `${topGhi.state} records the highest mean irradiance in the dataset at ${topGhi.ghi.toFixed(2)} kWh/m²/day.`,
      why: "Irradiance governs capacity factor, PPA competitiveness, and the economic case for utility-scale and RTC tenders.",
      significance:
        "For developers and financiers, this state anchors the reference case for western corridor returns and sets the upper bound for national resource quality.",
    },
    {
      title: "Top Generation",
      value: topGen.state,
      metric: formatMu(topGen.generation),
      what: `${topGen.state} accounts for roughly ${genShare}% of aggregate state-level output in this view.`,
      why: "Installed output reflects years of policy execution, evacuation availability, and developer concentration.",
      significance:
        "Portfolio and grid planners should treat this market as systemically important: curtailment, forecasting, and repowering decisions here move national statistics.",
    },
    {
      title: "Highest Opportunity",
      value: topOpp.state,
      metric: `Gap ${topOpp.opportunityIndex} pts`,
      what: `${topOpp.state} combines ${formatPercent(topOpp.readiness)} readiness with ${formatPercent(topOpp.adoption)} adoption.`,
      why: "A wide readiness–adoption gap usually means the market can absorb more capacity without fundamental resource or policy redesign.",
      significance:
        "This is the archetypal adoption-bridge candidate for state agencies, SECI-style tenders, and investors seeking growth with moderated development risk.",
    },
    {
      title: "Best Adoption",
      value: topAdoption.state,
      metric: formatPercent(topAdoption.adoption),
      what: `${topAdoption.state} shows the strongest observed uptake relative to peers.`,
      why: "High adoption typically correlates with lower offtake uncertainty and faster COD absorption.",
      significance: "Use this state as a behavioural benchmark when designing incentives in markets that remain readiness-rich but adoption-poor.",
    },
    {
      title: "Best Readiness",
      value: topReadiness.state,
      metric: formatPercent(topReadiness.readiness),
      what: `${topReadiness.state} ranks first on composite readiness in this framework.`,
      why: "Readiness captures permitting friction, grid access, and institutional capacity to host new projects.",
      significance: "Bankable greenfield and brownfield expansion is most likely to clear execution milestones here first.",
    },
    {
      title: "Most Underutilized",
      value: underutilized?.state || "Ladakh",
      metric: underutilized ? formatGhi(underutilized.ghi) : "—",
      what: underutilized
        ? `${underutilized.state} pairs above-average GHI with a small installed base (${formatMu(underutilized.generation)}).`
        : "Several high-resource states remain lightly developed relative to irradiance.",
      why: "Resource–deployment mismatches often trace to transmission, land, or early-stage market design rather than irradiance alone.",
      significance:
        "Long-dated investors may find asymmetric upside, but only after evacuation and offtake pathways are de-risked.",
    },
    {
      title: "Growth Potential Region",
      value: growthRegion?.region || "West",
      metric: `Opportunity ${growthRegion?.opportunity?.toFixed(1) ?? "—"}`,
      what: `${growthRegion?.region} posts the widest regional readiness–adoption spread in this aggregation.`,
      why: "Regional gaps aggregate state-level frictions that single-state analysis can obscure.",
      significance: "Regional coordination on adoption incentives may yield higher marginal impact than isolated state pilots.",
    },
    {
      title: "Policy Priority Region",
      value: policyRegion?.region || "North-East",
      metric: `Adoption ${policyRegion?.adoption?.toFixed(0) ?? "—"}%`,
      what: `${policyRegion?.region || "North-East"} lags on adoption and readiness relative to the national mean.`,
      why: "Low scores usually indicate grid and institutional constraints that capital alone cannot solve.",
      significance: "Public investment should emphasise distributed solar, DISCOM reform, and grid studies before utility-scale procurement.",
    },
  ];
}

/** @deprecated use buildExecutiveIntelligence */
export const buildExecutiveSummary = buildExecutiveIntelligence;

export function buildNationalNarrative(states, regionalRows, nationalSummary) {
  const topGhi = getTopBy(states, "ghi");
  const south = regionalRows.find((r) => r.region === "South");
  const northEast = regionalRows.find((r) => r.region === "North-East");
  const underperformers = states
    .filter((s) => s.readiness >= READINESS_THRESHOLD && s.adoption < ADOPTION_THRESHOLD)
    .sort((a, b) => b.opportunityIndex - a.opportunityIndex)
    .slice(0, 3);

  return [
    `${topGhi.state} continues to dominate India's solar landscape, combining exceptional irradiance with industry-leading deployment readiness and generation capacity.`,
    south
      ? `South India presents the most internally coherent market, where readiness near ${south.readiness.toFixed(0)}% and adoption near ${south.adoption.toFixed(0)}% suggest that policy design—not resource discovery—is the remaining constraint.`
      : "Southern states remain the closest national analogue to a mature solar ecosystem.",
    northEast
      ? `North-East India is still underutilised in output terms (${formatMu(northEast.generation)} regional generation) despite moderate resource levels, which points to infrastructure and market depth rather than irradiance as the binding issue.`
      : "North-Eastern states require foundational grid and policy work before large-scale procurement.",
    underperformers.length
      ? `${underperformers.map((s) => s.state).join(", ")} illustrate the national pattern of high readiness with lagging adoption; closing that gap is where the next wave of megawatt-scale growth is most likely to originate.`
      : "Readiness and adoption are broadly aligned among leading states, shifting policy attention toward storage, forecasting, and grid flexibility.",
    `At ${nationalSummary.avgGhi.toFixed(2)} kWh/m²/day, the national mean GHI remains comfortably above the utility-scale viability threshold, which supports continued ambition in MNRE procurement calendars.`,
  ];
}

export function buildSeasonalNarrative(insight) {
  const { best, worst, volatility } = insight;
  return [
    `${best.month} represents the strongest national solar resource window, with mean GHI of ${best.ghi.toFixed(2)} kWh/m²/day.`,
    `The monsoon period compresses resource availability; ${worst.month} typically marks the annual trough at ${worst.ghi.toFixed(2)} kWh/m²/day.`,
    `Month-to-month variability near ${volatility.toFixed(0)}% has direct implications for storage sizing, maintenance scheduling, and revenue forecasting.`,
  ];
}

export function buildStateMonthlySeries(state, monthlyNational) {
  return MONTHS.map((month, index) => {
    const national = monthlyNational.find((m) => m.month === month) || monthlyNational[index];
    const ghi = Number((state.ghi * INDIA_SEASONALITY[index]).toFixed(2));
    return {
      month,
      ghi,
      nationalGhi: national?.ghi ?? ghi,
      isMonsoon: index >= 5 && index <= 8,
    };
  });
}
