import LegalPage from '@/pages/legal/LegalPage';
import { PRIVACY } from '@/pages/legal/legalContent';

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect, why, and what you can ask us to do about it. Including the part most policies avoid: information about living people who appear on someone else's memorial."
      sections={PRIVACY}
    />
  );
}
