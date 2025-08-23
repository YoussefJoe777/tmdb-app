import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Movies.css";

const Movies = () => {
  const { category } = useParams(); // هنا هنستقبل نوع الأفلام من الـ URL
  const [movies, setMovies] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();


  const fetchMovies = async (pageNum, categoryType) => {
    if (!hasMore) return;
    setLoading(true);

    const url = `https://api.themoviedb.org/3/movie/${categoryType}?language=en-US&page=${pageNum}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE",
      },
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // أول مرة أو عند تغيير الـ category
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1, category || "popular");
  }, [category]);

  // عند تغيير الصفحة (scroll)
  useEffect(() => {
    if (page > 1) {
      fetchMovies(page, category || "popular");
    }
  }, [page]);

  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#111",
        padding: "80px",
        boxSizing: "border-box",
        overflowX: "hidden",
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
          onClick={() => navigate(`/movie/${movie.id}`)}
          style={{
            textAlign: "center",
            background: "#222",
            borderRadius: "12px",
            padding: "10px",
            color: "#fff",
            overflow: "hidden",
            cursor: "pointer", // يخلي المستخدم يعرف إنه clickable
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >

            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: "100%",
                borderRadius: "10px",
                display: "block",
              }}
            />
            <h3 style={{ marginTop: "10px", fontSize: "18px" }}>
              {movie.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#bbb", margin: "6px 0" }}>
              Release: {movie.release_date || "N/A"}
            </p>
            <p style={{ fontSize: "14px", color: "#ffcc00", margin: "6px 0" }}>
              ⭐ {movie.vote_average?.toFixed(1) || "0"}
            </p>

            <p
              className={`movie-overview ${
                expanded[movie.id] ? "expanded" : ""
              }`}
            >
              {movie.overview}
            </p>

            {movie.overview && movie.overview.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // يمنع فتح صفحة التفاصيل
                  toggleExpand(movie.id);
                }}
                style={{
                  marginTop: "8px",
                  background: "transparent",
                  border: "none",
                  color: "#1db954",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {expanded[movie.id] ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <p style={{ color: "#fff", textAlign: "center", marginTop: "20px" }}>
          Loading more movies...
        </p>
      )}

      {!hasMore && (
        <p style={{ color: "gray", textAlign: "center", marginTop: "20px" }}>
          🎬 No more movies to show
        </p>
      )}
    </div>
  );
};

export default Movies;
