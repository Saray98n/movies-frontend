import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Genero } from "./components/Genero";
import { Director } from "./components/Director";
import { Productora } from "./components/Productora";
import { Tipo } from "./components/Tipo";
import { Media } from "./components/Media";
import fondo from "./assets/fondo.jpg"; 
function App() {
  const [modulo, setModulo] = useState("inicio");

  const renderModulo = () => {
    switch (modulo) {
      case "genero":
        return <Genero />;
      case "director":
        return <Director />;
      case "productora":
        return <Productora />;
      case "tipo":
        return <Tipo />;
      case "media":
        return <Media />;
      default:
        return (
          <div className="text-center text-light mt-5">
            <h1><i className="bi bi-film"></i> Movies Admin Panel</h1>
            <p className="lead">Selecciona un módulo para comenzar</p>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* Capa oscura encima del fondo */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          minHeight: "100vh",
        }}
      >
        <div className="container py-5">
          <nav className="navbar navbar-dark bg-dark rounded mb-4 px-3 shadow-lg">
            <a className="navbar-brand fw-bold text-white" href="#">
              🎬 MoviesApp
            </a>
            <div>
              <button
                className="btn btn-outline-light me-2"
                onClick={() => setModulo("genero")}
              >
                Géneros
              </button>
              <button
                className="btn btn-outline-light me-2"
                onClick={() => setModulo("director")}
              >
                Directores
              </button>
              <button
                className="btn btn-outline-light me-2"
                onClick={() => setModulo("productora")}
              >
                Productoras
              </button>
              <button
                className="btn btn-outline-light me-2"
                onClick={() => setModulo("tipo")}
              >
                Tipos
              </button>
              <button
                className="btn btn-outline-light"
                onClick={() => setModulo("media")}
              >
                Media
              </button>
            </div>
          </nav>

          {renderModulo()}
        </div>
      </div>
    </div>
  );
}

export default App;
