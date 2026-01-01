'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, ChevronRight, Users, Briefcase, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Navigation } from '@/components/navigation';

type ApplicationType = 'affiliate' | 'partner' | null;

export default function PartnerOnboarding() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<ApplicationType>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    platform: '',
    audienceSize: '',
    strategy: '',
    companyName: '', // For Partners
  });

  const handleNext = () => {
    if (step === 1 && !type) {
      toast.error("Please select an application type");
      return;
    }
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const endpoint = type === 'partner' ? '/api/partner/apply' : '/api/affiliate/apply';
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...formData, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Application submitted successfully");
      router.push("/partner/pending");
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      
      <Navigation />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Program` : 'Join our Network'}
          </h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-2 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>

        <div className="min-h-[350px]">
          {/* Step 1: Choose Type */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
              <h2 className="text-3xl font-semibold">Choose your path</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setType('affiliate')}
                  className={cn(
                    "p-6 rounded-xl border border-slate-800 transition-all text-left group",
                    type === 'affiliate' ? "bg-blue-600/10 border-blue-500" : "bg-slate-900 hover:border-slate-700"
                  )}
                >
                  <Users className="w-8 h-8 mb-4 text-blue-400" />
                  <h3 className="text-xl font-bold">Affiliate</h3>
                  <p className="text-sm text-slate-400 mt-2">Best for content creators and influencers looking for referral commissions.</p>
                </button>
                <button
                  onClick={() => setType('partner')}
                  className={cn(
                    "p-6 rounded-xl border border-slate-800 transition-all text-left group",
                    type === 'partner' ? "bg-purple-600/10 border-purple-500" : "bg-slate-900 hover:border-slate-700"
                  )}
                >
                  <Briefcase className="w-8 h-8 mb-4 text-purple-400" />
                  <h3 className="text-xl font-bold">Partner</h3>
                  <p className="text-sm text-slate-400 mt-2">For registered companies or agencies looking for revenue share and deep integration.</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Platform */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
              <h2 className="text-3xl font-semibold">Where is your community?</h2>
              <div className="grid grid-cols-2 gap-4">
                {['YouTube', 'Twitter/X', 'Telegram', 'Instagram', 'Blog/Web'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFormData({...formData, platform: p})}
                    className={cn(
                      "p-4 rounded-xl border border-slate-800 transition-all text-center",
                      formData.platform === p ? "bg-blue-600/10 border-blue-500" : "bg-slate-900"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Conditional Fields */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">
              <h2 className="text-3xl font-semibold">{type === 'partner' ? 'Business Details' : 'Your Reach'}</h2>
              <div className="space-y-4">
                {type === 'partner' && (
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Company Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 outline-none"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Audience Size</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 50k followers"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 outline-none"
                    value={formData.audienceSize}
                    onChange={(e) => setFormData({...formData, audienceSize: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Promotion Strategy</label>
                  <textarea 
                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-4 outline-none resize-none"
                    value={formData.strategy}
                    onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Review */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 text-center space-y-6 flex flex-col items-center justify-center pt-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold">Ready to Join?</h2>
              <p className="text-slate-400">Applying as: <span className="text-blue-400 font-bold uppercase">{type}</span></p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-white transition-colors">
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : step === 4 ? 'Submit Application' : 'Continue'}
            {!isLoading && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}