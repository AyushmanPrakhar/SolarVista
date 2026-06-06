import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Target, 
  Globe, 
  BarChart3, 
  Zap, 
  Users, 
  ShieldCheck, 
  Award, 
  Mail,
  ExternalLink,
  Code2,
  Quote,
  Lightbulb,
  Mountain,
  Building2,
  GraduationCap,
  TrendingUp,
  Map,
  ShieldAlert,
  Leaf,
  Cpu,
  Database,
  CloudSun,
  LayoutDashboard,
  FlaskConical,
  Briefcase,
  Layers,
  Search,
  CheckCircle2,
  ArrowUpRight,
  Thermometer,
  Grid
} from 'lucide-react';

// Local Logo Imports
import reactLogo from '../assets/logos/react.svg';
import tailwindLogo from '../assets/logos/tailwind.svg';
import viteLogo from '../assets/logos/vite.svg';
import lucideLogo from '../assets/logos/lucide.svg';
import expressLogo from '../assets/logos/express.svg';
import postgresLogo from '../assets/logos/postgresql.svg';
import postmanLogo from '../assets/logos/postman.svg';
import nasaLogo from '../assets/logos/nasa.svg';
import openweatherLogo from '../assets/logos/openweathermap.svg';
import leafletLogo from '../assets/logos/leaflet.svg';
import osmLogo from '../assets/logos/openstreetmap.svg';

