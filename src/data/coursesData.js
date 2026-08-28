// Dataset oficial de cursos del Centro de Formación Profesional (CFP)
// Estructurado acorde a las tablas de BD: course, course_detail, student_course, classroom_course

export const STAGES = {
  STAGE_1: 'Primera Etapa (Marzo - Julio)',
  STAGE_2: 'Segunda Etapa (Julio - Diciembre)',
};

export const CATEGORIES = [
  'Todos',
  'Oficios',
  'Tecnología',
  'Emprendimiento',
  'Administración',
  'Servicios'
];

export const STATUS_TYPES = {
  OPEN: { id: 1, label: 'Cupos disponibles', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400', badgeColor: 'bg-emerald-500' },
  LIMITED: { id: 2, label: 'Últimos cupos', color: 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400', badgeColor: 'bg-amber-500' },
  FULL: { id: 3, label: 'Cupo completo', color: 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-400', badgeColor: 'bg-rose-500' },
  FINISHED: { id: 4, label: 'Curso finalizado', color: 'bg-gray-500/10 text-gray-700 border-gray-300 dark:text-gray-400', badgeColor: 'bg-gray-500' },
};

export const coursesData = [
  // ==========================================
  // SEGUNDA ETAPA (Julio - Diciembre) - ACTIVOS
  // ==========================================
  {
    id: 1,
    name: 'Diseño Gráfico',
    stage: STAGES.STAGE_2,
    stageKey: 'segunda',
    category: 'Tecnología',
    image: '/images/diseno_grafico_1785797572237.webp',
    status: STATUS_TYPES.OPEN,
    start_date: '2026-07-15',
    end_time: '2026-12-10',
    schedule: 'Lunes y Miércoles 18:00 - 21:00 hs',
    max_absences: 4,
    detail: {
      description: 'Capacitación profesional en herramientas fundamentales de diseño visual, composición, teoría del color, tipografía y creación de marcas para medios digitales e impresos. Desarrolla proyectos reales para clientes e instituciones.',
      quota: 8,
      total_quota: 25,
      hour_quantity: 120,
      classes_quantity: 32,
      title_required: 'Estudios Primarios Completos (Secundario deseable)',
      endorsement_by: 'Dirección General de Cultura y Educación - CFP 404',
      syllabus: [
        'Módulo 1: Fundamentos de la Comunicación Visual y Composición',
        'Módulo 2: Herramientas Vectoriales y Edición de Imágenes',
        'Módulo 3: Identidad Corporativa y Diseño Tipográfico',
        'Módulo 4: Proyecto Final de Portfolio Profesional'
      ]
    }
  },
  {
    id: 2,
    name: 'Impresión 3D',
    stage: STAGES.STAGE_2,
    stageKey: 'segunda',
    category: 'Tecnología',
    image: '/images/impresion_3d_1785797594954.webp',
    status: STATUS_TYPES.OPEN,
    start_date: '2026-07-20',
    end_time: '2026-12-15',
    schedule: 'Martes y Jueves 17:30 - 20:30 hs',
    max_absences: 4,
    detail: {
      description: 'Aprende las tecnologías de fabricación aditiva FDM y resina, modelado 3D paramétrico en CAD, laminado en Slicer, calibración de impresoras 3D y post-procesamiento de piezas para la industria y prototipado.',
      quota: 12,
      total_quota: 20,
      hour_quantity: 100,
      classes_quantity: 28,
      title_required: 'Primario completo',
      endorsement_by: 'Ministerio de Trabajo y Formación Profesional',
      syllabus: [
        'Módulo 1: Introducción a la Fabricación Aditiva y Materiales',
        'Módulo 2: Modelado Paramétrico en CAD para 3D',
        'Módulo 3: Software de Laminación (Slicers) y Parámetros',
        'Módulo 4: Calibración, Mantenimiento y Post-procesado'
      ]
    }
  },
  {
    id: 3,
    name: 'Limpieza Institucional',
    stage: STAGES.STAGE_2,
    stageKey: 'segunda',
    category: 'Servicios',
    image: '/images/limpieza_inst_1785797617261.webp',
    status: STATUS_TYPES.OPEN,
    start_date: '2026-07-10',
    end_time: '2026-11-30',
    schedule: 'Lunes y Miércoles 14:00 - 17:00 hs',
    max_absences: 3,
    detail: {
      description: 'Formación especializada en protocolos de higiene, sanitización hospitalaria y empresarial, uso de maquinarias industriales de limpieza, bioseguridad, manejo de productos químicos y gestión de equipos de trabajo.',
      quota: 15,
      total_quota: 30,
      hour_quantity: 90,
      classes_quantity: 24,
      title_required: 'Primario completo',
      endorsement_by: 'CFP 404 & Consejo Escolar',
      syllabus: [
        'Módulo 1: Seguridad, Bioseguridad y Normativa Sanitaria',
        'Módulo 2: Químicos de Limpieza y Dosificación Correcta',
        'Módulo 3: Operación de Maquinaria Industrial',
        'Módulo 4: Protocolos para Hospitales, Escuelas y Empresas'
      ]
    }
  },
  {
    id: 4,
    name: 'Operador de Marketing Digital',
    stage: STAGES.STAGE_2,
    stageKey: 'segunda',
    category: 'Emprendimiento',
    image: '/images/marketing_ops_1785797639334.webp',
    status: STATUS_TYPES.OPEN,
    start_date: '2026-07-18',
    end_time: '2026-12-05',
    schedule: 'Viernes 18:00 - 22:00 hs',
    max_absences: 3,
    detail: {
      description: 'Domina las estrategias de marketing digital para pymes y emprendimientos. Estrategia de contenidos en redes sociales, campañas publicitarias orientadas a resultados, email marketing y analítica web.',
      quota: 6,
      total_quota: 25,
      hour_quantity: 110,
      classes_quantity: 26,
      title_required: 'Primario completo',
      endorsement_by: 'Cámara de Comercio e Industria & CFP 404',
      syllabus: [
        'Módulo 1: Fundamentos de Marketing Digital y Buyer Persona',
        'Módulo 2: Social Media Management y Creación de Contenido',
        'Módulo 3: Publicidad Paga (Meta Ads & Google Ads)',
        'Módulo 4: Métricas, Analytics y Optimización de Conversión'
      ]
    }
  },
  {
    id: 5,
    name: 'Reparación de Computadoras',
    stage: STAGES.STAGE_2,
    stageKey: 'segunda',
    category: 'Tecnología',
    image: '/images/reparacion_pc_1785797661891.webp',
    status: STATUS_TYPES.LIMITED,
    start_date: '2026-07-12',
    end_time: '2026-12-18',
    schedule: 'Martes y Jueves 18:30 - 21:30 hs',
    max_absences: 4,
    detail: {
      description: 'Diagnóstico técnico, mantenimiento preventivo y correctivo de hardware y software de PCs y laptops. Armado de equipos, detección de fallas en componentes, instalación de sistemas operativos y redes básicas.',
      quota: 2,
      total_quota: 20,
      hour_quantity: 130,
      classes_quantity: 34,
      title_required: 'Primario completo',
      endorsement_by: 'Dirección de Educación Técnico Profesional',
      syllabus: [
        'Módulo 1: Arquitectura de Hardware y Componentes de PC',
        'Módulo 2: Detección y Reparación de Fallas Eléctricas y Mecánicas',
        'Módulo 3: Instalación y Optimización de Sistemas Operativos',
        'Módulo 4: Redes Locales y Seguridad de Datos'
      ]
    }
  },
  {
    id: 6,
    name: 'Prototipado de Videojuegos',
    stage: STAGES.STAGE_2,
    stageKey: 'segunda',
    category: 'Tecnología',
    image: '/images/videojuegos_proto_1785797681891.webp',
    status: STATUS_TYPES.OPEN,
    start_date: '2026-07-25',
    end_time: '2026-12-20',
    schedule: 'Sábados 09:00 - 13:00 hs',
    max_absences: 3,
    detail: {
      description: 'Aprende los principios del Game Design, mecánica de juego, programación básica en motores de desarrollo (Unity / Godot) y creación de mecánicas jugables iterativas para videojuegos 2D y 3D.',
      quota: 10,
      total_quota: 22,
      hour_quantity: 120,
      classes_quantity: 25,
      title_required: 'Primario completo',
      endorsement_by: 'Polo Tecnológico & CFP 404',
      syllabus: [
        'Módulo 1: Game Design Document y Arquitectura de Juego',
        'Módulo 2: Lógica de Programación y Motores (Godot/Unity)',
        'Módulo 3: Asset Import, Animación 2D/3D y Física',
        'Módulo 4: Testing, UI/UX de Juegos y Publicación de Demo'
      ]
    }
  },

  // ==========================================
  // PRIMERA ETAPA (Marzo - Julio) - FINALIZADOS
  // ==========================================
  {
    id: 7,
    name: 'Logística Portuaria',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Administración',
    image: '/images/Logistica portuaria.webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-05',
    end_time: '2026-07-02',
    schedule: 'Lunes y Miércoles 18:00 - 21:00 hs',
    max_absences: 4,
    detail: {
      description: 'Operativa de comercio exterior, gestión de contenedores, administración de depósitos fiscales, normativas aduaneras y cadena de suministro en terminales portuarias.',
      quota: 0,
      total_quota: 30,
      hour_quantity: 140,
      classes_quantity: 36,
      title_required: 'Secundario completo',
      endorsement_by: 'Consorcio de Gestión del Puerto & CFP 404',
      syllabus: [
        'Módulo 1: Comercio Exterior y Cadena de Suministro',
        'Módulo 2: Operativa Aduanera y Documentación',
        'Módulo 3: Gestión de Terminales y Cargas Portuarias'
      ]
    }
  },
  {
    id: 8,
    name: 'Armador y Montador de Paneles y Cielorrasos',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Oficios',
    image: '/images/Armador y Montador de Paneles y Cielorrasos.webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-10',
    end_time: '2026-07-05',
    schedule: 'Martes y Jueves 14:00 - 18:00 hs',
    max_absences: 5,
    detail: {
      description: 'Construcción en seco (Steel Framing / Drywall), estructura metálica, colocación de placas de yeso, aislamiento termoacústico y acabados profesionales.',
      quota: 0,
      total_quota: 20,
      hour_quantity: 160,
      classes_quantity: 40,
      title_required: 'Primario completo',
      endorsement_by: 'Cámara de la Construcción & CFP 404',
      syllabus: [
        'Módulo 1: Perfilería Metálica y Replanteo en Obra',
        'Módulo 2: Montaje de Tabiques y Cielorrasos Suspendidos',
        'Módulo 3: Aislaciones y Tomado de Juntas'
      ]
    }
  },
  {
    id: 9,
    name: 'Desarrollador de Apps Móviles',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Tecnología',
    image: '/images/Desarrollador App moviles.webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-01',
    end_time: '2026-07-01',
    schedule: 'Lunes, Miércoles y Viernes 18:30 - 21:30 hs',
    max_absences: 4,
    detail: {
      description: 'Programación de aplicaciones móviles multiplataforma con React Native y JavaScript. Integración con APIs REST, diseño de interfaces táctiles y publicación en tiendas.',
      quota: 0,
      total_quota: 25,
      hour_quantity: 180,
      classes_quantity: 45,
      title_required: 'Secundario completo',
      endorsement_by: 'Ministerio de Educación y Polo Tecnológico',
      syllabus: [
        'Módulo 1: Fundamentos de JavaScript ES6+ y React',
        'Módulo 2: Componentes Nativos y Navegación Móvil',
        'Módulo 3: Consumo de APIs y Gestión de Estado',
        'Módulo 4: Publicación y Despliegue en App Store / Play Store'
      ]
    }
  },
  {
    id: 10,
    name: 'Base de Datos y Programación',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Tecnología',
    image: '/images/Base de Datos y Programación.webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-08',
    end_time: '2026-07-04',
    schedule: 'Martes y Jueves 18:00 - 22:00 hs',
    max_absences: 4,
    detail: {
      description: 'Diseño relacional de bases de datos, lenguaje SQL (MySQL/PostgreSQL), modelado entidad-relación, lógica de programación backend y consultas avanzadas.',
      quota: 0,
      total_quota: 25,
      hour_quantity: 150,
      classes_quantity: 38,
      title_required: 'Secundario en trámite o completo',
      endorsement_by: 'CFP 404 & Dirección de Formación Profesional',
      syllabus: [
        'Módulo 1: Diagramas Entidad-Relación y Normalización',
        'Módulo 2: Consultas SQL (DML, DDL, Joins, Agrupamientos)',
        'Módulo 3: Procedimientos Almacenados y Triggers'
      ]
    }
  },
  {
    id: 11,
    name: 'Cañista Montador',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Oficios',
    image: '/images/Cañista montador .webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-12',
    end_time: '2026-07-06',
    schedule: 'Lunes y Miércoles 13:30 - 17:30 hs',
    max_absences: 4,
    detail: {
      description: 'Tendido de tuberías industriales y domiciliarias, interpretación de planos isométricos, técnicas de termofusión, roscado y soldadura de cañerías.',
      quota: 0,
      total_quota: 18,
      hour_quantity: 160,
      classes_quantity: 40,
      title_required: 'Primario completo',
      endorsement_by: 'Sindicato de Sanitarios & CFP 404',
      syllabus: [
        'Módulo 1: Interpretación de Planos Isométricos',
        'Módulo 2: Técnicas de Corte, Roscado y Uniones',
        'Módulo 3: Pruebas de Hermeticidad y Presión'
      ]
    }
  },
  {
    id: 12,
    name: 'Habilidades para Emprender',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Emprendimiento',
    image: '/images/Habilidades para emprender .webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-15',
    end_time: '2026-06-30',
    schedule: 'Sábados 09:00 - 13:00 hs',
    max_absences: 3,
    detail: {
      description: 'Desarrollo del modelo de negocios Canvas, costos, precio de venta, pitch de ventas, canales de comercialización y gestión financiera para pequeños emprendedores.',
      quota: 0,
      total_quota: 30,
      hour_quantity: 80,
      classes_quantity: 20,
      title_required: 'Primario completo',
      endorsement_by: 'Fundación Emprender & CFP 404',
      syllabus: [
        'Módulo 1: Validación de Idea y Modelo Canvas',
        'Módulo 2: Estructura de Costos y Finanzas Básicas',
        'Módulo 3: Técnicas de Negociación y Oratoria'
      ]
    }
  },
  {
    id: 13,
    name: 'Herrero',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Oficios',
    image: '/images/Herreria.webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-02',
    end_time: '2026-07-01',
    schedule: 'Lunes, Miércoles y Viernes 14:00 - 18:00 hs',
    max_absences: 5,
    detail: {
      description: 'Técnicas de forja, corte, plegado y soldadura por arco eléctrico (SMAW / MIG-MAG). Elaboración de rejas, portones y estructuras metálicas de alta resistencia.',
      quota: 0,
      total_quota: 15,
      hour_quantity: 180,
      classes_quantity: 45,
      title_required: 'Primario completo',
      endorsement_by: 'Asociación de Industriales Metalúrgicos',
      syllabus: [
        'Módulo 1: Seguridad Industrial y Trazado de Metales',
        'Módulo 2: Soldadura Eléctrica y MIG-MAG',
        'Módulo 3: Fabricación de Carpintería Metálica'
      ]
    }
  },
  {
    id: 14,
    name: 'Mecánica de Ciclomotores',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Oficios',
    image: '/images/Mecanica de Ciclomotores.webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-06',
    end_time: '2026-07-03',
    schedule: 'Martes y Jueves 17:00 - 21:00 hs',
    max_absences: 4,
    detail: {
      description: 'Mantenimiento integral de motores monocilíndricos 2T y 4T, carburación, sistema de frenos, transmisión por cadena/variador y diagnóstico del sistema eléctrico.',
      quota: 0,
      total_quota: 20,
      hour_quantity: 150,
      classes_quantity: 38,
      title_required: 'Primario completo',
      endorsement_by: 'CFP 404 & Gremio Mecánico',
      syllabus: [
        'Módulo 1: Desarme y Diagnóstico de Motores 2T/4T',
        'Módulo 2: Carburación, Inyección Electrónica y Encendido',
        'Módulo 3: Sistemas de Freno, Suspensión y Transmisión'
      ]
    }
  },
  {
    id: 15,
    name: 'Montador Electricista',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Oficios',
    image: '/images/Montador Electricista.webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-04',
    end_time: '2026-07-02',
    schedule: 'Lunes y Miércoles 18:00 - 22:00 hs',
    max_absences: 4,
    detail: {
      description: 'Instalaciones eléctricas domiciliarias y comerciales según normativa AEA. Canalizaciones, tableros de protección, cálculo de cargas, jabalinas de puesta a tierra y medición de circuitos.',
      quota: 0,
      total_quota: 22,
      hour_quantity: 160,
      classes_quantity: 40,
      title_required: 'Primario completo',
      endorsement_by: 'Colegio de Electrotécnicos & CFP 404',
      syllabus: [
        'Módulo 1: Lógica Eléctrica y Normativa AEA',
        'Módulo 2: Armado de Tableros y Protecciones (Disyuntor/Térmica)',
        'Módulo 3: Puesta a Tierra y Certificación de Instalación'
      ]
    }
  }
];

export const ACADEMIC_RESOURCES = [
  {
    id: 1,
    title: 'Resolución de Títulos Oficiales',
    description: 'Documentación de la Dirección General de Cultura y Educación sobre validez nacional de nuestros certificados.',
    type: 'PDF',
    size: '2.4 MB'
  },
  {
    id: 2,
    title: 'Reglamento del Estudiante y Asistencias',
    description: 'Normativa de régimen de asistencias (máx. inasistencias por curso), puntualidad y evaluación.',
    type: 'PDF',
    size: '1.1 MB'
  },
  {
    id: 3,
    title: 'Portal de Convenios con Empresas',
    description: 'Información para cámaras empresariales y sindicatos interesados en pasantías y búsqueda de perfiles.',
    type: 'Portal',
    size: 'Enlace'
  },
  {
    id: 4,
    title: 'Guía de Inscripción y Requisitos',
    description: 'Instructivo paso a paso para la presentación de fotocopia de DNI y título de primaria/secundaria.',
    type: 'PDF',
    size: '850 KB'
  }
];

export const FAQS = [
  {
    question: '¿Los cursos son totalmente gratuitos?',
    answer: 'Sí. Los cursos dictados en el Centro de Formación Profesional son de carácter gratuito y cuentan con certificación oficial avalada por la Dirección General de Cultura y Educación y el Ministerio de Trabajo.'
  },
  {
    question: '¿Puedo inscribirme a más de un curso simultáneamente?',
    answer: 'Sí, siempre y cuando los horarios de cursada no se superpongan y cumplas con el régimen de asistencia requerido para cada materia.'
  },
  {
    question: '¿Qué documentación necesito para inscribirme?',
    answer: 'Debes presentar: 1) Fotocopia de DNI (frente y dorso), 2) Constancia de estudios alcanzados (Primario o Secundario según corresponda al curso), 3) Planilla de inscripción firmada.'
  },
  {
    question: '¿Qué ocurre si un curso aparece con "Cupo completo"?',
    answer: 'Los cursos con cupo completo no aceptan nuevas inscripciones en la edición vigente. Puedes registrarte en nuestra lista de espera o consultar los cursos disponibles en la siguiente etapa.'
  },
  {
    question: '¿Cómo obtengo mi certificado al finalizar el curso?',
    answer: 'Al cumplir con el 80% de asistencia obligatoria y aprobar las evaluaciones prácticas, la institución emitirá tu certificado oficial con validez nacional en formato digital con firma digitalizada.'
  }
];
