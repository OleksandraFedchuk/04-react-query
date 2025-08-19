import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from "react";
import css from "./App.module.css";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { type Movie } from "../../types/movie";
import { useQuery } from "@tanstack/react-query";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isLoading, isFetched, isSuccess } = useQuery({
    queryKey: ["movie", setPage],
    queryFn: () => handleSearch(setPage),
    enabled: page > 0,
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSearch = async () => {
    const result = await fetchMovies(query);
    return result;
  };

  // useEffect(() => {
  //   handleSearch("popular");
  // }, []);

  const handleSelect = (data) => {
    setSelectedMovie(data);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && (
        <MovieGrid movie={data} onSelect={handleSelect} />
      )}
      {data && <MovieGrid movie={data} onSelect={handleSelect} />}
      {data && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
      {/* {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )} */}
    </div>
  );
}
