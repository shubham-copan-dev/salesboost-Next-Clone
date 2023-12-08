import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useAuthorized from '@/hooks/auth';
import { useAppSelector } from '@/hooks/redux';

import './dark-theme.css';
import './dashboard.css';

const Header = lazy(() => import('../UI/Header'));
const Navigation = lazy(() => import('../UI/Nav'));

function DashboardWrapper() {
  // use hooks
  const isAuthorized = useAuthorized();
  const location = useLocation();

  // global states
  const { fullscreen } = useAppSelector((state) => state.common);

  if (!isAuthorized) return <Navigate to={'/login'} />;
  return (
    <div className={`dashboard-wrapper min-vh-100 ${fullscreen && 'hide-left-navigation'}`}>
      <Suspense>
        {location?.pathname === '/' || fullscreen ? null : <Header />}
        {!fullscreen && <Navigation />}
      </Suspense>
      <Outlet />
      <Toaster />
    </div>
  );
}

export default DashboardWrapper;
