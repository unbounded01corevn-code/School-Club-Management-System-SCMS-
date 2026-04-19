import { google } from 'googleapis';

export async function getGoogleSheetsClient() {
  const auth = google.auth.fromJSON(require('../../../service-account.json'));
  // Cấp quyền đọc/ghi
  (auth as any).scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  
  const sheets = google.sheets({ version: 'v4', auth: auth as any });
  return sheets;
}
