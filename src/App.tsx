import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

const Home = React.lazy(() => import('./pages/Home'));
const CreatePoll = React.lazy(() => import('./pages/CreatePoll'));
const ViewPoll = React.lazy(() => import('./pages/ViewPoll'));
const PollCodes = React.lazy(() => import('./pages/PollCodes'));
const EmbedPollPage = React.lazy(() => import('./pages/EmbedPollPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10000,
    },
  },
});

function MainLayout() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/poll/:id" element={<ViewPoll />} />
              <Route path="/poll/:id/codes" element={<PollCodes />} />
            </Route>
            <Route path="/embed/:id" element={
              <Suspense fallback={<LoadingSpinner />}>
                <EmbedPollPage />
              </Suspense>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}