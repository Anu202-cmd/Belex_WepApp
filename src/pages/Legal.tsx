import * as React from "react";
import { motion } from "motion/react";
import { Shield, FileText, Cookie } from "lucide-react";

interface LegalProps {
  title: string;
  icon: React.ReactNode;
  content: string;
}

export function Legal({ title, icon, content }: LegalProps) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-light backdrop-blur-sm">
              {icon}
              <span>Legal Information</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-7xl">
              {title}
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300 lg:text-xl">
              Last updated: April 1, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
              {content}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const PrivacyPolicy = () => (
  <Legal 
    title="Privacy Policy" 
    icon={<Shield size={16} />} 
    content={`
At BeleX, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.

1. Information We Collect
We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This includes your name, email address, professional history, and educational background.

2. How We Use Your Information
We use your information to provide and improve our services, match you with relevant job opportunities, and communicate with you about your account and our platform.

3. Information Sharing
We share your profile information with schools and institutions when you apply for a job or when we match you with an opportunity. We do not sell your personal information to third parties.

4. Data Security
We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or modification.

5. Your Rights
You have the right to access, update, or delete your personal information at any time through your account settings.
    `}
  />
);

export const TermsOfService = () => (
  <Legal 
    title="Terms of Service" 
    icon={<FileText size={16} />} 
    content={`
By using BeleX, you agree to comply with and be bound by the following terms and conditions.

1. Acceptance of Terms
By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.

2. User Accounts
You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

3. Professional Conduct
Users must provide accurate information and maintain professional conduct when interacting with other users and institutions on the platform.

4. Intellectual Property
All content and materials on the BeleX platform are the property of BeleX or its licensors and are protected by intellectual property laws.

5. Limitation of Liability
BeleX is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform.
    `}
  />
);

export const CookiePolicy = () => (
  <Legal 
    title="Cookie Policy" 
    icon={<Cookie size={16} />} 
    content={`
This policy explains how BeleX uses cookies and similar technologies to provide and improve our services.

1. What are Cookies?
Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your browsing experience.

2. Types of Cookies We Use
- Essential Cookies: Necessary for the platform to function correctly.
- Performance Cookies: Help us understand how users interact with our platform.
- Functional Cookies: Remember your settings and preferences.

3. Managing Cookies
You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our platform.

4. Updates to this Policy
We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements.
    `}
  />
);
