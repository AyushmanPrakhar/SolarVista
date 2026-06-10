import React, { useEffect, useState } from "react";
import { fetchGHIData } from "../services/api";

const GHIAnalytics = () => {
  const [ghiData, setGhiData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGHIData();
      setGhiData(data);
    };

    loadData();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700">
        GHI Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ghiData.map((state, index) => (
          <div
            key={index}
            className="bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-semibold text-orange-700">
              {state.state}
            </h3>

            <p className="mt-3 text-lg">
              ☀️ GHI: <strong>{state.ghi}</strong>
            </p>

            <p className="mt-2 text-lg">
              ⚡ Potential:{" "}
              <strong>{state.solarPotential}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GHIAnalytics;