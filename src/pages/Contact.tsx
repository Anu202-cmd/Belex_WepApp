import * as React from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Users, Briefcase } from "lucide-react";
import { ContactForm } from "../components/ContactForm";

export function Contact() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-light backdrop-blur-sm">
                <Mail size={16} />
                <span>Contact Us</span>
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-7xl">
                Get in <span className="text-primary italic">Touch</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 lg:text-xl">
                Have questions about our curation process or want to partner with us? Our team of academic experts is here to help.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-slate-900">Contact Information</h2>
              <p className="mb-8 text-lg text-slate-600">
                Reach out to us through any of the following channels. We aim to respond to all inquiries within 24 hours.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">Email Address</p>
                    <p className="text-slate-600">hello@belex.edu</p>
                    <p className="text-sm text-slate-500">For general inquiries and support.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">Phone Number</p>
                    <p className="text-slate-600">+44 (0) 20 7123 4567</p>
                    <p className="text-sm text-slate-500">Mon-Fri, 9am-6pm GMT.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">Our Office</p>
                    <p className="text-slate-600">London, United Kingdom</p>
                    <p className="text-sm text-slate-500">123 Academic Way, London, UK.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
