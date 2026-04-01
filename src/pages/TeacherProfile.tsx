import * as React from "react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FileText, 
  Upload, 
  Save, 
  CheckCircle2,
  Loader2,
  X
} from "lucide-react";

export function TeacherProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const [newSkill, setNewSkill] = React.useState("");

  React.useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            ...data,
            skills: data.skills || [],
            experience: data.experience || "",
            education: data.education || "",
            cvURL: data.cvURL || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
        displayName: profile.displayName
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `cvs/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { cvURL: url });
      
      setProfile(prev => ({ ...prev, cvURL: url }));
      toast.success("CV uploaded successfully!");
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-serif text-3xl font-bold text-slate-900">Teacher Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your professional information and CV</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>

        <div className="grid gap-8">
          {/* Basic Info */}
          <section className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <Input 
                  value={profile.displayName}
                  onChange={e => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    value={profile.email}
                    disabled
                    className="pl-10 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic">Email cannot be changed</p>
              </div>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Briefcase size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Professional Experience</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Experience Summary</label>
              <Textarea 
                value={profile.experience}
                onChange={e => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Describe your teaching history, roles, and key achievements..."
                className="min-h-[150px] resize-none"
              />
            </div>
          </section>

          {/* Education */}
          <section className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <GraduationCap size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Education</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Educational Background</label>
              <Textarea 
                value={profile.education}
                onChange={e => setProfile(prev => ({ ...prev, education: e.target.value }))}
                placeholder="List your degrees, certifications, and institutions..."
                className="min-h-[120px] resize-none"
              />
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <Wrench size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Skills & Expertise</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill (e.g. Curriculum Design, ESL, STEM)"
                />
                <Button variant="outline" onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span 
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {profile.skills.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No skills added yet</p>
                )}
              </div>
            </div>
          </section>

          {/* CV Upload */}
          <section className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Curriculum Vitae (CV)</h2>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-8 text-center transition-colors hover:border-primary/50">
              {profile.cvURL ? (
                <div className="space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">CV Uploaded</p>
                    <a 
                      href={profile.cvURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Current CV
                    </a>
                  </div>
                  <div className="pt-4">
                    <label className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                      Replace CV
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">No CV uploaded yet</p>
                    <p className="text-sm text-slate-500">Upload your CV in PDF or Word format</p>
                  </div>
                  <div className="pt-4">
                    <label className={`cursor-pointer rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploading ? "Uploading..." : "Upload CV"}
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
