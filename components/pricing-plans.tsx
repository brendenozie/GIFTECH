"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";

interface PricingPlansProps {
  showGetStarted?: boolean;
  onPlanSelect?: (plan: string) => void;
  className?: string;
  loading?: boolean;
  currentPlan?: string | null;
  selectedProvider?: string;
}

const plans = [
  {
    name: "Weekly",
    price: "USD 19.89",
    priceKES: "USD 19.89",
    period: "/week",
    duration: 7,
    features: [
      "15 signals per day",
      "Basic market analysis",
      "Email notifications",
      "Mobile app access",
      "Basic technical indicators",
      "Market news updates",
      "7-day access",
    ],
    benefits: [
      "Perfect for testing our service",
      "No long-term commitment",
      "Full signal access during trial",
      "Email support available",
    ],
    popular: false,
  },
  {
    name: "Monthly",
    price: "USD 49.89",
    priceKES: "USD 49.89",
    period: "/month",
    duration: 30,
    features: [
      "35 signals per day",
      "Advanced market analysis",
      "Real-time notifications",
      "Priority support",
      "Advanced technical indicators",
      "AI-powered insights",
      "Risk management tools",
      "Portfolio tracking",
      "30-day access",
    ],
    benefits: [
      "Most popular choice",
      "Best value for active traders",
      "Priority customer support",
      "Advanced AI analysis included",
      "All premium features unlocked",
    ],
    popular: true,
  },
  {
    name: "3 Months",
    price: "USD 129.89",
    priceKES: "USD 129.89",
    period: "/3 months",
    duration: 90,
    features: [
      "Unlimited signals",
      "Advanced market analysis",
      "Real-time notifications",
      "Priority support",
      "Advanced technical indicators",
      "AI-powered insights",
      "Risk management tools",
      "Portfolio tracking",
      "Extended analysis",
      "90-day access",
      "Save KES 500 vs monthly!",
    ],
    benefits: [
      "Best value for serious traders",
      "Extended commitment = better results",
      "Priority customer support",
      "All premium features included",
      "Save money vs monthly billing",
    ],
    popular: false,
  },
  // {
  //   name: "6 Months",
  //   price: "$149",
  //   period: "/6 months",
  //   features: [
  //     "Unlimited signals",
  //     "AI-powered analysis",
  //     "WhatsApp notifications",
  //     "24/7 support",
  //     "Custom indicators",
  //     "API access",
  //     "Advanced risk management",
  //     "Multi-account support",
  //     "Dedicated support",
  //     "Save $25 vs monthly",
  //   ],
  //   popular: false,
  // },
];

export default function PricingPlans({
  showGetStarted = true,
  onPlanSelect,
  className = "",
  loading = false,
  currentPlan = null,
  selectedProvider = "stripe",
}: PricingPlansProps) {
  const handlePlanAction = (planName: string) => {
    if (onPlanSelect) {
      onPlanSelect(planName);
    }
  };

  return (
    <div className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto ${className}`}>
      {plans.map((plan, index) => (
        <Card
          key={index}
          className={`relative hover:shadow-lg transition-all duration-200 bg-white dark:bg-black flex flex-col ${
            plan.popular
              ? "border-2 border-green-600"
              : "border-gray-200 dark:border-gray-800"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-600 text-white px-3 py-1">
                Most Recommended
              </Badge>
            </div>
          )}

          <CardHeader className="text-center flex-shrink-0">
            <CardTitle className="text-2xl text-black dark:text-white">
              {plan.name}
            </CardTitle>
            <div className="text-4xl font-bold text-green-600">
              {plan.price}
              <span className="text-lg text-gray-600 dark:text-gray-400">
                {plan.period}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Features List */}
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Features:</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                {plan.features.slice(0, 6).map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Benefits Section */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-sm text-green-800 dark:text-green-300 mb-2">Package Benefits:</h4>
                <ul className="space-y-1 text-xs text-green-700 dark:text-green-200">
                  {(plan as any).benefits?.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Duration Badge */}
              <div className="flex items-center justify-center mb-2">
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                  {(plan as any).duration} days of access
                </Badge>
              </div>
            </div>

            {showGetStarted ? (
              <Link href="/register">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white font-semibold`}
                onClick={() => handlePlanAction(plan.name)}
                disabled={loading || currentPlan === "active"}
              >
                {loading
                  ? "Processing..."
                  : currentPlan === "active"
                  ? "Active Subscription"
                  : `Subscribe Now`}
                {!loading && currentPlan !== "active" && (
                  <ArrowRight className="ml-2 w-4 h-4" />
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
