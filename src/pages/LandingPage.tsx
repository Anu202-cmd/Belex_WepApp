import { motion, useScroll, useSpring } from "motion/react";
import { ArrowRight, CheckCircle, Star, Users, School, Sparkles, Search, MapPin, Briefcase, ArrowUp } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Link } from "react-router-dom";
import * as React from "react";

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const opportunities = [
    {
      title: "Head of Mathematics",
      school: "St. Benedict's International School",
      location: "Yaoundé, Centre",
      salary: "FCFA 850k - 1.2M",
      type: "Full-time",
      tags: ["Leadership", "IB Curriculum"],
      image: "https://images.unsplash.com/photo-1523050335102-c3251c17b394?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Primary Years Teacher",
      school: "Douala International School",
      location: "Douala, Littoral",
      salary: "FCFA 650k - 950k",
      type: "Full-time",
      tags: ["EYFS", "International"],
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Director of Music",
      school: "Amity International College",
      location: "Bamenda, North West",
      salary: "Competitive",
      type: "Full-time",
      tags: ["Music", "Boarding"],
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary">
                <Sparkles size={16} />
                <span>Academic Recruitment Reimagined</span>
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900 lg:text-7xl">
                Find Your Next <br />
                <span className="text-primary italic">Teaching Role</span>
              </h1>
              <p className="mb-10 text-lg leading-relaxed text-slate-600 lg:text-xl">
                BeleX is a premium ecosystem connecting world-class educators with prestigious global institutions through curated matching and editorial insight.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    I am a Teacher
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/post-job">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Hire for our School
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary">2.5k+</p>
                  <p className="text-sm text-slate-500">Active Teachers</p>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <p className="text-3xl font-bold text-primary">450+</p>
                  <p className="text-sm text-slate-500">Global Schools</p>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <p className="text-3xl font-bold text-primary">98%</p>
                  <p className="text-sm text-slate-500">Match Rate</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=800"
                  alt="Professional Educator"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 z-20 rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Application Verified</p>
                    <p className="text-xs text-slate-500">Matched with 3 top schools</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 z-0 h-64 w-64 rounded-full bg-primary-light opacity-50 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curated Opportunities */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="mb-4 text-4xl font-bold text-slate-900">Curated Opportunities</h2>
              <p className="text-lg text-slate-600">Hand-picked roles from the world's most prestigious institutions.</p>
            </div>
            <Link to="/jobs">
              <Button variant="outline">View All Positions</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {opportunities.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to="/jobs">
                  <Card className="group h-full overflow-hidden p-0 cursor-pointer hover:shadow-2xl transition-all duration-300 border-slate-100 hover:border-primary/20">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={job.image}
                        alt={job.school}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
                        {job.type}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {job.tags.map(tag => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                      <p className="mb-4 text-sm font-medium text-slate-500">{job.school}</p>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin size={14} />
                          {job.location}
                        </div>
                        <p className="text-sm font-bold text-primary">{job.salary}</p>
                      </div>
                      <div className="mt-6">
                        <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors" variant="outline">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works / Curation */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="bg-primary text-white">
                    <Search size={32} className="mb-4 opacity-80" />
                    <h4 className="mb-2 text-lg font-bold">Deep Search</h4>
                    <p className="text-xs opacity-80">We look beyond the CV to find the perfect cultural fit.</p>
                  </Card>
                  <Card className="bg-slate-50">
                    <Users size={32} className="mb-4 text-primary" />
                    <h4 className="mb-2 text-lg font-bold">Expert Review</h4>
                    <p className="text-xs text-slate-500">Every application is reviewed by our academic board.</p>
                  </Card>
                </div>
                <div className="mt-8 space-y-4">
                  <Card className="bg-slate-50">
                    <School size={32} className="mb-4 text-primary" />
                    <h4 className="mb-2 text-lg font-bold">School Insight</h4>
                    <p className="text-xs text-slate-500">Direct access to school leadership and culture.</p>
                  </Card>
                  <Card className="bg-primary-light text-primary">
                    <Star size={32} className="mb-4" />
                    <h4 className="mb-2 text-lg font-bold">Premium Match</h4>
                    <p className="text-xs opacity-80">Only the top 5% of opportunities make it to our platform.</p>
                  </Card>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="mb-6 text-4xl font-bold text-slate-900">How BeleX Curates</h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                We believe academic recruitment should be as prestigious as the roles themselves. Our editorial approach ensures that every match is built on shared values and long-term vision.
              </p>
              <ul className="space-y-6">
                {[
                  "Rigorous verification of academic credentials",
                  "Cultural alignment assessment for every school",
                  "Bespoke career coaching for senior leadership",
                  "Exclusive access to unlisted opportunities"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                      <CheckCircle size={16} />
                    </div>
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about">
                <Button className="mt-10">Learn More About Our Process</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">Ready to elevate your academic career?</h2>
          <p className="mb-10 text-xl opacity-90">
            Join the elite circle of world-class educators and find your place in the world's most prestigious schools.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/profile">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-slate-100 w-full">
                Create Teacher Profile
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 w-full">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.5 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <ArrowUp size={24} />
      </motion.button>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary origin-left"
        style={{ scaleX }}
      />
    </div>
  );
}
