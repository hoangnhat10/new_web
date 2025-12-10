/**
 * API Settings admin
 * Lưu cấu hình logo, màu chủ đạo, địa chỉ, phone, email vào JSON
 */
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const dataPath = path.join(process.cwd(), 'data', 'admin-settings.json');

type AdminSettings = {
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

async function readSettings(): Promise<AdminSettings> {
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

async function writeSettings(settings: AdminSettings) {
  await fs.writeFile(dataPath, JSON.stringify(settings, null, 2), 'utf8');
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const next: AdminSettings = {
      logo: body.logo || '',
      primaryColor: body.primaryColor || '#d97706',
      address: body.address || '',
      phone: body.phone || '',
      email: body.email || '',
      logoScale: typeof body.logoScale === 'number' ? body.logoScale : 1,
      logoOffsetX: typeof body.logoOffsetX === 'number' ? body.logoOffsetX : 0,
      logoOffsetY: typeof body.logoOffsetY === 'number' ? body.logoOffsetY : 0,
      blogEnabled: body.blogEnabled !== undefined ? body.blogEnabled : true,
    };
    await writeSettings(next);
    return NextResponse.json({ settings: next });
  } catch (error) {
    return NextResponse.json({ error: 'Không thể lưu cấu hình' }, { status: 400 });
  }
}

