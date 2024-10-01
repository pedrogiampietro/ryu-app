import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Chapter } from '@/types/chapter';
import CustomHeader from '@/components/CustomHeader';
import { GestureHandlerRootView, Gesture, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function ChapterPage() {
  const { id, chapterSlug } = useGlobalSearchParams();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Controle de navegação de imagens

  const scale = useSharedValue(1); // Valor compartilhado para o zoom
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 300 }) }],
  }));

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
        style={styles.header}
      />

      <View style={styles.navigationContainer}>
        <Text style={styles.navigationText} onPress={() => handleSwipe('right')}>
          {'< Anterior'}
        </Text>
        <Text style={styles.navigationText} onPress={() => handleSwipe('left')}>
          {'Próxima >'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <PinchGestureHandler gesture={onPinchGesture}>
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            <Image
              style={styles.image}
              source={{ uri: chapter.images[currentImageIndex] }}
              contentFit="cover"
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
    backgroundColor: '#1a1a1a',
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
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').height * 0.8,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  navigationText: {
    color: '#ffffff',
    fontSize: 18,
  },
});
