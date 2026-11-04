import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import NotificationToast from '../components/NotificationToast';
import { GET } from '../services/api';
import { canonicalRole } from '../utils/roles';
import { profileFormError, todayYmd } from '../utils/profileForm';
import { Camera, Shield, Lock, Info, ExternalLink, CheckCircle, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const location = useLocation();

  const [nombres, setNombres] = useState(user?.nombres || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [correo, setCorreo] = useState(user?.correo || '');
  const [dni, setDni] = useState(user?.dni || '');
  const [estado, setEstado] = useState(user?.estado || '');
  const [fotoUrl, setFotoUrl] = useState(user?.fotoUrl || '');
  const [aceptaTerminos, setAceptaTerminos] = useState(true);

  // Campos de user_detail
  const [telefono, setTelefono] = useState(user?.telefono || user?.detail?.phone || '');
  const [telefonoSecundario, setTelefonoSecundario] = useState(user?.telefonoSecundario || user?.detail?.extraPhone || '');
  const [direccion, setDireccion] = useState(user?.direccion || user?.detail?.address || '');
  const [nacionalidad, setNacionalidad] = useState(user?.nacionalidad || user?.detail?.nacionality || 'Argentina');
  const [genero, setGenero] = useState(user?.genero || user?.detail?.gender || '');
  const [nivelEducacion, setNivelEducacion] = useState(user?.nivelEducacion || user?.detail?.academicLevel || 'Secundario');
  const [fechaNacimiento, setFechaNacimiento] = useState(
    user?.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : (user?.detail?.dob ? user.detail.dob.split('T')[0] : '')
  );

  const [inscripciones, setInscripciones] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const photoInputRef = useRef(null);
  const [toast, setToast] = useState({
    message: location.state?.enrollmentNotice || '',
    type: location.state?.enrollmentNotice ? 'error' : 'success',
  });

  useEffect(() => {
    if (!location.state?.enrollmentNotice) return undefined
    const timer = setTimeout(() => setToast({ message: '', type: 'success' }), 6000)
    return () => clearTimeout(timer)
  }, [location.state])

  const role = canonicalRole(user?.rol);
  const isPostulante = role === 'postulante';
  const isAlumno = role === 'alumno' && String(user?.rol || '').trim() !== '';
  const formDisabled = isAlumno;

  const isNombresLocked = formDisabled || (!isPostulante && Boolean(user?.nombres?.trim()));
  const isApellidosLocked = formDisabled || (!isPostulante && Boolean(user?.apellidos?.trim()));
  const isDniLocked = formDisabled || (!isPostulante && Boolean(user?.dni?.trim()));

  useEffect(() => {
    if (role !== 'postulante') {
      setInscripciones([]);
      return undefined;
    }
    let cancelled = false;
    GET('/api/v1/preinscripciones/turno')
      .then((data) => {
        if (cancelled) return;
        const waiting = (data.tickets || []).map((item) => ({
          ...item,
          label: item.status === 'listo'
            ? 'Listo para confirmar'
            : `En espera${item.position ? ` · posición ${item.position}` : ''}`,
        }));
        const confirmed = (data.enrollments || [])
          .filter((item) => !waiting.some((ticket) => ticket.courseId === item.courseId))
          .map((item) => ({ ...item, label: 'Inscripto' }));
        setInscripciones([...confirmed, ...waiting]);
      })
      .catch(() => {
        if (!cancelled) setInscripciones([]);
      });
    return () => {
      cancelled = true;
    };
  }, [role]);

  useEffect(() => {
    if (!user) return;
    setNombres(user.nombres || '');
    setApellidos(user.apellidos || '');
    setCorreo(user.correo || '');
    setDni(user.dni || '');
    setEstado(user.estado || '');
    setFotoUrl(user.fotoUrl || '');
    setAceptaTerminos(Boolean(user.aceptaTerminos));
    setTelefono(user.telefono || user.detail?.phone || '');
    setTelefonoSecundario(user.telefonoSecundario || user.detail?.extraPhone || '');
    setDireccion(user.direccion || user.detail?.address || '');
    setNacionalidad(user.nacionalidad || user.detail?.nacionality || 'Argentina');
    setGenero(user.genero || user.detail?.gender || '');
    setNivelEducacion(user.nivelEducacion || user.detail?.academicLevel || 'Secundario');
    setFechaNacimiento(
      user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : (user.detail?.dob ? user.detail.dob.split('T')[0] : '')
    );
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
      triggerToast('Los cambios se guardaron en tu cuenta correctamente.', 'success');
    } catch (err) {
      triggerToast(err.message || 'No se pudieron guardar los cambios.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const profilePayload = () => ({
    nombres: isNombresLocked ? user?.nombres : nombres,
    apellidos: isApellidosLocked ? user?.apellidos : apellidos,
    dni: isDniLocked ? user?.dni : dni,
    fotoUrl,
    aceptaTerminos,
    telefono,
    telefonoSecundario,
    direccion,
    nacionalidad,
    genero,
    nivelEducacion,
    fechaNacimiento: fechaNacimiento || null,
  });

  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    if (formDisabled || !hasUnsavedChanges) return;
    const validationError = profileFormError({
      nombres,
      apellidos,
      dni,
      telefono,
      telefonoSecundario,
      direccion,
      fechaNacimiento,
      nombresLocked: isNombresLocked,
      apellidosLocked: isApellidosLocked,
      dniLocked: isDniLocked,
    }, { isPostulante });
    if (validationError) {
      triggerToast(validationError, 'error');
      return;
    }
    if (!aceptaTerminos) {
      triggerToast('Debes aceptar los términos y condiciones y declarar la veracidad de los datos.', 'error');
      return;
    }
    setConfirmSave(true);
  };

  const confirmPersist = () => {
    setConfirmSave(false);
    persistProfile(profilePayload());
  };

  const handleCancel = () => {
    setNombres(user?.nombres || '');
    setApellidos(user?.apellidos || '');
    setDni(user?.dni || '');
    setFotoUrl(user?.fotoUrl || '');
    setTelefono(user?.telefono || user?.detail?.phone || '');
    setTelefonoSecundario(user?.telefonoSecundario || user?.detail?.extraPhone || '');
    setDireccion(user?.direccion || user?.detail?.address || '');
    setNacionalidad(user?.nacionalidad || user?.detail?.nacionality || 'Argentina');
    setGenero(user?.genero || user?.detail?.gender || '');
    setNivelEducacion(user?.nivelEducacion || user?.detail?.academicLevel || 'Secundario');
    setFechaNacimiento(
      user?.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : (user?.detail?.dob ? user.detail.dob.split('T')[0] : '')
    );
    triggerToast('Se cancelaron las modificaciones.', 'error');
  };

  const handlePhotoPick = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || formDisabled) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      triggerToast('La foto tiene que ser JPG, PNG o WebP.', 'error');
      return;
    }
    if (file.size > 1_200_000) {
      triggerToast('La foto supera 1,2 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setFotoUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const initialPhone = user?.telefono || user?.detail?.phone || '';
  const initialExtraPhone = user?.telefonoSecundario || user?.detail?.extraPhone || '';
  const initialAddress = user?.direccion || user?.detail?.address || '';
  const initialNacionality = user?.nacionalidad || user?.detail?.nacionality || 'Argentina';
  const initialGender = user?.genero || user?.detail?.gender || '';
  const initialAcademic = user?.nivelEducacion || user?.detail?.academicLevel || 'Secundario';
  const initialDob = user?.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : (user?.detail?.dob ? user.detail.dob.split('T')[0] : '');

  const hasUnsavedChanges = Boolean(
    (!isNombresLocked && nombres !== (user?.nombres || '')) ||
    (!isApellidosLocked && apellidos !== (user?.apellidos || '')) ||
    (!isDniLocked && dni !== (user?.dni || '')) ||
    telefono !== initialPhone ||
    telefonoSecundario !== initialExtraPhone ||
    direccion !== initialAddress ||
    nacionalidad !== initialNacionality ||
    genero !== initialGender ||
    nivelEducacion !== initialAcademic ||
    fechaNacimiento !== initialDob ||
    fotoUrl !== (user?.fotoUrl || '') ||
    aceptaTerminos !== Boolean(user?.aceptaTerminos)
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto pb-8 sm:pb-12 font-roboto">
      <ToastNotification toast={toast} setToast={setToast} />
      {confirmSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-profile-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 id="confirm-profile-title" className="font-nunito text-lg font-extrabold text-custom-gris-oscuro">
              ¿Guardar los datos del perfil?
            </h3>
            <p className="mt-2 text-sm text-custom-gris-claro leading-relaxed">
              Se van a actualizar los datos personales de tu cuenta en el CFL 404.
            </p>
            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmSave(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-custom-gris-oscuro cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={confirmPersist}
                className="px-4 py-2.5 rounded-xl bg-custom-azul-oscuro text-white text-sm font-bold cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <h2 className="font-nunito font-extrabold text-xl sm:text-3xl text-custom-azul-oscuro dark:text-custom-celeste tracking-tight flex items-start sm:items-center gap-2.5 leading-tight">
            <User className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 mt-0.5 sm:mt-0 text-custom-azul-oscuro dark:text-custom-celeste" />
            Configuración de Perfil
          </h2>
          <p className="text-sm font-medium text-custom-gris-claro dark:text-slate-400 mt-1 leading-snug">
            Los datos personales registrados son confidenciales y oficiales en la base del CFL 404.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveChanges} className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-200 space-y-6 sm:space-y-8 font-nunito">

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="relative group">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt={`${nombres} ${apellidos}`}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-[150px] sm:h-[150px] rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-[150px] sm:h-[150px] rounded-full bg-slate-200 border-4 border-white shadow-md flex items-center justify-center text-slate-400 text-3xl sm:text-4xl font-bold">
                {(nombres || '?').charAt(0)}
              </div>
            )}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={isSaving || formDisabled}
              className="absolute bottom-1 right-1 bg-custom-celeste hover:bg-custom-azul-oscuro text-white p-2.5 rounded-full shadow-lg transition-transform transform hover:scale-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              title={formDisabled ? 'La foto no se puede cambiar como alumno' : 'Elegir foto de perfil'}
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoPick}
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg text-custom-gris-oscuro font-roboto break-words">
              {nombres} {apellidos}
            </h3>
            <p className="text-xs text-custom-gris-claro font-mono break-all">{correo}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 flex-wrap">
              <span className="text-xs text-custom-gris-claro">Rol:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isPostulante
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-200 text-slate-700'
                }`}>
                {user?.rol || user?.tipo || 'Estudiante'}
              </span>
              {isPostulante && (
                <span className="text-xs font-mono font-bold text-custom-azul-oscuro">
                  N° {user?.applicantNumber ?? '—'}
                </span>
              )}
            </div>
            {isPostulante && (
              <ul className="mt-3 space-y-1 text-xs text-custom-gris-oscuro">
                {inscripciones.length === 0 && <li>Sin preinscripciones activas</li>}
                {inscripciones.map((item) => (
                  <li key={`${item.status}-${item.courseId}`}>
                    <span className="font-bold">{item.label}</span>
                    {item.courseName ? ` · ${item.courseName}` : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-custom-gris-oscuro uppercase tracking-wide font-roboto">
              Datos Personales y de Contacto
            </h3>
          </div>

          {isAlumno ? (
            <div className="flex items-start gap-3 p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs leading-relaxed">
              <Lock className="w-4 h-4 text-custom-celeste shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Legajo de alumno:</span> estos datos quedaron registrados y no se pueden modificar desde el perfil. Para una rectificación, comunicate con la secretaría del CFL 404.
              </div>
            </div>
          ) : isPostulante ? (
            <div className="flex items-start gap-3 p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-xs leading-relaxed">
              <Info className="w-4 h-4 text-custom-celeste shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Completá el formulario de una vez.</span> Nombre, apellido, DNI, teléfono, dirección y fecha de nacimiento son necesarios para inscribirte a un curso.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs leading-relaxed">
              <Lock className="w-4 h-4 text-custom-celeste shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Datos ya registrados:</span> nombre, apellido y DNI no se pueden cambiar desde el perfil. Para una rectificación, comunicate con la secretaría del CFL 404.
              </div>
            </div>
          )}

          <fieldset disabled={formDisabled} className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 border-0 p-0 m-0">
            <FormControl id="perfil-nombres" label="Nombres" value={nombres} onChange={setNombres} disabled={isNombresLocked} placeholder="Ingresar nombres" />
            <FormControl id="perfil-apellidos" label="Apellidos" value={apellidos} onChange={setApellidos} disabled={isApellidosLocked} placeholder="Ingresar apellidos" />
            <FormControl id="perfil-correo" label="Correo electrónico" value={correo} disabled hint="Vinculado a tu cuenta de Google." />
            <FormControl id="perfil-dni" label="DNI" value={dni} onChange={(value) => setDni(value.replace(/\D/g, '').slice(0, 8))} disabled={isDniLocked} placeholder="Completar DNI" inputMode="numeric" maxLength={8} />
            <FormControl id="perfil-telefono" label="Teléfono" value={telefono} onChange={setTelefono} disabled={formDisabled} placeholder="Ej: 2211234567" inputMode="numeric" />
            <FormControl id="perfil-telefono-2" label="Teléfono alternativo" value={telefonoSecundario} onChange={setTelefonoSecundario} disabled={formDisabled} placeholder="Ej: 2219876543" inputMode="numeric" />
            <FormControl id="perfil-direccion" label="Dirección" value={direccion} onChange={setDireccion} disabled={formDisabled} placeholder="Ej: Calle 123 N° 456, Berisso" />
            <FormControl id="perfil-nacionalidad" label="Nacionalidad" value={nacionalidad} onChange={setNacionalidad} disabled={formDisabled} placeholder="Ej: Argentina" />
            <FormControl
              id="perfil-genero"
              label="Género"
              value={genero}
              onChange={setGenero}
              disabled={formDisabled}
              options={['Masculino', 'Femenino', 'No binario', 'Otro', 'Prefiero no decirlo', 'No especificado']}
            />
            <FormControl
              id="perfil-nivel"
              label="Nivel de educación"
              value={nivelEducacion}
              onChange={setNivelEducacion}
              disabled={formDisabled}
              options={['Primario incompleto', 'Primario completo', 'Secundario incompleto', 'Secundario', 'Secundario completo', 'Terciario en curso', 'Terciario', 'Terciario graduado', 'Universitario en curso', 'Universitario graduado']}
            />
            <FormControl id="perfil-nacimiento" label="Fecha de nacimiento" type="date" value={fechaNacimiento} onChange={setFechaNacimiento} disabled={formDisabled} max={todayYmd()} />
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-custom-gris-oscuro mb-1">Estado</p>
              <div className="flex items-center gap-2 font-medium text-sm text-custom-gris-oscuro">
                <span>{estado || 'Activo'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
              </div>
            </div>
          </fieldset>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <label className={`flex items-start gap-3 select-none ${formDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={aceptaTerminos}
                disabled={formDisabled}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-custom-celeste focus:ring-custom-celeste cursor-pointer shrink-0 accent-[#37ACDE] disabled:cursor-not-allowed"
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

          {!formDisabled && (
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-1">
              {hasUnsavedChanges && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-100 text-custom-gris-claro font-bold text-sm rounded-xl border border-slate-300 transition-all cursor-pointer disabled:opacity-60"
                >
                  Cancelar
                </button>
              )}
              {hasUnsavedChanges && (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 sm:h-10 px-5 bg-custom-azul-oscuro hover:bg-[#1f7ebf] text-white rounded-xl text-sm font-bold font-nunito transition-colors duration-200 cursor-pointer shadow-md hover:shadow active:scale-[0.98] disabled:opacity-60"
                >
                  <CheckCircle size={17} strokeWidth={2.2} className="text-white shrink-0" />
                  <span>{isSaving ? 'Guardando…' : 'Guardar datos'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-base sm:text-lg font-bold text-custom-gris-oscuro font-roboto mb-4">
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
      </form>
    </div>
  );
}

function FormControl({ id, label, value, onChange, disabled = false, placeholder, options, type = 'text', hint, inputMode, maxLength, max }) {
  const inputClass = `w-full px-3 py-2.5 sm:py-2 rounded-lg text-base sm:text-sm font-medium border focus:outline-none ${
    disabled
      ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
      : 'bg-white border-slate-300 text-custom-gris-oscuro focus:ring-1 focus:ring-custom-celeste focus:border-custom-celeste'
  }`

  return (
    <div className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${disabled ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-50 border-slate-200'}`}>
      <label htmlFor={id} className="text-xs font-bold text-custom-gris-oscuro">
        {label}
      </label>
      {options ? (
        <select
          id={id}
          value={value || ''}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          className={inputClass}
        >
          <option value="">Seleccionar</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          max={max}
          value={value || ''}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
          className={inputClass}
        />
      )}
      {hint && <p className="text-[10px] text-slate-500">{hint}</p>}
    </div>
  )
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

