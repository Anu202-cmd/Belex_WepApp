import * as React from "react";
import { motion } from "motion/react";
import { GraduationCap, Users, School, Sparkles, CheckCircle } from "lucide-react";
import { Card } from "../components/ui/Card";

export function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary">
                <GraduationCap size={16} />
                <span>Our Mission</span>
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900 lg:text-7xl">
                Elevating Global <br />
                <span className="text-primary italic">Education</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 lg:text-xl">
                BeleX is a premium ecosystem connecting world-class educators with prestigious global institutions through curated matching and editorial insight.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-4xl font-bold text-slate-900">Our Story</h2>
              <p className="mb-6 text-lg leading-relaxed text-slate-600">
                Founded in 2024, BeleX was born out of a desire to redefine academic recruitment. We recognized that traditional job boards often fail to capture the unique cultural fit and long-term vision required for success in global education.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                Our team of academic experts and recruitment professionals works tirelessly to ensure that every match is built on shared values and a commitment to excellence.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-bold text-primary">2024</p>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Founded</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">450+</p>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Partner Schools</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                alt="Our Team"
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Our Values</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              The principles that guide our curated matching process.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="text-primary" size={32} />,
                title: "Human-Centric",
                description: "We look beyond the CV to find the person behind the credentials."
              },
              {
                icon: <Sparkles className="text-primary" size={32} />,
                title: "Excellence",
                description: "We only partner with the world's most prestigious institutions and educators."
              },
              {
                icon: <CheckCircle className="text-primary" size={32} />,
                title: "Integrity",
                description: "Our curation process is built on transparency, honesty, and mutual respect."
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <div className="mb-6 flex justify-center">{value.icon}</div>
                  <h3 className="mb-4 text-xl font-bold text-slate-900">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
