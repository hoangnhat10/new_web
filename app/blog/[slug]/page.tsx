/**
 * Trang chi tiết Blog Post
 */
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readBlogBySlug, readAllBlogs } from '@/lib/blogs';
import { readSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const settings = await readSettings();
  
  // Kiểm tra nếu blog bị tắt
  if (settings.blogEnabled === false) {
    notFound();
  }

  const { slug } = await params;
  const blog = await readBlogBySlug(slug);
  const allBlogs = await readAllBlogs();
  const relatedBlogs = allBlogs.filter((b) => b.slug !== slug && b.category === blog?.category).slice(0, 3);

  if (!blog) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-primary-600">Trang chủ</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary-600">Blog</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{blog.title}</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            {blog.category && (
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide bg-primary-50 px-4 py-2 rounded-full inline-block mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{blog.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <span className="font-medium">{blog.author}</span>
              <span>•</span>
              <span>{new Date(blog.publishedAt).toLocaleDateString('vi-VN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div 
              className="text-gray-700 leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ 
                __html: blog.content
                  .split('\n')
                  .map(line => {
                    // Kiểm tra nếu dòng chứa thẻ img
                    if (line.trim().startsWith('<img')) {
                      // Đảm bảo ảnh có class styling
                      return line.replace(
                        /<img([^>]*)>/g, 
                        '<img$1 class="w-full h-auto rounded-lg my-6 shadow-lg mx-auto" style="max-width: 100%; display: block;" />'
                      );
                    }
                    // Các dòng text thông thường
                    return line ? `<p class="mb-4 leading-relaxed">${line}</p>` : '<br />';
                  })
                  .join('')
              }}
            />
          </div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Bài viết liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="block bg-white rounded-xl shadow-md overflow-hidden hover-zoom group"
                  >
                    <div className="relative h-32 bg-gradient-to-br from-primary-200 to-primary-400 overflow-hidden">
                      {related.featuredImage ? (
                        <img
                          src={related.featuredImage}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">📝</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(related.publishedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-block luxury-gradient text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              ← Quay lại danh sách bài viết
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

