/**
 * Đọc danh sách công trình slide 2 từ file JSON hoặc Vercel KV
 */
import path from 'path';
import fs from 'fs/promises';

export type Project = {
  id: string;
  image: string;
  title?: string;
  description?: string;
};

const dataPath = path.join(process.cwd(), 'data', 'admin-projects-2.json');

export async function readAllProjects2(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

