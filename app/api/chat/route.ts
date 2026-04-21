import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || ""
    );

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: "1SPwNmYucKvCiSFr0SC7mwtN113CSx6eglXIc4A3ugq8",
      range: "ai_rows!A:B",
    });

    const rows = res.data.values || [];

    const context = rows
      .map((row) => `Tiêu đề: ${row[0]} | Nội dung: ${row[1]}`)
      .join("\n");

    const prompt = `
Bạn là trợ lý website CLB.

Dữ liệu:
${context}

Câu hỏi:
${message}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(prompt);

    return NextResponse.json({
      reply: result.response.text(),
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { reply: "Lỗi kết nối rồi!" },
      { status: 500 }
    );
  }
}