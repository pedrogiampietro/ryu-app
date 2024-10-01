import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Chapter } from '@/types/chapter';
import CustomHeader from '@/components/CustomHeader';
import { GestureHandlerRootView, Gesture, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChapterPage() {
  const { id, chapterSlug } = useGlobalSearchParams();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 300 }) }],
  }));

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const fetchUrl = `http://192.168.0.68:3333/v1/ananquim/manga/${id}/${chapterSlug}/read`;
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error('Falha ao buscar o capítulo');
        }
        const data: Chapter = await response.json();
        setChapter(data);
        await saveLastRead(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && chapterSlug) {
      fetchChapter();
    }
  }, [id, chapterSlug]);

  useEffect(() => {
    saveLastRead(chapter);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [currentImageIndex]);

  const saveLastRead = async (currentChapter: Chapter | null) => {
    if (currentChapter) {
      const lastReadItem = {
        mangaId: id,
        mangaTitle: currentChapter.title || 'Título do Mangá',
        chapterSlug: chapterSlug,
        chapterTitle: currentChapter.title,
        currentPage: currentImageIndex,
        lastReadAt: new Date().toISOString(),
      };

      try {
        const existingData = await AsyncStorage.getItem('LAST_READ');
        let lastReadArray: (typeof lastReadItem)[] = [];

        if (existingData != null) {
          const parsedData = JSON.parse(existingData);
          if (Array.isArray(parsedData)) {
            lastReadArray = parsedData;
          } else if (typeof parsedData === 'object') {
            lastReadArray = [parsedData];
          }
        }

        const existingIndex = lastReadArray.findIndex(
          (item) => item.mangaId === lastReadItem.mangaId
        );

        if (existingIndex !== -1) {
          lastReadArray[existingIndex] = lastReadItem;
        } else {
          lastReadArray.unshift(lastReadItem);
        }

        if (lastReadArray.length > 10) {
          lastReadArray = lastReadArray.slice(0, 10);
        }

        await AsyncStorage.setItem('LAST_READ', JSON.stringify(lastReadArray));
      } catch (error) {
        console.error('Erro ao salvar o(s) último(s) capítulo(s) lido(s):', error);
      }
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (chapter) {
      if (direction === 'left' && currentImageIndex < chapter.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else if (direction === 'right' && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    }
  };

  const onPinchGesture = Gesture.Pinch().onUpdate((event) => {
    scale.value = event.scale;
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  if (!chapter) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Capítulo não encontrado.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <CustomHeader
        title={`${chapter.title} - Página ${currentImageIndex + 1}/${chapter.images.length}`}
      />

      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={() => handleSwipe('right')}>
          <Text style={styles.navigationText}>{'< Anterior'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSwipe('left')}>
          <Text style={styles.navigationText}>{'Próxima >'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef} // Anexando a referência aqui
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <PinchGestureHandler gesture={onPinchGesture}>
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            <Image
              style={styles.image}
              source={{ uri: chapter.images[currentImageIndex] }}
              contentFit="contain"
              transition={300}
            />
          </Animated.View>
        </PinchGestureHandler>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: '#121214',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#121214',
  },
  contentContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#09090a',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 0.1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#09090a',
  },
  navigationText: {
    color: '#8234e9',
    fontSize: 18,
  },
});
