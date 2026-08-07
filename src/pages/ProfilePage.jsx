import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import NotificationToast from '../components/NotificationToast';
import {
  User,
  BookOpen,
  GraduationCap,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Pencil,
  Camera,
  Check,
  X,
  ChevronRight,
  Shield,
  Building,
  Mail,
  FileText,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('perfil');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form State
  const [nombres, setNombres] = useState(user?.nombres || 'Martina');
  const [apellidos, setApellidos] = useState(user?.apellidos || 'García');
  const [correo, setCorreo] = useState(user?.correo || 'm.garcia.404@email.com');
  const [dni, setDni] = useState(user?.dni || '38.456.789');
  const [estado, setEstado] = useState(user?.estado || 'Alumno Regular');
  const [rol, setRol] = useState(user?.rol || 'Estudiante, regular');
  const [institucion] = useState(user?.institucion || "CFL N°404 'Berisso'");
  const [fotoUrl, setFotoUrl] = useState(
    user?.fotoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  );

  // Password State
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Editing Modes for Individual Fields
  const [editingField, setEditingField] = useState(null);

  // Notification Preferences State
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPlatform, setNotifPlatform] = useState(true);

  // Toast Notification State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3500);
  };

  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      triggerToast('Las contraseñas nuevas no coinciden.', 'error');
      return;
    }

    updateUser({
      nombres,
      apellidos,
      correo,
      dni,
      estado,
      rol,
      fotoUrl,
    });

    if (newPassword) {
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }

    setEditingField(null);
    triggerToast('¡Perfil y cambios guardados con éxito!', 'success');
  };

  const handleCancel = () => {
    setNombres(user?.nombres || 'Martina');
    setApellidos(user?.apellidos || 'García');
    setCorreo(user?.correo || 'm.garcia.404@email.com');
    setDni(user?.dni || '38.456.789');
    setEstado(user?.estado || 'Alumno Regular');
    setRol(user?.rol || 'Estudiante, regular');
    setCurrPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditingField(null);
    triggerToast('Se cancelaron las modificaciones.', 'error');
  };

  const handlePhotoChange = () => {
    const newPhotos = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    ];
    const nextPhoto = newPhotos[(newPhotos.indexOf(fotoUrl) + 1) % newPhotos.length];
    setFotoUrl(nextPhoto);
    updateUser({ fotoUrl: nextPhoto });
    triggerToast('Foto de perfil actualizada.', 'success');
  };

  const sidebarItems = [
    { id: 'perfil', label: 'Mi Perfil', icon: User },
    { id: 'cursos', label: 'Mis Cursos', icon: BookOpen },
    { id: 'ayuda', label: 'Ayuda', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-nunito flex flex-col">
      {/* Top Header Navigation */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <ToastNotification toast={toast} setToast={setToast} />

      {/* Main Page Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-custom-gris-claro mb-6">
          <span
            onClick={() => navigate('/')}
            className="hover:text-custom-azul-oscuro cursor-pointer transition-colors"
          >
            Inicio
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span
            onClick={() => setActiveTab('perfil')}
            className="hover:text-custom-azul-oscuro cursor-pointer transition-colors"
          >
            Mi Perfil
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-custom-azul-oscuro">Configuración de Cuenta</span>
        </nav>

        {/* Content Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Navigation */}
          <aside className={`lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            {/* Mobile Header Card (Matching Mobile Layout Screenshot) */}
            <div className="md:hidden pb-4 mb-4 border-b border-slate-100 text-center">
              <img
                src={fotoUrl}
                alt={`${nombres} ${apellidos}`}
                className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-4 border-custom-celeste shadow"
              />
              <h3 className="font-extrabold text-custom-azul-oscuro uppercase tracking-wide text-base font-roboto">
                {nombres} {apellidos}
              </h3>
              <p className="text-xs text-custom-gris-claro font-medium">Configuración de Cuenta</p>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    title={item.label}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-custom-celeste text-white shadow-md shadow-custom-celeste/20'
                        : 'text-custom-gris-claro hover:bg-slate-50 hover:text-custom-azul-oscuro'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-custom-gris-claro'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-3 mt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-rose-600" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200">
            {activeTab === 'perfil' ? (
              <form onSubmit={handleSaveChanges} className="space-y-8">
                {/* Header Title */}
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-extrabold text-custom-gris-oscuro font-roboto">
                    Configuración del Perfil - {nombres} {apellidos}
                  </h2>
                  <p className="text-sm text-custom-gris-claro mt-1">
                    Administrá y actualizá tus datos personales y credenciales institucionales.
                  </p>
                </div>

                {/* Profile Photo Section (150px circle matching layout desktop & mobile) */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="relative group">
                    <img
                      src={fotoUrl}
                      alt={`${nombres} ${apellidos}`}
                      className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <button
                      type="button"
                      onClick={handlePhotoChange}
                      className="absolute bottom-1 right-1 bg-custom-celeste hover:bg-custom-azul-oscuro text-white p-2.5 rounded-full shadow-lg transition-transform transform hover:scale-110 cursor-pointer"
                      title="Cambiar foto de perfil"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                      profile_photo (150px circle)
                    </span>
                    <h3 className="font-bold text-lg text-custom-gris-oscuro mt-1 font-roboto">
                      {nombres} {apellidos}
                    </h3>
                    <p className="text-xs text-custom-gris-claro font-mono">{correo}</p>
                    <button
                      type="button"
                      title="Cambiar foto"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-custom-celeste hover:text-custom-azul-oscuro transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Cambiar foto</span>
                    </button>
                  </div>
                </div>

                {/* Personal Data Form Grid ("DATOS PERSONALES") */}
                <div>
                  <h3 className="text-lg font-bold text-custom-gris-oscuro uppercase tracking-wide font-roboto mb-4 flex items-center gap-2">
                    <span>Datos Personales</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Nombres Field */}
                    <FieldBox
                      label="Nombres"
                      codeKey="ffirst_name"
                      value={nombres}
                      isEditing={editingField === 'nombres'}
                      onEdit={() => setEditingField('nombres')}
                      onChange={(val) => setNombres(val)}
                    />

                    {/* Apellidos Field */}
                    <FieldBox
                      label="Apellidos"
                      codeKey="last_name"
                      value={apellidos}
                      isEditing={editingField === 'apellidos'}
                      onEdit={() => setEditingField('apellidos')}
                      onChange={(val) => setApellidos(val)}
                    />

                    {/* Correo Field */}
                    <FieldBox
                      label="Correo Electrónico"
                      codeKey="email"
                      value={correo}
                      isEditing={editingField === 'correo'}
                      onEdit={() => setEditingField('correo')}
                      onChange={(val) => setCorreo(val)}
                    />

                    {/* DNI Field */}
                    <FieldBox
                      label="DNI"
                      codeKey="dni"
                      value={dni}
                      isEditing={editingField === 'dni'}
                      onEdit={() => setEditingField('dni')}
                      onChange={(val) => setDni(val)}
                    />

                    {/* Estado del Usuario Field (Non-editable) */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-custom-gris-oscuro">
                          Estado del Usuario
                        </label>
                        <span className="text-[11px] font-mono text-slate-400">status</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-medium text-sm text-custom-gris-oscuro">
                          <span>{estado}</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
                        </div>
                      </div>
                    </div>



                  </div>
                </div>

                {/* Password Change Section ("Cambiar Contraseña") */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-bold text-custom-gris-oscuro font-roboto mb-4">
                    Cambiar Contraseña
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-custom-gris-claro mb-1">
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        placeholder="Contraseña Actual"
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-custom-celeste"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-custom-gris-claro mb-1">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nueva Contraseña"
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-custom-celeste"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-custom-gris-claro mb-1">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar Nueva Contraseña"
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-custom-celeste"
                      />
                    </div>
                  </div>
                </div>



                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-custom-celeste hover:bg-custom-azul-oscuro text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-white hover:bg-slate-100 text-custom-gris-claro font-bold text-sm rounded-xl border border-slate-300 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-custom-celeste/10 text-custom-celeste rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-custom-gris-oscuro capitalize font-roboto">
                  Sección: {activeTab}
                </h3>
                <p className="text-sm text-custom-gris-claro max-w-md mx-auto">
                  Contenido de {activeTab} en desarrollo. Podés volver a la pestaña de "Mi Perfil" en cualquier momento.
                </p>
                <button
                  onClick={() => setActiveTab('perfil')}
                  className="px-5 py-2 bg-custom-celeste text-white font-bold rounded-xl text-sm shadow hover:bg-custom-azul-oscuro transition-colors cursor-pointer"
                >
                  Volver a Mi Perfil
                </button>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

// Subcomponent for editable data fields
function FieldBox({ label, codeKey, value, isEditing, onEdit, onChange }) {
  const [val, setVal] = useState(value);

  return (
    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-bold text-custom-gris-oscuro">{label}</label>
        {codeKey && <span className="text-[11px] font-mono text-slate-400">{codeKey}: {val}</span>}
      </div>
      <div className="flex items-center justify-between gap-2">
        {isEditing ? (
          <input
            type="text"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full px-2 py-1 bg-white border border-custom-celeste rounded text-sm focus:outline-none"
            autoFocus
          />
        ) : (
          <span className="font-medium text-sm text-custom-gris-oscuro truncate">{val}</span>
        )}
        <button
          type="button"
          onClick={onEdit}
          title={`Editar ${label}`}
          className="p-1 text-slate-400 hover:text-custom-celeste transition-colors cursor-pointer shrink-0"
        >
          <Pencil className="w-4 h-4" />
        </button>
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
