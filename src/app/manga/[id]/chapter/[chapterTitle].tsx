import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Chapter } from '@/types/chapter';
import CustomHeader from '@/components/CustomHeader';

export default function ChapterPage() {
  const router = useRouter();
  const { id, chapterTitle } = router.query;
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log('Received id:', id);
  console.log('Received chapterTitle:', chapterTitle);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const fetchUrl = `http://192.168.0.68:3333/v1/ananquim/manga/${id}/${encodeURIComponent(
          chapterTitle as string
        )}/read`;
        console.log('Fetching chapter from URL:', fetchUrl);

        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error('Falha ao buscar o capítulo');
        }
        const data: Chapter = await response.json();
        setChapter(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && chapterTitle) {
      fetchChapter();
    }
  }, [id, chapterTitle]);

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

  if (!chapter) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-white">Capítulo não encontrado.</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <CustomHeader title={chapter.title} />

      <ScrollView className="flex-1 bg-gray-900">
        {chapter.images.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              resizeMode: 'contain',
            }}
          />
        ))}
      </ScrollView>
    </>
  );
}
