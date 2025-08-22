import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from "react";
import css from "./App.module.css";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import { fetchMovieProps } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { type Movie } from "../../types/movie";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isLoading, isFetched, isSuccess } =
    useQuery<fetchMovieProps>({
      queryKey: ["movie", query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: query !== "",
      placeholderData: keepPreviousData,
    });

  const movies = data?.results ?? [];
  const totalPages = data?.total_Pages ?? 0;

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast("No movies found for your request");
    }
  }, [isSuccess, movies.length]);

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
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          previousLabel="< previous"
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selectedMovie }) =>
            setSelectedMovie(selectedMovie + 1)
          }
          renderOnZeroPageCount={null}
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
}
