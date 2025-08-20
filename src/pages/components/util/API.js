const API_KEY = "YOUR_TMDB_API_KEY"; // استبدل ده بالمفتاح بتاعك من TMDB
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
}

export async function fetchMovieDetails(id) {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return response.json();
}
