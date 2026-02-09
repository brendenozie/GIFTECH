"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Github, MessageSquare, Star, Quote } from "lucide-react";

const MENTORS = [
  {
    name: "Dr. Amara Okafor",
    role: "AI & Robotics Lead",
    company: "Ex-Google DeepMind",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500",
    bio: "Helping students bridge the gap between theoretical math and autonomous machine movement.",
    expertise: ["Neural Networks", "ROS2"],
  },
  {
    name: "Benjamin Tetteh",
    role: "Embedded Systems Architect",
    company: "Senior Engineer at Tesla",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500",
    bio: "Focused on optimizing low-power systems for large scale IoT deployments in agriculture.",
    expertise: ["C++", "Firmware"],
  },
  {
    name: "Sarah Mensah",
    role: "Full-Stack Hardware Engineer",
    company: "Founder @ AgriTech Solutions",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=500",
    bio: "Expert in building end-to-end products that connect physical sensors to web dashboards.",
    expertise: ["React", "IoT Security"],
  }
];

export function MentorSpotlight() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Star className="w-3 h-3 fill-current" />
              Expert Guidance
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Learn from those <br />
              <span className="text-blue-600">who have built it.</span>
            </h2>
          </div>
          <p className="text-slate-500 max-w-sm font-medium text-center md:text-left leading-relaxed">
            Our mentors aren&apos;t just teachers; they are senior engineers from the world&apos;s leading tech hubs, dedicated to your success.
          </p>
        </div>

        {/* --- MENTOR CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {MENTORS.map((mentor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-6 shadow-2xl shadow-slate-200">
                <Image 
                  src={mentor.image} 
                  alt={mentor.name} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                
                {/* Glass Card Overlay (On Hover) */}
                <div className="absolute inset-x-4 bottom-4 p-6 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <button className="p-2 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <div className="ml-auto flex gap-1">
                       {mentor.expertise.map(exp => (
                         <span key={exp} className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded-md">
                           {exp}
                         </span>
                       ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                    &quot;{mentor.bio}&quot;
                  </p>
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center md:text-left space-y-1 px-4">
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {mentor.name}
                </h3>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                    {mentor.role}
                  </span>
                  <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-sm font-bold text-blue-500">
                    {mentor.company}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- OFFICE HOURS BANNER --- */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mt-20 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8 group"
        >
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 flex-shrink-0">
               <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-10" />
               <div className="relative h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-inner">
                  <Quote className="w-8 h-8 text-blue-600" />
               </div>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">Weekly Office Hours</p>
              <p className="text-slate-500 font-medium">Get 1-on-1 feedback on your circuit designs and code every Thursday.</p>
            </div>
          </div>
          <button className="px-10 h-16 rounded-2xl bg-white border border-slate-200 font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm group-hover:shadow-lg">
            Book a Session
          </button>
        </motion.div>
      </div>
    </section>
  );
}