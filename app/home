'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [posts, setPosts] = useState([
    { id: 1, title: 'Giới thiệu', content: 'Đây là bài giới thiệu về website.', createdAt: Date.now(), pinned: true }
  ])

  const [view, setView] = useState('home')
  const [search, setSearch] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  const [form, setForm] = useState({ title: '', content: '' })
  const [editingId, setEditingId] = useState(null)
  const [currentPost, setCurrentPost] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const [otterText, setOtterText] = useState('')
  const [showOtter, setShowOtter] = useState(false)

  const messages = {
    themeLight: 'Chuyển sang giao diện sáng rồi 🌤️',
    themeDark: 'Đã bật chế độ tối 🌙',
    home: 'Về nhà rồi nè 🦦',
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

  const triggerOtter = (t) => {
    setOtterText(t)
    setShowOtter(true)
  }

  const safeAction = (fn, key, errorKey) => {
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
    .sort((a,b)=> a.pinned ? -1 : b.pinned ? 1 : b.createdAt - a.createdAt)

  const addPost = () => {
    const newPost = { id: editingId || Date.now(), title: form.title.slice(0,200), content: form.content.slice(0,1000), createdAt: Date.now() }
    const pinned = posts.find(p=>p.pinned)
    const others = posts.filter(p=>!p.pinned && p.id !== editingId)

    if (editingId === pinned?.id) {
      setPosts([{ ...pinned, ...newPost, pinned: true }, ...others])
    } else {
      setPosts([pinned, newPost, ...others].filter(Boolean).slice(0,5))
    }

    setForm({ title:'', content:'' })
    setEditingId(null)
    setView('home')
    setShowConfirm(false)
    triggerOtter(messages.postSuccess)
  }

  return (
    <div className={darkMode ? 'bg-neutral-950 text-gray-100' : 'bg-blue-200 text-black'}>
      <div className="flex">

        <div className={darkMode ? 'bg-slate-900 border-r border-slate-700' : 'bg-indigo-900'} style={{ width:80, minHeight:'100vh' }}>
          <div className="flex flex-col items-center gap-10 p-4 text-white text-xl">
            <button onClick={(e)=>{e.stopPropagation();safeAction(()=>setView('home'),'home')}}>🏠</button>
            <button onClick={(e)=>{e.stopPropagation();safeAction(()=>setView('create'),'create')}}>☰</button>
            <button onClick={(e)=>{e.stopPropagation();safeAction(()=>setShowSettings(true),'openSettings')}}>⚙️</button>
          </div>
        </div>

        <div className="flex-1 px-10 py-8">

          {view==='home' && (
            <div className="mb-6">
              <input
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e)=>{ setSearch(e.target.value); if(e.target.value) triggerOtter(messages.searching) }}
                className={darkMode ? 'bg-slate-800 w-full max-w-lg p-3 rounded-full text-gray-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500' : 'bg-blue-400 w-full max-w-lg p-3 rounded-full shadow'}
                style={{ fontSize:18 }}
              />
            </div>
          )}

          {view==='home' && list.map(post => (
            <div key={post.id} className={darkMode ? 'mb-5 p-6 rounded-2xl border border-slate-800 hover:bg-slate-900 transition cursor-pointer' : 'mb-5 p-6 rounded-2xl bg-white shadow hover:shadow-xl transition cursor-pointer'} onClick={()=>safeAction(()=>{ setCurrentPost(post); setView('view') },'openPost')}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-semibold mb-1">{post.title.slice(0,200)}</div>
                  <div className="text-sm opacity-70">{post.content.slice(0,100)}</div>
                </div>

                <div onClick={e=>e.stopPropagation()} className="relative">
                  <button onClick={()=>setOpenMenu(openMenu===post.id?null:post.id)}>⋯</button>

                  {openMenu===post.id && (
                    <div className="absolute right-0 mt-2 bg-white text-black rounded-xl shadow-xl overflow-hidden">
                      <button className="block px-5 py-2 hover:bg-gray-100" onClick={()=>safeAction(()=>{ setForm(post); setEditingId(post.id); setView('create') },'edit')}>Sửa</button>
                      {!post.pinned && <button className="block px-5 py-2 text-red-500 hover:bg-gray-100" onClick={()=>safeAction(()=>setPosts(posts.filter(p=>p.id!==post.id)),'delete')}>Xóa</button>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {view==='create' && (
            <div className="max-w-3xl mx-auto">
              <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Tiêu đề" className="w-full p-4 text-2xl rounded-2xl border mb-4" />
              <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Nội dung" className="w-full h-[400px] p-4 rounded-2xl border" />
              <button onClick={()=>safeAction(()=>setShowConfirm(true),'preparingPost')} className="mt-5 bg-blue-500 text-white px-8 py-3 rounded-2xl">Đăng</button>
            </div>
          )}

          {view==='view' && currentPost && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{currentPost.title}</h1>
              <p className="leading-relaxed text-lg opacity-90">{currentPost.content}</p>
            </div>
          )}

        </div>

        <div style={{ position:'fixed', bottom:10, right:10 }}>
          {showOtter && <div className="bg-white text-black px-4 py-2 rounded-2xl shadow-lg mb-2">{otterText}</div>}
          <img src="/ráicá.JPG" className="w-[140px]" />
        </div>

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60">
            <div className="bg-blue-100 p-6 rounded-2xl relative shadow-2xl w-[360px]">
              <button className="absolute top-3 right-3" onClick={()=>setShowConfirm(false)}>✕</button>
              <p className="mb-5 text-lg font-medium">Bạn xác nhận đăng bài viết?</p>
              <div className="flex gap-3">
                <button onClick={addPost} className="flex-1 bg-blue-200 py-2 rounded-xl">Xác nhận</button>
                <button onClick={()=>setShowConfirm(false)} className="flex-1 bg-red-600 text-white py-2 rounded-xl">Hủy</button>
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60">
            <div className={darkMode ? 'relative bg-slate-900 text-gray-100 w-[420px] p-6 rounded-2xl shadow-2xl border border-slate-700' : 'relative bg-blue-100 text-black w-[420px] p-6 rounded-2xl shadow-2xl'}>
              <button className="absolute top-3 right-3" onClick={()=>safeAction(()=>setShowSettings(false),'closeSettings')}>✕</button>

              <h2 className="text-xl font-semibold mb-5">Cài đặt</h2>

              <div className="mb-6">
                <p className="text-sm mb-2 opacity-70">Giao diện</p>
                <div className="flex gap-3">
                  <button onClick={()=>safeAction(()=>safeAction(()=>setDarkMode(false),'themeLight'),'Đã chuyển sang giao diện xanh 🌿')} className="flex-1 py-2 rounded-xl bg-blue-200">Xanh</button>
                  <button onClick={()=>safeAction(()=>safeAction(()=>setDarkMode(true),'themeDark'),'Chuyển sang chế độ đêm rồi 🌙')} className="flex-1 py-2 rounded-xl bg-slate-800 text-white border border-slate-600">Đen</button>
                </div>
              </div>

              <div>
                <p className="text-sm mb-2 opacity-70">Tài khoản</p>
                {!isLogin ? (
                  <button onClick={()=>safeAction(()=>setIsLogin(true),'login')} className="w-full py-2 rounded-xl bg-blue-900 text-white">Đăng nhập</button>
                ) : (
                  <button onClick={()=>safeAction(()=>setIsLogin(false),'logout')} className="w-full py-2 rounded-xl bg-red-700 text-white">Đăng xuất</button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
