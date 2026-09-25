"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreatorNav } from "@/components/CreatorNav";
import toast from "react-hot-toast";

type Conversation = {
  otherId: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
};

type Message = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const userId = (session?.user as any)?.id;

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated" || !userId) return;

    fetch("/api/conversations")
      .then(r => r.ok ? r.json() : { conversations: [] })
      .then((data: { conversations?: Conversation[] }) => {
        setConversations(data.conversations ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status, router, userId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeId || !userId) return;
    fetch(`/api/messages?receiverId=${activeId}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Message[]) => {
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => { setMessages([]); });
  }, [activeId, userId]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!text.trim() || !activeId || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: activeId, body: text.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send");
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      setConversations(prev => prev.map(c => c.otherId === activeId ? { ...c, lastMessage: text.trim(), time: "Just now", unread: 0 } : c));
      setText("");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to send");
    } finally {
      setSending(false);
    }
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find(c => c.otherId === activeId);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '1000px', padding: '28px 0' }}>
        <div style={{ display: 'flex', height: 'calc(100vh - 52px - 56px)', overflow: 'hidden', border: '0.5px solid var(--sep)', borderRadius: '16px' }}>
          {/* Conversations sidebar */}
          <aside style={{ width: '320px', borderRight: '0.5px solid var(--sep)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--sep)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Messages</h2>
              <input
                className="input"
                placeholder="Search conversations…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ fontSize: '13px', padding: '8px 12px' }}
              />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConversations.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>No conversations yet</p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>Messages from subscribers will appear here.</p>
                </div>
              ) : (
                filteredConversations.map(c => (
                  <button
                    key={c.otherId}
                    onClick={() => setActiveId(c.otherId)}
                    className={`list-row ${activeId === c.otherId ? 'active' : ''}`}
                    style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', padding: '12px 16px', cursor: 'pointer' }}
                  >
                    <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #9d174d, #be185d)', flexShrink: 0 }}>{c.name[0]?.toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)', flexShrink: 0 }}>{c.time}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{c.lastMessage}</div>
                    </div>
                    {c.unread > 0 && <span className="badge badge-primary" style={{ padding: '2px 7px', fontSize: '10px', flexShrink: 0 }}>{c.unread}</span>}
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Chat area */}
          {!activeId || !activeConv ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', maxWidth: '300px' }}>
                <div style={{ fontSize: '56px', marginBottom: 16 }}>💬</div>
                <p style={{ fontSize: 15, fontWeight: 500 }}>Select a conversation</p>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>Choose a subscriber from the list to start messaging.</p>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              {/* Chat header */}
              <div style={{ padding: '12px 20px', borderBottom: '0.5px solid var(--sep)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #9d174d, #be185d)' }}>{activeConv.name[0]?.toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{activeConv.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--success)' }}>● Online</div>
                </div>
              </div>

              {/* Messages */}
              <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                    <p style={{ fontSize: 13 }}>No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map(m => {
                    const isMe = m.senderId === userId;
                    return (
                      <div key={m.id} style={{
                        maxWidth: '65%', padding: '10px 14px', borderRadius: 18, fontSize: 14, alignSelf: isMe ? 'flex-end' : 'flex-start',
                        background: isMe ? 'linear-gradient(135deg, #db2777, #ec4899)' : 'var(--surface-3)',
                        color: '#fff',
                        borderBottomRightRadius: isMe ? 6 : 18,
                        borderBottomLeftRadius: isMe ? 18 : 6,
                      }}>
                        <p>{m.body}</p>
                        <span style={{ fontSize: 10, display: 'block', marginTop: 4, opacity: 0.7 }}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Typing indicator placeholder */}
                <div style={{ alignSelf: 'flex-start', maxWidth: '65%', padding: '10px 14px', borderRadius: 18, background: 'var(--surface-3)', color: 'var(--text-3)', fontSize: 12 }}>
                  <span style={{ display: 'inline-flex', gap: 4 }}>
                    <span style={{ animation: 'bounce 1.4s infinite ease-in-out' }}>.</span>
                    <span style={{ animation: 'bounce 1.4s 0.2s infinite ease-in-out' }}>.</span>
                    <span style={{ animation: 'bounce 1.4s 0.4s infinite ease-in-out' }}>.</span>
                  </span>
                </div>
              </div>

              {/* Input */}
              <div style={{ padding: '10px 16px', borderTop: '0.5px solid var(--sep)', display: 'flex', gap: 8, flexShrink: 0 }}>
                <input
                  className="input"
                  placeholder="Write a message…"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                  style={{ flex: 1 }}
                />
                <button onClick={send} className="btn btn-primary btn-sm" disabled={sending || !text.trim()}>
                  {sending ? "…" : "Send"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
