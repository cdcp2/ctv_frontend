const API_BASE = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000';

export type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  main_image_url?: string | null;
  video_embed_url?: string | null;
  author_id?: number | null;
  category_id?: number | null;
  status: string;
  is_featured: boolean;
  is_breaking: boolean;
  views_count: number;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type SiteConfig = {
  id: number;
  live_stream_url?: string | null;
  is_live_active: boolean;
  breaking_news_banner?: string | null;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (e) {
    console.error('API error', path, e);
    return null;
  }
}

export async function getCategories() {
  return apiFetch<Category[]>('/api/categories');
}

export async function getSiteConfig() {
  return apiFetch<SiteConfig>('/api/site-config');
}

export type ArticleFilters = {
  category_id?: number;
  search?: string;
  is_featured?: boolean;
  is_breaking?: boolean;
  has_video?: boolean;
  tag_id?: number;
};

export async function listArticles(params: ArticleFilters = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  });
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch<Article[]>(`/api/articles${query}`);
}

export async function getArticle(slug: string) {
  return apiFetch<Article>(`/api/articles/${slug}`);
}

export async function getRelated(slug: string) {
  return apiFetch<Article[]>(`/api/articles/${slug}/related`);
}

export async function getArticleTags(slug: string) {
  return apiFetch<Tag[]>(`/api/articles/${slug}/tags`);
}

export async function incrementViews(slug: string) {
  try {
    await fetch(`${API_BASE}/api/articles/${slug}/view`, { method: 'POST' });
  } catch (e) {
    console.warn('incrementViews failed', e);
  }
}

export async function getFeatured() {
  return apiFetch<Article[]>(`/api/articles/featured`);
}

export async function getBreaking() {
  return apiFetch<Article[]>(`/api/articles/breaking`);
}

export async function getVideos() {
  // Intento principal: endpoint dedicado
  const primary = await apiFetch<Article[]>(`/api/articles/videos`);
  if (primary && primary.length) return primary;
  // Fallback: artículos con video (usa filtro has_video)
  return apiFetch<Article[]>(`/api/articles?has_video=true`);
}

export async function getMostRead() {
  return apiFetch<Article[]>(`/api/articles/most-read`);
}
