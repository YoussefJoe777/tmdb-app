import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
// import Navbar from "./pages/components/navbar/Navbar.jsx";
// import Home from "./pages/Home.jsx";
// import Movies from "./pages/Movies/Movies.jsx";
// import MovieDetails from "./pages/Movies/MovieDetails";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
