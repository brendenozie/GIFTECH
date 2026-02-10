"use client";

import { Navbar } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQsPage() {
  const faqs = [
    {
      question: "What are trading signals?",
      answer:
        "Trading signals are alerts that suggest when to buy or sell a particular financial asset. Our AI-powered signals analyze market data and patterns to provide you with accurate trading recommendations.",
    },
    {
      question: "How accurate are the signals?",
      answer:
        "Our trading signals have demonstrated up to 93% accuracy based on historical data. However, no trading system is 100% accurate, and past performance does not guarantee future results. We recommend using our signals as one tool among many in your trading strategy.",
    },
    {
      question: "How do I receive signals?",
      answer: "Signals are automatically generated on chart in real-time.",
      // "Signals are delivered through multiple channels depending on your subscription plan: email notifications, in-app alerts, and WhatsApp messages for premium subscribers.",
    },
    {
      question: "Can I use the platform on mobile?",
      answer:
        "Yes! GIFTECHis fully mobile responsive and works seamlessly on smartphones and tablets. You can access all features and receive notifications on the go.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept multiple payment methods including Stripe, Paystack, and Pesapal. Your payment information is securely processed and encrypted.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no long-term contracts or hidden fees. Your access will continue until the end of your billing period.",
    },
    {
      question: "Is my personal data safe?",
      answer:
        "We take data security very seriously. All personal information is encrypted and stored securely. We comply with international data protection regulations including GDPR.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes, we offer a limited free trial to new users so you can experience the platform before committing to a subscription.",
    },
    {
      question: "What assets can I trade with your signals?",
      answer:
        "Our signals cover forex pairs, cryptocurrencies, and stocks. We continuously expand our coverage to include new trading instruments.",
    },
    {
      question: "How often are new signals generated?",
      answer:
        "Signals are generated continuously throughout market hours. Depending on your subscription plan, you can receive up to 35+ signals per day.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-black">
        {/* Header */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to common questions about GIFTECHand our trading
            signals.
          </p>
        </section>

        {/* FAQs Accordion */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold text-black dark:text-white hover:text-green-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
      <Footer />
    </>
  );
}
