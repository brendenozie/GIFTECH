"use client";

import { Navbar } from "@/components/navigation";
import { useAuth } from "@/components/auth-context";
import {EnrollmentSection}  from "@/components/pricing-plans";
import { HeroSection } from "@/components/heroSection";
import { CourseCatalog } from "@/components/CourseCatalog";
import { CurriculumTimeline } from "@/components/CurriculumTimeline";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { CourseTrackSection } from "@/components/CourseTrackSection";
import { TrustStatsSection } from "@/components/TrustStatsSection";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/footer";
import { ProjectGallery } from "@/components/ProjectGallery";
import { MentorSpotlight } from "@/components/MentorSpotlight";
import { SupportSection } from "@/components/SupportSection";


export default function HomePage() {
  const { user, loading: authLoading } = useAuth();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />

        <HeroSection />

        <CourseCatalog />

        <ProjectGallery />
        
        <CurriculumTimeline />

        <MentorSpotlight />

        <ExpertiseSection />

        <CourseTrackSection />

        <TrustStatsSection />

        <Testimonials />

        <CTASection />
        
        <EnrollmentSection />

        <SupportSection />
        
      </div>
      
        <Footer />
    </div>
  );
}