"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreatorNav } from "@/components/CreatorNav";
import { useRef } from "react";

const DEMO_CONVERSATIONS = [
  { id: "1", name: "Lena Creates", avatar: "L", color: "linear-gradient(135deg, #ec4899, #db2777)", last: "Thanks for subscribing!", time: "2m", unread: 1 },
  { id: "2", name: "DJ Rohit", avatar: "R", color: "linear-gradient(135deg, #7c3aed, #a78bfa)", last: "Check out my latest track", time: "1h", unread: 0 },
  { id: "3", name: "Priya Fitness", avatar: "P", color: "linear-gradient(135deg, #059669, #34d399)", last: "Workout plan ready", time: "3h", unread: 0 },
];

const DEMO_MESSAGES = [
  { id: "1", sender: "them", text: "Hey, welcome! Thanks for subscribing.", time: "2m" },
  { id: "2", sender: "me", text: "Thanks! Loving the content so far ✨", time: "1m" },
];

export default function SubscriberMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("1");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [text, setText] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);

  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, { id: String(Date.now()), sender: "me", text, time: "Just now" }]);
    setText("");
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  const activeConv = DEMO_CONVERSATIONS.find(c => c.id === active)!;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />

      <main className="container" style={{ maxWidth: '900px', padding: '28px 0' }}>
        <div style={{ display: 'flex', height: 'calc(100vh - 52px - 56px)', overflow: 'hidden', border: '0.5px solid var(--sep)', borderRadius: '16px' }}>
          <aside style={{ width: '100%', maxWidth: '300px', borderRight: '0.5px solid var(--sep)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--sep)' }}>
              <input className="input" placeholder="Search messages…" />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {DEMO_CONVERSATIONS.map(c => (
                <button key={c.id} onClick={() => setActive(c.id)} className={`list-row ${active === c.id ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}>
                  <div className="avatar avatar-md" style={{ background: c.color }}>{c.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{c.time}</span>
                    {c.unread > 0 && <span className="badge badge-primary" style={{ padding: '2px 7px', fontSize: '10px' }}>{c.unread}</span>}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--sep)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar avatar-md" style={{ background: activeConv.color }}>{activeConv.avatar}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{activeConv.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--success)' }}>● Online</div>
              </div>
            </div>
            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map(m => (
                <div key={m.id} style={{ maxWidth: '65%', padding: '10px 14px', borderRadius: '18px', fontSize: '14px', alignSelf: m.sender === "me" ? 'flex-end' : 'flex-start', background: m.sender === "me" ? 'linear-gradient(135deg, #db2777, #ec4899)' : 'var(--surface-3)', color: '#fff', borderBottomRightRadius: m.sender === "me" ? '6px' : '18px', borderBottomLeftRadius: m.sender === "me" ? '18px' : '6px' }}>
                  <p>{m.text}</p>
                  <span style={{ fontSize: '10px', display: 'block', marginTop: '4px', opacity: 0.7 }}>{m.time}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 16px', borderTop: '0.5px solid var(--sep)', display: 'flex', gap: '8px' }}>
              <input className="input" placeholder="Write a message…" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} style={{ flex: 1 }} />
              <button onClick={send} className="btn btn-primary btn-sm">Send</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
