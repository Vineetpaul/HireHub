import {
  Search,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  Plus,
} from "lucide-react";

export const jobSeekersFeatures = [
  {
    icon: Search,
    title: "Smart Job Matching",
    description:
      "Find relevant jobs based on your skills, experience, and preferences.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create a professional resume and showcase your experience clearly.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Connect with recruiters and hiring managers through secure messaging.",
  },
  {
    icon: Award,
    title: "Skill Assessment",
    description:
      "Prove your abilities with skill tests and verified badges.",
  },
  {
    icon: Briefcase,
    title: "Job Tracking",
    description:
      "Track saved jobs, applications, interviews, and offers in one place.",
  },
  {
    icon: Clock,
    title: "Quick Apply",
    description:
      "Apply faster to suitable jobs with your saved profile and resume.",
  },
];

export const employerFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description:
      "Browse qualified candidates and find the right people for your team.",
  },
  {
    icon: Building2,
    title: "Company Profile",
    description:
      "Create a trusted company profile to attract better applicants.",
  },
  {
    icon: Plus,
    title: "Post Jobs",
    description:
      "Publish job openings quickly and manage listings from your dashboard.",
  },
  {
    icon: LayoutDashboard,
    title: "Employer Dashboard",
    description:
      "Manage jobs, candidates, applications, and hiring activity in one place.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track hiring performance, applicant engagement, and job post results.",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description:
      "Review candidate profiles with verified details and trusted information.",
  },
];

export const employerTabs = [
  { id: "post-job", name: "Post Job", icon: Plus },
  { id: "manage-jobs", name: "Manage Jobs", icon: Briefcase },
  { id: "company-profile", name: "Company Profile", icon: Building2 },
];

export const CATEGORIES = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "IT & Software", label: "IT & Software" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Product", label: "Product" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "Human Resources" },
  { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
  { value: "Remote", label: "Remote" },
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];
