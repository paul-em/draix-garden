<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	const navItems = [
		{ path: '/', label: 'Plants', icon: '🌱' },
		{ path: '/settings', label: 'Settings', icon: '⚙️' }
	];

	function isActive(path: string): boolean {
		return $page.url.pathname === path;
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
					onclick={() => goto(item.path)}
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
