export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        School Club Management System
      </h1>

      <p className="mt-4">
        AI quản lý và tìm kiếm thông tin các CLB trong trường
      </p>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Hỏi AI về CLB..."
          className="border p-2 w-96"
        />
      </div>
    </main>
  );
}