import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// زر Home / Actors
function NavButton({ to, label, navItemClass }) {
  const navigate = useNavigate();
  return (
    <button className={navItemClass} onClick={() => navigate(to)}>
      {label}
    </button>
  );
}

// Dropdown button wrapper
function DropdownButton({ label, isOpen, onClick, children }) {
  return (
    <>
      <button
        onClick={onClick}
        className="text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer"
      >
        {label} ▼
      </button>
      {isOpen && children}
    </>
  );
}

// Dropdown menu
function DropdownMenu({ items, setOpenDropdown }) {
  return (
    <ul className="absolute top-full left-0 mt-2 bg-gray-800 text-white rounded shadow-lg w-40 max-h-60 overflow-y-auto z-50">
      {items.map((item) => (
        <li key={item.to} className="px-4 py-2 hover:bg-gray-700 rounded">
          <Link
            className="block"
            to={item.to}
            onClick={() => setOpenDropdown(null)}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const navItemClass =
    "text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer";

  // إغلاق Dropdown عند الضغط خارج الـ navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full bg-[rgba(17,24,39,0.7)] shadow-md z-50"
    >
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-white text-2xl font-bold">TMDB App</h1>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6 mx-auto">
          <li>
            <NavButton to="/" label="Home" navItemClass={navItemClass} />
          </li>
          <li className="relative">
            <DropdownButton
              label="Movies"
              isOpen={openDropdown === "movies"}
              onClick={() =>
                setOpenDropdown(openDropdown === "movies" ? null : "movies")
              }
            >
              <DropdownMenu
                items={[
                  { to: "/movies/now_playing", label: "Now Playing" },
                  { to: "/movies/popular", label: "Popular" },
                  { to: "/movies/top_rated", label: "Top Rated" },
                  { to: "/movies/upcoming", label: "Upcoming" },
                ]}
                setOpenDropdown={setOpenDropdown}
              />
            </DropdownButton>
          </li>
          <li className="relative">
            <DropdownButton
              label="TV Shows"
              isOpen={openDropdown === "tv"}
              onClick={() =>
                setOpenDropdown(openDropdown === "tv" ? null : "tv")
              }
            >
              <DropdownMenu
                items={[
                  { to: "/tv/airing_today", label: "Airing Today" },
                  { to: "/tv/on_tv", label: "On TV" },
                  { to: "/tv/popular", label: "Popular" },
                  { to: "/tv/top_rated", label: "Top Rated" },
                ]}
                setOpenDropdown={setOpenDropdown}
              />
            </DropdownButton>
          </li>
          <li className="relative">
            <DropdownButton
              label="Genres"
              isOpen={openDropdown === "genres"}
              onClick={() =>
                setOpenDropdown(openDropdown === "genres" ? null : "genres")
              }
            >
              <DropdownMenu
                items={[
                  { to: "/genres/action", label: "Action" },
                  { to: "/genres/comedy", label: "Comedy" },
                  { to: "/genres/drama", label: "Drama" },
                ]}
                setOpenDropdown={setOpenDropdown}
              />
            </DropdownButton>
          </li>
          <li>
            <NavButton to="/actors" label="Actors" navItemClass={navItemClass} />
          </li>
        </ul>

        {/* Search (Desktop) */}
        <div className="hidden md:block relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1 rounded focus:outline-none"
          />
          <button className="absolute right-0 top-0 px-3 py-1 text-white">
            🔍
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white px-6 py-4">
          <ul className="flex flex-col gap-2">
            <li>
              <NavButton to="/" label="Home" navItemClass={navItemClass} />
            </li>

            {/* Movies Dropdown */}
            <li className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "movies" ? null : "movies")
                }
                className={navItemClass + " w-full text-left"}
              >
                Movies ▼
              </button>
              {openDropdown === "movies" && (
                <ul className="ml-4 mt-1 flex flex-col gap-1">
                  <li>
                    <Link
                      to="/movies/now_playing"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Now Playing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/movies/popular"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Popular
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/movies/top_rated"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Top Rated
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/movies/upcoming"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Upcoming
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* TV Shows Dropdown */}
            <li className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "tv" ? null : "tv")
                }
                className={navItemClass + " w-full text-left"}
              >
                TV Shows ▼
              </button>
              {openDropdown === "tv" && (
                <ul className="ml-4 mt-1 flex flex-col gap-1">
                  <li>
                    <Link
                      to="/tv/airing_today"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Airing Today
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tv/on_tv"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      On TV
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tv/popular"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Popular
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tv/top_rated"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Top Rated
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Genres Dropdown */}
            <li className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "genres" ? null : "genres")
                }
                className={navItemClass + " w-full text-left"}
              >
                Genres ▼
              </button>
              {openDropdown === "genres" && (
                <ul className="ml-4 mt-1 flex flex-col gap-1">
                  <li>
                    <Link
                      to="/genres/action"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Action
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/genres/comedy"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Comedy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/genres/drama"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Drama
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <NavButton to="/actors" label="Actors" navItemClass={navItemClass} />
            </li>

            {/* Search */}
            <li className="mt-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-1 rounded focus:outline-none text-black"
              />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
