import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Database, Flame, Target, AlertTriangle, AlertOctagon, CheckCircle2, Factory } from 'lucide-react';

// --- CONFIGURACIÓN DE FECHAS (Expandido para cubrir desde el 03 de Marzo) ---
const PROJECT_START = '2026-03-03T00:00:00';
const PROJECT_END = '2026-03-11T23:59:59';

const WORK_TYPES = {
  TANQUES: { id: 'tanques', label: 'Tanques e Instalaciones', color: 'bg-blue-600', icon: Database },
  CALDERA: { id: 'caldera', label: 'Caldera', color: 'bg-orange-500', icon: Flame },
  QUEMADOR: { id: 'quemador', label: 'Quemador de Capota', color: 'bg-purple-600', icon: Target },
  GLP: { id: 'glp', label: 'Ruta Crítica Habilitar GLP', color: 'bg-red-600', icon: AlertOctagon }, // NUEVA SECCIÓN
};

// --- DATOS INTEGRADOS (Anteriores + Nuevo Excel GLP) ---
const INITIAL_TASKS = [
  // ==========================================
  // FRENTE 4: RUTA CRÍTICA GLP (NUEVO)
  // ==========================================
  {
    id: 101,
    title: 'Homologación & Cotización LINGAS/TILGAS',
    type: 'glp',
    startDate: '2026-03-03T08:00:00',
    endDate: '2026-03-03T18:00:00',
    progress: 100,
    status: 'completado',
    assignee: 'Raul Flor / Erick Y.',
    description: 'Homologar proveedor LINGAS/TILGAS. Cotización formal y generación de órdenes de compra.',
  },
  {
    id: 102,
    title: 'Alinear requerimientos SHE',
    type: 'glp',
    startDate: '2026-03-03T09:00:00',
    endDate: '2026-03-03T17:00:00',
    progress: 100,
    status: 'completado',
    assignee: 'J. Carlos / G. Lazo (SHE)',
    description: 'Alinear requerimientos de seguridad, salud y medio ambiente (SHE) para el ingreso a planta de contratistas.',
  },
  {
    id: 103,
    title: 'Mantenimiento Sistema Contra Incendio',
    type: 'glp',
    startDate: '2026-03-03T19:00:00',
    endDate: '2026-03-04T05:00:00',
    progress: 100,
    status: 'completado',
    assignee: 'David Asevedo',
    description: 'Mantenimiento del sistema contra incendio de la instalación, barandas, escaleras y plataformas (lijado, pintura, sentidos de flujo).',
  },
  {
    id: 104,
    title: 'Reemplazo de instrumentación de tanque',
    type: 'glp',
    startDate: '2026-03-04T08:00:00',
    endDate: '2026-03-05T18:00:00',
    progress: 100,
    status: 'completado',
    assignee: 'Javier Hurtado / LINGAS',
    description: 'Reemplazo de instrumentación del tanque (manómetro y termómetro) y mantenimiento de detectores de gas.',
  },
  {
    id: 105,
    title: 'Mantenimiento Válvulas y Descargas',
    type: 'glp',
    startDate: '2026-03-04T08:00:00',
    endDate: '2026-03-06T18:00:00',
    progress: 100,
    status: 'completado',
    assignee: 'Diego Vargas / LINGAS',
    description: 'Reemplazo de válvulas shut off, globo, alivio y purga en tanques. Mantenimiento y calibración de válvulas de seguridad (MAWP).',
  },
  {
    id: 106,
    title: 'Instalación de vaporizadores',
    type: 'glp',
    startDate: '2026-03-04T08:00:00',
    endDate: '2026-03-07T18:00:00',
    progress: 85,
    status: 'en_progreso',
    assignee: 'Javier Hurtado / TILGAS',
    description: 'Instalación de vaporizadores con sus accesorios y anclaje. Verificación de flujo máximo necesario.',
  },
  {
    id: 107,
    title: 'Mantenimiento Caldera Nebraska',
    type: 'glp',
    startDate: '2026-03-04T08:00:00',
    endDate: '2026-03-08T18:00:00',
    progress: 60,
    status: 'en_progreso',
    assignee: 'Diego V. / Energía y Combust.',
    description: 'Mantenimiento mayor de la caldera Nebraska de acuerdo al programa de parada.',
  },
  {
    id: 108,
    title: 'Prueba de hermeticidad de todo el sistema',
    type: 'glp',
    startDate: '2026-03-07T08:00:00',
    endDate: '2026-03-07T18:00:00',
    progress: 30,
    status: 'en_progreso',
    assignee: 'Juan Carlos / LINGAS',
    description: 'Pruebas de presión y hermeticidad de toda la línea de GLP ensamblada.',
  },
  {
    id: 109,
    title: 'Certificación de Línea OSINERGMIN',
    type: 'glp',
    startDate: '2026-03-09T08:00:00',
    endDate: '2026-03-09T17:00:00',
    progress: 0,
    status: 'pendiente',
    assignee: 'Juan Carlos / LINGAS',
    description: 'Visita de la autoridad. Fecha sujeta a confirmación final por parte de OSINERGMIN.',
  },
  {
    id: 110,
    title: 'Suministro de GLP y Pruebas',
    type: 'glp',
    startDate: '2026-03-10T08:00:00',
    endDate: '2026-03-11T18:00:00',
    progress: 0,
    status: 'pendiente',
    assignee: 'Ubaldo Leon / J. Carlos',
    description: 'Abastecimiento inicial de GLP, proceso de pruebas del sistema con combustible y calibración de combustión.',
  },

  // ==========================================
  // FRENTES ANTERIORES: TANQUES, CALDERA, QUEMADOR
  // ==========================================
  {
    id: 1, title: 'Permisos y Liberaciones', type: 'tanques', startDate: '2026-03-06T07:00:00', endDate: '2026-03-06T08:00:00', progress: 100, status: 'completado', assignee: 'Diego Vargas', description: 'Ingreso y generación de permisos de trabajo, además de las liberaciones de área correspondientes.'
  },
  {
    id: 2, title: 'Preparación de líneas', type: 'tanques', startDate: '2026-03-06T08:00:00', endDate: '2026-03-06T15:00:00', progress: 100, status: 'completado', assignee: 'Diego Vargas', description: 'Revisión exhaustiva, pulido y preparación de las líneas que han sido desmontadas.'
  },
  {
    id: 4, title: 'Mantenimiento Tanque 1', type: 'tanques', startDate: '2026-03-06T17:00:00', endDate: '2026-03-06T23:00:00', progress: 100, status: 'completado', assignee: 'Diego Vargas', description: 'Trabajos de soldadura interna y externa. Además, montaje de válvulas en la línea del tanque 1.'
  },
  {
    id: 5, title: 'Bloqueo de tuberías', type: 'caldera', startDate: '2026-03-06T08:00:00', endDate: '2026-03-06T10:00:00', progress: 100, status: 'completado', assignee: 'Christian', description: 'Bloqueo físico y etiquetado de salidas de tuberías para preparar condiciones seguras para pruebas.'
  },
  {
    id: 7, title: 'Pruebas Hidrostáticas 200/250psi', type: 'caldera', startDate: '2026-03-06T10:00:00', endDate: '2026-03-06T16:00:00', progress: 100, status: 'completado', assignee: 'Christian', description: 'Ejecución de pruebas hidrostáticas de alta presión sostenidas por espacio de horas continuas.'
  },
  {
    id: 8, title: 'Mantenimiento Sis. Control', type: 'caldera', startDate: '2026-03-06T08:00:00', endDate: '2026-03-08T18:00:00', progress: 45, status: 'en_progreso', assignee: 'Christian', description: 'Mantenimiento integral de los sistemas de control de seguridad de la caldera.'
  },
  {
    id: 9, title: 'Pruebas Economizador', type: 'caldera', startDate: '2026-03-07T08:00:00', endDate: '2026-03-08T08:00:00', progress: 10, status: 'en_progreso', assignee: 'Christian', description: 'Inicio de pruebas hidrostáticas en el economizador.'
  },
  {
    id: 12, title: 'Sellado Refractario (Secado)', type: 'caldera', startDate: '2026-03-08T14:00:00', endDate: '2026-03-10T14:00:00', progress: 0, status: 'pendiente', assignee: 'Christian', description: 'Sellado con material refractario de la parte interna del hogar de la caldera. Tiempo de secado: 2 días.'
  },
  {
    id: 13, title: 'Pruebas Elem. Seguridad', type: 'caldera', startDate: '2026-03-10T14:00:00', endDate: '2026-03-11T14:00:00', progress: 0, status: 'pendiente', assignee: 'Christian', description: 'Condición: Se debe ejecutar apenas se tenga habilitada la línea de gas.'
  },
  {
    id: 14, title: 'Mantenimiento Capota', type: 'quemador', startDate: '2026-03-06T08:00:00', endDate: '2026-03-06T18:00:00', progress: 100, status: 'completado', assignee: 'Javier', description: 'Trabajos programados ejecutados en el Quemador de Capota.'
  }
];

