import { ScrollView, Image, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import MangaCard from '@/components/MangaCard';
import ChapterListItem from '@/components/ChapterListItem';
import { useFetch } from '@/hooks/useFetch';
import { Manga } from '@/types/manga';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const [isListView, setIsListView] = useState<boolean>(false);

  const {
    data: trendingMangas,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch<Manga>('http://192.168.0.68:3333/v1/ananquim/trending');

  const {
    data: latestMangas,
    loading: latestLoading,
    error: latestError,
  } = useFetch<Manga>('http://192.168.0.68:3333/v1/ananquim/latest');

  if (trendingLoading || latestLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-white">Carregando...</Text>
      </View>
    );
  }

  if (trendingError || latestError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-red-500">Erro: {trendingError || latestError}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1 bg-gray-900 px-4 py-20"
        contentContainerStyle={{ paddingBottom: 150 }}>
        <View className="mb-6">
          <Image
            source={{ uri: 'https://github.com/pedrogiampietro.png' }}
            className="h-40 w-full rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-white">Mais Populares</Text>
          <Text className="mb-4 text-gray-400">Séries de mangá mais populares hoje</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingMangas.map((manga) => (
              <View key={manga.id} className="mr-4">
                <MangaCard
                  manga={manga}
                  onPress={() => router.push(`/manga/${manga.identifier}`)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-white">Atualizações de Projetos</Text>
              <Text className="mb-4 text-gray-400">
                Leia as atualizações mais recentes dos projetos de mangá
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsListView(!isListView)} className="p-2">
              <Ionicons name={isListView ? 'grid' : 'list'} size={24} color="white" />
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
