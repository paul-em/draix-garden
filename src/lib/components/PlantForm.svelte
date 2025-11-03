<script lang="ts">
  import type { Plant } from '$lib/db/schema';
  import ImageUpload from './ImageUpload.svelte';
  
  interface Props {
    plant?: Plant;
    onSubmit: (data: { name: string; latinName: string }, imageFile?: File) => void;
    onCancel?: () => void;
    submitLabel?: string;
  }

  let { 
    plant, 
    onSubmit, 
    onCancel,
    submitLabel = 'Save Plant'
  }: Props = $props();

  let name = $state(plant?.name || '');
  let latinName = $state(plant?.latinName || '');
  let imageFile = $state<File | undefined>(undefined);

  function handleImageSelected(file: File) {
    imageFile = file;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (name.trim() && latinName.trim()) {
      onSubmit({ name: name.trim(), latinName: latinName.trim() }, imageFile);
    }
  }

  const isValid = $derived(name.trim().length > 0 && latinName.trim().length > 0);
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  <div>
    <label class="label" for="name">Plant Name</label>
    <input
      id="name"
      bind:value={name}
      type="text"
      placeholder="e.g., Tomato"
      class="input"
      required
    />
  </div>

  <div>
    <label class="label" for="latinName">Latin Name</label>
    <input
      id="latinName"
      bind:value={latinName}
      type="text"
      placeholder="e.g., Solanum lycopersicum"
      class="input"
      required
    />
  </div>

  <ImageUpload onImageSelected={handleImageSelected} />

  <div class="flex gap-3 pt-4">
    {#if onCancel}
      <button
        type="button"
        onclick={onCancel}
        class="flex-1 btn btn-secondary"
      >
        Cancel
      </button>
    {/if}
    <button
      type="submit"
      disabled={!isValid}
      class="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {submitLabel}
    </button>
  </div>
</form>

