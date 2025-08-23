import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/components/Navbar/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import MovieDetails from "./pages/Movies/MovieDetails.jsx";
import ActorDetails from "./Actor.jsx";
import Actors from "./Actors.jsx";
import GenrePage from "./GenrePage.jsx";
import TVShows from "./TVShows.jsx";
import TVShowDetails from "./TVShowDetails.jsx";
import SeasonDetails from "./SeasonDetails.jsx";
import EpisodeDetails from "./EpisodeDetails.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:category" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetails />} /> {/* 👈 خليها كده */}
          <Route path="/actor/:id" element={<ActorDetails />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/genres/:id" element={<GenrePage />} />
          <Route path="/tv/:category" element={<TVShows />} />
          <Route path="/tv" element={<TVShows />} />
          <Route path="/tv/details/:id" element={<TVShowDetails />} />
          <Route path="/tv/:id/season/:seasonNumber" element={<SeasonDetails />} />
          <Route path="/tv/:id/season/:seasonNumber/episode/:episodeNumber" element={<EpisodeDetails />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
