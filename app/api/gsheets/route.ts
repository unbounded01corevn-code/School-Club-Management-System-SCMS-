import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: Request) {
  // Lấy tham số 'tab' từ URL (ví dụ: ?tab=HocSinh)
  const { searchParams } = new URL(request.url);
  const tabName = searchParams.get('tab') || 'Sheet1'; 

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '179W5w16EszATCLx0VdXIY9v-8bA6-_1zrX7rwh3yCls';

    // Gọi đúng cái Tab mà mình muốn
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!A:Z`, 
    });

    return NextResponse.json(response.data.values);
  } catch (error) {
    return NextResponse.json({ error: "Không lấy được dữ liệu Sheet" }, { status: 500 });
  }
}
