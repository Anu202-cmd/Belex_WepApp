import * as React from "react";
import { motion } from "motion/react";
import { 
  Users, Briefcase, Calendar, CheckCircle, Clock, 
  ArrowRight, Search, MapPin, DollarSign, Star, 
  Bell, Settings, LogOut, User, School, Plus, X, ChevronDown
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db, storage, handleFirestoreError, OperationType } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, doc, updateDoc, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { CAMEROON_LOCATIONS } from "../constants";

export function Dashboard() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role || "teacher";
  const [showPostModal, setShowPostModal] = React.useState(false);
  const [postLoading, setPostLoading] = React.useState(false);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [applications, setApplications] = React.useState<any[]>([]);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = React.useState<any[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [applyingJobId, setApplyingJobId] = React.useState<string | null>(null);
  const [newJob, setNewJob] = React.useState({
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    currency: "FCFA",
    description: "",
    responsibilities: "",
    requirements: "",
    startDate: "August 2026",
    contract: "Permanent"
  });

  React.useEffect(() => {
    if (!user) return;

    let unsubscribe: () => void;

    if (role === "teacher") {
      const q = query(
        collection(db, "applications"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "applications");
      });

      // Fetch recommended jobs
      const jobsQ = query(
        collection(db, "jobs"),
        orderBy("createdAt", "desc"),
        where("schoolId", "!=", ""), // Dummy where to satisfy query if needed, or just limit
        // Note: Firestore doesn't support "not in" easily with other filters, 
        // but we can just fetch recent ones and filter out already applied ones in JS
      );
      // Actually, just a simple query for recent jobs
      const recentJobsQ = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const unsubscribeJobs = onSnapshot(recentJobsQ, (snapshot) => {
        setRecommendedJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 3));
      });

      return () => {
        unsubscribe?.();
        unsubscribeJobs?.();
      };
    } else {
      const q = query(
        collection(db, "jobs"), 
        where("schoolId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "jobs");
      });
    }

    return () => unsubscribe?.();
  }, [user, role]);

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const docRef = doc(db, "applications", applicationId);
      await updateDoc(docRef, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${applicationId}`);
      toast.error("Failed to update status");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleApply = async (job: any) => {
    if (!user || !profile) return;
    
    // Check if already applied
    if (applications.some(a => a.jobId === job.id)) {
      toast.error("You have already applied for this position");
      return;
    }

    setApplyingJobId(job.id);
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
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "applications");
      toast.error("Failed to submit application");
    } finally {
      setApplyingJobId(null);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setPostLoading(true);

    try {
      let logoUrl = "";
      if (logoFile) {
        const storageRef = ref(storage, `logos/${user.uid}/${Date.now()}_${logoFile.name}`);
        const snapshot = await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(snapshot.ref);
      }

      // Convert comma-separated strings to arrays
      const responsibilitiesArray = newJob.responsibilities.split("\n").filter(line => line.trim() !== "");
      const requirementsArray = newJob.requirements.split("\n").filter(line => line.trim() !== "");

      await addDoc(collection(db, "jobs"), {
        ...newJob,
        salary: `${newJob.currency} ${newJob.salary}`,
        responsibilities: responsibilitiesArray.length > 0 ? responsibilitiesArray : null,
        requirements: requirementsArray.length > 0 ? requirementsArray : null,
        schoolId: user.uid,
        schoolName: profile.displayName,
        schoolLogo: logoUrl,
        createdAt: new Date().toISOString() // Using ISO string as per rules helper function
      });
      setShowPostModal(false);
      setNewJob({ 
        title: "", 
        location: "", 
        type: "Full-time", 
        salary: "", 
        currency: "FCFA",
        description: "",
        responsibilities: "",
        requirements: "",
        startDate: "August 2026",
        contract: "Permanent"
      });
      setLogoFile(null);
      toast.success("Job posted successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "jobs");
      toast.error("Failed to post job");
    } finally {
      setPostLoading(false);
    }
  };

  const teacherStats = [
    { label: "Applications Sent", value: applications.length.toString(), icon: Briefcase, color: "bg-blue-100 text-blue-600" },
    { label: "Interviews Scheduled", value: applications.filter(a => a.status === "Interviewing").length.toString(), icon: Calendar, color: "bg-purple-100 text-purple-600" },
    { label: "New Job Matches", value: "8", icon: Star, color: "bg-amber-100 text-amber-600" }
  ];

  const schoolStats = [
    { label: "Active Job Postings", value: jobs.length.toString(), icon: Briefcase, color: "bg-blue-100 text-blue-600" },
    { label: "Total Applicants", value: "48", icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Interviews Scheduled", value: "7", icon: Calendar, color: "bg-amber-100 text-amber-600" }
  ];
  
  const filteredApplications = role === "teacher" 
    ? (statusFilter === "All" ? applications : applications.filter(a => a.status === statusFilter))
    : [];

  const displayList = role === "teacher" ? filteredApplications : jobs;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                {role === "teacher" ? <User size={32} /> : <School size={32} />}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.displayName?.split(" ")[0] || "User"}</h1>
                <p className="text-slate-500">Here's what's happening with your {role === "teacher" ? "applications" : "recruitment"} today.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {role === "school" && (
              <Button className="h-10 gap-2 px-6 shadow-md" onClick={() => setShowPostModal(true)}>
                <Plus size={18} />
                Post a Job
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-10 w-10 p-0">
              <Bell size={18} />
            </Button>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0">
              <Settings size={18} />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {(role === "teacher" ? teacherStats : schoolStats).map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="flex items-center gap-6 p-8">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main List Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  {role === "teacher" ? "Recent Applications" : "Active Job Postings"}
                </h2>
                <div className="flex items-center gap-2">
                  {role === "teacher" && (
                    <div className="flex flex-wrap gap-2">
                      {["All", "Applied", "Interviewing", "Offer Received", "Rejected"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                            statusFilter === status 
                              ? "bg-primary text-white shadow-sm" 
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                  {role === "school" && (
                    <Button size="sm" className="gap-2" onClick={() => setShowPostModal(true)}>
                      <Plus size={16} />
                      Post New Job
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {displayList.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    No {role === "teacher" ? "applications" : "job postings"} found.
                  </div>
                ) : (
                  displayList.map((item, i) => (
                    <div key={item.id || i} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-primary">
                          {role === "teacher" ? <School size={24} /> : <Briefcase size={24} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.role || item.title}</p>
                          <p className="text-xs text-slate-500">{item.schoolName || `${item.applicants || 0} applicants`}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          {role === "teacher" ? (
                            <div className="relative group">
                              <select
                                value={item.status}
                                onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                className={`appearance-none rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none pr-6 ${
                                  item.status === "Interviewing" || item.status === "Active" ? "bg-green-100 text-green-600" : 
                                  item.status === "Rejected" ? "bg-red-100 text-red-600" :
                                  "bg-blue-100 text-blue-600"
                                }`}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offer Received">Offer Received</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current" />
                            </div>
                          ) : (
                            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              item.status === "Active" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                            }`}>
                              {item.status}
                            </span>
                          )}
                          <p className="mt-1 text-[10px] text-slate-400">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently"}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(role === "teacher" ? `/jobs/${item.jobId}` : `/jobs/${item.id}`)}>
                          <ArrowRight size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link to={role === "teacher" ? "/jobs" : "/dashboard"}>
                <Button variant="ghost" className="mt-6 w-full text-slate-500">View All Activity</Button>
              </Link>
            </Card>

            {role === "teacher" && (
              <Card className="p-8">
                <h2 className="mb-8 font-serif text-2xl font-bold text-slate-900">Recommended for You</h2>
                <div className="space-y-4">
                  {recommendedJobs.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">No recommended jobs at the moment.</p>
                  ) : (
                    recommendedJobs.map((job, i) => (
                      <div 
                        key={job.id || i} 
                        className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-all hover:bg-slate-50 hover:shadow-md cursor-pointer group"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Briefcase size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</p>
                            <p className="text-xs text-slate-500">{job.schoolName} • {job.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                          <p className="hidden sm:block text-sm font-bold text-primary">{job.salary}</p>
                          <Button 
                            size="sm" 
                            onClick={() => handleApply(job)}
                            disabled={applyingJobId === job.id || applications.some(a => a.jobId === job.id)}
                          >
                            {applyingJobId === job.id ? "..." : applications.some(a => a.jobId === job.id) ? "Applied" : "Apply"}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <Card className="p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary-light">
                  <img src={profile?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{profile?.displayName || "User"}</p>
                  <p className="text-xs text-slate-500">{role === "teacher" ? "Educator" : "School Administrator"}</p>
                </div>
              </div>
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Profile Completion</span>
                  <span className="font-bold text-primary">85%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[85%] bg-primary" />
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate(role === "teacher" ? "/profile" : "#")}
                >
                  Edit Profile
                </Button>
                {role === "teacher" && (
                  <Link to="/alerts">
                    <Button variant="ghost" className="w-full mt-2 gap-2 text-primary hover:bg-primary-light">
                      <Bell size={18} />
                      Manage Job Alerts
                    </Button>
                  </Link>
                )}
              </div>
            </Card>

            <Card className="bg-slate-900 p-8 text-white">
              <h3 className="mb-4 font-serif text-xl font-bold">BeleX Editorial</h3>
              <p className="mb-6 text-sm text-slate-400">Read our latest guide on navigating international school leadership roles.</p>
              <Link to="/about">
                <Button variant="secondary" className="w-full bg-white text-primary">Read Article</Button>
              </Link>
            </Card>

            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="w-full gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl my-auto"
          >
            <Card className="p-8 max-h-[90vh] overflow-y-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-slate-900">Post a New Job</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPostModal(false)}>
                  <X size={20} />
                </Button>
              </div>
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Job Title</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="e.g. Head of Mathematics"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                    <div className="relative">
                      <select
                        className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light appearance-none"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        required
                      >
                        <option value="">Select Location</option>
                        {CAMEROON_LOCATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Job Type</label>
                    <select
                      className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Salary Range</label>
                    <div className="flex gap-2">
                      <select
                        className="w-24 rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                        value={newJob.currency}
                        onChange={(e) => setNewJob({ ...newJob, currency: e.target.value })}
                      >
                        <option>FCFA</option>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>NGN</option>
                        <option>ZAR</option>
                      </select>
                      <input
                        type="text"
                        className="flex-1 rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                        placeholder="e.g. 500,000 - 800,000"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="e.g. August 2026"
                      value={newJob.startDate}
                      onChange={(e) => setNewJob({ ...newJob, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Contract Type</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="e.g. Permanent"
                      value={newJob.contract}
                      onChange={(e) => setNewJob({ ...newJob, contract: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                    placeholder="Describe the role..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Responsibilities (one per line)</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light text-sm"
                      placeholder="Lead the department..."
                      value={newJob.responsibilities}
                      onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Requirements (one per line)</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light text-sm"
                      placeholder="Relevant degree..."
                      value={newJob.requirements}
                      onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">School Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full rounded-xl border border-slate-200 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  />
                  <p className="mt-1 text-xs text-slate-500">Upload your school's logo to make your posting stand out.</p>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowPostModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={postLoading}>
                    {postLoading ? "Posting..." : "Post Job Opportunity"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
