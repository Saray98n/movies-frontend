import React, { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";

export const Director = () => {
  const [directores, setDirectores] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    status: "Activo",
  });
  const [editingId, setEditingId] = useState(null);

  const getDirectores = async () => {
    try {
      const res = await api.get("/directors");
      setDirectores(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los directores", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/directors/${editingId}`, formData);
        Swal.fire("Actualizado", "El director fue actualizado correctamente", "success");
      } else {
        await api.post("/directors", formData);
        Swal.fire("Agregado", "El director fue agregado correctamente", "success");
      }
      setFormData({ firstName: "", lastName: "", status: "Activo" });
      setEditingId(null);
      getDirectores();
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar el director", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar director?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/directors/${id}`);
        Swal.fire("Eliminado", "El director fue eliminado correctamente", "success");
        getDirectores();
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar el director", "error");
      }
    }
  };

  const handleEdit = (director) => {
    setFormData({
      firstName: director.firstName,
      lastName: director.lastName,
      status: director.status,
    });
    setEditingId(director._id);
  };

  useEffect(() => {
    getDirectores();
  }, []);

  return (
    <div className="bg-dark text-light p-4 rounded">
      <h2>
        <i className="bi bi-person-video2"></i> Módulo de Director
      </h2>
      <p>Gestiona los directores principales</p>

      <form onSubmit={handleSubmit} className="mb-4">
        <h5>{editingId ? "Editar director" : "Agregar nuevo director"}</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Nombres</label>
            <input
              type="text"
              className="form-control"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-success mt-3">
          <i className="bi bi-save"></i>{" "}
          {editingId ? "Actualizar" : "Guardar"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => {
              setEditingId(null);
              setFormData({ firstName: "", lastName: "", status: "Activo" });
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
            <th>Apellido</th>
            <th>Estado</th>
            <th>Fecha creación</th>
            <th>Fecha actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {directores.length === 0 ? (
            <tr>
              <td colSpan="6">No hay directores registrados</td>
            </tr>
          ) : (
            directores.map((d) => (
              <tr key={d._id}>
                <td>{d.firstName}</td>
                <td>{d.lastName}</td>
                <td>{d.status}</td>
                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td>{new Date(d.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(d)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(d._id)}
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
