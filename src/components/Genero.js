import React, { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";

export const Genero = () => {
  const [generos, setGeneros] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    status: "Activo",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  const getGeneros = async () => {
    try {
      const res = await api.get("/genres");
      setGeneros(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los géneros", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/genres/${editingId}`, formData);
        Swal.fire("Actualizado", "El género fue actualizado correctamente", "success");
      } else {
        await api.post("/genres", formData);
        Swal.fire("Agregado", "El género fue agregado correctamente", "success");
      }
      setFormData({ name: "", status: "Activo", description: "" });
      setEditingId(null);
      getGeneros();
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar el género", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar género?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/genres/${id}`);
        Swal.fire("Eliminado", "El género fue eliminado correctamente", "success");
        getGeneros();
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar el género", "error");
      }
    }
  };

  const handleEdit = (genero) => {
    setFormData({
      name: genero.name,
      status: genero.status,
      description: genero.description,
    });
    setEditingId(genero._id);
  };

  useEffect(() => {
    getGeneros();
  }, []);

  return (
    <div className="bg-dark text-light p-4 rounded">
      <h2>
        <i className="bi bi-tags"></i> Módulo de Género
      </h2>
      <p>Gestiona los géneros de películas</p>

      <form onSubmit={handleSubmit} className="mb-4">
        <h5>{editingId ? "Editar género" : "Agregar nuevo género"}</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success mt-3">
          <i className="bi bi-save"></i> {editingId ? "Actualizar" : "Guardar"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", status: "Activo", description: "" });
            }}
          >
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
        )}
      </form>

      <table className="table table-dark table-striped align-middle text-center">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Descripción</th>
            <th>Fecha creación</th>
            <th>Fecha actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {generos.length === 0 ? (
            <tr>
              <td colSpan="6">No hay géneros registrados</td>
            </tr>
          ) : (
            generos.map((g) => (
              <tr key={g._id}>
                <td>{g.name}</td>
                <td>{g.status}</td>
                <td>{g.description}</td>
                <td>{new Date(g.createdAt).toLocaleDateString()}</td>
                <td>{new Date(g.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(g)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(g._id)}
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
