import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // 1. Kết nối nhanh tới Google Sheets
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Chỉ lấy đúng 2 cột A (Tiêu đề) và B (Nội dung)
    const spreadsheetId = '1irhk8wW5W8Mwtq9nt0p4CCwvWC2-J3aRXjySVJUxXjE';
    const range = 'Sheet1!A2:B'; 

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    
    // Gom dữ liệu thành một đoạn văn bản ngắn gọn để AI hiểu
    const context = rows 
      ? rows.map(r => `Sự kiện: ${r[0]} | Chi tiết: ${r[1]}`).join('\n')
      : "Không có dữ liệu sự kiện.";

    // 3. Gửi cho Gemini xử lý
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Bạn là Hải cẩu NSEC. Dựa vào danh sách này:\n${context}\n\nTrả lời câu hỏi: ${message}`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ reply: result.response.text() });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "Lỗi kết nối rồi ông ơi!" }, { status: 500 });
  }
}