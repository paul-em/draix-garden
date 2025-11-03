<script lang="ts">
  import { settingsStore } from '$lib/stores/settings.svelte';
  
  let apiKey = $state(settingsStore.getOpenAIKey() || '');
  let showKey = $state(false);
  let saveMessage = $state('');

  function handleSave() {
    settingsStore.setOpenAIKey(apiKey);
    saveMessage = 'API key saved successfully!';
    setTimeout(() => {
      saveMessage = '';
    }, 3000);
  }

  function handleClear() {
    apiKey = '';
    settingsStore.clearOpenAIKey();
    saveMessage = 'API key cleared';
    setTimeout(() => {
      saveMessage = '';
    }, 3000);
  }

  function toggleShowKey() {
    showKey = !showKey;
  }
</script>

<div class="space-y-6">
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">OpenAI API Configuration</h2>
    
    <div class="space-y-4">
      <div>
        <label class="label" for="apiKey">
          OpenAI API Key
        </label>
        <div class="relative">
          <input
            id="apiKey"
            bind:value={apiKey}
            type={showKey ? 'text' : 'password'}
            placeholder="sk-..."
            class="input pr-20"
          />
          <button
            type="button"
            onclick={toggleShowKey}
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 px-3 py-1 text-sm"
          >
            {showKey ? '🙈' : '👁️'}
          </button>
        </div>
        <p class="text-xs text-gray-600 mt-1">
          Your API key is stored locally and never sent anywhere except OpenAI.
        </p>
      </div>

      {#if saveMessage}
        <div 
          class="px-4 py-2 rounded-lg text-sm"
          class:bg-green-50={saveMessage.includes('success')}
          class:text-green-700={saveMessage.includes('success')}
          class:bg-gray-50={!saveMessage.includes('success')}
          class:text-gray-700={!saveMessage.includes('success')}
        >
          {saveMessage}
        </div>
      {/if}

      <div class="flex gap-3">
        <button
          onclick={handleSave}
          class="flex-1 btn btn-primary"
        >
          Save API Key
        </button>
        <button
          onclick={handleClear}
          class="btn btn-secondary"
        >
          Clear
        </button>
      </div>
    </div>
  </div>

  <div class="card bg-blue-50 border border-blue-200">
    <h3 class="font-semibold mb-2">How to get an API key:</h3>
    <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
      <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">platform.openai.com/api-keys</a></li>
      <li>Create a new account or sign in</li>
      <li>Click "Create new secret key"</li>
      <li>Copy the key and paste it above</li>
    </ol>
  </div>

  <div class="card">
    <h2 class="text-xl font-semibold mb-4">About</h2>
    <p class="text-sm text-gray-700">
      Garden Plant Tracker helps you manage your garden plants with AI-powered care recommendations.
    </p>
    <p class="text-xs text-gray-500 mt-4">
      Version 1.0.0
    </p>
  </div>
</div>

