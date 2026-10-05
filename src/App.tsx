import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PlatformAiAssistant } from './components/ai/PlatformAiAssistant';
import { AppShell } from './components/layout/AppShell';
import { WelcomePage } from './components/welcome/WelcomePage';
import { PlatformStoryPage } from './components/story/PlatformStoryPage';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardDispatcher } from './components/pages/DashboardDispatcher';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { BusinessBuilderDashboard } from './components/builder/BusinessBuilderDashboard';
import { SkillPartnerDashboard } from './components/partner/SkillPartnerDashboard';
import { ConnectorDashboard } from './components/connector/ConnectorDashboard';
import { PatronMarketplace } from './components/patron/PatronMarketplace';
import { ProductsPage } from './components/pages/ProductsPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { OrderDetailPage } from './components/pages/OrderDetailPage';
import { BatchesPage } from './components/pages/BatchesPage';
import { PaymentsPage } from './components/pages/PaymentsPage';
import { ImpactPage } from './components/pages/ImpactPage';
import { MessagesPage } from './components/pages/MessagesPage';
import { SettingsPage } from './components/pages/SettingsPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              {/* Entry Flow Step 1: Welcome Overview */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="/welcome" element={<WelcomePage />} />

              {/* Entry Flow Step 2: Authentication */}

              {/* Entry Flow Step 3: Authentication & Demo Persona Selector */}
              <Route path="/login" element={<LoginPage />} />

              {/* Main Application Shell (Steps 4 & beyond) */}
              <Route element={<AppShell />}>
                {/* Unified Role Dashboard Dispatcher */}
                <Route path="/dashboard" element={<DashboardDispatcher />} />

                {/* Role-Specific Workspaces & Dashboards with Strict Route Protection */}
                <Route
                  path="/skill-partner"
                  element={
                    <ProtectedRoute allowedRoles={['partner']}>
                      <SkillPartnerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/business-builder"
                  element={
                    <ProtectedRoute allowedRoles={['builder']}>
                      <BusinessBuilderDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/community-connector"
                  element={
                    <ProtectedRoute allowedRoles={['connector']}>
                      <ConnectorDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/citizen"
                  element={
                    <ProtectedRoute allowedRoles={['citizen', 'patron']}>
                      <PatronMarketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patron"
                  element={<Navigate to="/citizen" replace />}
                />

                {/* Enterprise Shared Resource Modules */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />

                <Route
                  path="/batches"
                  element={
                    <ProtectedRoute allowedRoles={['builder', 'connector', 'partner']}>
                      <BatchesPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute allowedRoles={['builder', 'partner']}>
                      <PaymentsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Catch-all graceful fallback (no broken routes) */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
            {/* Platform-Wide Assistive AI Assistant */}
            <PlatformAiAssistant />
          </BrowserRouter>
        </LanguageProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
