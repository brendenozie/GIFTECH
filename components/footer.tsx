"use client";

import { motion } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone,
  Cpu,
  ArrowRight
} from "lucide-react";

const FOOTER_LINKS = {
  Curriculum: ["Foundations", "Hardware Bridge", "Autonomous Systems", "Expert Innovation"],
  Platform: ["Student Dashboard", "Hardware Store", "Scholarships", "Community Hub"],
  Company: ["Our Mission", "Partnerships", "Careers", "Press Kit"],
  Legal: ["Privacy Policy", "Terms of Service", "Lab Safety Code", "Refund Policy"]
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-24 pb-12 overflow-hidden relative">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* --- BRAND BLOCK --- */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 rounded-xl bg-blue-600">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">GIFTECH<span className="text-blue-500">.</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Building the next generation of African engineering talent through hands-on robotics, AI, and IoT mastery. 
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <button key={i} className="h-10 w-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* --- LINKS GRID --- */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(FOOTER_LINKS).slice(0, 3).map(([category, links]) => (
              <div key={category} className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">{category}</h4>
                <ul className="space-y-4">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm font-medium hover:text-blue-400 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* --- NEWSLETTER / CONTACT --- */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Join the Lab</h4>
              <p className="text-xs text-slate-400">Get monthly updates on new hardware kits and scholarship openings.</p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter email..." 
                  className="w-full h-12 bg-slate-800 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button className="absolute right-2 top-2 h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-xs">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Innovation Hub, Nairobi / Lagos</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>admissions@giftech.io</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM STATUS BAR --- */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Online: v2.4.0</span>
             </div>
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
               © {currentYear} GIFTECH Labs. All rights reserved.
             </p>
          </div>
          
          <div className="flex items-center gap-6 grayscale opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase text-slate-500">Powered by</span>
            <span className="text-sm font-black text-white">SalesmanPro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}