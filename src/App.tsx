import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";

// Auth pages
import Auth from "@/pages/Auth";
import Unauthorized from "@/pages/Unauthorized";

// ДЧ — Admin pages
import AdminDashboard from "@/pages/dch/admin/Dashboard";
import AdminBilling from "@/pages/dch/admin/Billing";
import AdminUsers from "@/pages/dch/admin/Users";
import AdminBranding from "@/pages/dch/admin/Branding";
import AdminReports from "@/pages/dch/admin/Reports";

// ВХ — Expert pages
import ExpertDashboard from "@/pages/vh/expert/Dashboard";
import ExpertSession from "@/pages/vh/expert/Session";
import ExpertSchedule from "@/pages/vh/expert/Schedule";
import ExpertSessions from "@/pages/vh/expert/Sessions";
import ExpertConclusions from "@/pages/vh/expert/Conclusions";
import ExpertEarnings from "@/pages/vh/expert/Earnings";

// ВХ — Quality pages
import QualityDashboard from "@/pages/vh/quality/Dashboard";
import DialogList from "@/pages/vh/quality/DialogList";
import DialogReview from "@/pages/vh/quality/DialogReview";
import QualityKnowledge from "@/pages/vh/quality/Knowledge";
import QualityTraining from "@/pages/vh/quality/Training";
import WhisperLog from "@/pages/vh/quality/WhisperLog";

// ДЧ — Studio pages
import StudioDashboard from "@/pages/dch/studio/Dashboard";
import StudioTrends from "@/pages/dch/studio/Trends";
import StudioVideoAnalytics from "@/pages/dch/studio/VideoAnalytics";
import StudioScenarios from "@/pages/dch/studio/Scenarios";
import StudioScenarioEditor from "@/pages/dch/studio/ScenarioEditor";
import StudioFeed from "@/pages/dch/studio/Feed";

// ДЧ — Super admin pages
import SuperDashboard from "@/pages/dch/super/Dashboard";
import SuperPricing from "@/pages/dch/super/Pricing";
import SuperSettings from "@/pages/dch/super/Settings";
import SuperTenantDetail from "@/pages/dch/super/TenantDetail";
import SuperCampaigns from "@/pages/dch/super/Campaigns";
import SuperCampaignEditor from "@/pages/dch/super/CampaignEditor";
import SuperExperts from "@/pages/dch/super/Experts";
import SuperAnalytics from "@/pages/dch/super/Analytics";
import SuperMiniApps from "@/pages/dch/super/MiniApps";
import SuperMiniAppConfig from "@/pages/dch/super/MiniAppConfig";

// ДЧ — Project dashboard
import ProjectDashboard from "@/pages/dch/admin/ProjectDashboard";
import Backlog from "@/pages/dch/admin/Backlog";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Redirect root to expert dashboard (most common role for new users) */}
            <Route path="/" element={<Navigate to="/expert" replace />} />
            
            {/* Admin routes - require partner_admin or higher */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><AdminDashboard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/billing" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><AdminBilling /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><AdminUsers /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/branding" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><AdminBranding /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><AdminReports /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Project dashboard - super_admin only */}
            <Route path="/project-dashboard" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><ProjectDashboard /></MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/project/backlog" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><Backlog /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Expert routes - require expert role or higher */}
            <Route path="/expert" element={
              <ProtectedRoute allowedRoles={['expert', 'partner_admin', 'super_admin']}>
                <MainLayout><ExpertDashboard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/expert/calendar" element={
              <ProtectedRoute allowedRoles={['expert', 'partner_admin', 'super_admin']}>
                <MainLayout><ExpertSchedule /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/expert/sessions" element={
              <ProtectedRoute allowedRoles={['expert', 'partner_admin', 'super_admin']}>
                <MainLayout><ExpertSessions /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/expert/session/:id" element={
              <ProtectedRoute allowedRoles={['expert', 'partner_admin', 'super_admin']}>
                <MainLayout><ExpertSession /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/expert/conclusions" element={
              <ProtectedRoute allowedRoles={['expert', 'partner_admin', 'super_admin']}>
                <MainLayout><ExpertConclusions /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/expert/earnings" element={
              <ProtectedRoute allowedRoles={['expert', 'partner_admin', 'super_admin']}>
                <MainLayout><ExpertEarnings /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Quality routes - require quality_manager or higher */}
            <Route path="/quality" element={
              <ProtectedRoute allowedRoles={['quality_manager', 'partner_admin', 'super_admin']}>
                <MainLayout><QualityDashboard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/quality/dialogs" element={
              <ProtectedRoute allowedRoles={['quality_manager', 'partner_admin', 'super_admin']}>
                <MainLayout><DialogList /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/quality/dialogs/:id" element={
              <ProtectedRoute allowedRoles={['quality_manager', 'partner_admin', 'super_admin']}>
                <MainLayout><DialogReview /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/quality/knowledge" element={
              <ProtectedRoute allowedRoles={['quality_manager', 'partner_admin', 'super_admin']}>
                <MainLayout><QualityKnowledge /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/quality/training" element={
              <ProtectedRoute allowedRoles={['quality_manager', 'partner_admin', 'super_admin']}>
                <MainLayout><QualityTraining /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/quality/whisper-log" element={
              <ProtectedRoute allowedRoles={['quality_manager', 'partner_admin', 'super_admin']}>
                <MainLayout><WhisperLog /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Studio routes - require partner_admin or higher */}
            <Route path="/studio" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><StudioDashboard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/studio/trends" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><StudioTrends /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/studio/video/:id" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><StudioVideoAnalytics /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/studio/scenarios" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><StudioScenarios /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/studio/scenarios/:id" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><StudioScenarioEditor /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/studio/feed" element={
              <ProtectedRoute allowedRoles={['partner_admin', 'super_admin']}>
                <MainLayout><StudioFeed /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Super admin routes - require super_admin only */}
            <Route path="/super" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperDashboard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/pricing" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperPricing /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/settings" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperSettings /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/tenants/:id" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperTenantDetail /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/campaigns" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperCampaigns /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/campaigns/new" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperCampaignEditor /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/campaigns/:id" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperCampaignEditor /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/experts" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperExperts /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/mini-apps" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperMiniApps /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/mini-apps/:id/config" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperMiniAppConfig /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/super/analytics" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <MainLayout><SuperAnalytics /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
