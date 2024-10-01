import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between bg-gray-900 p-4 pt-20">
      {/* Botão de voltar */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Título central */}
      <Text className="text-lg font-bold text-white">{title}</Text>

      {/* Espaço vazio para alinhar o título */}
      <View style={{ width: 24 }} />
    </View>
  );
};

export default CustomHeader;
