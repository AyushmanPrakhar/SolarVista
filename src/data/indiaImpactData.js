const indiaImpactData = [
  { state: "Rajasthan", ghi: 330, ghiUnit: "W/m²", potentialGHI: 540, potentialUnit: "W/m²", aerosolImpact: 28, trend: -0.6 },
  { state: "Gujarat", ghi: 320, ghiUnit: "W/m²", potentialGHI: 520, potentialUnit: "W/m²", aerosolImpact: 30, trend: -0.5 },
  { state: "Maharashtra", ghi: 310, ghiUnit: "W/m²", potentialGHI: 505, potentialUnit: "W/m²", aerosolImpact: 34, trend: -0.4 },
  { state: "Madhya Pradesh", ghi: 315, ghiUnit: "W/m²", potentialGHI: 510, potentialUnit: "W/m²", aerosolImpact: 33, trend: -0.7 },
  { state: "Karnataka", ghi: 305, ghiUnit: "W/m²", potentialGHI: 500, potentialUnit: "W/m²", aerosolImpact: 34, trend: -0.3 },
  { state: "Tamil Nadu", ghi: 305, ghiUnit: "W/m²", potentialGHI: 500, potentialUnit: "W/m²", aerosolImpact: 34, trend: -0.2 },
  { state: "Telangana", ghi: 310, ghiUnit: "W/m²", potentialGHI: 505, potentialUnit: "W/m²", aerosolImpact: 35, trend: -0.4 },
  { state: "Andhra Pradesh", ghi: 295, ghiUnit: "W/m²", potentialGHI: 480, potentialUnit: "W/m²", aerosolImpact: 36, trend: -0.5 },
  { state: "Kerala", ghi: 290, ghiUnit: "W/m²", potentialGHI: 470, potentialUnit: "W/m²", aerosolImpact: 36, trend: -0.1 },

  { state: "Uttar Pradesh", ghi: 300, ghiUnit: "W/m²", potentialGHI: 495, potentialUnit: "W/m²", aerosolImpact: 38, trend: -1.2 },
  { state: "Bihar", ghi: 290, ghiUnit: "W/m²", potentialGHI: 480, potentialUnit: "W/m²", aerosolImpact: 41, trend: -1.3 },
  { state: "Delhi", ghi: 310, ghiUnit: "W/m²", potentialGHI: 505, potentialUnit: "W/m²", aerosolImpact: 35, trend: -1.5 },
  { state: "Punjab", ghi: 310, ghiUnit: "W/m²", potentialGHI: 500, potentialUnit: "W/m²", aerosolImpact: 35, trend: -0.7 },
  { state: "Haryana", ghi: 310, ghiUnit: "W/m²", potentialGHI: 500, potentialUnit: "W/m²", aerosolImpact: 35, trend: -0.9 },
  { state: "Uttarakhand", ghi: 295, ghiUnit: "W/m²", potentialGHI: 485, potentialUnit: "W/m²", aerosolImpact: 37, trend: -1.0 },
  { state: "Himachal Pradesh", ghi: 300, ghiUnit: "W/m²", potentialGHI: 490, potentialUnit: "W/m²", aerosolImpact: 37, trend: -0.8 },

  { state: "West Bengal", ghi: 295, ghiUnit: "W/m²", potentialGHI: 485, potentialUnit: "W/m²", aerosolImpact: 39, trend: -0.9 },
  { state: "Jharkhand", ghi: 295, ghiUnit: "W/m²", potentialGHI: 480, potentialUnit: "W/m²", aerosolImpact: 39, trend: -1.1 },
  { state: "Odisha", ghi: 300, ghiUnit: "W/m²", potentialGHI: 495, potentialUnit: "W/m²", aerosolImpact: 37, trend: -0.8 },
  { state: "Chhattisgarh", ghi: 300, ghiUnit: "W/m²", potentialGHI: 490, potentialUnit: "W/m²", aerosolImpact: 38, trend: -0.6 },

  { state: "Assam", ghi: 285, ghiUnit: "W/m²", potentialGHI: 470, potentialUnit: "W/m²", aerosolImpact: 40, trend: -0.9 },
  { state: "Meghalaya", ghi: 280, ghiUnit: "W/m²", potentialGHI: 460, potentialUnit: "W/m²", aerosolImpact: 42, trend: -1.0 },
  { state: "Manipur", ghi: 285, ghiUnit: "W/m²", potentialGHI: 465, potentialUnit: "W/m²", aerosolImpact: 41, trend: -0.8 },
  { state: "Mizoram", ghi: 282, ghiUnit: "W/m²", potentialGHI: 462, potentialUnit: "W/m²", aerosolImpact: 41, trend: -0.9 },
  { state: "Nagaland", ghi: 283, ghiUnit: "W/m²", potentialGHI: 465, potentialUnit: "W/m²", aerosolImpact: 40, trend: -0.8 },
  { state: "Tripura", ghi: 285, ghiUnit: "W/m²", potentialGHI: 465, potentialUnit: "W/m²", aerosolImpact: 40, trend: -0.7 },
  { state: "Arunachal Pradesh", ghi: 280, ghiUnit: "W/m²", potentialGHI: 460, potentialUnit: "W/m²", aerosolImpact: 42, trend: -1.1 },
  { state: "Sikkim", ghi: 275, ghiUnit: "W/m²", potentialGHI: 455, potentialUnit: "W/m²", aerosolImpact: 42, trend: -1.2 },

  { state: "Goa", ghi: 305, ghiUnit: "W/m²", potentialGHI: 500, potentialUnit: "W/m²", aerosolImpact: 34, trend: -0.3 },

  // UTs
  { state: "Andaman and Nicobar Islands", ghi: 300, ghiUnit: "W/m²", potentialGHI: 490, potentialUnit: "W/m²", aerosolImpact: 36, trend: -0.3 },
  { state: "Chandigarh", ghi: 305, ghiUnit: "W/m²", potentialGHI: 495, potentialUnit: "W/m²", aerosolImpact: 35, trend: -0.7 },
  { state: "Dadra and Nagar Haveli and Daman and Diu", ghi: 310, ghiUnit: "W/m²", potentialGHI: 500, potentialUnit: "W/m²", aerosolImpact: 34, trend: -0.5 },
  { state: "Jammu and Kashmir", ghi: 290, ghiUnit: "W/m²", potentialGHI: 470, potentialUnit: "W/m²", aerosolImpact: 41, trend: -1.2 },
  { state: "Ladakh", ghi: 320, ghiUnit: "W/m²", potentialGHI: 520, potentialUnit: "W/m²", aerosolImpact: 30, trend: -0.1 },
  { state: "Lakshadweep", ghi: 300, ghiUnit: "W/m²", potentialGHI: 490, potentialUnit: "W/m²", aerosolImpact: 36, trend: -0.2 },
  { state: "Puducherry", ghi: 305, ghiUnit: "W/m²", potentialGHI: 500, potentialUnit: "W/m²", aerosolImpact: 34, trend: -0.2 }
];

export default indiaImpactData;