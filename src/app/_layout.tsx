import '../../global.css';

import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="manga/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen name="manga/[id]/chapter/[chapterSlug]" options={{ headerShown: false }} />
    </Stack>
  );
}
