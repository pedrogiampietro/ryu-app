import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CustomHeader from '@/components/CustomHeader';
import { MangaDetails } from '@/types/manga-details';
import { generateChapterSlug } from '@/utils/generateChapterSlug';

export default function MangaDetailsPage() {
  const router = useRouter();
  const { id } = useGlobalSearchParams();
  const [manga, setManga] = useState<MangaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await fetch(`http://192.168.0.68:3333/v1/ananquim/manga/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar os detalhes do mangá');
        }
        const data: MangaDetails = await response.json();
        setManga(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-red-500">Erro: {error}</Text>
      </View>
    );
  }

  if (!manga) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-white">Mangá não encontrado.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />

      <CustomHeader title={manga.title} />

      <ScrollView
        className="flex-1 bg-gray-900 px-4 py-20"
        contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Imagem de capa do mangá */}
        <View className="mb-6 items-center">
          <Image
            source={{ uri: manga.image }}
            className="h-80 w-56 rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-white">{manga.title}</Text>
          <View className="mt-2 flex-row flex-wrap items-center">
            <Text className="mr-2 text-gray-400">Nota: {manga.rating} ⭐</Text>
            <Text className="mr-2 text-gray-400">Status: {manga.status}</Text>
            <Text className="text-gray-400">Ano: {manga.releaseYear}</Text>
          </View>
          <View className="mt-4">
            <Text className="font-bold text-white">Gêneros:</Text>
            <Text className="text-gray-400">{manga.genres.join(', ')}</Text>
          </View>
          <View className="mt-4">
            <Text className="font-bold text-white">Autor:</Text>
            <Text className="text-gray-400">{manga.author}</Text>
          </View>
          <View className="mt-4">
            <Text className="font-bold text-white">Artista:</Text>
            <Text className="text-gray-400">{manga.artist}</Text>
          </View>
          <View className="mt-4">
            <Text className="font-bold text-white">Resumo:</Text>
            <Text className="text-gray-400">{manga.summary}</Text>
          </View>
        </View>

        {/* Lista de Capítulos */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-white">Capítulos</Text>
          {manga.episodes.map((episode, index) => {
            const chapterSlug = generateChapterSlug(episode.title);
            return (
              <TouchableOpacity
                key={index}
                className="mb-4 flex-row items-center rounded-lg bg-gray-800 p-4"
                onPress={() => {
                  router.push(`/manga/${id}/chapter/${chapterSlug}`);
                }}>
                <Text className="text-white">{episode.title}</Text>
                <Text className="ml-auto text-gray-400">{episode.releaseDate}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
