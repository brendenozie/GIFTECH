"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Trophy, Eye } from "lucide-react";

const PROJECTS = [
  {
    title: "Eco-Rover V1",
    author: "Kwame A.",
    category: "Robotics",
    image: "http://googleusercontent.com/image_collection/image_retrieval/10857037449518233015_0",
    status: "Deployed",
    tags: ["Python", "Solar"],
  },
  {
    title: "Smart Irrigation Node",
    author: "Sarah J.",
    category: "IoT",
    image: "http://googleusercontent.com/image_collection/image_retrieval/10857037449518233015_1",
    status: "Testing",
    tags: ["Arduino", "LoRa"],
  },
  {
    title: "AI Crop Health App",
    author: "Moussa D.",
    category: "AI",
    image: "http://googleusercontent.com/image_collection/image_retrieval/10857037449518233015_2",
    status: "Stable",
    tags: ["Vision", "React"],
  },
  {
    title: "Grid-Sync Monitor",
    author: "Chidi E.",
    category: "Electronics",
    image: "http://googleusercontent.com/image_collection/image_retrieval/10857037449518233015_3",
    status: "Prototype",
    tags: ["ESP32", "Cloud"],
  },
];

export function ProjectGallery() {
  return (
    <section className="py-24 bg-slate-50 text-slate-900 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
              <Trophy className="w-3 h-3" />
              Innovation Showroom
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Built by the <span className="text-emerald-600">Community.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              From autonomous drones to smart agricultural sensors, see how our students are applying their lab skills to solve real challenges.
            </p>
          </div>
          {/* <button className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
            Submit Your Project
          </button> */}
        </div>

        {/* --- PROJECT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Project Image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Light Glass Overlay (Visible on Hover) */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Subtle Bottom Gradient (Always Visible for Readability) */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent opacity-90" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="space-y-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-emerald-600 text-white border-none text-[10px] font-bold px-2 py-0.5">
                      {project.status}
                    </Badge>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                      {project.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium">By {project.author}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar (Appears on Hover) */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <button className="p-2 rounded-lg bg-slate-900 text-white hover:bg-emerald-600 transition-colors">
                      <Github className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-100 text-slate-900 hover:bg-emerald-100 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="ml-auto text-xs font-bold text-slate-900 flex items-center gap-1 hover:text-emerald-600 transition-colors">
                      Case Study <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- CALL TO ACTION BAR --- */}
        <div className="mt-20 p-px rounded-[2.5rem] bg-slate-200 overflow-hidden">
          <div className="bg-white rounded-[2.45rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <Trophy className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Inspired by these builds?</h4>
                <p className="text-slate-500 font-medium">Start your first lab today and get featured here.</p>
              </div>
            </div>
            <button className="w-full md:w-auto h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-slate-900 text-white font-black text-lg shadow-lg shadow-emerald-200 transition-all active:scale-95">
              Launch Your First Lab
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}