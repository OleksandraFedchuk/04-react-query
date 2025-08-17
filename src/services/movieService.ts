import axios from "axios";
import { type Movie } from "../types/movie";

interface fetchMoviesProps {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const url = axios.create({
  baseURL: `https://api.themoviedb.org/3/`,
  headers: {
    Accept: `application/json`,
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await url.get<fetchMoviesProps>(`search/movie`, {
    params: {
      query,
      include_adult: false,
      language: "en",
      page: 1,
    },
  });
  return response.data.results;
};
