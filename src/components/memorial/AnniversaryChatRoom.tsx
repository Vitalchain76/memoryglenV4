import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

/**
 * AnniversaryChatRoom — a live gathering room for anniversary dates. Uses
 * Supabase Realtime (postgres_changes) so family across the diaspora can meet
 * and share remembrances in real time. History is loaded on mount; new inserts
 * stream in over a WebSocket channel scoped to this memorial.
 */
export default function AnniversaryChatRoom({ memorialSlug }: { memorialSlug: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supabase) return;

    // Fetch initial chat history.
    supabase
      .from('anniversary_messages')
      .select('*')
      .eq('memorial_slug', memorialSlug)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as ChatMessage[]);
      });

    // Subscribe to real-time incoming messages for this memorial.
    const channel = supabase
      .channel(`anniversary:${memorialSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'anniversary_messages',
          filter: `memorial_slug=eq.${memorialSlug}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        },
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [memorialSlug]);

  // Keep the transcript pinned to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmedSender = sender.trim();
    const trimmedText = text.trim();
    if (!supabase || !trimmedSender || !trimmedText) return;

    const { error } = await supabase.from('anniversary_messages').insert({
      memorial_slug: memorialSlug,
      sender_name: trimmedSender,
      message: trimmedText,
    });

    if (!error) setText('');
  }

  return (
    <div className="card-raised p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-[color:var(--line)] pb-3">
        <MessageSquare size={20} className="text-brass" aria-hidden />
        <h3 className="type-h3 text-body">Anniversary Gathering Room</h3>
      </div>

      <div
        ref={scrollRef}
        className="mb-4 h-64 space-y-3 overflow-y-auto rounded-sm bg-parchment-deep p-3"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-sm border border-[color:var(--line)] bg-surface p-2.5">
            <div className="mb-1 flex justify-between text-xs text-soft">
              <span className="font-semibold text-body">{msg.sender_name}</span>
              <span>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-body">{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-soft">
            No messages yet — be the first to share a remembrance.
          </p>
        )}
      </div>

      <form onSubmit={handleSend} className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          required
          className="w-full rounded-sm border border-[color:var(--line)] bg-surface px-3 py-2 text-sm text-body"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Share a thought or remembrance…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="flex-1 rounded-sm border border-[color:var(--line)] bg-surface px-3 py-2 text-sm text-body"
          />
          <button
            type="submit"
            className="btn btn-evergreen inline-flex min-h-12 items-center gap-1.5 px-4 text-sm"
          >
            <Send size={16} aria-hidden /> Send
          </button>
        </div>
      </form>
    </div>
  );
}
