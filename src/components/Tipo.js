import React, { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";

export const Tipo = () => {
  const [tipos, setTipos] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  const getTipos = async () => {
    try {
      const res = await api.get("/types"); 
      console.log(res.data); 
      setTipos(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los tipos de multimedia", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/types/${editingId}`, formData);
        Swal.fire("Actualizado", "El tipo de multimedia fue actualizado correctamente", "success");
      } else {
        await api.post("/types", formData);
        Swal.fire("Agregado", "El tipo de multimedia fue agregado correctamente", "success");
      }
      setFormData({ name: "", description: "" });
      setEditingId(null);
      getTipos();
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar el tipo de multimedia", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar tipo de multimedia?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/types/${id}`);
        Swal.fire("Eliminado", "El tipo de multimedia fue eliminado correctamente", "success");
        getTipos();
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar el tipo de multimedia", "error");
      }
    }
  };

  const handleEdit = (tipo) => {
    setFormData({
      name: tipo.name,
      description: tipo.description,
    });
    setEditingId(tipo._id);
  };

  useEffect(() => {
    getTipos();
  }, []);

  return (
    <div className="bg-dark text-light p-4 rounded">
      <h2>
        <i className="bi bi-film"></i> Módulo de Tipo
      </h2>
      <p>Gestiona los tipos de multimedia</p>

      <form onSubmit={handleSubmit} className="mb-4">
        <h5>{editingId ? "Editar tipo" : "Agregar nuevo tipo"}</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
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
              setFormData({ name: "", description: "" });
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
            <th>Descripción</th>
            <th>Fecha creación</th>
            <th>Fecha actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.length === 0 ? (
            <tr>
              <td colSpan="5">No hay tipos de multimedia registrados</td>
            </tr>
          ) : (
            tipos.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.description}</td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>{new Date(t.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(t)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(t._id)}
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
