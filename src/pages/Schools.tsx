import * as React from "react";
import { motion } from "motion/react";
import { School, CheckCircle, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Link } from "react-router-dom";

export function Schools() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-light backdrop-blur-sm">
                <School size={16} />
                <span>For Global Institutions</span>
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-7xl">
                Hire the World's Best <br />
                <span className="text-primary italic">Educators</span>
              </h1>
              <p className="mb-10 text-lg leading-relaxed text-slate-300 lg:text-xl">
                BeleX connects prestigious schools with verified, high-caliber teaching talent through a curated matching process.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Register Your School
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800"
                alt="School Campus"
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Why Partner with BeleX?</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              We go beyond traditional recruitment to ensure long-term success for your institution.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="text-primary" size={32} />,
                title: "Verified Talent",
                description: "Every candidate undergoes a rigorous multi-stage verification process by our academic board."
              },
              {
                icon: <Sparkles className="text-primary" size={32} />,
                title: "Curated Matching",
                description: "Our proprietary algorithm matches educators based on cultural fit, values, and long-term vision."
              },
              {
                icon: <CheckCircle className="text-primary" size={32} />,
                title: "Seamless Integration",
                description: "From initial posting to final placement, we manage the entire recruitment lifecycle."
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <div className="mb-6 flex justify-center">{benefit.icon}</div>
                  <h3 className="mb-4 text-xl font-bold text-slate-900">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
