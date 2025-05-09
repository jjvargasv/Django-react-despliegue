import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import KanbanPage from './pages/KanbanPage';
import PasswordResetPage from './pages/PasswordResetPage';
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AppRouter = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/reset-confirm/:uidb64/:token" element={<PasswordResetConfirmPage />} />
        <Route path="/profile" element={<div className="main-app-container"><PrivateRoute><ProfilePage /></PrivateRoute></div>} />
        <Route path="/tasks" element={<div className="main-app-container"><PrivateRoute><TasksPage /></PrivateRoute></div>} />
        <Route path="/tasks/:id" element={<div className="main-app-container"><PrivateRoute><TaskDetailPage /></PrivateRoute></div>} />
        <Route path="/categories" element={<div className="main-app-container"><PrivateRoute><CategoriesPage /></PrivateRoute></div>} />
        <Route path="/kanban" element={<div className="main-app-container"><PrivateRoute><KanbanPage /></PrivateRoute></div>} />
        <Route path="*" element={<Navigate to="/kanban" />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRouter;
