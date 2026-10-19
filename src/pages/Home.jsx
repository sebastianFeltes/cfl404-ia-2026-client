import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import CourseFilters from '../components/CourseFilters';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import { fetchCourses, fetchFamilies } from '../services/coursesService';
import { GET, POST } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canonicalRole } from '../utils/roles';
import { ENROLLMENT_PROFILE_NOTICE, hasBasicEnrollmentData } from '../utils/enrollmentProfile';
import { compareCoursesByStart, enrollActionFor } from '../utils/courseEnrollment';
import EnrollmentAlert from '../components/EnrollmentAlert';
import { AlertCircle } from 'lucide-react';

export default function Home({ embedded = false }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(['Todos']);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('segunda');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Modal States
  const [detailCourse, setDetailCourse] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingCourses(true);
      setCoursesError('');
      try {
        const [courseList, familyList] = await Promise.all([
          fetchCourses(),
          fetchFamilies(),
        ]);
        if (cancelled) return;
        setCourses(courseList);
        const usedNames = [...new Set(courseList.map((course) => course.category).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b, 'es'));
        const names = usedNames.length > 0
          ? usedNames
          : (familyList || []).map((family) => family.name).filter(Boolean);
        setCategories(['Todos', ...names]);
      } catch (error) {
        if (cancelled) return;
        setCourses([]);
        setCoursesError(error.message || 'No se pudieron cargar los cursos');
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const enrollAccess = useMemo(() => {
    if (!isAuthenticated) return { mode: 'login', label: 'Iniciar sesión' };
    const mustCompleteProfile = canonicalRole(user?.rol) === 'postulante' && !hasBasicEnrollmentData(user);
    if (mustCompleteProfile) return { mode: 'profile', label: 'Completar datos' };
    return { mode: 'ready', label: 'Inscribirme' };
  }, [isAuthenticated, user]);

  const [alert, setAlert] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const refreshTurnos = async () => {
    if (!isAuthenticated || canonicalRole(user?.rol) !== 'postulante') {
      setTurnos([]);
      setEnrollments([]);
      return;
    }
    try {
      const data = await GET('/api/v1/preinscripciones/turno');
      setTurnos(Array.isArray(data?.tickets) ? data.tickets : []);
      setEnrollments(Array.isArray(data?.enrollments) ? data.enrollments : []);
    } catch {
      setTurnos([]);
      setEnrollments([]);
    }
  };

  const reloadCourses = async () => {
    try {
      const courseList = await fetchCourses();
      setCourses(courseList);
    } catch {
      // El catálogo visible se mantiene si la recarga falla.
    }
  };

  useEffect(() => {
    refreshTurnos();
  }, [isAuthenticated, user?.id, user?.rol]);

  const enrollAction = (course) => enrollActionFor(course, {
    isAuthenticated,
    role: canonicalRole(user?.rol),
    tickets: turnos,
    enrollments,
    profileIncomplete: enrollAccess.mode === 'profile',
  });

  const showAlert = (message, type, title) => {
    setAlert({ message, type, title });
  };

  // Stage & Category Filter Logic
  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];

    return courses.filter((c) => {
      if (!c) return false;

      const statusName = String(c.status?.name || '').toLowerCase();
      const statusId = Number(c.statusId || c.status?.id);
      if (statusName === 'inactivo' || statusName === 'eliminado' || statusId === 2 || statusId === 7) {
        return false;
      }

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
        const matchSponsor = [c.sponsor?.name, ...(c.sponsors || []).map((sponsor) => sponsor.name)]
          .filter(Boolean)
          .some((name) => name.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchCat && !matchSponsor) return false;
      }

      return true;
    }).sort(compareCoursesByStart);
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

  const handleEnroll = async (course) => {
    const action = enrollAction(course);
    if (action.disabled) return;
    if (action.mode === 'login' || enrollAccess.mode === 'login') {
      navigate('/login');
      return;
    }
    if (action.mode === 'profile' || enrollAccess.mode === 'profile') {
      navigate('/perfil', { state: { enrollmentNotice: ENROLLMENT_PROFILE_NOTICE } });
      return;
    }
    if (!course?.id) return;
    try {
      const result = await POST('/api/v1/preinscripciones', { courseId: course.id });
      await Promise.all([refreshTurnos(), reloadCourses()]);
      if (result.status === 'esperando') {
        showAlert(
          `Estás en espera. Tu posición es ${result.position}. Número de postulante ${result.applicantNumber}.`,
          'warning',
          'Lista de espera',
        );
        return;
      }
      showAlert(
        `Preinscripción confirmada. Tu número de postulante es ${result.applicantNumber}. Orden ${result.position}.`,
        'success',
        'Inscripto correctamente',
      );
    } catch (error) {
      if (error.status === 403) {
        navigate('/perfil', { state: { enrollmentNotice: error.message || ENROLLMENT_PROFILE_NOTICE } });
        return;
      }
      const message = error.message || 'No se pudo completar la preinscripción';
      const clash = /choque/i.test(message);
      showAlert(message, 'error', clash ? 'Choque de cursos' : 'No se pudo inscribir');
    }
  };

  return (
    <div className="flex flex-col">

      <EnrollmentAlert alert={alert} onClose={() => setAlert(null)} />

      {!embedded && <Hero />}

      {/* Catálogo de Cursos */}
      <section id="cursos" className={`max-w-7xl w-full mx-auto font-['Nunito'] ${embedded ? 'px-0 py-2' : 'px-4 sm:px-6 lg:px-8 py-12'}`}>

        {/* Filter Toolbar */}
        <CourseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          totalResults={filteredCourses.length}
          categories={categories}
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
        {loadingCourses ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 my-8">
            <p className="text-sm font-semibold text-[#585856]">Cargando la oferta de cursos…</p>
          </div>
        ) : coursesError ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-[#585856] flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1E1C] font-['Roboto_Flex']">
              No pudimos cargar los cursos
            </h3>
            <p className="text-sm text-[#585856] max-w-md mx-auto">{coursesError}</p>
          </div>
        ) : filteredCourses.length === 0 ? (
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
            {filteredCourses.map((course) => {
              const action = enrollAction(course);
              return (
                <CourseCard
                  key={`course-card-${course.id}`}
                  course={course}
                  onSelectCourse={(c) => setDetailCourse(c)}
                  onEnroll={handleEnroll}
                  enrollLabel={action.label}
                  enrollDisabled={action.disabled}
                />
              );
            })}
          </div>
        )}
      </section>

      {!embedded && <FAQ />}

      {/* Modal Ficha Completa del Curso */}
      {detailCourse && (
        <CourseDetailModal
          key={`modal-${detailCourse.id}`}
          course={detailCourse}
          onClose={() => setDetailCourse(null)}
          onEnroll={handleEnroll}
          enrollLabel={enrollAction(detailCourse).label}
          enrollDisabled={enrollAction(detailCourse).disabled}
        />
      )}
    </div>
  );
}