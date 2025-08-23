import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-700 animate-pulse ${className}`}></div>
);

const SeasonDetails = () => {
  const { id, seasonNumber } = useParams();
  const navigate = useNavigate();

  const [season, setSeason] = useState(null);
  const [ setLoading] = useState(true);

  const API_KEY =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE";

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=en-US`,
          { headers: { accept: "application/json", Authorization: API_KEY } }
        );
        const data = await res.json();
        setSeason(data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeason();
  }, [id, seasonNumber]);

  return (
    <div className="text-white px-4 sm:px-6 lg:px-10 py-25 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        {season ? (
          <img
            src={
              season.poster_path
                ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
                : "/placeholder.png"
            }
            alt={season.name}
            className="w-full lg:w-1/3 rounded-lg shadow-lg object-cover"
          />
        ) : (
          <Skeleton className="w-full lg:w-1/3 h-96 rounded-lg" />
        )}

        <div className="flex-1 flex flex-col gap-3">
          {season ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold">{season.name}</h1>
              <p className="text-gray-300 text-sm sm:text-base">
                {season.overview || "No overview available."}
              </p>
              <p>
                <strong>Air Date:</strong>{" "}
                {season.air_date || "Not Available"}
              </p>
              <p>
                <strong>Episodes:</strong> {season.episodes?.length || 0}
              </p>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-full mb-1" />
              <Skeleton className="h-6 w-1/2 mb-1" />
            </>
          )}
        </div>
      </div>

      {/* Episodes */}
      <div className="my-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Episodes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {season
            ? season.episodes.map((ep) => (
                <div
                  key={ep.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-105 transition cursor-pointer"
                  onClick={() =>
                    navigate(`/tv/${id}/season/${seasonNumber}/episode/${ep.episode_number}`)
                  }
                >
                  {ep.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                      alt={ep.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 flex items-center justify-center bg-gray-700 text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-1">
                      Ep {ep.episode_number}: {ep.name}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {ep.overview || "No description available."}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Air Date: {ep.air_date || "Unknown"}
                    </p>
                  </div>
                </div>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-60 rounded-lg" />
              ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonDetails;
