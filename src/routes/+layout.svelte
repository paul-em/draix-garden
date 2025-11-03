<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	const navItems = [
		{ path: '/', label: 'Plants', icon: '🌱' },
		{ path: '/settings', label: 'Settings', icon: '⚙️' }
	];

	function isActive(path: string): boolean {
		const fullPath = path === '/' ? base || '/' : `${base}${path}`;
		return $page.url.pathname === fullPath;
	}

	// Service Worker registration and update handling
	onMount(() => {
		if (browser && 'serviceWorker' in navigator) {
			registerServiceWorker();
		}
	});

	async function registerServiceWorker() {
		try {
			const registration = await navigator.serviceWorker.register(`${base}/sw.js`, {
				scope: `${base}/`
			});

			console.log('[App] Service Worker registered:', registration);

			// Check for updates on page load
			registration.update();

			// Listen for new service worker waiting to activate
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;
				if (!newWorker) return;

				console.log('[App] New service worker found, installing...');

				newWorker.addEventListener('statechange', () => {
					console.log('[App] Service worker state:', newWorker.state);
					
					if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
						// New service worker is installed and waiting
						console.log('[App] New version available, reloading...');
						// Tell the service worker to skip waiting
						newWorker.postMessage({ type: 'SKIP_WAITING' });
					}
				});
			});

			// Listen for service worker taking control
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				console.log('[App] Service worker controller changed, reloading page...');
				// New service worker has taken control, reload the page
				window.location.reload();
			});

			// Check for updates periodically (every 5 minutes)
			setInterval(() => {
				console.log('[App] Checking for service worker updates...');
				registration.update();
			}, 5 * 60 * 1000);

			// Also check when the page becomes visible again
			document.addEventListener('visibilitychange', () => {
				if (!document.hidden) {
					console.log('[App] Page visible, checking for updates...');
					registration.update();
				}
			});

		} catch (error) {
			console.error('[App] Service Worker registration failed:', error);
		}
	}
</script>

<svelte:head>
	<title>Garden Plant Tracker</title>
	<meta name="description" content="Track and manage your garden plants" />
	<meta name="theme-color" content="#16a34a" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</svelte:head>

<div class="min-h-screen flex flex-col pb-16">
	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>

	<!-- Bottom Navigation -->
	<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
		<div class="flex justify-around items-center h-16">
			{#each navItems as item}
				<button
					onclick={() => goto(item.path === '/' ? (base || '/') : `${base}${item.path}`)}
					class="flex flex-col items-center justify-center w-full h-full transition-colors"
					class:text-primary-600={isActive(item.path)}
					class:text-gray-500={!isActive(item.path)}
				>
					<span class="text-2xl">{item.icon}</span>
					<span class="text-xs mt-1 font-medium">{item.label}</span>
				</button>
			{/each}
		</div>
	</nav>
</div>

<style>
	.safe-area-bottom {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
