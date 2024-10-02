import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '@/utils/supabase';
import { useAuthStore } from '@/store/authStore';

export default function Auth() {
  const { user, setUser, clearUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data: session } = await supabase.auth.getUser();
      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        clearUser();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data && userInfo.data.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
        });
        if (error) {
          Alert.alert('Erro', error.message);
        } else {
          const user = data.user;
          setUser(user, data.session?.access_token);

          await fetch('http://192.168.0.68:3333/v1/user/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.session?.access_token}`,
            },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.user_metadata.name,
              avatar: user.user_metadata.picture,
            }),
          });
        }
      } else {
        throw new Error('Token de ID não encontrado!');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelado', 'O usuário cancelou o login.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Aguarde', 'O processo de login já está em andamento.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Erro', 'Serviços do Google Play não disponíveis.');
      } else {
        Alert.alert('Erro', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await GoogleSignin.signOut();
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Erro', error.message);
      } else {
        clearUser();
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao sair.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#8234e9" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 px-5">
      {!user ? (
        <>
          <Text className="mb-10 text-2xl font-bold text-white">Bem-vindo!</Text>
          <GoogleSigninButton
            style={{ width: '100%', height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signInWithGoogle}
          />
        </>
      ) : (
        <View className="w-full items-center rounded-2xl bg-gray-800 p-8 shadow-lg">
          <Image
            source={{ uri: user.user_metadata.picture }}
            className="mb-5 h-24 w-24 rounded-full border-2 border-purple-500"
          />
          <Text className="mb-1 text-xl font-semibold text-white">{user.user_metadata.name}</Text>
          <Text className="mb-5 text-base text-gray-400">{user.email}</Text>
          <TouchableOpacity className="rounded-full bg-purple-500 px-8 py-3" onPress={signOut}>
            <Text className="text-base font-semibold text-white">Sair</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
