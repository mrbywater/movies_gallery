import './styles/style.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MoviesList from './screens/moviesList/MoviesList';
import MoviesProfile from './screens/movieProfile/MovieProfile';
import ErrorPage from './screens/errorPage/ErrorPage';
import React from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MoviesList />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'movie_profile/:movieId',
    element: <MoviesProfile />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <div className="appMainContainer">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
