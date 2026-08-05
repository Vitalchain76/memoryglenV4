import { Routes, Route, Navigate } from 'react-router';
import { useWhiteLabel } from '@/context/WhiteLabelContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Memorials from '@/pages/Memorials';
import Glens from '@/pages/Glens';
import MemorialVirginia from '@/pages/MemorialVirginia';
import JohnPetersMemorial from '@/pages/JohnPetersMemorial';
import MemorialPage from '@/pages/MemorialPage';
import SignIn from '@/pages/SignIn';
import Account from '@/pages/Account';
import Register from '@/pages/Register';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import { AuthProvider } from '@/lib/AuthProvider';
import Themes from '@/pages/Themes';
import FuneralParlours from '@/pages/FuneralParlours';
import BurialSocieties from '@/pages/BurialSocieties';
import Plans from '@/pages/Plans';
import ServiceProviders from '@/pages/ServiceProviders';
import Create from '@/pages/Create';
import NotFoundPage from '@/pages/NotFoundPage';
import { WhiteLabelProvider } from '@/context/WhiteLabelContext';
import PartnerPortalHeader from '@/components/partner/PartnerPortalHeader';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * LivingGlen has no memorial directory. On livingglen.com, /memorials is
 * redirected to the active /glens directory; on memoryglen.com it renders the
 * memorial directory as before. Keeps a single SPA serving both brands.
 */
function MemorialsRoute() {
  const { isLivingGlen } = useWhiteLabel();
  return isLivingGlen ? <Navigate to="/glens" replace /> : <Memorials />;
}

/**
 * Pattern A (children): Layout renders `{children}` and wraps <Routes>.
 * See react-dev.md "Layout + routing contract" — never mix with <Outlet/>.
 *
 * The whole tree is wrapped in <ErrorBoundary> so that an unhandled render
 * error surfaces a styled fallback (with a reload action) instead of unmounting
 * React and leaving a blank white screen.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <WhiteLabelProvider>
        <PartnerPortalHeader />
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/glens" element={<Glens />} />
              {/* On livingglen.com /memorials redirects to /glens; on
                  memoryglen.com it renders the memorial directory. */}
              <Route path="/memorials" element={<MemorialsRoute />} />
              <Route path="/memorials/virginia-dadirayi-chiimba" element={<MemorialVirginia />} />
              <Route path="/memorials/john-peters" element={<JohnPetersMemorial />} />
              {/* Every other slug falls back to the content-pack dataset.
                  Declared AFTER the two template routes so they always win. */}
              <Route path="/memorials/:slug" element={<MemorialPage />} />
              {/* Accounts. Memorial routes above stay public and ungated. */}
              {/* Auth. Aliases exist because people type /login and /signup, and a
                  404 (or worse, the catch-all) at that moment loses the user. */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/sign-up" element={<Register />} />
              <Route path="/create-account" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/themes" element={<Themes />} />
              <Route path="/funeral-parlours" element={<FuneralParlours />} />
              <Route path="/funeral-parlours/register" element={<Navigate to="/funeral-parlours" replace />} />
              <Route path="/burial-societies" element={<BurialSocieties />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/service-providers" element={<ServiceProviders />} />
              <Route path="/create" element={<Create />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </WhiteLabelProvider>
    </ErrorBoundary>
  );
}
