import React, { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";

export const Productora = () => {
  const [productoras, setProductoras] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slogan: "",
    description: "",
    status: "Activo",
  });
  const [editingId, setEditingId] = useState(null);

  const getProductoras = async () => {
    try {
      const res = await api.get("/productions"); 
      console.log(res.data); 
      const producers = res.data.map((p) => p.producer || p); 
      setProductoras(producers);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar las productoras", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/productions/${editingId}`, formData); 
        Swal.fire("Actualizado", "La productora fue actualizada correctamente", "success");
      } else {
        await api.post("/productions", formData);
        Swal.fire("Agregado", "La productora fue agregada correctamente", "success");
      }
      setFormData({ name: "", slogan: "", description: "", status: "Activo" });
      setEditingId(null);
      getProductoras();
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar la productora", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar productora?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/productions/${id}`); 
        Swal.fire("Eliminado", "La productora fue eliminada correctamente", "success");
        getProductoras();
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar la productora", "error");
      }
    }
  };

  const handleEdit = (productora) => {
    setFormData({
      name: productora.name,
      slogan: productora.slogan,
      description: productora.description,
      status: productora.status,
    });
    setEditingId(productora._id);
  };

  useEffect(() => {
    getProductoras();
  }, []);

  return (
    <div className="bg-dark text-light p-4 rounded">
      <h2>
        <i className="bi bi-building"></i> Módulo de Productora
      </h2>
      <p>Gestiona las productoras principales</p>

      <form onSubmit={handleSubmit} className="mb-4">
        <h5>{editingId ? "Editar productora" : "Agregar nueva productora"}</h5>
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
          <div className="col-md-4">
            <label className="form-label">Slogan</label>
            <input
              type="text"
              className="form-control"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
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
          <div className="col-12">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
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
              setFormData({ name: "", slogan: "", description: "", status: "Activo" });
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
            <th>Slogan</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha creación</th>
            <th>Fecha actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productoras.length === 0 ? (
            <tr>
              <td colSpan="7">No hay productoras registradas</td>
            </tr>
          ) : (
            productoras.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.slogan}</td>
                <td>{p.description}</td>
                <td>{p.status}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(p)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p._id)}
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
