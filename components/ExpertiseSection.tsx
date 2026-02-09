"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bot, 
  Code2, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  Microscope, 
  Activity, 
  Link
} from "lucide-react";

const PREVIEW_COURSES = [
  {
    title: "Robotics & Automation",
    tagline: "Build & Program Rovers",
    icon: Bot,
    color: "emerald",
    stats: "12 Labs",
    difficulty: "Intermediate",
    description: "Deploy Python scripts to hardware and master autonomous navigation using LiDAR."
  },
  {
    title: "AI & Neural Networks",
    tagline: "Computer Vision Systems",
    icon: Sparkles,
    color: "blue",
    stats: "08 Labs",
    difficulty: "Advanced",
    description: "Train models to recognize patterns and integrate them into real-world edge devices."
  },
  {
    title: "IoT Systems Architecture",
    tagline: "Connect the Physical World",
    icon: Cpu,
    color: "violet",
    stats: "15 Labs",
    difficulty: "Beginner",
    description: "Bridge the gap between sensors and the cloud using C++ and secure MQTT protocols."
  }
];

export function ExpertiseSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Section Header */}
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#10B981] uppercase mb-4">
              Our Expertise
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Master the skills that <br /> define the future.
            </h3>
          </div>
          <p className="text-slate-500 max-w-sm pb-2">
            We don&apos;t just teach code; we teach the logic and hardware integration required to build world-class solutions.
          </p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PREVIEW_COURSES.map((course, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group relative p-8 h-full bg-slate-50 border-slate-200/60 overflow-hidden hover:border-emerald-500/50 transition-all duration-500 shadow-none hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
                {/* Decorative Icon Background */}
                <course.icon className="absolute -right-8 -top-8 w-40 h-40 text-slate-200/40 rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 rounded-2xl bg-white shadow-sm text-${course.color}-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300`}>
                      <course.icon className="w-8 h-8" />
                    </div>
                    <Badge variant="outline" className="bg-white/50 border-slate-200 text-slate-500 font-bold">
                      {course.difficulty}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                      {course.tagline}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Terminal className="w-3.5 h-3.5" />
                        {course.stats}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Microscope className="w-3.5 h-3.5" />
                        Hardware Included
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                       <ArrowRight className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Hover Accent Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Visual Connector to Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-slate-200 to-transparent" />
    </section>
  );
}