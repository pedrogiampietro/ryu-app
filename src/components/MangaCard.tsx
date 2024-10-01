import { Image, Text, TouchableOpacity } from 'react-native';
import { Manga } from '@/types/manga';

interface MangaCardProps {
  manga: Manga;
  onPress: () => void;
}

export default function MangaCard({ manga, onPress }: MangaCardProps) {
  return (
    <TouchableOpacity style={{ marginRight: 16 }} onPress={onPress}>
      <Image source={{ uri: manga.cover }} style={{ width: 160, height: 240, borderRadius: 10 }} />
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
