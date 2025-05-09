import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoriesPage from '../frontend/src/pages/CategoriesPage';
import * as api from '../frontend/src/services/api';

jest.mock('../frontend/src/services/api');

describe('CategoriesPage', () => {
  const mockCategories = [
    { id: 1, name: 'Trabajo' },
    { id: 2, name: 'Personal' },
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockCategories });
    api.post.mockResolvedValue({ data: { id: 3, name: 'Nueva' } });
    api.patch.mockResolvedValue({ data: { id: 1, name: 'Editada' } });
    api.delete.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('muestra categorías', async () => {
    render(<CategoriesPage />);
    expect(await screen.findByText('Trabajo')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('permite agregar una categoría', async () => {
    render(<CategoriesPage />);
    fireEvent.change(screen.getByPlaceholderText('Nueva categoría'), { target: { value: 'Nueva' } });
    fireEvent.click(screen.getByText('Agregar'));
    await waitFor(() => expect(api.post).toHaveBeenCalled());
  });

  it('permite editar una categoría', async () => {
    render(<CategoriesPage />);
    fireEvent.click(await screen.findAllByText('Editar')[0]);
    fireEvent.change(screen.getByDisplayValue('Trabajo'), { target: { value: 'Editada' } });
    fireEvent.click(screen.getByText('Guardar'));
    await waitFor(() => expect(api.patch).toHaveBeenCalled());
  });

  it('permite eliminar una categoría', async () => {
    window.confirm = jest.fn(() => true);
    render(<CategoriesPage />);
    fireEvent.click(await screen.findAllByText('Eliminar')[0]);
    await waitFor(() => expect(api.delete).toHaveBeenCalled());
  });
});
