import {
  LayoutDashboard,
  Users,
  CreditCard,
  Sparkles,
  Flower2,
  BookOpen,
  Dumbbell,
  Wind,
  Brain,
  Moon,
  Zap,
  Bot,
  Calendar,
  Bell,
  HeartPulse,
  Watch,
  Music,
  Mic,
  Target,
  Workflow,
  Compass,
  Briefcase,
  UserCheck,
  GraduationCap,
  BarChart3,
  Trophy,
  MessageSquare,
  Star,
  Users2,
  Video,
  Award,
  ShieldAlert,
  FileText,
  HelpCircle,
  Settings,
  ShieldCheck,
  UserCog,
  History,
  Code2,
  Sliders,
  Plane,
  Building,
  Heart,
  Lightbulb
} from 'lucide-react';

export const NAVIGATION_SECTIONS = [
  {
    title: 'Overview & Intelligence',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', badge: 'Live', badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
      { id: 'users', label: 'Users Directory', icon: Users, path: '/users', badge: '12.4k' },
      { id: 'subscriptions', label: 'Subscriptions & MRR', icon: CreditCard, path: '/subscriptions' },
      { id: 'recommendations', label: 'Today\'s AI Engine', icon: Sparkles, path: '/recommendations', badge: 'v2.4' },
    ]
  },
  {
    title: 'Yoga & Practice Library',
    items: [
      { id: 'yoga-programs', label: 'Yoga Programs', icon: Flower2, path: '/yoga-programs' },
      { id: 'asanas', label: 'Poses (Asanas)', icon: Dumbbell, path: '/asanas', badge: '250+' },
      { id: 'breathing', label: 'Breathing Library', icon: Wind, path: '/breathing' },
      { id: 'meditation', label: 'Meditation Library', icon: Brain, path: '/meditation' },
      { id: 'sleep', label: 'Sleep Programs', icon: Moon, path: '/sleep' },
      { id: 'quick-practice', label: 'Quick Practice (2-15m)', icon: Zap, path: '/quick-practice' },
    ]
  },
  {
    title: 'AI & Flow Studio',
    items: [
      { id: 'ai-generator', label: 'AI Practice Generator', icon: Sparkles, path: '/ai-generator', badge: 'AI' },
      { id: 'ai-coach', label: 'AI Coach & Assistant', icon: Bot, path: '/ai-coach' },
      { id: 'practice-builder', label: 'Practice Drag & Drop', icon: Workflow, path: '/practice-builder' },
      { id: 'flow-builder', label: 'Flow Timeline Builder', icon: Sliders, path: '/flow-builder' },
    ]
  },
  {
    title: 'Special Modes',
    items: [
      { id: 'travel-mode', label: 'Travel Mode', icon: Plane, path: '/travel-mode' },
      { id: 'office-mode', label: 'Office & Desk Yoga', icon: Building, path: '/office-mode' },
      { id: 'senior-mode', label: 'Senior & Gentle', icon: Heart, path: '/senior-mode' },
      { id: 'beginner-mode', label: 'Beginner Pathways', icon: Lightbulb, path: '/beginner-mode' },
    ]
  },
  {
    title: 'Health & Telemetry',
    items: [
      { id: 'health-integration', label: 'Apple & Health Connect', icon: HeartPulse, path: '/health-integration', badge: 'Active' },
      { id: 'smartwatch', label: 'Smartwatch Sync', icon: Watch, path: '/smartwatch' },
      { id: 'smart-calendar', label: 'Smart Calendar', icon: Calendar, path: '/calendar' },
      { id: 'reminders', label: 'Smart Reminders', icon: Bell, path: '/reminders' },
    ]
  },
  {
    title: 'Audio & Content Assets',
    items: [
      { id: 'music-library', label: 'Ambience & Music', icon: Music, path: '/music' },
      { id: 'voice-library', label: 'Voice & Synthesizers', icon: Mic, path: '/voice' },
      { id: 'goals', label: 'Wellness Goals', icon: Target, path: '/goals' },
      { id: 'onboarding', label: 'Onboarding Config', icon: Compass, path: '/onboarding' },
    ]
  },
  {
    title: 'Live & Community',
    items: [
      { id: 'live-classes', label: 'Live Stream Classes', icon: Video, path: '/live-classes', badge: 'Live Now', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      { id: 'experts', label: 'Experts & Teachers', icon: Award, path: '/experts' },
      { id: 'community', label: 'Community & Groups', icon: Users2, path: '/community' },
      { id: 'family', label: 'Family Profiles', icon: UserCheck, path: '/family' },
    ]
  },
  {
    title: 'CMS & Growth',
    items: [
      { id: 'cms', label: 'CMS & Blogs', icon: FileText, path: '/cms' },
      { id: 'feedback', label: 'Reviews & Feedback', icon: Star, path: '/feedback' },
      { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3, path: '/analytics' },
      { id: 'reports', label: 'Wellness Reports', icon: Trophy, path: '/reports' },
    ]
  },
  {
    title: 'System & Security',
    items: [
      { id: 'settings', label: 'Platform Settings', icon: Settings, path: '/settings' },
      { id: 'roles', label: 'Roles & RBAC', icon: ShieldCheck, path: '/roles' },
      { id: 'admins', label: 'Admins & Team', icon: UserCog, path: '/admins' },
      { id: 'activity-logs', label: 'System Audit Logs', icon: History, path: '/activity-logs' },
      { id: 'api-management', label: 'API & AI Keys', icon: Code2, path: '/api-management' },
      { id: 'safety', label: 'Safety Center', icon: ShieldAlert, path: '/safety' },
    ]
  }
];
