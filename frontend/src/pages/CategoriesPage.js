import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CategoriesPage = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleEditSave = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.patch(`tasks/categories/${id}/edit/`, { name: editName });
      setEditingId(null);
      setEditName('');
      fetchCategories();
    } catch {
      setError('No se pudo editar la categoría.');
    }
  }

  const fetchCategories = async () => {
    const res = await api.get('tasks/categories/');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('tasks/categories/', { name });
      setName('');
      fetchCategories();
    } catch (err) {
      setError('No se pudo crear la categoría.');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Eliminar esta categoría?')) {
      await api.delete(`tasks/categories/${id}/`);
      fetchCategories();
    }
  };

  return (
    <div className="categories-main-container">
      <h2 className="categories-title">Categorías</h2>
      <form onSubmit={handleSubmit} className="categories-form">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nueva categoría" required className="categories-input" />
        <button type="submit" className="categories-create-btn">Crear</button>
      </form>
      {error && <div className="categories-error">{error}</div>}
      <div className="categories-grid">
        {categories.map(cat => (
           <div key={cat.id} style={{background:'#fff',borderRadius:'12px',boxShadow:'0 2px 8px #dbeafe',padding:'28px 22px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transition:'box-shadow 0.2s',position:'relative',minHeight:'120px'}}>
             {editingId === cat.id ? (
               <>
                 <input
                   value={editName}
                   onChange={e => setEditName(e.target.value)}
                   style={{padding:8,borderRadius:8,border:'1px solid #d1d5db',fontSize:'1rem',marginBottom:16,width:'100%',maxWidth:180}}
                   autoFocus
                 />
                 <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:8}}>
                   <button onClick={()=>handleEditSave(cat.id)} style={{background:'#22c55e',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 14px',fontWeight:'bold'}}>Guardar</button>
                   <button onClick={()=>setEditingId(null)} style={{background:'#e5e7eb',color:'#333',border:'none',borderRadius:'8px',padding:'8px 14px',fontWeight:'bold'}}>Cancelar</button>
                 </div>
               </>
             ) : (
               <>
                 <span onClick={() => onSelect && onSelect(cat)} style={{cursor:onSelect?'pointer':'default', color:'#4f8cff',fontWeight:'bold',fontSize:'1.15rem',marginBottom:12}}>{cat.name}</span>
                 <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:8}}>
                   <button onClick={()=>{setEditingId(cat.id);setEditName(cat.name);}} style={{background:'#38bdf8',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 14px',fontWeight:'bold'}}>Editar</button>
                   <button
                     style={{
                       color:'#fff',
                       background:'#ef4444',
                       border:'none',
                       borderRadius:'8px',
                       padding:'8px 18px',
                       fontWeight:'bold',
                       fontSize:'1rem',
                       cursor:'pointer',
                       boxShadow:'0 2px 8px #fecaca',
                       transition:'background 0.2s',
                     }}
                     onMouseOver={e => e.currentTarget.style.background='#b91c1c'}
                     onMouseOut={e => e.currentTarget.style.background='#ef4444'}
                     onClick={()=>handleDelete(cat.id)}
                   >Eliminar</button>
                 </div>
               </>
             )}
           </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
