import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationToast from '../components/NotificationToast';
import { Pencil, Camera, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [nombres, setNombres] = useState(user?.nombres || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [correo, setCorreo] = useState(user?.correo || '');
  const [dni, setDni] = useState(user?.dni || '');
  const [estado, setEstado] = useState(user?.estado || '');
  const [fotoUrl, setFotoUrl] = useState(user?.fotoUrl || '');
  const [editingField, setEditingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (!user) return;
    setNombres(user.nombres || '');
    setApellidos(user.apellidos || '');
    setCorreo(user.correo || '');
    setDni(user.dni || '');
    setEstado(user.estado || '');
    setFotoUrl(user.fotoUrl || '');
  }, [user]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3500);
  };

  const persistProfile = async (fields) => {
    setIsSaving(true);
    try {
      await updateUser(fields);
      setEditingField(null);
      triggerToast('Los cambios se guardaron en tu cuenta.', 'success');
    } catch (err) {
      triggerToast(err.message || 'No se pudieron guardar los cambios.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    persistProfile({ nombres, apellidos, dni, fotoUrl });
  };

  const handleCancel = () => {
    setNombres(user?.nombres || '');
    setApellidos(user?.apellidos || '');
    setDni(user?.dni || '');
    setFotoUrl(user?.fotoUrl || '');
    setEditingField(null);
    triggerToast('Se cancelaron las modificaciones.', 'error');
  };

  const handlePhotoChange = () => {
    const newPhotos = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    ];
    const nextPhoto = newPhotos[(newPhotos.indexOf(fotoUrl) + 1) % newPhotos.length];
    setFotoUrl(nextPhoto);
    persistProfile({ nombres, apellidos, dni, fotoUrl: nextPhoto });
  };

  return (
    <div className="max-w-4xl mx-auto font-nunito">
      <ToastNotification toast={toast} setToast={setToast} />

      <form onSubmit={handleSaveChanges} className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-8">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-extrabold text-custom-gris-oscuro dark:text-slate-100 font-roboto">
            Configuración del Perfil
          </h2>
          <p className="text-sm text-custom-gris-claro mt-1">
            Los cambios se guardan en el servidor y quedan disponibles la próxima vez que inicies sesión.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="relative group">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt={`${nombres} ${apellidos}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-[150px] h-[150px] rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white shadow-md flex items-center justify-center text-slate-400 text-4xl font-bold">
                {(nombres || '?').charAt(0)}
              </div>
            )}
            <button
              type="button"
              onClick={handlePhotoChange}
              disabled={isSaving}
              className="absolute bottom-1 right-1 bg-custom-celeste hover:bg-custom-azul-oscuro text-white p-2.5 rounded-full shadow-lg transition-transform transform hover:scale-110 cursor-pointer disabled:opacity-60"
              title="Cambiar foto de perfil"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg text-custom-gris-oscuro dark:text-slate-100 font-roboto">
              {nombres} {apellidos}
            </h3>
            <p className="text-xs text-custom-gris-claro font-mono">{correo}</p>
            <p className="text-xs text-custom-gris-claro mt-1">
              Rol: <span className="font-semibold">{user?.rol || '—'}</span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-custom-gris-oscuro dark:text-slate-100 uppercase tracking-wide font-roboto mb-4">
            Datos Personales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldBox
              label="Nombres"
              value={nombres}
              isEditing={editingField === 'nombres'}
              onEdit={() => setEditingField('nombres')}
              onChange={setNombres}
            />
            <FieldBox
              label="Apellidos"
              value={apellidos}
              isEditing={editingField === 'apellidos'}
              onEdit={() => setEditingField('apellidos')}
              onChange={setApellidos}
            />
            <FieldBox
              label="Correo Electrónico"
              value={correo}
              readOnly
            />
            <FieldBox
              label="DNI"
              value={dni}
              isEditing={editingField === 'dni'}
              onEdit={() => setEditingField('dni')}
              onChange={setDni}
              placeholder="Todavía no cargado"
            />
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-custom-gris-oscuro dark:text-slate-200">
                  Estado del Usuario
                </label>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm text-custom-gris-oscuro dark:text-slate-100">
                <span>{estado || '—'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="text-lg font-bold text-custom-gris-oscuro dark:text-slate-100 font-roboto mb-4">
            Seguridad de la Cuenta
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-5 h-5 text-custom-celeste" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-custom-gris-oscuro dark:text-slate-100">
                Tu cuenta se valida con Google
              </p>
              <p className="text-xs text-custom-gris-claro mt-0.5 leading-relaxed">
                El correo lo administra Google. Nombre, apellido y DNI se guardan en la base del CFL 404.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-custom-celeste hover:bg-custom-azul-oscuro text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            {isSaving ? 'Guardando…' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2.5 bg-white hover:bg-slate-100 text-custom-gris-claro font-bold text-sm rounded-xl border border-slate-300 transition-all cursor-pointer disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldBox({ label, value, isEditing, onEdit, onChange, placeholder = 'Sin completar', readOnly = false }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-bold text-custom-gris-oscuro dark:text-slate-200">{label}</label>
      </div>
      <div className="flex items-center justify-between gap-2">
        {isEditing && !readOnly ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-custom-celeste rounded text-sm focus:outline-none"
            autoFocus
          />
        ) : (
          <span className={`font-medium text-sm truncate ${value ? 'text-custom-gris-oscuro dark:text-slate-100' : 'text-slate-400 italic'}`}>
            {value || placeholder}
          </span>
        )}
        {!readOnly && (
          <button
            type="button"
            onClick={onEdit}
            title={`Editar ${label}`}
            className="p-1 text-slate-400 hover:text-custom-celeste transition-colors cursor-pointer shrink-0"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function ToastNotification({ toast, setToast }) {
  if (!toast.message) return null;
  return (
    <NotificationToast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast({ message: '', type: 'success' })}
    />
  );
}
