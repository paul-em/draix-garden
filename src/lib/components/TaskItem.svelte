<script lang="ts">
  import type { Task } from '$lib/db/schema';
  
  interface Props {
    task: Task;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }

  let { task, onToggle, onEdit, onDelete }: Props = $props();
</script>

<div class="card flex items-start gap-3">
  <button
    onclick={onToggle}
    class="flex-shrink-0 w-6 h-6 rounded border-2 mt-1 transition-colors"
    class:border-primary-600={task.completed}
    class:bg-primary-600={task.completed}
    class:border-gray-300={!task.completed}
  >
    {#if task.completed}
      <span class="text-white text-sm">✓</span>
    {/if}
  </button>

  <div class="flex-1 min-w-0">
    <p 
      class="text-gray-900 mb-1"
      class:line-through={task.completed}
      class:text-gray-500={task.completed}
    >
      {task.description}
    </p>
    <p class="text-sm text-primary-600 font-medium">
      📅 {task.dateRange}
    </p>
  </div>

  <div class="flex gap-2 flex-shrink-0">
    <button
      onclick={onEdit}
      class="text-gray-600 hover:text-primary-600 transition-colors p-1"
      aria-label="Edit task"
    >
      ✏️
    </button>
    <button
      onclick={onDelete}
      class="text-gray-600 hover:text-red-600 transition-colors p-1"
      aria-label="Delete task"
    >
      🗑️
    </button>
  </div>
</div>

