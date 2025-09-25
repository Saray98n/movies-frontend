import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', status: 'Activo' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get('/genres');
      setGenres(res.data);
    } catch (err) {
      Swal.fire('Error', 'No se pudo cargar géneros', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name.trim()) return Swal.fire('Atención','Nombre requerido','warning');
      if (editingId) {
        await api.put(`/genres/${editingId}`, form);
        Swal.fire('Actualizado','Género actualizado','success');
        setEditingId(null);
      } else {
        await api.post('/genres', form);
        Swal.fire('Creado','Género creado','success');
      }
      setForm({ name: '', description: '', status: 'Activo' });
      load();
    } catch (err) {
      Swal.fire('Error','Operación fallida','error');
    }
  };

  const edit = (g) => {
    setEditingId(g._id);
    setForm({ name: g.name || '', description: g.description || '', status: g.status || 'Activo' });
    window.scrollTo(0,0);
  };

  const remove = async (id) => {
    const r = await Swal.fire({ title: '¿Eliminar?', showCancelButton: true, confirmButtonText: 'Sí' });
    if (r.isConfirmed) {
      await api.delete(`/genres/${id}`);
      Swal.fire('Eliminado','Género eliminado','success');
      load();
    }
  };

  return (
    <div>
      <h2>Géneros</h2>
      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-4">
                <input className="form-control" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              </div>
              <div className="col-md-5">
                <input className="form-control" placeholder="Descripción" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
              </div>
              <div className="col-md-2">
                <select className="form-select" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="col-md-1 d-grid">
                <button className="btn btn-primary">{editingId ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <table className="table table-striped">
        <thead><tr><th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {genres.map(g=>(
            <tr key={g._id}>
              <td>{g.name}</td>
              <td>{g.description}</td>
              <td>{g.status}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(g)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(g._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
