<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import type { ChatMessage } from '$lib/db/schema';
  import PlantForm from '$lib/components/PlantForm.svelte';
  import AIChat from '$lib/components/AIChat.svelte';
  import { plantsStore } from '$lib/stores/plants.svelte';
  import { tasksStore } from '$lib/stores/tasks.svelte';
  import { settingsStore } from '$lib/stores/settings.svelte';
  import { generateFollowUpQuestions, generateTasksFromPlantInfo } from '$lib/services/openai';

  type Step = 'form' | 'questions' | 'chat' | 'generating';

  let step = $state<Step>('form');
  let plantName = $state('');
  let plantLatinName = $state('');
  let plantImageFile = $state<File | undefined>(undefined);
  let questions = $state<string[]>([]);
  let chatMessages = $state<ChatMessage[]>([]);
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  async function handlePlantFormSubmit(
    data: { name: string; latinName: string },
    imageFile?: File
  ) {
    plantName = data.name;
    plantLatinName = data.latinName;
    plantImageFile = imageFile;

    // Check if user has API key
    if (!settingsStore.hasOpenAIKey()) {
      // Skip AI flow, just create the plant
      await createPlantAndFinish();
      return;
    }

    // Generate follow-up questions
    isLoading = true;
    error = null;
    
    try {
      const apiKey = settingsStore.getOpenAIKey()!;
      questions = await generateFollowUpQuestions(plantName, plantLatinName, apiKey);
      
      // Initialize chat with questions
      chatMessages = [
        {
          role: 'assistant',
          content: `Great! I'd like to learn more about your ${plantName} to provide better care recommendations. Here are some questions:\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nFeel free to answer them in your own words.`,
        },
      ];
      
      step = 'chat';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to generate questions';
      console.error('Failed to generate questions:', err);
    } finally {
      isLoading = false;
    }
  }

  async function handleChatComplete(messages: ChatMessage[]) {
    chatMessages = messages;
    step = 'generating';

    try {
      const apiKey = settingsStore.getOpenAIKey()!;
      
      // Create plant first
      const plant = await plantsStore.addPlant(
        {
          name: plantName,
          latinName: plantLatinName,
          otherInfo: extractInfoFromChat(messages),
        },
        plantImageFile
      );

      // Generate tasks
      const tasks = await generateTasksFromPlantInfo(plant, messages, apiKey);
      await tasksStore.addMultipleTasks(tasks);

      // Navigate to plant detail page
      goto(`${base}/plants/${plant.id}`);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create plant';
      console.error('Failed to create plant:', err);
      step = 'chat';
    }
  }

  async function createPlantAndFinish() {
    try {
      const plant = await plantsStore.addPlant(
        {
          name: plantName,
          latinName: plantLatinName,
        },
        plantImageFile
      );
      
      goto(`${base}/plants/${plant.id}`);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create plant';
      console.error('Failed to create plant:', err);
    }
  }

  function extractInfoFromChat(messages: ChatMessage[]): string {
    return messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n');
  }

  function goBack() {
    if (step === 'chat' && !isLoading) {
      step = 'form';
    } else {
      goto(base || '/');
    }
  }

  function skipAI() {
    createPlantAndFinish();
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div class="container mx-auto px-4 py-3 flex items-center gap-3">
      <button
        onclick={goBack}
        class="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
        disabled={isLoading || step === 'generating'}
      >
        ←
      </button>
      <h1 class="text-xl font-semibold flex-1">
        {#if step === 'form'}
          Add New Plant
        {:else if step === 'chat'}
          Tell Me More
        {:else if step === 'generating'}
          Creating Plant...
        {/if}
      </h1>
      {#if step === 'chat' && !isLoading}
        <button
          onclick={skipAI}
          class="text-sm text-gray-600 hover:text-gray-800 px-3 py-1"
        >
          Skip
        </button>
      {/if}
    </div>
  </div>

  <div class="container mx-auto px-4 py-6 max-w-2xl">
    {#if error}
      <div class="card bg-red-50 border border-red-200 text-red-700 mb-4">
        <p class="font-semibold mb-1">Error</p>
        <p class="text-sm">{error}</p>
        <button
          onclick={() => error = null}
          class="mt-3 btn btn-secondary text-sm"
        >
          Dismiss
        </button>
      </div>
    {/if}

    {#if step === 'form'}
      <div class="card">
        <PlantForm
          onSubmit={handlePlantFormSubmit}
          onCancel={() => goto(base || '/')}
          submitLabel="Continue"
        />

        {#if !settingsStore.hasOpenAIKey()}
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Configure your OpenAI API key in Settings to get AI-powered care recommendations!
            </p>
          </div>
        {/if}
      </div>
    {:else if step === 'chat'}
      <div class="card h-[calc(100vh-12rem)] flex flex-col">
        <AIChat
          apiKey={settingsStore.getOpenAIKey() || ''}
          initialMessages={chatMessages}
          systemPrompt="You are a knowledgeable and friendly gardening assistant helping users track their plants. Ask follow-up questions about their plants and provide helpful gardening advice."
          onComplete={handleChatComplete}
        />
      </div>
    {:else if step === 'generating'}
      <div class="card text-center py-16">
        <div class="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Creating Your Plant
        </h2>
        <p class="text-gray-600">
          Generating personalized care tasks with AI...
        </p>
      </div>
    {/if}

    {#if isLoading && step === 'form'}
      <div class="card text-center py-16 mt-4">
        <div class="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Preparing questions...</p>
      </div>
    {/if}
  </div>
</div>

