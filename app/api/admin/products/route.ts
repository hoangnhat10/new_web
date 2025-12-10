/**
 * API CRUD sản phẩm admin
 * Lưu dữ liệu vào file JSON (data/admin-products.json) và xử lý upload ảnh (base64)
 */
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const dataPath = path.join(process.cwd(), 'data', 'admin-products.json');

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string; // base64 hoặc URL
  features: string[];
  address?: string;
  email?: string;
  phone?: string;
  gallery?: string[];
  specifications: {
    material: string;
    size: string;
    weight: string;
    warranty: string;
  };
}

async function readProducts(): Promise<AdminProduct[]> {
  const json = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(json);
}

async function writeProducts(products: AdminProduct[]) {
  await fs.writeFile(dataPath, JSON.stringify(products, null, 2), 'utf8');
}

function validatePayload(payload: any) {
  if (!payload) throw new Error('Thiếu dữ liệu');
  if (!payload.name) throw new Error('Tên sản phẩm là bắt buộc');
  if (payload.price === undefined || payload.price === null) throw new Error('Giá sản phẩm là bắt buộc');
}

export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể đọc dữ liệu', error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    validatePayload(body);
    const products = await readProducts();
    const newProduct: AdminProduct = {
      id: `p-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      price: Number(body.price) || 0,
      category: body.category || 'Khác',
      address: body.address || '',
      email: body.email || '',
      phone: body.phone || '',
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      image: body.image || '',
      features: Array.isArray(body.features)
        ? body.features
        : (body.features || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      specifications: {
        material: body.specifications?.material || '',
        size: body.specifications?.size || '',
        weight: body.specifications?.weight || '',
        warranty: body.specifications?.warranty || '',
      },
    };
    products.push(newProduct);
    await writeProducts(products);
    return NextResponse.json({ product: newProduct });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể tạo sản phẩm', error: String(error) }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    validatePayload(body);
    if (!body.id) throw new Error('Thiếu id sản phẩm');

    const products = await readProducts();
    const idx = products.findIndex((p) => p.id === body.id);
    if (idx === -1) throw new Error('Không tìm thấy sản phẩm');

    const updated: AdminProduct = {
      ...products[idx],
      ...body,
      price: Number(body.price) || 0,
      address: body.address || '',
      email: body.email || '',
      phone: body.phone || '',
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      features: Array.isArray(body.features)
        ? body.features
        : (body.features || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      specifications: {
        material: body.specifications?.material || '',
        size: body.specifications?.size || '',
        weight: body.specifications?.weight || '',
        warranty: body.specifications?.warranty || '',
      },
    };

    products[idx] = updated;
    await writeProducts(products);
    return NextResponse.json({ product: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể cập nhật sản phẩm', error: String(error) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) throw new Error('Thiếu id sản phẩm');

    const products = await readProducts();
    const next = products.filter((p) => p.id !== body.id);
    await writeProducts(next);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể xóa sản phẩm', error: String(error) }, { status: 400 });
  }
}

