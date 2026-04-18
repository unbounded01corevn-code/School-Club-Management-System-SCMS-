'use client'; // Phải nằm ở dòng 1

import React, { useState, useEffect } from 'react';
import { Activity, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Đường dẫn lùi 1 cấp để vào folder lib

export default function AdminPage() {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({ ten: '', clb: '', dia_diem: '' });

  const fetchEvents = async () => {
    const { data } = await supabase.schema('clb_nbk_vl').from('su_kien').select('*').order('id', { ascending: false });
    if (data) setEventsList(data);
  };

  useEffect(() => { fetchEvents(); }, []);

  const saveEvent = async () => {
    if (!newEvent.ten) return alert("Nhập tên sự kiện!");
    await supabase.schema('clb_nbk_vl').from('su_kien').insert([{ 
      ten_su_kien: newEvent.ten, 
      clb_chu_tri: newEvent.clb, 
      dia_diem: newEvent.dia_diem 
    }]);
    setNewEvent({ ten: '', clb: '', dia_diem: '' });
    fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    if (confirm("Xóa nhé?")) {
      await supabase.schema('clb_nbk_vl').from('su_kien').delete().eq('id', id);
      fetchEvents();
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-900">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
        <Activity /> NSEC Admin
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="font-bold mb-4 italic text-slate-500">Thêm sự kiện mới</h2>
          <input 
            placeholder="Tên sự kiện..." 
            value={newEvent.ten} 
            onChange={e => setNewEvent({...newEvent, ten: e.target.value})} 
            className="w-full p-3 bg-slate-50 rounded-xl mb-3 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={saveEvent} className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Lưu vào Database
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="font-bold mb-4 italic text-slate-500">Danh sách hiện tại</h2>
          {eventsList.map(ev => (
            <div key={ev.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl mb-2 hover:bg-slate-100">
              <span className="font-medium">{ev.ten_su_kien}</span>
              <button onClick={() => deleteEvent(ev.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={18}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}