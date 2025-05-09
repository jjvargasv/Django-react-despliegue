import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [filter]);

  const fetchTasks = async () => {
    let url = 'tasks/';
    if (filter) url += `?status=${filter}`;
    const res = await api.get(url);
    setTasks(res.data);
  };



  // Avanza el estado de la tarea
  const handleAdvanceStatus = async (task) => {
    let nextStatus = null;
    if (task.status === 'pending') nextStatus = 'in_progress';
    else if (task.status === 'in_progress') nextStatus = 'completed';
    if (nextStatus) {
      await api.patch(`tasks/${task.id}/`, { status: nextStatus });
      fetchTasks();
    }
  };


  return (
    <div style={{maxWidth:'100vw',boxSizing:'border-box',padding:'0 10px',margin:'0 auto'}}>
      <h2 style={{textAlign:'center',marginTop:24,marginBottom:12}}>Mis Tareas</h2>

      <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:'16px',marginBottom:24}}>
        <button
          onClick={() => setFilter('')}
          style={{
            background: filter === '' ? 'linear-gradient(90deg, #4f8cff 60%, #38bdf8 100%)' : '#e5e7eb',
            color: filter === '' ? '#fff' : '#333',
            border:'none',
            borderRadius:'12px',
            padding:'12px 22px',
            fontWeight:'bold',
            fontSize:'1rem',
            cursor:'pointer',
            transition:'background 0.2s',
            boxShadow: filter === '' ? '0 2px 8px #dbeafe' : 'none',
          }}
        >Todas</button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            background: filter === 'pending' ? 'linear-gradient(90deg, #38bdf8 60%, #4f8cff 100%)' : '#e5e7eb',
            color: filter === 'pending' ? '#fff' : '#333',
            border:'none',
            borderRadius:'12px',
            padding:'12px 22px',
            fontWeight:'bold',
            fontSize:'1rem',
            cursor:'pointer',
            transition:'background 0.2s',
            boxShadow: filter === 'pending' ? '0 2px 8px #dbeafe' : 'none',
          }}
        >Pendientes</button>
        <button
          onClick={() => setFilter('in_progress')}
          style={{
            background: filter === 'in_progress' ? 'linear-gradient(90deg, #60a5fa 60%, #38bdf8 100%)' : '#e5e7eb',
            color: filter === 'in_progress' ? '#fff' : '#333',
            border:'none',
            borderRadius:'12px',
            padding:'12px 22px',
            fontWeight:'bold',
            fontSize:'1rem',
            cursor:'pointer',
            transition:'background 0.2s',
            boxShadow: filter === 'in_progress' ? '0 2px 8px #dbeafe' : 'none',
          }}
        >En progreso</button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            background: filter === 'completed' ? 'linear-gradient(90deg, #38d9a9 60%, #60a5fa 100%)' : '#e5e7eb',
            color: filter === 'completed' ? '#fff' : '#333',
            border:'none',
            borderRadius:'12px',
            padding:'12px 22px',
            fontWeight:'bold',
            fontSize:'1rem',
            cursor:'pointer',
            transition:'background 0.2s',
            boxShadow: filter === 'completed' ? '0 2px 8px #dbeafe' : 'none',
          }}
        >Completadas</button>
      </div>
      {/* Lista de tarjetas de tareas ordenadas */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'18px',justifyContent:'center'}}>
        {tasks
          .slice()
          .sort((a, b) => {
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            return 0;
          })
          .map(task => (
            <div key={task.id} style={{background:'#fff',borderRadius:10,boxShadow:'0 2px 8px #e0e7ef',padding:18,minWidth:280,maxWidth:340,margin:'8px auto',display:'flex',flexDirection:'column',gap:4}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontWeight:'bold',fontSize:'1.1rem'}}>{task.title}</span>
                <span style={{fontSize:12,color:'#666'}}>{task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}</span>
              </div>
              {task.category && task.category.name && (
                <span style={{marginBottom:8, color:'#888'}}>Categoría: {task.category.name}</span>
              )}
              <div style={{marginBottom:10, color:'#444'}}>{task.description}</div>
              <div style={{display:'flex',gap:'10px',marginTop:'8px',alignItems:'center'}}>
                {/* Botón único de avance de estado */}
                {task.status === 'pending' && (
                  <button
                    style={{
                      background:'#f59e42', color:'#fff', border:'none', borderRadius:'6px', padding:'6px 14px', fontWeight:'bold', cursor:'pointer', marginRight: '6px'
                    }}
                    onClick={()=>handleAdvanceStatus(task)}
                  >Marcar como en progreso</button>
                )}
                {task.status === 'in_progress' && (
                  <button
                    style={{
                      background:'#22c55e', color:'#fff', border:'none', borderRadius:'6px', padding:'6px 14px', fontWeight:'bold', cursor:'pointer', marginRight: '6px'
                    }}
                    onClick={()=>handleAdvanceStatus(task)}
                  >Marcar como completada</button>
                )}
                {task.status === 'completed' && (
                  <span style={{background:'#22c55e', color:'#fff', borderRadius:'6px', padding:'6px 14px', fontWeight:'bold'}}>Completada</span>
                )}
                {/* Botón Editar solo si NO está completada */}
                {task.status !== 'completed' && (
                  <button
                    style={{
                      color:'#fff',
                      background:'#4f8cff',
                      border:'none',
                      borderRadius:'6px',
                      padding:'6px 14px',
                      fontWeight:'bold',
                      cursor:'pointer',
                      transition:'background 0.2s',
                    }}
                    onClick={()=>navigate(`/tasks/${task.id}`)}
                  >Editar</button>
                )}
              </div>
            </div>
          ))}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'20px',justifyContent:'center',marginTop:24}}>
        {tasks.length === 0 && (
          <div style={{color:'#888',fontSize:'1.1rem',marginTop:40}}>No hay tareas para mostrar.</div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
