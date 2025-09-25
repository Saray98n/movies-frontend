import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Productions(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', slogan:'', description:'', status:'Activo' });
  const [editing, setEditing] = useState(null);
  useEffect(()=>{ load(); },[]);
  const load=async()=>{ try{ const r=await api.get('/productions'); setItems(r.data);}catch{Swal.fire('Error','No se cargaron productoras','error');}};
  const submit=async(e)=>{ e.preventDefault(); try{ if(editing){ await api.put(`/productions/${editing}`, form); setEditing(null); } else { await api.post('/productions', form);} setForm({ name:'', slogan:'', description:'', status:'Activo' }); load(); Swal.fire('Hecho','','success'); }catch{Swal.fire('Error','Operación fallida','error');}};
  const edit=(it)=>{ setEditing(it._1d); setForm({ name:it.name||'', slogan:it.slogan||'', description:it.description||'', status:it.status||'Activo' }); window.scrollTo(0,0); };
  const remove=async(id)=>{ const r=await Swal.fire({ title:'Eliminar?', showCancelButton:true, confirmButtonText:'Sí' }); if(r.isConfirmed){ await api.delete(`/productions/${id}`); Swal.fire('Eliminado','','success'); load(); } };
  return (<div><h2>Productoras</h2><div className="card mb-3"><div className="card-body"><form onSubmit={submit}><div className="row g-2"><div className="col-md-4"><input className="form-control" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></div><div className="col-md-3"><input className="form-control" placeholder="Slogan" value={form.slogan} onChange={e=>setForm({...form, slogan:e.target.value})} /></div><div className="col-md-3"><input className="form-control" placeholder="Descripción" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></div><div className="col-md-1 d-grid"><button className="btn btn-primary">{editing ? 'Actualizar' : 'Guardar'}</button></div></div></form></div></div><table className="table table-striped"><thead><tr><th>Nombre</th><th>Slogan</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody>{items.map(it=>(<tr key={it._id}><td>{it.name}</td><td>{it.slogan}</td><td>{it.description}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(it)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>remove(it._id)}>Delete</button></td></tr>))}</tbody></table></div>);
}
