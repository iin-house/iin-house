"use client";

import { useState } from "react";
import { Send, Search } from "lucide-react";

const DEMO_CONVERSATIONS = [
  { id: "1", name: "rahul_21", avatar: "😊", last: "Hey, loved the new post!", time: "2m ago", unread: 2 },
  { id: "2", name: "priya_fan", avatar: "😎", last: "When's the next stream?", time: "1h ago", unread: 0 },
];

const DEMO_MESSAGES = [
  { id: "1", sender: "them", text: "Hey, loved the new post!", time: "2m ago" },
  { id: "2", sender: "me", text: "Thanks so much! Means a lot.", time: "1m ago" },
  { id: "3", sender: "them", text: "Do you do custom requests?", time: "Just now" },
];

function EmptyMessagesState() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '300px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>💬</div>
        <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '6px' }}>No messages yet</p>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5 }}>
          Engage your subscribers to start conversations.
        </p>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, { id: String(Date.now()), sender: "me", text, time: "Just now" }]);
    setText("");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-dark-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <p className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">iin house</p>
        </div>
      </header>
      <main className="max-w-5xl mx-auto">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Conversations list */}
          <aside className="w-72 border-r border-dark-300 hidden md:block">
            <div className="p-3 border-b border-dark-300">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-dark-500" />
                <input className="input pl-8 text-sm" placeholder="Search conversations…" />
              </div>
            </div>
            {DEMO_CONVERSATIONS.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>💬</div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>No messages yet</p>
                <p style={{ fontSize: '12px', marginTop: '6px' }}>Your conversations will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-dark-300">
                {DEMO_CONVERSATIONS.map(c => (
                  <button key={c.id} className="w-full flex items-center gap-3 p-3 hover:bg-dark-200 transition-colors text-left">
                    <span className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center text-lg">{c.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{c.name}</p>
                        <span className="text-xs text-dark-500">{c.time}</span>
                      </div>
                      <p className="text-xs text-dark-500 truncate">{c.last}</p>
                    </div>
                    {c.unread > 0 && <span className="badge badge-primary">{c.unread}</span>}
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* Chat area or empty state */}
          {DEMO_CONVERSATIONS.length === 0 ? (
            <EmptyMessagesState />
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${m.sender === "me" ? "bg-primary-600 text-white" : "bg-dark-200 text-white"}`}>
                      <p>{m.text}</p>
                      <span className={`text-xs mt-1 block ${m.sender === "me" ? "text-primary-200" : "text-dark-500"}`}>{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-dark-300">
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Write a message…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                  />
                  <button onClick={send} className="btn btn-primary"><Send size={18} /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
