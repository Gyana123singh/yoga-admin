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
  Lightbulb,
  LifeBuoy,
  ShoppingBag
} from 'lucide-react';

export const NAVIGATION_SECTIONS = [
  {
    title: 'Overview & Intelligence',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { id: 'users', label: 'Users Directory', icon: Users, path: '/users' },
      { id: 'subscriptions', label: 'Subscriptions & MRR', icon: CreditCard, path: '/subscriptions' },
      { id: 'daily-needs', label: 'Wellness Routine Config', icon: Target, path: '/daily-needs' },
    ]
  },
  {
    title: 'Yoga & Practice Library',
    items: [
      { id: 'store-manager', label: 'Yoga Kits & Store Manager', icon: ShoppingBag, path: '/store-manager' },
      { id: 'yoga-programs', label: 'Yoga Programs', icon: Flower2, path: '/yoga-programs' },
      { id: 'breathing', label: 'Breathing Library', icon: Wind, path: '/breathing' },
      { id: 'exercises', label: 'Exercises Library', icon: Dumbbell, path: '/exercises' },
      { id: 'calendar-manager', label: 'Calendar & Schedule Management', icon: Calendar, path: '/calendar-manager' },
      { id: 'quick-practice', label: 'Quick Practice (2-15m)', icon: Zap, path: '/quick-practice' },
    ]
  },
  {
    title: 'AI & Flow Studio',
    items: [
      { id: 'ai-generator', label: 'AI Practice Generator', icon: Sparkles, path: '/ai-generator' },
      { id: 'ai-coach', label: 'AI Coach & Assistant', icon: Bot, path: '/ai-coach' },
      { id: 'practice-builder', label: 'Practice Drag & Drop', icon: Workflow, path: '/practice-builder' },
      { id: 'flow-builder', label: 'Flow Timeline Builder', icon: Sliders, path: '/flow-builder' },
    ]
  },
  {
    title: 'System & Security',
    items: [
      { id: 'settings', label: 'Platform & Security Settings', icon: Settings, path: '/settings' },
      { id: 'notifications', label: 'Real-Time Notifications', icon: Bell, path: '/notifications' },
      { id: 'support-tickets', label: 'Support & Helpdesk Desk', icon: LifeBuoy, path: '/support-tickets' }
    ]
  }
];
