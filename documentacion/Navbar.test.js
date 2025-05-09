import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../frontend/src/components/Navbar';
import { AuthContext } from '../frontend/src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar', () => {
  const mockLogout = jest.fn();
  const user = { username: 'test' };

  it('muestra enlaces si hay usuario', () => {
    render(
      <AuthContext.Provider value={{ user, logout: mockLogout }}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText('Kanban')).toBeInTheDocument();
    expect(screen.getByText('Tareas')).toBeInTheDocument();
    expect(screen.getByText('Categorías')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  it('no muestra nada si no hay usuario', () => {
    const { container } = render(
      <AuthContext.Provider value={{ user: null, logout: mockLogout }}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('llama logout al hacer clic en cerrar sesión', () => {
    render(
      <AuthContext.Provider value={{ user, logout: mockLogout }}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
