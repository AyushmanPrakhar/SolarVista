import { INDIA_SEASONALITY, MONTHS } from "../../data/solarMonthlyProfile";
import { monthlySolarTrend } from "../../data/indiaGhiData";
import { ADOPTION_THRESHOLD, READINESS_THRESHOLD } from "./constants";
import { normalizeStateName } from "./format";

export { normalizeStateName };

export function getResourceBand(ghi) {
  if (!Number.isFinite(ghi)) return "Unknown";
  if (ghi >= 6) return "Very High";
  if (ghi >= 5.5) return "High";
  if (ghi >= 5) return "Moderate";
  return "Low";
}

function getReadinessBand(readiness) {
  if (readiness >= 75) return "High";
  if (readiness >= 55) return "Medium";
  return "Low";
}

function getAdoptionBand(adoption) {
  if (adoption >= 75) return "High";
  if (adoption >= 50) return "Medium";
  return "Low";
}

function getOpportunityBand(index) {
  if (index >= 15) return "High";
  if (index >= 8) return "Medium";
  return "Low";
}

function getRiskBand(score) {
  if (score >= 55) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function getRiskScore(row) {
  const adoptionGap = Math.max(0, row.readiness - row.adoption);
  const lowReadiness = Math.max(0, 70 - row.readiness);
  const lowResource = Math.max(0, 5 - row.ghi) * 10;
  return Math.round(Math.min(100, adoptionGap * 2 + lowReadiness * 0.5 + lowResource));
}

function getInvestmentScore(row, opportunityIndex) {
  const resourceScore = Math.min(100, (row.ghi / 6.5) * 100);
  return Math.round(
    Math.min(100, resourceScore * 0.38 + row.readiness * 0.3 + row.adoption * 0.14 + opportunityIndex * 1.25)
  );
}

function getStrategy(row) {
  if (row.ghi >= 6 && row.generation < 1000)
    return "Prioritize resource validation, transmission planning, and first-mover utility-scale procurement.";
  if (row.ghi >= 6) return "Expand utility-scale capacity, storage-backed PPAs, and interstate evacuation infrastructure.";
  if (row.readiness - row.adoption >= 12)
    return "Target investor facilitation, faster approvals, and adoption incentives to close the readiness gap.";
  if (row.adoption >= 75 && row.readiness >= 75)
    return "Optimize mature-market deployment with storage, forecasting, and curtailment reduction.";
  if (row.readiness < 45)
    return "Focus on policy readiness, grid studies, and distributed solar pilots before large utility-scale expansion.";
  return "Develop a phased project pipeline combining distributed solar, C&I rooftops, and selective utility-scale sites.";
}

function getRegion(state) {
  const north = [
    "Jammu and Kashmir",
    "Ladakh",
    "Himachal Pradesh",
    "Punjab",
    "Haryana",
    "Uttarakhand",
    "Uttar Pradesh",
    "Delhi",
    "Chandigarh",
  ];
  const south = ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Kerala"];
  const east = ["Bihar", "Jharkhand", "West Bengal", "Odisha"];
  const west = ["Rajasthan", "Gujarat", "Maharashtra", "Goa"];
  const central = ["Madhya Pradesh", "Chhattisgarh"];
  const northEast = [
    "Assam",
    "Meghalaya",
    "Tripura",
    "Mizoram",
    "Manipur",
    "Nagaland",
    "Arunachal Pradesh",
    "Sikkim",
  ];

  if (north.includes(state)) return "North";
  if (south.includes(state)) return "South";
  if (east.includes(state)) return "East";
  if (west.includes(state)) return "West";
  if (central.includes(state)) return "Central";
  if (northEast.includes(state)) return "North-East";
  return "Island and UT";
}

export function enrichState(row) {
  const opportunityIndex = row.readiness - row.adoption;
  const resourceBand = getResourceBand(row.ghi);
  const readinessBand = getReadinessBand(row.readiness);
  const adoptionBand = getAdoptionBand(row.adoption);
  const opportunityBand = getOpportunityBand(opportunityIndex);
  const riskScore = getRiskScore(row);

  return {
    ...row,
    opportunityIndex,
    resourceBand,
    readinessBand,
    adoptionBand,
    opportunityBand,
    riskScore,
    riskBand: getRiskBand(riskScore),
    investmentScore: getInvestmentScore(row, opportunityIndex),
    strategy: getStrategy({ ...row, opportunityIndex }),
    region: getRegion(row.state),
  };
}

export function getTopBy(rows, key) {
  return [...rows].sort((a, b) => b[key] - a[key])[0];
}

export function buildNationalSummary(states) {
  const avgGhi = mean(states.map((row) => row.ghi));
  return {
    avgGhi,
    totalGeneration: states.reduce((sum, row) => sum + row.generation, 0),
    bestSolarState: getTopBy(states, "ghi"),
    bestOpportunityState: getTopBy(states, "opportunityIndex"),
    avgReadiness: mean(states.map((row) => row.readiness)),
    avgAdoption: mean(states.map((row) => row.adoption)),
    avgInvestment: mean(states.map((row) => row.investmentScore)),
    avgRisk: mean(states.map((row) => row.riskScore)),
    stateCount: states.length,
  };
}

export function buildMatrixRows(states) {
  const trend = linearRegression(states.map((row) => ({ x: row.readiness, y: row.adoption })));
  const trendline = [
    { state: "Trendline start", readiness: 25, adoption: trend.slope * 25 + trend.intercept },
    { state: "Trendline end", readiness: 100, adoption: trend.slope * 100 + trend.intercept },
  ];
  return { states, trendline };
}

export function linearRegression(points) {
  const xMean = mean(points.map((point) => point.x));
  const yMean = mean(points.map((point) => point.y));
  const numerator = points.reduce((sum, point) => sum + (point.x - xMean) * (point.y - yMean), 0);
  const denominator = points.reduce((sum, point) => sum + (point.x - xMean) ** 2, 0);
  const slope = denominator ? numerator / denominator : 0;
  return { slope, intercept: yMean - slope * xMean };
}

export function buildRegionalRows(states) {
  const groups = states.reduce((acc, row) => {
    acc[row.region] = acc[row.region] || [];
    acc[row.region].push(row);
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([region, regionRows]) => ({
      region,
      states: regionRows.length,
      avgGhi: mean(regionRows.map((row) => row.ghi)),
      generation: regionRows.reduce((sum, row) => sum + row.generation, 0),
      readiness: mean(regionRows.map((row) => row.readiness)),
      adoption: mean(regionRows.map((row) => row.adoption)),
      opportunity: mean(regionRows.map((row) => row.opportunityIndex)),
    }))
    .sort((a, b) => b.generation - a.generation)
    .map((row, index) => ({
      ...row,
      rank: index + 1,
      interpretation: regionalInterpretation(row),
    }));
}

function regionalInterpretation(row) {
  if (row.region === "South") return "South India demonstrates high market maturity and strong deployment readiness.";
  if (row.region === "West") return "West India combines high irradiance with major utility-scale deployment potential.";
  if (row.region === "North-East")
    return "North-East India needs policy support, distributed solar models, and execution capacity building.";
  if (row.opportunity >= 10)
    return `${row.region} shows a readiness-adoption gap addressable through incentives and project facilitation.`;
  return `${row.region} is comparatively balanced across resource quality, readiness, and adoption.`;
}

export function buildSeasonalInsight(data) {
  const enriched = data.map((row, index) => ({
    ...row,
    generationMu: Math.round(row.ghi * row.potential * 42),
    isMonsoon: index >= 5 && index <= 8,
  }));
  const best = [...enriched].sort((a, b) => b.ghi - a.ghi)[0];
  const worst = [...enriched].sort((a, b) => a.ghi - b.ghi)[0];
  const bestIndex = enriched.findIndex((row) => row.month === best.month);
  const peakWindow = enriched
    .slice(Math.max(0, bestIndex - 2), bestIndex + 1)
    .map((row) => row.month)
    .join("–");
  const values = enriched.map((row) => row.ghi);
  const volatility = ((Math.max(...values) - Math.min(...values)) / mean(values)) * 100;
  const generationImpact = ((best.generationMu - worst.generationMu) / worst.generationMu) * 100;

  return {
    data: enriched,
    best,
    worst,
    peakWindow,
    volatility,
    generationImpact,
    interpretation: `${peakWindow} is India's strongest utility-scale window; monsoon months (Jun–Sep) require forecasting and O&M planning.`,
  };
}

export function buildStateMonthHeatmap(states) {
  return states.flatMap((state) =>
    MONTHS.map((month, index) => ({
      state: state.state,
      month,
      ghi: Number((state.ghi * INDIA_SEASONALITY[index]).toFixed(2)),
    }))
  );
}

export function buildNationalScorecard(summary, states) {
  const deploymentLeaders = getTopBy(states, "generation");
  const policyGapStates = states.filter(
    (row) => row.readiness >= READINESS_THRESHOLD && row.adoption < ADOPTION_THRESHOLD
  ).length;

  return [
    {
      label: "National GHI Index",
      value: summary.avgGhi,
      display: summary.avgGhi.toFixed(2),
      unit: "kWh/m²/day",
      trend: summary.avgGhi >= 5.4 ? "up" : "flat",
      delta: ((summary.avgGhi / 5.4 - 1) * 100).toFixed(1),
    },
    {
      label: "Installed Solar Output",
      value: summary.totalGeneration,
      display: summary.totalGeneration,
      unit: "MU",
      trend: "up",
      delta: "12.4",
    },
    {
      label: "Market Readiness",
      value: summary.avgReadiness,
      display: summary.avgReadiness.toFixed(1),
      unit: "%",
      trend: summary.avgReadiness >= 65 ? "up" : "down",
      delta: (summary.avgReadiness - 65).toFixed(1),
    },
    {
      label: "Market Adoption",
      value: summary.avgAdoption,
      display: summary.avgAdoption.toFixed(1),
      unit: "%",
      trend: summary.avgAdoption >= summary.avgReadiness - 5 ? "up" : "down",
      delta: (summary.avgAdoption - summary.avgReadiness).toFixed(1),
    },
    {
      label: "Investment Attractiveness",
      value: summary.avgInvestment,
      display: summary.avgInvestment.toFixed(0),
      unit: "/100",
      trend: "up",
      delta: "4.2",
    },
    {
      label: "Policy Gap States",
      value: policyGapStates,
      display: String(policyGapStates),
      unit: "states",
      trend: policyGapStates > 8 ? "down" : "up",
      delta: deploymentLeaders.state.slice(0, 12),
    },
  ];
}

export function buildPolicyMatrix(states) {
  return states.map((row) => {
    let quadrant = "Balanced";
    if (row.readiness >= READINESS_THRESHOLD && row.adoption < ADOPTION_THRESHOLD)
      quadrant = "High Readiness / Low Adoption";
    else if (row.readiness < READINESS_THRESHOLD && row.ghi >= 5.5)
      quadrant = "Low Readiness / High Resource";
    else if (row.readiness < READINESS_THRESHOLD && row.adoption < ADOPTION_THRESHOLD)
      quadrant = "Policy & Grid Build-out";
    else if (row.adoption >= 75) quadrant = "Mature Market";

    return { ...row, quadrant };
  });
}

export function buildExecutiveInsights(states, regions, seasonal) {
  const topGhi = getTopBy(states, "ghi");
  const topOpportunity = getTopBy(states, "opportunityIndex");
  const topGenerationRegion = [...regions].sort((a, b) => b.generation - a.generation)[0];
  const northEast = regions.find((row) => row.region === "North-East");
  const south = regions.find((row) => row.region === "South");
  const underperformers = states
    .filter((row) => row.readiness >= READINESS_THRESHOLD && row.adoption < ADOPTION_THRESHOLD)
    .sort((a, b) => b.opportunityIndex - a.opportunityIndex);

  return [
    `${topGhi.state} leads India with ${topGhi.ghi.toFixed(2)} kWh/m²/day — priority corridor for SECI/NTPC Green utility-scale pipelines.`,
    `${topOpportunity.state} shows the largest readiness–adoption gap (${topOpportunity.opportunityIndex} pts) — target for MNRE adoption acceleration.`,
    `${topGenerationRegion.region} India contributes the highest regional generation share (${topGenerationRegion.generation.toLocaleString("en-IN")} MU).`,
    `${northEast?.region} requires distributed solar and grid-modernization before large-scale IPP deployment.`,
    `${south?.region} averages ${south?.adoption.toFixed(1)}% adoption — benchmark for World Bank DFI green finance structuring.`,
    `Peak solar window: ${seasonal.peakWindow}; plan maintenance outside this band.`,
    underperformers.length
      ? `Policy intervention priority: ${underperformers
          .slice(0, 3)
          .map((row) => row.state)
          .join(", ")}.`
      : "High-readiness states are broadly aligned with adoption — shift focus to storage and forecasting.",
    "National recommendation: align evacuation corridors in West/Central with storage tenders and green hydrogen offtake pilots.",
  ];
}

export function getSeasonalNationalData() {
  return buildSeasonalInsight(monthlySolarTrend);
}

export function mean(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

export function ghiToColor(ghi, scale) {
  if (!Number.isFinite(ghi)) return scale.stops[0].color;
  const t = Math.max(0, Math.min(1, (ghi - scale.min) / (scale.max - scale.min)));
  for (let i = 0; i < scale.stops.length - 1; i += 1) {
    const a = scale.stops[i];
    const b = scale.stops[i + 1];
    if (t >= a.at && t <= b.at) {
      const local = (t - a.at) / (b.at - a.at || 1);
      return lerpHex(a.color, b.color, local);
    }
  }
  return scale.stops[scale.stops.length - 1].color;
}

function lerpHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const mix = (c) => Math.round(A[c] + (B[c] - A[c]) * t);
  return `rgb(${mix(0)}, ${mix(1)}, ${mix(2)})`;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
