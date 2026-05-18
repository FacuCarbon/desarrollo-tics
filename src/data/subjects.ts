import { mobileFrontendModules, mobileFrontendQuestions } from './mobileFrontendContent'
import { quizQuestions as ticsQuestions, studyModules as ticsModules } from './ticsContent'
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
]

export function getStudySubject(subjectId: string | null) {
  return studySubjects.find((subject) => subject.id === subjectId) ?? null
}
