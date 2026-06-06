import stateCoordinates from "../data/stateCoordinates";
import { normalizeStateName } from "./solarStateMetrics";

const INDIA_VIEW = {
  longitude: 78.9629,
  latitude: 22.5937,
  zoom: 4.5,
  pitch: 0,
  bearing: 0,
};

export function getIndiaInitialViewState() {
  return INDIA_VIEW;
}

export function getStateCenterLatLng(stateName) {
  if (!stateName) return null;

  const normalized = normalizeStateName(stateName);
  const entries = Object.entries(stateCoordinates);
  const match = entries.find(([name]) => normalizeStateName(name) === normalized);
  if (!match) return null;

  return match[1]; // [lat, lng]
}

