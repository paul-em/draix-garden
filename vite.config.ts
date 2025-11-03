import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	base: process.env.NODE_ENV === 'production' ? '/draix-garden/' : '/',
	build: {
		minify: 'esbuild',
	},
	plugins: [
		sveltekit(),
		// Temporarily disabled PWA plugin due to Vite 7 compatibility issue
		// Will be re-enabled once the plugin is updated
		// SvelteKitPWA({
		// 	srcDir: './src',
		// 	mode: 'production',
		// 	strategies: 'generateSW',
		// 	minify: false,
		// 	scope: '/draix-garden/',
		// 	base: '/draix-garden/',
		// 	manifest: {
		// 		short_name: 'Garden',
		// 		name: 'Garden Plant Tracker',
		// 		start_url: '/draix-garden/',
		// 		scope: '/draix-garden/',
		// 		display: 'standalone',
		// 		theme_color: '#16a34a',
		// 		background_color: '#f0fdf4',
		// 		orientation: 'portrait',
		// 		icons: [
		// 			{
		// 				src: '/icon-192.png',
		// 				type: 'image/png',
		// 				sizes: '192x192',
		// 			},
		// 			{
		// 				src: '/icon-512.png',
		// 				type: 'image/png',
		// 				sizes: '512x512',
		// 			},
		// 			{
		// 				src: '/icon-512.png',
		// 				type: 'image/png',
		// 				sizes: '512x512',
		// 				purpose: 'any maskable',
		// 			},
		// 		],
		// 	},
		// 	workbox: {
		// 		globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
		// 		runtimeCaching: [
		// 			{
		// 				urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
		// 				handler: 'NetworkOnly',
		// 			},
		// 		],
		// 		sourcemap: false,
		// 	},
		// 	injectManifest: {
		// 		globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
		// 		minify: false,
		// 	},
		// }),
	],
});
