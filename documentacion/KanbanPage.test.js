import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import KanbanPage from '../frontend/src/pages/KanbanPage';
import * as api from '../frontend/src/services/api';

jest.mock('../frontend/src/services/api');

describe('KanbanPage', () => {
  const mockTasks = [
    { id: 1, title: 'Pendiente', status: 'pending', description: '', due_date: '', category: null },
    { id: 2, title: 'En Progreso', status: 'in_progress', description: '', due_date: '', category: null },
    { id: 3, title: 'Completada', status: 'completed', description: '', due_date: '', category: null },
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockTasks });
    api.patch.mockImplementation((url, data) => Promise.resolve({ ...mockTasks[0], ...data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('muestra las columnas de kanban y tareas', async () => {
    render(<KanbanPage />);
    expect(await screen.findByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
    expect(screen.getByText('Completada')).toBeInTheDocument();
  });

  it('permite avanzar el estado de una tarea', async () => {
    render(<KanbanPage />);
    const btn = await screen.findByText('Marcar como en progreso');
    fireEvent.click(btn);
    await waitFor(() => expect(api.patch).toHaveBeenCalled());
  });
});
