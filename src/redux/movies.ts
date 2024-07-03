import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOVIES_API_KEY } from '../constants';
import { loadState, saveState } from '../utils/localStorage';
export interface Movie {
  id: number;
  name: string;
  img: string;
  description: string;
  year: number;
  genres: string[];
  director: string;
  starring: string[];
  favorite: boolean;
}

type MovieState = {
  list: Movie[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: MovieState = {
  list: [],
  status: 'idle',
  error: null,
};

const persistedState = loadState();

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await fetch(MOVIES_API_KEY);
  const data: Movie[] = await response.json();
  const moviesWithFavorite = data.map(movie => ({
    ...movie,
    favorite: false,
  }));
  return moviesWithFavorite;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: persistedState || initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      state.list = state.list.map((movie: Movie) =>
        movie.id === action.payload
          ? { ...movie, favorite: !movie.favorite }
          : movie,
      );
      saveState(state);
    },
    deleteFromFavorite(state, action: PayloadAction<number>) {
      state.list = state.list.map((movie: Movie) =>
        movie.id === action.payload ? { ...movie, favorite: false } : movie,
      );
      saveState(state);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchMovies.fulfilled,
        (state, action: PayloadAction<Movie[]>) => {
          state.status = 'succeeded';
          state.list = action.payload.map(movie => {
            const existingMovie = state.list.find(
              (m: Movie) => m.id === movie.id,
            );
            return existingMovie
              ? { ...movie, favorite: existingMovie.favorite }
              : movie;
          });
          saveState(state);
        },
      )
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch movies';
      });
  },
});

export const { toggleFavorite, deleteFromFavorite } = moviesSlice.actions;
export default moviesSlice.reducer;
