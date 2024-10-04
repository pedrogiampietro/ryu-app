import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Manga } from '@/types/manga';
import { Ionicons } from '@expo/vector-icons';

interface MangaCardProps {
  manga: Manga;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
}

export function MangaCard({ manga, onPress, onFavoritePress, isFavorite }: MangaCardProps) {
  return (
    <TouchableOpacity style={{ marginRight: 16 }} onPress={onPress} testID="manga-card">
      <View style={{ position: 'relative' }}>
        <Image
          source={{
            uri: manga.cover.startsWith('http')
              ? manga.cover
              : `${process.env.EXPO_PUBLIC_API_URL}/${manga.cover}`,
          }}
          style={{ width: 160, height: 240, borderRadius: 10 }}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={{ position: 'absolute', top: 5, right: 5, padding: 5 }}
          onPress={onFavoritePress}
          testID="favorite-button">
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#ff4d4d' : 'white'}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{ marginTop: 8, color: 'white', width: 160 }}
        numberOfLines={2}
        ellipsizeMode="tail">
        {manga.name}
      </Text>
      <Text style={{ color: 'gray', width: 160 }} numberOfLines={2} ellipsizeMode="tail">
        {manga.lastChapter} - {manga.rating} ⭐
      </Text>
    </TouchableOpacity>
  );
}
