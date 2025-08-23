import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams(); // movie id
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const API_KEY = "Bearer YOUR_TOKEN";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          headers: { accept: "application/json", Authorization: API_KEY },
        };

        const [d, c, s, v] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`, options).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options).then(res => res.json()),
        ]);

        setDetails(d);
        setCredits(c);
        setSimilar(s.results.slice(0, 5));
        const trailerVideo = v.results.find(
          vid => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailer(trailerVideo?.key || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!details) return <p>Loading...</p>;

  const director = credits?.crew.find(member => member.job === "Director");

  return (
    <div style={{ color: "#fff", padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title}
          style={{ width: "300px", borderRadius: "10px" }}
        />
        <div>
          <h1>{details.title}</h1>
          <p>{details.overview}</p>
          <p>Runtime: {details.runtime} mins</p>
          <p>Language: {details.original_language}</p>
          <p>Genres: {details.genres.map(g => g.name).join(", ")}</p>
          <p>Director: {director?.name}</p>
        </div>
      </div>

      <h2>Top Cast</h2>
      <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
        {credits?.cast.slice(0, 10).map(actor => (
          <div
            key={actor.id}
            onClick={() => navigate(`/actor/${actor.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              alt={actor.name}
              style={{ borderRadius: "8px" }}
            />
            <p>{actor.name}</p>
          </div>
        ))}
      </div>

      {trailer && (
        <>
          <h2>Trailer</h2>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </>
      )}

      <h2>Similar Movies</h2>
      <div style={{ display: "flex", gap: "15px", overflowX: "auto" }}>
        {similar.map(movie => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{ borderRadius: "8px" }}
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>

      <h2>Production Companies</h2>
      <div style={{ display: "flex", gap: "15px" }}>
        {details.production_companies.map(pc => (
          <div key={pc.id}>
            {pc.logo_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${pc.logo_path}`}
                alt={pc.name}
                style={{ height: "40px", objectFit: "contain" }}
              />
            )}
            <p>{pc.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
