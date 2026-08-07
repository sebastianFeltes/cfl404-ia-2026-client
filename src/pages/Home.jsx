import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CourseFilters from '../components/CourseFilters';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import EnrollmentModal from '../components/EnrollmentModal';
import Footer from '../components/Footer';
import DeviceSimulatorBar from '../components/DeviceSimulatorBar';
import { coursesData as initialCourses } from '../data/coursesData';
import { CheckCircle2, AlertCircle, Download } from 'lucide-react';

export default function Home() {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedRole, setSelectedRole] = useState('aspirante');
  const [deviceMode, setDeviceMode] = useState('desktop');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('segunda'); // Default to Segunda Etapa (Julio-Diciembre)
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Modal States
  const [detailCourse, setDetailCourse] = useState(null);
  const [enrollCourse, setEnrollCourse] = useState(null);

  // Toast Feedback State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Filter Logic
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Stage Filter
      if (selectedStage === 'segunda' && c.stageKey !== 'segunda') return false;
      if (selectedStage === 'primera' && c.stageKey !== 'primera') return false;

      // Category Filter
      if (selectedCategory !== 'Todos' && c.category !== selectedCategory) return false;

      // Search Query
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

  // Handle Enrollment Success
  const handleEnrollSuccess = ({ courseName, studentName }) => {
    // Update quota in state dynamically
    setCourses((prev) =>
      prev.map((c) => {
        if (c.name === courseName && c.detail.quota > 0) {
          const newQuota = c.detail.quota - 1;
          return {
            ...c,
            detail: {
              ...c.detail,
              quota: newQuota,
            },
            status: newQuota === 0 ? { id: 3, label: 'Cupo completo', color: 'bg-rose-500/10 text-rose-700 border-rose-300', badgeColor: 'bg-rose-500' } : c.status,
          };
        }
        return c;
      })
    );

    showToast(`¡Felicidades ${studentName}! Tu pre-inscripción a "${courseName}" ha sido registrada.`, 'success');
  };

  // Handle Syllabus PDF Download Simulation
  const handleDownloadPlanilla = (course) => {
    showToast(`Descargando programa oficial en PDF para "${course.name}"...`, 'info');
  };

  return (
    <div className="min-h-screen bg-gray-100/70 text-[#1D1E1C] font-['Nunito'] flex flex-col selection:bg-[#37ACDE] selection:text-white">
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-semibold max-w-md ${
            toast.type === 'success'
              ? 'bg-emerald-800 text-white border-emerald-600'
              : 'bg-[#166193] text-white border-[#37ACDE]'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-[#FDEA14] shrink-0" />
            ) : (
              <Download className="w-6 h-6 text-[#FDEA14] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Institutional Top Navbar */}
      <Navbar selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Area: Offerings Catalog */}
      <main id="cursos" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
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

        {/* Current Stage Indicator Banner */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <div>
              <h3 className="font-extrabold text-lg text-[#1D1E1C] font-['Roboto_Flex']">
                {selectedStage === 'segunda' && 'Segunda Etapa (Julio - Diciembre 2026)'}
                {selectedStage === 'primera' && 'Primera Etapa (Marzo - Julio 2026)'}
                {selectedStage === 'todas' && 'Todas las Etapas del CFP'}
              </h3>
              <p className="text-xs text-[#585856]">
                {selectedStage === 'segunda' && 'Edición actual activa. Cupos disponibles para pre-inscripción.'}
                {selectedStage === 'primera' && 'Edición finalizada. Cursadas concluidas con validez oficial.'}
                {selectedStage === 'todas' && 'Catálogo histórico e inscripciones abiertas.'}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#166193] bg-[#166193]/10 px-3 py-1.5 rounded-lg border border-[#166193]/20">
            Actualmente en: Julio 2026
          </span>
        </div>

        {/* Courses Display Container (Dynamic Grid / Mobile Accordion Simulator) */}
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
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
                setSelectedStage('segunda');
              }}
              className="bg-[#166193] text-white font-bold px-6 py-2.5 rounded-xl text-xs"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            deviceMode === 'mobile'
              ? 'grid-cols-1 max-w-md mx-auto'
              : deviceMode === 'tablet'
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={(c) => setDetailCourse(c)}
                onEnrollCourse={(c) => setEnrollCourse(c)}
                forceMobileMode={deviceMode === 'mobile'}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Detail Modal / Sheet */}
      {detailCourse && (
        <CourseDetailModal
          course={detailCourse}
          onClose={() => setDetailCourse(null)}
          onEnroll={(c) => setEnrollCourse(c)}
          onDownloadPlanilla={handleDownloadPlanilla}
        />
      )}

      {/* Pre-Enrollment Modal */}
      {enrollCourse && (
        <EnrollmentModal
          course={enrollCourse}
          onClose={() => setEnrollCourse(null)}
          onSuccessSubmit={handleEnrollSuccess}
        />
      )}

      {/* Device Simulator Floating Toolbar */}
      <DeviceSimulatorBar deviceMode={deviceMode} setDeviceMode={setDeviceMode} />

    </div>
  );
}