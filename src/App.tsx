import { Routes, Route, Navigate } from 'react-router';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Memorials from '@/pages/Memorials';
import MemorialVirginia from '@/pages/MemorialVirginia';
import JohnPetersMemorial from '@/pages/JohnPetersMemorial';
import Themes from '@/pages/Themes';
import FuneralParlours from '@/pages/FuneralParlours';
import BurialSocieties from '@/pages/BurialSocieties';
import Plans from '@/pages/Plans';
import ServiceProviders from '@/pages/ServiceProviders';
import Create from '@/pages/Create';

/**
 * Pattern A (children): Layout renders `{children}` and wraps <Routes>.
 * See react-dev.md "Layout + routing contract" — never mix with <Outlet/>.
 */
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/memorials" element={<Memorials />} />
        <Route path="/memorials/virginia-dadirayi-chiimba" element={<MemorialVirginia />} />
        <Route path="/memorials/john-peters" element={<JohnPetersMemorial />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/funeral-parlours" element={<FuneralParlours />} />
        <Route path="/funeral-parlours/register" element={<Navigate to="/funeral-parlours" replace />} />
        <Route path="/burial-societies" element={<BurialSocieties />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/service-providers" element={<ServiceProviders />} />
        <Route path="/create" element={<Create />} />
        <Route path="*" element={<Memorials />} />
      </Routes>
    </Layout>
  );
}
