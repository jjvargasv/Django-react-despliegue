import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TasksPage from '../frontend/src/pages/TasksPage';
import * as api from '../frontend/src/services/api';

jest.mock('../frontend/src/services/api');

describe('TasksPage', () => {
  const mockTasks = [
    { id: 1, title: 'Tarea 1', description: 'Desc 1', status: 'pending', due_date: '2025-05-10', category: { id: 1, name: 'Trabajo' } },
    { id: 2, title: 'Tarea 2', description: 'Desc 2', status: 'completed', due_date: '2025-05-11', category: { id: 2, name: 'Personal' } },
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockTasks });
    api.patch.mockResolvedValue({ data: { ...mockTasks[0], status: 'in_progress' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('muestra la lista de tareas y ordena completadas abajo', async () => {
    render(<TasksPage />);
    expect(await screen.findByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    const allTitles = screen.getAllByText(/Tarea/).map(e => e.textContent);
    expect(allTitles[allTitles.length-1]).toBe('Tarea 2'); // Completada al final
  });

  it('solo muestra botón Editar para tareas no completadas', async () => {
    render(<TasksPage />);
    expect(await screen.findByText('Editar')).toBeInTheDocument();
    expect(screen.queryAllByText('Editar').length).toBe(1);
    expect(screen.getByText('Completada')).toBeInTheDocument();
  });

  it('avanza el estado de una tarea cuando se hace clic', async () => {
    render(<TasksPage />);
    const btn = await screen.findByText('Marcar como en progreso');
    fireEvent.click(btn);
    await waitFor(() => expect(api.patch).toHaveBeenCalled());
  });
});
