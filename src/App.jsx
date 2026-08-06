import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AdminLayout } from './components/layout/AdminLayout';

// Core Pages
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { RecommendationEnginePage } from './pages/RecommendationEnginePage';
import { AsanaLibraryPage } from './pages/AsanaLibraryPage';
import { BreathingLibraryPage } from './pages/BreathingLibraryPage';
import { AIPracticeGeneratorPage } from './pages/AIPracticeGeneratorPage';
import { PracticeBuilderPage } from './pages/PracticeBuilderPage';
import { HealthIntegrationPage } from './pages/HealthIntegrationPage';
import { DailyNeedManagerPage } from './pages/DailyNeedManagerPage';
import { ActivePracticePlayerPage } from './pages/ActivePracticePlayerPage';
import { QuickPracticeTimerPage } from './pages/QuickPracticeTimerPage';
import { QuickPracticeManagerPage } from './pages/QuickPracticeManagerPage';
import { BreathingPatternLibraryPage } from './pages/BreathingPatternLibraryPage';
import { YogaProgramsPage } from './pages/YogaProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { DailySessionOverviewPage } from './pages/DailySessionOverviewPage';
import { ProgramPlayerPage } from './pages/ProgramPlayerPage';
import { ProgramManagerPage } from './pages/ProgramManagerPage';
import { SettingsPage } from './pages/SettingsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

// Icons for placeholder pages
import {
  Flower2,
  Brain,
  Moon,
  Zap,
  Bot,
  Sliders,
  Plane,
  Building,
  Heart,
  Lightbulb,
  Watch,
  Calendar,
  Bell,
  Music,
  Mic,
  Target,
  Compass,
  Video,
  Award,
  Users2,
  UserCheck,
  FileText,
  Star,
  BarChart3,
  Trophy,
  ShieldCheck,
  UserCog,
  History,
  Code2,
  ShieldAlert
} from 'lucide-react';

import { useApp } from './context/AppContext';
import { AdminLoginPage } from './pages/AdminLoginPage';

function AppContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <Router>
      <AdminLayout>
        <Routes>
          {/* Primary Dedicated Custom Pages */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/recommendations" element={<RecommendationEnginePage />} />
          <Route path="/asanas" element={<AsanaLibraryPage />} />
          <Route path="/breathing" element={<BreathingLibraryPage />} />
          <Route path="/ai-generator" element={<AIPracticeGeneratorPage />} />
          <Route path="/practice-builder" element={<PracticeBuilderPage />} />
          <Route path="/health-integration" element={<HealthIntegrationPage />} />
          <Route path="/daily-needs" element={<DailyNeedManagerPage />} />
          <Route path="/quick-practice" element={<QuickPracticeManagerPage />} />
          <Route path="/onboarding" element={<DailyNeedManagerPage />} />
          <Route path="/practice-player" element={<ActivePracticePlayerPage />} />
          <Route path="/quick-practice-timer" element={<QuickPracticeTimerPage />} />
          <Route path="/breathing-library" element={<BreathingPatternLibraryPage />} />
          <Route path="/breathing" element={<BreathingPatternLibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/yoga-programs" element={<ProgramManagerPage />} />
          <Route path="/yoga-programs-customer" element={<YogaProgramsPage />} />
          <Route path="/yoga-programs/:id" element={<ProgramDetailPage />} />
          <Route path="/yoga-programs/:programId/day/:dayNumber" element={<DailySessionOverviewPage />} />
          <Route path="/yoga-programs/:programId/day/:dayNumber/player" element={<ProgramPlayerPage />} />
          <Route path="/meditation" element={<PlaceholderPage title="Meditation Library" description="Guided mindfulness audio sessions and ambient soundscapes." icon={Brain} category="Mindfulness" />} />
          <Route path="/sleep" element={<PlaceholderPage title="Sleep Programs" description="Yoga Nidra routines, insomnia triggers, and bedtime audio." icon={Moon} category="Sleep" />} />
          <Route path="/ai-coach" element={<PlaceholderPage title="AI Coach & Assistant" description="Personalized AI feedback rules and user chat transcripts." icon={Bot} category="AI Assistant" />} />
          <Route path="/flow-builder" element={<PlaceholderPage title="Flow Timeline Builder" description="Visual animation, transition timing, and pose duration editor." icon={Sliders} category="Studio Studio" />} />
          <Route path="/travel-mode" element={<PlaceholderPage title="Travel Mode" description="Hotel room & airport gate no-equipment practices." icon={Plane} category="Special Modes" />} />
          <Route path="/office-mode" element={<PlaceholderPage title="Office & Desk Yoga" description="Seated spinal twists and ergonomic eye-strain releases." icon={Building} category="Special Modes" />} />
          <Route path="/senior-mode" element={<PlaceholderPage title="Senior & Gentle Mode" description="Chair yoga, joint mobility, and low-impact flows." icon={Heart} category="Special Modes" />} />
          <Route path="/beginner-mode" element={<PlaceholderPage title="Beginner Pathways" description="Step-by-step foundation alignment guides." icon={Lightbulb} category="Special Modes" />} />
          <Route path="/smartwatch" element={<PlaceholderPage title="Smartwatch Sync" description="Apple Watch, Wear OS, and Garmin telemetry diagnostic." icon={Watch} category="Telemetry" />} />
          <Route path="/calendar" element={<PlaceholderPage title="Smart Calendar" description="Scheduled live streams and automated user habit planner." icon={Calendar} category="Scheduling" />} />
          <Route path="/reminders" element={<PlaceholderPage title="Smart Reminders" description="Push notification schedules, SMS, and email alerts." icon={Bell} category="Notifications" />} />
          <Route path="/music" element={<PlaceholderPage title="Ambience & Music Library" description="Binaural beats, nature sounds, rain, and Tibetan bowls." icon={Music} category="Audio Assets" />} />
          <Route path="/voice" element={<PlaceholderPage title="Voice & Synthesizers" description="Voice actor library and neural TTS pitch modulation." icon={Mic} category="Audio Assets" />} />
          <Route path="/goals" element={<PlaceholderPage title="Wellness Goals" description="Target muscle groups, flexibility scores, and stress management." icon={Target} category="Onboarding" />} />
          <Route path="/onboarding" element={<PlaceholderPage title="Onboarding Config" description="Questionnaire logic, mood options, and permission flow." icon={Compass} category="Onboarding" />} />
          <Route path="/live-classes" element={<PlaceholderPage title="Live Stream Classes" description="Real-time masterclass schedule, instructor bookings, and streams." icon={Video} category="Community" />} />
          <Route path="/experts" element={<PlaceholderPage title="Experts & Teachers" description="Certified Yoga gurus, Meditation coaches, and Physiotherapists." icon={Award} category="Instructors" />} />
          <Route path="/community" element={<PlaceholderPage title="Community & Groups" description="User challenge leaderboards, groups, and social feeds." icon={Users2} category="Community" />} />
          <Route path="/family" element={<PlaceholderPage title="Family Profiles" description="Multi-user family account sharing and parental controls." icon={UserCheck} category="Family" />} />
          <Route path="/cms" element={<PlaceholderPage title="CMS & Blogs" description="Landing page copy, articles, and wellness news publishing." icon={FileText} category="CMS" />} />
          <Route path="/feedback" element={<PlaceholderPage title="Reviews & Feedback" description="User App Store ratings, session reviews, and net promoter score." icon={Star} category="Feedback" />} />
          <Route path="/analytics" element={<PlaceholderPage title="Advanced Analytics" description="Cohort retention, funnel drop-off, and device breakdowns." icon={BarChart3} category="Analytics" />} />
          <Route path="/reports" element={<PlaceholderPage title="Wellness Reports" description="Exportable PDF & CSV health progress statements." icon={Trophy} category="Reports" />} />
          <Route path="/roles" element={<PlaceholderPage title="Roles & RBAC" description="Permissions matrix for Admins, Instructors, and Support." icon={ShieldCheck} category="Security" />} />
          <Route path="/admins" element={<PlaceholderPage title="Admins & Team" description="Staff accounts, two-factor auth status, and access keys." icon={UserCog} category="Security" />} />
          <Route path="/activity-logs" element={<PlaceholderPage title="System Audit Logs" description="Real-time security event log and admin actions." icon={History} category="Audit" />} />
          <Route path="/api-management" element={<PlaceholderPage title="API & AI Keys" description="OpenAI, Anthropic, Stripe, and HealthKit tokens." icon={Code2} category="API" />} />
          <Route path="/safety" element={<PlaceholderPage title="Safety Center" description="Medical disclaimers, emergency contraindication rules." icon={ShieldAlert} category="Safety" />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
