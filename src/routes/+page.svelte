<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import PlantCard from '$lib/components/PlantCard.svelte';
  import { plantsStore } from '$lib/stores/plants.svelte';

  let searchQuery = $state('');

  onMount(() => {
    plantsStore.loadPlants();
  });

  const filteredPlants = $derived(
    plantsStore.plants.filter(plant => 
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.latinName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function goToAddPlant() {
    goto('/plants/add');
  }

  function goToPlant(id: string) {
    goto(`/plants/${id}`);
  }
</script>

<div class="container mx-auto px-4 py-6 max-w-6xl">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">My Garden</h1>
    
    <div class="flex gap-3 mb-4">
      <input
        bind:value={searchQuery}
        type="search"
        placeholder="Search plants..."
        class="input flex-1"
      />
      <button
        onclick={goToAddPlant}
        class="btn btn-primary px-6 whitespace-nowrap"
      >
        ➕ Add Plant
      </button>
    </div>
  </div>

  {#if plantsStore.loading}
    <div class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Loading plants...</p>
      </div>
    </div>
  {:else if plantsStore.error}
    <div class="card bg-red-50 border border-red-200 text-red-700">
      <p class="font-semibold mb-1">Error loading plants</p>
      <p class="text-sm">{plantsStore.error}</p>
      <button
        onclick={() => plantsStore.loadPlants()}
        class="mt-3 btn btn-primary"
      >
        Retry
      </button>
    </div>
  {:else if filteredPlants.length === 0}
    <div class="card text-center py-16">
      {#if searchQuery}
        <span class="text-6xl mb-4 block">🔍</span>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">No plants found</h2>
        <p class="text-gray-600 mb-6">
          Try a different search term
        </p>
        <button
          onclick={() => searchQuery = ''}
          class="btn btn-secondary"
        >
          Clear Search
        </button>
      {:else}
        <span class="text-6xl mb-4 block">🌱</span>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">No plants yet</h2>
        <p class="text-gray-600 mb-6">
          Start tracking your garden by adding your first plant
        </p>
        <button
          onclick={goToAddPlant}
          class="btn btn-primary"
        >
          Add Your First Plant
        </button>
      {/if}
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each filteredPlants as plant (plant.id)}
        <PlantCard 
          {plant} 
          onclick={() => goToPlant(plant.id)}
        />
      {/each}
    </div>
  {/if}
</div>
