/**
 * API Projects admin
 * Lưu danh sách công trình tiêu biểu vào JSON
 */
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const dataPath = path.join(process.cwd(), 'data', 'admin-projects.json');

type Project = {
  id: string;
  image: string;
  title?: string;
  description?: string;
};

async function readProjects(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeProjects(projects: Project[]) {
  try {
    const dataDir = path.dirname(dataPath);
    await fs.mkdir(dataDir, { recursive: true });
    const jsonString = JSON.stringify(projects, null, 2);
    await fs.writeFile(dataPath, jsonString, 'utf8');
  } catch (error: any) {
    console.error('Error writing projects:', error);
    // Kiểm tra nếu là lỗi quyền truy cập (như trên Vercel)
    if (error?.code === 'EACCES' || error?.code === 'EROFS' || error?.message?.includes('read-only')) {
      throw new Error('Không thể ghi file trên server này. Vui lòng kiểm tra cấu hình server hoặc sử dụng database/storage service.');
    }
    throw error;
  }
}

export async function GET() {
  try {
    const projects = await readProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json({ error: 'Không thể đọc danh sách công trình' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate dữ liệu
    if (!body.image || typeof body.image !== 'string') {
      return NextResponse.json(
        { error: 'Ảnh công trình là bắt buộc' },
        { status: 400 }
      );
    }
    
    const projects = await readProjects();
    
    const newProject: Project = {
      id: body.id || `project-${Date.now()}`,
      image: String(body.image || ''),
      title: body.title ? String(body.title) : undefined,
      description: body.description ? String(body.description) : undefined,
    };
    
    projects.push(newProject);
    await writeProjects(projects);
    return NextResponse.json({ project: newProject, success: true });
  } catch (error: any) {
    console.error('Error creating project:', error);
    const errorMessage = error?.message || 'Không thể thêm công trình';
    const errorDetails = error?.code ? ` (Code: ${error.code})` : '';
    return NextResponse.json(
      { error: errorMessage, details: String(error) + errorDetails },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Thiếu ID công trình' },
        { status: 400 }
      );
    }
    
    if (!body.image || typeof body.image !== 'string') {
      return NextResponse.json(
        { error: 'Ảnh công trình là bắt buộc' },
        { status: 400 }
      );
    }
    
    const projects = await readProjects();
    
    const index = projects.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Không tìm thấy công trình' }, { status: 404 });
    }
    
    projects[index] = {
      id: body.id,
      image: String(body.image || ''),
      title: body.title ? String(body.title) : undefined,
      description: body.description ? String(body.description) : undefined,
    };
    
    await writeProjects(projects);
    return NextResponse.json({ project: projects[index], success: true });
  } catch (error: any) {
    console.error('Error updating project:', error);
    const errorMessage = error?.message || 'Không thể cập nhật công trình';
    const errorDetails = error?.code ? ` (Code: ${error.code})` : '';
    return NextResponse.json(
      { error: errorMessage, details: String(error) + errorDetails },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID công trình' }, { status: 400 });
    }
    
    const projects = await readProjects();
    const filtered = projects.filter((p) => p.id !== id);
    
    if (filtered.length === projects.length) {
      return NextResponse.json({ error: 'Không tìm thấy công trình' }, { status: 404 });
    }
    
    await writeProjects(filtered);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: error?.message || 'Không thể xóa công trình', details: String(error) },
      { status: 500 }
    );
  }
}


