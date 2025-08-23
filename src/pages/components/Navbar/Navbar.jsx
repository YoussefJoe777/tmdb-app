import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navRef = useRef(null);
  const navigate = useNavigate();

  const navItemClass =
    "text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer";

  const dropdowns = {
    movies: [
      { to: "/movies/now_playing", label: "Now Playing" },
      { to: "/movies/popular", label: "Popular" },
      { to: "/movies/top_rated", label: "Top Rated" },
      { to: "/movies/upcoming", label: "Upcoming" },
    ],
    tv: [
      { to: "/tv/airing_today", label: "Airing Today" },
      { to: "/tv/on_the_air", label: "On The Air" },
      { to: "/tv/popular", label: "Popular" },
      { to: "/tv/top_rated", label: "Top Rated" },
    ],
  };

  // Fetch genres dynamically
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
          {
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE",
            },
          }
        );
        const data = await res.json();
        if (data.genres) {
          setGenres(data.genres.map((g) => ({ to: `/genres/${g.id}`, label: g.name })));
        }
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setSearchResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Search function
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchQuery) return setSearchResults([]);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
            searchQuery
          )}&language=en-US&include_adult=false`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE",
            },
          }
        );
        const data = await res.json();
        setSearchResults(data.results.slice(0, 5));
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const renderDropdown = (key, items) => {
    return openDropdown === key && (
      <ul className="absolute top-full left-0 mt-2 bg-gray-800 text-white rounded shadow-lg w-40 max-h-60 overflow-y-auto z-50">
        {items.map((item) => (
          <li key={item.to} className="px-4 py-2 hover:bg-gray-700 rounded">
            <Link
              to={item.to}
              className="block"
              onClick={() => {
                setOpenDropdown(null);
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderSearchBox = (isMobile = false) => (
    <div className={`relative ${isMobile ? "mb-2" : "hidden lg:block"}`}>
      <input
        type="text"
        placeholder="Search movies, TV, actors..."
        className={`px-3 py-1 rounded focus:outline-none w-60 ${isMobile ? "w-full" : ""}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="absolute right-0 top-0 px-3 py-1 text-white">🔍</button>

      {searchResults.length > 0 && (
        <ul className={`absolute top-full left-0 mt-1 bg-gray-800 text-white rounded shadow-lg ${isMobile ? "w-full" : "w-60"} max-h-60 overflow-y-auto z-50`}>
          {searchResults.map((item) => (
            <li key={item.id}>
              <Link
                to={
                  item.media_type === "movie"
                    ? `/movie/${item.id}`
                    : item.media_type === "tv"
                    ? `/tv/${item.id}`
                    : item.media_type === "person"
                    ? `/actor/${item.id}`
                    : "/"
                }
                className="block px-2 py-1 hover:bg-gray-700 rounded"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setMobileMenuOpen(false);
                }}
              >
                {item.title || item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full bg-[rgba(17,24,39,0.9)] shadow-md z-50"
    >
      <div className="flex items-center justify-between px-6 py-3.5">
        <h1
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          TMDB App
        </h1>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-6 mx-auto">
          <li className={navItemClass} onClick={() => navigate("/")}>Home</li>
          {["movies", "tv"].map((key) => (
            <li key={key} className="relative">
              <button
                className={navItemClass}
                onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} ▼
              </button>
              {renderDropdown(key, dropdowns[key])}
            </li>
          ))}
          <li className="relative">
            <button
              className={navItemClass}
              onClick={() => setOpenDropdown(openDropdown === "genres" ? null : "genres")}
            >
              Genres ▼
            </button>
            {renderDropdown("genres", genres)}
          </li>
          <li className={navItemClass} onClick={() => navigate("/actors")}>Actors</li>
        </ul>

        {/* Desktop Search */}
        {renderSearchBox()}

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-800 text-white px-6 py-4">
          {/* Mobile Search */}
          {renderSearchBox(true)}

          <ul className="flex flex-col gap-2">
            <li className={navItemClass} onClick={() => { navigate("/"); setMobileMenuOpen(false); }}>Home</li>
            <li className={navItemClass} onClick={() => { navigate("/actors"); setMobileMenuOpen(false); }}>Actors</li>
          </ul>
        </div>
      )}
    </nav>
  );
}
