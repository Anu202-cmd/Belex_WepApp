import * as React from "react";
import { Search, MapPin, Briefcase, DollarSign, Filter, ChevronDown, ArrowRight, Star, Bell, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { CAMEROON_LOCATIONS } from "../constants";

export function JobSearch() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("");
  const [selectedCurrency, setSelectedCurrency] = React.useState("FCFA");
  const [selectedJobTypes, setSelectedJobTypes] = React.useState<string[]>([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = React.useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const salaryRangesByCurrency: Record<string, string[]> = {
    "FCFA": ["< 500k", "500k - 1M", "1M - 2M", "2M+"],
    "USD": ["< $30k", "$30k - $60k", "$60k - $100k", "$100k+"],
    "EUR": ["< €30k", "€30k - €60k", "€60k - €100k", "€100k+"],
    "GBP": ["< £30k", "£30k - £60k", "£60k - £100k", "£100k+"],
    "NGN": ["< ₦500k", "₦500k - ₦1M", "₦1M - ₦2M", "₦2M+"],
    "ZAR": ["< R200k", "R200k - R500k", "R500k - R1M", "R1M+"]
  };

  const currentSalaryRanges = salaryRangesByCurrency[selectedCurrency] || salaryRangesByCurrency["FCFA"];
  
  React.useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "jobs");
    });

    return () => unsubscribe();
  }, []);

  const toggleJobType = (type: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSalaryRange = (range: string) => {
    setSelectedSalaryRanges(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = selectedJobTypes.length === 0 || 
      selectedJobTypes.includes(job.type);

    const matchesSalary = selectedSalaryRanges.length === 0 || 
      selectedSalaryRanges.some(range => {
        const jobSalary = job.salary.toLowerCase();
        // Check if the job's salary contains the selected currency
        if (!jobSalary.includes(selectedCurrency.toLowerCase())) return false;
        
        // Simple heuristic matching for the dynamic ranges
        if (range.includes("<")) {
          const val = range.replace(/[^\d]/g, "");
          return jobSalary.includes(val) || parseInt(jobSalary.replace(/[^\d]/g, "")) < parseInt(val) * 1000;
        }
        if (range.includes("+")) {
          const val = range.replace(/[^\d]/g, "");
          return jobSalary.includes(val) || parseInt(jobSalary.replace(/[^\d]/g, "")) > parseInt(val) * 1000;
        }
        
        const parts = range.split(" - ");
        return parts.some(p => jobSalary.includes(p.replace(/[^\d]/g, "")));
      });
    
    return matchesSearch && matchesLocation && matchesType && matchesSalary;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">Find Your Next Teaching Role</h1>
          <p className="text-lg text-slate-600">Explore curated opportunities from the world's most prestigious schools.</p>
        </div>

        {/* Search & Filter Bar */}
        <Card className="mb-12 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="relative md:col-span-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or school"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative md:col-span-3">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {CAMEROON_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <Button 
                variant="outline" 
                className="h-12 w-full justify-between rounded-xl px-4 text-slate-600"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter size={18} className="mr-2" />
                Filters
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </div>
            <div className="md:col-span-2">
              <Button className="h-12 w-full rounded-xl">Search</Button>
            </div>
          </div>
        </Card>

        <AnimatePresence>
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4 backdrop-blur-sm lg:hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="w-full max-w-lg rounded-t-3xl bg-white p-8 shadow-2xl sm:rounded-3xl"
              >
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-slate-900">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                    <X size={24} />
                  </Button>
                </div>
                
                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Currency</h3>
                    <select 
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:outline-none"
                      value={selectedCurrency}
                      onChange={(e) => {
                        setSelectedCurrency(e.target.value);
                        setSelectedSalaryRanges([]);
                      }}
                    >
                      {Object.keys(salaryRangesByCurrency).map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Job Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {["Full-time", "Part-time", "Contract", "Leadership"].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" 
                            checked={selectedJobTypes.includes(type)}
                            onChange={() => toggleJobType(type)}
                          />
                          <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Salary Range ({selectedCurrency})</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {currentSalaryRanges.map((range) => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" 
                            checked={selectedSalaryRanges.includes(range)}
                            onChange={() => toggleSalaryRange(range)}
                          />
                          <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Button className="w-full h-12 rounded-xl" onClick={() => setShowMobileFilters(false)}>
                    Show {filteredJobs.length} results
                  </Button>
                  <Button variant="ghost" className="w-full mt-2 text-slate-400" onClick={() => {
                    setSelectedJobTypes([]);
                    setSelectedSalaryRanges([]);
                    setLocationFilter("");
                    setSearchTerm("");
                    setSelectedCurrency("FCFA");
                    setShowMobileFilters(false);
                  }}>
                    Clear all filters
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Currency</h3>
                <select 
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:outline-none"
                  value={selectedCurrency}
                  onChange={(e) => {
                    setSelectedCurrency(e.target.value);
                    setSelectedSalaryRanges([]);
                  }}
                >
                  {Object.keys(salaryRangesByCurrency).map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Job Type</h3>
                <div className="space-y-3">
                  {["Full-time", "Part-time", "Contract", "Leadership"].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" 
                        checked={selectedJobTypes.includes(type)}
                        onChange={() => toggleJobType(type)}
                      />
                      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Salary Range ({selectedCurrency})</h3>
                <div className="space-y-3">
                  {currentSalaryRanges.map((range) => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" 
                        checked={selectedSalaryRanges.includes(range)}
                        onChange={() => toggleSalaryRange(range)}
                      />
                      <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="w-full text-slate-400 text-xs" 
                onClick={() => {
                  setSelectedJobTypes([]);
                  setSelectedSalaryRanges([]);
                  setLocationFilter("");
                  setSearchTerm("");
                  setSelectedCurrency("FCFA");
                }}
              >
                Clear all filters
              </Button>

              <Card className="bg-primary p-6 text-white">
                <Star className="mb-4 text-accent" size={32} />
                <h4 className="mb-2 font-serif text-lg font-bold">Premium Membership</h4>
                <p className="mb-6 text-xs opacity-80">Get early access to unlisted roles and bespoke career coaching.</p>
                <Link to="/pricing">
                  <Button variant="secondary" size="sm" className="w-full bg-white text-primary">Upgrade Now</Button>
                </Link>
              </Card>
            </div>
          </div>

          {/* Job List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-900">{filteredJobs.length}</span> curated positions</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                Sort by: 
                <button className="font-bold text-slate-900 flex items-center gap-1">
                  Newest
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-500">No jobs found matching your criteria.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/jobs/${job.id}`}>
                      <Card className="group flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 p-2 border border-slate-100">
                          <img src={job.schoolLogo || `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=100`} alt={job.schoolName} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                            <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                              {job.type}
                            </span>
                          </div>
                          <p className="mb-3 text-sm font-medium text-slate-500">{job.schoolName}</p>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <MapPin size={14} className="text-primary" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <DollarSign size={14} className="text-primary" />
                              {job.salary}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Briefcase size={14} className="text-primary" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button variant="outline" className="hidden sm:flex">Save</Button>
                          <Button>Apply Now</Button>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <Button variant="outline" size="sm" className="w-10 p-0">1</Button>
              <Button variant="ghost" size="sm" className="w-10 p-0">2</Button>
              <Button variant="ghost" size="sm" className="w-10 p-0">3</Button>
              <span className="flex items-center px-2 text-slate-400">...</span>
              <Button variant="ghost" size="sm" className="w-10 p-0">12</Button>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <Card className="mt-24 bg-slate-900 p-12 text-center text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-20 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-10 blur-3xl rounded-full -ml-32 -mb-32" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="mb-4 font-serif text-3xl font-bold">Get Curated Matches in Your Inbox</h2>
            <p className="mb-8 text-slate-400">Join 10,000+ educators receiving our weekly digest of the world's most prestigious academic roles.</p>
            <div className="flex justify-center">
              <Link to="/alerts">
                <Button className="h-12 px-12 gap-2 text-lg">
                  <Bell size={20} />
                  Set Up Job Alerts
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
