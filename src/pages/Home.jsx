import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import CourseFilters from '../components/CourseFilters';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import VirtualQueueModal from '../components/VirtualQueueModal';
import { coursesData as initialCourses } from '../data/coursesData';
import { AlertCircle, Download } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const courses = initialCourses;

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('segunda');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Modal States
  const [detailCourse, setDetailCourse] = useState(null);
  const [queueCourse, setQueueCourse] = useState(null);

  // Toast Feedback State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Stage & Category Filter Logic
  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];

    return courses.filter((c) => {
      if (!c) return false;

      // 1. Filtro por Etapa
      if (selectedStage === 'segunda') {
        const isSegunda = c.stageKey === 'segunda' || c.stageKey === 'anual' || Boolean(c.is_annual || c.is_continuous);
        if (!isSegunda) return false;
      } else if (selectedStage === 'primera') {
        const isPrimera = c.stageKey === 'primera' || c.stageKey === 'anual' || Boolean(c.is_annual || c.is_continuous);
        if (!isPrimera) return false;
      }
      // 'todas' muestra TODOS los cursos sin filtrar por etapa

      // 2. Filtro por Área Temática (Mantenido intacto)
      if (selectedCategory && selectedCategory !== 'Todos' && c.category !== selectedCategory) {
        return false;
      }

      // 3. Filtro por término de búsqueda
      if (searchTerm && searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matchName = c.name?.toLowerCase().includes(query) || false;
        const matchDesc = c.detail?.description?.toLowerCase().includes(query) || false;
        const matchCat = c.category?.toLowerCase().includes(query) || false;
        const matchSponsor = c.sponsor?.name?.toLowerCase().includes(query) || false;
        if (!matchName && !matchDesc && !matchCat && !matchSponsor) return false;
      }

      return true;
    });
  }, [courses, selectedStage, selectedCategory, searchTerm]);

  // Cómputo único y seguro de cadenas para el Banner (Evita 'removeChild' DOM reconciliation errors)
  const bannerTitle = useMemo(() => {
    if (selectedStage === 'segunda') return 'Segunda mitad del año (Julio - Diciembre) + Cursos Anuales';
    if (selectedStage === 'primera') return 'Primera mitad del año (Marzo - Junio) + Cursos Anuales';
    return 'Todas las Etapas y Dictados Continuos del CFP';
  }, [selectedStage]);

  const bannerSubtitle = useMemo(() => {
    if (selectedStage === 'segunda') return 'Oferta educacional del 2° semestre. Pre-inscripciones activas por fecha estipulada.';
    if (selectedStage === 'primera') return 'Oferta educacional del 1° semestre e inscripciones previas.';
    return 'Catálogo completo de capacitaciones profesionales.';
  }, [selectedStage]);

  const handleLoginRedirect = () => {
    showToast('Redirigiendo a Iniciar Sesión para el proceso de pre-inscripción...', 'info');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleOpenQueue = (course) => {
    setQueueCourse(course);
  };

  return (
    <div className="flex flex-col">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-fadeIn">
          <div className="p-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-semibold max-w-md bg-[#166193] text-white border-[#37ACDE]">
            <Download className="w-6 h-6 text-[#FDEA14] shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Hero section con imagen de fondo y CTAs */}
      <Hero />

      {/* Catálogo de Cursos */}
      <section id="cursos" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 font-['Nunito']">

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

        {/* Banner de etapa activa (Con nodos de texto seguros para React Reconciler) */}
        <div key={`banner-${selectedStage}`} className="mb-8 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-start sm:items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping flex-shrink-0"></span>
          <div>
            <h3 className="font-extrabold text-lg text-[#1D1E1C] font-['Roboto_Flex']">
              {bannerTitle}
            </h3>
            <p className="text-xs text-[#585856]">
              {bannerSubtitle}
            </p>
          </div>
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
          <div key={`grid-${selectedStage}-${selectedCategory}`} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={`course-card-${course.id}`}
                course={course}
                onSelectCourse={(c) => setDetailCourse(c)}
                onLogin={handleLoginRedirect}
                onOpenQueue={handleOpenQueue}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Modal Ficha Completa del Curso */}
      {detailCourse && (
        <CourseDetailModal
          key={`modal-${detailCourse.id}`}
          course={detailCourse}
          onClose={() => setDetailCourse(null)}
          onLogin={handleLoginRedirect}
          onOpenQueue={handleOpenQueue}
        />
      )}

      {/* Modal de Cola Virtual de Pre-inscripción */}
      {queueCourse && (
        <VirtualQueueModal
          key={`queue-${queueCourse.id}`}
          course={queueCourse}
          onClose={() => setQueueCourse(null)}
        />
      )}
    </div>
  );
}