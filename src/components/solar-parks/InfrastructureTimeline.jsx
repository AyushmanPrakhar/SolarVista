import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Zap } from 'lucide-react';

export default function InfrastructureTimeline({ parks }) {
  const chronological = React.useMemo(() => {
    return [...parks].sort((a, b) => a.year - b.year);
  }, [parks]);

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Growth Timeline</h3>
        <p className="text-sm text-slate-500 font-medium">Historical expansion of utility-scale solar infrastructure.</p>
      </div>

      <div className="relative space-y-8">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />

        {chronological.map((park, idx) => (
          <motion.div 
            key={park.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-6 relative group"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center z-10 group-hover:border-orange-400 transition-colors shadow-sm">
                <span className="text-[10px] font-black text-slate-400 group-hover:text-orange-500">{park.year}</span>
              </div>
            </div>
            
            <div className="flex-1 pb-8 border-b border-slate-50 last:border-0 last:pb-0">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                 <h4 className="font-bold text-slate-800 text-base">{park.name}</h4>
                 <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 rounded-full text-[10px] font-black text-amber-700 uppercase tracking-widest ring-1 ring-amber-100/50">
                    <Zap size={10} />
                    {park.capacityMW} MW
                 </div>
               </div>
               <p className="text-xs text-slate-500 font-medium">{park.state}, India</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
