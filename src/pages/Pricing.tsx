import * as React from "react";
import { motion } from "motion/react";
import { CheckCircle, School, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Link } from "react-router-dom";

export function Pricing() {
  const [currency, setCurrency] = React.useState("EUR");

  const exchangeRates: Record<string, number> = {
    "EUR": 1,
    "FCFA": 655.957,
    "USD": 1.08,
    "GBP": 0.85,
    "NGN": 1650,
    "ZAR": 20.5
  };

  const currencySymbols: Record<string, string> = {
    "EUR": "€",
    "FCFA": "FCFA ",
    "USD": "$",
    "GBP": "£",
    "NGN": "₦",
    "ZAR": "R"
  };

  const formatPrice = (basePrice: number) => {
    const rate = exchangeRates[currency] || 1;
    const symbol = currencySymbols[currency] || "€";
    const converted = Math.round(basePrice * rate);
    
    if (currency === "FCFA" || currency === "NGN") {
      return `${symbol}${converted.toLocaleString()}`;
    }
    return `${symbol}${converted.toLocaleString()}`;
  };

  const plans = [
    {
      name: "Standard",
      basePrice: 2450,
      description: "Perfect for individual school recruitment needs.",
      features: [
        "3 Premium Job Postings",
        "Access to Verified Candidate Pool",
        "Basic School Profile",
        "Standard Support",
        "Job Alert Distribution"
      ],
      buttonText: "Get Started",
      highlight: false
    },
    {
      name: "Premium",
      basePrice: 5950,
      description: "Comprehensive solution for active recruitment.",
      features: [
        "Unlimited Job Postings",
        "Priority Candidate Matching",
        "Enhanced School Profile",
        "Dedicated Account Manager",
        "Featured School Status",
        "Custom Recruitment Strategy"
      ],
      buttonText: "Go Premium",
      highlight: true
    },
    {
      name: "Enterprise",
      basePrice: null,
      description: "Bespoke solutions for school groups and networks.",
      features: [
        "Multi-School Management",
        "API Access & Integration",
        "White-label Solutions",
        "Quarterly Strategy Reviews",
        "Full Recruitment Outsourcing",
        "Global Talent Sourcing"
      ],
      buttonText: "Contact Us",
      highlight: false
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-light backdrop-blur-sm">
              <Sparkles size={16} />
              <span>Transparent Pricing</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-7xl">
              Invest in Your <br />
              <span className="text-primary italic">Academic Future</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 lg:text-xl">
              Choose the plan that best fits your institution's recruitment goals and budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
              <span className="text-sm font-bold text-slate-500 ml-4">Currency:</span>
              <div className="flex gap-1">
                {Object.keys(exchangeRates).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      currency === curr 
                        ? "bg-primary text-white shadow-md" 
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full flex flex-col p-8 ${plan.highlight ? 'border-primary ring-2 ring-primary/20 shadow-xl' : ''}`}>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        {plan.basePrice ? formatPrice(plan.basePrice) : "Custom"}
                      </span>
                      {plan.basePrice && <span className="text-slate-500 text-sm">/year</span>}
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                    <Button 
                      className="w-full" 
                      variant={plan.highlight ? "primary" : "outline"}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Have more questions?</h2>
          <p className="text-lg text-slate-600 mb-10">
            Our team is here to help you find the right solution for your school's unique needs.
          </p>
          <Link to="/contact">
            <Button size="lg" className="gap-2">
              Contact Sales Team
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
