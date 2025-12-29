"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Globe,
  Target,
  CreditCard,
  CreditCardIcon,
  MessageCircle,
  Crown,
  TrendingUp,
  Bell,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useAuth } from "@/components/auth-context";
import PricingPlans from "@/components/pricing-plans";
import { toast } from "sonner";
import { 
  ShimmerSubscriptionStatus, 
  ShimmerPricingCard, 
  ShimmerCard,
  ShimmerButton,
  Shimmer
} from "@/components/ui/shimmer";

type PaymentProvider = "stripe" | "paystack" | "pesapal";

// FAQ Data
const faqData = [
  {
    question: "How do I get started?",
    answer: "Choose your plan, select your payment method, and you'll have immediate access to our trading signals and analysis tools."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards through Stripe and local payment methods through Paystack for our African users."
  },
  {
    question: "How accurate are your trading signals?",
    answer: "Our signals are generated using advanced algorithms with high accuracy rates. We continuously monitor and improve our performance."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, contact our support team."
  }
];

export default function SignalsPage() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive");
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("pesapal");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Check authentication
  useEffect(() => {
    // Only redirect if auth is not loading AND user is null
    if (!authLoading && !user) {
      console.log('🔒 Not authenticated, redirecting to login');
      router.push('/login?redirect=/signals');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Check if user has an active subscription
    const token = localStorage.getItem("token");
    if (token) {
      setSubscriptionLoading(true);
      fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.subscriptionStatus === "active") {
            setCurrentPlan(data.user.subscriptionType);
            setSubscriptionStatus("active");
          } else {
            setSubscriptionStatus(data.user?.subscriptionStatus || "inactive");
          }
        })
        .catch((err) => console.error("Error fetching user data:", err))
        .finally(() => {
          setSubscriptionLoading(false);
        });
    } else {
      setSubscriptionLoading(false);
    }
  }, []);

  const handlePlanSelect = async (plan: string) => {
    if (subscriptionStatus === "active") {
      toast.error("You already have an active subscription. Please contact support to change your plan.");
      return;
    }

    setLoading(true);
    toast.loading("Setting up payment...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to subscribe to a plan");
        // Save current page to redirect back after login
        router.push("/login?redirect=/signals");
        return;
      }

      // Map plan names to API-expected values
      let planId = plan.toLowerCase();
      if (plan === "Weekly") planId = "weekly";
      if (plan === "Monthly") planId = "monthly";
      if (plan === "Annually") planId = "annually";

      console.log("🔍 [Plan Selection] Debug Info:");
      console.log("  - Original plan:", plan);
      console.log("  - Mapped planId:", planId);
      console.log("  - Selected provider:", selectedProvider);

      // Use different endpoints based on payment provider
      const endpoint =
        selectedProvider === "stripe"
          ? "/api/payments/create-checkout"
          : selectedProvider === "paystack"
          ? "/api/payments/create-paystack"
          : "/api/payments/create-pesapal";

      toast.loading(`Creating ${selectedProvider} checkout session...`);

      const requestBody = {
        plan: planId,
        provider: selectedProvider,
        successUrl: `${window.location.origin}/signals/success`,
        cancelUrl: `${window.location.origin}/signals`,
      };

      console.log("🔍 [Plan Selection] Request body:", requestBody);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      console.log("🔍 [Plan Selection] API Response:", {
        status: response.status,
        data: data
      });

      if (response.ok && data.url) {
        toast.success(`Redirecting to ${selectedProvider} checkout...`);
        // Small delay to show success message
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
      } else {
        if (data.hasActiveSubscription) {
          toast.error("You already have an active subscription. Please contact support to change your plan.");
          setSubscriptionStatus("active");
        } else {
          // Handle Pesapal-specific errors
          if (selectedProvider === "pesapal" && data.error?.includes("temporarily unavailable")) {
            toast.error("Pesapal is temporarily unavailable. Please try Paystack or Stripe instead.");
            return;
          }
          throw new Error(data.error || "No checkout URL received");
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Error creating checkout session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramAccess = () => {
    toast.success("Opening Telegram channel...");
    // This would typically open a Telegram bot or channel link
    window.open("https://t.me/readypips_signals", "_blank");
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="h-1 w-16 bg-green-600 rounded-full mx-auto"></div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Trading Signals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access real-time trading signals, advanced market analysis, and our exclusive community
          </p>
        </div>

        {/* Current Subscription Status */}
        <div className="max-w-5xl mx-auto mb-16">
          {subscriptionLoading ? (
            <ShimmerSubscriptionStatus />
          ) : (
            <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-8">
                <CardTitle className="text-3xl text-gray-900 dark:text-white text-center">
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Current Plan
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {subscriptionStatus === "active" 
                        ? currentPlan 
                          ? currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()
                          : "Premium"
                        : "Basic"}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {subscriptionStatus === "active" ? "Active Subscription" : "Free Plan"}
                    </p>
                  </div>
                  
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Signal Access
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {subscriptionStatus === "active" ? "Full" : "Limited"}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {subscriptionStatus === "active" ? "All signals available" : "Basic signals only"}
                    </p>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Community Access
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {subscriptionStatus === "active" ? "Yes" : "No"}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {subscriptionStatus === "active" ? "Join our Telegram" : "Upgrade to join"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Telegram Access for Subscribers */}
        {subscriptionStatus === "active" && (
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-8">
                <CardTitle className="text-2xl text-gray-900 dark:text-white text-center">
                  Exclusive Community Channel
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400 text-base mt-3">
                  Connect with our trading community and receive real-time signal notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-12 text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-6">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <Button
                  onClick={handleTelegramAccess}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg font-semibold mb-6"
                  size="lg"
                >
                  Join Telegram Channel
                </Button>
                <p className="text-gray-600 dark:text-gray-400">
                  Get instant notifications for new signals and exclusive market analysis
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Method Selection - Only show if no active subscription */}
        {subscriptionStatus !== "active" && (
          <div className="max-w-4xl mx-auto mb-16">
            {subscriptionLoading ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
                <div className="space-y-6">
                  <Shimmer className="h-8 w-64 rounded mx-auto" />
                  <Shimmer className="h-6 w-96 rounded mx-auto" />
                  <div className="flex justify-center">
                    <Shimmer className="h-12 w-48 rounded-lg" />
                  </div>
                  <Shimmer className="h-6 w-80 rounded mx-auto" />
                </div>
              </div>
            ) : (
              <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-8">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white text-center">
                    Select Payment Method
                  </CardTitle>
                  <CardDescription className="text-center text-gray-600 dark:text-gray-400 text-base mt-3">
                    Choose your preferred payment provider
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-12">
                  {/* Payment Method - Pesapal Only */}
                  <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setSelectedProvider("pesapal")}
                        className="px-8 py-3 rounded-md font-semibold transition-all duration-200 bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-md hover:shadow-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-5 h-5" />
                          <span>Pesapal Payment</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Payment Method Info */}
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                        Secure payments for Kenya and Africa
                      </span>
                    </div>
                    
                    {/* Pesapal Payment Options Image */}
                    <div className="mt-6">
                      <img 
                        src="/pesapal-payment-options.png" 
                        alt="Payment options including M-Pesa, Airtel Money, Visa, and Mastercard"
                        className="mx-auto max-w-md w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                        Supported: M-Pesa, Airtel Money, Visa, Mastercard, and more
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Pricing Cards - Only show if no active subscription */}
        {subscriptionStatus !== "active" && (
          <div className="mb-16">
            {subscriptionLoading ? (
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ShimmerPricingCard key={i} />
                ))}
              </div>
            ) : (
              <PricingPlans 
                showGetStarted={false}
                onPlanSelect={handlePlanSelect}
                loading={loading}
                currentPlan={currentPlan}
                selectedProvider={selectedProvider}
              />
            )}
          </div>
        )}

        {/* Features for Subscribers */}
        {subscriptionStatus === "active" && (
          <div className="mb-16">
            <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-8">
                <CardTitle className="text-center text-gray-900 dark:text-white text-3xl">
                  Your Premium Features
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400 text-base mt-3">
                  Access all the tools and insights you need to succeed
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Real-Time Signals
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Instant trading signals with high accuracy rates
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Advanced Analysis
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Premium market analysis and trading insights
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Community Access
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Join our exclusive Telegram trading community
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Comparison */}
        <div className="mt-20 mb-16">
          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-8">
              <CardTitle className="text-3xl text-gray-900 dark:text-white text-center">
                Why Choose Ready Pips?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Real-Time Signals
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Get instant trading signals with industry-leading accuracy rates and fast execution
                  </p>
                </div>
                <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Risk Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Advanced risk management tools and protective mechanisms to safeguard your capital
                  </p>
                </div>
                <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Global Markets
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Access to forex, cryptocurrency, and stock markets across worldwide exchanges
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section with Accordions */}
        <div className="mb-20">
          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-8">
              <CardTitle className="text-3xl text-gray-900 dark:text-white text-center">
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400 text-base mt-3">
                Common questions about our trading signals platform
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="max-w-3xl mx-auto space-y-3">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white text-base">
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0 ml-4">
                        {openFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-6 pb-4 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
