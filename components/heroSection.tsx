"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle, Sparkles, Zap, ShieldCheck, Globe } from "lucide-react";

export function HeroSection() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  // Parallax offsets for different layers
  const mainImageY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -80]), springConfig);
  const floatingCardY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -180]), springConfig);
  const bgElementY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-slate-50"
    >
      {/* --- BACKGROUND ARCHITECTURE --- */}
      <div className="absolute inset-0 z-0">
        {/* Engineering Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
        />
        
        {/* Soft Ambient Orbs */}
        <motion.div style={{ y: bgElementY }} className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px]" />
        <motion.div style={{ y: bgElementY }} className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* --- LEFT CONTENT: TEXT & ACTION --- */}
          <div className="flex-[1.2] text-center lg:text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                Next-Gen Engineering Campus
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9]"
            >
              Building the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 drop-shadow-sm">
                Digital Frontier.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Join 15,000+ African innovators mastering robotics, AI, and full-stack engineering through hands-on, self-paced labs.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/courses">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] transition-all group">
                  <span className="font-bold text-lg">Browse Catalog</span>
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Button variant="ghost" size="lg" className="h-16 px-8 rounded-2xl text-slate-700 hover:bg-white hover:shadow-md transition-all font-bold">
                <PlayCircle className="mr-3 w-6 h-6 text-emerald-600" />
                Watch Campus Tour
              </Button>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-8 pt-4 border-t border-slate-200 max-w-sm"
            >
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900">98%</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Success Rate</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900">24/7</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Mentor Access</span>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT CONTENT: THE INNOVATION STACK --- */}
          <div className="flex-1 relative w-full aspect-square lg:aspect-auto lg:h-[700px]">
            
            {/* Main Center Image */}
            <motion.div 
              style={{ y: mainImageY }}
              className="absolute top-[10%] right-[10%] w-[85%] h-[75%] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] z-10 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image src="/robotics-lab.jpg" alt="Robotics" fill className="object-cover scale-105 group-hover:scale-110 transition-transform duration-1000" />
            </motion.div>

            {/* Floating Glass Card 1 */}
            <motion.div 
              style={{ y: floatingCardY }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-[5%] right-0 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl z-30 border border-white/50 flex items-start gap-4"
            >
              <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">800+ Active Labs</p>
                <p className="text-xs text-slate-500 font-medium">Real-time hardware access</p>
              </div>
            </motion.div>

            {/* Floating Glass Card 2 */}
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, -300]) }}
              className="absolute bottom-[15%] left-0 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl z-30 border border-white/50 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-500" />
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-600 tracking-tight">
                Joined by <span className="text-emerald-600">400+ students</span> today
              </p>
            </motion.div>

            {/* Background Accent Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-slate-200 rounded-full opacity-50 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-[1px] h-16 bg-gradient-to-b from-emerald-500 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 64] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-0 w-full h-1/2 bg-white shadow-[0_0_10px_#10B981]"
          />
        </div>
      </div>
    </section>
  );
}