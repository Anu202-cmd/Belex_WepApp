import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import nodemailer from "nodemailer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf8"));

// Initialize Firebase
const app_firebase = initializeApp(firebaseConfig);
const db = getFirestore(app_firebase, firebaseConfig.firestoreDatabaseId || "(default)");

// Mock email transporter (logs to console)
const transporter = nodemailer.createTransport({
  streamTransport: true,
  newline: 'unix',
  buffer: true
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API for job alerts (simulated notification trigger)
  // In a real app, this would be a Cloud Function listening to Firestore
  // Here we'll just add a listener to the jobs collection
  console.log("Setting up job alert listener...");
  
  // Track jobs we've already processed to avoid duplicate notifications on server restart
  const processedJobs = new Set<string>();

  onSnapshot(collection(db, "jobs"), async (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        const jobData = change.doc.data();
        const jobId = change.doc.id;

        if (processedJobs.has(jobId)) return;
        processedJobs.add(jobId);

        console.log(`New job posted: ${jobData.title} at ${jobData.schoolName}`);

        // Find matching alerts
        const alertsRef = collection(db, "job_alerts");
        const alertsSnapshot = await getDocs(query(alertsRef, where("active", "==", true)));

        alertsSnapshot.forEach(async (alertDoc) => {
          const alertData = alertDoc.data();
          const criteria = alertData.criteria;

        // Simple matching logic
        const locationMatch = !criteria.location || jobData.location.toLowerCase().includes(criteria.location.toLowerCase());
        const typeMatch = !criteria.jobType || jobData.type === criteria.jobType;
        
        // Extract number from salary string (e.g., "€85k - €105k" -> 85000)
        const extractSalary = (salaryStr: string) => {
          const match = salaryStr.match(/(\d+)/);
          if (!match) return 0;
          let val = parseInt(match[0]);
          if (salaryStr.toLowerCase().includes('k')) val *= 1000;
          return val;
        };

        const jobSalary = extractSalary(jobData.salary || "");
        const salaryMatch = !criteria.minSalary || jobSalary >= criteria.minSalary;

        if (locationMatch && typeMatch && salaryMatch) {
          console.log(`Matching alert found for ${alertData.email}! Sending notification...`);
          
          const appUrl = process.env.APP_URL || "http://localhost:3000";
          
          // Send mock email
          const mailOptions = {
            from: '"BeleX Job Alerts" <alerts@belex.com>',
            to: alertData.email,
            subject: `New Job Match: ${jobData.title} in ${jobData.location}`,
            text: `Hello! A new job matching your criteria has been posted: ${jobData.title} at ${jobData.schoolName}.\n\nView it here: ${appUrl}/jobs/${jobId}`
          };

            const info = await transporter.sendMail(mailOptions);
            console.log("Mock Email Sent:", info.envelope);
            console.log("Email Content Preview:", info.message.toString());
          }
        });
      }
    });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
