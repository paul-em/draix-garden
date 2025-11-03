<script lang="ts">
  import type { PlantWithPhoto } from '$lib/db/schema';
  
  interface Props {
    plant: PlantWithPhoto;
    onclick?: () => void;
  }

  let { plant, onclick }: Props = $props();
</script>

<button
  onclick={onclick}
  class="card hover:shadow-lg transition-shadow duration-200 text-left w-full"
>
  {#if plant.thumbnailUrl}
    <div class="w-full aspect-video rounded-lg overflow-hidden mb-3 bg-gray-100">
      <img 
        src={plant.thumbnailUrl} 
        alt={plant.name}
        class="w-full h-full object-cover"
      />
    </div>
  {:else}
    <div class="w-full aspect-video rounded-lg bg-gradient-to-br from-green-100 to-green-200 mb-3 flex items-center justify-center">
      <span class="text-6xl">🌱</span>
    </div>
  {/if}

  <h3 class="font-semibold text-lg text-gray-900 mb-1">{plant.name}</h3>
  <p class="text-sm text-gray-600 italic">{plant.latinName}</p>
  
  {#if plant.age}
    <p class="text-xs text-gray-500 mt-2">Age: {plant.age}</p>
  {/if}
</button>

