import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Media(){
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [productions, setProductions] = useState([]);

  const empty = { serial:'', title:'', synopsis:'', url:'', image:'', year:'', type:'', genre:'', director:'', production:'' };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ loadAll(); },[]);

  const loadAll = async ()=>{
    try{
      const [t,g,d,p,m] = await Promise.all([api.get('/types'), api.get('/genres'), api.get('/directors'), api.get('/productions'), api.get('/media')]);
      setTypes(t.data); setGenres(g.data); setDirectors(d.data); setProductions(p.data); setItems(m.data);
    }catch(err){ console.error(err); Swal.fire('Error','No se pudo cargar datos','error'); }
  };

  const submit = async (e) => {
    e.preventDefault();
    try{
      if(!form.serial || !form.title || !form.url) return Swal.fire('Atención','serial, title y url son obligatorios','warning');
      if(editing){
        await api.put(`/media/${editing}`, form);
        Swal.fire('Actualizado','Media actualizada','success');
        setEditing(null);
      } else {
        await api.post('/media', form);
        Swal.fire('Creado','Media creada','success');
      }
      setForm(empty); loadAll();
    }catch(err){ console.error(err); Swal.fire('Error','Operación fallida','error'); }
  };

  const edit = (m) => {
    setEditing(m._id);
    setForm({ serial:m.serial, title:m.title, synopsis:m.synopsis, url:m.url, image:m.image, year:m.year||'', type:m.type?m.type._id:'', genre:m.genre?m.genre._id:'', director:m.director?m.director._id:'', production:m.production?m.production._id:'' });
    window.scrollTo(0,0);
  };

  const remove = async (id) => {
    const r = await Swal.fire({ title:'Eliminar?', showCancelButton:true, confirmButtonText:'Sí' });
    if(r.isConfirmed){ await api.delete(`/media/${id}`); Swal.fire('Eliminado','Media eliminada','success'); loadAll(); }
  };

  return (<div>
    <h2>Media (Películas y Series)</h2>
    <div className="card mb-3"><div className="card-body">
      <form onSubmit={submit}>
        <div className="row g-2">
          <div className="col-md-2"><input className="form-control" placeholder="Serial" value={form.serial} onChange={e=>setForm({...form, serial:e.target.value})} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Año" value={form.year} onChange={e=>setForm({...form, year:e.target.value})} /></div>
          <div className="col-md-4 d-grid"><button className="btn btn-primary">{editing ? 'Actualizar' : 'Guardar'}</button></div>
        </div>
        <div className="row g-2 mt-2">
          <div className="col-md-6"><input className="form-control" placeholder="URL" value={form.url} onChange={e=>setForm({...form, url:e.target.value})} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Image URL" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} /></div>
        </div>
        <div className="row g-2 mt-2">
          <div className="col-md-6"><input className="form-control" placeholder="Sinopsis" value={form.synopsis} onChange={e=>setForm({...form, synopsis:e.target.value})} /></div>
          <div className="col-md-6">
            <div className="row g-2">
              <div className="col-md-6"><select className="form-select" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}><option value="">-- Tipo --</option>{types.map(t=>(<option key={t._id} value={t._id}>{t.name}</option>))}</select></div>
              <div className="col-md-6"><select className="form-select" value={form.genre} onChange={e=>setForm({...form, genre:e.target.value})}><option value="">-- Género --</option>{genres.map(g=>(<option key={g._id} value={g._id}>{g.name}</option>))}</select></div>
              <div className="col-md-6 mt-2"><select className="form-select" value={form.director} onChange={e=>setForm({...form, director:e.target.value})}><option value="">-- Director --</option>{directors.map(d=>(<option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>))}</select></div>
              <div className="col-md-6 mt-2"><select className="form-select" value={form.production} onChange={e=>setForm({...form, production:e.target.value})}><option value="">-- Productora --</option>{productions.map(p=>(<option key={p._id} value={p._id}>{p.name}</option>))}</select></div>
            </div>
          </div>
        </div>
      </form>
    </div></div>

    <div className="table-responsive">
      <table className="table table-striped">
        <thead><tr><th>Serial</th><th>Título</th><th>Año</th><th>Tipo</th><th>Género</th><th>Director</th><th>Productora</th><th>Acciones</th></tr></thead>
        <tbody>{items.map(m=>(<tr key={m._id}><td>{m.serial}</td><td>{m.title}</td><td>{m.year}</td><td>{m.type?m.type.name:''}</td><td>{m.genre?m.genre.name:''}</td><td>{m.director?`${m.director.firstName} ${m.director.lastName}`:''}</td><td>{m.production?m.production.name:''}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(m)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>remove(m._id)}>Delete</button></td></tr>))}</tbody>
      </table>
    </div>
  </div>);
}
