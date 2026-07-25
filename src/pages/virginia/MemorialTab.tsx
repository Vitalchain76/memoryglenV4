import OverviewTab from '@/pages/virginia/OverviewTab';
import LifeStoryTab from '@/pages/virginia/LifeStoryTab';
import GalleryTab from '@/pages/virginia/GalleryTab';
import VideosTab from '@/pages/virginia/VideosTab';
import VoiceNotesTab from '@/pages/virginia/VoiceNotesTab';
import GuestbookTab from '@/pages/virginia/GuestbookTab';
import CandlesTab from '@/pages/virginia/CandlesTab';
import SongsSection from '@/pages/virginia/SongsSection';
import FamilyVideoSection from '@/pages/virginia/FamilyVideoSection';

/**
 * TAB 2 — The Memorial.
 *
 * The heart of her page. Every section that previously lived in its own tab is
 * gathered here in order, reachable from the sub-navigation in the tab bar.
 *
 * NOTHING WAS REMOVED in the move to the five-room structure. The seven former
 * tabs — Overview, Life Story, Gallery, Videos, Voice Notes, Guestbook and
 * Digital Candles — all render below, in full, unchanged.
 */
export default function MemorialTab() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section id="vg-overview" className="scroll-mt-36">
        <OverviewTab />
      </section>

      <section id="vg-life-story" className="scroll-mt-36 border-t border-[color:var(--line)] pt-16 md:pt-24">
        <LifeStoryTab />
      </section>

      <section id="vg-songs" className="scroll-mt-36 border-t border-[color:var(--line)] pt-16 md:pt-24">
        <SongsSection />
      </section>

      <section id="vg-gallery" className="scroll-mt-36 border-t border-[color:var(--line)] pt-16 md:pt-24">
        <GalleryTab />
      </section>

      <section id="vg-videos" className="scroll-mt-36 border-t border-[color:var(--line)] pt-16 md:pt-24">
        <VideosTab />
      </section>

      <section id="vg-voice" className="scroll-mt-36 border-t border-[color:var(--line)] pt-16 md:pt-24">
        <VoiceNotesTab />
      </section>

      <section id="vg-her-video" className="scroll-mt-36 border-t border-[color:var(--line)] pt-16 md:pt-24">
        <FamilyVideoSection />
      </section>

      <section id="vg-guestbook" className="scroll-mt-36 border-t border-[color:var(--line)] pt-16 md:pt-24">
        <GuestbookTab />
      </section>

      <section id="vg-candles" className="scroll-mt-36 border-t border-[color:var(--line)] pt-16 md:pt-24">
        <CandlesTab />
      </section>
    </div>
  );
}
