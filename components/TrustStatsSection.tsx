"use client";

import { motion } from "framer-motion";
import { Globe2, Users2, Rocket, Trophy, ArrowUpRight } from "lucide-react";

const STATS = [
  { label: "Active Students", value: 12000, suffix: "+", icon: Users2, color: "from-emerald-400 to-teal-500" },
  { label: "Graduation Rate", value: 94, suffix: "%", icon: Trophy, color: "from-blue-400 to-indigo-500" },
  { label: "Projects Launched", value: 500, suffix: "+", icon: Rocket, color: "from-amber-400 to-orange-500" },
  { label: "Partner Countries", value: 15, suffix: "", icon: Globe2, color: "from-rose-400 to-red-500" },
];

const LOGOS = ["Mowlem Creek", "Gracious Dei", "Sterlum", "Halisi", "Golden Gift", "Precious Gift", "Newlight"];

export function TrustStatsSection() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- INFINITE LOGO MARQUEE --- */}
        <div className="mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10"
          >
            Our Alumni Build at Global Giants
          </motion.p>
          
          <div className="relative flex overflow-hidden group">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 20, repeat: Infinity }}
              className="flex whitespace-nowrap gap-16 items-center"
            >
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <span 
                  key={i} 
                  className="text-3xl md:text-4xl font-black text-slate-200 hover:text-emerald-500 transition-colors duration-300 cursor-default"
                >
                  {logo}
                </span>
              ))}
            </motion.div>
            {/* Gradient Fades for Marquee */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          </div>
        </div>

        {/* --- DYNAMIC STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Card Background with subtle border glow */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] blur-xl -z-10 bg-emerald-100/50" />
              
              <div className="h-full p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-all duration-300 shadow-sm group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-white shadow-sm text-slate-900 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="text-5xl font-black text-slate-900 tracking-tighter"
                    >
                      {stat.value.toLocaleString()}
                    </motion.span>
                    <span className="text-2xl font-black text-emerald-500">{stat.suffix}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>

                {/* Micro-interaction: Progress bar */}
                <div className="mt-8 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r ${stat.color}`} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Trust Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 flex justify-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl shadow-emerald-200">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500" />
              ))}
            </div>
            <p className="text-sm font-bold italic">
              &quot;The best engineering talent comes from GIFTECH&quot; — <span className="text-emerald-400">TechCrunch</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}