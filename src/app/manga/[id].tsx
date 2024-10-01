// app/manga/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CustomHeader from '@/components/CustomHeader';

export default function MangaDetails() {
  const { id } = useGlobalSearchParams();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      const data = {
        id: id,
        title: 'Academia do Espadachim Gênio',
        image: 'https://github.com/pedrogiampietro.png',
        rating: 4.2,
        views: 1200,
        description: 'Descrição do mangá Academia do Espadachim Gênio.',
        chapters: [
          { number: 1, title: 'Início da Jornada' },
          { number: 2, title: 'Primeiro Confronto' },
        ],
      };

      setTimeout(() => {
        setManga(data);
        setLoading(false);
      }, 1000);
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

      {/* Header personalizado */}
      <CustomHeader title={manga.title} />

      <ScrollView
        className="flex-1 bg-gray-900 px-4 py-20"
        contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Imagem de capa do mangá */}
        <View className="mb-6">
          <Image
            source={{ uri: manga.image }}
            className="h-60 w-full rounded-lg"
            resizeMode="cover"
          />
        </View>

        {/* Detalhes do Mangá */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white">{manga.title}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400">{manga.rating} ⭐</Text>
            <Text className="text-gray-400">{manga.views} Visualizações</Text>
          </View>
          <Text className="mt-4 text-gray-400">{manga.description}</Text>
        </View>

        {/* Lista de Capítulos */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-white">Capítulos</Text>
          {manga.chapters.map((chapter, index) => (
            <TouchableOpacity
              key={index}
              className="mb-4 flex-row items-center rounded-lg bg-gray-800 p-4"
              onPress={() => {
                // Implementar navegação para o capítulo específico, se necessário
              }}>
              <Text className="text-white">Capítulo {chapter.number}</Text>
              <Text className="ml-4 text-pink-400">{chapter.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