// --- FUNCIONES AUXILIARES ---
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

export default function App() {
  const [selectedTask, setSelectedTask] = useState(INITIAL_TASKS[0]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Arreglo de los 9 días del proyecto
  const timelineDays = ['03 Mar', '04 Mar', '05 Mar', '06 Mar', '07 Mar', '08 Mar', '09 Mar', '10 Mar', '11 Mar'];

  const filteredTasks = useMemo(() => {
    let tasks = INITIAL_TASKS;
    if (activeFilter !== 'all') {
      tasks = INITIAL_TASKS.filter(task => task.type === activeFilter);
    }
    // Ordenar por fecha de inicio para que la cascada tenga sentido
    return tasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [activeFilter]);

  // Calcula posición de la barra
  const calculatePosition = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const pStart = new Date(PROJECT_START).getTime();
    const pEnd = new Date(PROJECT_END).getTime();
    
    const totalDuration = pEnd - pStart;
    const offset = start - pStart;
    const duration = end - start;
    
    const safeLeft = Math.max(0, (offset / totalDuration) * 100);
    const safeWidth = Math.min(100 - safeLeft, (duration / totalDuration) * 100);
    
    return { left: `${safeLeft}%`, width: `${safeWidth}%` };
  };

  const renderTaskDetails = () => {
    if (!selectedTask) return null;
    const workType = WORK_TYPES[selectedTask.type.toUpperCase()];
    const Icon = workType.icon;
    const isGLP = selectedTask.type === 'glp';

    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 flex flex-col h-full sticky top-4 animate-fade-in">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
          <div className={`p-3 rounded-xl ${workType.color} text-white shadow-md`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] font-black tracking-widest uppercase ${isGLP ? 'text-red-500' : 'text-slate-500'}`}>
              {workType.label}
            </span>
            <h2 className="text-xl font-bold text-slate-800 leading-tight mt-1">{selectedTask.title}</h2>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div className={`rounded-xl p-4 border text-sm leading-relaxed
            ${isGLP ? 'bg-red-50 border-red-100 text-red-900' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
            {selectedTask.description}
            
            {selectedTask.id === 109 && (
              <div className="mt-3 flex items-start gap-2 text-red-700 bg-red-100/50 p-2.5 rounded-lg text-xs font-bold">
                <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Hito Crítico Regulatorio: Depende de disponibilidad del inspector estatal.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inicio</span>
              </div>
              <p className="font-bold text-slate-800 capitalize">{formatDate(selectedTask.startDate)}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">{formatTime(selectedTask.startDate)} hrs</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fin (Est.)</span>
              </div>
              <p className="font-bold text-slate-800 capitalize">{formatDate(selectedTask.endDate)}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">{formatTime(selectedTask.endDate)} hrs</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-slate-600 text-sm">Progreso Físico</span>
              <span className="font-black text-2xl text-slate-800 leading-none">{selectedTask.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-1000 relative ${workType.color}`} 
                style={{ width: `${selectedTask.progress}%` }}
              >
                {/* Brillo decorativo en la barra */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-full"></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Factory className="w-4 h-4" /> Responsable
                </span>
                <span className="text-sm font-black text-slate-800">{selectedTask.assignee}</span>
              </div>
              <div className="flex items-center justify-between p-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado Actual</span>
                <span className={`text-[11px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm
                  ${selectedTask.status === 'completado' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                    selectedTask.status === 'en_progreso' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                    'bg-slate-100 text-slate-500 border border-slate-200'}`}
                >
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Cabecera Corporativa SOFTYS */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          {/* Acento Corporativo */}
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-700"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">SOFTYS</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full">Planta Cañete</span>
              </div>
              <h2 className="text-xl font-bold text-slate-700">Plan Maestro de Parada y Ruta Crítica GLP</h2>
              <p className="text-slate-500 mt-1 font-medium text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Ventana de Ejecución: <strong className="text-slate-700">03 al 11 de Marzo, 2026</strong>
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="text-center px-6 py-3 bg-red-50 rounded-xl border border-red-100 shadow-sm">
                <span className="block text-2xl font-black text-red-600">
                  {INITIAL_TASKS.filter(t => t.type === 'glp').length}
                </span>
                <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest">Hitos GLP</span>
              </div>
              <div className="text-center px-6 py-3 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                <span className="block text-2xl font-black text-emerald-600">
                  {Math.round(INITIAL_TASKS.reduce((acc, t) => acc + t.progress, 0) / INITIAL_TASKS.length)}%
                </span>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Avance Global</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ZONA DEL GANTT */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filtros */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === 'all' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Vista Maestra
              </button>
              {Object.values(WORK_TYPES).map(type => (
                <button
                  key={type.id}
                  onClick={() => setActiveFilter(type.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                    ${activeFilter === type.id 
                      ? `${type.color} text-white shadow-md` 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  <type.icon className={`w-4 h-4 ${activeFilter === type.id ? 'text-white' : type.color.replace('bg-', 'text-')}`} />
                  {type.label}
                </button>
              ))}
            </div>

            {/* Contenedor del Gráfico con Scroll Horizontal para no apretar los días */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  
                  {/* Cabecera de Días */}
                  <div className="flex border-b border-slate-200 bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky top-0 z-30">
                    <div className="w-80 p-4 border-r border-slate-200 flex items-center bg-slate-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Actividad Programada
                    </div>
                    <div className="flex-1 flex relative">
                      {timelineDays.map((day, idx) => (
                        <div key={idx} className={`flex-1 py-4 text-center border-r border-slate-200 last:border-0 
                          ${day === '07 Mar' ? 'bg-amber-50/50 text-amber-700' : ''}`}>
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filas de Tareas */}
                  <div className="overflow-y-auto max-h-[600px] relative">
                    
                    {/* LÍNEA DE "HOY" (Sábado 07 de Marzo - Mitad del día) */}
                    <div className="absolute top-0 bottom-0 border-l-2 border-amber-500 z-0 pointer-events-none" 
                         style={{ left: `calc(320px + ((100% - 320px) / 9) * 4.5)` }}>
                        <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-b-md absolute -left-4 top-0 shadow-md">HOY</div>
                    </div>

                    {filteredTasks.map((task) => {
                      const position = calculatePosition(task.startDate, task.endDate);
                      const isSelected = selectedTask?.id === task.id;
                      const workColor = WORK_TYPES[task.type.toUpperCase()].color;
                      const isGLP = task.type === 'glp';

                      return (
                        <div 
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={`flex border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 group relative z-10
                            ${isSelected ? 'bg-blue-50/50' : ''}`}
                        >
                          {/* Columna Nombre (Fija a la izquierda) */}
                          <div className="w-80 p-4 border-r border-slate-100 flex items-center gap-3 bg-white group-hover:bg-slate-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${workColor} ${task.status === 'pendiente' ? 'opacity-40' : ''}`}></div>
                            <div className="min-w-0 flex-1">
                              <p className={`font-bold text-sm truncate ${isGLP ? 'text-slate-800' : 'text-slate-700'}`}>
                                {task.title}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                                {task.assignee}
                              </p>
                            </div>
                          </div>

                          {/* Columna Gantt */}
                          <div className="flex-1 relative py-3 bg-slate-50/20">
                            {/* Guías Verticales */}
                            <div className="absolute inset-0 flex">
                              {[...Array(9)].map((_, i) => (
                                <div key={i} className={`flex-1 border-r border-slate-100 border-dashed last:border-0 ${i === 4 ? 'bg-amber-50/20' : ''}`}></div>
                              ))}
                            </div>

                            {/* Barra de Progreso */}
                            <div 
                              className={`absolute h-7 rounded shadow-sm flex items-center px-2 text-[10px] font-black text-white transition-all duration-300 
                                ${workColor} ${isSelected ? 'ring-2 ring-offset-2 ring-slate-400 shadow-lg scale-[1.01] z-30' : 'opacity-90 hover:opacity-100 z-10'}`}
                              style={{ 
                                left: position.left, 
                                width: position.width,
                                top: '50%',
                                marginTop: '-14px',
                                minWidth: '32px' 
                              }}
                            >
                              {/* Sombreado de progreso */}
                              <div 
                                className="absolute top-0 left-0 bottom-0 bg-black/20 rounded-l"
                                style={{ width: `${task.progress}%` }}
                              ></div>
                              
                              {/* Textos dentro de la barra */}
                              <span className="relative z-10 truncate drop-shadow-md">
                                {task.progress}%
                              </span>

                              {/* Indicador Completado */}
                              {task.status === 'completado' && (
                                <div className="absolute -right-2 -top-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL LATERAL DE DETALLES */}
          <div className="lg:col-span-1">
            {renderTaskDetails()}
          </div>

        </div>
      </div>
    </div>
  );
}