/**
 * Đọc cấu hình thương hiệu từ file JSON
 */
import path from 'path';
import fs from 'fs/promises';

export type ContactPhone = {
  id: string;
  number: string;
  label?: string;
};

export type ContactAddress = {
  id: string;
  address: string;
  type: 'factory' | 'showroom';
  label?: string;
};

export type AdminSettings = {
  logo: string;
  primaryColor: string;
  theme: 'light' | 'dark' | 'auto';
  address: string;
  phone: string;
  email: string;
  logoScale: number;
  logoOffsetX: number;
  logoOffsetY: number;
  blogEnabled?: boolean;
  contactInfo?: {
    phones?: ContactPhone[];
    addresses?: ContactAddress[];
    email: string;
    zalo?: string;
    facebook?: string;
    workingHours?: {
      weekdays?: string;
      saturday?: string;
      sunday?: string;
    };
  };
};

const dataPath = path.join(process.cwd(), 'data', 'admin-settings.json');

export async function readSettings(): Promise<AdminSettings> {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AdminSettings>;
    return {
      logo: parsed.logo || '',
      primaryColor: parsed.primaryColor || '#d4af37',
      theme: parsed.theme || 'light',
      address: parsed.address || '',
      phone: parsed.phone || '',
      email: parsed.email || '',
      logoScale: typeof parsed.logoScale === 'number' ? parsed.logoScale : 1,
      logoOffsetX: typeof parsed.logoOffsetX === 'number' ? parsed.logoOffsetX : 0,
      logoOffsetY: typeof parsed.logoOffsetY === 'number' ? parsed.logoOffsetY : 0,
      blogEnabled: parsed.blogEnabled !== undefined ? parsed.blogEnabled : true,
    };
  } catch {
    return {
      logo: '',
      primaryColor: '#d4af37',
      theme: 'light',
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

