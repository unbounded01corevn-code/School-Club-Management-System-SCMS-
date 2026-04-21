import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';

// ID file Google Sheet (Dùng chung hoặc tách riêng tùy ông, ở đây tôi để ID chính của ông)
// Cập nhật ID cho API hiển thị lên Web
const SPREADSHEET_ID = '1T7nZyQVVoT8-pwFgX4XOeXmIiOa4F-xwnyQeIa1z96c';
const DEFAULT_TAB = 'Trang tính1'; 

// Hàm khởi tạo Auth chuẩn - Dùng mail mới và file JSON mới của ông
async function getSheetsClient() {
  const keyPath = path.join(process.cwd(), 'service-account.json');
  
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    // Scope này cho phép cả đọc và ghi dữ liệu
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client as any });
}

// 1. LẤY DỮ LIỆU (GET) - Hiển thị lên Website
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Cho phép lấy từ nhiều Tab khác nhau (Sự kiện hoặc Nhân sự)
    const tabName = searchParams.get('tab') || DEFAULT_TAB; 
    const range = searchParams.get('range') || 'A:Z'; // Mở rộng lấy hết các cột

    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!${range}`, 
    });

    return NextResponse.json(response.data.values || []);
  } catch (error: any) {
    console.error("Lỗi GET GSheets:", error.message);
    return NextResponse.json(
      { error: "Rái Cá không bốc được dữ liệu. Kiểm tra quyền Share cho Mail Service Account nhé!" }, 
      { status: 500 }
    );
  }
}

// 2. ĐĂNG BÀI MỚI (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, tab = DEFAULT_TAB } = body;

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tab}!A:B`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[title, content]] },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Lỗi POST GSheets:", error.message);
    return NextResponse.json({ error: "Lỗi lưu dữ liệu: " + error.message }, { status: 500 });
  }
}

// 3. SỬA NỘI DUNG (PUT)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { oldTitle, newTitle, newContent, tab = DEFAULT_TAB } = body;

    const sheets = await getSheetsClient();

    // Bước 1: Lấy dữ liệu để tìm dòng
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tab}!A:B`,
    });

    const rows = getRes.data.values || [];
    
    // Bước 2: Cập nhật nội dung
    const updatedRows = rows.map(row => {
      if (row[0]?.toString().trim() === oldTitle?.toString().trim()) {
        return [newTitle, newContent];
      }
      return row;
    });

    // Bước 3: Ghi đè lại
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tab}!A:B`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: updatedRows },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Lỗi PUT GSheets:", error.message);
    return NextResponse.json({ error: "Lỗi cập nhật: " + error.message }, { status: 500 });
  }
}
