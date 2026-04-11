"use client";

import { useState, useEffect } from "react";
import { Home, Settings, Menu, MoreHorizontal, Search } from "lucide-react";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeech, setShowSpeech] = useState(false);

  // Fake data (sau này thay bằng API)
  useEffect(() => {
    const fakePosts = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      title: "Tiêu đề bài viết mẫu " + (i + 1),
      content: "Nội dung ngắn của bài viết...",
      image: "https://via.placeholder.com/150",
      createdAt: Date.now() - i * 1000,
    }));

    setPosts(fakePosts);
  }, []);

  useEffect(() => {
    if (showSpeech) {
      const timer = setTimeout(() => setShowSpeech(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [showSpeech]);

  const theme = {
    bg: darkMode ? "bg-black" : "bg-sky-200",
    sidebar: darkMode ? "bg-slate-700" : "bg-indigo-900",
    search: darkMode ? "bg-slate-700" : "bg-blue-500",
    text: darkMode ? "text-white" : "text-black",
    card: darkMode ? "bg-black" : "bg-transparent",
  };

  return (
    <div className={`min-h-screen flex ${theme.bg} ${theme.text}`}>
      {/* Sidebar */}
      <div className={`w-20 flex flex-col items-center py-4 gap-6 ${theme.sidebar}`}>
        <Home className="text-white cursor-pointer" />
        <Menu className="text-white cursor-pointer" />
        <Settings
          className="text-white cursor-pointer"
          onClick={() => setShowSettings(true)}
        />
      </div>

      {/* Main */}
      <div className="flex-1 p-10 relative">
        {/* Search */}
        <div className={`w-2/3 mx-auto rounded-xl px-4 py-3 flex items-center justify-between ${theme.search}`}>
          <span className="font-semibold">Tìm kiếm</span>
          <Search />
        </div>

        {/* Posts */}
        <div className="mt-10 space-y-10">
          {posts.map((post, index) => (
            <div key={post.id} className="flex gap-6 items-start">
              <img
                src={post.image}
                className="w-40 h-40 object-cover border border-black"
              />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-[25px] font-bold max-w-[600px] truncate">
                    {post.title}
                  </h2>

                  <div className="relative">
                    <MoreHorizontal
                      className="cursor-pointer"
                      onClick={() =>
                        setShowMenuIndex(index === showMenuIndex ? null : index)
                      }
                    />

                    {showMenuIndex === index && (
                      <div className="absolute right-0 top-6 bg-white text-black border rounded shadow">
                        <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                          Sửa
                        </div>
                        <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                          Xóa
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[14px] mt-2 max-w-[700px] truncate">
                  {post.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Otter (fixed) */}
        <div className="fixed bottom-10 right-10">
          {showSpeech && (
            <div className="absolute -top-32 right-10 w-48 h-32 border-2 border-blue-400 bg-white"></div>
          )}
          <img
            src="/otter.png"
            className="w-40"
            onClick={() => setShowSpeech(true)}
          />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 text-black">
            <h2 className="text-xl font-bold mb-4">Cài đặt</h2>

            <div className="mb-4">
              <p className="font-semibold mb-2">Giao diện</p>
              <div className="flex gap-2">
                <button
                  className="bg-sky-200 px-3 py-1"
                  onClick={() => setDarkMode(false)}
                >
                  Xanh
                </button>
                <button
                  className="bg-black text-white px-3 py-1"
                  onClick={() => setDarkMode(true)}
                >
                  Đen
                </button>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2">Tài khoản</p>
              <div className="flex gap-2">
                <button className="bg-blue-900 text-black px-3 py-1">
                  Đăng nhập
                </button>
                <button className="bg-red-700 text-white px-3 py-1">
                  Đăng xuất
                </button>
              </div>
            </div>

            <button
              className="mt-4 text-sm underline"
              onClick={() => setShowSettings(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
