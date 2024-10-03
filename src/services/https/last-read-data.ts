// src/services/https/lastWatchedService.ts
import { apiClient } from '../api';

export interface LastReadPayload {
  userId: string;
  mangaId: string;
  cover: string;
  title: string;
  episodio: string;
  currentEpisode: number;
  totalEpisodes: number;
}

export const getLastReads = async (userId?: string): Promise<any[]> => {
  if (userId) {
    const response = await apiClient.get('/lastWatched', {
      params: { userId },
    });

    return response.data;
  } else {
    return [];
  }
};

export const addLastRead = async (payload: LastReadPayload): Promise<void> => {
  await apiClient.post('/lastWatched', payload);
};
