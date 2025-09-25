import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Directors(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ firstName:'', lastName:'', status:'Activo' });
  const [editing, setEditing] = useState(null);
  useEffect(()=>{ load(); },[]);
  const load = async()=>{ try{ const r=await api.get('/directors'); setItems(r.data); }catch{ Swal.fire('Error','No se cargaron directores','error'); } };
  const submit = async(e)=>{ e.preventDefault();
    try{
      if(editing){ await api.put(`/directors/${editing}`, form); Swal.fire('Actualizado','','success'); setEditing(null); }
      else{ await api.post('/directors', form); Swal.fire('Creado','','success'); }
      setForm({ firstName:'', lastName:'', status:'Activo' }); load();
    }catch{ Swal.fire('Error','Operación fallida','error'); }
  };
  const edit = (it)=>{ setEditing(it._id); setForm({ firstName:it.firstName||'', lastName:it.lastName||'', status:it.status||'Activo' }); window.scrollTo(0,0); };
  const remove = async(id)=>{ const res=await Swal.fire({ title:'Eliminar?', showCancelButton:true, confirmButtonText:'Sí' }); if(res.isConfirmed){ await api.delete(`/directors/${id}`); Swal.fire('Eliminado','','success'); load(); } };
  return (
    <div>
      <h2>Directores</h2>
      <div className="card mb-3"><div className="card-body">
        <form onSubmit={submit}>
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" placeholder="Nombre" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} /></div>
            <div className="col-md-4"><input className="form-control" placeholder="Apellido" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} /></div>
            <div className="col-md-3"><select className="form-select" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}><option>Activo</option><option>Inactivo</option></select></div>
            <div className="col-md-1 d-grid"><button className="btn btn-primary">{editing ? 'Actualizar' : 'Guardar'}</button></div>
          </div>
        </form>
      </div></div>
      <table className="table table-striped"><thead><tr><th>Nombre</th><th>Apellido</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>{items.map(it=>(<tr key={it._id}><td>{it.firstName}</td><td>{it.lastName}</td><td>{it.status}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(it)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>remove(it._id)}>Delete</button></td></tr>))}</tbody></table>
    </div>
  );
}
