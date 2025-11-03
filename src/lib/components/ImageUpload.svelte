<script lang="ts">
  interface Props {
    onImageSelected: (file: File) => void;
    currentImageUrl?: string;
    label?: string;
  }

  let { onImageSelected, currentImageUrl, label = 'Plant Photo' }: Props = $props();
  
  let fileInput: HTMLInputElement;
  let previewUrl = $state<string | undefined>(currentImageUrl);

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      if (previewUrl && previewUrl !== currentImageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      previewUrl = URL.createObjectURL(file);
      onImageSelected(file);
    }
  }

  function triggerFileInput() {
    fileInput.click();
  }

  $effect(() => {
    return () => {
      if (previewUrl && previewUrl !== currentImageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  });
</script>

<div class="space-y-2">
  <label for="plant-photo-input" class="label">{label}</label>
  
  <div class="relative">
    {#if previewUrl}
      <div class="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
        <img 
          src={previewUrl} 
          alt="Plant preview" 
          class="w-full h-full object-cover"
        />
        <button
          type="button"
          onclick={triggerFileInput}
          class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center"
        >
          <span class="text-white opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            Change Photo
          </span>
        </button>
      </div>
    {:else}
      <button
        type="button"
        onclick={triggerFileInput}
        class="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
      >
        <span class="text-4xl mb-2">📷</span>
        <span class="text-sm text-gray-600">Tap to add photo</span>
      </button>
    {/if}
  </div>

  <input
    id="plant-photo-input"
    bind:this={fileInput}
    type="file"
    accept="image/*"
    capture="environment"
    onchange={handleFileChange}
    class="hidden"
  />
</div>

