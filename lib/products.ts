/**
 * Tiện ích đọc dữ liệu sản phẩm từ file JSON (admin) hoặc fallback dữ liệu tĩnh
 */
import path from 'path';
import fs from 'fs/promises';
import { products as staticProducts, Product } from '@/data/products';

const adminDataPath = path.join(process.cwd(), 'data', 'admin-products.json');

function normalizeProduct(p: any): Product {
  return {
    id: String(p.id || ''),
    name: p.name || '',
    description: p.description || '',
    price: Number(p.price) || 0,
    image: p.image || '',
    category: p.category || 'Khác',
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    features: Array.isArray(p.features) ? p.features : [],
    specifications: {
      material: p.specifications?.material || '',
      size: p.specifications?.size || '',
      weight: p.specifications?.weight || '',
      warranty: p.specifications?.warranty || '',
    },
    address: p.address,
    email: p.email,
    phone: p.phone,
  };
}

export async function readAllProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(adminDataPath, 'utf8');
    const json = JSON.parse(raw);
    return (json as any[]).map(normalizeProduct);
  } catch {
    // Nếu chưa có file hoặc lỗi, fallback dữ liệu tĩnh
    return staticProducts.map(normalizeProduct);
  }
}

export async function readProductById(id: string): Promise<Product | undefined> {
  const list = await readAllProducts();
  return list.find((p) => p.id === id);
}

