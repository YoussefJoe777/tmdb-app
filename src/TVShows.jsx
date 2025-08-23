import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TVShows = () => {
  const { category } = useParams(); // category من URL: airing_today, on_tv, popular, top_rated
  const [tvShows, setTvShows] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchTVShows = async (pageNum, categoryType) => {
    if (!hasMore) return;
    setLoading(true);

    const url = `https://api.themoviedb.org/3/tv/${categoryType}?language=en-US&page=${pageNum}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE",
        },
      });
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setHasMore(false);
      } else {
        setTvShows((prev) => [...prev, ...data.results]);
      }
    } catch (err) {
      console.error("Error fetching TV shows:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTvShows([]);
    setPage(1);
    setHasMore(true);
    fetchTVShows(1, category || "popular");
  }, [category]);

  useEffect(() => {
    if (page > 1) fetchTVShows(page, category || "popular");
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight) {
        if (!loading && hasMore) setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
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
        {tvShows.map((show) => (
          <div
            key={show.id}
            // onClick={() => navigate(`/tv/${show.id}`)}
            onClick={() => navigate(`/tv/details/${show.id}`)}
            style={{
              textAlign: "center",
              background: "#222",
              borderRadius: "12px",
              padding: "10px",
              color: "#fff",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              style={{ width: "100%", borderRadius: "10px", display: "block" }}
            />
            <h3 style={{ marginTop: "10px", fontSize: "18px" }}>{show.name}</h3>
            <p style={{ fontSize: "14px", color: "#bbb", margin: "6px 0" }}>
              First Air: {show.first_air_date || "N/A"}
            </p>
            <p style={{ fontSize: "14px", color: "#ffcc00", margin: "6px 0" }}>
              ⭐ {show.vote_average?.toFixed(1) || "0"}
            </p>

            <p className={`movie-overview ${expanded[show.id] ? "expanded" : ""}`}>
              {show.overview}
            </p>

            {show.overview && show.overview.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(show.id);
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
                {expanded[show.id] ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        ))}
      </div>

      {loading && <p style={{ color: "#fff", textAlign: "center", marginTop: "20px" }}>Loading more TV shows...</p>}
      {!hasMore && <p style={{ color: "gray", textAlign: "center", marginTop: "20px" }}>📺 No more TV shows to show</p>}
    </div>
  );
};

export default TVShows;
