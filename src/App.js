import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Genres from "./components/Genres";
import Directors from "./components/Directors";
import Productions from "./components/Productions";
import Types from "./components/Types";
import Media from "./components/Media";

function App() {
  return (
    <Router>
      
      <nav className="navbar navbar-expand-lg navbar-dark px-4 py-3 fixed-top" style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.85)", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-film me-2"></i> MoviesApp
        </Link>
        <div className="d-flex">
          <Link className="nav-link text-light me-3" to="/genres">
            <i className="bi bi-collection-play me-1"></i> Géneros
          </Link>
          <Link className="nav-link text-light me-3" to="/directors">
            <i className="bi bi-person-video2 me-1"></i> Directores
          </Link>
          <Link className="nav-link text-light me-3" to="/productions">
            <i className="bi bi-building me-1"></i> Productoras
          </Link>
          <Link className="nav-link text-light me-3" to="/types">
            <i className="bi bi-tags me-1"></i> Tipos
          </Link>
          <Link className="nav-link text-light" to="/media">
            <i className="bi bi-play-circle me-1"></i> Media
          </Link>
        </div>
      </nav>

      <div className="container-fluid pt-5 mt-5">
        <Routes>
          <Route path="/" element={<Navigate to="/media" replace />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/directors" element={<Directors />} />
          <Route path="/productions" element={<Productions />} />
          <Route path="/types" element={<Types />} />
          <Route path="/media" element={<Media />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
