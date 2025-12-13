/**
 * Trang Admin - Đăng nhập, quản lý sản phẩm (thêm/sửa/xóa) và upload ảnh
 * Dữ liệu được lưu vào file JSON qua API /api/admin/products
 */
'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';

type AdminProduct = {
  id?: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  address?: string;
  email?: string;
  phone?: string;
  image: string;
  gallery?: string[];
  features: string[];
  specifications: {
    material: string;
    size: string;
    weight: string;
    warranty: string;
  };
};

type ContactPhone = {
  id: string;
  number: string;
  label?: string;
};

type ContactAddress = {
  id: string;
  address: string;
  type: 'factory' | 'showroom';
  label?: string;
};

type AdminSettings = {
  logo: string;
  primaryColor: string;
  theme: 'light' | 'dark' | 'auto';
  address: string;
  phone: string;
  email: string;
  logoScale: number;
  logoOffsetX: number;
  logoOffsetY: number;
  blogEnabled?: boolean;
  contactInfo?: {
    phones?: ContactPhone[];
    addresses?: ContactAddress[];
    email: string;
    zalo?: string;
    facebook?: string;
    workingHours?: {
      weekdays?: string;
      saturday?: string;
      sunday?: string;
    };
  };
};

type BlogPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  publishedAt: string;
  published: boolean;
  tags?: string[];
  category?: string;
};

type Project = {
  id: string;
  image: string;
  title?: string;
  description?: string;
};

const EMPTY_PRODUCT: AdminProduct = {
  name: '',
  description: '',
  price: '',
  category: '',
  address: '',
  email: '',
  phone: '',
  image: '',
  gallery: [],
  features: [],
  specifications: {
    material: '',
    size: '',
    weight: '',
    warranty: '',
  },
};

const EMPTY_SETTINGS: AdminSettings = {
  logo: '',
  primaryColor: '#d4af37',
  theme: 'light',
  address: '',
  phone: '',
  email: '',
  logoScale: 1,
  logoOffsetX: 0,
  logoOffsetY: 0,
  blogEnabled: true,
  contactInfo: {
    phones: [],
    addresses: [],
    email: '',
    zalo: '',
    facebook: '',
    workingHours: {
      weekdays: 'Thứ 2 - Thứ 6: 8:00 - 17:30',
      saturday: 'Thứ 7: 8:00 - 12:00',
      sunday: 'Chủ nhật: Nghỉ',
    },
  },
};

// Preset màu sắc cho color picker
const PRESET_COLORS = [
  { name: 'Vàng Gold', value: '#d4af37' },
  { name: 'Vàng cam', value: '#d97706' },
  { name: 'Vàng nhạt', value: '#fbbf24' },
  { name: 'Xanh dương', value: '#2563eb' },
  { name: 'Xanh lá', value: '#16a34a' },
  { name: 'Đỏ', value: '#dc2626' },
  { name: 'Tím', value: '#9333ea' },
  { name: 'Hồng', value: '#e11d48' },
  { name: 'Xanh ngọc', value: '#0891b2' },
  { name: 'Nâu', value: '#92400e' },
];

const EMPTY_BLOG: BlogPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  author: 'Admin',
  publishedAt: new Date().toISOString(),
  published: false,
  tags: [],
  category: '',
};

const EMPTY_PROJECT: Project = {
  id: '',
  image: '',
  title: '',
  description: '',
};

