/**
 * Trang Blog - Hiển thị danh sách bài viết
 */
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readAllBlogs } from '@/lib/blogs';
import { readSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const settings = await readSettings();
  
  // Kiểm tra nếu blog bị tắt
  if (settings.blogEnabled === false) {
    notFound();
  }

  const blogs = await readAllBlogs();
  const sortedBlogs = [...blogs].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 px-4">Blog & Tin Tức</h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
            Cập nhật những thông tin mới nhất về cổng nhôm đúc, xu hướng thiết kế và kinh nghiệm lắp đặt
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-1 luxury-gradient mx-auto rounded-full mt-3 sm:mt-4"></div>
        </div>

        {/* Blog Grid */}
        {sortedBlogs.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4">📝</div>
            <p className="text-gray-600 text-lg sm:text-xl font-medium">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedBlogs.map((blog, index) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="block bg-white rounded-2xl shadow-lg overflow-hidden hover-zoom group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 bg-gradient-to-br from-primary-200 to-primary-400 overflow-hidden">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">📝</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {blog.category && (
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide bg-primary-50 px-3 py-1 rounded-full inline-block mb-3">
                      {blog.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{blog.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(blog.publishedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <span className="text-primary-600 font-semibold text-sm group-hover:underline">
                      Đọc thêm →
                    </span>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

