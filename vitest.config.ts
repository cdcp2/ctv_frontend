import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.test.{ts,tsx}'],
		exclude: [...configDefaults.exclude, 'e2e/**'],
		coverage: {
			reporter: ['text', 'html'],
			include: ['src/**/*.{ts,tsx,js,jsx}'],
		},
	},
});
