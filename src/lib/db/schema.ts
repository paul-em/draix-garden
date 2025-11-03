export interface Plant {
  id: string;
  name: string;
  latinName: string;
  age?: string;
  goals?: string;
  otherInfo?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PlantPhoto {
  plantId: string;
  fullImage: Blob;
  thumbnail: Blob;
}

export interface Task {
  id: string;
  plantId: string;
  description: string;
  dateRange: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  openaiApiKey?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface PlantWithPhoto extends Plant {
  thumbnailUrl?: string;
}

