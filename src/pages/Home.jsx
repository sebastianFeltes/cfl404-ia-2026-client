import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import CourseFilters from '../components/CourseFilters';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import EnrollmentModal from '../components/EnrollmentModal';
import { coursesData as initialCourses } from '../data/coursesData';
import { CheckCircle2, AlertCircle, Download, UserCheck, LogIn } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(initialCourses);

  // Role / Visitor Mode State ('publico', 'aspirante', 'alumno', 'docente')
  const [selectedRole, setSelectedRole] = useState('publico');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('segunda');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Modal States
  const [detailCourse, setDetailCourse] = useState(null);
  const [enrollCourse, setEnrollCourse] = useState(null);

  // Toast Feedback State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Filter Logic
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedStage === 'segunda' && c.stageKey !== 'segunda') return false;
      if (selectedStage === 'primera' && c.stageKey !== 'primera') return false;
      if (selectedCategory !== 'Todos' && c.category !== selectedCategory) return false;
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchName = c.name.toLowerCase().includes(query);
        const matchDesc = c.detail.description.toLowerCase().includes(query);
        const matchCat = c.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [courses, selectedStage, selectedCategory, searchTerm]);

  // Handler for enrolling (differentiates Public -> /login vs Aspirante -> Modal)
  const handleEnrollClick = (course) => {
    if (selectedRole === 'aspirante') {
      setEnrollCourse(course);
    } else {
      showToast('En modo público la pre-inscripción requiere iniciar sesión. Redirigiendo a Login...', 'info');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  // Handle Enrollment Success
  const handleEnrollSuccess = ({ courseName, studentName }) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.name === courseName && c.detail.quota > 0) {
          const newQuota = c.detail.quota - 1;
          return {
            ...c,
            detail: { ...c.detail, quota: newQuota },
            status:
              newQuota === 0
                ? { id: 3, label: 'Cupo completo', color: 'bg-rose-500/10 text-rose-700 border-rose-300', badgeColor: 'bg-rose-500' }
                : c.status,
          };
        }
        return c;
      })
    );
    showToast(`¡Felicidades ${studentName}! Tu pre-inscripción a "${courseName}" ha sido registrada.`, 'success');
  };

  const handleDownloadPlanilla = (course) => {
    showToast(`Descargando programa oficial en PDF para "${course.name}"...`, 'info');
  };

  return (
    <div className="flex flex-col">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-semibold max-w-md ${
            toast.type === 'success'
              ? 'bg-emerald-800 text-white border-emerald-600'
              : 'bg-[#166193] text-white border-[#37ACDE]'
          }`}>
            {toast.type === 'success'
              ? <CheckCircle2 className="w-6 h-6 text-[#FDEA14] shrink-0" />
              : <Download className="w-6 h-6 text-[#FDEA14] shrink-0" />
            }
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Hero section con imagen de fondo y CTAs */}
      <Hero />

      {/* Selector de Modo / Perfil de Navegación */}
      <div className="bg-[#1D1E1C] text-gray-200 text-xs py-2.5 px-4 border-b border-white/10 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-nunito">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#FDEA14] animate-pulse"></span>
            <span>Seleccione su perfil de acceso para la oferta educativa:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-800/80 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setSelectedRole('publico')}
              className={`px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                selectedRole === 'publico'
                  ? 'bg-[#166193] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Modo Público (Redirige a Login)
            </button>

            <button
              onClick={() => setSelectedRole('aspirante')}
              className={`px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                selectedRole === 'aspirante'
                  ? 'bg-[#37ACDE] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Modo Aspirantes (Abre Modal)
            </button>
          </div>
        </div>
      </div>

      {/* Catálogo de Cursos */}
      <section id="cursos" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filter Toolbar */}
        <CourseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          totalResults={filteredCourses.length}
        />

        {/* Banner de etapa activa */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping flex-shrink-0"></span>
            <div>
              <h3 className="font-extrabold text-lg text-[#1D1E1C] font-['Roboto_Flex']">
                {selectedStage === 'segunda' && 'Segunda Etapa (Julio - Diciembre 2026)'}
                {selectedStage === 'primera' && 'Primera Etapa (Marzo - Julio 2026)'}
                {selectedStage === 'todas'   && 'Todas las Etapas del CFP'}
              </h3>
              <p className="text-xs text-[#585856]">
                {selectedStage === 'segunda' && 'Edición actual activa. Cupos disponibles para pre-inscripción.'}
                {selectedStage === 'primera' && 'Edición finalizada. Cursadas concluidas con validez oficial.'}
                {selectedStage === 'todas'   && 'Catálogo histórico e inscripciones abiertas.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#166193] bg-[#166193]/10 px-3 py-1.5 rounded-lg border border-[#166193]/20 whitespace-nowrap">
            Modo Activo: {selectedRole === 'aspirante' ? 'Aspirantes (Modal Activo)' : 'Público (Redirige a Login)'}
          </span>
        </div>

        {/* Grid de cursos */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-[#585856] flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1E1C] font-['Roboto_Flex']">
              No se encontraron cursos con los filtros seleccionados
            </h3>
            <p className="text-sm text-[#585856] max-w-md mx-auto">
              Prueba cambiar la palabra clave en el buscador o seleccionar otra área temática.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); setSelectedStage('segunda'); }}
              className="bg-[#166193] text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={(c) => setDetailCourse(c)}
                onEnrollCourse={handleEnrollClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Modales */}
      {detailCourse && (
        <CourseDetailModal
          course={detailCourse}
          onClose={() => setDetailCourse(null)}
          onEnroll={handleEnrollClick}
          onDownloadPlanilla={handleDownloadPlanilla}
        />
      )}
      {enrollCourse && (
        <EnrollmentModal
          course={enrollCourse}
          onClose={() => setEnrollCourse(null)}
          onSuccessSubmit={handleEnrollSuccess}
        />
      )}
    </div>
  );
}