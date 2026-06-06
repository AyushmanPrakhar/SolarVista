import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Map as MapIcon, Zap, Sun } from 'lucide-react';

const Hero = () => {
  return (
    /* Requirement 8: Cinematic depth with min-h-screen and dark base */
    <section className="relative min-h-screen overflow-hidden flex items-center pt-24 pb-32 bg-slate-950">
      
      {/* Background Video (Requirement 6: Unchanged) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video/solar-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Requirement 1: Premium Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/55 to-slate-950/75"></div>

      {/* Requirement 7: Content container with relative z-10 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          
          {/* Requirement 4: Upgraded Badge Styling */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 fill-yellow-400/50" />
            <span>Powering India's Solar Future</span>
          </div>

          {/* Requirement 2 & 9: Headline with White text and Updated Gradient */}
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            The Fastest Way to Understand <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              India's Solar Landscape
            </span>
          </h1>

          {/* Requirement 3: Readable Subheadline (slate-200) */}
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-200 mb-10 leading-relaxed">
            Real-time solar irradiance, weather intelligence, AQI monitoring, weather forecasting, and solar potential insights across India.
          </p>

          {/* Buttons (Requirement 6: Unchanged functionality/layout) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-10 py-4 bg-yellow-400 text-slate-950 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl shadow-yellow-900/20 flex items-center justify-center gap-2"
            >
              Explore Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              Login
            </Link>
          </div>

          {/* Hero Visuals (Cards) with Requirement 5: Glassmorphism */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto mt-16">
            
            {/* Dashboard Preview Placeholder */}
            <div className="group relative rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-3 duration-500">
              <div className="aspect-[16/10] rounded-3xl bg-slate-900/40 overflow-hidden flex flex-col border border-white/5">
                <div className="h-10 border-b border-white/10 bg-white/5 px-4 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white/5 to-transparent">
                  <div className="flex flex-col items-center gap-4 text-white/20">
                    <BarChart3 className="w-16 h-16" />
                    <p className="font-medium text-slate-400">Solar Dashboard Preview</p>
                    <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-orange-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-white/10 hidden md:flex items-center gap-4 transition-transform group-hover:scale-110 duration-500">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Yield</p>
                  <p className="text-xl font-bold text-white tracking-tight">12.4 GW</p>
                </div>
              </div>
            </div>

            {/* Heatmap Preview Placeholder */}
            <div className="group relative rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-3 duration-500 delay-75">
              <div className="aspect-[16/10] rounded-3xl bg-slate-900/40 overflow-hidden flex flex-col border border-white/5">
                <div className="h-10 border-b border-white/10 bg-white/5 px-4 flex items-center justify-center">
                   <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Live Irradiance Feed</p>
                </div>
                <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-tr from-orange-500/5 to-yellow-500/5 relative overflow-hidden">
                  <MapIcon className="w-24 h-24 text-white/5" />
                  <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-700" />
                  <p className="absolute bottom-6 font-medium text-slate-400">India Solar Heatmap</p>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-white/10 hidden md:flex items-center gap-4 transition-transform group-hover:scale-110 duration-500">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/20">
                  <Sun className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg. GHI</p>
                  <p className="text-xl font-bold text-white tracking-tight">5.8 kWh/m²</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
