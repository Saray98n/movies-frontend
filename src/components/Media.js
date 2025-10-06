import React, { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";

export const Media = () => {
  const [medias, setMedias] = useState([]);
  const [formData, setFormData] = useState({
    serial: "",
    title: "",
    synopsis: "",
    url: "",
    image: "",
    year: "",
    genre: "",
    director: "",
    producer: "",
    type: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [options, setOptions] = useState({
    genres: [],
    directors: [],
    productions: [],
    types: [],
  });

  const getOptions = async () => {
    try {
      const [genres, directors, productions, types] = await Promise.all([
        api.get("/genres?active=true"),
        api.get("/directors?active=true"),
        api.get("/productions?active=true"),
        api.get("/types"),
      ]);
      setOptions({
        genres: genres.data || [],
        directors: directors.data || [],
        producers: productions.data || [],
        types: types.data || [],
      });
    } catch {
      Swal.fire("Error", "No se pudieron cargar las opciones", "error");
    }
  };

  const getMedias = async () => {
    try {
      const res = await api.get("/media");
      setMedias(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las producciones", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/media/${editingId}`, formData);
        Swal.fire("Actualizado", "La producción fue actualizada correctamente", "success");
      } else {
        await api.post("/media", formData);
        Swal.fire("Agregado", "La producción fue agregada correctamente", "success");
      }
      setFormData({
        serial: "",
        title: "",
        synopsis: "",
        url: "",
        image: "",
        year: "",
        genre: "",
        director: "",
        producer: "",
        type: "",
      });
      setEditingId(null);
      getMedias();
    } catch {
      Swal.fire("Error", "No se pudo guardar la producción", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producción?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/media/${id}`);
        Swal.fire("Eliminado", "La producción fue eliminada correctamente", "success");
        getMedias();
      } catch {
        Swal.fire("Error", "No se pudo eliminar la producción", "error");
      }
    }
  };

  const handleEdit = (media) => {
    setFormData({
      serial: media.serial,
      title: media.title,
      synopsis: media.synopsis,
      url: media.url,
      image: media.image,
      year: media.year,
      genre: media.genre?._id || "",
      director: media.director?._id || "",
      producer: media.producer?._id || "",
      type: media.type?._id || "",
    });
    setEditingId(media.serial);
  };

  useEffect(() => {
    getOptions();
    getMedias();
  }, []);

  return (
    <div className="bg-dark text-light p-4 rounded">
      <h2>
        <i className="bi bi-film"></i> Módulo de Película
      </h2>
      <p>Gestiona las películas y series</p>

      <form onSubmit={handleSubmit} className="mb-4">
        <h5>{editingId ? "Editar producción" : "Agregar nueva producción"}</h5>
       
        <button type="submit" className="btn btn-success mt-3">
          <i className="bi bi-save"></i> {editingId ? "Actualizar" : "Guardar"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => {
              setEditingId(null);
              setFormData({
                serial: "",
                title: "",
                synopsis: "",
                url: "",
                image: "",
                year: "",
                genre: "",
                director: "",
                producer: "",
                type: "",
              });
            }}
          >
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
        )}
      </form>

      <table className="table table-dark table-striped align-middle text-center mt-4">
        <thead>
          <tr>
            <th>Serial</th>
            <th>Título</th>
            <th>Año</th>
            <th>Director</th>
            <th>Productora</th>
            <th>Tipo</th>
            <th>Género</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medias.length === 0 ? (
            <tr>
              <td colSpan="8">No hay producciones registradas</td>
            </tr>
          ) : (
            medias.map((m) => (
              <tr key={m.serial}>
                <td>{m.serial}</td>
                <td>{m.title}</td>
                <td>{m.year}</td>
                <td>{m.director?.firstName} {m.director?.lastName}</td>
                <td>{m.producer?.name}</td>
                <td>{m.type?.name}</td>
                <td>{m.genre?.name}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(m)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(m.serial)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
