import type { Plant, PlantWithPhoto } from '$lib/db/schema';
import * as db from '$lib/db/db';
import { compressAndCreateThumbnail } from '$lib/services/image';

class PlantsStore {
  plants = $state<PlantWithPhoto[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);

  async loadPlants() {
    this.loading = true;
    this.error = null;
    
    try {
      const plants = await db.getAllPlants();
      const plantsWithPhotos: PlantWithPhoto[] = await Promise.all(
        plants.map(async (plant) => {
          const photo = await db.getPlantPhoto(plant.id);
          if (photo?.thumbnail) {
            return {
              ...plant,
              thumbnailUrl: URL.createObjectURL(photo.thumbnail),
            };
          }
          return plant;
        })
      );
      
      this.plants = plantsWithPhotos;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load plants';
      console.error('Failed to load plants:', err);
    } finally {
      this.loading = false;
    }
  }

  async getPlant(id: string): Promise<Plant | undefined> {
    return db.getPlant(id);
  }

  async addPlant(plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File) {
    const now = Date.now();
    const newPlant: Plant = {
      ...plant,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    await db.addPlant(newPlant);

    if (imageFile) {
      const { compressed, thumbnail } = await compressAndCreateThumbnail(imageFile);
      await db.savePlantPhoto({
        plantId: newPlant.id,
        fullImage: compressed,
        thumbnail,
      });
    }

    await this.loadPlants();
    return newPlant;
  }

  async updatePlant(plant: Plant, imageFile?: File) {
    plant.updatedAt = Date.now();
    await db.updatePlant(plant);

    if (imageFile) {
      const { compressed, thumbnail } = await compressAndCreateThumbnail(imageFile);
      await db.savePlantPhoto({
        plantId: plant.id,
        fullImage: compressed,
        thumbnail,
      });
    }

    await this.loadPlants();
  }

  async deletePlant(id: string) {
    await db.deletePlant(id);
    await this.loadPlants();
  }

  async getPlantPhoto(plantId: string) {
    return db.getPlantPhoto(plantId);
  }
}

export const plantsStore = new PlantsStore();

