import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const cardStyle = {
  background:'#fff',
  borderRadius:'16px',
  boxShadow:'0 2px 16px #4f8cff18',
  padding:'32px 28px',
  maxWidth:500,
  margin:'40px auto',
};
const buttonStyle = {
  color:'#fff',
  background:'linear-gradient(90deg, #4f8cff 60%, #38bdf8 100%)',
  border:'none',
  borderRadius:'8px',
  padding:'10px 22px',
  fontWeight:'bold',
  fontSize:'1rem',
  cursor:'pointer',
  marginRight:'10px',
  marginTop:'8px',
  transition:'background 0.2s',
};

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');


  useEffect(() => {
    api.get(`tasks/${id}/`).then(res => {
      setTask(res.data);
      setForm({ ...res.data, category_id: res.data.category ? res.data.category.id : '' });
    });

  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.patch(`tasks/${id}/`, form);
      setTask(res.data);
      setEdit(false);
    } catch (err) {
      setError('Error al actualizar la tarea.');
    }
  };

  const handleDelete = async () => {
    if(window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
      await api.delete(`tasks/${id}/`);
      navigate('/tasks');
    }
  };

  if (!task) return <div>Cargando...</div>;

  return (
    <div style={cardStyle}>
      <h2 style={{textAlign:'center',color:'#4f8cff',marginBottom:24}}>Detalle de Tarea</h2>
      {task.status === 'completed' ? (
        <div style={{textAlign:'left', opacity:0.85}}>
          <p><b>Título:</b> {task.title}</p>
          <p><b>Descripción:</b> {task.description}</p>
          <p><b>Estado:</b> Completada</p>
          <p><b>Prioridad:</b> {task.priority}</p>
          <p><b>Fecha límite:</b> {task.due_date}</p>
          <p><b>Categoría:</b> {task.category ? task.category.name : ''}</p>
          <div style={{color:'#38bdf8',marginTop:18,fontWeight:'bold'}}>Esta tarea está finalizada y es solo de consulta.</div>
        </div>
      ) : edit ? (
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16,marginTop:8}}>
          <input name="title" value={form.title||''} onChange={handleChange} placeholder="Título" required />
          <textarea name="description" value={form.description||''} onChange={handleChange} placeholder="Descripción" rows={3} />
          <input type="date" name="due_date" value={form.due_date||''} onChange={handleChange} />
          <div style={{display:'flex',gap:10,marginTop:8}}>
            <button type="submit" style={buttonStyle}>Guardar</button>
            <button type="button" style={{...buttonStyle,background:'#a3a3a3'}} onClick={()=>setEdit(false)}>Cancelar</button>
          </div>
          {error && <div style={{color:'#ef4444',marginTop:6}}>{error}</div>}
        </form>
      ) : (
        <div style={{textAlign:'left'}}>
          <p><b>Título:</b> {task.title}</p>
          <p><b>Descripción:</b> {task.description}</p>
          <p><b>Estado:</b> {task.status}</p>
          <p><b>Prioridad:</b> {task.priority}</p>
          <p><b>Fecha límite:</b> {task.due_date}</p>
          <p><b>Categoría:</b> {task.category ? task.category.name : ''}</p>
          <button onClick={()=>setEdit(true)} style={buttonStyle}>Editar</button>
          <button onClick={handleDelete} style={{...buttonStyle,background:'#ef4444'}}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;
