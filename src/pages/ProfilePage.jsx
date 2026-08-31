import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import NotificationToast from '../components/NotificationToast';
import { Pencil, Camera, Shield, Lock, AlertCircle, Info, ExternalLink, CheckCircle, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [nombres, setNombres] = useState(user?.nombres || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [correo, setCorreo] = useState(user?.correo || '');
  const [dni, setDni] = useState(user?.dni || '');
  const [estado, setEstado] = useState(user?.estado || '');
  const [fotoUrl, setFotoUrl] = useState(user?.fotoUrl || '');
  const [aceptaTerminos, setAceptaTerminos] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Rol del usuario: el rol postulante tiene permisos para modificar sus datos
  const userRole = String(user?.rol || user?.tipo || '').trim().toLowerCase();
  const isPostulante = userRole === 'postulante' || userRole.includes('postulante');

  // Comprobar si los campos están bloqueados (los postulantes SI pueden editar; otros roles solo si no están registrados)
  const isNombresLocked = !isPostulante && Boolean(user?.nombres?.trim());
  const isApellidosLocked = !isPostulante && Boolean(user?.apellidos?.trim());
  const isDniLocked = !isPostulante && Boolean(user?.dni?.trim());

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
      triggerToast('Los cambios se guardaron en tu cuenta correctamente.', 'success');
    } catch (err) {
      triggerToast(err.message || 'No se pudieron guardar los cambios.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    if (!aceptaTerminos) {
      triggerToast('Debes aceptar los términos y condiciones y declarar la veracidad de los datos.', 'error');
      return;
    }
    persistProfile({
      nombres: isNombresLocked ? user.nombres : nombres,
      apellidos: isApellidosLocked ? user.apellidos : apellidos,
      dni: isDniLocked ? user.dni : dni,
      fotoUrl,
    });
  };

  const handleConfirmData = (e) => {
    if (e) e.preventDefault();
    if (!aceptaTerminos) {
      triggerToast('Debes marcar la casilla para confirmar que estás de acuerdo con los términos y la veracidad de los datos.', 'error');
      return;
    }
    if (!nombres?.trim() || !apellidos?.trim()) {
      triggerToast('Por favor completa tu nombre y apellido antes de confirmar.', 'error');
      return;
    }
    persistProfile({
      nombres: isNombresLocked ? user?.nombres : nombres,
      apellidos: isApellidosLocked ? user?.apellidos : apellidos,
      dni: isDniLocked ? user?.dni : dni,
      fotoUrl,
    });
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
    persistProfile({
      nombres: isNombresLocked ? user?.nombres : nombres,
      apellidos: isApellidosLocked ? user?.apellidos : apellidos,
      dni: isDniLocked ? user?.dni : dni,
      fotoUrl: nextPhoto,
    });
  };

  const hasUnsavedChanges = Boolean(
    (!isNombresLocked && nombres !== (user?.nombres || '')) ||
    (!isApellidosLocked && apellidos !== (user?.apellidos || '')) ||
    (!isDniLocked && dni !== (user?.dni || '')) ||
    editingField !== null
  );

  return (
    <div className="max-w-4xl mx-auto font-nunito">
      <ToastNotification toast={toast} setToast={setToast} />

      <form onSubmit={handleSaveChanges} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200 space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-extrabold text-custom-gris-oscuro font-roboto">
            Configuración del Perfil
          </h2>
          <p className="text-sm text-custom-gris-claro mt-1">
            Los datos personales registrados son confidenciales y oficiales en la base del CFL 404.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="relative group">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt={`${nombres} ${apellidos}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-[150px] h-[150px] rounded-full bg-slate-200 border-4 border-white shadow-md flex items-center justify-center text-slate-400 text-4xl font-bold">
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
            <h3 className="font-bold text-lg text-custom-gris-oscuro font-roboto">
              {nombres} {apellidos}
            </h3>
            <p className="text-xs text-custom-gris-claro font-mono">{correo}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-custom-gris-claro">Rol:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isPostulante
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-200 text-slate-700'
                }`}>
                {user?.rol || user?.tipo || 'Estudiante'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-custom-gris-oscuro uppercase tracking-wide font-roboto">
              Datos Personales
            </h3>
          </div>

          {isPostulante ? (
            <div className="flex items-start gap-3 p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-xs leading-relaxed">
              <Info className="w-4 h-4 text-custom-celeste shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Permiso de Postulante activo:</span> Puedes editar y mantener actualizados tus datos personales y de identidad (Nombres, Apellidos y DNI) para asegurar que tu inscripción sea procesada correctamente.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs leading-relaxed">
              <Lock className="w-4 h-4 text-custom-celeste shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Bloqueo de datos registrados:</span> Una vez registrados los datos físicos y filiatorios (Nombres, Apellidos y DNI), no pueden modificarse desde el perfil por razones de seguridad administrativa. Para rectificaciones, deberás comunicarte con la secretaría del CFL 404.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldBox
              label="Nombres"
              value={nombres}
              isEditing={editingField === 'nombres'}
              onEdit={() => setEditingField('nombres')}
              onChange={setNombres}
              isLocked={isNombresLocked}
              placeholder="Ingresar nombres"
              showLockWarning={!isPostulante}
            />
            <FieldBox
              label="Apellidos"
              value={apellidos}
              isEditing={editingField === 'apellidos'}
              onEdit={() => setEditingField('apellidos')}
              onChange={setApellidos}
              isLocked={isApellidosLocked}
              placeholder="Ingresar apellidos"
              showLockWarning={!isPostulante}
            />
            <FieldBox
              label="Correo Electrónico"
              value={correo}
              readOnly
              isLocked
              lockReason="El correo está vinculado a tu cuenta de Google."
            />
            <FieldBox
              label="DNI"
              value={dni}
              isEditing={editingField === 'dni'}
              onEdit={() => setEditingField('dni')}
              onChange={setDni}
              isLocked={isDniLocked}
              placeholder="Todavía no cargado (completar)"
              showLockWarning={!isPostulante}
            />
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-custom-gris-oscuro">
                  Estado del Usuario
                </label>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm text-custom-gris-oscuro">
                <span>{estado || 'Activo'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
              </div>
            </div>
          </div>

          {/* Check de conformidad con Términos y Condiciones y declaración de veracidad */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-custom-celeste focus:ring-custom-celeste cursor-pointer shrink-0 accent-[#37ACDE]"
              />
              <span className="text-xs text-custom-gris-oscuro leading-relaxed">
                Estoy de acuerdo con los{' '}
                <Link
                  to="/terminos-condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-custom-azul-oscuro hover:text-custom-celeste underline inline-flex items-center gap-0.5"
                >
                  Términos y Condiciones
                  <ExternalLink className="w-3 h-3 inline ml-0.5" />
                </Link>{' '}
                y declaro bajo juramento que todos los datos ingresados y registrados son veraces y fehacientes.
              </span>
            </label>
          </div>

          {/* Botón para aceptar que completaste los datos (mismo estilo que botón Imprimir / PDF) */}
          <div className="flex items-center justify-center pt-1">
            <button
              type="button"
              onClick={handleConfirmData}
              disabled={isSaving}
              title="Aceptar y confirmar los datos completados"
              className="flex items-center gap-1.5 h-9 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium font-nunito transition-colors cursor-pointer shadow-sm bg-white hover:border-slate-300 disabled:opacity-60"
            >
              <CheckCircle size={15} strokeWidth={2} className="text-emerald-600 shrink-0" />
              <span>Aceptar datos completados</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold text-custom-gris-oscuro font-roboto mb-4">
            Seguridad de la Cuenta
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-5 h-5 text-custom-celeste" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-custom-gris-oscuro">
                Identidad y Validación Oficial
              </p>
              <p className="text-xs text-custom-gris-claro mt-0.5 leading-relaxed">
                El correo lo valida Google Identity. Los datos filiatorios de los alumnos registrados son oficiales y auditados en el centro de formación CFL 404.
              </p>
            </div>
          </div>
        </div>

        {hasUnsavedChanges && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6 animate-fadeIn">
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
        )}
      </form>
    </div>
  );
}

function FieldBox({
  label,
  value,
  isEditing,
  onEdit,
  onChange,
  placeholder = 'Sin completar',
  readOnly = false,
  isLocked = false,
  showLockWarning = true,
  lockReason = 'Dato registrado y verificado. No se puede modificar desde el perfil.',
}) {
  return (
    <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${isLocked
      ? 'bg-slate-100/70 border-slate-200'
      : 'bg-slate-50 border-slate-200'
      }`}>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-bold text-custom-gris-oscuro flex items-center gap-1.5">
          {label}
          {isLocked && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600">
              <Lock className="w-2.5 h-2.5" /> Registrado
            </span>
          )}
        </label>
      </div>
      <div className="flex items-center justify-between gap-2">
        {isEditing && !readOnly && !isLocked ? (
          <div className="w-full">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-custom-celeste rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-custom-celeste text-custom-gris-oscuro font-medium"
              placeholder={placeholder}
              autoFocus
            />
            {showLockWarning && (
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Una vez guardado, este dato no podrá ser modificado.
              </p>
            )}
          </div>
        ) : (
          <span className={`font-medium text-sm truncate ${value ? 'text-custom-gris-oscuro' : 'text-slate-400 italic'}`}>
            {value || placeholder}
          </span>
        )}

        {!readOnly && !isLocked && (
          <button
            type="button"
            onClick={onEdit}
            title={`Editar ${label}`}
            className="p-1.5 text-slate-400 hover:text-custom-celeste hover:bg-custom-celeste/10 rounded-md transition-colors cursor-pointer shrink-0"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        {isLocked && (
          <div title={lockReason} className="p-1 text-slate-400 shrink-0 cursor-help">
            <Lock className="w-4 h-4" />
          </div>
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

