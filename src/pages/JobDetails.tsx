import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Calendar, Clock, ArrowLeft, Share2, Bookmark, CheckCircle, School, Globe, Users, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { motion } from "motion/react";
import * as React from "react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [applying, setApplying] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState("FCFA");

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

  const convertSalary = (salaryStr: string) => {
    if (!salaryStr || salaryStr.toLowerCase() === "competitive") return "Competitive";
    
    const parts = salaryStr.split(" ");
    if (parts.length < 2) return salaryStr;
    
    const originalCurrency = parts[0].toUpperCase();
    const originalAmountStr = parts.slice(1).join("").replace(/,/g, "");
    const originalAmount = parseFloat(originalAmountStr);
    
    if (isNaN(originalAmount)) return salaryStr;
    
    const rateToEUR = exchangeRates[originalCurrency] || 1;
    const amountInEUR = originalAmount / rateToEUR;
    
    const targetRate = exchangeRates[selectedCurrency] || 1;
    const convertedAmount = Math.round(amountInEUR * targetRate);
    
    const symbol = currencySymbols[selectedCurrency] || "";
    return `${symbol}${convertedAmount.toLocaleString()}`;
  };

  React.useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setJob({ id: docSnap.id, ...data });
          
          // Set initial currency from job data
          if (data.salary) {
            const parts = data.salary.split(" ");
            if (parts.length >= 2 && exchangeRates[parts[0].toUpperCase()]) {
              setSelectedCurrency(parts[0].toUpperCase());
            }
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `jobs/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user || !profile || !job) {
      alert("Please log in to apply for this position.");
      navigate("/login");
      return;
    }

    if (profile.role !== "teacher") {
      alert("Only teachers can apply for jobs.");
      return;
    }

    setApplying(true);
    try {
      await addDoc(collection(db, "applications"), {
        jobId: job.id,
        userId: user.uid,
        schoolName: job.schoolName,
        role: job.title,
        status: "Applied",
        createdAt: new Date().toISOString()
      });
      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "applications");
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Job Not Found</h2>
        <Link to="/jobs">
          <Button>Back to Job Search</Button>
        </Link>
      </div>
    );
  }

  // Fallback for missing fields in dynamic data
  const schoolInfo = {
    name: job.schoolName || "International School",
    type: "International / Private",
    students: "500 - 750",
    founded: "1927",
    website: "www.belex.edu",
    logo: job.schoolLogo || `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200`,
    banner: `https://images.unsplash.com/photo-1523050335102-c3251c17b394?auto=format&fit=crop&q=80&w=1200`
  };

  const responsibilities = job.responsibilities || [
    "Lead and manage the department, ensuring high standards of teaching and learning.",
    "Develop and implement a rigorous and engaging curriculum.",
    "Mentor and support staff in their professional development.",
    "Monitor student progress and implement effective intervention strategies."
  ];

  const requirements = job.requirements || [
    "A relevant degree and recognized teaching qualification.",
    "Experience teaching at the secondary level.",
    "Excellent communication and interpersonal skills.",
    "Passion for innovative pedagogy."
  ];

  const reviews = [
    { id: 1, name: "Sarah Jenkins", rating: 5, comment: "An incredible environment for professional growth.", date: "Jan 2026" },
    { id: 2, name: "David Thompson", rating: 4, comment: "Great facilities and collaborative atmosphere.", date: "Nov 2025" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Banner */}
      <div className="h-64 w-full overflow-hidden">
        <img src={schoolInfo.banner} alt={schoolInfo.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      </div>

      <div className="mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-8 p-8">
              <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-50 p-2 border border-slate-100">
                    <img src={schoolInfo.logo} alt={schoolInfo.name} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <School size={16} className="text-primary" />
                        {schoolInfo.name}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-primary" />
                        {job.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                    <Bookmark size={18} />
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <DollarSign size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary</p>
                  <p className="text-sm font-bold text-slate-900">{convertSalary(job.salary)}</p>
                  <div className="mt-1">
                    <select 
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="bg-transparent text-[10px] font-bold text-primary border-none focus:ring-0 cursor-pointer p-0 h-auto"
                    >
                      {Object.keys(exchangeRates).map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <Calendar size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</p>
                  <p className="text-sm font-bold text-slate-900">{job.startDate || "August 2026"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <Clock size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contract</p>
                  <p className="text-sm font-bold text-slate-900">{job.contract || "Permanent"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <Briefcase size={20} className="mx-auto mb-2 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Type</p>
                  <p className="text-sm font-bold text-slate-900">{job.type}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-bold text-slate-900">The Opportunity</h2>
                  <p className="leading-relaxed text-slate-600">{job.description}</p>
                </div>

                <div>
                  <h2 className="mb-4 font-serif text-2xl font-bold text-slate-900">Key Responsibilities</h2>
                  <ul className="space-y-4">
                    {responsibilities.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                          <CheckCircle size={14} />
                        </div>
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="mb-4 font-serif text-2xl font-bold text-slate-900">Requirements</h2>
                  <ul className="space-y-4">
                    {requirements.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                          <CheckCircle size={14} />
                        </div>
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Back Link */}
            <Link to="/jobs" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              <ArrowLeft size={16} />
              Back to Job Listings
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="sticky top-24 border-2 border-primary bg-white p-8 shadow-xl">
              <h3 className="mb-6 font-serif text-2xl font-bold text-slate-900">Apply for this Position</h3>
              <p className="mb-8 text-sm text-slate-500">Applications for this role are managed exclusively through BeleX to ensure the highest standards of matching.</p>
              <div className="space-y-4">
                <Button className="w-full" size="lg" onClick={handleApply} disabled={applying}>
                  {applying ? "Applying..." : "Apply Now"}
                </Button>
                <Button variant="outline" className="w-full" size="lg">Save for Later</Button>
              </div>
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Verified Opportunity</p>
                  <p className="text-[10px] text-slate-500">This role has been vetted by BeleX</p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="mb-6 font-serif text-xl font-bold text-slate-900">About the School</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2 border border-slate-100">
                    <img src={schoolInfo.logo} alt={schoolInfo.name} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{schoolInfo.name}</p>
                    <p className="text-xs text-slate-500">{schoolInfo.type}</p>
                  </div>
                </div>
                
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users size={16} className="text-primary" />
                      Students
                    </div>
                    <span className="font-bold text-slate-900">{schoolInfo.students}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={16} className="text-primary" />
                      Founded
                    </div>
                    <span className="font-bold text-slate-900">{schoolInfo.founded}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Globe size={16} className="text-primary" />
                      Website
                    </div>
                    <Link to="/about" className="font-bold text-primary hover:underline">{schoolInfo.website}</Link>
                  </div>
                </div>

                <Link to="/schools">
                  <Button variant="outline" className="w-full">View School Profile</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="mb-6 font-serif text-xl font-bold text-slate-900">Employer Reviews</h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-bold text-slate-900">{review.name}</p>
                      <span className="text-[10px] text-slate-400">{review.date}</span>
                    </div>
                    <div className="mb-3 flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < review.rating ? "fill-primary text-primary" : "text-slate-200"} 
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 italic">"{review.comment}"</p>
                  </div>
                ))}
                <Link to="/about">
                  <Button variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary-light">
                    See All 12 Reviews
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