export default function AdminPage() {
  const CATEGORY_OPTIONS = ['Cổng', 'Lan can', 'Hàng rào', 'Lồng đèn'];
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'brand' | 'blog' | 'projects' | 'contact'>('products');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState<AdminProduct>(EMPTY_PRODUCT);
  const [settings, setSettings] = useState<AdminSettings>(EMPTY_SETTINGS);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogForm, setBlogForm] = useState<BlogPost>(EMPTY_BLOG);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectForm, setProjectForm] = useState<Project>(EMPTY_PROJECT);
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
  const [settingsErr, setSettingsErr] = useState<string | null>(null);
  const [blogMsg, setBlogMsg] = useState<string | null>(null);
  const [blogErr, setBlogErr] = useState<string | null>(null);
  const [projectMsg, setProjectMsg] = useState<string | null>(null);
  const [projectErr, setProjectErr] = useState<string | null>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const adminPassword = useMemo(
    () => process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123',
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const saved = localStorage.getItem('admin_authed');
    if (saved === 'true') {
      setIsAuthed(true);
      fetchProducts();
      fetchSettings();
      fetchBlogs();
      fetchProjects();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const mergeSettings = (data: Partial<AdminSettings>): AdminSettings => ({
    logo: data.logo ?? '',
    primaryColor: data.primaryColor ?? '#d4af37',
    theme: data.theme ?? 'light',
    address: data.address ?? '',
    phone: data.phone ?? '',
    email: data.email ?? '',
    logoScale: typeof data.logoScale === 'number' ? data.logoScale : 1,
    logoOffsetX: typeof data.logoOffsetX === 'number' ? data.logoOffsetX : 0,
    logoOffsetY: typeof data.logoOffsetY === 'number' ? data.logoOffsetY : 0,
    blogEnabled: data.blogEnabled !== undefined ? data.blogEnabled : true,
  });

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(mergeSettings(data.settings || {}));
    } catch (err) {
      setSettingsErr('Không thể tải cấu hình');
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      setBlogErr('Không thể tải danh sách bài viết');
    } finally {
      setLoadingBlogs(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      setProjectErr('Không thể tải danh sách công trình');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthed(true);
      localStorage.setItem('admin_authed', 'true');
      setMessage('Đăng nhập thành công');
      setError(null);
      fetchProducts();
      fetchSettings();
      fetchProjects();
    } else {
      setError('Mật khẩu không đúng');
      setMessage(null);
    }
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryChange = (files?: FileList | null) => {
    if (!files || !files.length) return;
    const list = Array.from(files);
    Promise.all(
      list.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setForm((prev) => ({ ...prev, gallery: [...(prev.gallery || []), ...images] }));
    });
  };

  const handleRemoveGallery = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== idx),
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_PRODUCT);
  };

  const resetSettings = () => setSettings(EMPTY_SETTINGS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        features: Array.isArray(form.features)
          ? form.features
          : [],
      };
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Lưu sản phẩm thất bại');
      await fetchProducts();
      setMessage(form.id ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
      resetForm();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);
    setSettingsErr(null);
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lưu cấu hình thất bại');
      }
      const savedSettings = mergeSettings(data.settings || {});
      setSettings(savedSettings);
      
      // Áp dụng theme và màu ngay lập tức
      document.documentElement.style.setProperty('--primary-color', savedSettings.primaryColor || '#d4af37');
      const theme = savedSettings.theme || 'light';
      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
      
      setSettingsMsg('Đã lưu cấu hình thành công');
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setSettingsErr(err?.message || 'Có lỗi xảy ra khi lưu cấu hình');
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setForm({
      ...product,
      price: product.price,
      features: product.features || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Xóa sản phẩm thất bại');
      await fetchProducts();
      setMessage('Đã xóa sản phẩm');
      if (form.id === id) resetForm();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const resetBlogForm = () => {
    setBlogForm(EMPTY_BLOG);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBlogs(true);
    setBlogMsg(null);
    setBlogErr(null);
    try {
      const method = blogForm.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/blogs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogForm),
      });
      if (!res.ok) throw new Error('Lưu bài viết thất bại');
      await fetchBlogs();
      setBlogMsg(blogForm.id ? 'Đã cập nhật bài viết' : 'Đã thêm bài viết');
      resetBlogForm();
    } catch (err: any) {
      setBlogErr(err?.message || 'Có lỗi xảy ra');
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleBlogEdit = (blog: BlogPost) => {
    setBlogForm(blog);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBlogDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    setLoadingBlogs(true);
    setBlogErr(null);
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Xóa bài viết thất bại');
      await fetchBlogs();
      setBlogMsg('Đã xóa bài viết');
      if (blogForm.id === id) resetBlogForm();
    } catch (err: any) {
      setBlogErr(err?.message || 'Có lỗi xảy ra');
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleBlogImageChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBlogForm((prev) => ({ ...prev, featuredImage: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.image) {
      setProjectErr('Vui lòng chọn ảnh công trình');
      return;
    }
    
    // Kiểm tra kích thước ảnh base64 (ước tính ~1.33x kích thước file gốc)
    const imageSize = projectForm.image.length;
    const estimatedSizeMB = (imageSize * 0.75) / (1024 * 1024); // Ước tính MB
    if (estimatedSizeMB > 5) {
      setProjectErr(`Ảnh quá lớn (ước tính ${estimatedSizeMB.toFixed(2)}MB). Vui lòng chọn ảnh nhỏ hơn 5MB.`);
      return;
    }
    
    setLoadingProjects(true);
    setProjectMsg(null);
    setProjectErr(null);
    try {
      const method = projectForm.id ? 'PUT' : 'POST';
      const payload = {
        ...projectForm,
        id: projectForm.id || `project-${Date.now()}`,
      };
      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || data.message || 'Lưu công trình thất bại';
        const details = data.details ? ` Chi tiết: ${data.details}` : '';
        throw new Error(errorMsg + details);
      }
      
      await fetchProjects();
      setProjectMsg(projectForm.id ? 'Đã cập nhật công trình' : 'Đã thêm công trình');
      setProjectForm(EMPTY_PROJECT);
    } catch (err: any) {
      console.error('Error saving project:', err);
      setProjectErr(err?.message || 'Có lỗi xảy ra khi lưu công trình');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleProjectEdit = (project: Project) => {
    setProjectForm(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa công trình này?')) return;
    setLoadingProjects(true);
    setProjectErr(null);
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Xóa công trình thất bại');
      await fetchProjects();
      setProjectMsg('Đã xóa công trình');
      if (projectForm.id === id) setProjectForm(EMPTY_PROJECT);
    } catch (err: any) {
      setProjectErr(err?.message || 'Có lỗi xảy ra');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleProjectImageChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProjectForm((prev) => ({ ...prev, image: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const resetProjectForm = () => {
    setProjectForm(EMPTY_PROJECT);
  };

  const handleInsertImageToContent = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = String(reader.result || '');
      const imgTag = `\n<img src="${imageData}" alt="Ảnh" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />\n`;
      
      const textarea = contentTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = blogForm.content;
        const newContent = currentContent.substring(0, start) + imgTag + currentContent.substring(end);
        setBlogForm((prev) => ({ ...prev, content: newContent }));
        
        // Đặt lại vị trí con trỏ sau ảnh
        setTimeout(() => {
          textarea.focus();
          const newPosition = start + imgTag.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      } else {
        // Nếu không có textarea focus, chèn vào cuối
        setBlogForm((prev) => ({ ...prev, content: prev.content + imgTag }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Đăng nhập Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu admin"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}
            <button
              type="submit"
              className="w-full luxury-gradient text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Trang Quản Trị</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Quản lý sản phẩm và upload ảnh</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link href="/" className="text-primary-600 font-semibold hover:underline text-sm sm:text-base">Về trang chủ</Link>
              <button
                className="text-xs sm:text-sm text-red-600 font-semibold px-2 sm:px-0"
                onClick={() => {
                  localStorage.removeItem('admin_authed');
                  setIsAuthed(false);
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'products' ? 'luxury-gradient text-white shadow-md' : 'bg-white border'}`}
            onClick={() => {
              setActiveTab('products');
              fetchSettings();
            }}
          >
            Quản lý sản phẩm
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'brand' ? 'luxury-gradient text-white shadow-md' : 'bg-white border'}`}
            onClick={() => {
              setActiveTab('brand');
              fetchSettings();
            }}
          >
            Cấu hình thương hiệu
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'blog' ? 'luxury-gradient text-white shadow-md' : 'bg-white border'}`}
            onClick={() => {
              setActiveTab('blog');
              fetchSettings();
              fetchBlogs();
            }}
          >
            Quản lý Blog
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'projects' ? 'luxury-gradient text-white shadow-md' : 'bg-white border'}`}
            onClick={() => {
              setActiveTab('projects');
              fetchProjects();
            }}
          >
            Quản lý Công trình
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'contact' ? 'luxury-gradient text-white shadow-md' : 'bg-white border'}`}
            onClick={() => {
              setActiveTab('contact');
              fetchSettings();
            }}
          >
            Thông tin liên hệ
          </button>
        </div>

        {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="bg-white shadow-lg rounded-2xl p-6 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">{form.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giá (VND)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Chọn danh mục</option>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.address || ''}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.phone || ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ảnh đại diện sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
                {form.image && (
                  <div className="mt-3 relative w-28 h-28 border rounded-lg overflow-hidden bg-white">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white/80 text-red-600 text-xs px-2 py-1 rounded"
                      onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thư viện ảnh (nhiều ảnh)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleGalleryChange(e.target.files)}
                />
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {(form.gallery || []).map((img, idx) => (
                    <div key={idx} className="relative group border rounded-lg overflow-hidden">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 text-red-600 text-xs px-2 py-1 rounded hidden group-hover:block"
                        onClick={() => handleRemoveGallery(idx)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tính năng (mỗi dòng 1 mục)</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  value={(form.features || []).join('\n')}
                  onChange={(e) => setForm({ ...form, features: e.target.value.split('\n') })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Chất liệu</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.specifications.material}
                    onChange={(e) => setForm({ ...form, specifications: { ...form.specifications, material: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kích thước</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.specifications.size}
                    onChange={(e) => setForm({ ...form, specifications: { ...form.specifications, size: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trọng lượng</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.specifications.weight}
                    onChange={(e) => setForm({ ...form, specifications: { ...form.specifications, weight: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bảo hành</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.specifications.warranty}
                    onChange={(e) => setForm({ ...form, specifications: { ...form.specifications, warranty: e.target.value } })}
                  />
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 luxury-gradient text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                  disabled={loading}
                >
                  {form.id ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                </button>
                <button
                  type="button"
                  className="px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Làm mới
                </button>
              </div>
            </form>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
                <button
                  className="text-sm text-primary-600 hover:underline"
                  onClick={fetchProducts}
                  disabled={loading}
                >
                  Làm mới
                </button>
              </div>
              {loading && <p className="text-gray-600">Đang tải...</p>}
              {!loading && products.length === 0 && (
                <p className="text-gray-600">Chưa có sản phẩm nào.</p>
              )}
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🚪</div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-primary-600 font-bold">{Number(product.price).toLocaleString('vi-VN')} đ</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                        onClick={() => handleEdit(product)}
                      >
                        Sửa
                      </button>
                      <button
                        className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                        onClick={() => handleDelete(product.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Blog */}
          <div className="bg-white shadow-lg rounded-2xl p-6 lg:col-span-1">
            {/* Toggle Blog Enabled */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Hiển thị trang Blog</label>
                  <p className="text-xs text-gray-600">Bật/tắt hiển thị trang Blog trên website</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.blogEnabled !== false}
                    onChange={(e) => {
                      setSettings((prev) => ({ ...prev, blogEnabled: e.target.checked }));
                      // Auto save khi toggle
                      setTimeout(async () => {
                        try {
                          await fetch('/api/admin/settings', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...settings, blogEnabled: e.target.checked }),
                          });
                        } catch (err) {
                          console.error('Lỗi lưu cài đặt blog:', err);
                        }
                      }, 100);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">{blogForm.id ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả ngắn (excerpt)</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Tóm tắt ngắn gọn về bài viết..."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium">Nội dung <span className="text-red-500">*</span></label>
                  <label className="cursor-pointer text-sm text-primary-600 hover:text-primary-700 font-medium">
                    📷 Chèn ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleInsertImageToContent(e.target.files?.[0])}
                    />
                  </label>
                </div>
                <textarea
                  ref={contentTextareaRef}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  rows={12}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  required
                  placeholder="Nhập nội dung bài viết...&#10;&#10;Bạn có thể chèn ảnh bằng cách click vào '📷 Chèn ảnh' ở trên."
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Mẹo: Đặt con trỏ vào vị trí muốn chèn ảnh, sau đó click &quot;Chèn ảnh&quot;. Ảnh sẽ được chèn vào vị trí con trỏ.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ảnh đại diện</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBlogImageChange(e.target.files?.[0])}
                />
                {blogForm.featuredImage && (
                  <div className="mt-3 relative w-full h-48 border rounded-lg overflow-hidden bg-white">
                    <img src={blogForm.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white/80 text-red-600 text-xs px-2 py-1 rounded"
                      onClick={() => setBlogForm((prev) => ({ ...prev, featuredImage: '' }))}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tác giả</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={blogForm.category || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    placeholder="Ví dụ: Tin tức, Hướng dẫn..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={Array.isArray(blogForm.tags) ? blogForm.tags.join(', ') : ''}
                  onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="tag1, tag2, tag3..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={blogForm.published}
                  onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-medium">Xuất bản ngay</label>
              </div>

              {blogErr && <p className="text-red-600 text-sm">{blogErr}</p>}
              {blogMsg && <p className="text-green-600 text-sm">{blogMsg}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 luxury-gradient text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                  disabled={loadingBlogs}
                >
                  {blogForm.id ? 'Lưu thay đổi' : 'Thêm bài viết'}
                </button>
                <button
                  type="button"
                  className="px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={resetBlogForm}
                  disabled={loadingBlogs}
                >
                  Làm mới
                </button>
              </div>
            </form>
          </div>

          {/* Danh sách Blog */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <h2 className="text-xl font-bold">Danh sách bài viết</h2>
                <button
                  className="text-sm text-primary-600 hover:underline"
                  onClick={fetchBlogs}
                  disabled={loadingBlogs}
                >
                  Làm mới
                </button>
              </div>
              {loadingBlogs && <p className="text-gray-600">Đang tải...</p>}
              {!loadingBlogs && blogs.length === 0 && (
                <p className="text-gray-600">Chưa có bài viết nào.</p>
              )}
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div key={blog.id} className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 flex-1">
                      {blog.featuredImage ? (
                        <img src={blog.featuredImage} alt={blog.title} className="w-24 h-24 object-cover rounded-lg border" />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">📝</div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{blog.title}</p>
                          {blog.published ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Đã xuất bản</span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Bản nháp</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt || blog.content.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {blog.author} • {new Date(blog.publishedAt).toLocaleDateString('vi-VN')}
                          {blog.category && ` • ${blog.category}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                        onClick={() => handleBlogEdit(blog)}
                      >
                        Sửa
                      </button>
                      <button
                        className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                        onClick={() => handleBlogDelete(blog.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form Project */}
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">{projectForm.id ? 'Sửa công trình' : 'Thêm công trình'}</h2>
            {projectMsg && <p className="text-green-600 text-sm mb-2">{projectMsg}</p>}
            {projectErr && <p className="text-red-600 text-sm mb-2">{projectErr}</p>}
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ảnh công trình <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProjectImageChange(e.target.files?.[0])}
                  required={!projectForm.image}
                />
                {projectForm.image && (
                  <div className="mt-3 relative w-full h-48 border rounded-lg overflow-hidden bg-white">
                    <img src={projectForm.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white/80 text-red-600 text-xs px-2 py-1 rounded"
                      onClick={() => setProjectForm((prev) => ({ ...prev, image: '' }))}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề (tùy chọn)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={projectForm.title || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Ví dụ: Cổng biệt thự cao cấp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả (tùy chọn)</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  value={projectForm.description || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Mô tả ngắn về công trình..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loadingProjects}
                  className="flex-1 luxury-gradient text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loadingProjects ? 'Đang lưu...' : projectForm.id ? 'Cập nhật' : 'Thêm'}
                </button>
                {projectForm.id && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <h2 className="text-xl font-bold">Danh sách công trình ({projects.length})</h2>
              </div>
              {loadingProjects && <p className="text-gray-500 text-sm">Đang tải...</p>}
              {projectMsg && <p className="text-green-600 text-sm mb-2">{projectMsg}</p>}
              {projectErr && <p className="text-red-600 text-sm mb-2">{projectErr}</p>}
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Chưa có công trình nào. Hãy thêm công trình mới.</p>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                        <img src={project.image} alt={project.title || 'Công trình'} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{project.title || 'Công trình (chưa có tiêu đề)'}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          className="px-4 py-2 text-sm luxury-gradient text-white rounded-lg hover:shadow-md"
                          onClick={() => handleProjectEdit(project)}
                        >
                          Sửa
                        </button>
                        <button
                          className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                          onClick={() => handleProjectDelete(project.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'brand' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Cấu hình thương hiệu</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Logo (upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setSettings((prev) => ({ ...prev, logo: String(reader.result || '') }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {settings.logo && (
                  <div className="mt-3 w-28 h-28 border rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-sm">
                    <img
                      src={settings.logo}
                      alt="Logo"
                      className="object-contain w-full h-full"
                      style={{
                        transform: `translate(${settings.logoOffsetX || 0}%, ${settings.logoOffsetY || 0}%) scale(${settings.logoScale || 1})`,
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Logo tự co giãn vừa khung 1:1 (nên dùng PNG nền trong suốt).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phóng to/thu nhỏ</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.05"
                    value={settings.logoScale}
                    onChange={(e) => setSettings((prev) => ({ ...prev, logoScale: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Scale: {Number(settings.logoScale ?? 1).toFixed(2)}x</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Căn ngang (trái/phải)</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="1"
                    value={settings.logoOffsetX ?? 0}
                    onChange={(e) => setSettings((prev) => ({ ...prev, logoOffsetX: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Dịch {Number(settings.logoOffsetX ?? 0)}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Căn dọc (lên/xuống)</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="1"
                    value={settings.logoOffsetY ?? 0}
                    onChange={(e) => setSettings((prev) => ({ ...prev, logoOffsetY: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Dịch {Number(settings.logoOffsetY ?? 0)}%</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Giao diện Website</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Chế độ giao diện</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, theme: 'light' }))}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        settings.theme === 'light'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      ☀️ Sáng
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, theme: 'dark' }))}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        settings.theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      🌙 Tối
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, theme: 'auto' }))}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        settings.theme === 'auto'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      🔄 Tự động
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {settings.theme === 'auto' 
                      ? 'Tự động chuyển theo cài đặt hệ thống'
                      : settings.theme === 'dark'
                      ? 'Giao diện tối sẽ được áp dụng'
                      : 'Giao diện sáng sẽ được áp dụng'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Màu chủ đạo</label>
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      className="w-16 h-12 p-0 border-2 border-gray-300 rounded-lg cursor-pointer"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                        value={settings.primaryColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^#[0-9A-Fa-f]{6}$/.test(val) || val === '') {
                            setSettings((prev) => ({ ...prev, primaryColor: val || '#d4af37' }));
                          }
                        }}
                        placeholder="#d4af37"
                      />
                    </div>
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Màu có sẵn:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_COLORS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setSettings((prev) => ({ ...prev, primaryColor: preset.value }))}
                          className={`relative p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                            settings.primaryColor === preset.value
                              ? 'border-primary-500 ring-2 ring-primary-200'
                              : 'border-gray-200'
                          }`}
                          title={preset.name}
                        >
                          <div
                            className="w-full h-8 rounded"
                            style={{ backgroundColor: preset.value }}
                          />
                          <p className="text-xs text-gray-600 mt-1 truncate">{preset.name}</p>
                          {settings.primaryColor === preset.value && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Cài đặt Blog</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Hiển thị trang Blog</label>
                    <p className="text-xs text-gray-500">Bật/tắt hiển thị trang Blog trên website</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.blogEnabled !== false}
                      onChange={(e) => setSettings((prev) => ({ ...prev, blogEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={settings.address}
                    onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={settings.email}
                    onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={settings.phone}
                    onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              {settingsErr && <p className="text-red-600 text-sm">{settingsErr}</p>}
              {settingsMsg && <p className="text-green-600 text-sm">{settingsMsg}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 luxury-gradient text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                  disabled={loadingSettings}
                >
                  Lưu cấu hình
                </button>
                <button
                  type="button"
                  className="px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={resetSettings}
                  disabled={loadingSettings}
                >
                  Làm mới
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

        {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Quản lý số điện thoại */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Số điện thoại</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newPhone: ContactPhone = {
                        id: Date.now().toString() + Math.random(),
                        number: '',
                        label: '',
                      };
                      setSettings((prev) => ({
                        ...prev,
                        contactInfo: {
                          phones: [...(prev.contactInfo?.phones || []), newPhone],
                          addresses: prev.contactInfo?.addresses || [],
                          email: prev.contactInfo?.email || prev.email || '',
                          zalo: prev.contactInfo?.zalo,
                          facebook: prev.contactInfo?.facebook,
                          workingHours: prev.contactInfo?.workingHours,
                        },
                      }));
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Thêm số điện thoại
                  </button>
                </div>
                <div className="space-y-3">
                  {(settings.contactInfo?.phones || []).map((phone, index) => (
                    <div key={phone.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          value={phone.number}
                          onChange={(e) => {
                            const updatedPhones = [...(settings.contactInfo?.phones || [])];
                            updatedPhones[index] = { ...phone, number: e.target.value };
                            setSettings((prev) => ({
                              ...prev,
                              contactInfo: {
                                ...prev.contactInfo!,
                                phones: updatedPhones,
                              },
                            }));
                          }}
                          placeholder="0979798449"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPhones = (settings.contactInfo?.phones || []).filter((p) => p.id !== phone.id);
                            setSettings((prev) => ({
                              ...prev,
                              contactInfo: {
                                ...prev.contactInfo!,
                                phones: updatedPhones,
                              },
                            }));
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        value={phone.label || ''}
                        onChange={(e) => {
                          const updatedPhones = [...(settings.contactInfo?.phones || [])];
                          updatedPhones[index] = { ...phone, label: e.target.value };
                          setSettings((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo!,
                              phones: updatedPhones,
                            },
                          }));
                        }}
                        placeholder="Nhãn (VD: Hotline, Tư vấn, Bán hàng...)"
                      />
                    </div>
                  ))}
                  {(!settings.contactInfo?.phones || settings.contactInfo.phones.length === 0) && (
                    <p className="text-sm text-gray-500 italic">Chưa có số điện thoại nào. Nhấn &quot;+ Thêm số điện thoại&quot; để thêm.</p>
                  )}
                </div>
              </div>

              {/* Quản lý địa chỉ */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Địa chỉ</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newAddress: ContactAddress = {
                        id: Date.now().toString() + Math.random(),
                        address: '',
                        type: 'factory',
                        label: '',
                      };
                      setSettings((prev) => ({
                        ...prev,
                        contactInfo: {
                          phones: prev.contactInfo?.phones || [],
                          addresses: [...(prev.contactInfo?.addresses || []), newAddress],
                          email: prev.contactInfo?.email || prev.email || '',
                          zalo: prev.contactInfo?.zalo,
                          facebook: prev.contactInfo?.facebook,
                          workingHours: prev.contactInfo?.workingHours,
                        },
                      }));
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Thêm địa chỉ
                  </button>
                </div>
                <div className="space-y-3">
                  {(settings.contactInfo?.addresses || []).map((address, index) => (
                    <div key={address.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex gap-2">
                        <select
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          value={address.type}
                          onChange={(e) => {
                            const updatedAddresses = [...(settings.contactInfo?.addresses || [])];
                            updatedAddresses[index] = { ...address, type: e.target.value as 'factory' | 'showroom' };
                            setSettings((prev) => ({
                              ...prev,
                              contactInfo: {
                                ...prev.contactInfo!,
                                addresses: updatedAddresses,
                              },
                            }));
                          }}
                        >
                          <option value="factory">Nhà máy</option>
                          <option value="showroom">Showroom</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedAddresses = (settings.contactInfo?.addresses || []).filter((a) => a.id !== address.id);
                            setSettings((prev) => ({
                              ...prev,
                              contactInfo: {
                                ...prev.contactInfo!,
                                addresses: updatedAddresses,
                              },
                            }));
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        rows={2}
                        value={address.address}
                        onChange={(e) => {
                          const updatedAddresses = [...(settings.contactInfo?.addresses || [])];
                          updatedAddresses[index] = { ...address, address: e.target.value };
                          setSettings((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo!,
                              addresses: updatedAddresses,
                            },
                          }));
                        }}
                        placeholder="Nhập địa chỉ đầy đủ..."
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        value={address.label || ''}
                        onChange={(e) => {
                          const updatedAddresses = [...(settings.contactInfo?.addresses || [])];
                          updatedAddresses[index] = { ...address, label: e.target.value };
                          setSettings((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo!,
                              addresses: updatedAddresses,
                            },
                          }));
                        }}
                        placeholder="Nhãn (VD: Trụ sở chính, Chi nhánh Hà Nội...)"
                      />
                    </div>
                  ))}
                  {(!settings.contactInfo?.addresses || settings.contactInfo.addresses.length === 0) && (
                    <p className="text-sm text-gray-500 italic">Chưa có địa chỉ nào. Nhấn &quot;+ Thêm địa chỉ&quot; để thêm.</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={settings.contactInfo?.email || settings.email || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSettings((prev) => ({
                      ...prev,
                      email: newValue,
                      contactInfo: {
                        phones: prev.contactInfo?.phones || [],
                        addresses: prev.contactInfo?.addresses || [],
                        email: newValue,
                        zalo: prev.contactInfo?.zalo,
                        facebook: prev.contactInfo?.facebook,
                        workingHours: prev.contactInfo?.workingHours,
                      },
                    }));
                  }}
                  placeholder="info@congnhomduc.com"
                />
              </div>

              {/* Zalo và Facebook */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Zalo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={settings.contactInfo?.zalo || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSettings((prev) => ({
                        ...prev,
                        contactInfo: {
                          phones: prev.contactInfo?.phones || [],
                          addresses: prev.contactInfo?.addresses || [],
                          email: prev.contactInfo?.email || prev.email || '',
                          zalo: newValue,
                          facebook: prev.contactInfo?.facebook,
                          workingHours: prev.contactInfo?.workingHours,
                        },
                      }));
                    }}
                    placeholder="0979798449 hoặc link Zalo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Facebook</label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={settings.contactInfo?.facebook || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSettings((prev) => ({
                        ...prev,
                        contactInfo: {
                          phones: prev.contactInfo?.phones || [],
                          addresses: prev.contactInfo?.addresses || [],
                          email: prev.contactInfo?.email || prev.email || '',
                          zalo: prev.contactInfo?.zalo,
                          facebook: newValue,
                          workingHours: prev.contactInfo?.workingHours,
                        },
                      }));
                    }}
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Giờ làm việc</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Thứ 2 - Thứ 6</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={settings.contactInfo?.workingHours?.weekdays || 'Thứ 2 - Thứ 6: 8:00 - 17:30'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          contactInfo: {
                            phones: prev.contactInfo?.phones || [],
                            addresses: prev.contactInfo?.addresses || [],
                            email: prev.contactInfo?.email || prev.email || '',
                            zalo: prev.contactInfo?.zalo,
                            facebook: prev.contactInfo?.facebook,
                            workingHours: {
                              weekdays: newValue,
                              saturday: prev.contactInfo?.workingHours?.saturday,
                              sunday: prev.contactInfo?.workingHours?.sunday,
                            },
                          },
                        }));
                      }}
                      placeholder="Thứ 2 - Thứ 6: 8:00 - 17:30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Thứ 7</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={settings.contactInfo?.workingHours?.saturday || 'Thứ 7: 8:00 - 12:00'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          contactInfo: {
                            phones: prev.contactInfo?.phones || [],
                            addresses: prev.contactInfo?.addresses || [],
                            email: prev.contactInfo?.email || prev.email || '',
                            zalo: prev.contactInfo?.zalo,
                            facebook: prev.contactInfo?.facebook,
                            workingHours: {
                              weekdays: prev.contactInfo?.workingHours?.weekdays,
                              saturday: newValue,
                              sunday: prev.contactInfo?.workingHours?.sunday,
                            },
                          },
                        }));
                      }}
                      placeholder="Thứ 7: 8:00 - 12:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Chủ nhật</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={settings.contactInfo?.workingHours?.sunday || 'Chủ nhật: Nghỉ'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          contactInfo: {
                            phones: prev.contactInfo?.phones || [],
                            addresses: prev.contactInfo?.addresses || [],
                            email: prev.contactInfo?.email || prev.email || '',
                            zalo: prev.contactInfo?.zalo,
                            facebook: prev.contactInfo?.facebook,
                            workingHours: {
                              weekdays: prev.contactInfo?.workingHours?.weekdays,
                              saturday: prev.contactInfo?.workingHours?.saturday,
                              sunday: newValue,
                            },
                          },
                        }));
                      }}
                      placeholder="Chủ nhật: Nghỉ"
                    />
                  </div>
                </div>
              </div>

              {settingsErr && <p className="text-red-600 text-sm">{settingsErr}</p>}
              {settingsMsg && <p className="text-green-600 text-sm">{settingsMsg}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 luxury-gradient text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                  disabled={loadingSettings}
                >
                  Lưu thông tin liên hệ
                </button>
                <button
                  type="button"
                  className="px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={resetSettings}
                  disabled={loadingSettings}
                >
                  Làm mới
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-4">Xem trước thông tin liên hệ</h2>
              <div className="space-y-4">
                {/* Địa chỉ */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <span className="text-2xl mr-2">📍</span>
                    Địa chỉ
                  </h3>
                  {settings.contactInfo?.addresses && settings.contactInfo.addresses.length > 0 ? (
                    <div className="space-y-3">
                      {settings.contactInfo.addresses.map((addr) => (
                        <div key={addr.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-primary-100 text-primary-700">
                              {addr.type === 'factory' ? '🏭 Nhà máy' : '🏪 Showroom'}
                            </span>
                            {addr.label && (
                              <span className="text-sm text-gray-600">{addr.label}</span>
                            )}
                          </div>
                          <p className="text-gray-700">{addr.address || 'Chưa có địa chỉ'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Chưa có địa chỉ nào</p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <span className="text-2xl mr-2">📞</span>
                    Điện thoại
                  </h3>
                  {settings.contactInfo?.phones && settings.contactInfo.phones.length > 0 ? (
                    <div className="space-y-2">
                      {settings.contactInfo.phones.map((phone) => (
                        <div key={phone.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${phone.number}`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              {phone.number || 'Chưa có số điện thoại'}
                            </a>
                            {phone.label && (
                              <span className="text-sm text-gray-600">({phone.label})</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Chưa có số điện thoại nào</p>
                  )}
                  {settings.contactInfo?.zalo && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
                        <span className="font-medium">Zalo:</span> {settings.contactInfo.zalo}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">✉️</span>
                    Email
                  </h3>
                  <p className="text-gray-700">{settings.contactInfo?.email || settings.email || 'Chưa có email'}</p>
                </div>
                {settings.contactInfo?.facebook && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <span className="text-2xl mr-2">📘</span>
                      Facebook
                    </h3>
                    <a href={settings.contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {settings.contactInfo.facebook}
                    </a>
                  </div>
                )}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">🕒</span>
                    Giờ làm việc
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    {settings.contactInfo?.workingHours?.weekdays && (
                      <p>{settings.contactInfo.workingHours.weekdays}</p>
                    )}
                    {settings.contactInfo?.workingHours?.saturday && (
                      <p>{settings.contactInfo.workingHours.saturday}</p>
                    )}
                    {settings.contactInfo?.workingHours?.sunday && (
                      <p>{settings.contactInfo.workingHours.sunday}</p>
                    )}
                    {!settings.contactInfo?.workingHours && (
                      <p>Chưa có thông tin giờ làm việc</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

