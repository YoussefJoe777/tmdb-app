import { useEffect, useState } from "react";
import './Movies.css'

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const url =
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US";

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE",
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
<div
  style={{
    width: "100vw", // العرض كله
    minHeight: "100vh",
    backgroundColor: "#111",
    padding: "80px", // بس padding صغير
    boxSizing: "border-box",
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
    }}
  >
    {movies.map((movie) => (
      <div
        key={movie.id}
        style={{
          textAlign: "center",
          background: "#222",
          borderRadius: "12px",
          padding: "10px",
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          style={{
            width: "100%",
            borderRadius: "10px",
          }}
        />
        <h3 style={{ color: "#fff", marginTop: "10px" }}>{movie.title}</h3>
      </div>
    ))}
  </div>
</div>
  );
};

export default Movies;
