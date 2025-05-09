import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetailPage from './TaskDetailPage';
import * as api from '../services/api';

jest.mock('../services/api');

describe('TaskDetailPage', () => {
  const mockTask = {
    id: 1,
    title: 'Tarea de prueba',
    description: 'Descripción de prueba',
    status: 'pending',
    priority: 'medium',
    due_date: '2025-05-10',
    category: { id: 1, name: 'Trabajo' },
  };

  beforeEach(() => {
    api.get.mockImplementation((url) => {
      if (url.startsWith('tasks/') && url.endsWith('/')) {
        return Promise.resolve({ data: mockTask });
      }
      if (url === 'tasks/categories/') {
        return Promise.resolve({ data: [{ id: 1, name: 'Trabajo' }] });
      }
      return Promise.resolve({ data: [] });
    });
    api.patch.mockResolvedValue({ data: mockTask });
    api.delete.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderWithRouter(taskId = 1) {
    window.confirm = jest.fn(() => true); // auto-confirm delete
    return render(
      <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
        <Routes>
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('muestra los detalles de la tarea', async () => {
    renderWithRouter();
    expect(await screen.findByText('Detalle de Tarea')).toBeInTheDocument();
    expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
    expect(screen.getByText('Pendiente', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Trabajo')).toBeInTheDocument();
  });

  it('permite editar solo título, descripción y fecha', async () => {
    renderWithRouter();
    fireEvent.click(await screen.findByText('Editar'));
    const titleInput = screen.getByPlaceholderText('Título');
    const descInput = screen.getByPlaceholderText('Descripción');
    const dateInput = screen.getByDisplayValue('2025-05-10');
    expect(titleInput).toBeInTheDocument();
    expect(descInput).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
    expect(screen.queryByText('Prioridad')).not.toBeInTheDocument();
    expect(screen.queryByText('Categoría')).not.toBeInTheDocument();
  });

  it('guarda cambios y regresa al modo vista', async () => {
    renderWithRouter();
    fireEvent.click(await screen.findByText('Editar'));
    fireEvent.change(screen.getByPlaceholderText('Título'), { target: { value: 'Nuevo título' } });
    fireEvent.click(screen.getByText('Guardar'));
    await waitFor(() => expect(screen.queryByDisplayValue('Nuevo título')).not.toBeInTheDocument());
    expect(screen.getByText('Nuevo título')).toBeInTheDocument();
  });

  it('elimina la tarea si se confirma', async () => {
    renderWithRouter();
    fireEvent.click(await screen.findByText('Eliminar'));
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('tasks/1/');
    });
  });
});
