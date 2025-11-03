<script lang="ts">
  import type { Task } from '$lib/db/schema';
  import TaskItem from './TaskItem.svelte';
  
  interface Props {
    tasks: Task[];
    onToggle: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onAddTask?: () => void;
  }

  let { tasks, onToggle, onEdit, onDelete, onAddTask }: Props = $props();

  const incompleteTasks = $derived(tasks.filter(t => !t.completed));
  const completedTasks = $derived(tasks.filter(t => t.completed));
</script>

<div class="space-y-4">
  {#if onAddTask}
    <button
      onclick={onAddTask}
      class="w-full btn btn-primary"
    >
      ➕ Add Task
    </button>
  {/if}

  {#if incompleteTasks.length > 0}
    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Upcoming Tasks
      </h3>
      {#each incompleteTasks as task (task.id)}
        <TaskItem
          {task}
          onToggle={() => onToggle(task.id)}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      {/each}
    </div>
  {/if}

  {#if completedTasks.length > 0}
    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Completed
      </h3>
      {#each completedTasks as task (task.id)}
        <TaskItem
          {task}
          onToggle={() => onToggle(task.id)}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      {/each}
    </div>
  {/if}

  {#if tasks.length === 0}
    <div class="card text-center py-12">
      <span class="text-6xl mb-4 block">📋</span>
      <p class="text-gray-600">No tasks yet</p>
      {#if onAddTask}
        <button
          onclick={onAddTask}
          class="mt-4 btn btn-primary"
        >
          Add First Task
        </button>
      {/if}
    </div>
  {/if}
</div>

