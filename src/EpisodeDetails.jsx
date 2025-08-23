import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EpisodeDetails = () => {
  const { id, seasonNumber, episodeNumber } = useParams(); // هات القيم من الـURL
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE",
            },
          }
        );
        setEpisode(res.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [id, seasonNumber, episodeNumber]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!episode) return <p className="p-6">No episode data found.</p>;

  return (
    <div className="p-20 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">
        Episode {episode.episode_number}: {episode.name}
      </h2>
      {episode.still_path && (
        <img
          src={`https://image.tmdb.org/t/p/w780${episode.still_path}`}
          alt={episode.name}
          className="rounded-lg shadow-lg mb-6"
        />
      )}
      <p className="mb-4 text-gray-700">
        {episode.overview || "No overview available."}
      </p>
      <p className="text-sm text-gray-500">
        Air Date: {episode.air_date || "Unknown"}
      </p>
      <p className="text-sm text-gray-500">
        Runtime: {episode.runtime ? `${episode.runtime} min` : "N/A"}
      </p>
    </div>
  );
};

export default EpisodeDetails;
