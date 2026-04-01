import * as React from "react";
import { motion } from "motion/react";
import { Bell, Plus, Trash2, MapPin, Briefcase, DollarSign, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { CAMEROON_LOCATIONS } from "../constants";

interface JobAlert {
  id: string;
  userId: string;
  email: string;
  criteria: {
    location: string;
    jobType: string;
    minSalary: number;
  };
  active: boolean;
  createdAt: any;
}

export function JobAlerts() {
  const { user, profile } = useAuth();
  const [alerts, setAlerts] = React.useState<JobAlert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    location: "",
    jobType: "Full-time",
    minSalary: 0
  });

  React.useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "job_alerts"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobAlert[];
      setAlerts(alertsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "job_alerts");
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      await addDoc(collection(db, "job_alerts"), {
        userId: user.uid,
        email: profile.email,
        criteria: {
          location: formData.location,
          jobType: formData.jobType,
          minSalary: Number(formData.minSalary)
        },
        active: true,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setFormData({ location: "", jobType: "Full-time", minSalary: 0 });
      toast.success("Job alert created successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "job_alerts");
      toast.error("Failed to create job alert");
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteDoc(doc(db, "job_alerts", id));
      toast.success("Job alert deleted");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `job_alerts/${id}`);
      toast.error("Failed to delete job alert");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Job Alerts</h1>
            <p className="text-slate-500">Get notified when new jobs match your preferences.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus size={18} />
            Create New Alert
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-8">
              <h2 className="mb-6 text-xl font-bold text-slate-900">Alert Criteria</h2>
              <form onSubmit={handleCreateAlert} className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    >
                      <option value="">All Locations</option>
                      {CAMEROON_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Job Type</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      value={formData.jobType}
                      onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Min Salary (Annual)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                      value={formData.minSalary}
                      onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-3 flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit">Save Alert</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : alerts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <Bell size={40} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">No alerts set up</h3>
            <p className="mb-8 max-w-xs text-slate-500">Create an alert to get notified when your dream job is posted.</p>
            <Button onClick={() => setShowForm(true)}>Create Your First Alert</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Bell size={24} />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <p className="font-bold text-slate-900">{alert.criteria.location}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {alert.criteria.jobType}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">Min Salary: ${alert.criteria.minSalary.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                      <CheckCircle size={14} />
                      Active
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-primary-light p-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-primary">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="mb-2 font-bold text-slate-900">How Job Alerts Work</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                When a new job is posted that matches your location, job type, and minimum salary criteria, we'll automatically send an email notification to <strong>{profile?.email}</strong>. You can manage or delete your alerts at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
