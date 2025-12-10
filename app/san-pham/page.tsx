/**
 * Trang Sản phẩm - Products Page
 * Server fetch dữ liệu từ JSON (admin) + client filter danh mục
 */

import ProductsClient from '@/components/ProductsClient';
import { categories as staticCategories, Product } from '@/data/products';
import { readAllProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = (await readAllProducts()) as Product[];
  return <ProductsClient products={products} categories={staticCategories} />;
}




