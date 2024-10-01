import { Text, TouchableOpacity } from 'react-native';
import { Manga } from '../types/manga';

interface ChapterListItemProps {
  manga: Manga;
  onPress: () => void;
}

export default function ChapterListItem({ manga, onPress }: ChapterListItemProps) {
  return (
    <TouchableOpacity
      className="mb-4 flex-row items-center rounded-lg bg-gray-800 p-4"
      onPress={onPress}>
      <Text className="text-white">{manga.lastChapter}</Text>
      <Text className="ml-4 text-pink-400">{manga.name}</Text>
    </TouchableOpacity>
  );
}
