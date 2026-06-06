import { formatGhi, formatMu, formatPercent } from "./format";
import { rankStates } from "./percentiles";

const INTERPRETATIONS = {
  ghi: (row, vsNat) =>
    row.ghi >= 6
      ? "Exceptional irradiance suitable for utility-scale and storage-hybrid portfolios."
      : vsNat >= 0
        ? "Above-average solar resource with credible utility-scale economics."
        : "Resource is serviceable for distributed and selective utility projects.",
  generation: (row) =>
    row.generation >= 20000
      ? "Dominant contributor to national solar output with mature evacuation infrastructure."
      : row.generation >= 5000
        ? "Established deployment base; focus on repowering and grid integration."
        : "Early-stage market where transmission and land aggregation shape returns.",
  readiness: (row) =>
    row.readiness >= 75
      ? "Policy, permitting, and grid frameworks support rapid bankable deployment."
      : row.readiness >= 55
        ? "Moderately prepared market; targeted regulatory support can unlock scale."
        : "Regulatory and grid readiness remain binding constraints for large projects.",
  adoption: (row) =>
    row.adoption >= 75
      ? "Strong end-market uptake reduces offtake risk for new capacity."
      : row.adoption >= 50
        ? "Growing adoption; incentives can close the gap to readiness levels."
        : "Low uptake signals need for adoption-bridge programs and DISCOM engagement.",
  opportunityIndex: (row) =>
    row.opportunityIndex >= 15
      ? "Wide readiness–adoption gap implies high-return intervention without new resource studies."
      : row.opportunityIndex >= 8
        ? "Moderate latent capacity; phased capital deployment is appropriate."
        : "Market is relatively aligned; differentiation will come from cost of capital and O&M.",
};

export function buildStateTooltipPayload(state, states, nationalSummary, metricKey = "ghi") {
  const { rankMap } = rankStates(states, metricKey, true);
  const rank = rankMap.get(state.state);
  const total = states.length;

  let national;
  let valueDisplay;
  let metricLabel;

  switch (metricKey) {
    case "generation":
      national = nationalSummary.totalGeneration / total;
      valueDisplay = formatMu(state.generation);
      metricLabel = "Generation";
      break;
    case "readiness":
      national = nationalSummary.avgReadiness;
      valueDisplay = formatPercent(state.readiness);
      metricLabel = "Readiness";
      break;
    case "adoption":
      national = nationalSummary.avgAdoption;
      valueDisplay = formatPercent(state.adoption);
      metricLabel = "Adoption";
      break;
    case "opportunityIndex":
      national = states.reduce((s, r) => s + r.opportunityIndex, 0) / total;
      valueDisplay = `${state.opportunityIndex} pts`;
      metricLabel = "Opportunity gap";
      break;
    default:
      national = nationalSummary.avgGhi;
      valueDisplay = formatGhi(state.ghi);
      metricLabel = "GHI";
  }

  const vsNat = metricKey === "ghi" ? state.ghi - national : state[metricKey] - national;
  const interpretFn = INTERPRETATIONS[metricKey] || INTERPRETATIONS.ghi;

  return {
    state: state.state,
    metricLabel,
    valueDisplay,
    nationalDisplay:
      metricKey === "ghi"
        ? formatGhi(national)
        : metricKey === "generation"
          ? formatMu(national)
          : metricKey === "opportunityIndex"
            ? `${national.toFixed(1)} pts`
            : formatPercent(national),
    rank,
    total,
    interpretation: interpretFn(state, vsNat),
  };
}
