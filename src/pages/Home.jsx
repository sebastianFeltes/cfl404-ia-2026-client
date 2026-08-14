import { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import CourseFilters from '../components/CourseFilters';
import CourseCard from '../components/CourseCard';
import CourseDetailModal from '../components/CourseDetailModal';
import EnrollmentModal from '../components/EnrollmentModal';
import { coursesData as initialCourses } from '../data/coursesData';
import { CheckCircle2, AlertCircle, Download } from 'lucide-react';

export default function Home() {
  const [courses, setCourses] = useState(initialCourses);

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
    <div>
      Home
    </div>
  )
}