export default function Legend({ min = 4.3, max = 6.5 }) {
  return (
    <div className="absolute bottom-4 right-4 z-10 w-56 rounded-lg border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm shadow-xl backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-white">GHI Scale</p>
        <p className="text-xs text-slate-400">kWh/m2/day</p>
      </div>
      <div className="mt-3 h-3 rounded-full bg-gradient-to-r from-blue-600 via-green-500 to-orange-500" />
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>{min.toFixed(1)}</span>
        <span>Medium</span>
        <span>{max.toFixed(1)}</span>
      </div>
    </div>
  );
}
