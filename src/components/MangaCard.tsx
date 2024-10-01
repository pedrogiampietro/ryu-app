import { Image, Text, TouchableOpacity } from 'react-native';
import { Manga } from '@/types/manga';

interface MangaCardProps {
  manga: Manga;
  onPress: () => void;
}

export default function MangaCard({ manga, onPress }: MangaCardProps) {
  return (
    <TouchableOpacity className="mr-4" onPress={onPress}>
      <Image source={{ uri: manga.cover }} className="h-60 w-40 rounded-lg" />
      <Text
        className="mt-2 text-white"
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{ width: 160 }}>
        {manga.name}
      </Text>
      <Text className="text-gray-400" numberOfLines={2} ellipsizeMode="tail" style={{ width: 160 }}>
        {manga.lastChapter} - {manga.rating} ⭐
      </Text>
    </TouchableOpacity>
  );
}
