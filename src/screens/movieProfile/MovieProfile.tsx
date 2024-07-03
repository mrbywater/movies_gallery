import './MovieProfile.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MOVIES_API_KEY } from '../../constants';
import { Movie, toggleFavorite } from '../../redux/movies';
import { Loader } from '@mantine/core';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fullStar, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { RootState } from '../../redux/store';
import ErrorPage from '../errorPage/ErrorPage';

const MoviesProfile = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const movies = useAppSelector((state: RootState) => state.movies.list);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isFavorite = movieId ? movies[+movieId - 1].favorite : null;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${MOVIES_API_KEY}/${movieId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Movie = await response.json();
        setMovie(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const closeMovieProfile = () => navigate('/');

  const isFavoriteHandler = () => {
    if (movieId) {
      dispatch(toggleFavorite(+movieId));
    }
  };

  if (loading) {
    return <Loader type="dots" />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="moviesProfileMainContainer">
      <FontAwesomeIcon icon={faXmark} onClick={closeMovieProfile} />
      <div className="movieImageContainer">
        <div>
          <img src={movie?.img} alt={movie?.name} />
          <div>
            <FontAwesomeIcon
              icon={!isFavorite ? emptyStar : fullStar}
              onClick={isFavoriteHandler}
            />
            {movie?.year}
          </div>
        </div>
        <div>
          {movie?.genres.map(genre => (
            <div key={`movies_profile_${genre}`}>
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <div className="movieProfileDescription">
        <div>
          <span>{movie?.name}</span>
          <span>{movie?.description}</span>
        </div>
        <div>
          <span>
            <b>Director:</b> {movie?.director}
          </span>
          <span>
            <b>Starring:</b> {movie?.starring.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MoviesProfile;
