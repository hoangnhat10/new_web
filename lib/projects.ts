/**
 * Đọc danh sách công trình từ file JSON
 */
import path from 'path';
import fs from 'fs/promises';

export type Project = {
  id: string;
  image: string;
  title?: string;
  description?: string;
};

const dataPath = path.join(process.cwd(), 'data', 'admin-projects.json');

export async function readAllProjects(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

