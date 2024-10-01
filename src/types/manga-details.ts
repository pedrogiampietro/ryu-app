export interface Episode {
  title: string;
  link: string;
  releaseDate: string;
}

export interface MangaDetails {
  id: string;
  title: string;
  image: string;
  rating: number;
  alternative: string;
  author: string;
  artist: string;
  genres: string[];
  type: string;
  tags: string[];
  releaseYear: string;
  status: string;
  summary: string;
  episodes: Episode[];
}
