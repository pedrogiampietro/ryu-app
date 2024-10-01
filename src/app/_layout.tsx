import { Stack } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import '../../global.css';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const configGoogleSignIn = () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '18791564727-q5gqmtvvhfe8ku57u6pt8673lnbl1pfm.apps.googleusercontent.com',
    });
  };
  useEffect(() => {
    configGoogleSignIn();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="manga/[id]/index" options={{ headerShown: false }} />
        <Stack.Screen name="manga/[id]/chapter/[chapterSlug]" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
