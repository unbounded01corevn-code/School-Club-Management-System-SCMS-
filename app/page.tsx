'use client'

import { useState, useEffect } from 'react'

// 1. Định nghĩa Interface để TypeScript hiểu cấu trúc dữ liệu
interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  pinned?: boolean;
}


export default function Page() {
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: 'Chào mừng!', content: 'Chào bạn đã đến với không gian của Rái Cá.', createdAt: Date.now(), pinned: true }
  ])

  const [view, setView] = useState('home')
  const [search, setSearch] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  const [form, setForm] = useState({ title: '', content: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [currentPost, setCurrentPost] = useState<Post | null>(null)
  const [openMenu, setOpenMenu] = useState<number | null>(null)

  const [otterText, setOtterText] = useState('')
  const [showOtter, setShowOtter] = useState(false)

  const [chatInput, setChatInput] = useState('')
  const [aiReply, setAiReply] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)

  const askAI = async () => {
    if (!chatInput.trim()) return
    setIsChatLoading(true)
    setAiReply('')
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput })
      })
      const data = await res.json()
      if (data.reply) {
        setAiReply(data.reply)
        triggerOtter("Rái Cá đã trả lời rồi nè! 🦦")
      } else {
        setAiReply("Lỗi kết nối rồi ông ơi!")
      }
    } catch (e) {
      setAiReply("Rái Cá đang bận đi bơi rồi, thử lại sau nhé!")
    } finally {
      setIsChatLoading(false)
    }
  }

  const messages: Record<string, string> = {
    themeLight: 'Chuyển sang giao diện sáng rồi 🌤️',
    themeDark: 'Đã bật chế độ tối 🌙',
    home: 'Về trang chủ rồi nè 🦦',
    create: 'Viết gì đó hay ho đi nào ✍️',
    openSettings: 'Chỉnh chút cho đẹp hơn nha ⚙️',
    closeSettings: 'Đóng lại rồi nha 😌',
    preparingPost: 'Chuẩn bị đăng bài rồi... 📤',
    postSuccess: 'Bài đã lên sóng! 🚀',
    postFail: 'Hơi lỗi xíu rồi 😥',
    delete: 'Bay màu bài viết rồi 👋',
    edit: 'Sửa cho xịn hơn nhé ✨',
    openPost: 'Đang mở bài cho bạn xem 📖',
    searching: 'Để mình tìm thử xem... 🔍',
    login: 'Chào mừng bạn quay lại 😎',
    logout: 'Tạm biệt nhé, hẹn gặp lại 👋'
  }

  const triggerOtter = (t: string) => {
    setOtterText(t)
    setShowOtter(true)
  }

  const safeAction = (fn: () => void, key?: string, errorKey: string = 'postFail') => {
    try {
      fn()
      if (key && messages[key]) triggerOtter(messages[key])
    } catch (e) {
      triggerOtter(messages[errorKey] || 'Có gì đó sai rồi 😵')
    }
  }

  useEffect(() => {
    if (!showOtter) return
    const t = setTimeout(() => setShowOtter(false), 7000)
    return () => clearTimeout(t)
  }, [showOtter])

  useEffect(() => {
    const h = () => setOpenMenu(null)
    window.addEventListener('click', h)
    return () => window.removeEventListener('click', h)
  }, [])

  const list = posts
    .filter(p => {
      if (!search) return true
      if (p.pinned) return false
      return p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a, b) => {
        if (a.pinned) return -1;
        if (b.pinned) return 1;
        return b.createdAt - a.createdAt;
    })

  const addPost = () => {
    const newPost: Post = { 
      id: editingId || Date.now(), 
      title: form.title.slice(0, 200), 
      content: form.content.slice(0, 1000), 
      createdAt: Date.now() 
    }
    
    const pinned = posts.find(p => p.pinned)
    const others = posts.filter(p => !p.pinned && p.id !== editingId)

    if (editingId !== null && editingId === pinned?.id) {
      setPosts([{ ...pinned, ...newPost, pinned: true }, ...others])
    } else {
      const newList = pinned ? [pinned, newPost, ...others] : [newPost, ...others]
      setPosts(newList.slice(0, 5))
    }

    setForm({ title: '', content: '' })
    setEditingId(null)
    setView('home')
    setShowConfirm(false)
    triggerOtter(messages.postSuccess)
  }

  return (
    <div className={darkMode ? 'bg-neutral-950 text-white min-h-screen' : 'bg-blue-200 text-black min-h-screen'}>
      <div className="flex">
        {/* Sidebar */}
        <div className={darkMode ? 'bg-slate-900 border-r border-slate-700' : 'bg-indigo-900'} style={{ width: 80, minHeight: '100vh' }}>
          <div className="flex flex-col items-center gap-10 p-4 text-white text-xl">
            <button onClick={(e) => { e.stopPropagation(); safeAction(() => setView('home'), 'home') }}>🏠</button>
            <button onClick={(e) => { e.stopPropagation(); safeAction(() => setView('create'), 'create') }}>☰</button>
            <button onClick={(e) => { e.stopPropagation(); safeAction(() => setShowSettings(true), 'openSettings') }}>⚙️</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-10 py-8">
          {view === 'home' && (
            <div className="mb-6 space-y-4">
              <input
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); if (e.target.value) triggerOtter(messages.searching) }}
                className={darkMode ? 'bg-slate-800 w-full max-w-lg p-3 rounded-full text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 placeholder-gray-400' : 'bg-blue-400 w-full max-w-lg p-3 rounded-full shadow placeholder-blue-900 text-black'}
                style={{ fontSize: 18 }}
              />

              <div className={darkMode ? 'bg-slate-900 p-6 rounded-3xl border border-slate-700 max-w-3xl text-white' : 'bg-white p-6 rounded-3xl shadow-lg max-w-3xl text-black'}>
                <h3 className="flex items-center gap-2 font-bold mb-3">🦦 Trợ lý Rái Cá</h3>
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askAI()}
                    placeholder="Hỏi Rái Cá bất cứ điều gì..."
                    className={darkMode ? 'flex-1 bg-slate-800 p-3 rounded-xl border border-slate-600 text-white' : 'flex-1 bg-gray-100 p-3 rounded-xl text-black'}
                  />
                  <button
                    onClick={askAI}
                    disabled={isChatLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isChatLoading ? "Đang nghĩ..." : "Gửi"}
                  </button>
                </div>
                {aiReply && (
                  <div className={darkMode ? "mt-4 p-4 bg-blue-500/20 border-l-4 border-blue-500 rounded-r-xl italic text-sm text-blue-100" : "mt-4 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl italic text-sm text-black"}>
                    {aiReply}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'home' && list.map(post => (
            <div key={post.id} className={darkMode ? 'mb-5 p-6 rounded-2xl border border-slate-800 hover:bg-slate-900 transition cursor-pointer text-white' : 'mb-5 p-6 rounded-2xl bg-white shadow hover:shadow-xl transition cursor-pointer text-black'} onClick={() => safeAction(() => { setCurrentPost(post); setView('view') }, 'openPost')}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-semibold mb-1">{post.title}</div>
                  <div className={darkMode ? "text-sm text-gray-400" : "text-sm opacity-70"}>{post.content.slice(0, 100)}...</div>
                </div>

                <div onClick={e => e.stopPropagation()} className="relative">
                  <button className="p-2" onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}>⋯</button>
                  {openMenu === post.id && (
                    <div className="absolute right-0 mt-2 bg-white text-black rounded-xl shadow-xl overflow-hidden z-10 w-32">
                      <button className="block w-full text-left px-5 py-2 hover:bg-gray-100" onClick={() => safeAction(() => { setForm({ title: post.title, content: post.content }); setEditingId(post.id); setView('create') }, 'edit')}>Sửa</button>
                      {!post.pinned && <button className="block w-full text-left px-5 py-2 text-red-500 hover:bg-gray-100" onClick={() => safeAction(() => setPosts(posts.filter(p => p.id !== post.id)), 'delete')}>Xóa</button>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {view === 'create' && (
            <div className="max-w-3xl mx-auto">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề" className="w-full p-4 text-2xl rounded-2xl border mb-4 text-black focus:ring-2 focus:ring-blue-400 outline-none" />
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Nội dung" className="w-full h-[400px] p-4 rounded-2xl border text-black focus:ring-2 focus:ring-blue-400 outline-none" />
              <div className="flex gap-4 mt-5">
                <button onClick={() => safeAction(() => setShowConfirm(true), 'preparingPost')} className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700">Đăng bài</button>
                <button onClick={() => setView('home')} className="bg-gray-500 text-white px-8 py-3 rounded-2xl">Hủy</button>
              </div>
            </div>
          )}

          {view === 'view' && currentPost && (
            <div className={darkMode ? "max-w-3xl mx-auto bg-slate-900 p-8 rounded-3xl text-white border border-slate-800" : "max-w-3xl mx-auto bg-white/5 p-8 rounded-3xl text-black"}>
              <button onClick={() => setView('home')} className="mb-6 text-blue-500">← Quay lại</button>
              <h1 className="text-4xl font-bold mb-6">{currentPost.title}</h1>
              <p className={darkMode ? "leading-relaxed text-lg text-gray-200 whitespace-pre-wrap" : "leading-relaxed text-lg opacity-90 whitespace-pre-wrap"}>{currentPost.content}</p>
            </div>
          )}
        </div>

        {/* Otter Mascot */}
        <div style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 50 }}>
          {showOtter && <div className="bg-white text-black px-4 py-2 rounded-2xl shadow-lg mb-2 animate-bounce border border-blue-100">{otterText}</div>}
          <img src="/ráicá.JPG" className="w-[140px] rounded-full" alt="mascot" />
        </div>

        {/* Modals */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100]">
            <div className="bg-blue-100 p-6 rounded-3xl relative shadow-2xl w-[360px] text-black">
              <button className="absolute top-4 right-4" onClick={() => setShowConfirm(false)}>✕</button>
              <p className="mb-6 text-lg font-medium">Bạn xác nhận đăng bài viết?</p>
              <div className="flex gap-3">
                <button onClick={addPost} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Xác nhận</button>
                <button onClick={() => setShowConfirm(false)} className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl">Hủy</button>
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100]">
            <div className={darkMode ? 'relative bg-slate-900 text-white w-[420px] p-6 rounded-3xl shadow-2xl border border-slate-700' : 'relative bg-blue-50 text-black w-[420px] p-6 rounded-3xl shadow-2xl'}>
              <button className="absolute top-4 right-4" onClick={() => safeAction(() => setShowSettings(false), 'closeSettings')}>✕</button>
              <h2 className="text-xl font-bold mb-6">Cài đặt</h2>
              
              <div className="mb-8">
                <p className={darkMode ? "text-sm mb-3 font-semibold text-gray-400 uppercase tracking-wider" : "text-sm mb-3 font-semibold opacity-60 uppercase tracking-wider"}>Giao diện</p>
                <div className="flex gap-3">
                  <button onClick={() => safeAction(() => setDarkMode(false), 'themeLight')} className="flex-1 py-3 rounded-2xl bg-white border-2 border-blue-200 text-black font-medium">Sáng 🌤️</button>
                  <button onClick={() => safeAction(() => setDarkMode(true), 'themeDark')} className="flex-1 py-3 rounded-2xl bg-slate-800 text-white border border-slate-600 font-medium">Tối 🌙</button>
                </div>
              </div>

              <div>
                <p className={darkMode ? "text-sm mb-3 font-semibold text-gray-400 uppercase tracking-wider" : "text-sm mb-3 font-semibold opacity-60 uppercase tracking-wider"}>Tài khoản</p>
                {!isLogin ? (
                  <button onClick={() => safeAction(() => setIsLogin(true), 'login')} className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold">Đăng nhập</button>
                ) : (
                  <button onClick={() => safeAction(() => setIsLogin(false), 'logout')} className="w-full py-3 rounded-2xl bg-red-500 text-white font-bold">Đăng xuất</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}