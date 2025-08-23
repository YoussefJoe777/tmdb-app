import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Actors = () => {
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();
  const API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE";

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/person/popular?language=en-US&page=1",
          { headers: { accept: "application/json", Authorization: API_KEY } }
        );
        const data = await res.json();
        setActors(data.results);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActors();
  }, []);

  return (
    <div className="p-25 max-w-7xl mx-auto text-white">
      <h1 className="text3xl font-bold mb-6">Trending Actors</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {actors.map(actor => (
          <div
            key={actor.id}
            className="cursor-pointer hover:scale-105 transition-transform text-center"
            onClick={() => navigate(`/actor/${actor.id}`)}
          >
            <img
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : "/placeholder.png"}
              alt={actor.name}
              className="rounded-lg w-full h-48 object-cover"
            />
            <p className="mt-2 text-sm font-medium">{actor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Actors;
