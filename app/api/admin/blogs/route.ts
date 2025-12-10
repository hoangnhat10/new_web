/**
 * API CRUD blog posts admin
 * Lưu dữ liệu vào file JSON (data/admin-blogs.json)
 */
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const dataPath = path.join(process.cwd(), 'data', 'admin-blogs.json');

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string; // base64 hoặc URL
  author: string;
  publishedAt: string; // ISO date string
  updatedAt: string;
  published: boolean;
  tags?: string[];
  category?: string;
}

async function readBlogs(): Promise<BlogPost[]> {
  try {
    const json = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(json);
  } catch {
    // Nếu file chưa tồn tại, trả về mảng rỗng
    return [];
  }
}

async function writeBlogs(blogs: BlogPost[]) {
  await fs.writeFile(dataPath, JSON.stringify(blogs, null, 2), 'utf8');
}

function validatePayload(payload: any) {
  if (!payload) throw new Error('Thiếu dữ liệu');
  if (!payload.title) throw new Error('Tiêu đề bài viết là bắt buộc');
  if (!payload.content) throw new Error('Nội dung bài viết là bắt buộc');
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const blogs = await readBlogs();
    return NextResponse.json({ blogs });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể đọc dữ liệu', error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    validatePayload(body);
    const blogs = await readBlogs();
    
    const now = new Date().toISOString();
    const slug = body.slug || generateSlug(body.title);
    
    // Đảm bảo slug là duy nhất
    let finalSlug = slug;
    let counter = 1;
    while (blogs.some(b => b.slug === finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: body.title,
      slug: finalSlug,
      excerpt: body.excerpt || body.content.substring(0, 200) + '...',
      content: body.content,
      featuredImage: body.featuredImage || '',
      author: body.author || 'Admin',
      publishedAt: body.publishedAt || now,
      updatedAt: now,
      published: body.published !== undefined ? body.published : false,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      category: body.category || '',
    };
    
    blogs.push(newPost);
    await writeBlogs(blogs);
    return NextResponse.json({ blog: newPost });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể tạo bài viết', error: String(error) }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    validatePayload(body);
    if (!body.id) throw new Error('Thiếu id bài viết');

    const blogs = await readBlogs();
    const idx = blogs.findIndex((b) => b.id === body.id);
    if (idx === -1) throw new Error('Không tìm thấy bài viết');

    const now = new Date().toISOString();
    const slug = body.slug || generateSlug(body.title);
    
    // Đảm bảo slug là duy nhất (trừ chính nó)
    let finalSlug = slug;
    let counter = 1;
    while (blogs.some(b => b.slug === finalSlug && b.id !== body.id)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const updated: BlogPost = {
      ...blogs[idx],
      title: body.title,
      slug: finalSlug,
      excerpt: body.excerpt || body.content.substring(0, 200) + '...',
      content: body.content,
      featuredImage: body.featuredImage || '',
      author: body.author || blogs[idx].author,
      updatedAt: now,
      published: body.published !== undefined ? body.published : blogs[idx].published,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      category: body.category || '',
    };

    blogs[idx] = updated;
    await writeBlogs(blogs);
    return NextResponse.json({ blog: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể cập nhật bài viết', error: String(error) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) throw new Error('Thiếu id bài viết');

    const blogs = await readBlogs();
    const next = blogs.filter((b) => b.id !== body.id);
    await writeBlogs(next);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể xóa bài viết', error: String(error) }, { status: 400 });
  }
}



