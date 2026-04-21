import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import Groq from "groq-sdk";

// 1. Khởi tạo Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// Cập nhật ID mới cho Chatbot
const SHEET_SUKIEN_ID = '1T7nZyQVVoT8-pwFgX4XOeXmIiOa4F-xwnyQeIa1z96c';
const SHEET_AI_ROWS_ID = '179W5w16EszATCLx0VdXIY9v-8bA6-_1zrX7rwh3yCls';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // 2. Google Sheets Auth
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Lấy dữ liệu từ Sheets (Mở rộng Range tới cột Z để không sót dữ liệu)
    const [resSukien, resAiRows] = await Promise.all([
      sheets.spreadsheets.values.get({ 
        spreadsheetId: SHEET_SUKIEN_ID, 
        range: 'Trang tính1!A2:Z' 
      }).catch(() => ({ data: { values: [] } })), 
      sheets.spreadsheets.values.get({ 
        spreadsheetId: SHEET_AI_ROWS_ID, 
        range: 'ai_rows!A:Z' 
      }).catch(() => ({ data: { values: [] } }))
    ]);

    // Xử lý dữ liệu Sự kiện
    const rowsSukien = resSukien.data.values || [];
    const contextSukien = rowsSukien
      .filter(r => r.length > 0 && r[0])
      .map(r => `- Sự kiện: ${r[0]} | Chi tiết: ${r[1] || 'N/A'} | Trạng thái: ${r[4] || 'Đang diễn ra'}`)
      .join('\n');

    // Xử lý dữ liệu Nhân sự (Quét linh hoạt)
    const rowsAiRows = resAiRows.data.values || [];
    const contextMembers = rowsAiRows
      .filter(r => r.length > 0)
      .map((r, idx) => {
        // Log này sẽ hiện ở Terminal VS Code để ông soi cột
        console.log(`Hàng ${idx + 2}:`, r);

        // Cơ chế dự phòng: Nếu r[1] trống thì lấy r[0], chức vụ lấy r[6] hoặc r[5]
        const ten = r[1] || r[0] || "Ẩn danh";
        const team = r[3] || "Chưa phân team";
        const chucVu = r[6] || r[5] || "Thành viên";
        
        return `+ Tên: ${ten.trim()} | Chức vụ: ${chucVu.trim()} | Team: ${team.trim()}`;
      })
      .join('\n');

    // 3. Gọi Groq API với Prompt "ép" đọc dữ liệu
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Bạn là Trợ lý Rái Cá của CLB AI. Khi liệt kê danh sách hoặc dữ liệu từ Google Sheet, hãy luôn sử dụng định dạng Markdown (danh sách có dấu gạch đầu dòng hoặc bảng) để thông tin rõ ràng.

          Ví dụ:
        
          Khi liệt kê danh sách thành viên, hãy trình bày theo định dạng sau cho mỗi người:


          * Họ tên: [Tên]


          - Chức vụ: [Vị trí]


          - Team: [Tên Team]
          (Sau mỗi người, hãy thêm một dòng kẻ ngang --- để tách biệt hoàn toàn)
          Phong cách: Hóm hỉnh, dùng từ ngữ Gen Z, xưng "Rái Cá", gọi người dùng là "ông/bạn".
          
          DỮ LIỆU NỘI BỘ (Hãy đọc thật kỹ danh sách này):
          ---
          NHÂN SỰ:
          ${contextMembers || "Trống"}
          ---
          SỰ KIỆN:
          ${contextSukien || "Trống"}
          ---
          
          YÊU CẦU: 
          1. Trả lời dựa trên dữ liệu trên. 
          2. Nếu người dùng hỏi về ai đó (VD: Dương Tấn Hưng), hãy tìm chính xác tên trong danh sách nhân sự.
          3. Nếu không có trong danh sách, mới được nói là không rõ.`
        },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile", 
      temperature: 0.5, // Giảm thêm để cực kỳ chính xác
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Rái Cá đang bị kẹt trong đám rong biển, đợi tí nhé...";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("LỖI RÁI CÁ:", error);
    return NextResponse.json(
      { reply: "Rái Cá bị sặc nước rồi! 🦦💦 Lỗi: " + error.message }, 
      { status: 500 }
    );
  }
}
