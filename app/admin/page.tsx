'use client';
import React, { useState, useEffect } from 'react';
import { Home, Edit3, Settings, Activity, Calendar, MapPin, MessageCircle } from 'lucide-react';

// 1. Định nghĩa khuôn mẫu dữ liệu
interface EventData {
  ten_su_kien: string;
  clb_chu_tri: string;
  ngay_dien_ra: string;
  dia_diem: string;
  ghi_chu: string;
}

export default function AdminPage() {
  // State cho danh sách sự kiện
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho Chatbot AI
  const [userInput, setUserInput] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Lấy dữ liệu từ Google Sheets
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/gsheets');
        const data = await res.json();
        if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Hàm gửi tin nhắn cho AI
  const askAI = async () => {
    if (!userInput) return;
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      setAiReply(data.reply);
    } catch (err) {
      setAiReply("Lỗi kết nối rồi ông ơi!");
    }
    setChatLoading(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex font-sans">
      {/* Sidebar */}
      <div className="bg-zinc-900 w-20 flex flex-col items-center py-10 gap-8 text-white sticky top-0 h-screen">
        <Home size={24} className="cursor-pointer opacity-50 hover:opacity-100" />
        <Edit3 size={24} className="cursor-pointer opacity-50 hover:opacity-100" />
        <Settings size={24} className="cursor-pointer opacity-50 hover:opacity-100" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-blue-600 uppercase italic">NSEC SCMS Dashboard</h1>
          <p className="text-slate-400 font-mono text-sm">Kết nối trực tiếp: Google Sheets API 📊</p>
        </header>

        {/* List Events */}
        {loading ? (
          <div className="flex items-center gap-2 animate-pulse text-blue-500 font-bold">
            <Activity className="animate-spin" /> Đang đồng bộ dữ liệu...
          </div>
        ) : (
          <div className="grid gap-4 max-w-4xl">
            {events.map((event, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{event.ten_su_kien}</h3>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {event.clb_chu_tri}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2"><Calendar size={14} /> {event.ngay_dien_ra}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} /> {event.dia_diem}</div>
                  {event.ghi_chu && (
                    <div className="col-span-2 flex items-start gap-2 bg-slate-50 p-3 rounded-xl italic">
                      <MessageCircle size={14} className="mt-1" /> "{event.ghi_chu}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- KHU VỰC CHATBOT AI --- */}
        <div className="mt-12 p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl border border-slate-800 max-w-4xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 italic">
            <span className="bg-blue-600 p-2 rounded-lg not-italic text-sm">🤖</span> Trợ lý Rái Cá
          </h2>
          
          <div className="flex gap-3">
            <input 
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askAI()}
              placeholder="Hỏi AI về lịch sự kiện..."
              className="flex-1 p-4 bg-slate-800 rounded-2xl border border-slate-700 focus:ring-2 focus:ring-blue-500 text-white outline-none transition-all"
            />
            <button 
              onClick={askAI}
              disabled={chatLoading}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-black uppercase italic text-xs transition-all disabled:opacity-50"
            >
              {chatLoading ? "Đang nghĩ..." : "Gửi"}
            </button>
          </div>

          {aiReply && (
            <div className="mt-6 p-5 bg-slate-800/50 rounded-2xl border-l-4 border-blue-500 animate-in fade-in slide-in-from-top-2">
              <p className="text-sm leading-relaxed text-slate-300 font-medium whitespace-pre-wrap">{aiReply}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Mascot */}
      <div className="fixed bottom-10 right-10 text-6xl drop-shadow-lg pointer-events-none">🦦</div>
    </div>
  );
}