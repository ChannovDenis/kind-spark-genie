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
import { ExpertSchedule, ExpertSessions, ExpertConclusions } from "@/pages/PlaceholderPages";

// Quality pages
import QualityDashboard from "@/pages/quality/Dashboard";
import { QualityDialogs, QualityKnowledge, QualityTraining } from "@/pages/PlaceholderPages";

// Super admin pages
import SuperDashboard from "@/pages/super/Dashboard";
import { SuperPricing, SuperSettings, SuperBuilder } from "@/pages/PlaceholderPages";

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
          <Route path="/expert/schedule" element={<MainLayout><ExpertSchedule /></MainLayout>} />
          <Route path="/expert/sessions" element={<MainLayout><ExpertSessions /></MainLayout>} />
          <Route path="/expert/session/:id" element={<MainLayout><ExpertSession /></MainLayout>} />
          <Route path="/expert/conclusions" element={<MainLayout><ExpertConclusions /></MainLayout>} />
          
          {/* Quality routes */}
          <Route path="/quality" element={<MainLayout><QualityDashboard /></MainLayout>} />
          <Route path="/quality/dialogs" element={<MainLayout><QualityDialogs /></MainLayout>} />
          <Route path="/quality/knowledge" element={<MainLayout><QualityKnowledge /></MainLayout>} />
          <Route path="/quality/training" element={<MainLayout><QualityTraining /></MainLayout>} />
          
          {/* Super admin routes */}
          <Route path="/super" element={<MainLayout><SuperDashboard /></MainLayout>} />
          <Route path="/super/pricing" element={<MainLayout><SuperPricing /></MainLayout>} />
          <Route path="/super/settings" element={<MainLayout><SuperSettings /></MainLayout>} />
          <Route path="/super/builder" element={<MainLayout><SuperBuilder /></MainLayout>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
