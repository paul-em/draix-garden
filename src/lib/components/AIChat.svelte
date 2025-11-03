<script lang="ts">
  import type { ChatMessage } from '$lib/db/schema';
  import { chatWithAI } from '$lib/services/openai';
  
  interface Props {
    apiKey: string;
    initialMessages?: ChatMessage[];
    systemPrompt?: string;
    onComplete?: (messages: ChatMessage[]) => void;
  }

  let { 
    apiKey, 
    initialMessages = [], 
    systemPrompt = 'You are a helpful gardening assistant.',
    onComplete 
  }: Props = $props();

  let messages = $state<ChatMessage[]>(initialMessages);
  let inputValue = $state('');
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let chatContainer: HTMLDivElement;

  async function sendMessage() {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
    };

    messages = [...messages, userMessage];
    inputValue = '';
    isLoading = true;
    error = null;

    try {
      const messagesToSend: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages,
      ];

      const response = await chatWithAI(messagesToSend, apiKey);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
      };

      messages = [...messages, assistantMessage];

      // Scroll to bottom
      setTimeout(() => {
        chatContainer?.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);

    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to send message';
      console.error('Chat error:', err);
    } finally {
      isLoading = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleComplete() {
    if (onComplete) {
      onComplete(messages);
    }
  }
</script>

<div class="flex flex-col h-full">
  <div 
    bind:this={chatContainer}
    class="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50"
  >
    {#each messages as message (message)}
      <div 
        class="flex"
        class:justify-end={message.role === 'user'}
        class:justify-start={message.role === 'assistant'}
      >
        <div 
          class="max-w-[80%] rounded-lg px-4 py-2"
          class:bg-primary-600={message.role === 'user'}
          class:text-white={message.role === 'user'}
          class:bg-white={message.role === 'assistant'}
          class:text-gray-900={message.role === 'assistant'}
          class:shadow-md={message.role === 'assistant'}
        >
          <p class="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    {/each}

    {#if isLoading}
      <div class="flex justify-start">
        <div class="bg-white rounded-lg px-4 py-2 shadow-md">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></span>
          </div>
        </div>
      </div>
    {/if}

    {#if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
        {error}
      </div>
    {/if}
  </div>

  <div class="border-t border-gray-200 bg-white p-4">
    <div class="flex gap-2">
      <input
        bind:value={inputValue}
        onkeydown={handleKeyDown}
        placeholder="Type your answer..."
        class="input flex-1"
        disabled={isLoading}
      />
      <button
        onclick={sendMessage}
        disabled={isLoading || !inputValue.trim()}
        class="btn btn-primary px-6"
      >
        Send
      </button>
    </div>
    
    {#if onComplete}
      <button
        onclick={handleComplete}
        class="w-full mt-2 btn btn-secondary"
      >
        Continue
      </button>
    {/if}
  </div>
</div>

