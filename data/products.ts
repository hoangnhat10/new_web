/**
 * Dữ liệu mẫu sản phẩm cổng nhôm đúc
 * Bao gồm thông tin chi tiết về các sản phẩm cổng nhôm đúc
 */
import productsData from './products.json';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  gallery?: string[];
  address?: string;
  email?: string;
  phone?: string;
  features: string[];
  specifications: {
    material: string;
    size: string;
    weight: string;
    warranty: string;
  };
}

export const products: Product[] = productsData as Product[];

const defaultCategories = ['Cổng', 'Lan can', 'Hàng rào', 'Lồng đèn'];

export const categories = Array.from(
  new Set(['Tất cả', ...defaultCategories, ...products.map((p) => p.category)])
);

