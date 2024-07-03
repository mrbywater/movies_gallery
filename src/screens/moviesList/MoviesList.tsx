import './MoviesList.scss';
import React, { useEffect, useState } from 'react';
import { Drawer, Loader, Select } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faGripVertical,
  faHeartCircleCheck,
  faList,
  faStar,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import SquareCard from '../../components/moviesCards/squareCard/SquareCard';
import ListCard from '../../components/moviesCards/listCard/ListCard';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { RootState } from '../../redux/store';
import {
  deleteFromFavorite,
  fetchMovies,
  Movie,
  toggleFavorite,
} from '../../redux/movies';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import ErrorPage from '../errorPage/ErrorPage';

const MoviesList = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const movies = useAppSelector((state: RootState) => state.movies.list);
  const status = useAppSelector((state: RootState) => state.movies.status);
  const error = useAppSelector((state: RootState) => state.movies.error);

  const [uniqueGenres, setUniqueGenres] = useState<string[]>([]);
  const [switchView, setSwitchView] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectValue, setSelectValue] = useState<string | null>('');

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  useEffect(() => {
    if (movies.length) {
      const getUniqueGenres = (movies: Movie[]) => {
        const genres = new Set<string>();
        movies.forEach(movie => {
          movie.genres.forEach(genre => genres.add(genre.toLowerCase()));
        });
        return Array.from(genres).map(
          genre => genre.charAt(0).toUpperCase() + genre.slice(1),
        );
      };

      setUniqueGenres(getUniqueGenres(movies));

      const favoriteMovies = movies.filter((movie: Movie) => movie.favorite);
      const favoriteIds = favoriteMovies.map((movie: Movie) => movie.id);
      setFavorites(favoriteIds);
    }
  }, [movies]);

  const goToMovieProfile = (id: number) => () => {
    navigate(`/movie_profile/${id}`);
  };

  const switchViewHandler = (state: boolean) => () => setSwitchView(state);

  const favoritesHandler =
    (id: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      dispatch(toggleFavorite(id));

      setFavorites(prevFavorites =>
        prevFavorites.includes(id)
          ? prevFavorites.filter(favoriteId => favoriteId !== id)
          : [...prevFavorites, id],
      );
    };

  const favoritesMovies = movies.filter((movie: Movie) =>
    favorites.includes(movie.id),
  );

  const moviesForGenre = movies.filter((movie: Movie) => {
    if (selectValue) {
      return movie.genres
        .map(genre => genre.toLowerCase())
        .includes(selectValue.toLowerCase());
    }
  });

  const renderMovies = moviesForGenre.length ? moviesForGenre : movies;

  const removeFromFavorites =
    (id: number) => (event: React.MouseEvent<SVGSVGElement>) => {
      event.stopPropagation();
      setFavorites(favorites.filter(item => item !== id));

      dispatch(deleteFromFavorite(id));
    };

  if (status === 'loading') {
    return <Loader type="dots" />;
  }

  if (status === 'failed') {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="moviesListMainContainer">
      <div className="moviesListContainer">
        <span>
          Movies Gallery{' '}
          <FontAwesomeIcon icon={faHeartCircleCheck} onClick={open} />
        </span>
        <div className="selectContainer">
          <Select
            placeholder="select genre"
            data={uniqueGenres}
            clearable
            size="xs"
            onChange={setSelectValue}
          />
          <div>
            <span>View as:</span>
            <FontAwesomeIcon
              icon={faGripVertical}
              onClick={switchViewHandler(true)}
              style={switchView ? { color: '#228be6' } : {}}
            />
            <FontAwesomeIcon
              icon={faList}
              onClick={switchViewHandler(false)}
              style={!switchView ? { color: '#228be6' } : {}}
            />
          </div>
        </div>
        <div className="cardsContainer">
          {switchView
            ? renderMovies.map((movie: Movie) => (
                <SquareCard
                  key={movie.id}
                  img={movie.img}
                  name={movie.name}
                  year={movie.year}
                  favorite={movie.favorite}
                  favoritesHandler={favoritesHandler(movie.id)}
                  goToMovieProfile={goToMovieProfile(movie.id)}
                />
              ))
            : renderMovies.map((movie: Movie) => (
                <ListCard
                  key={movie.id}
                  img={movie.img}
                  name={movie.name}
                  year={movie.year}
                  description={movie.description}
                  genres={movie.genres}
                  favorite={movie.favorite}
                  favoritesHandler={favoritesHandler(movie.id)}
                  goToMovieProfile={goToMovieProfile(movie.id)}
                />
              ))}
        </div>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <div className="favoritesLabel">
            <FontAwesomeIcon icon={faStar} />
            <span>Favorite List</span>
          </div>
        }>
        {favoritesMovies.length ? (
          <div className="favoritesList">
            {favoritesMovies.map((movie: Movie) => (
              <div
                key={`movie_favorites${movie.id}`}
                onClick={goToMovieProfile(movie.id)}>
                <div>
                  <FontAwesomeIcon icon={faCircle} />
                  <span>{movie.name}</span>
                </div>
                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={removeFromFavorites(movie.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <span>Favorites is empty...</span>
        )}
      </Drawer>
      <div className="favoritesContainer">
        <div className="favoritesLabel">
          <FontAwesomeIcon icon={faStar} />
          <span>Favorite List</span>
        </div>
        {favoritesMovies.length ? (
          <div className="favoritesList">
            {favoritesMovies.map((movie: Movie) => (
              <div
                key={`movie_favorites${movie.id}`}
                onClick={goToMovieProfile(movie.id)}>
                <div>
                  <FontAwesomeIcon icon={faCircle} />
                  <span>{movie.name}</span>
                </div>
                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={removeFromFavorites(movie.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <span>Favorites is empty...</span>
        )}
      </div>
    </div>
  );
};

export default MoviesList;
