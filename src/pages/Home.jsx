import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Movies/Movies.css"; // نفس الستايل الموحد

const Home = () => {
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const url =
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";

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
        setItems(data.results);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCardClick = (item) => {
    const type = item.media_type === "tv" ? "tv" : "movie"; // يفرق بين فيلم/مسلسل
    navigate(`/details/${type}/${item.id}`);
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
        {items.map((item) => (
          <div
            key={item.id}
            className="movie-card"
            onClick={() => handleCardClick(item)}
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
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              style={{
                width: "100%",
                borderRadius: "10px",
                display: "block",
              }}
            />
            <h3 style={{ marginTop: "10px", fontSize: "18px" }}>
              {item.title || item.name}
            </h3>

            <p style={{ fontSize: "14px", color: "#bbb", margin: "6px 0" }}>
              Release: {item.release_date || item.first_air_date || "N/A"}
            </p>
            <p style={{ fontSize: "14px", color: "#ffcc00", margin: "6px 0" }}>
              ⭐ {item.vote_average?.toFixed(1) || "0"}
            </p>

            <p
              className={`movie-overview ${
                expanded[item.id] ? "expanded" : ""
              }`}
              onClick={(e) => e.stopPropagation()} // عشان الزرار ما يفتحش details
            >
              {item.overview}
            </p>

            {item.overview && item.overview.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // عشان ما يفتحش details بالغلط
                  toggleExpand(item.id);
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
                {expanded[item.id] ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
