import { ScrollView, Image, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import MangaCard from '@/components/MangaCard';
import ChapterListItem from '@/components/ChapterListItem';

import { Manga } from '@/types/manga';
import { useState, useEffect, useCallback } from 'react';
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

interface LastRead {
  mangaId: string;
  mangaTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  currentPage: number;
  lastReadAt: string;
}

export default function Home() {
  const router = useRouter();
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
      setFavorites(new Set(favoritesData.map((manga: Manga) => manga.id)));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchTrendingMangas = async () => {
      setTrendingLoading(true);
      try {
        const data = await getTrendingMangas();
        setTrendingMangas(data);
      } catch (error) {
        setTrendingError(error);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrendingMangas();
  }, []);

  useEffect(() => {
    const fetchLatestMangas = async () => {
      setLatestLoading(true);
      try {
        const data = await getLatestMangas();
        setLatestMangas(data);
      } catch (error) {
        setLatestError(error);
      } finally {
        setLatestLoading(false);
      }
    };

    fetchLatestMangas();
  }, []);

  const getLastRead = async () => {
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
  };

  useFocusEffect(
    useCallback(() => {
      getLastRead();
    }, [])
  );

  useEffect(() => {
    getLastRead();
  }, []);

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

  const toggleFavorite = async (mangaId: string) => {
    try {
      if (favorites.has(mangaId)) {
        await removeFavorite(mangaId);
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(mangaId);
          return newSet;
        });
      } else {
        await addFavorite(mangaId);
        setFavorites((prev) => new Set(prev).add(mangaId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1 bg-[#121214] px-4 py-20"
        contentContainerStyle={{ paddingBottom: 150 }}>
        {lastRead.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-white">Últimos Lidos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
              {lastRead.map((item, index) => (
                <TouchableOpacity
                  key={`${item.mangaId}-${item.chapterSlug}-${index}`}
                  className="mr-4"
                  onPress={() => router.push(`/manga/${item.mangaId}/chapter/${item.chapterSlug}`)}>
                  <View className="w-40 rounded-lg bg-[#09090a] p-4">
                    <Text className="font-bold text-white">{item.mangaTitle}</Text>
                    <Text className="text-[#a1a1aa]">{item.chapterTitle}</Text>
                    <Text className="text-[#a1a1aa]">Página: {item.currentPage + 1}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="mb-6">
          <Text className="text-lg font-bold text-white">Mais Populares</Text>
          <Text className="mb-4 text-[#a1a1aa]">Séries de mangá mais populares hoje</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingMangas.map((manga) => (
              <View key={manga.id} className="mr-4">
                <MangaCard
                  manga={manga}
                  onPress={() => router.push(`/manga/${manga.identifier}`)}
                  onFavoritePress={() => toggleFavorite(manga.id)}
                  isFavorite={favorites.has(manga.id)}
                />
              </View>
            ))}
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
              {latestMangas.map((manga) => (
                <ChapterListItem
                  key={`${manga.id}-list`}
                  manga={manga}
                  onPress={() => router.push(`/manga/${manga.identifier}/chapter`)}
                />
              ))}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {latestMangas.map((manga) => (
                <View key={`${manga.id}-update`} className="mr-4">
                  <MangaCard
                    manga={manga}
                    onPress={() => router.push(`/manga/${manga.identifier}`)}
                    onFavoritePress={() => toggleFavorite(manga.id)}
                    isFavorite={favorites.has(manga.id)}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </>
  );
}
