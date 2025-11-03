import { openDB, type IDBPDatabase } from 'idb';
import type { Plant, PlantPhoto, Task } from './schema';

const DB_NAME = 'garden-tracker-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase | null = null;

export async function getDB(): Promise<IDBPDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Plants store
      if (!db.objectStoreNames.contains('plants')) {
        const plantStore = db.createObjectStore('plants', { keyPath: 'id' });
        plantStore.createIndex('createdAt', 'createdAt');
        plantStore.createIndex('name', 'name');
      }

      // Photos store
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'plantId' });
      }

      // Tasks store
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('plantId', 'plantId');
        taskStore.createIndex('completed', 'completed');
        taskStore.createIndex('createdAt', 'createdAt');
      }
    },
  });

  return dbInstance;
}

// Plant operations
export async function getAllPlants(): Promise<Plant[]> {
  const db = await getDB();
  return db.getAllFromIndex('plants', 'createdAt');
}

export async function getPlant(id: string): Promise<Plant | undefined> {
  const db = await getDB();
  return db.get('plants', id);
}

export async function addPlant(plant: Plant): Promise<void> {
  const db = await getDB();
  await db.add('plants', plant);
}

export async function updatePlant(plant: Plant): Promise<void> {
  const db = await getDB();
  await db.put('plants', plant);
}

export async function deletePlant(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['plants', 'photos', 'tasks'], 'readwrite');
  
  await Promise.all([
    tx.objectStore('plants').delete(id),
    tx.objectStore('photos').delete(id),
    deleteTasksByPlantId(id),
  ]);
  
  await tx.done;
}

// Photo operations
export async function getPlantPhoto(plantId: string): Promise<PlantPhoto | undefined> {
  const db = await getDB();
  return db.get('photos', plantId);
}

export async function savePlantPhoto(photo: PlantPhoto): Promise<void> {
  const db = await getDB();
  await db.put('photos', photo);
}

export async function deletePlantPhoto(plantId: string): Promise<void> {
  const db = await getDB();
  await db.delete('photos', plantId);
}

// Task operations
export async function getAllTasks(): Promise<Task[]> {
  const db = await getDB();
  return db.getAllFromIndex('tasks', 'createdAt');
}

export async function getTasksByPlantId(plantId: string): Promise<Task[]> {
  const db = await getDB();
  return db.getAllFromIndex('tasks', 'plantId', plantId);
}

export async function getTask(id: string): Promise<Task | undefined> {
  const db = await getDB();
  return db.get('tasks', id);
}

export async function addTask(task: Task): Promise<void> {
  const db = await getDB();
  await db.add('tasks', task);
}

export async function updateTask(task: Task): Promise<void> {
  const db = await getDB();
  await db.put('tasks', task);
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('tasks', id);
}

export async function deleteTasksByPlantId(plantId: string): Promise<void> {
  const db = await getDB();
  const tasks = await getTasksByPlantId(plantId);
  const tx = db.transaction('tasks', 'readwrite');
  
  await Promise.all(tasks.map(task => tx.store.delete(task.id)));
  await tx.done;
}

export async function toggleTaskCompletion(id: string): Promise<void> {
  const db = await getDB();
  const task = await getTask(id);
  
  if (task) {
    task.completed = !task.completed;
    task.updatedAt = Date.now();
    await updateTask(task);
  }
}

