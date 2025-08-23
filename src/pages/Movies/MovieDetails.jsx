import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-700 animate-pulse ${className}`}></div>
);

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [trailer, setTrailer] = useState(null);

  const API_KEY =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTY1OTM3Zjc5ZGE4Yjk0MzZmMDY4MDI5NDQwN2Y1ZCIsIm5iZiI6MTc1NTYwMzkwMC41NjksInN1YiI6IjY4YTQ2M2JjMWRiYzA0MjRiOTE3ZDQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q-QdUuOJrufo23NSk4cIG3rWE2On8c-XkXVMAgqOYsE";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = { headers: { accept: "application/json", Authorization: API_KEY } };

        const [d, c, s, v] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options).then((res) => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options).then((res) => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`, options).then((res) => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options).then((res) => res.json()),
        ]);

        setDetails(d);
        setCredits(c);
        setSimilar(s.results.slice(0, 5));
        const trailerVideo = v.results.find((vid) => vid.type === "Trailer" && vid.site === "YouTube");
        setTrailer(trailerVideo?.key || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const director = credits?.crew.find((member) => member.job === "Director");

  return (
    <div className="text-white px-4 sm:px-6 lg:px-10 py-25 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        {details ? (
          <img
            src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : "/placeholder.png"}
            alt={details.title}
            className="w-full lg:w-1/3 rounded-lg shadow-lg object-cover"
          />
        ) : (
          <Skeleton className="w-full lg:w-1/3 h-96 rounded-lg" />
        )}

        <div className="flex-1 flex flex-col gap-3">
          {details ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold">{details.title}</h1>
              <p className="text-gray-300 text-sm sm:text-base">{details.overview}</p>
              <p><strong>Runtime:</strong> {details.runtime} mins</p>
              <p><strong>Language:</strong> {details.original_language.toUpperCase()}</p>
              <p><strong>Genres:</strong> {details.genres.map((g) => g.name).join(", ")}</p>
              <p><strong>Director:</strong> {director?.name || "Unknown"}</p>
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

     {/* 🎭 Top Cast */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4">Top Cast</h2>
        <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-4 sm:overflow-x-auto py-2">
          {credits ? (
            credits.cast.slice(0, 10).map(actor => (
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
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="w-24 h-32 rounded-lg" />
            ))
          )}
        </div>
      </div>


      {/* Trailer */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-2">Trailer</h2>
      {trailer ? (
        <div className="w-full aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      ) : (
        <p>{details ? "No trailer available" : <Skeleton className="w-full h-64 rounded-lg" />}</p>
      )}

      {/* Similar Movies */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-2">Similar Movies</h2>
      <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-5 lg:grid-cols-7 py-2">
        {details ? (
          similar.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="relative flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "/placeholder.png"}
                alt={movie.title}
                className="w-24 h-32 object-cover rounded-lg shadow-md"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-xs text-center text-white py-1 rounded-b opacity-0 hover:opacity-100 transition-opacity">
                {movie.title}
              </div>
            </div>
          ))
        ) : (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-24 h-32 rounded-lg" />)
        )}
      </div>

      {/* Production Companies */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-2">Production Companies</h2>
      <div className="flex flex-wrap gap-6">
        {details ? (
          details.production_companies.map((pc) => (
            <div key={pc.id} className="flex flex-col items-center">
              {pc.logo_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${pc.logo_path}`}
                  alt={pc.name}
                  className="h-12 object-contain"
                />
              ) : (
                <div className="h-12 w-24 bg-gray-700 flex items-center justify-center text-sm text-gray-300 rounded">
                  {pc.name}
                </div>
              )}
              <p className="text-sm mt-1 text-center">{pc.name}</p>
            </div>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-24 h-12 rounded-lg" />)
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
