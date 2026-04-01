import { GraduationCap, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.svg" alt="BeleX" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              The premium ecosystem connecting world-class educators with prestigious global institutions through curated matching and editorial insight.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6">For Teachers</h4>
            <ul className="space-y-4">
              <li><Link to="/jobs" className="text-sm text-slate-500 hover:text-primary transition-colors">Find Jobs</Link></li>
              <li><Link to="/dashboard" className="text-sm text-slate-500 hover:text-primary transition-colors">Teacher Dashboard</Link></li>
              <li><Link to="/about" className="text-sm text-slate-500 hover:text-primary transition-colors">Career Resources</Link></li>
              <li><Link to="/about" className="text-sm text-slate-500 hover:text-primary transition-colors">Salary Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6">For Schools</h4>
            <ul className="space-y-4">
              <li><Link to="/post-job" className="text-sm text-slate-500 hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link to="/dashboard" className="text-sm text-slate-500 hover:text-primary transition-colors">School Dashboard</Link></li>
              <li><Link to="/schools" className="text-sm text-slate-500 hover:text-primary transition-colors">Recruitment Solutions</Link></li>
              <li><Link to="/pricing" className="text-sm text-slate-500 hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Stay Updated</h4>
            <p className="text-sm text-slate-500 mb-4">
              Get the latest curated opportunities and career insights delivered to your inbox.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="w-full rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark transition-all active:scale-95">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © 2026 BeleX Academic Curator. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-xs text-slate-400 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-slate-400 hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="text-xs text-slate-400 hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
