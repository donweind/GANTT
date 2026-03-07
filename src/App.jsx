import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Database, Flame, Target, AlertOctagon, CheckCircle2, Factory, Filter } from 'lucide-react';

// --- CONFIGURACIÓN DE FECHAS ---
const PROJECT_START = '2026-03-03T00:00:00';
const PROJECT_END = '2026-03-11T23:59:59';

const WORK_TYPES = {
  TANQUES: { id: 'tanques', label: 'Tanques e Instalaciones', color: 'bg-blue-600', icon: Database },
  CALDERA: { id: 'caldera', label: 'Caldera', color: 'bg-orange-500', icon: Flame },
  QUEMADOR: { id: 'quemador', label: 'Quemador de Capota', color: 'bg-purple-600', icon: Target },
  GLP: { id: 'glp', label: 'Ruta Crítica Habilitar GLP', color: 'bg-red-600', icon: AlertOctagon },
};

// --- DATA MASTER: TRANSCRIPCIÓN TOTAL DE LOS 3 EXCEL (Sin agrupaciones ni eliminaciones) ---
const INITIAL_TASKS = [
  // ==================== FRENTE 1: TANQUES E INSTALACIONES ====================
  // Preparación
  { id: 101, type: 'tanques', subType: 'Preparación', title: 'Permisos de alto riesgo', progress: 100, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 102, type: 'tanques', subType: 'Preparación', title: 'Habilitación de personal calificado', progress: 100, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 103, type: 'tanques', subType: 'Preparación', title: 'Habilitación de equipos de rescate y seguridad', progress: 100, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 104, type: 'tanques', subType: 'Preparación', title: 'Inducciones y requisitos', progress: 100, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-06T18:00:00' },
  // Reparación de Tanques
  { id: 105, type: 'tanques', subType: 'Reparación de Tanques', title: 'Soldadura interna de Tq2', progress: 80, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 106, type: 'tanques', subType: 'Reparación de Tanques', title: 'Soldadura interna de Tq1', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-07T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 107, type: 'tanques', subType: 'Reparación de Tanques', title: 'Instalación de válvulas de seguridad Tq2', progress: 20, assignee: 'Diego Vargas', startDate: '2026-03-07T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 108, type: 'tanques', subType: 'Reparación de Tanques', title: 'Instalación de válvulas de seguridad Tq1', progress: 20, assignee: 'Diego Vargas', startDate: '2026-03-09T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 109, type: 'tanques', subType: 'Reparación de Tanques', title: 'Instalación de válvula reguladora de presión GLP Tq1', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-09T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 110, type: 'tanques', subType: 'Reparación de Tanques', title: 'Instalación de válvula reguladora de presión GLP Tq2', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-09T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 111, type: 'tanques', subType: 'Reparación de Tanques', title: 'Instalación de shutoff Tq1', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-09T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 112, type: 'tanques', subType: 'Reparación de Tanques', title: 'Instalación de shutoff Tq2', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-09T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 113, type: 'tanques', subType: 'Reparación de Tanques', title: 'Instalación de valvulería y accesorios', progress: 25, assignee: 'Diego Vargas', startDate: '2026-03-07T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 114, type: 'tanques', subType: 'Reparación de Tanques', title: 'Instalación de instrumentación analógica', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-07T08:00:00', endDate: '2026-03-10T18:00:00' },
  // Reparación de Instalaciones
  { id: 115, type: 'tanques', subType: 'Reparación de instalaciones', title: 'Recuperación de pipping', progress: 65, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 116, type: 'tanques', subType: 'Reparación de instalaciones', title: 'Habilitación de material para el dimensionamiento', progress: 50, assignee: 'Diego Vargas', startDate: '2026-03-07T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 117, type: 'tanques', subType: 'Reparación de instalaciones', title: 'Montaje de tuberías nuevas', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-09T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 118, type: 'tanques', subType: 'Reparación de instalaciones', title: 'Recuperación de bridas, pernería, aislamientos', progress: 40, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 119, type: 'tanques', subType: 'Reparación de instalaciones', title: 'Cambio de válvulas reguladoras', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-09T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 120, type: 'tanques', subType: 'Reparación de instalaciones', title: 'Cambio de valvulería y accesorios de zona de descarga', progress: 35, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 121, type: 'tanques', subType: 'Reparación de instalaciones', title: 'Cambio de valvulería y accesorios de zona de vaporizadores', progress: 40, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-09T18:00:00' },
  // Seguridad de instalaciones
  { id: 122, type: 'tanques', subType: 'Seguridad de instalaciones', title: 'Reparación de sensores de gas / detectores de flama', progress: 30, assignee: 'Diego Vargas', startDate: '2026-03-06T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 123, type: 'tanques', subType: 'Seguridad de instalaciones', title: 'Instalación de sensórica', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-10T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 124, type: 'tanques', subType: 'Seguridad de instalaciones', title: 'Prueba hidrostática de Tq1', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-10T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 125, type: 'tanques', subType: 'Seguridad de instalaciones', title: 'Prueba hidrostática de Tq2', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-10T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 126, type: 'tanques', subType: 'Seguridad de instalaciones', title: 'Prueba hidrostática de (descarga a tanques)', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-10T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 127, type: 'tanques', subType: 'Seguridad de instalaciones', title: 'Prueba hidrostática de (Tanques a Vaporizadores)', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-10T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 128, type: 'tanques', subType: 'Seguridad de instalaciones', title: 'Prueba hidrostática de (Tanques a Calderas)', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-10T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 129, type: 'tanques', subType: 'Seguridad de instalaciones', title: 'Prueba hidrostática de (Tanques a Capota)', progress: 0, assignee: 'Diego Vargas', startDate: '2026-03-10T08:00:00', endDate: '2026-03-10T18:00:00' },

  // ==================== FRENTE 2: CALDERAS ====================
  // Mecánica
  { id: 201, type: 'caldera', subType: 'Mecánica', title: 'Aislamiento de caldera.', progress: 100, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 202, type: 'caldera', subType: 'Mecánica', title: 'Prueba hidrostatica de la caldera.', progress: 85, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 203, type: 'caldera', subType: 'Mecánica', title: 'Identificación y reparación de daños', progress: 85, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 204, type: 'caldera', subType: 'Mecánica', title: 'Calibración de válvulas de seguridad', progress: 100, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 205, type: 'caldera', subType: 'Mecánica', title: 'Mtto válvulas check', progress: 100, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  // Eléctrica
  { id: 206, type: 'caldera', subType: 'Eléctrica', title: 'Inspección de amperajes, acoplamientos y medición de aislamientos.', progress: 100, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 207, type: 'caldera', subType: 'Eléctrica', title: 'Inspección general de gabinetes eléctricos', progress: 100, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 208, type: 'caldera', subType: 'Eléctrica', title: 'Calibración de instrumentación análoga', progress: 100, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 209, type: 'caldera', subType: 'Eléctrica', title: 'Revisión de sistemas se seguridad: valv control, termostatos, presostatos', progress: 50, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 210, type: 'caldera', subType: 'Eléctrica', title: 'Megado de motores', progress: 50, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 211, type: 'caldera', subType: 'Eléctrica', title: 'Revisión y ajustes del sistema neumático', progress: 100, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-08T18:00:00' },
  // Control
  { id: 212, type: 'caldera', subType: 'Control', title: 'Pruebas de encendido de llama, barrido de gases.', progress: 0, assignee: 'Christian', startDate: '2026-03-11T08:00:00', endDate: '2026-03-11T18:00:00' },
  { id: 213, type: 'caldera', subType: 'Control', title: 'Pruebas de sobre presión por gas y aire.', progress: 0, assignee: 'Christian', startDate: '2026-03-11T08:00:00', endDate: '2026-03-11T18:00:00' },
  { id: 214, type: 'caldera', subType: 'Control', title: 'Pruebas de sistema de apagado de emergencia.', progress: 0, assignee: 'Christian', startDate: '2026-03-11T08:00:00', endDate: '2026-03-11T18:00:00' },
  // Quemador
  { id: 215, type: 'caldera', subType: 'Quemador', title: 'Revisión y mtto de tren de combustión', progress: 50, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 216, type: 'caldera', subType: 'Quemador', title: 'Mtto de filtros de gas.', progress: 0, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 217, type: 'caldera', subType: 'Quemador', title: 'Desmontaje de cabezal de combustión.', progress: 0, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 218, type: 'caldera', subType: 'Quemador', title: 'Mtto a quemador de gas.', progress: 0, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 219, type: 'caldera', subType: 'Quemador', title: 'Mtto a electrodo, toberas y fotoceldas.', progress: 0, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 220, type: 'caldera', subType: 'Quemador', title: 'Calibración de electrodos.', progress: 0, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 221, type: 'caldera', subType: 'Quemador', title: 'Revisión de sistemas de seguridades de quemador.', progress: 0, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 222, type: 'caldera', subType: 'Quemador', title: 'Pruebas de ventilador.', progress: 0, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  // Ventilador
  { id: 223, type: 'caldera', subType: 'Ventilador', title: 'Balanceo dinámito de ventilador.', progress: 0, assignee: 'Christian', startDate: '2026-03-11T08:00:00', endDate: '2026-03-11T18:00:00' },
  { id: 224, type: 'caldera', subType: 'Ventilador', title: 'Megado de motor.', progress: 0, assignee: 'Christian', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 225, type: 'caldera', subType: 'Ventilador', title: 'Limpieza de compartimiento de ventilación.', progress: 0, assignee: 'Christian', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  // Refractarios
  { id: 226, type: 'caldera', subType: 'Refractarios', title: 'Desmontaje de refractarios.', progress: 50, assignee: 'Christian', startDate: '2026-03-06T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 227, type: 'caldera', subType: 'Refractarios', title: 'Reparación de hogar de fuego', progress: 0, assignee: 'Christian', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 228, type: 'caldera', subType: 'Refractarios', title: 'Curado y resanes.', progress: 0, assignee: 'Christian', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  // Economizador
  { id: 229, type: 'caldera', subType: 'Economizador', title: 'Desconexionado y aislamiento del equipo', progress: 20, assignee: 'Christian', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 230, type: 'caldera', subType: 'Economizador', title: 'Prueba hidrostatica a 250 psi.', progress: 10, assignee: 'Christian', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 231, type: 'caldera', subType: 'Economizador', title: 'Detección de fugas y reparaciones.', progress: 0, assignee: 'Christian', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 232, type: 'caldera', subType: 'Economizador', title: 'Conexionado y cierre de equipo', progress: 0, assignee: 'Christian', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },

  // ==================== FRENTE 3: QUEMADOR DE CAPOTA ====================
  // Mecánica
  { id: 301, type: 'quemador', subType: 'Mecánica', title: 'Desmontaje de quemador.', progress: 25, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 302, type: 'quemador', subType: 'Mecánica', title: 'Limpieza de conos y difusores.', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 303, type: 'quemador', subType: 'Mecánica', title: 'Calibración de toberas de combustión', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 304, type: 'quemador', subType: 'Mecánica', title: 'Revisión de la ignición.', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 305, type: 'quemador', subType: 'Mecánica', title: 'Limpieza del sistema de ventilación forzada.', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-08T18:00:00' },
  // Control
  { id: 306, type: 'quemador', subType: 'Control', title: 'Calibración de curva de arranque.', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-11T18:00:00' },
  { id: 307, type: 'quemador', subType: 'Control', title: 'Revisión del sistema de corte por emergencia.', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-11T18:00:00' },
  { id: 308, type: 'quemador', subType: 'Control', title: 'Revisión del control del flujo de GLP', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-11T18:00:00' },
  // Seguridad
  { id: 309, type: 'quemador', subType: 'Seguridad', title: 'Revisión de sistemas de emergencia.', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-11T18:00:00' },
  { id: 310, type: 'quemador', subType: 'Seguridad', title: 'Limpieza', progress: 0, assignee: 'Javier', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 311, type: 'quemador', subType: 'Seguridad', title: 'Pruebas de operación.', progress: 0, assignee: 'Javier', startDate: '2026-03-11T08:00:00', endDate: '2026-03-11T18:00:00' },

  // ==================== FRENTE 4: RUTA CRÍTICA GLP ====================
  // (Sin "Homologación y Cotización" según solicitud previa)
  { id: 403, type: 'glp', subType: 'Requisitos y Seguridad', title: 'Alinear requerimientos de SHE para ingreso a planta', progress: 100, assignee: 'Juan Carlos/Guillermo Lazo', startDate: '2026-03-03T08:00:00', endDate: '2026-03-03T18:00:00' },
  { id: 404, type: 'glp', subType: 'Requisitos y Seguridad', title: 'Mantenimiento del sistema contra incendio (lijado, pintura)', progress: 100, assignee: 'David Asevedo', startDate: '2026-03-03T08:00:00', endDate: '2026-03-03T19:00:00' },
  { id: 405, type: 'glp', subType: 'Requisitos y Seguridad', title: 'Reemplazo de señaletica de seguridad', progress: 100, assignee: 'Victor Mendoza', startDate: '2026-03-03T08:00:00', endDate: '2026-03-05T18:00:00' },
  { id: 406, type: 'glp', subType: 'Requisitos y Seguridad', title: 'Reemplazo de señaleticas de seguridad del tanque', progress: 100, assignee: 'Victor Mendoza', startDate: '2026-03-03T08:00:00', endDate: '2026-03-05T18:00:00' },
  
  { id: 407, type: 'glp', subType: 'Intervención Tanques', title: 'Reemplazo de instrumentacion del tanque (manometro y termometro)', progress: 100, assignee: 'Javier Hurtado/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-05T18:00:00' },
  { id: 408, type: 'glp', subType: 'Intervención Tanques', title: 'Reemplazo y hermeticidad de sistema de llenado de GLP', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-05T18:00:00' },
  { id: 409, type: 'glp', subType: 'Intervención Tanques', title: 'Mantenimiento de valvulas shut off y sistema de accionamiento', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 410, type: 'glp', subType: 'Intervención Tanques', title: 'Reemplazo de valvulas de globo en cada tanque (2x)', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 411, type: 'glp', subType: 'Intervención Tanques', title: 'Reemplazo de valvulas de globo y alivio en descarga (2x)', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 412, type: 'glp', subType: 'Intervención Tanques', title: 'Reemplazo de niples y valvula de purga 8 1 x tanque', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 413, type: 'glp', subType: 'Intervención Tanques', title: 'Mantenimiento y calibracion transmisor presion en tanque', progress: 100, assignee: 'Javier Hurtado/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 414, type: 'glp', subType: 'Intervención Tanques', title: 'Mantenimiento y claibración de valvulas de seguridad MAWP', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 415, type: 'glp', subType: 'Intervención Tanques', title: 'Mantenimiento (lijado y pintado) de los manhole', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-04T18:00:00' },
  { id: 416, type: 'glp', subType: 'Intervención Tanques', title: 'Reemplazo de valvula linea de consumo', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-04T18:00:00' },
  { id: 417, type: 'glp', subType: 'Intervención Tanques', title: 'Reemplazo de valvula reguladora', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-05T18:00:00' },
  { id: 418, type: 'glp', subType: 'Intervención Tanques', title: 'Reemplazo de valvulas de extraccion liquida', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-05T18:00:00' },
  
  { id: 419, type: 'glp', subType: 'Líneas y Vaporizadores', title: 'Reemplazo de manometros en linea de descarga', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-05T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 420, type: 'glp', subType: 'Líneas y Vaporizadores', title: 'Reemplazo de tornillos, empaquetaduras tubería de descarga', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-05T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 421, type: 'glp', subType: 'Líneas y Vaporizadores', title: 'Reemplazo de valvulas de globo (copla)', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-05T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 422, type: 'glp', subType: 'Líneas y Vaporizadores', title: 'Mantenimiento de detectores de gas', progress: 100, assignee: 'Javier Hurtado/SOLIVAN', startDate: '2026-03-03T08:00:00', endDate: '2026-03-05T18:00:00' },
  { id: 423, type: 'glp', subType: 'Líneas y Vaporizadores', title: 'Mantenimiento de linea de vaporizadores', progress: 100, assignee: 'Diego Vargas/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 424, type: 'glp', subType: 'Líneas y Vaporizadores', title: 'Mantenimiento de valvula reguladora de vaporizadores', progress: 100, assignee: 'Javier Hurtado/LINGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-06T18:00:00' },
  { id: 425, type: 'glp', subType: 'Líneas y Vaporizadores', title: 'Instalación de vaporizadores, con sus accesorios', progress: 85, assignee: 'Javier Hurtado/TILGAS', startDate: '2026-03-04T08:00:00', endDate: '2026-03-07T18:00:00' },
  
  { id: 426, type: 'glp', subType: 'Pruebas y Certificación', title: 'Verificación de puntos adicionales en tanques de 1000', progress: 100, assignee: 'Diego Vargas/Solivan', startDate: '2026-03-03T08:00:00', endDate: '2026-03-03T13:00:00' },
  { id: 427, type: 'glp', subType: 'Pruebas y Certificación', title: 'Visita de autoridad para cerrar tanques', progress: 0, assignee: 'Alvaro/Jose/Juan C', startDate: '2026-03-09T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 428, type: 'glp', subType: 'Pruebas y Certificación', title: 'Mantenimiento de caldera Nebraska', progress: 60, assignee: 'Diego V./Energía', startDate: '2026-03-04T08:00:00', endDate: '2026-03-08T18:00:00' },
  { id: 429, type: 'glp', subType: 'Pruebas y Certificación', title: 'Conversion de caldera Clever B a GLP', progress: 0, assignee: 'Christian M/LA LLAVE', startDate: '2026-03-08T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 430, type: 'glp', subType: 'Pruebas y Certificación', title: 'Prueba de hermeticidad de todo el sistema', progress: 30, assignee: 'Juan Carlos/LINGAS', startDate: '2026-03-07T08:00:00', endDate: '2026-03-07T18:00:00' },
  { id: 431, type: 'glp', subType: 'Pruebas y Certificación', title: 'Certificacion de Linea de GLP OSINERGMIN', progress: 0, assignee: 'Juan Carlos/LINGAS', startDate: '2026-03-09T08:00:00', endDate: '2026-03-09T18:00:00' },
  { id: 432, type: 'glp', subType: 'Pruebas y Certificación', title: 'Suministro de GLP', progress: 0, assignee: 'Ubaldo Leon', startDate: '2026-03-10T08:00:00', endDate: '2026-03-10T18:00:00' },
  { id: 433, type: 'glp', subType: 'Pruebas y Certificación', title: 'Proceso de pruebas del sistema con combustible', progress: 0, assignee: 'Juan Carlos/LINGAS', startDate: '2026-03-11T08:00:00', endDate: '2026-03-11T18:00:00' },
  { id: 434, type: 'glp', subType: 'Pruebas y Certificación', title: 'Calibracion de combustion en quemador de capotas con GLP', progress: 0, assignee: 'Javier Hurtado/FLOSITEC', startDate: '2026-03-11T08:00:00', endDate: '2026-03-11T18:00:00' },
];

// --- FUNCIONES AUXILIARES ---
const getStatus = (progress) => {
  if (progress === 100) return 'completado';
  if (progress > 0) return 'en_progreso';
  return 'pendiente';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

export default function App() {
  const [selectedTask, setSelectedTask] = useState(INITIAL_TASKS.find(t=> t.progress > 0 && t.progress < 100) || INITIAL_TASKS[0]);
  const [activeMainFilter, setActiveMainFilter] = useState('all');
  const [activeSubFilter, setActiveSubFilter] = useState('all');

  const timelineDays = ['03 Mar', '04 Mar', '05 Mar', '06 Mar', '07 Mar', '08 Mar', '09 Mar', '10 Mar', '11 Mar'];

  // Obtener SubFiltros Dinámicos según la categoría principal seleccionada
  const availableSubFilters = useMemo(() => {
    if (activeMainFilter === 'all') return [];
    const tasksForMain = INITIAL_TASKS.filter(task => task.type === activeMainFilter);
    const subs = new Set(tasksForMain.map(t => t.subType).filter(Boolean));
    return Array.from(subs);
  }, [activeMainFilter]);

  // Aplicar doble filtro (Principal y Secundario)
  const filteredTasks = useMemo(() => {
    let tasks = INITIAL_TASKS;
    
    // 1. Filtro Principal
    if (activeMainFilter !== 'all') {
      tasks = tasks.filter(task => task.type === activeMainFilter);
      // 2. Filtro Secundario (Si aplica)
      if (activeSubFilter !== 'all') {
        tasks = tasks.filter(task => task.subType === activeSubFilter);
      }
    }
    
    // Ordenar cronológicamente para mantener el flujo
    return tasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [activeMainFilter, activeSubFilter]);

  // Manejador del filtro principal para resetear el secundario
  const handleMainFilterChange = (filterId) => {
    setActiveMainFilter(filterId);
    setActiveSubFilter('all'); // Resetea el subfiltro al cambiar de frente
  };

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
    const status = getStatus(selectedTask.progress);

    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 flex flex-col h-full sticky top-4 animate-fade-in">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
          <div className={`p-3 rounded-xl ${workType.color} text-white shadow-md`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] font-black tracking-widest uppercase ${isGLP ? 'text-red-500' : 'text-slate-500'}`}>
              {workType.label} • {selectedTask.subType}
            </span>
            <h2 className="text-lg font-bold text-slate-800 leading-tight mt-1">{selectedTask.title}</h2>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inicio</span>
              </div>
              <p className="font-bold text-slate-800 capitalize">{formatDate(selectedTask.startDate)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fin (Est.)</span>
              </div>
              <p className="font-bold text-slate-800 capitalize">{formatDate(selectedTask.endDate)}</p>
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
                <span className="text-xs font-black text-slate-800 text-right">{selectedTask.assignee}</span>
              </div>
              <div className="flex items-center justify-between p-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado Actual</span>
                <span className={`text-[11px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm
                  ${status === 'completado' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                    status === 'en_progreso' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                    'bg-slate-100 text-slate-500 border border-slate-200'}`}
                >
                  {status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- LÓGICA DE RENDERIZADO CON AGRUPACIÓN VISUAL ---
  // No agrupamos los datos, pero visualmente colocamos un separador para saber a qué SubCategoría pertenecen.
  let lastSubTypeRendered = null;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-[1600px] w-[98%] mx-auto space-y-4">
        
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-700"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">SOFTYS</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-widest rounded-full">Planta Cañete</span>
              </div>
              <h2 className="text-xl font-bold text-slate-700">Plan Maestro de Parada (Control Detallado)</h2>
            </div>
            
            <div className="flex gap-3">
              <div className="text-center px-6 py-3 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                <span className="block text-2xl font-black text-slate-600">
                  {INITIAL_TASKS.length}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actividades</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          
          <div className="lg:col-span-3 space-y-3">
            
            {/* FILTROS PRINCIPALES */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-2">
              <button 
                onClick={() => handleMainFilterChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeMainFilter === 'all' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Vista Maestra
              </button>
              {Object.values(WORK_TYPES).map(type => (
                <button
                  key={type.id}
                  onClick={() => handleMainFilterChange(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                    ${activeMainFilter === type.id 
                      ? `${type.color} text-white shadow-md` 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  <type.icon className={`w-4 h-4 ${activeMainFilter === type.id ? 'text-white' : type.color.replace('bg-', 'text-')}`} />
                  {type.label}
                </button>
              ))}
            </div>

            {/* FILTROS SECUNDARIOS (Dinámicos: Solo aparecen si hay un Frente seleccionado) */}
            {activeMainFilter !== 'all' && availableSubFilters.length > 0 && (
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-2 animate-fade-in">
                <Filter className="w-4 h-4 text-slate-400 mr-1" />
                <button 
                  onClick={() => setActiveSubFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeSubFilter === 'all' ? 'bg-slate-200 text-slate-800 shadow-inner' : 'bg-white text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                >
                  Todas las subcategorías
                </button>
                {availableSubFilters.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubFilter(sub)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border
                      ${activeSubFilter === sub 
                        ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                  
                  {/* Cabecera del Gantt */}
                  <div className="flex border-b border-slate-200 bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky top-0 z-30 shadow-sm">
                    <div className="w-[380px] p-4 border-r border-slate-200 flex items-center bg-slate-50 sticky left-0 z-20">
                      Listado Completo de Tareas ({filteredTasks.length})
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

                  {/* Cuerpo del Gantt */}
                  <div className="overflow-y-auto max-h-[700px] relative pb-20">
                    
                    <div className="absolute top-0 bottom-0 border-l-2 border-amber-500 z-0 pointer-events-none" 
                         style={{ left: `calc(380px + ((100% - 380px) / 9) * 4.5)` }}>
                        <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-b-md absolute -left-4 top-0 shadow-md">HOY</div>
                    </div>

                    {filteredTasks.map((task) => {
                      const position = calculatePosition(task.startDate, task.endDate);
                      const isSelected = selectedTask?.id === task.id;
                      const workColor = WORK_TYPES[task.type.toUpperCase()].color;
                      const isGLP = task.type === 'glp';
                      const status = getStatus(task.progress);
                      
                      // Lógica de separador visual por subCategoría (solo visible en "Todas las subcategorías")
                      let renderSeparator = false;
                      if (activeSubFilter === 'all' && task.subType !== lastSubTypeRendered) {
                        renderSeparator = true;
                        lastSubTypeRendered = task.subType;
                      }

                      return (
                        <React.Fragment key={task.id}>
                          {/* Separador Visual de SubCategoría */}
                          {renderSeparator && (
                            <div className="flex border-b border-slate-200 bg-slate-100/70">
                              <div className="w-[380px] px-4 py-2 border-r border-slate-200 sticky left-0 z-20 bg-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                {task.type.toUpperCase()} / <span className="text-slate-700">{task.subType}</span>
                              </div>
                              <div className="flex-1"></div>
                            </div>
                          )}

                          {/* Fila Individual de Tarea */}
                          <div 
                            onClick={() => setSelectedTask(task)}
                            className={`flex border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 group relative z-10
                              ${isSelected ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="w-[380px] p-3 border-r border-slate-100 flex items-center gap-3 bg-white group-hover:bg-slate-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.03)]">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 shadow-sm ${workColor} ${status === 'pendiente' ? 'opacity-30' : ''}`}></div>
                              <div className="min-w-0 flex-1">
                                <p className={`font-bold text-xs truncate ${isGLP ? 'text-slate-800' : 'text-slate-700'}`} title={task.title}>
                                  {task.title}
                                </p>
                                <div className="flex justify-between items-center mt-0.5">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                    {task.assignee}
                                  </p>
                                  <p className={`text-[9px] font-bold px-1.5 rounded ${status==='completado' ? 'text-emerald-600 bg-emerald-50' : status==='en_progreso' ? 'text-amber-600 bg-amber-50' : 'text-slate-400'}`}>
                                    {task.progress}%
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 relative py-2 bg-slate-50/20">
                              <div className="absolute inset-0 flex">
                                {[...Array(9)].map((_, i) => (
                                  <div key={i} className={`flex-1 border-r border-slate-100 border-dashed last:border-0 ${i === 4 ? 'bg-amber-50/20' : ''}`}></div>
                                ))}
                              </div>

                              <div 
                                className={`absolute h-6 rounded shadow-sm flex items-center justify-center text-[9px] font-black text-white transition-all duration-300 
                                  ${workColor} ${isSelected ? 'ring-2 ring-offset-1 ring-slate-400 shadow-md scale-[1.02] z-30' : 'opacity-85 hover:opacity-100 z-10'}`}
                                style={{ 
                                  left: position.left, 
                                  width: position.width,
                                  top: '50%',
                                  marginTop: '-12px',
                                  minWidth: '24px' 
                                }}
                              >
                                <div 
                                  className="absolute top-0 left-0 bottom-0 bg-black/20 rounded-l"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                                
                                {status === 'completado' && (
                                  <div className="absolute -right-1 -top-1 w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm flex items-center justify-center">
                                    <CheckCircle2 className="w-2 h-2 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {renderTaskDetails()}
          </div>

        </div>
      </div>
    </div>
  );
}