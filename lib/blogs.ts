/**
 * Tiện ích đọc dữ liệu blog từ file JSON (admin)
 */
import path from 'path';
import fs from 'fs/promises';

const adminDataPath = path.join(process.cwd(), 'data', 'admin-blogs.json');

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  published: boolean;
  tags?: string[];
  category?: string;
}

export async function readAllBlogs(): Promise<BlogPost[]> {
  try {
    const raw = await fs.readFile(adminDataPath, 'utf8');
    const json = JSON.parse(raw);
    return (json as BlogPost[]).filter(blog => blog.published === true);
  } catch {
    return [];
  }
}

export async function readBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const blogs = await readAllBlogs();
  return blogs.find((b) => b.slug === slug);
}



