/**
 * Đọc cấu hình thương hiệu từ file JSON
 */
import path from 'path';
import fs from 'fs/promises';

export type AdminSettings = {
  logo: string;
  primaryColor: string;
  address: string;
  phone: string;
  email: string;
  logoScale: number;
  logoOffsetX: number;
  logoOffsetY: number;
  blogEnabled?: boolean;
};

const dataPath = path.join(process.cwd(), 'data', 'admin-settings.json');

export async function readSettings(): Promise<AdminSettings> {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(raw) as AdminSettings;
  } catch {
    return {
      logo: '',
      primaryColor: '#d97706',
      address: '',
      phone: '',
      email: '',
      logoScale: 1,
      logoOffsetX: 0,
      logoOffsetY: 0,
      blogEnabled: true,
    };
  }
}

