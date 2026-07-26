import Reveal from '@/components/Reveal';
import { LAST_UPDATED } from '@/pages/legal/legalContent';
import type { LegalSection } from '@/pages/legal/legalContent';

/** Shared layout for Terms and Privacy — one component, two pages. */
export default function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container-content py-16 md:py-24">
      <div className="mx-auto max-w-reading">
        <Reveal>
          <h1 className="type-h2 text-body">{title}</h1>
          <p className="type-meta mt-3 text-soft">Last updated {LAST_UPDATED}</p>
          <p className="type-story mt-6 text-body">{intro}</p>
        </Reveal>

        <div className="mt-14 space-y-12">
          {sections.map((section, i) => (
            <Reveal as="section" key={section.heading} delay={Math.min(i, 4) * 0.04}>
              <h2 className="type-h3 text-body">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((p, pi) => (
                  <p key={pi} className="leading-relaxed text-body">
                    {p}
                  </p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-soft">
                      <span aria-hidden className="mt-2.5 h-1 w-1 flex-none rounded-full bg-brass" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
