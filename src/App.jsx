import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/components/Navbar/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import MovieDetails from "./pages/Movies/MovieDetails.jsx";
// import Actors from "./pages/Actors/Actors.jsx"; 
// import ActorDetails from "./pages/Actors/ActorDetails.jsx";
// import TVShows from "./pages/TV/TVShows.jsx";
// import TVShowDetails from "./pages/TV/TVShowDetails.jsx";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
