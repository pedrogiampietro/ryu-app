import { apiClient } from '../api';
import { FavoriteEntry } from '@/types/favorite';
import { Manga } from '@/types/manga';

export const getFavorites = async (): Promise<FavoriteEntry[]> => {
  try {
    const response = await apiClient.get('/favorites');

    return response.data;
  } catch (error) {
    console.error('Erro na API getFavorites:', error);
    throw error;
  }
};

export const addFavorite = async (mangaId: string, title: string, cover: string): Promise<void> => {
  await apiClient.post('/favorites', { mangaId, title, cover });
};

export const removeFavorite = async (identifier: string): Promise<void> => {
  await apiClient.delete('/favorites', { data: { identifier } });
};

export const getTrendingMangas = async (): Promise<Manga[]> => {
  const response = await apiClient.get('/ananquim/trending');
  return response.data;
};

export const getLatestMangas = async (): Promise<Manga[]> => {
  const response = await apiClient.get('/ananquim/latest');
  return response.data;
};
