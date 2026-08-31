// Dataset oficial de cursos del Centro de Formación Profesional (CFP)
// Estructurado acorde a los requerimientos de etapas, pre-inscripciones, patrocinadores y aval institucional.

export const STAGES = {
  STAGE_1: 'Primera mitad del año (Marzo - Junio)',
  STAGE_2: 'Segunda mitad del año (Julio - Diciembre)',
  STAGE_ANNUAL: 'Anual / Dictado Continuo',
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
  OPEN: { id: 1, label: 'Inscripción Abierta', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400', badgeColor: 'bg-emerald-500' },
  LIMITED: { id: 2, label: 'Últimos Cupos', color: 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400', badgeColor: 'bg-amber-500' },
  FULL: { id: 3, label: 'Cupo Completo', color: 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-400', badgeColor: 'bg-rose-500' },
  FINISHED: { id: 4, label: 'Curso Finalizado', color: 'bg-gray-500/10 text-gray-700 border-gray-300 dark:text-gray-400', badgeColor: 'bg-gray-500' },
};

export const TECPLATA_SPONSOR = {
  name: 'TecPlata',
  logo: '/images/tecplata_logo.jpg',
  mention: 'Patrocinado por TecPlata - Terminal Portuaria',
  badge: 'TecPlata'
};

export const OFFICIAL_ENDORSEMENT = 'Ministerio de Educación y Trabajo de la Provincia de Buenos Aires';

/**
 * Función auxiliar para obtener info detallada de la etapa
 */
export function getCourseStageInfo(course) {
  if (course.is_annual || course.is_continuous || course.stageKey === 'anual') {
    return {
      stageKey: 'anual',
      label: STAGES.STAGE_ANNUAL,
      description: 'Dictado continuo que abarca ambas etapas del año',
      isAnnual: true
    };
  }
  
  if (course.stageKey === 'primera') {
    return { stageKey: 'primera', label: STAGES.STAGE_1, description: 'Primera mitad del año (Marzo - Junio)', isAnnual: false };
  }

  return { stageKey: 'segunda', label: STAGES.STAGE_2, description: 'Segunda mitad del año (Julio - Diciembre)', isAnnual: false };
}

export const coursesData = [
  // ==========================================
  // CURSOS SEGUNDA MITAD DEL AÑO (Julio - Diciembre)
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
    preenrollment_date: '2026-07-01',
    schedule: 'Lunes y Miércoles 18:00 - 21:00 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: TECPLATA_SPONSOR,
    detail: {
      description: 'Capacitación profesional en herramientas fundamentales de diseño visual, composición, teoría del color, tipografía y creación de marcas para medios digitales e impresos. Desarrolla proyectos reales para clientes e instituciones.',
      quota: 8,
      total_quota: 25,
      hour_quantity: 120,
      classes_quantity: 32,
      title_required: 'Estudios Primarios Completos (Secundario deseable)',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-07-05',
    schedule: 'Martes y Jueves 17:30 - 20:30 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: TECPLATA_SPONSOR,
    detail: {
      description: 'Aprende las tecnologías de fabricación aditiva FDM y resina, modelado 3D paramétrico en CAD, laminado en Slicer, calibración de impresoras 3D y post-procesamiento de piezas para la industria y prototipado.',
      quota: 12,
      total_quota: 20,
      hour_quantity: 100,
      classes_quantity: 28,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-06-25',
    schedule: 'Lunes y Miércoles 14:00 - 17:00 hs',
    max_absences: 3,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'Consejo Escolar Berisso',
      mention: 'Auspiciado por Consejo Escolar',
      badge: 'Consejo Escolar'
    },
    detail: {
      description: 'Formación especializada en protocolos de higiene, sanitización hospitalaria y empresarial, uso de maquinarias industriales de limpieza, bioseguridad, manejo de productos químicos y gestión de equipos de trabajo.',
      quota: 15,
      total_quota: 30,
      hour_quantity: 90,
      classes_quantity: 24,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-07-01',
    schedule: 'Viernes 18:00 - 22:00 hs',
    max_absences: 3,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'Cámara de Comercio',
      mention: 'Patrocinado por Cámara de Comercio e Industria',
      badge: 'Cámara de Comercio'
    },
    detail: {
      description: 'Domina las estrategias de marketing digital para pymes y emprendimientos. Estrategia de contenidos en redes sociales, campañas publicitarias orientadas a resultados, email marketing y analítica web.',
      quota: 6,
      total_quota: 25,
      hour_quantity: 110,
      classes_quantity: 26,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-06-30',
    schedule: 'Martes y Jueves 18:30 - 21:30 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'Polo Tecnológico',
      mention: 'Patrocinado por Polo Tecnológico Región Capital',
      badge: 'Polo Tecnológico'
    },
    detail: {
      description: 'Diagnóstico técnico, mantenimiento preventivo y correctivo de hardware y software de PCs y laptops. Armado de equipos, detección de fallas en componentes, instalación de sistemas operativos y redes básicas.',
      quota: 2,
      total_quota: 20,
      hour_quantity: 130,
      classes_quantity: 34,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-07-10',
    schedule: 'Sábados 09:00 - 13:00 hs',
    max_absences: 3,
    is_annual: false,
    is_continuous: false,
    sponsor: TECPLATA_SPONSOR,
    detail: {
      description: 'Aprende los principios del Game Design, mecánica de juego, programación básica en motores de desarrollo (Unity / Godot) y creación de mecánicas jugables iterativas para videojuegos 2D y 3D.',
      quota: 10,
      total_quota: 22,
      hour_quantity: 120,
      classes_quantity: 25,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
    }
  },

  // ==========================================
  // CURSOS ANUALES / DICTADO CONTINUO (Abarca ambas etapas)
  // ==========================================
  {
    id: 17,
    name: 'Soldador',
    stage: STAGES.STAGE_ANNUAL,
    stageKey: 'anual',
    category: 'Oficios',
    image: '/images/soldador.webp',
    status: STATUS_TYPES.OPEN,
    start_date: '2026-03-16',
    end_time: '2026-12-14',
    preenrollment_date: '2026-02-15',
    schedule: 'Lunes, miércoles y viernes de 17:30hs a 20:45hs',
    max_absences: 5,
    is_annual: true,
    is_continuous: true,
    sponsor: {
      name: 'UOCRA',
      mention: 'Auspiciado por UOCRA & Cámara de la Construcción',
      badge: 'UOCRA'
    },
    detail: {
      description: 'El Soldador está capacitado, de acuerdo a las actividades que se desarrollan en el Perfil Profesional, para trabajar en soldaduras simples aplicadas a elementos de acero de bajo contenido de carbono, que no requieran cálculo estructural y que no pongan en riesgo a equipos o personas, mediante el proceso de soldadura eléctrica por arco voltaico, también realiza cortes de materiales por medio de dispositivos de equipos oxiacetilénicos y por Plasma.\n\nRealiza tareas que le son indicadas por un supervisor, interpreta ordenes de trabajo y planos de fabricación, prepara las superficies a unir, calibra las máquinas y/o equipos para soldar, regula el oxicorte y realiza las operaciones de soldadura y/o corte de materiales. Conoce las características de los metales y los efectos que producen las soldaduras sobre ellos (deformación y cambio de dimensiones).\n\nLugar de Cursada: Sede Central Calle La Portada N°4120 (Acceso 4 al Puerto). Cursada 100% Gratuita.',
      quota: 12,
      total_quota: 25,
      hour_quantity: 250,
      classes_quantity: 60,
      title_required: 'Primario Completo, ser mayor de 16 años.',
      endorsement_by: OFFICIAL_ENDORSEMENT
    }
  },

  // ==========================================
  // CURSOS PRIMERA MITAD DEL AÑO (Marzo - Junio)
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
    preenrollment_date: '2026-02-10',
    schedule: 'Lunes y Miércoles 18:00 - 21:00 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: TECPLATA_SPONSOR,
    detail: {
      description: 'Operativa de comercio exterior, gestión de contenedores, administración de depósitos fiscales, normativas aduaneras y cadena de suministro en terminales portuarias.',
      quota: 0,
      total_quota: 30,
      hour_quantity: 140,
      classes_quantity: 36,
      title_required: 'Secundario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-02-15',
    schedule: 'Martes y Jueves 14:00 - 18:00 hs',
    max_absences: 5,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'UOCRA',
      mention: 'Auspiciado por UOCRA & Cámara de la Construcción',
      badge: 'UOCRA'
    },
    detail: {
      description: 'Construcción en seco (Steel Framing / Drywall), estructura metálica, colocación de placas de yeso, aislamiento termoacústico y acabados profesionales.',
      quota: 0,
      total_quota: 20,
      hour_quantity: 160,
      classes_quantity: 40,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-02-01',
    schedule: 'Lunes, Miércoles y Viernes 18:30 - 21:30 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'Polo Tecnológico',
      mention: 'Patrocinado por Polo Tecnológico Región Capital',
      badge: 'Polo Tecnológico'
    },
    detail: {
      description: 'Programación de aplicaciones móviles multiplataforma con React Native y JavaScript. Integración con APIs REST, diseño de interfaces táctiles y publicación en tiendas.',
      quota: 0,
      total_quota: 25,
      hour_quantity: 180,
      classes_quantity: 45,
      title_required: 'Secundario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
    }
  },
  {
    id: 10,
    name: 'PROGRAMACIÓN WEB Y ADMINISTRACIÓN DE BASE DE DATOS (con agentes ia)',
    stage: STAGES.STAGE_1,
    stageKey: 'primera',
    category: 'Tecnología',
    image: '/images/Base de Datos y Programación.webp',
    status: STATUS_TYPES.FINISHED,
    start_date: '2026-03-08',
    end_time: '2026-07-04',
    preenrollment_date: '2026-02-12',
    schedule: 'Martes y Jueves 18:00 - 22:00 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: TECPLATA_SPONSOR,
    detail: {
      description: 'Diseño relacional de bases de datos, lenguaje SQL, desarrollo de sistemas web y optimización de flujos de desarrollo con la ayuda de agentes de Inteligencia Artificial.',
      quota: 0,
      total_quota: 25,
      hour_quantity: 150,
      classes_quantity: 38,
      title_required: 'Secundario en trámite o completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-02-15',
    schedule: 'Lunes y Miércoles 13:30 - 17:30 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'YPF',
      mention: 'Patrocinado por YPF Refinería La Plata',
      badge: 'YPF'
    },
    detail: {
      description: 'Tendido de tuberías industriales y domiciliarias, interpretación de planos isométricos, técnicas de termofusión, roscado y soldadura de cañerías.',
      quota: 0,
      total_quota: 18,
      hour_quantity: 160,
      classes_quantity: 40,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-02-20',
    schedule: 'Sábados 09:00 - 13:00 hs',
    max_absences: 3,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'Fundación Emprender',
      mention: 'Patrocinado por Fundación Emprender Berisso',
      badge: 'Fundación Emprender'
    },
    detail: {
      description: 'Desarrollo del modelo de negocios Canvas, costos, precio de venta, pitch de ventas, canales de comercialización y gestión financiera para pequeños emprendedores.',
      quota: 0,
      total_quota: 30,
      hour_quantity: 80,
      classes_quantity: 20,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-02-05',
    schedule: 'Lunes, Miércoles y Viernes 14:00 - 18:00 hs',
    max_absences: 5,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'Asociación Metalúrgica',
      mention: 'Patrocinado por Asociación de Industriales Metalúrgicos',
      badge: 'Industria Metalúrgica'
    },
    detail: {
      description: 'Técnicas de forja, corte, plegado y soldadura por arco eléctrico (SMAW / MIG-MAG). Elaboración de rejas, portones y estructuras metálicas de alta resistencia.',
      quota: 0,
      total_quota: 15,
      hour_quantity: 180,
      classes_quantity: 45,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-02-10',
    schedule: 'Martes y Jueves 17:00 - 21:00 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'SMATA',
      mention: 'Auspiciado por Gremio Mecánico SMATA',
      badge: 'SMATA'
    },
    detail: {
      description: 'Mantenimiento integral de motores monocilíndricos 2T y 4T, carburación, sistema de frenos, transmisión por cadena/variador y diagnóstico del sistema eléctrico.',
      quota: 0,
      total_quota: 20,
      hour_quantity: 150,
      classes_quantity: 38,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    preenrollment_date: '2026-02-08',
    schedule: 'Lunes y Miércoles 18:00 - 22:00 hs',
    max_absences: 4,
    is_annual: false,
    is_continuous: false,
    sponsor: {
      name: 'Colegio de Electrotécnicos',
      mention: 'Patrocinado por Colegio de Electrotécnicos PBA',
      badge: 'Electrotécnicos'
    },
    detail: {
      description: 'Instalaciones eléctricas domiciliarias y comerciales según normativa AEA. Canalizaciones, tableros de protección, cálculo de cargas, jabalinas de puesta a tierra y medición de circuitos.',
      quota: 0,
      total_quota: 22,
      hour_quantity: 160,
      classes_quantity: 40,
      title_required: 'Primario completo',
      endorsement_by: OFFICIAL_ENDORSEMENT
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
    title: 'Reglamento del Estudiante',
    description: 'Normativa institucional de régimen de cursada, puntualidad y evaluación.',
    type: 'PDF',
    size: '1.1 MB'
  },
  {
    id: 3,
    title: 'Portal de Convenios con Empresas',
    description: 'Información para cámaras empresariales (TecPlata, YPF, UOCRA) sobre pasantías e inserción laboral.',
    type: 'Portal',
    size: 'Enlace'
  },
  {
    id: 4,
    title: 'Guía de Pre-inscripción y Requisitos',
    description: 'Instructivo paso a paso para la presentación de fotocopia de DNI y título de primaria/secundaria.',
    type: 'PDF',
    size: '850 KB'
  }
];

export const FAQS = [
  {
    question: '¿Los cursos son totalmente gratuitos?',
    answer: 'Sí. Los cursos dictados en el Centro de Formación Profesional N° 404 son de carácter 100% gratuito y cuentan con certificación oficial avalada por el Ministerio de Educación y Trabajo de la Provincia de Buenos Aires.'
  },
  {
    question: '¿Puedo inscribirme a más de un curso simultáneamente?',
    answer: 'Sí, siempre y cuando los horarios de cursada no se superpongan y cumplas con la dedicación requerida para cada capacitación.'
  },
  {
    question: '¿Qué documentación necesito presentar?',
    answer: 'Debes presentar: 1) Fotocopia de DNI (frente y dorso), 2) Constancia de estudios alcanzados (Primario o Secundario según corresponda al curso), 3) Planilla de inscripción firmada.'
  },
  {
    question: '¿Cómo funciona la apertura de Pre-inscripción automática?',
    answer: 'Cada curso cuenta con una fecha estipulada de pre-inscripción. Al llegar dicha fecha, el sistema habilita automáticamente el formulario de inscripción para registrar tu turno.'
  },
  {
    question: '¿Qué es el sistema de Cola Virtual?',
    answer: 'En periodos de alta demanda de pre-inscripción, el sistema asigna un turno en la Cola Virtual indicando tu posición de espera para garantizar un proceso justo y ordenado.'
  }
];
