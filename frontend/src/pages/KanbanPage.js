import React, { useEffect, useState } from 'react';
import api from '../services/api';

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completada',
};

const KanbanPage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', due_date: '', category_id: '' });

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get('tasks/');
    setTasks(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get('tasks/categories/');
    setCategories(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('tasks/', { ...newTask, status: 'pending' });
    setNewTask({ title: '', description: '', priority: 'medium', due_date: '', category_id: '' });
    fetchTasks();
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

  const handleCategoryChange = async (task, newCategoryId) => {
    await api.patch(`tasks/${task.id}/`, { category_id: newCategoryId });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await api.delete(`tasks/${id}/`);
    fetchTasks();
  };

  // Mostrar todas las tareas, incluidas las completadas
  const kanbanTasks = tasks;

  return (
    <div className="kanban-container"
      style={{
        display:'flex',
        flexWrap:'wrap',
        gap:'20px',
        alignItems:'flex-start',
        justifyContent:'center',
        padding:'20px 0',
        boxSizing:'border-box',
        width:'100%',
        maxWidth:'100vw',
        margin:0,
      }}>

      {/* Formulario para crear tarea */}
      <form onSubmit={handleCreate} style={{margin:'0 auto 24px auto',maxWidth:400,background:'#f8fafc',padding:16,borderRadius:8,display:'flex',flexDirection:'column',gap:10}}>
        <input placeholder="Título" value={newTask.title} onChange={e=>setNewTask({...newTask, title:e.target.value})} required />
        <input placeholder="Descripción" value={newTask.description} onChange={e=>setNewTask({...newTask, description:e.target.value})} />
        <input type="date" value={newTask.due_date} onChange={e=>setNewTask({...newTask, due_date:e.target.value})} />
        <select value={newTask.priority} onChange={e=>setNewTask({...newTask, priority:e.target.value})}>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        <select value={newTask.category_id} onChange={e=>setNewTask({...newTask, category_id:e.target.value})} required>
          <option value="">Selecciona categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">Crear tarea</button>
      </form>
      {/* Tablero Kanban: una columna por categoría */}
      {categories.map(cat => (
        <div key={cat.id} style={{
          flex:'1 1 320px',
          minWidth:'280px',
          maxWidth:'360px',
          background:'#f4f4f4',
          padding:'10px',
          borderRadius:'8px',
          minHeight:'300px',
          boxSizing:'border-box',
          margin:'0 8px 24px 8px',
        }}>
          <h3 style={{textAlign:'center',color:'#4f8cff'}}>{cat.name}</h3>
          {['pending','in_progress'].map(status => (
            <div key={status}>
              <h4 style={{margin:'10px 0 4px 0',fontSize:15,color:'#888'}}>{statusLabels[status]}</h4>
              {kanbanTasks.filter(t => t.category && t.category.id === cat.id && t.status === status).length === 0 && (
                <div style={{color:'#bbb',fontStyle:'italic',marginBottom:6}}>Sin tareas</div>
              )}
              {kanbanTasks.filter(t => t.category && t.category.id === cat.id && t.status === status).map(task => (
                <div key={task.id} style={{
                  background:'#fff',
                  margin:'8px 0',
                  padding:'8px',
                  borderRadius:'4px',
                  boxShadow:'0 1px 2px #ccc',
                  display:'flex',
                  flexDirection:'row',
                  alignItems:'stretch',
                }}>
                  {/* Barra de prioridad visual */}
                  <div style={{
                    width: '7px',
                    borderRadius: '4px',
                    marginRight: '12px',
                    background: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e42' : '#22c55e',
                    minHeight: '100%',
                    transition: 'background 0.2s'
                  }} />
                  {/* Contenido de la tarjeta */}
                  <div style={{flex:1, display:'flex', flexDirection:'column'}}>
                    <b>{task.title}</b>
                    <div>{task.description}</div>
                    <div style={{color:'#888'}}>Vence: {task.due_date}</div>
                    <div style={{margin:'8px 0', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
                      {/* Botón único de avance de estado */}
                      {task.status === 'pending' && (
                        <button
                          onClick={() => handleAdvanceStatus(task)}
                          style={{
                            background: '#f59e42',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginRight: '10px',
                          }}
                        >
                          Marcar como en progreso
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => handleAdvanceStatus(task)}
                          style={{
                            background: '#22c55e',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginRight: '10px',
                          }}
                        >
                          Marcar como completada
                        </button>
                      )}
                      {task.status === 'completed' && (
                        <span style={{
                          background: '#22c55e',
                          color: '#fff',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontWeight: 'bold',
                        }}>Completada</span>
                      )}
                      {/* Select de categoría */}
                      <select
                        value={task.category ? task.category.id : ''}
                        onChange={e=>handleCategoryChange(task, e.target.value)}
                        style={{
                          borderRadius:'6px',
                          padding:'6px 10px',
                          border:'1px solid #d1d5db',
                          background:'#f9fafb',
                          fontWeight:'bold',
                          cursor:'pointer',
                          color:'#333',
                        }}
                      >
                        {categories.map(c=>(
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <button
                        style={{
                          color:'#fff',
                          background: task.status==='completed' ? '#9ca3af' : '#ef4444',
                          border:'none',
                          borderRadius:'6px',
                          padding:'6px 14px',
                          fontWeight:'bold',
                          cursor: task.status==='completed' ? 'not-allowed' : 'pointer',
                          opacity: task.status==='completed' ? 0.7 : 1,
                          transition:'background 0.2s',
                          position:'relative',
                        }}
                        disabled={task.status==='completed'}
                        title={task.status==='completed' ? 'No puedes eliminar una tarea completada' : 'Eliminar tarea'}
                        onClick={()=>task.status!=='completed' && handleDelete(task.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanPage;
