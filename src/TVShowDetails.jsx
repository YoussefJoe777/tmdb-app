import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-700 animate-pulse ${className}`}></div>
);

const TVShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE";

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const options = { headers: { accept: "application/json", Authorization: token } };

        const [showRes, creditsRes, recRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, options).then((r) => r.json()),
          fetch(`https://api.themoviedb.org/3/tv/${id}/credits`, options).then((r) => r.json()),
          fetch(`https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US`, options).then((r) => r.json()),
        ]);

        setShow(showRes);
        setCast(creditsRes.cast?.slice(0, 10) || []);
        setCrew(creditsRes.crew?.slice(0, 10) || []);
        setRecommendations(recRes.results?.slice(0, 6) || []);
      } catch (err) {
        console.error("Failed to fetch TV show details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-white">
        <Skeleton className="w-40 h-60 rounded-lg mb-4" />
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
      </div>
    );
  }

  if (!show?.id) return <p className="text-white text-center mt-20">❌ TV Show not found.</p>;

  return (
    <div className="text-white px-4 sm:px-6 lg:px-10 py-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        <img
          src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "/placeholder.png"}
          alt={show.name}
          className="w-full lg:w-1/3 rounded-lg shadow-lg object-cover"
        />

        <div className="flex-1 flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{show.name}</h1>
          <p className="text-gray-300">{show.overview || "No overview available."}</p>
          <p className="text-yellow-400">⭐ {show.vote_average?.toFixed(1) || "0"}</p>
          <p className="text-sm text-gray-400">First Air: {show.first_air_date || "N/A"}</p>
          <p className="text-sm text-gray-400">
            Seasons: {show.number_of_seasons || 0} | Episodes: {show.number_of_episodes || 0}
          </p>
        </div>
      </div>

      {/* Cast */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4">Top Cast</h2>
        <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-4 sm:overflow-x-auto py-2">
          {cast.length ? (
            cast.map((actor) => (
              <div
                key={actor.id}
                onClick={() => navigate(`/actor/${actor.id}`)}
                className="relative flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/placeholder.png"}
                  alt={actor.name}
                  className="w-24 h-32 object-cover rounded-lg shadow-md"
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-xs text-center text-white py-1 rounded-b opacity-0 hover:opacity-100 transition-opacity">
                  {actor.name}
                </div>
              </div>
            ))
          ) : (
            <p>No cast info available</p>
          )}
        </div>
      </div>

      {/* Crew */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4">Crew</h2>
        <div className="flex flex-wrap gap-4">
          {crew.length ? (
            crew.map((member) => (
              <div key={member.id} className="w-32 p-2 bg-gray-800 rounded-lg shadow text-center">
                <p className="text-sm font-semibold">{member.name}</p>
                <p className="text-xs text-gray-400">{member.job}</p>
              </div>
            ))
          ) : (
            <p>No crew info available</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Shows</h2>
        <div className="flex gap-4 overflow-x-auto">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => navigate(`/tv/details/${rec.id}`)}
              className="relative flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <img
                src={rec.poster_path ? `https://image.tmdb.org/t/p/w200${rec.poster_path}` : "/placeholder.png"}
                alt={rec.name}
                className="w-28 h-40 object-cover rounded-lg shadow-md"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-xs text-center text-white py-1 rounded-b opacity-0 hover:opacity-100 transition-opacity">
                {rec.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasons */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4">Seasons</h2>
        <div className="flex gap-4 overflow-x-auto">
          {show.seasons.map((season) => (
            <div
              key={season.id}
              onClick={() => navigate(`/tv/${id}/season/${season.season_number}`)}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              <img
                src={season.poster_path ? `https://image.tmdb.org/t/p/w200${season.poster_path}` : "/placeholder.png"}
                alt={season.name}
                className="w-28 h-40 object-cover rounded-lg shadow-md"
              />
              <p className="text-sm mt-1 text-center">{season.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
