import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	getArticle,
	getCategories,
	getVideos,
	incrementViews,
	listArticles,
} from './api';

const API_BASE = 'http://localhost:3000';

const jsonResponse = (data: unknown, status = 200) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

describe('api client', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns parsed categories on success', async () => {
		const payload = [{ id: 1, name: 'Local', slug: 'local', description: null }];
		vi.stubGlobal(
			'fetch',
			vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
				expect(url).toBe(`${API_BASE}/api/categories`);
				expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
				return jsonResponse(payload);
			}),
		);

		const result = await getCategories();

		expect(result).toEqual(payload);
	});

	it('returns null when the API responds with an error status', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async (url: RequestInfo | URL) => {
				expect(url).toBe(`${API_BASE}/api/articles/broken`);
				return jsonResponse({ error: 'oops' }, 500);
			}),
		);

		const result = await getArticle('broken');

		expect(result).toBeNull();
	});

	it('serializes only defined filters in listArticles', async () => {
		const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
			expect(url).toBe(`${API_BASE}/api/articles?category_id=7&search=playa&is_featured=true`);
			return jsonResponse([]);
		});
		vi.stubGlobal('fetch', fetchMock);

		await listArticles({ category_id: 7, search: 'playa', is_featured: true, has_video: undefined });

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('uses the fallback videos endpoint when the dedicated one is empty', async () => {
		const fallbackPayload = [
			{
				id: 1,
				title: 'Video',
				slug: 'video-1',
				content: 'content',
				status: 'published',
				is_featured: false,
				is_breaking: false,
				views_count: 0,
			},
		];

		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse([]))
			.mockResolvedValueOnce(jsonResponse(fallbackPayload));

		vi.stubGlobal('fetch', fetchMock);

		const videos = await getVideos();

		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			`${API_BASE}/api/articles/videos`,
			expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }),
		);
		expect(fetchMock).toHaveBeenNthCalledWith(
			2,
			`${API_BASE}/api/articles?has_video=true`,
			expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }),
		);
		expect(videos).toEqual(fallbackPayload);
	});

	it('does not throw if incrementViews fails', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))));

		await expect(incrementViews('slug')).resolves.toBeUndefined();
		expect(warnSpy).toHaveBeenCalled();
	});
});
