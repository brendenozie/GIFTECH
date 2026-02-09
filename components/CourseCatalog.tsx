"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Code2, Cpu, Sparkles, Timer, ChevronRight, BarChart, Search, LayoutGrid } from "lucide-react";

const CATEGORIES = ["All", "Robotics", "Software", "Electronics", "AI"];

const COURSES = [
  {
    id: 1,
    title: "Autonomous Rover Lab",
    description: "Build a self-driving robot from scratch using LiDAR sensors and Python-based pathfinding.",
    level: "Intermediate",
    duration: "12 Weeks",
    category: "Robotics",
    icon: Bot,
    color: "from-blue-500/20 to-cyan-500/20",
    accent: "text-blue-600",
    border: "group-hover:border-blue-400/50",
    tags: ["Python", "LiDAR", "Hardware"],
  },
  {
    id: 2,
    title: "Full-Stack Web Engineering",
    description: "Master modern web development by building complex, scalable applications with React and Next.js.",
    level: "Beginner",
    duration: "10 Weeks",
    category: "Software",
    icon: Code2,
    color: "from-violet-500/20 to-fuchsia-500/20",
    accent: "text-violet-600",
    border: "group-hover:border-violet-400/50",
    tags: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: 3,
    title: "IoT & Smart Systems",
    description: "Connect the world. Learn to bridge the gap between physical sensors and cloud data.",
    level: "Advanced",
    duration: "8 Weeks",
    category: "Electronics",
    icon: Cpu,
    color: "from-emerald-500/20 to-teal-500/20",
    accent: "text-emerald-600",
    border: "group-hover:border-emerald-400/50",
    tags: ["C++", "Arduino", "Cloud"],
  },
  {
    id: 4,
    title: "AI & Neural Networks",
    description: "Introduction to machine learning. Teach your robots to recognize faces and objects.",
    level: "Advanced",
    duration: "14 Weeks",
    category: "AI",
    icon: Sparkles,
    color: "from-amber-500/20 to-orange-500/20",
    accent: "text-amber-600",
    border: "group-hover:border-amber-400/50",
    tags: ["TensorFlow", "Vision", "ML"],
  }
];

export function CourseCatalog() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredCourses = activeTab === "All" 
    ? COURSES 
    : COURSES.filter(course => course.category === activeTab);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      
      {/* --- HEADER SECTION --- */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Next-Gen Learning</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Future of Tech</span>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Hands-on labs designed to bridge the gap between theory and industry-grade engineering.
        </p>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="sticky top-4 z-20 flex justify-center">
        <div className="flex items-center p-1.5 bg-white/70 backdrop-blur-xl border border-slate-200 shadow-lg rounded-2xl gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === cat 
                ? "bg-slate-900 text-white shadow-md" 
                : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- GRID SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredCourses.map((course) => (
          <Card 
            key={course.id} 
            className={`group relative overflow-hidden border-slate-200/60 bg-white/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${course.border}`}
          >
            {/* Subtle Background Glow */}
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${course.color} blur-3xl transition-opacity opacity-0 group-hover:opacity-100`} />

            <CardHeader className="relative p-0">
              <div className={`h-40 w-full bg-gradient-to-br ${course.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                
                <div className="p-4 rounded-2xl bg-white/90 shadow-xl shadow-black/5 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <course.icon className={`w-10 h-10 ${course.accent}`} />
                </div>

                <Badge className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-900 border-none backdrop-blur-md shadow-sm text-[10px] font-bold tracking-wider uppercase">
                  {course.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <Timer className="w-3.5 h-3.5" /> {course.duration}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <BarChart className="w-3.5 h-3.5" /> {course.level}
                </div>
              </div>

              <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-black transition-colors mb-3">
                {course.title}
              </CardTitle>

              <p className="text-sm leading-relaxed text-slate-600 line-clamp-2 mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-md bg-slate-100/80 text-slate-600 font-semibold tracking-tight border border-slate-200/50">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button className="group/btn w-full bg-slate-900 text-white hover:bg-black transition-all duration-300 rounded-xl py-6 overflow-hidden relative">
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                  Explore Lab
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </span>
                <div className={`absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 bg-gradient-to-r ${course.color} opacity-20`} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* --- EMPTY STATE --- */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-slate-400">No courses found in this category.</p>
        </div>
      )}
    </section>
  );
}