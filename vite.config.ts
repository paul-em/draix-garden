import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'production',
			strategies: 'generateSW',
			scope: '/',
			base: '/',
			manifest: {
				short_name: 'Garden',
				name: 'Garden Plant Tracker',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#16a34a',
				background_color: '#f0fdf4',
				orientation: 'portrait',
				icons: [
					{
						src: '/icon-192.png',
						type: 'image/png',
						sizes: '192x192',
					},
					{
						src: '/icon-512.png',
						type: 'image/png',
						sizes: '512x512',
					},
					{
						src: '/icon-512.png',
						type: 'image/png',
						sizes: '512x512',
						purpose: 'any maskable',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
						handler: 'NetworkOnly',
					},
				],
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/',
			},
		}),
	],
});
