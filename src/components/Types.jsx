import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Types(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', description:'' });
  const [editing, setEditing] = useState(null);
  useEffect(()=>{ load(); },[]);
  const load=async()=>{ try{ const r=await api.get('/types'); setItems(r.data);}catch{Swal.fire('Error','No se cargaron tipos','error');}};
  const submit=async(e)=>{ e.preventDefault(); try{ if(editing){ await api.put(`/types/${editing}`, form); setEditing(null); } else { await api.post('/types', form);} setForm({ name:'', description:'' }); load(); Swal.fire('Hecho','','success'); }catch{Swal.fire('Error','Operación fallida','error');}};
  const edit=(it)=>{ setEditing(it._id); setForm({ name:it.name||'', description:it.description||'' }); window.scrollTo(0,0); };
  const remove=async(id)=>{ const r=await Swal.fire({ title:'Eliminar?', showCancelButton:true, confirmButtonText:'Sí' }); if(r.isConfirmed){ await api.delete(`/types/${id}`); Swal.fire('Eliminado','','success'); load(); } };
  return (<div><h2>Tipos</h2><div className="card mb-3"><div className="card-body"><form onSubmit={submit}><div className="row g-2"><div className="col-md-6"><input className="form-control" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></div><div className="col-md-5"><input className="form-control" placeholder="Descripción" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></div><div className="col-md-1 d-grid"><button className="btn btn-primary">{editing ? 'Actualizar' : 'Guardar'}</button></div></div></form></div></div><table className="table table-striped"><thead><tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody>{items.map(it=>(<tr key={it._id}><td>{it.name}</td><td>{it.description}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(it)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>remove(it._id)}>Delete</button></td></tr>))}</tbody></table></div>);
}
