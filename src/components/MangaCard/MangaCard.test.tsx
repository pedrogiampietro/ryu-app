import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MangaCard } from '.';
import { Manga } from '@/types/manga';
import { jest } from '@jest/globals';

// Mock atualizado para Ionicons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: ({ name, ...props }: { name: string; [key: string]: any }) => (
      <View accessibilityLabel={name} {...props} />
    ),
  };
});

describe('MangaCard', () => {
  const mockManga: Manga = {
    id: '1',
    name: 'My Hero Academia',
    cover: 'https://example.com/manga-cover.jpg',
    lastChapter: 'Chapter 123',
    rating: 4.5,
    date: '2023-01-01',
    identifier: 'my-hero-academia',
  };

  const onPressMock = jest.fn();
  const onFavoritePressMock = jest.fn();

  it('deve renderizar corretamente com as informações do manga', () => {
    const { getByText, getByLabelText } = render(
      <MangaCard
        manga={mockManga}
        onPress={onPressMock}
        onFavoritePress={onFavoritePressMock}
        isFavorite={false}
      />
    );

    // Verificar se o nome do manga é exibido
    expect(getByText('My Hero Academia')).toBeTruthy();

    // Verificar se o último capítulo e a avaliação são exibidos corretamente
    expect(getByText('Chapter 123 - 4.5 ⭐')).toBeTruthy();

    // Verificar se o ícone de favorito é renderizado corretamente (outline quando não é favorito)
    expect(getByLabelText('heart-outline')).toBeTruthy();
  });

  it('deve chamar a função onPress quando o card é pressionado', () => {
    const { getByTestId } = render(
      <MangaCard
        manga={mockManga}
        onPress={onPressMock}
        onFavoritePress={onFavoritePressMock}
        isFavorite={false}
      />
    );

    fireEvent.press(getByTestId('manga-card'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('deve chamar a função onFavoritePress quando o botão de favorito é pressionado', () => {
    const { getByTestId } = render(
      <MangaCard
        manga={mockManga}
        onPress={onPressMock}
        onFavoritePress={onFavoritePressMock}
        isFavorite={false}
      />
    );

    fireEvent.press(getByTestId('favorite-button'));

    expect(onFavoritePressMock).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar o ícone de coração cheio se o manga for favorito', () => {
    const { getByLabelText } = render(
      <MangaCard
        manga={mockManga}
        onPress={onPressMock}
        onFavoritePress={onFavoritePressMock}
        isFavorite={true}
      />
    );

    // Verificar se o ícone de favorito cheio é renderizado
    expect(getByLabelText('heart')).toBeTruthy();
  });
});
