export function downloadText(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportCsv(states) {
  const header = [
    "State",
    "Region",
    "GHI",
    "Generation_MU",
    "Potential",
    "Readiness_%",
    "Adoption_%",
    "Opportunity_Score",
    "Risk_Score",
    "Investment_Score",
  ];
  const body = states.map((row) =>
    [
      row.state,
      row.region,
      row.ghi,
      row.generation,
      row.potential,
      row.readiness,
      row.adoption,
      row.opportunityIndex,
      row.riskScore,
      row.investmentScore,
    ].join(",")
  );
  downloadText("solar-resource-intelligence.csv", [header.join(","), ...body].join("\n"), "text/csv;charset=utf-8");
}

export function exportStateReport(state, insights, summary) {
  const report = [
    "SolarVista — State Intelligence Report",
    `State: ${state.state}`,
    `Region: ${state.region}`,
    "",
    "=== Metrics ===",
    `GHI: ${state.ghi} kWh/m²/day`,
    `Generation: ${state.generation} MU`,
    `Readiness: ${state.readiness}%`,
    `Adoption: ${state.adoption}%`,
    `Opportunity: ${state.opportunityIndex}`,
    `Risk: ${state.riskScore}/100`,
    `Investment: ${state.investmentScore}/100`,
    "",
    "=== Insights ===",
    `Resource: ${insights.resource}`,
    `Investment: ${insights.investment}`,
    `Policy: ${insights.policy}`,
    `Risk: ${insights.risk}`,
    `Commercial: ${insights.commercial}`,
    "",
    "=== Recommendations ===",
    ...insights.recommendations.map((item, i) => `${i + 1}. ${item}`),
    "",
    "=== National Context ===",
    `National avg GHI: ${summary.avgGhi.toFixed(2)}`,
    `Generated: ${new Date().toISOString()}`,
  ].join("\n");
  downloadText(`solar-report-${state.state.replace(/\s+/g, "-").toLowerCase()}.txt`, report);
}

export function exportExecutivePdf() {
  window.print();
}

export async function exportSvgAsPng(svgNode, filename = "india-solar-map.png") {
  if (!svgNode) return;
  const clone = svgNode.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const bbox = svgNode.getBoundingClientRect();
  const width = Math.max(800, Math.round(bbox.width));
  const height = Math.max(600, Math.round(bbox.height));
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);

  const svgData = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("PNG export failed"));
          return;
        }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function exportDashboardSnapshot(rootEl, filename = "solar-intelligence-dashboard.png") {
  const svg = rootEl?.querySelector("svg");
  if (svg) {
    await exportSvgAsPng(svg, filename);
    return;
  }
  exportExecutivePdf();
}