const AboutUs = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Technologies for the marquee
  const techStack = [
    { name: "React", logo: reactLogo, category: "FRONTEND", fallbackIcon: <Cpu size={24}/> },
    { name: "Tailwind CSS", logo: tailwindLogo, category: "FRONTEND", fallbackIcon: <Zap size={24}/> },
    { name: "Vite", logo: viteLogo, category: "FRONTEND", fallbackIcon: <Zap size={24}/> },
    { name: "Lucide React", logo: lucideLogo, category: "FRONTEND", fallbackIcon: <Sun size={24}/> },
    { name: "Express.js", logo: expressLogo, category: "BACKEND", fallbackIcon: <Database size={24}/> },
    { name: "PostgreSQL", logo: postgresLogo, category: "DATABASE", fallbackIcon: <Database size={24}/> },
    { name: "Postman", logo: postmanLogo, category: "API", fallbackIcon: <ExternalLink size={24}/> },
    { name: "NASA POWER API", logo: nasaLogo, category: "CLIMATE", fallbackIcon: <Globe size={24}/> },
    { name: "OpenWeather API", logo: openweatherLogo, category: "CLIMATE", fallbackIcon: <CloudSun size={24}/> },
    { name: "Leaflet Maps", logo: leafletLogo, category: "GEOSPATIAL", fallbackIcon: <Map size={24}/> },
    { name: "OpenStreetMap", logo: osmLogo, category: "GEOSPATIAL", fallbackIcon: <Mountain size={24}/> },
    { 
      name: "Geospatial Analytics", 
      icon: <div className="flex items-center justify-center gap-0.5 text-blue-500"><Globe size={20}/><Grid size={20}/></div>, 
      category: "GEOSPATIAL" 
    },
    { 
      name: "Climate Intelligence Systems", 
      icon: <div className="flex items-center justify-center gap-0.5 text-emerald-500"><CloudSun size={20}/><BarChart3 size={20}/></div>, 
      category: "CLIMATE" 
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 py-12 text-slate-900 dark:text-slate-100 min-h-screen relative z-10">
      
      {/* SECTION 1: HERO */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative overflow-hidden rounded-[3rem] bg-white p-8 md:p-16 text-slate-900 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
      >
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[30rem] h-[30rem] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_320px] items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full text-amber-600 text-xs font-black tracking-[0.2em] uppercase border border-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20">
              <Zap size={14} />
              <span>Renewable Energy Intelligence Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-[#0F172A] dark:text-white">
              About <span className="text-amber-500">SolarVista</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-bold tracking-tight italic">
              "Powering the Future Through Renewable Energy Intelligence"
            </p>
            <div className="space-y-6 text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              <p>
                SolarVista is an advanced Renewable Energy, Climate Intelligence, and Geospatial Analytics Platform developed to transform complex environmental datasets into actionable insights for researchers, engineers, sustainability professionals, educators, and decision-makers.
              </p>
              <p>
                By integrating solar resource intelligence, climate analytics, interactive geospatial mapping, and environmental data visualization, SolarVista enables users to understand renewable energy potential, assess climate impacts, and support evidence-based sustainable development.
              </p>
              <p>
                SolarVista serves as a bridge between scientific data and real-world decision-making, making renewable energy intelligence more accessible, interactive, and actionable.
              </p>
            </div>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="hidden lg:block bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm"
          >
            <div className="p-4 bg-amber-400 rounded-3xl w-fit mb-6 shadow-xl shadow-amber-400/20">
              <Layers size={32} className="text-slate-950" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#0F172A] dark:text-white">Platform Focus</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Solar, climate, and geospatial intelligence for smarter sustainable planning.
            </p>
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="text-amber-500" size={18} />
                <span className="text-sm font-bold tracking-tight">Enterprise Analytics</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="text-amber-500" size={18} />
                <span className="text-sm font-bold tracking-tight">GIS Capability</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 2: WHY SOLARVISTA MATTERS */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl font-black text-[#0F172A] dark:text-white tracking-tight">Why SolarVista Matters</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-center">
            As the world accelerates toward a low-carbon future, access to reliable climate and renewable energy information has become increasingly important. SolarVista addresses dataset fragmentation by providing a unified intelligence hub.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <FeatureIconCard icon={<Zap />} title="Renewable Energy Intelligence" color="orange" />
          <FeatureIconCard icon={<Thermometer />} title="Climate Analytics" color="blue" />
          <FeatureIconCard icon={<Map />} title="Geospatial Mapping" color="emerald" />
          <FeatureIconCard icon={<BarChart3 />} title="Data-Driven Insights" color="indigo" />
          <FeatureIconCard icon={<Leaf />} title="Sustainability Intelligence" color="green" />
        </div>
      </section>

      {/* SECTION 3: CORE CAPABILITIES */}
      <section className="space-y-12">
        <h2 className="text-3xl font-black text-[#0F172A] dark:text-white border-l-8 border-orange-500 pl-6 py-2">Core Capabilities</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <CapabilityCard 
            idx="01" 
            title="Solar Intelligence" 
            body="Analyze solar energy potential, resource availability, and renewable energy opportunities." 
            icon={<Sun />}
          />
          <CapabilityCard 
            idx="02" 
            title="Climate Intelligence" 
            body="Evaluate temperature, humidity, wind patterns, and environmental indicators." 
            icon={<CloudSun />}
          />
          <CapabilityCard 
            idx="03" 
            title="Geospatial Analytics" 
            body="Explore interactive maps revealing spatial relationships and renewable energy hotspots." 
            icon={<Globe />}
          />
          <CapabilityCard 
            idx="04" 
            title="Decision Support" 
            body="Transform scientific datasets into actionable planning insights." 
            icon={<LayoutDashboard />}
          />
          <CapabilityCard 
            idx="05" 
            title="Sustainability Intelligence" 
            body="Support climate resilience and sustainable development initiatives." 
            icon={<Leaf />}
          />
        </div>
      </section>

      {/* SECTION 4 & 5: USERS & IMPACT */}
      <div className="grid gap-12 lg:grid-cols-2">
        <section className="space-y-8">
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-white">Who Uses SolarVista?</h2>
          <div className="grid grid-cols-2 gap-4">
            <UserTag icon={<FlaskConical />} label="Researchers" />
            <UserTag icon={<GraduationCap />} label="Professors & Universities" />
            <UserTag icon={<Cpu />} label="Engineers" />
            <UserTag icon={<Sun />} label="RE Professionals" />
            <UserTag icon={<Globe />} label="Climate Experts" />
            <UserTag icon={<Briefcase />} label="Corporate Teams" />
            <UserTag icon={<Mountain />} label="Environmentalists" />
            <UserTag icon={<Building2 />} label="Policy Makers" />
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-white">Strategic Impact</h2>
          <div className="grid gap-3">
            {[
              "Data-Driven Renewable Energy Planning",
              "Climate Intelligence Accessibility",
              "Smarter Infrastructure Decisions",
              "Environmental Awareness",
              "Evidence-Based Sustainability",
              "Accelerated Clean Energy Adoption"
            ].map((impact, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">{impact}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* SECTION 6: SDG CONTRIBUTION */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <h2 className="text-4xl font-black text-[#0F172A] dark:text-white">SDG Contribution</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 text-center md:text-left">United Nations Sustainable Development Goals</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <SdgCard num="07" title="Affordable & Clean Energy" icon={<Zap />} color="bg-amber-50" textColor="text-amber-700" />
          <SdgCard num="09" title="Industry & Infrastructure" icon={<Building2 />} color="bg-orange-50" textColor="text-orange-700" />
          <SdgCard num="11" title="Sustainable Cities" icon={<Mountain />} color="bg-amber-50" textColor="text-amber-800" />
          <SdgCard num="12" title="Responsible Production" icon={<TrendingUp />} color="bg-yellow-50" textColor="text-yellow-800" />
          <SdgCard num="13" title="Climate Action" icon={<Globe />} color="bg-emerald-50" textColor="text-emerald-700" />
          <SdgCard num="15" title="Life on Land" icon={<Leaf />} color="bg-green-50" textColor="text-green-700" />
        </div>
      </section>

      {/* SECTION 7: TECHNOLOGY MARQUEE */}
      <section className="space-y-12 overflow-hidden py-16 rounded-[3rem] bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-amber-100 dark:border-slate-700 shadow-inner text-center px-4">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-[#0F172A] dark:text-white tracking-tight text-center">Powered By</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-4xl mx-auto leading-relaxed text-center">
            Built using modern web technologies, geospatial intelligence systems, climate data services, and renewable energy analytics tools.
          </p>
        </div>
        
        <div className="relative mt-12 flex flex-col gap-8">
          <InfiniteMarquee items={techStack} speed={50} />
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee var(--duration) linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
      </section>

      {/* SECTION 8 & 9: HIGHLIGHTS & STATS */}
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-8">
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-white">Platform Highlights</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Solar Resource Intelligence", icon: <Sun /> },
              { label: "Climate Analytics", icon: <Globe /> },
              { label: "Interactive Geospatial Mapping", icon: <Map /> },
              { label: "Renewable Energy Insights", icon: <TrendingUp /> },
              { label: "NASA POWER Integration", icon: <FlaskConical /> },
              { label: "OpenWeather Intelligence", icon: <CloudSun /> },
              { label: "Renewable Energy Planning", icon: <Target /> },
              { label: "Sustainability Monitoring", icon: <ShieldCheck /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 group hover:border-orange-400 transition-colors shadow-sm">
                 <div className="text-orange-500 group-hover:scale-110 transition-transform">{item.icon}</div>
                 <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">Platform Snapshot</h2>
          <div className="grid grid-cols-2 gap-4">
             <StatCard val="36" label="States Covered" color="text-blue-500" />
             <StatCard val="24" label="Solar Parks Tracked" color="text-amber-500" />
             <StatCard val="15+" label="Climate Variables" color="text-emerald-500" />
             <StatCard val="500+" label="Generation Records" color="text-rose-500" />
             <StatCard val="Interactive" label="GIS Visualizations" color="text-indigo-500" />
             <StatCard val="Active" label="Research Tool" color="text-purple-500" />
          </div>
        </section>
      </div>

      {/* SECTION 10 & 11: VISION & DEVELOPER */}
      <section className="grid gap-12 lg:grid-cols-2 items-center pb-20">
        <div className="space-y-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-5xl font-black text-[#0F172A] dark:text-white tracking-tighter">Vision</h2>
            <p className="text-2xl text-slate-600 dark:text-slate-400 font-bold leading-tight">
              "To become the definitive national repository for renewable energy and climate intelligence in India."
            </p>
          </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-center md:text-left">
            We aim to empower researchers, engineers, educators, institutions, policymakers, and communities to make informed decisions for a sustainable and resilient future through high-fidelity data and advanced GIS modeling.
          </p>
          
          <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] text-slate-900 border border-slate-200 dark:border-slate-800 dark:text-white relative overflow-hidden shadow-sm">
             <Quote className="absolute -top-4 -left-4 text-slate-200 dark:text-slate-800" size={100} />
             <div className="relative z-10">
                <p className="text-2xl font-black italic mb-6">"Harnessing Data for a Sustainable Future."</p>
                <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                   <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 font-black text-2xl">AP</div>
                   <div>
                      <p className="text-lg font-black">Ayushman Prakhar</p>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Lead Architect</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative">
          <div className="absolute top-0 right-0 bg-amber-400 p-6 rounded-bl-[3rem] text-slate-950">
            <Code2 size={40} />
          </div>
          
          <div className="space-y-8">
            <div>
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Developer Profile</h3>
               <p className="text-3xl font-black text-slate-900 dark:text-white">Ayushman Prakhar</p>
               <p className="text-slate-500 font-bold text-lg mt-1 dark:text-slate-400 text-center md:text-left">B.Tech, Electrical & Electronics Engineering</p>
            </div>

            <div className="space-y-3">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Expertise</p>
               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                 {["Renewable Energy", "Climate Intelligence", "Data Visualization", "Geospatial Analytics", "Sustainability", "Climate Policy"].map(tag => (
                   <span key={tag} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic text-center md:text-left">
                "Building intelligent digital solutions that combine renewable energy, climate science, and geospatial analytics to support sustainable development and informed decision-making."
              </p>
              
              <div className="grid gap-3">
                <SocialLink icon={<Mail />} label="ayushmanprakhar@gmail.com" href="mailto:ayushmanprakhar@gmail.com" />
                <SocialLink icon={<ExternalLink />} label="Connect on LinkedIn" href="https://www.linkedin.com/in/ayushmanprakhar" />
                <SocialLink icon={<Code2 />} label="View Source on GitHub" href="https://github.com/AyushmanPrakhar" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// HELPER COMPONENTS
const FeatureIconCard = ({ icon, title, color }) => {
  const colors = {
    orange: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    green: "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  };
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`p-6 rounded-[2rem] border ${colors[color]} flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-md transition-all group cursor-default bg-white dark:bg-slate-900`}
    >
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-700 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-sm font-black leading-tight">{title}</span>
    </motion.div>
  );
};

const CapabilityCard = ({ idx, title, body, icon }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group relative overflow-hidden"
  >
    <div className="absolute -right-4 -top-4 text-9xl font-black text-slate-50 dark:text-slate-800/50 group-hover:text-orange-500/5 transition-colors pointer-events-none">{idx}</div>
    <div className="relative z-10">
      <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl w-fit mb-8 text-orange-600 dark:text-orange-400 group-hover:rotate-12 transition-transform border border-orange-100 dark:border-orange-500/20">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-orange-500 transition-colors">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{body}</p>
    </div>
  </motion.div>
);

const UserTag = ({ icon, label }) => (
  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 font-black text-xs tracking-tight hover:border-blue-400 transition-colors text-center md:text-left">
    <span className="text-blue-500 dark:text-blue-400">{icon}</span>
    {label}
  </div>
);

const SdgCard = ({ num, title, icon, color, textColor }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className={`${color} p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center gap-4 relative overflow-hidden group border border-slate-100 dark:border-slate-800 dark:bg-slate-900`}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-45 transition-transform ${textColor}`}>
      {React.cloneElement(icon, { size: 48 })}
    </div>
    <span className={`text-4xl font-black opacity-40 ${textColor}`}>SDG {num}</span>
    <p className={`text-[11px] font-black uppercase tracking-wider leading-tight relative z-10 ${textColor} dark:text-slate-300`}>{title}</p>
  </motion.div>
);

const StatCard = ({ val, label, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
    <span className={`text-3xl font-black ${color} mb-2 group-hover:scale-110 transition-transform text-center`}>{val}</span>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">{label}</span>
  </div>
);

const SocialLink = ({ icon, label, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-amber-400 dark:hover:bg-amber-400 hover:text-slate-950 transition-all group"
  >
    <div className="flex items-center gap-3">
      {React.cloneElement(icon, { size: 18 })}
      <span className="text-sm font-black tracking-tight">{label}</span>
    </div>
    <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);

const InfiniteMarquee = ({ items, speed }) => {
  const repeatedItems = [...items, ...items, ...items]; // Repeat to ensure seamless scrolling
  return (
    <div className="flex select-none overflow-hidden">
      <div 
        className="flex min-w-full shrink-0 items-center justify-around gap-10 animate-marquee"
        style={{ '--duration': `${speed}s` }}
      >
        {repeatedItems.map((item, i) => (
          <div key={i} className="flex items-center gap-5 bg-white dark:bg-slate-800 px-10 py-6 rounded-[2rem] border border-amber-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all cursor-default group relative overflow-hidden h-[96px] min-w-[240px]">
            <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 transition-colors pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-5 w-full">
              <div className={`w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                <LogoRenderer item={item} />
              </div>
              <div className="flex flex-col items-start justify-center overflow-hidden">
                <span className="font-black text-sm tracking-tight text-slate-800 dark:text-slate-200 leading-none truncate w-full">{item.name}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 leading-none">{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LogoRenderer = ({ item }) => {
  const [error, setError] = useState(false);

  if (error || !item.logo) {
    return (
      <div className="text-amber-500">
        {item.icon ? React.cloneElement(item.icon, { size: 28 }) : item.fallbackIcon}
      </div>
    );
  }

  return (
    <img 
      src={item.logo} 
      alt={item.name} 
      className="w-full h-full object-contain"
      onError={() => setError(true)}
    />
  );
};

export default AboutUs;
