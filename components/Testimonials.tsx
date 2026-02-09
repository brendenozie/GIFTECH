"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, ExternalLink, ArrowRight, ShieldCheck, Zap } from "lucide-react";

const SUCCESS_STORY = {
  name: "Ibrahim Yusuf",
  role: "Embedded Systems Engineer",
  company: "Zipline",
  location: "Rwanda",
  image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800",
  project: "Autonomous Soil Monitor",
  quote: "Before GIFTECH, hardware felt like a black box. The hands-on labs didn't just teach me Python—they taught me how to deploy code that interacts with the physical world. Three months after finishing Phase 04, I was hired to help manage drone flight systems.",
  tags: ["Phase 04 Graduate", "Hardware Scholarship Recipient"]
};

export function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row items-stretch">
          
          {/* --- IMAGE & BADGE --- */}
          <div className="lg:w-2/5 relative min-h-[400px]">
            <Image 
              src={SUCCESS_STORY.image}
              alt={SUCCESS_STORY.name}
              fill
              className="object-cover object-top opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {SUCCESS_STORY.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* --- TESTIMONIAL CONTENT --- */}
          <div className="lg:w-3/5 p-12 lg:p-20 flex flex-col justify-center relative">
            <Quote className="absolute top-10 right-10 w-20 h-20 text-white/5 pointer-events-none" />
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                  <Zap className="w-4 h-4 fill-current" />
                  Alumni Spotlight
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight">
                  {SUCCESS_STORY.name}
                </h3>
                <p className="text-slate-400 font-bold text-lg italic">
                  {SUCCESS_STORY.role} @ <span className="text-white">{SUCCESS_STORY.company}</span>
                </p>
              </div>

              <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
                &quot;{SUCCESS_STORY.quote}&quot;
              </p>

              {/* PROJECT PREVIEW CARD */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase">Capstone Project</p>
                    <p className="text-sm font-bold text-white">{SUCCESS_STORY.project}</p>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-6">
                 <button className="flex items-center gap-2 text-sm font-black text-white hover:text-blue-400 transition-colors group">
                   View more success stories 
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}