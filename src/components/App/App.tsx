import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from "react";
import css from "./App.module.css";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import { type fetchMoviesProps } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { type Movie } from "../../types/movie";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
  const [query, setQuery] = useState("popular");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isLoading, isFetching, isSuccess } =
    useQuery<fetchMoviesProps>({
      queryKey: ["movie", query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: query !== "",
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60,
    });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && (data?.results?.length ?? 0) === 0) {
      toast("No movies found for your request");
    }
  }, [isSuccess, data]);

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading || isFetching ? <Loader /> : null}
      {isError ? <ErrorMessage /> : null}

      {(data?.results?.length ?? 0) > 0 && isSuccess && (
        <>
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
          {totalPages > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel="-->"
              previousLabel="<--"
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              renderOnZeroPageCount={null}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
            />
          )}
        </>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
