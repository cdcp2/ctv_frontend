export type BasicCategory = {
  id?: number;
  name?: string | null;
  slug?: string | null;
};

// Normalizes a string into a URL-friendly slug.
export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Ensures categories always expose a usable slug, even if the API returns it empty.
export function withCategorySlug<T extends BasicCategory>(category: T) {
  const provided = (category.slug ?? '').trim();
  if (provided) return { ...category, slug: provided };

  const fromName = slugify(category.name ?? '');
  const fallback = fromName || (category.id ? `categoria-${category.id}` : 'categoria');

  return { ...category, slug: fallback };
}
