import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ActorDetails = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [filmography, setFilmography] = useState([]);
  const API_KEY = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE"; // ضع توكن TMDB هنا
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?language=en-US`, {
            headers: { accept: "application/json", Authorization: API_KEY }
          }),
          fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`, {
            headers: { accept: "application/json", Authorization: API_KEY }
          })
        ]);

        const detailsData = await detailsRes.json();
        const creditsData = await creditsRes.json();

        setActor(detailsData);

        // أخذ أفضل 5-10 أعمال حسب الشعبية
        const topWorks = creditsData.cast
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10);
        setFilmography(topWorks);

      } catch (err) {
        console.error(err);
      }
    };

    fetchActor();
  }, [id]);

  if (!actor) return <p className="text-white p-6">Loading actor...</p>;

  const gender = actor.gender === 1 ? "Female" : actor.gender === 2 ? "Male" : "Other";

  return (
    <div className="p-25 max-w-7xl mx-auto text-white">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : "/placeholder.png"}
          alt={actor.name}
          className="rounded-lg w-full md:w-64 h-auto object-cover"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{actor.name}</h1>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Place of Birth:</strong> {actor.place_of_birth || "Unknown"}</p>
          <p><strong>Birthday:</strong> {actor.birthday || "Unknown"}</p>
          {actor.deathday && <p><strong>Death:</strong> {actor.deathday}</p>}
          <p><strong>Popularity:</strong> {actor.popularity?.toFixed(1)}</p>
          <p className="mt-2">{actor.biography || "No biography available."}</p>
          {actor.imdb_id && (
            <a
              href={`https://www.imdb.com/name/${actor.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-2 inline-block"
            >
              IMDb Profile
            </a>
          )}
        </div>
      </div>

      {/* Filmography */}
      <h2 className="text-2xl font-semibold mt-6 mb-2">Top Works</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filmography.map(work => (
          <div
            key={work.id}
            className="cursor-pointer hover:scale-105 transition-transform text-center"
            onClick={() => navigate(work.media_type === "movie" ? `/movie/${work.id}` : `/tv/${work.id}`)}
          >
            <img
              src={work.poster_path ? `https://image.tmdb.org/t/p/w200${work.poster_path}` : "/placeholder.png"}
              alt={work.title || work.name}
              className="rounded-lg w-full h-48 object-cover"
            />
            <p className="mt-1 text-sm">{work.title || work.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActorDetails;
