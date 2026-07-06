import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { AppShell } from './layout/AppShell';
import { useAuthStore } from './state/auth.store';

const CommandCenterPage = lazy(() => import('./features/dashboard/CommandCenterPage').then((module) => ({ default: module.CommandCenterPage })));
const AnalyticsPage = lazy(() => import('./features/analytics/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const ReportsPage = lazy(() => import('./features/reports/ReportsPage').then((module) => ({ default: module.ReportsPage })));
const AdminPage = lazy(() => import('./features/admin/AdminPage').then((module) => ({ default: module.AdminPage })));

const Protected = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? children : <Navigate to="/login" replace />;
};

const Page = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div className="border border-line bg-white p-4 text-sm text-steel">Loading workspace...</div>}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <Protected>
        <AppShell />
      </Protected>
    ),
    children: [
      { index: true, element: <Page><CommandCenterPage /></Page> },
      { path: 'analytics', element: <Page><AnalyticsPage /></Page> },
      { path: 'reports', element: <Page><ReportsPage /></Page> },
      { path: 'admin', element: <Page><AdminPage /></Page> },
    ],
  },
]);
