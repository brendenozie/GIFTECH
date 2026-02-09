"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Menu, 
  X, 
  ChevronDown, 
  Layers, 
  Zap, 
  Globe, 
  LayoutGrid 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Curriculum", href: "#curriculum", icon: Layers },
  { name: "Labs", href: "#labs", icon: LayoutGrid },
  { name: "Scholarships", href: "#scholarships", icon: Zap },
  { name: "Community", href: "#community", icon: Globe },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4",
        isScrolled ? "py-3" : "py-6"
      )}
    >
      <div className={cn(
        "container mx-auto max-w-7xl rounded-full transition-all duration-500 flex items-center justify-between px-6 py-3",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-lg shadow-slate-900/5" 
          : "bg-transparent border border-transparent"
      )}>
        
        {/* --- LOGO --- */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="p-2 rounded-xl bg-slate-900 text-white group-hover:bg-blue-600 transition-colors">
            <Cpu className="w-5 h-5" />
          </div>
          <span className={cn(
            "text-xl font-black tracking-tighter uppercase transition-colors",
            isScrolled ? "text-slate-900" : "text-slate-900" 
          )}>
            GIF<span className="text-emerald-600">TECH.</span>
          </span>
        </div>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="group flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              {link.name}
              <ChevronDown className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
            </a>
          ))}
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="text-sm font-bold text-slate-900 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all">
            Log In
          </button>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/20 transition-all active:scale-95">
            Launch Lab
          </button>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button 
          className="lg:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* --- MOBILE OVERLAY MENU --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] lg:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[120] shadow-2xl p-8 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <span className="font-black text-xl tracking-tighter uppercase">MENU</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-slate-100 rounded-xl text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6 flex-grow">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      href={link.href}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-slate-900 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </motion.a>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-slate-100">
                   <button className="w-full h-14 rounded-2xl border-2 border-slate-900 text-slate-900 font-black">
                     Log In
                   </button>
                   <button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-900/20">
                     Launch Lab
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}