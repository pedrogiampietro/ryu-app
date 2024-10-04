import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ChapterListItem } from '.'; // Ajuste o caminho conforme necessário
import { Manga } from '../../types/manga'; // Ajuste o caminho conforme necessário

describe('ChapterListItem', () => {
  const mockManga: Manga = {
    id: '1',
    name: 'One Piece',
    cover: 'https://example.com/one-piece-cover.jpg',
    lastChapter: 'Chapter 1001',
    rating: 4.8,
    date: '2023-06-15',
    identifier: 'one-piece',
  };

  const onPressMock = jest.fn();

  it('deve renderizar corretamente o nome do manga e o último capítulo', () => {
    const { getByText } = render(<ChapterListItem manga={mockManga} onPress={onPressMock} />);

    // Verifica se o nome do manga está sendo exibido
    expect(getByText('One Piece')).toBeTruthy();

    // Verifica se o último capítulo está sendo exibido
    expect(getByText('Chapter 1001')).toBeTruthy();
  });

  it('deve chamar a função onPress quando o componente é pressionado', () => {
    const { getByRole } = render(<ChapterListItem manga={mockManga} onPress={onPressMock} />);

    const touchable = getByRole('button');

    fireEvent.press(touchable);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
