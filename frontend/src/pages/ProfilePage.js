import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=User&background=4f8cff&color=fff&size=128';

function getValidAvatar(url) {
  // Solo acepta url de imagen válida o placeholder
  if (!url || typeof url !== 'string' || url.includes('borrar')) return AVATAR_PLACEHOLDER;
  return url;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({old_password: '', new_password: '', confirm_password: ''});
  const [passwordMsg, setPasswordMsg] = useState('');
  
  useEffect(() => {
    api.get('users/profile/').then(res => {
      setProfile(res.data);
      setForm(res.data);
      setPreview(res.data.profile_picture);
    });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatar = e => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', form.email);
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    if (avatar) formData.append('profile_picture', avatar);
    try {
      const res = await api.patch('users/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEdit(false);
      setProfile(res.data);
      setPreview(res.data.profile_picture);
      setAvatar(null);
    } catch (err) {
      setEdit(false);
      setAvatar(null);
      alert((err.response && err.response.data && JSON.stringify(err.response.data)) || 'Error al actualizar el perfil.');
    }
  };

  const handlePasswordChange = e => {
    setPasswords({...passwords, [e.target.name]: e.target.value});
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordMsg('Las contraseñas no coinciden.');
      return;
    }
    try {
      await api.post('users/change_password/', {
        old_password: passwords.old_password,
        new_password: passwords.new_password
      });
      setPasswordMsg('Contraseña actualizada correctamente.');
      setPasswords({old_password: '', new_password: '', confirm_password: ''});
    } catch {
      setPasswordMsg('Error al actualizar la contraseña.');
    }
  };

  if (!profile) return <div className="profile-loading">Cargando...</div>;

  return (
    <div className="profile-page-container">
      <h2 className="profile-title">Mi Perfil</h2>
      <div className="profile-card">
        <img
          src={getValidAvatar(preview)}
          alt="avatar"
          className="profile-avatar"
        />
        {edit ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <input type="file" accept="image/*" onChange={handleAvatar} className="profile-input-file" />
            <input name="first_name" value={form.first_name||''} onChange={handleChange} placeholder="Nombre" className="profile-input" />
            <input name="last_name" value={form.last_name||''} onChange={handleChange} placeholder="Apellido" className="profile-input" />
            <input name="email" value={form.email||''} onChange={handleChange} placeholder="Email" className="profile-input" />
            <div className="profile-btn-row">
              <button type="submit" className="profile-btn-save">Guardar</button>
              <button type="button" onClick={()=>setEdit(false)} className="profile-btn-cancel">Cancelar</button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-name">{profile.first_name} {profile.last_name}</div>
            <div className="profile-email">{profile.email}</div>
            <button onClick={()=>setEdit(true)} className="profile-btn-edit">Editar Perfil</button>
          </>
        )}
        <button onClick={()=>setShowPasswordForm(v=>!v)} className="profile-btn-password">{showPasswordForm?'Cerrar':'Cambiar contraseña'}</button>
        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <input type="password" name="old_password" value={passwords.old_password} onChange={handlePasswordChange} placeholder="Contraseña actual" className="profile-input" />
            <input type="password" name="new_password" value={passwords.new_password} onChange={handlePasswordChange} placeholder="Nueva contraseña" className="profile-input" />
            <input type="password" name="confirm_password" value={passwords.confirm_password} onChange={handlePasswordChange} placeholder="Confirmar nueva contraseña" className="profile-input" />
            <button type="submit" className="profile-btn-save">Guardar contraseña</button>
            {passwordMsg && <div className={passwordMsg.includes('correctamente') ? 'profile-msg-success' : 'profile-msg-error'}>{passwordMsg}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
