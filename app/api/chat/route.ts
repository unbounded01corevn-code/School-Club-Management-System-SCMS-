import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { google } from "googleapis";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: "1irhk8wW5W8Mwtq9nt0p4CCwvWC2-J3aRXjySVJUxXjE",
      range: "Sheet1!A2:B",
    });

    const rows = res.data.values || [];

    const context = rows
      .map(r => `Sự kiện: ${r[0]} | Chi tiết: ${r[1]}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Bạn là Hải cẩu NSEC. Dữ liệu:\n${context}\n\nCâu hỏi:${message}`
    );

    return NextResponse.json({
      reply: result.response.text(),
    });

  } catch {
    return NextResponse.json(
      { reply: "Lỗi kết nối rồi ông ơi!" },
      { status: 500 }
    );
  }
}