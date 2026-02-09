"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  Truck, 
  GraduationCap, 
  Terminal, 
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    category: "Logistics",
    question: "How does hardware shipping work across Africa?",
    answer: "We partner with local logistics hubs in 15+ countries. Once enrolled in a hardware-lab, your kit is dispatched within 48 hours. Tracking is provided via your student dashboard.",
    icon: Truck
  },
  {
    category: "Scholarship",
    question: "What are the criteria for the Merit Scholarship?",
    answer: "We look for three things: a demonstrated interest in robotics/AI, a community-focused project idea, and a commitment to completing the 4-phase mastery path. No prior degree is required.",
    icon: GraduationCap
  },
  {
    category: "Labs",
    question: "Do I need my own computer to access the labs?",
    answer: "Yes, you'll need a laptop capable of running VS Code and basic simulation software. For heavy AI tasks, we provide remote cloud-compute credits so you don't need a high-end GPU.",
    icon: Terminal
  },
  {
    category: "Scholarship",
    question: "When are scholarship applications reviewed?",
    answer: "Applications are reviewed on a rolling basis at the start of every quarter (January, April, July, October). You will receive a decision within 14 days of the deadline.",
    icon: HelpCircle
  }
];

export function SupportSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- LEFT SIDE: THE NAVIGATOR --- */}
          <div className="lg:w-1/3 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                <HelpCircle className="w-3 h-3" />
                Support Center
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Common <br />
                <span className="text-blue-600">Questions.</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Everything you need to know about shipping, scholarship requirements, and lab equipment.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900 text-white space-y-6 shadow-2xl shadow-blue-200/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Still curious?</p>
                  <p className="text-xs text-slate-400">Our support team is live.</p>
                </div>
              </div>
              <button className="w-full py-4 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-blue-500 hover:text-white transition-all">
                Chat with an Engineer
              </button>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE ACCORDION --- */}
          <div className="lg:w-2/3 space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={false}
                className={cn(
                  "border rounded-[1.5rem] transition-all duration-300",
                  openIndex === i ? "border-blue-200 bg-blue-50/30" : "border-slate-100 bg-white"
                )}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      openIndex === i ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <faq.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                        {faq.category}
                      </span>
                      <span className="font-bold text-slate-900">{faq.question}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "h-8 w-8 rounded-full border flex items-center justify-center transition-all",
                    openIndex === i ? "bg-blue-600 border-blue-600 text-white rotate-180" : "border-slate-200 text-slate-400"
                  )}>
                    {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 ml-11">
                        <p className="text-slate-600 text-sm leading-relaxed font-medium border-l-2 border-blue-200 pl-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}