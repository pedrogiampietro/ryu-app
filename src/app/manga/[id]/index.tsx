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
      <View className="flex-1 items-center justify-center bg-[#121214]">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121214]">
        <Text className="text-[#ff4d4d]">Erro: {error}</Text>
      </View>
    );
  }

  if (!manga) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121214]">
        <Text className="text-white">Mangá não encontrado.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />

      <CustomHeader title={manga.title} />

      <ScrollView
        className="flex-1 bg-[#121214] px-4 py-20"
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
            <Text className="mr-2 text-[#a1a1aa]">Nota: {manga.rating} ⭐</Text>
            <Text className="mr-2 text-[#a1a1aa]">Status: {manga.status}</Text>
            <Text className="text-[#a1a1aa]">Ano: {manga.releaseYear}</Text>
          </View>
          <View className="mt-4">
            <Text className="font-bold text-white">Gêneros:</Text>
            <Text className="text-[#a1a1aa]">{manga.genres.join(', ')}</Text>
          </View>
          <View className="mt-4">
            <Text className="font-bold text-white">Autor:</Text>
            <Text className="text-[#a1a1aa]">{manga.author}</Text>
          </View>
          <View className="mt-4">
            <Text className="font-bold text-white">Artista:</Text>
            <Text className="text-[#a1a1aa]">{manga.artist}</Text>
          </View>
          <View className="mt-4">
            <Text className="font-bold text-white">Resumo:</Text>
            <Text className="text-[#a1a1aa]">{manga.summary}</Text>
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
                className="mb-4 flex-row items-center rounded-lg bg-[#09090a] p-4"
                onPress={() => {
                  router.push({
                    pathname: `/manga/${id}/chapter/${chapterSlug}` as any,
                    params: { totalEpisodes: manga.episodes.length, cover: manga.image },
                  });
                }}>
                <Text className="text-[#8234e9]">{episode.title}</Text>
                <Text className="ml-auto text-[#a1a1aa]">{episode.releaseDate}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
