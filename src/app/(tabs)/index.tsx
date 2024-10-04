import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Image, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MangaCard } from '@/components/MangaCard';
import { ChapterListItem } from '@/components/ChapterListItem';
import { Manga } from '@/types/manga';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getTrendingMangas,
  getLatestMangas,
} from '@/services/https/home-get-data';
import { getLastReads } from '@/services/https/last-read-data';
import { useAuthStore } from '@/store/authStore';

interface LastRead {
  mangaId: string;
  mangaTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  currentPage: number;
  lastReadAt: string;
  mangaCover: string;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [isListView, setIsListView] = useState<boolean>(false);
  const [lastRead, setLastRead] = useState<LastRead[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [trendingMangas, setTrendingMangas] = useState<Manga[]>([]);
  const [trendingLoading, setTrendingLoading] = useState<boolean>(true);
  const [trendingError, setTrendingError] = useState<any>(null);
  const [latestMangas, setLatestMangas] = useState<Manga[]>([]);
  const [latestLoading, setLatestLoading] = useState<boolean>(true);
  const [latestError, setLatestError] = useState<any>(null);

  const fetchFavorites = async () => {
    try {
      const favoritesData = await getFavorites();

      if (favoritesData && favoritesData.length > 0) {
        const favoriteIdentifiers = favoritesData.map((fav: any) => fav.identifier);

        setFavorites(new Set(favoriteIdentifiers));

        await AsyncStorage.setItem('FAVORITES', JSON.stringify(favoriteIdentifiers));
      } else {
        const localFavorites = await AsyncStorage.getItem('FAVORITES');
        if (localFavorites) {
          const parsedLocalFavorites = JSON.parse(localFavorites);

          setFavorites(new Set(parsedLocalFavorites));
        } else {
          setFavorites(new Set());
        }
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);

      try {
        const localFavorites = await AsyncStorage.getItem('FAVORITES');
        if (localFavorites) {
          const parsedLocalFavorites = JSON.parse(localFavorites);

          setFavorites(new Set(parsedLocalFavorites));
        } else {
          setFavorites(new Set());
        }
      } catch (storageError) {
        console.error('Erro ao recuperar favoritos do AsyncStorage:', storageError);
        setFavorites(new Set());
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [user]);

  useEffect(() => {
    const fetchTrending = async () => {
      setTrendingLoading(true);
      try {
        const data = await getTrendingMangas();

        setTrendingMangas(data);
      } catch (error) {
        console.error('Erro ao buscar trending mangas:', error);
        setTrendingError(error);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchLatest = async () => {
      setLatestLoading(true);
      try {
        const data = await getLatestMangas();

        setLatestMangas(data);
      } catch (error) {
        console.error('Erro ao buscar latest mangas:', error);
        setLatestError(error);
      } finally {
        setLatestLoading(false);
      }
    };

    fetchLatest();
  }, []);

  const getLastReadData = useCallback(async () => {
    if (user) {
      try {
        const data = await getLastReads(user.id);
        setLastRead(
          data.map((item: any) => ({
            mangaId: item.mangaId,
            mangaTitle: item.manga.title,
            chapterSlug: item.episode,
            chapterTitle: `Capítulo ${item.episode.split('-').pop()}`,
            currentPage: item.progress,
            lastReadAt: item.date,
            mangaCover: item.manga.cover,
          }))
        );
      } catch (error) {
        console.error('Erro ao buscar últimos capítulos lidos do servidor:', error);
        setLastRead([]);
      }
    } else {
      try {
        const jsonValue = await AsyncStorage.getItem('LAST_READ');
        if (jsonValue != null) {
          const parsedData = JSON.parse(jsonValue);
          if (Array.isArray(parsedData)) {
            setLastRead(parsedData);
          } else if (typeof parsedData === 'object') {
            setLastRead([parsedData]);
          }
        } else {
          setLastRead([]);
        }
      } catch (error) {
        console.error('Erro ao recuperar os capítulos lidos:', error);
        setLastRead([]);
      }
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      getLastReadData();
    }, [getLastReadData])
  );

  const toggleFavorite = useCallback(
    async (manga: Manga) => {
      if (!manga || !manga.identifier || !manga.name || !manga.cover) {
        console.error('Manga inválido ou dados ausentes:', manga);
        return;
      }

      const isCurrentlyFavorite = favorites.has(manga.name);

      setFavorites((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyFavorite) {
          newSet.delete(manga.name);
        } else {
          newSet.add(manga.name);
        }
        return newSet;
      });

      try {
        if (isCurrentlyFavorite) {
          await removeFavorite(manga.name);
        } else {
          await addFavorite(manga.identifier, manga.name, manga.cover);
        }
      } catch (error) {
        console.error('Erro ao alternar favorito:', error);

        setFavorites((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyFavorite) {
            newSet.add(manga.name);
          } else {
            newSet.delete(manga.name);
          }
          return newSet;
        });
      }
    },
    [favorites]
  );

  if (trendingLoading || latestLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121214]">
        <ActivityIndicator size="large" color="#8234e9" />
      </View>
    );
  }

  if (trendingError || latestError) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121214]">
        <Text className="text-[#ff4d4d]">
          Erro: {trendingError?.message || latestError?.message}
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1 bg-[#121214] px-4 py-20"
        contentContainerStyle={{ paddingBottom: 150 }}>
        {lastRead.map((item, index) => (
          <TouchableOpacity
            key={`${item.mangaId}-${item.chapterSlug}-${index}`}
            className="mb-5 mr-4"
            onPress={() => router.push(`/manga/${item.mangaId}/chapter/${item.chapterSlug}`)}>
            <View className="h-60 w-40 overflow-hidden rounded-lg bg-[#09090a]">
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/${item.mangaCover}` }}
                style={{ width: '100%', height: '100%', position: 'absolute' }}
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black bg-opacity-50" />
              <View className="absolute bottom-0 left-0 right-0 p-2">
                <Text className="font-bold text-white" numberOfLines={2} ellipsizeMode="tail">
                  {item.mangaTitle}
                </Text>
                <Text className="text-gray-300" numberOfLines={1} ellipsizeMode="tail">
                  {item.chapterTitle}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View className="mb-6">
          <Text className="text-lg font-bold text-white">Mais Populares</Text>
          <Text className="mb-4 text-[#a1a1aa]">Séries de mangá mais populares hoje</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingMangas.map((manga) => {
              return (
                <View key={manga.identifier} className="mr-4">
                  <MangaCard
                    manga={manga}
                    onPress={() => router.push(`/manga/${manga.identifier}`)}
                    onFavoritePress={() => toggleFavorite(manga)}
                    isFavorite={favorites.has(manga.name)}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-white">Atualizações de Projetos</Text>
              <Text className="mb-4 text-[#a1a1aa]">
                Leia as atualizações mais recentes dos projetos de mangá
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsListView(!isListView)} className="p-2">
              <Ionicons name={isListView ? 'grid' : 'list'} size={24} color="#8234e9" />
            </TouchableOpacity>
          </View>
          {isListView ? (
            <View>
              {latestMangas.map((manga) => {
                return (
                  <ChapterListItem
                    key={`${manga.identifier}-list`}
                    manga={manga}
                    onPress={() =>
                      router.push(`/manga/${manga.identifier}/chapter/${manga.lastChapter}`)
                    }
                  />
                );
              })}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {latestMangas.map((manga) => {
                return (
                  <View key={`${manga.identifier}-update`} className="mr-4">
                    <MangaCard
                      manga={manga}
                      onPress={() => router.push(`/manga/${manga.identifier}`)}
                      onFavoritePress={() => toggleFavorite(manga)}
                      isFavorite={favorites.has(manga.name)}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </>
  );
}
