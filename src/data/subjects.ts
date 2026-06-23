import { mobileFrontendModules, mobileFrontendQuestions } from './mobileFrontendContent'
import { quizQuestions as ticsQuestions, studyModules as ticsModules } from './ticsContent'
import {
  ticsSecondPartialModules,
  ticsSecondPartialQuestions,
} from './ticsSecondPartialContent'
import type { StudySubject } from '../types/study'

export const studySubjects: StudySubject[] = [
  {
    id: 'tics',
    title: 'TICs, redes y Linux',
    shortLabel: 'TICs',
    description:
      'Repasa sociedad de la información, redes, protocolos, direccionamiento, Linux y ejercicios de comandos con el formato original del proyecto.',
    summaryPdf: '/resumen-tic.pdf',
    modules: ticsModules,
    questions: ticsQuestions,
  },
  {
    id: 'mobile-frontend',
    title: 'Desarrollo Mobile y Frontend',
    shortLabel: 'Mobile + Front',
    description:
      'Cubre teoría de APIs, JWT, JavaScript, stack híbrido, HTML y Git/GitHub, con explicaciones más profundas y mini exámenes mezclados.',
    summaryPdf: '/resumen-mobile-frontend.pdf',
    modules: mobileFrontendModules,
    questions: mobileFrontendQuestions,
    cheatSheetSections: [
      {
        title: 'APIs y HTTP',
        bullets: [
          'API = intermediario entre cliente y servidor.',
          'REST usa HTTP, recursos y normalmente JSON.',
          'GET obtiene, POST crea, PUT actualiza, DELETE elimina.',
          '401 = no autenticado, 403 = sin permisos.',
        ],
      },
      {
        title: 'JWT',
        bullets: [
          'Autenticación = quién sos. Autorización = qué podés hacer.',
          'JWT = header.payload.signature.',
          'Es stateless: no depende de sesión guardada por request.',
          'El payload puede leerse: no guardar datos sensibles.',
          'Access token para acceso; refresh token para renovar.',
        ],
      },
      {
        title: 'JavaScript y stack',
        bullets: [
          'JavaScript = lenguaje; Node.js = entorno de ejecución.',
          'ECMAScript = especificación.',
          'JS: alto nivel, interpretado, dinámico, débil, multiparadigma.',
          'Angular organiza lógica; Ionic aporta UI mobile; Capacitor conecta con hardware.',
        ],
      },
      {
        title: 'HTML',
        bullets: [
          'Base HTML5: doctype, html, head, body.',
          'HTML estructura, CSS estiliza, JavaScript agrega comportamiento.',
          'Etiquetas clave: h1-h6, p, a, img, ul, ol, table, form, iframe.',
          'Semánticas: header, nav, main, section, article, aside, footer.',
        ],
      },
      {
        title: 'Git y GitHub',
        bullets: [
          'Git = control de versiones. GitHub = remoto/plataforma.',
          'Flujo mínimo: git status -> git add -> git commit -m -> git push.',
          'Branch = rama paralela. Merge = unión. Conflicto = Git no puede decidir.',
          'SSH: la clave privada se protege; en Unix/Linux suele usarse chmod 600.',
          'Comandos básicos: pwd, ls, cd, mkdir, cp, mv, rm.',
        ],
      },
    ],
  },
  {
    id: 'tics-segundo-parcial',
    title: 'TICs - Segundo parcial',
    shortLabel: 'TICs 2P',
    description:
      'Prepara el segundo parcial por separado: Linux avanzado, comandos, arquitectura cliente-servidor, Apache y Docker con Compose, redes y volúmenes.',
    materialPdfs: [
      {
        title: 'Clase 04: Linux y arquitectura',
        description:
          'Kernel, shell, utilidades, distribuciones, usos de Linux y diferencia entre Open Source y Software Libre.',
        href: '/tics-segundo-clase-04-linux-arquitectura.pdf',
      },
      {
        title: 'Clase 05: comandos Linux',
        description:
          'Terminal, navegación, archivos, permisos, procesos, red, paquetes, compresión y redirecciones.',
        href: '/tics-segundo-clase-05-comandos-linux.pdf',
      },
      {
        title: 'Cliente-servidor y Apache',
        description:
          'Modelo cliente-servidor, servidor web Apache, instalación, systemctl, VirtualHost y estructura de configuración.',
        href: '/tics-segundo-cliente-servidor-apache.pdf',
      },
      {
        title: 'Docker I',
        description:
          'DevOps, contenedores, imágenes, Dockerfile, capas, registros, comandos básicos y comparación con máquinas virtuales.',
        href: '/tics-segundo-docker-i.pdf',
      },
      {
        title: 'Docker II',
        description:
          'Docker Compose, servicios, redes, volúmenes, aplicaciones multicontenedor y buenas prácticas de seguridad.',
        href: '/tics-segundo-docker-ii.pdf',
      },
      {
        title: 'Ejercicios Docker',
        description:
          'Guía rápida de puertos, variables, redes, volúmenes y prácticas con MySQL, Adminer y WordPress.',
        href: '/tics-segundo-ejercicios-docker.pdf',
      },
    ],
    modules: ticsSecondPartialModules,
    questions: ticsSecondPartialQuestions,
    cheatSheetSections: [
      {
        title: 'Linux',
        bullets: [
          'Kernel = núcleo que gestiona hardware, memoria, procesos, dispositivos y archivos.',
          'Shell = intérprete entre usuario y sistema; permite comandos, scripts y automatización.',
          'Distribución = kernel Linux + utilidades + aplicaciones + configuración.',
          'chmod cambia permisos; chown cambia propietario.',
        ],
      },
      {
        title: 'Apache',
        bullets: [
          'Cliente solicita, red transporta, servidor responde.',
          'Apache sirve recursos web por HTTP/HTTPS; no diseña la página.',
          '/etc/apache2/apache2.conf define reglas globales.',
          'sites-available guarda sitios disponibles; sites-enabled contiene los activos.',
          'VirtualHost define dominio, DocumentRoot, permisos y logs.',
        ],
      },
      {
        title: 'Docker base',
        bullets: [
          'Dockerfile = receta para construir imagen.',
          'Imagen = plantilla inmutable; contenedor = instancia en ejecución.',
          'docker run crea/inicia; docker ps lista; docker stop detiene; docker rm elimina.',
          '-p host:contenedor publica un servicio hacia la máquina anfitriona.',
        ],
      },
      {
        title: 'Compose, redes y volúmenes',
        bullets: [
          'Compose coordina servicios desde docker-compose.yml.',
          'Volumen = datos persistentes fuera del ciclo de vida del contenedor.',
          'Contenedores en la misma red se comunican por nombre de servicio o contenedor.',
          'Solo se publican puertos cuando el host debe acceder al servicio.',
        ],
      },
    ],
  },
]

export function getStudySubject(subjectId: string | null) {
  return studySubjects.find((subject) => subject.id === subjectId) ?? null
}
