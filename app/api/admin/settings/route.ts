/**
 * API Settings admin
 * Lưu cấu hình logo, màu chủ đạo, theme, địa chỉ, phone, email vào JSON
 */
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const dataPath = path.join(process.cwd(), 'data', 'admin-settings.json');

type ContactPhone = {
  id: string;
  number: string;
  label?: string;
};

type ContactAddress = {
  id: string;
  address: string;
  type: 'factory' | 'showroom';
  label?: string;
};

type AdminSettings = {
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

async function readSettings(): Promise<AdminSettings> {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AdminSettings>;
    // Merge với defaults để đảm bảo có đầy đủ fields
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
      contactInfo: parsed.contactInfo || undefined,
    };
  } catch (error) {
    // Nếu file không tồn tại hoặc lỗi, trả về defaults
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

async function writeSettings(settings: AdminSettings) {
  try {
    // Đảm bảo thư mục data tồn tại
    const dataDir = path.dirname(dataPath);
    await fs.mkdir(dataDir, { recursive: true });
    // Ghi file
    await fs.writeFile(dataPath, JSON.stringify(settings, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing settings:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json({ error: 'Không thể đọc cấu hình' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate và normalize dữ liệu
    const next: AdminSettings = {
      logo: String(body.logo || ''),
      primaryColor: String(body.primaryColor || '#d4af37'),
      theme: ['light', 'dark', 'auto'].includes(body.theme) ? body.theme : 'light',
      address: String(body.address || ''),
      phone: String(body.phone || ''),
      email: String(body.email || ''),
      logoScale: typeof body.logoScale === 'number' ? Number(body.logoScale) : 1,
      logoOffsetX: typeof body.logoOffsetX === 'number' ? Number(body.logoOffsetX) : 0,
      logoOffsetY: typeof body.logoOffsetY === 'number' ? Number(body.logoOffsetY) : 0,
      blogEnabled: body.blogEnabled !== undefined ? Boolean(body.blogEnabled) : true,
      contactInfo: body.contactInfo ? {
        phones: Array.isArray(body.contactInfo.phones) ? body.contactInfo.phones.map((p: any) => ({
          id: String(p.id || Date.now().toString() + Math.random()),
          number: String(p.number || ''),
          label: p.label ? String(p.label) : undefined,
        })) : undefined,
        addresses: Array.isArray(body.contactInfo.addresses) ? body.contactInfo.addresses.map((a: any) => ({
          id: String(a.id || Date.now().toString() + Math.random()),
          address: String(a.address || ''),
          type: a.type === 'factory' || a.type === 'showroom' ? a.type : 'factory',
          label: a.label ? String(a.label) : undefined,
        })) : undefined,
        email: String(body.contactInfo.email || body.email || ''),
        zalo: body.contactInfo.zalo ? String(body.contactInfo.zalo) : undefined,
        facebook: body.contactInfo.facebook ? String(body.contactInfo.facebook) : undefined,
        workingHours: body.contactInfo.workingHours ? {
          weekdays: body.contactInfo.workingHours.weekdays ? String(body.contactInfo.workingHours.weekdays) : undefined,
          saturday: body.contactInfo.workingHours.saturday ? String(body.contactInfo.workingHours.saturday) : undefined,
          sunday: body.contactInfo.workingHours.sunday ? String(body.contactInfo.workingHours.sunday) : undefined,
        } : undefined,
      } : undefined,
    };
    
    await writeSettings(next);
    return NextResponse.json({ settings: next, success: true });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: error?.message || 'Không thể lưu cấu hình', details: String(error) },
      { status: 500 }
    );
  }
}

