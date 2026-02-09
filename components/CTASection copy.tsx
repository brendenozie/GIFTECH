"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Link, Sparkles, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="relative rounded-[3rem] bg-slate-900 px-8 py-16 md:px-16 md:py-24 overflow-hidden shadow-2xl">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
              <Zap className="w-4 h-4 text-[#10B981]" />
              <span className="text-sm font-bold text-emerald-100 uppercase tracking-widest">Start your journey today</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Don’t just watch the future happen. <span className="text-[#10B981]">Build it.</span>
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed">
              Join 12,000+ students mastering the tech skills that matter. Get instant access to our robotics kits, courses, and elite mentor network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-[#10B981] hover:bg-[#0da673] text-white px-10 h-16 text-lg rounded-full font-bold shadow-lg shadow-emerald-900/20 w-full sm:w-auto transition-all hover:scale-105">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 px-10 h-16 text-lg rounded-full font-bold w-full sm:w-auto">
                  Browse Catalog
                </Button>
              </Link>
            </div>
            
            <p className="mt-8 text-slate-500 text-sm font-medium">
              No credit card required to start • Instant access to 5+ free modules
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}