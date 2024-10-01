// components/CustomHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const router = useRouter();

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View className="bg-gray-900" style={{ paddingTop: statusBarHeight }}>
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-white">{title}</Text>

        <View style={{ width: 24 }} />
      </View>
    </View>
  );
};

export default CustomHeader;
