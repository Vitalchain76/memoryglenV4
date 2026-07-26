import LegalPage from '@/pages/legal/LegalPage';
import { TERMS } from '@/pages/legal/legalContent';

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Plain language, because a family reading this has usually had a hard week. If anything here is unclear, write to us and we will explain it properly."
      sections={TERMS}
    />
  );
}
