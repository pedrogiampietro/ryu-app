import { apiClient } from '../api';
import { Manga } from '@/types/manga';

export const getFavorites = async (): Promise<Manga[]> => {
  const response = await apiClient.get('favorites');
  return response.data;
};

export const addFavorite = async (mangaId: string): Promise<void> => {
  await apiClient.post('/favorites', { mangaId });
};

export const removeFavorite = async (mangaId: string): Promise<void> => {
  await apiClient.delete('/favorites', { data: { mangaId } });
};

export const getTrendingMangas = async (): Promise<Manga[]> => {
  const response = await apiClient.get('/ananquim/trending');
  return response.data;
};

export const getLatestMangas = async (): Promise<Manga[]> => {
  const response = await apiClient.get('/ananquim/latest');
  return response.data;
};
