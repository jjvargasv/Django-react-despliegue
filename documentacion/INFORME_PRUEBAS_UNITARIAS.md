# Informe de Pruebas Unitarias: TaskMaster

## Resumen
Este documento contiene la evidencia y los resultados de las pruebas unitarias realizadas sobre los componentes principales de la aplicación TaskMaster. Las pruebas fueron implementadas con **Jest** y **React Testing Library**. A continuación se detallan los archivos de pruebas, los casos cubiertos y el resultado de ejecución.

---

## 1. TasksPage.test.js
**Ubicación:** `documentacion/TasksPage.test.js`

### Casos de prueba cubiertos
- Muestra la lista de tareas y ordena las completadas al final.
- Solo muestra el botón "Editar" para tareas no completadas.
- Permite avanzar el estado de una tarea cuando se hace clic en el botón correspondiente.

### Fragmento del código de prueba
```javascript
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
```

### Resultado de la ejecución
- **Todas las pruebas pasaron correctamente.**

---

## 2. Ubicación de los demás archivos de prueba
- `documentacion/TaskDetailPage.test.js`
- `documentacion/KanbanPage.test.js`
- `documentacion/CategoriesPage.test.js`
- `documentacion/Navbar.test.js`

Cada archivo contiene pruebas similares que cubren los flujos y funcionalidades principales de cada componente.

---

## 3. Evidencia de ejecución
- Las pruebas fueron ejecutadas usando el comando:
  ```bash
  npm test -- ../../documentacion/TasksPage.test.js
  ```
- **Resultado:**
  - Todas las pruebas pasaron exitosamente.

---

## 4. ¿Cómo validar?
1. Ubica los archivos `.test.js` en la carpeta `documentacion`.
2. Ejecuta las pruebas con:
   ```bash
   cd frontend
   npm test -- ../../documentacion/TasksPage.test.js
   ```
3. Verifica que todas las pruebas pasen (sin errores ni fallos).

---

### Si se requiere, puedo agregar más detalles, capturas de pantalla o resultados de otros archivos de prueba.
