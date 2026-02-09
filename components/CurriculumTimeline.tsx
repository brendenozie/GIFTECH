"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Trophy, 
  Rocket, 
  Cpu, 
  Terminal, 
  Unplug,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const PATH_STAGES = [
  {
    phase: "01",
    title: "Logic Foundation",
    description: "Master computational thinking and the unseen laws of digital logic.",
    skills: ["Block Coding", "Circuit Basics", "Logic Gates"],
    icon: Terminal,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    lightColor: "bg-blue-50",
  },
  {
    phase: "02",
    title: "Hardware Bridge",
    description: "The transition from screen to machine. Making code breathe in the physical world.",
    skills: ["Python", "Arduino", "Sensors"],
    icon: Unplug,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    lightColor: "bg-purple-50",
  },
  {
    phase: "03",
    title: "Autonomous Systems",
    description: "Engineering independence. Building robots that perceive and react.",
    skills: ["C++", "Motor Control", "Edge AI"],
    icon: Cpu,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    lightColor: "bg-emerald-50",
  },
  {
    phase: "04",
    title: "Expert Innovation",
    description: "Designing professional IoT solutions and competitive-grade robotics.",
    skills: ["System Design", "Cloud", "Prototyping"],
    icon: Rocket,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    lightColor: "bg-amber-50",
  }
];

export function CurriculumTimeline() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-emerald-200 text-emerald-700 bg-emerald-50/50 rounded-full font-bold uppercase tracking-widest text-[10px]">
            Mastery Path
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            From First Line to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">First Launch.</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Our curriculum isn&apos;t a list; it&apos;s a mission-based journey designed to turn curiosity into engineering expertise.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Desktop Timeline Path (SVG) */}
          <div className="absolute inset-0 hidden lg:block pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg">
               <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M500 0V150C500 200 800 200 800 300C800 400 200 400 200 500C200 600 500 600 500 750" 
                stroke="#E2E8F0" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeDasharray="12 12"
              />
            </svg>
          </div>

          <div className="space-y-16 lg:space-y-0 lg:min-h-[800px] relative">
            {PATH_STAGES.map((stage, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={cn(
                  "relative flex flex-col lg:absolute lg:w-[380px] group",
                  index === 0 && "lg:top-0 lg:left-1/2 lg:-translate-x-1/2",
                  index === 1 && "lg:top-[220px] lg:right-0",
                  index === 2 && "lg:top-[420px] lg:left-0",
                  index === 3 && "lg:top-[620px] lg:left-1/2 lg:-translate-x-1/2"
                )}
              >
                {/* Stage Content Card */}
                <div className="relative z-10 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-200/50 group-hover:-translate-y-2">
                  
                  {/* Phase Circle */}
                  <div className={cn(
                    "absolute -top-6 left-8 h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg",
                    stage.bgColor
                  )}>
                    {stage.phase}
                  </div>

                  <div className="flex items-center gap-4 mt-2 mb-6">
                    <div className={cn("p-3 rounded-2xl", stage.lightColor, stage.color)}>
                      <stage.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {stage.title}
                    </h3>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                    {stage.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                    {stage.skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <CheckCircle2 className={cn("w-3 h-3", stage.color)} />
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Hover Decoration */}
                  <div className={cn("absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2", stage.color)}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Decorative Number Glow (Background) */}
                <span className="absolute -bottom-10 -right-4 text-9xl font-black text-slate-50 select-none -z-10 group-hover:text-slate-100 transition-colors">
                  {stage.phase}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Graduation Marker */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="relative flex justify-center pt-24 lg:pt-32"
          >
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative z-10 bg-slate-900 text-white px-10 py-5 rounded-[2rem] flex flex-col items-center gap-2 shadow-2xl transition-transform hover:scale-105">
                <Trophy className="w-10 h-10 text-emerald-400 mb-2" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Final Milestone</span>
                <p className="text-xl font-black">Industry Ready Expert</p>
                <div className="flex items-center gap-1 mt-2 text-slate-400 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  JOBS, INTERNSHIPS & CAPSTONE PROJECTS
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}