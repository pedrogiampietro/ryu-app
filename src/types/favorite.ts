export interface FavoriteEntry {
  id: number;
  manga: {
    cover: string;
    id: string;
    link: string;
    points: number;
    title: string;
  };
  mangaId: string;
  userId: string;
}
