import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/components/Navbar/Navbar.jsx";
import Home from "./pages/Home";
import Movies from "./pages/Movies/Movies.jsx";
import MovieDetails from "./pages/Movies/MovieDetails.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/:category" element={<Movies />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/actor/:id" element={<ActorDetails />} />
          <Route path="/tv/:category" element={<TVShows />} />
          <Route path="/tvshow/:id" element={<TVShowDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
