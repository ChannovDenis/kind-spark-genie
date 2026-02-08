import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBilling from "@/pages/admin/Billing";
import AdminUsers from "@/pages/admin/Users";
import AdminBranding from "@/pages/admin/Branding";
import AdminReports from "@/pages/admin/Reports";

// Expert pages
import ExpertDashboard from "@/pages/expert/Dashboard";
import ExpertSession from "@/pages/expert/Session";
import ExpertSchedule from "@/pages/expert/Schedule";
import ExpertSessions from "@/pages/expert/Sessions";
import ExpertConclusions from "@/pages/expert/Conclusions";
import ExpertEarnings from "@/pages/expert/Earnings";

// Quality pages
import QualityDashboard from "@/pages/quality/Dashboard";
import DialogList from "@/pages/quality/DialogList";
import DialogReview from "@/pages/quality/DialogReview";
import QualityKnowledge from "@/pages/quality/Knowledge";
import QualityTraining from "@/pages/quality/Training";
import WhisperLog from "@/pages/quality/WhisperLog";

// Studio pages
import StudioDashboard from "@/pages/studio/Dashboard";
import StudioTrends from "@/pages/studio/Trends";
import StudioVideoAnalytics from "@/pages/studio/VideoAnalytics";
import StudioScenarios from "@/pages/studio/Scenarios";
import StudioScenarioEditor from "@/pages/studio/ScenarioEditor";
import StudioFeed from "@/pages/studio/Feed";

// Super admin pages
import SuperDashboard from "@/pages/super/Dashboard";
import SuperPricing from "@/pages/super/Pricing";
import SuperSettings from "@/pages/super/Settings";
import SuperTenantDetail from "@/pages/super/TenantDetail";
import SuperCampaigns from "@/pages/super/Campaigns";
import SuperCampaignEditor from "@/pages/super/CampaignEditor";
import SuperExperts from "@/pages/super/Experts";
import SuperAnalytics from "@/pages/super/Analytics";
import SuperMiniApps from "@/pages/super/MiniApps";
import SuperMiniAppConfig from "@/pages/super/MiniAppConfig";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
          <Route path="/admin/billing" element={<MainLayout><AdminBilling /></MainLayout>} />
          <Route path="/admin/users" element={<MainLayout><AdminUsers /></MainLayout>} />
          <Route path="/admin/branding" element={<MainLayout><AdminBranding /></MainLayout>} />
          <Route path="/admin/reports" element={<MainLayout><AdminReports /></MainLayout>} />
          
          {/* Expert routes */}
          <Route path="/expert" element={<MainLayout><ExpertDashboard /></MainLayout>} />
          <Route path="/expert/calendar" element={<MainLayout><ExpertSchedule /></MainLayout>} />
          <Route path="/expert/sessions" element={<MainLayout><ExpertSessions /></MainLayout>} />
          <Route path="/expert/session/:id" element={<MainLayout><ExpertSession /></MainLayout>} />
          <Route path="/expert/conclusions" element={<MainLayout><ExpertConclusions /></MainLayout>} />
          <Route path="/expert/earnings" element={<MainLayout><ExpertEarnings /></MainLayout>} />
          
          {/* Quality routes */}
          <Route path="/quality" element={<MainLayout><QualityDashboard /></MainLayout>} />
          <Route path="/quality/dialogs" element={<MainLayout><DialogList /></MainLayout>} />
          <Route path="/quality/dialogs/:id" element={<MainLayout><DialogReview /></MainLayout>} />
          <Route path="/quality/knowledge" element={<MainLayout><QualityKnowledge /></MainLayout>} />
          <Route path="/quality/training" element={<MainLayout><QualityTraining /></MainLayout>} />
          <Route path="/quality/whisper-log" element={<MainLayout><WhisperLog /></MainLayout>} />
          
          {/* Studio routes */}
          <Route path="/studio" element={<MainLayout><StudioDashboard /></MainLayout>} />
          <Route path="/studio/trends" element={<MainLayout><StudioTrends /></MainLayout>} />
          <Route path="/studio/video/:id" element={<MainLayout><StudioVideoAnalytics /></MainLayout>} />
          <Route path="/studio/scenarios" element={<MainLayout><StudioScenarios /></MainLayout>} />
          <Route path="/studio/scenarios/:id" element={<MainLayout><StudioScenarioEditor /></MainLayout>} />
          <Route path="/studio/feed" element={<MainLayout><StudioFeed /></MainLayout>} />
          
          {/* Super admin routes */}
          <Route path="/super" element={<MainLayout><SuperDashboard /></MainLayout>} />
          <Route path="/super/pricing" element={<MainLayout><SuperPricing /></MainLayout>} />
          <Route path="/super/settings" element={<MainLayout><SuperSettings /></MainLayout>} />
          <Route path="/super/tenants/:id" element={<MainLayout><SuperTenantDetail /></MainLayout>} />
          <Route path="/super/campaigns" element={<MainLayout><SuperCampaigns /></MainLayout>} />
          <Route path="/super/campaigns/new" element={<MainLayout><SuperCampaignEditor /></MainLayout>} />
          <Route path="/super/campaigns/:id" element={<MainLayout><SuperCampaignEditor /></MainLayout>} />
          <Route path="/super/experts" element={<MainLayout><SuperExperts /></MainLayout>} />
          <Route path="/super/mini-apps" element={<MainLayout><SuperMiniApps /></MainLayout>} />
          <Route path="/super/mini-apps/:id/config" element={<MainLayout><SuperMiniAppConfig /></MainLayout>} />
          <Route path="/super/analytics" element={<MainLayout><SuperAnalytics /></MainLayout>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
