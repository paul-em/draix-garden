import type { Task } from '$lib/db/schema';
import * as db from '$lib/db/db';

class TasksStore {
  tasks = $state<Task[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);

  async loadTasks() {
    this.loading = true;
    this.error = null;
    
    try {
      const tasks = await db.getAllTasks();
      this.tasks = tasks.sort((a, b) => b.createdAt - a.createdAt);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load tasks';
      console.error('Failed to load tasks:', err);
    } finally {
      this.loading = false;
    }
  }

  async loadTasksForPlant(plantId: string) {
    this.loading = true;
    this.error = null;
    
    try {
      const tasks = await db.getTasksByPlantId(plantId);
      this.tasks = tasks.sort((a, b) => b.createdAt - a.createdAt);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load tasks';
      console.error('Failed to load tasks:', err);
    } finally {
      this.loading = false;
    }
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Date.now();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await db.addTask(newTask);
    await this.loadTasksForPlant(task.plantId);
    return newTask;
  }

  async addMultipleTasks(tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]) {
    const now = Date.now();
    
    for (const task of tasks) {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      await db.addTask(newTask);
    }
    
    if (tasks.length > 0) {
      await this.loadTasksForPlant(tasks[0].plantId);
    }
  }

  async updateTask(task: Task) {
    task.updatedAt = Date.now();
    await db.updateTask(task);
    await this.loadTasksForPlant(task.plantId);
  }

  async deleteTask(id: string, plantId: string) {
    await db.deleteTask(id);
    await this.loadTasksForPlant(plantId);
  }

  async toggleCompletion(id: string, plantId: string) {
    await db.toggleTaskCompletion(id);
    await this.loadTasksForPlant(plantId);
  }

  getTasksForPlant(plantId: string): Task[] {
    return this.tasks.filter(task => task.plantId === plantId);
  }
}

export const tasksStore = new TasksStore();

