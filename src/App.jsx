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
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { YogaProgramsPage } from './pages/YogaProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { DailySessionOverviewPage } from './pages/DailySessionOverviewPage';
import { ProgramPlayerPage } from './pages/ProgramPlayerPage';
import { ProgramManagerPage } from './pages/ProgramManagerPage';
import { CalendarPage } from './pages/CalendarPage';
import { SchedulePlayerPage } from './pages/SchedulePlayerPage';
import { CalendarManagerPage } from './pages/CalendarManagerPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationBroadcastPage } from './pages/NotificationBroadcastPage';
import { SupportTicketManagerPage } from './pages/SupportTicketManagerPage';
import { StoreManagerPage } from './pages/StoreManagerPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

// Icons for placeholder pages
import {
  Flower2,
  Brain,
  Moon,
  Zap,
  Bot,
  Sliders,
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
          <Route path="/breathing" element={<BreathingPatternLibraryPage />} />
          <Route path="/breathing-library" element={<BreathingPatternLibraryPage />} />
          <Route path="/exercises" element={<ExerciseLibraryPage />} />
          <Route path="/yoga-programs" element={<ProgramManagerPage />} />
          <Route path="/calendar-manager" element={<CalendarManagerPage />} />
          <Route path="/daily-needs" element={<DailyNeedManagerPage />} />
          <Route path="/quick-practice" element={<QuickPracticeManagerPage />} />
          <Route path="/practice-builder" element={<PracticeBuilderPage />} />
          <Route path="/ai-generator" element={<AIPracticeGeneratorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationBroadcastPage />} />
          <Route path="/support-tickets" element={<SupportTicketManagerPage />} />
          <Route path="/store-manager" element={<StoreManagerPage />} />
          <Route path="/flow-builder" element={<PlaceholderPage title="Flow Timeline Builder" description="Visual animation, transition timing, and pose duration editor." icon={Sliders} category="Studio Studio" />} />

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
