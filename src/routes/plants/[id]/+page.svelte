<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import type { Plant, Task } from '$lib/db/schema';
  import { plantsStore } from '$lib/stores/plants.svelte';
  import { tasksStore } from '$lib/stores/tasks.svelte';
  import { settingsStore } from '$lib/stores/settings.svelte';
  import TaskList from '$lib/components/TaskList.svelte';
  import { generateTasksFromPlantInfo } from '$lib/services/openai';
  import { createImageUrl } from '$lib/services/image';

  let plant = $state<Plant | undefined>(undefined);
  let fullImageUrl = $state<string | undefined>(undefined);
  let loading = $state(true);
  let showTaskModal = $state(false);
  let editingTask = $state<Task | undefined>(undefined);
  let taskDescription = $state('');
  let taskDateRange = $state('');
  let isGeneratingTasks = $state(false);
  let showDeleteConfirm = $state(false);

  const plantId = $derived($page.params.id);

  onMount(async () => {
    if (plantId) {
      plant = await plantsStore.getPlant(plantId);
      await tasksStore.loadTasksForPlant(plantId);
      
      // Load full image
      const photo = await plantsStore.getPlantPhoto(plantId);
      if (photo?.fullImage) {
        fullImageUrl = createImageUrl(photo.fullImage);
      }
      
      loading = false;
    }
  });

  function openAddTask() {
    editingTask = undefined;
    taskDescription = '';
    taskDateRange = '';
    showTaskModal = true;
  }

  function openEditTask(task: Task) {
    editingTask = task;
    taskDescription = task.description;
    taskDateRange = task.dateRange;
    showTaskModal = true;
  }

  function closeTaskModal() {
    showTaskModal = false;
    editingTask = undefined;
    taskDescription = '';
    taskDateRange = '';
  }

  async function saveTask() {
    if (!plant || !taskDescription.trim() || !taskDateRange.trim()) return;

    if (editingTask) {
      await tasksStore.updateTask({
        ...editingTask,
        description: taskDescription.trim(),
        dateRange: taskDateRange.trim(),
      });
    } else {
      await tasksStore.addTask({
        plantId: plant.id,
        description: taskDescription.trim(),
        dateRange: taskDateRange.trim(),
        completed: false,
      });
    }

    closeTaskModal();
  }

  async function deleteTask(taskId: string) {
    if (plant) {
      await tasksStore.deleteTask(taskId, plant.id);
    }
  }

  async function toggleTask(taskId: string) {
    if (plant) {
      await tasksStore.toggleCompletion(taskId, plant.id);
    }
  }

  async function regenerateTasks() {
    if (!plant || !settingsStore.hasOpenAIKey()) {
      alert('Please configure your OpenAI API key in Settings first.');
      return;
    }

    if (!confirm('This will generate new AI-powered care tasks. Continue?')) {
      return;
    }

    isGeneratingTasks = true;

    try {
      const apiKey = settingsStore.getOpenAIKey()!;
      const tasks = await generateTasksFromPlantInfo(plant, [], apiKey);
      await tasksStore.addMultipleTasks(tasks);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate tasks');
      console.error('Failed to generate tasks:', error);
    } finally {
      isGeneratingTasks = false;
    }
  }

  async function confirmDeletePlant() {
    if (plant) {
      await plantsStore.deletePlant(plant.id);
      goto(base || '/');
    }
  }

  function goBack() {
    goto(base || '/');
  }
</script>

<div class="min-h-screen bg-gray-50">
  {#if loading}
    <div class="flex justify-center items-center py-20">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Loading plant...</p>
      </div>
    </div>
  {:else if !plant}
    <div class="container mx-auto px-4 py-6 max-w-2xl">
      <div class="card bg-red-50 border border-red-200 text-red-700">
        <p class="font-semibold mb-1">Plant not found</p>
        <button onclick={goBack} class="mt-3 btn btn-primary">
          Go Back
        </button>
      </div>
    </div>
  {:else}
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex items-center gap-3">
        <button
          onclick={goBack}
          class="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h1 class="text-xl font-semibold flex-1 truncate">{plant.name}</h1>
        <button
          onclick={() => showDeleteConfirm = true}
          class="text-2xl p-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      <!-- Plant Image -->
      {#if fullImageUrl}
        <div class="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-lg">
          <img 
            src={fullImageUrl} 
            alt={plant.name}
            class="w-full h-full object-cover"
          />
        </div>
      {:else}
        <div class="w-full aspect-video rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-lg">
          <span class="text-8xl">🌱</span>
        </div>
      {/if}

      <!-- Plant Info -->
      <div class="card">
        <h2 class="text-2xl font-bold text-gray-900 mb-1">{plant.name}</h2>
        <p class="text-lg text-gray-600 italic mb-4">{plant.latinName}</p>
        
        {#if plant.age}
          <div class="mb-2">
            <span class="text-sm font-semibold text-gray-700">Age:</span>
            <span class="text-sm text-gray-600 ml-2">{plant.age}</span>
          </div>
        {/if}
        
        {#if plant.goals}
          <div class="mb-2">
            <span class="text-sm font-semibold text-gray-700">Goals:</span>
            <span class="text-sm text-gray-600 ml-2">{plant.goals}</span>
          </div>
        {/if}
        
        {#if plant.otherInfo}
          <div>
            <span class="text-sm font-semibold text-gray-700">Notes:</span>
            <p class="text-sm text-gray-600 mt-1">{plant.otherInfo}</p>
          </div>
        {/if}
      </div>

      <!-- Tasks Section -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Care Tasks</h2>
          <button
            onclick={regenerateTasks}
            disabled={isGeneratingTasks}
            class="btn btn-secondary text-sm"
          >
            {isGeneratingTasks ? '⏳ Generating...' : '✨ AI Generate'}
          </button>
        </div>

        <TaskList
          tasks={tasksStore.tasks}
          onToggle={toggleTask}
          onEdit={openEditTask}
          onDelete={deleteTask}
          onAddTask={openAddTask}
        />
      </div>
    </div>
  {/if}
</div>

<!-- Task Modal -->
{#if showTaskModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
    <div class="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-semibold mb-4">
        {editingTask ? 'Edit Task' : 'Add Task'}
      </h3>

      <div class="space-y-4">
        <div>
          <label class="label" for="description">Description</label>
          <textarea
            id="description"
            bind:value={taskDescription}
            placeholder="e.g., Prune back to promote new growth"
            rows="3"
            class="input resize-none"
          ></textarea>
        </div>

        <div>
          <label class="label" for="dateRange">Date Range</label>
          <input
            id="dateRange"
            bind:value={taskDateRange}
            type="text"
            placeholder="e.g., 1.11 - 30.11 or just 15.03"
            class="input"
          />
        </div>

        <div class="flex gap-3 pt-2">
          <button
            onclick={closeTaskModal}
            class="flex-1 btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onclick={saveTask}
            disabled={!taskDescription.trim() || !taskDateRange.trim()}
            class="flex-1 btn btn-primary disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl w-full max-w-sm p-6">
      <h3 class="text-xl font-semibold mb-2">Delete Plant?</h3>
      <p class="text-gray-600 mb-6">
        This will permanently delete {plant?.name} and all its tasks. This action cannot be undone.
      </p>

      <div class="flex gap-3">
        <button
          onclick={() => showDeleteConfirm = false}
          class="flex-1 btn btn-secondary"
        >
          Cancel
        </button>
        <button
          onclick={confirmDeletePlant}
          class="flex-1 btn bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}

