"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, CheckCircle, Code2, Cpu, Globe, Layers, Sparkles, Timer } from "lucide-react";
import Image from "next/image";

const COURSES = [
  {
    id: 1,
    title: "Autonomous Rover Lab",
    description: "Build a self-driving robot from scratch using LiDAR sensors and Python-based pathfinding.",
    level: "Intermediate",
    duration: "12 Weeks",
    category: "Robotics",
    icon: <Bot className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
    tags: ["Python", "LiDAR", "Hardware"],
  },
  {
    id: 2,
    title: "Full-Stack Web Engineering",
    description: "Master modern web development by building complex, scalable applications with React and Next.js.",
    level: "Beginner",
    duration: "10 Weeks",
    category: "Software",
    icon: <Code2 className="w-5 h-5" />,
    color: "bg-violet-50 text-violet-600",
    tags: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: 3,
    title: "IoT & Smart Systems",
    description: "Connect the world. Learn to bridge the gap between physical sensors and cloud data.",
    level: "Advanced",
    duration: "8 Weeks",
    category: "Electronics",
    icon: <Cpu className="w-5 h-5" />,
    color: "bg-emerald-50 text-emerald-600",
    tags: ["C++", "Arduino", "Cloud"],
  },
  {
    id: 4,
    title: "AI & Neural Networks",
    description: "Introduction to machine learning. Teach your robots to recognize faces and objects.",
    level: "Advanced",
    duration: "14 Weeks",
    category: "AI",
    icon: <Sparkles className="w-5 h-5" />,
    color: "bg-amber-50 text-amber-600",
    tags: ["TensorFlow", "Vision", "ML"],
  }
];

export function CourseTrackSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#10B981]/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#10B981] text-white border-none mb-6">NEW TRACKS</Badge>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                Ready to start your <br /> journey?
              </h2>
              <div className="space-y-4">
                {[
                  "Over 50+ Specialized Modules",
                  "Industry Recognized Certification",
                  "1-on-1 Mentorship from Tech Leads"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-10 bg-[#10B981] hover:bg-[#0da673] text-white px-10 h-16 rounded-full text-lg font-bold">
                Explore All Tracks
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl">
                  <span className="text-3xl block mb-2">🤖</span>
                  <h5 className="text-white font-bold">AI Fundamentals</h5>
                  <p className="text-slate-400 text-xs mt-1">12 Weeks • Intermediate</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl">
                  <span className="text-3xl block mb-2">☁️</span>
                  <h5 className="text-white font-bold">Cloud Engineering</h5>
                  <p className="text-slate-400 text-xs mt-1">8 Weeks • Advanced</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[#10B981] p-6 rounded-3xl">
                  <span className="text-3xl block mb-2">💻</span>
                  <h5 className="text-white font-bold">Fullstack Dev</h5>
                  <p className="text-emerald-100/70 text-xs mt-1">16 Weeks • Beginner</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl">
                  <span className="text-3xl block mb-2">🔒</span>
                  <h5 className="text-white font-bold">Ethical Hacking</h5>
                  <p className="text-slate-400 text-xs mt-1">10 Weeks • Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}