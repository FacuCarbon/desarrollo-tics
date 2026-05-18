import type { QuizQuestion, StudyModule } from '../types/study'

export const mobileFrontendModules: StudyModule[] = [
  {
    id: 'apis-rest',
    title: 'APIs, REST, HTTP, JSON y Postman',
    shortLabel: 'APIs',
    summary:
      'Resume cómo se comunican cliente y servidor, por qué REST domina en desarrollo moderno y qué rol cumplen HTTP, JSON, endpoints y Postman.',
    focusAreas: [
      'API como contrato entre aplicaciones: define operaciones, datos esperados y forma de respuesta.',
      'Modelo cliente-servidor: el cliente pide, la API intermedia y el servidor procesa.',
      'REST como modelo liviano apoyado en HTTP y normalmente JSON.',
      'Métodos HTTP, endpoints, request, response y códigos de estado más comunes.',
    ],
    deepDive: [
      'Si te preguntan qué es una API, no alcanza con decir “conecta cosas”: conviene remarcar que organiza la comunicación con reglas concretas.',
      'REST no es solo “usar URLs”; también implica pensar recursos, métodos HTTP y stateless.',
      'Postman no forma parte del funcionamiento de la API, sino del trabajo de prueba y diagnóstico antes de integrar el frontend o la app mobile.',
    ],
    practiceTips: [
      'Explicá un flujo simple: app -> request HTTP -> API -> servidor -> response JSON.',
      'Memorizá la diferencia entre 401 y 403 porque suele entrar en preguntas teóricas.',
      'Prepará una comparación corta entre REST y SOAP sin irte a detalles innecesarios.',
    ],
    examples: [
      {
        title: 'Ejemplo de request HTTP desde frontend',
        language: 'javascript',
        description:
          'Sirve para relacionar API, endpoint, método HTTP y respuesta JSON con un caso concreto.',
        code: `fetch('https://api.ejemplo.com/usuarios', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log('Usuarios recibidos:', data)
  })
  .catch((error) => {
    console.error('Error al consumir la API:', error)
  })`,
      },
      {
        title: 'Ejemplo de JSON de respuesta',
        language: 'json',
        description:
          'Muestra el formato de intercambio de datos que domina en APIs REST.',
        code: `{
  "id": 14,
  "nombre": "Facundo",
  "rol": "estudiante",
  "activo": true
}`,
      },
    ],
  },
  {
    id: 'jwt-auth',
    title: 'JWT, Autenticación y Autorización',
    shortLabel: 'JWT',
    summary:
      'Explica por qué JWT se usa tanto en apps web y mobile, cómo funciona el modelo stateless y qué relación tiene con sesiones, cookies y permisos.',
    focusAreas: [
      'Diferencia entre autenticación y autorización.',
      'JWT como token firmado digitalmente que viaja entre cliente y servidor.',
      'Modelo stateless frente al modelo tradicional basado en sesiones y cookies.',
      'Header, payload, signature, access token, refresh token y seguridad básica.',
    ],
    deepDive: [
      'La firma digital garantiza integridad, no confidencialidad: el payload puede leerse y por eso no debe incluir datos sensibles.',
      'JWT aparece para mejorar escalabilidad y desacople en arquitecturas modernas, no porque las sesiones “estén mal” en todos los casos.',
      'Si te preguntan Bearer token, explicá que el cliente porta el token y lo envía en el header Authorization.',
    ],
    practiceTips: [
      'Ensayá la frase corta: autenticación = quién sos, autorización = qué podés hacer.',
      'Repasá el flujo completo de login con access token y refresh token.',
      'Practicá explicar por qué JWT se considera stateless usando tus propias palabras.',
    ],
    examples: [
      {
        title: 'Header HTTP con Bearer token',
        language: 'http',
        description:
          'Este es el formato más común para enviar un JWT en una petición protegida.',
        code: `GET /perfil HTTP/1.1
Host: api.ejemplo.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
      },
      {
        title: 'Payload típico de JWT',
        language: 'json',
        description:
          'Muestra claims habituales del token. Sirve para ver por qué no conviene guardar datos sensibles.',
        code: `{
  "sub": "usuario-42",
  "rol": "admin",
  "exp": 1760000000,
  "iss": "api-miapp"
}`,
      },
    ],
  },
  {
    id: 'javascript-core',
    title: 'JavaScript y ECMAScript',
    shortLabel: 'JS',
    summary:
      'Ordena la base teórica del lenguaje: origen, ECMAScript, motor de ejecución, tipado dinámico, multiparadigma y uso tanto en frontend como fuera del navegador.',
    focusAreas: [
      'Origen de JavaScript y relación con ECMAScript.',
      'Características: alto nivel, interpretado, tipado dinámico y débil, multiparadigma.',
      'Motores de JavaScript como V8, SpiderMonkey y JavaScriptCore.',
      'Diferencia entre el lenguaje JavaScript y el entorno Node.js.',
    ],
    deepDive: [
      'ECMAScript no es “otro lenguaje”: es la especificación formal que JavaScript implementa.',
      'Tipado dinámico no significa ausencia total de tipos, sino que el tipo puede cambiar en tiempo de ejecución.',
      'Node.js amplió el uso de JavaScript al backend, pero no reemplaza al lenguaje ni al navegador.',
    ],
    practiceTips: [
      'Prepará una definición corta de JavaScript sin caer en “sirve para páginas web” nada más.',
      'Tené una frase clara para diferenciar JavaScript de Node.js.',
      'Repasá ejemplos básicos de DOM, eventos y funciones para sostener respuestas teóricas con casos concretos.',
    ],
    examples: [
      {
        title: 'Evento y manipulación del DOM',
        language: 'javascript',
        description:
          'Conecta teoría de eventos, funciones y DOM con un ejemplo simple de interacción.',
        code: `const boton = document.getElementById('saludar')
const salida = document.getElementById('resultado')

boton?.addEventListener('click', () => {
  salida.textContent = 'Hola, el evento click disparó esta acción.'
})`,
      },
      {
        title: 'Función flecha y array',
        language: 'javascript',
        description:
          'Ayuda a repasar funciones flecha, arrays y callbacks, que aparecen en la teoría general.',
        code: `const notas = [7, 8, 10, 6]
const aprobadas = notas.filter((nota) => nota >= 7)

console.log(aprobadas)`,
      },
    ],
  },
  {
    id: 'hybrid-stack',
    title: 'Node.js, Angular, Ionic y Capacitor',
    shortLabel: 'Stack',
    summary:
      'Describe el entorno de trabajo del desarrollo híbrido: qué hace cada herramienta, cómo se complementan y por qué permiten construir apps mobile con tecnologías web.',
    focusAreas: [
      'Node.js como entorno de ejecución y npm como gestor de paquetes.',
      'Angular como framework para estructurar la lógica de la aplicación.',
      'Ionic como capa de interfaz adaptada a mobile.',
      'Capacitor como puente hacia funcionalidades nativas del dispositivo.',
    ],
    deepDive: [
      'Angular e Ionic no compiten: Angular organiza la aplicación y Ionic aporta componentes e interfaz mobile.',
      'Capacitor no es un lenguaje ni un framework visual; su valor está en acercar la app híbrida al hardware del dispositivo.',
      'Conviene poder explicar qué rol cumple cada herramienta y también qué no hace, porque esa distinción suele evaluarse.',
    ],
    practiceTips: [
      'Memorizá la fórmula: Angular = lógica, Ionic = UI mobile, Capacitor = acceso nativo.',
      'Repasá qué hacen ionic start e ionic serve como parte de la creación de proyecto.',
      'Asociá package.json y angular.json con la configuración general del proyecto.',
    ],
    examples: [
      {
        title: 'Comandos básicos del proyecto',
        language: 'bash',
        description:
          'Resume el flujo mínimo mencionado en clase para crear y levantar una app híbrida.',
        code: `ionic start miProyecto
cd miProyecto
ionic serve`,
      },
      {
        title: 'Estructura mínima de componente Angular',
        language: 'typescript',
        description:
          'No reemplaza la teoría completa, pero ayuda a visualizar la idea de componente.',
        code: `@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  titulo = 'Mi app híbrida'
}`,
      },
    ],
  },
  {
    id: 'html-basics',
    title: 'HTML y estructura del frontend',
    shortLabel: 'HTML',
    summary:
      'Agrupa la base estructural del frontend: HTML5, etiquetas comunes, listas, tablas, iframe, formularios, semántica, comentarios y validaciones nativas.',
    focusAreas: [
      'Estructura mínima de un documento HTML5.',
      'Etiquetas frecuentes: encabezados, párrafos, enlaces, imágenes, listas, tablas e iframe.',
      'Formularios y validaciones HTML5.',
      'Etiquetas semánticas como header, nav, main, section, article, aside y footer.',
      'Comentarios HTML para documentar bloques del documento.',
      'Diferencia entre estructura, estilo y comportamiento.',
    ],
    deepDive: [
      'HTML organiza el contenido; CSS lo presenta; JavaScript agrega comportamiento. Esa separación conviene poder decirla de memoria.',
      'Las etiquetas semánticas no son decoración: mejoran organización y comprensión del documento.',
      'Listas, tablas, formularios e iframe suelen aparecer en consignas prácticas, pero también pueden entrar como teoría básica de estructura.',
      'Las validaciones HTML5 ayudan desde el cliente, pero no reemplazan validación del lado del servidor.',
      'En preguntas teóricas suele valer más explicar para qué sirve cada grupo de etiquetas que recitar una lista infinita.',
    ],
    practiceTips: [
      'Repasá la estructura mínima de memoria: doctype, html, head y body.',
      'Tené presentes los atributos de validación required, minlength, maxlength, min y max.',
      'Asociá cada familia de etiquetas con una función: estructura, contenido, navegación, formularios o multimedia.',
      'Practicá detectar errores de cierre y anidado incorrecto, porque la guía trae ejercicios de corrección.',
      'Practicá nombrar un ejemplo donde HTML estructura, CSS estiliza y JS responde a un evento.',
    ],
    examples: [
      {
        title: 'Estructura HTML5 básica',
        language: 'html',
        description:
          'Representa la base mínima pedida en la guía: doctype, html, head y body.',
        code: `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi página</title>
  </head>
  <body>
    <h1>Bienvenidos</h1>
    <p>Este es un documento HTML5 básico.</p>
  </body>
</html>`,
      },
      {
        title: 'Ejemplo CSS simple',
        language: 'css',
        description:
          'Sirve para visualizar la separación entre estructura HTML y estilo CSS.',
        code: `body {
  font-family: sans-serif;
  background: #f4f7fb;
  color: #1e293b;
}

.card {
  max-width: 420px;
  margin: 32px auto;
  padding: 24px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
}`,
      },
      {
        title: 'HTML + CSS + JavaScript conectados',
        language: 'html',
        description:
          'Ejemplo corto para estudiar cómo cada tecnología aporta una parte distinta.',
        code: `<button id="saludar">Saludar</button>
<p id="mensaje"></p>

<script>
  const boton = document.getElementById('saludar')
  const mensaje = document.getElementById('mensaje')

  boton.addEventListener('click', () => {
    mensaje.textContent = 'HTML estructura, CSS estiliza y JS responde.'
  })
</script>`,
      },
      {
        title: 'Formulario HTML5 con validaciones',
        language: 'html',
        description:
          'Muestra controles básicos y atributos de validación que aparecen en la guía de ejercicios.',
        code: `<form>
  <label for="usuario">Usuario</label>
  <input id="usuario" type="text" required minlength="4" maxlength="12" />

  <label for="correo">Correo</label>
  <input id="correo" type="email" required placeholder="nombre@dominio.com" />

  <label for="edad">Edad</label>
  <input id="edad" type="number" min="18" max="99" />

  <button type="submit">Enviar</button>
</form>`,
      },
      {
        title: 'Estructura semántica simple',
        language: 'html',
        description:
          'Ayuda a visualizar cómo se organizan bloques semánticos dentro de una página.',
        code: `<header>Encabezado del sitio</header>
<nav>Menú principal</nav>
<main>
  <section>
    <article>Contenido principal</article>
  </section>
  <aside>Contenido complementario</aside>
</main>
<footer>Pie de página</footer>`,
      },
    ],
  },
  {
    id: 'git-github',
    title: 'Git y GitHub',
    shortLabel: 'Git',
    summary:
      'Reúne los conceptos de control de versiones y trabajo colaborativo: repositorio, commit, historial, ramas, merge, conflictos, remoto, autenticación SSH y flujo básico de terminal.',
    focusAreas: [
      'Git como sistema de control de versiones.',
      'GitHub como plataforma remota para alojar y compartir repositorios Git.',
      'Commit, branch, merge, conflicto y clonación.',
      'Flujo local-remoto: add, commit, push, pull y remote origin.',
      'Autenticación con clave SSH y permisos seguros sobre la clave privada.',
      'Activación del agente SSH y carga de clave con eval, ssh-agent y ssh-add.',
      'Comandos de versionado e inspección: init, status, diff, log, history, restore y reset.',
      'Trabajo con ramas e integración: branch, checkout, merge, rebase y cherry-pick.',
      'Comandos básicos de archivos y navegación: pwd, ls, cd, mkdir, cp, mv, rm.',
      'Importancia de mensajes claros y evidencia real del proceso de trabajo.',
    ],
    deepDive: [
      'Git y GitHub no son sinónimos: uno es la herramienta de versionado y el otro la plataforma de colaboración.',
      'Una rama permite trabajar en paralelo sin tocar de inmediato la línea principal.',
      'Un conflicto no es un error del programa: es una situación donde Git necesita intervención humana para decidir qué cambio conservar.',
      'La clave SSH pública se comparte con GitHub; la privada queda en tu equipo y por eso necesita permisos restrictivos.',
      'eval "$(ssh-agent -s)" levanta el agente SSH en la sesión actual y ssh-add carga la clave privada para firmar autenticación contra GitHub.',
      'git add prepara cambios para el próximo commit; git commit registra una foto lógica de esos cambios; git push envía esa historia al remoto.',
      'git restore recupera archivos sin confirmar; git reset mueve HEAD o reconfigura el staging según el modo usado; git revert crea un commit inverso sin borrar historial.',
      'merge integra historias; rebase reescribe la base de una rama; cherry-pick trae commits puntuales sin fusionar toda una rama.',
      'Los comandos de archivos no son “de Git”, pero se usan todo el tiempo alrededor del repositorio para crear, mover o inspeccionar contenido.',
    ],
    practiceTips: [
      'Ensayá una explicación corta de branch y merge usando un ejemplo real de cambio en una página.',
      'Memorizá la diferencia entre repositorio local y remoto.',
      'Practicá de memoria el flujo mínimo: git status -> git add -> git commit -m -> git push.',
      'Asociá chmod 600 con protección de la clave privada SSH en sistemas tipo Unix/Linux.',
      'Memorizá también el encendido del agente: eval "$(ssh-agent -s)" -> ssh-add ~/.ssh/id_ed25519.',
      'Separá mentalmente comandos de inspección, comandos de integración y comandos potencialmente riesgosos como reset.',
      'Repasá qué hace cada comando de archivos antes de usar comandos destructivos como rm.',
      'Repasá por qué el profesor insiste con commits descriptivos y evidencia de merges.',
    ],
    examples: [
      {
        title: 'Flujo básico de trabajo con Git',
        language: 'bash',
        description:
          'Resume el camino más típico desde revisar cambios hasta subirlos al remoto.',
        code: `git status
git add .
git commit -m "Agrega módulo de JWT"
git push origin main`,
      },
      {
        title: 'Vincular repositorio remoto con SSH',
        language: 'bash',
        description:
          'Sirve para visualizar cómo se asocia el repo local con GitHub usando la URL SSH.',
        code: `git remote add origin git@github.com:usuario/preparador-parciales.git
git branch -M main
git push -u origin main`,
      },
      {
        title: 'Permisos seguros para la clave privada SSH',
        language: 'bash',
        description:
          'En sistemas Unix/Linux se restringe el acceso a la clave privada para evitar que otros usuarios puedan leerla.',
        code: `chmod 600 ~/.ssh/id_ed25519`,
      },
      {
        title: 'Levantar el agente SSH y cargar la clave',
        language: 'bash',
        description:
          'Este flujo suele usarse cuando querés autenticarte con GitHub por SSH dentro de la sesión actual.',
        code: `eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519`,
      },
      {
        title: 'Comandos básicos de archivos y navegación',
        language: 'bash',
        description:
          'Estos comandos suelen aparecer junto a Git porque se usan para moverse y preparar archivos dentro del proyecto.',
        code: `pwd
ls
cd src
mkdir componentes
cp origen.txt copia.txt
mv viejo.txt nuevo.txt
rm archivo.txt`,
      },
      {
        title: 'Comandos Git de inspección e historial',
        language: 'bash',
        description:
          'Agrupa consultas frecuentes para ver estado, diferencias e historial del repositorio.',
        code: `git init
git status
git diff
git log --oneline
history`,
      },
      {
        title: 'Ramas e integración',
        language: 'bash',
        description:
          'Muestra un flujo corto para crear rama, cambiar de rama e integrar cambios.',
        code: `git branch feature/login
git checkout feature/login
git checkout main
git merge feature/login`,
      },
      {
        title: 'Otros comandos útiles del flujo',
        language: 'bash',
        description:
          'Estos comandos aparecen cuando querés actualizarte, traer un commit puntual o recuperar cambios.',
        code: `git pull origin main
git restore src/App.tsx
git cherry-pick a1b2c3d
git reset --soft HEAD~1
git revert a1b2c3d
git remote -v`,
      },
    ],
  },
]

export const mobileFrontendQuestions: QuizQuestion[] = [
  {
    id: 'api-1',
    moduleId: 'apis-rest',
    prompt: '¿Qué idea describe mejor a una API dentro de una aplicación moderna?',
    options: [
      {
        id: 'a',
        text: 'Es una base de datos a la que accede directamente el usuario.',
        explanation:
          'La API no es la base de datos: actúa como intermediaria entre cliente y servidor.',
      },
      {
        id: 'b',
        text: 'Es un contrato que organiza cómo dos sistemas se comunican.',
        explanation:
          'Esa definición resume bien su función: establecer reglas, datos esperados y forma de respuesta.',
      },
      {
        id: 'c',
        text: 'Es únicamente un programa para diseñar interfaces visuales.',
        explanation:
          'Una API no se define por diseñar interfaz; su foco es la comunicación entre sistemas.',
      },
      {
        id: 'd',
        text: 'Es un reemplazo completo del servidor.',
        explanation:
          'La API no reemplaza al servidor: lo expone de forma controlada.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Correcto. Lo importante es remarcar que una API no es “cualquier conexión”, sino una interfaz con reglas precisas entre aplicaciones.',
    incorrectFeedback:
      'La respuesta correcta era la del contrato entre sistemas. En examen conviene destacar que la API define operaciones, datos y formato de respuesta.',
  },
  {
    id: 'api-2',
    moduleId: 'apis-rest',
    prompt: '¿Por qué REST se volvió el estándar dominante en frontend web y aplicaciones mobile?',
    options: [
      {
        id: 'a',
        text: 'Porque obliga a usar XML y protocolos complejos.',
        explanation:
          'Eso se parece más al enfoque de SOAP, no a REST.',
      },
      {
        id: 'b',
        text: 'Porque es liviano, flexible y aprovecha HTTP y JSON.',
        explanation:
          'Esa combinación reduce complejidad y facilita integración entre clientes y servidores.',
      },
      {
        id: 'c',
        text: 'Porque solo funciona dentro del navegador.',
        explanation:
          'REST no se limita al navegador; cualquier cliente puede consumir una API REST.',
      },
      {
        id: 'd',
        text: 'Porque reemplaza por completo a los servidores.',
        explanation:
          'REST organiza la comunicación con el servidor, no lo reemplaza.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Bien. REST ganó lugar por apoyarse en tecnologías ampliamente usadas, ser simple de integrar y escalar bien en sistemas modernos.',
    incorrectFeedback:
      'La clave estaba en su ligereza y flexibilidad sobre HTTP y JSON. No depende de XML ni reemplaza al servidor.',
  },
  {
    id: 'api-3',
    moduleId: 'apis-rest',
    prompt: '¿Qué diferencia importante hay entre 401 y 403 en una API?',
    options: [
      {
        id: 'a',
        text: '401 es error del servidor y 403 es error del cliente.',
        explanation:
          'Ambos están en la familia 4XX, así que no es esa la diferencia.',
      },
      {
        id: 'b',
        text: '401 indica falta de autenticación válida y 403 falta de permisos.',
        explanation:
          'Esa distinción es muy usada en autenticación y autorización.',
      },
      {
        id: 'c',
        text: '401 se usa para crear recursos y 403 para eliminarlos.',
        explanation:
          'Los códigos HTTP no indican operaciones CRUD de esa forma.',
      },
      {
        id: 'd',
        text: 'No hay diferencia real; son equivalentes.',
        explanation:
          'No son equivalentes: cada uno comunica una situación distinta.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Exacto. 401 apunta a autenticación inválida o ausente; 403 implica que el usuario existe o fue reconocido, pero no tiene permiso suficiente.',
    incorrectFeedback:
      'La diferencia correcta era autenticación frente a autorización. Esa distinción conviene tenerla muy firme porque aparece seguido.',
  },
  {
    id: 'jwt-1',
    moduleId: 'jwt-auth',
    prompt: '¿Qué diferencia conceptual hay entre autenticación y autorización?',
    options: [
      {
        id: 'a',
        text: 'Autenticación verifica quién sos y autorización define qué podés hacer.',
        explanation:
          'Esa es la separación central y una de las más importantes para examen.',
      },
      {
        id: 'b',
        text: 'Autenticación crea bases de datos y autorización genera interfaces.',
        explanation:
          'Eso no tiene relación con estos conceptos.',
      },
      {
        id: 'c',
        text: 'Autenticación y autorización significan exactamente lo mismo.',
        explanation:
          'No son sinónimos: una identifica y la otra otorga permisos.',
      },
      {
        id: 'd',
        text: 'Autenticación solo se usa en Linux y autorización solo en APIs.',
        explanation:
          'Ambos conceptos atraviesan muchos sistemas, no solo un entorno específico.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Esa frase corta conviene memorizarla: autenticación identifica; autorización habilita acciones o recursos.',
    incorrectFeedback:
      'La respuesta correcta separaba identidad y permisos. Si en parcial mezclás esos conceptos, se desordena toda la explicación de JWT.',
  },
  {
    id: 'jwt-2',
    moduleId: 'jwt-auth',
    prompt: '¿Qué significa que JWT sea un mecanismo stateless?',
    options: [
      {
        id: 'a',
        text: 'Que el servidor nunca valida nada.',
        explanation:
          'Al contrario: el servidor valida firma, expiración y claims del token.',
      },
      {
        id: 'b',
        text: 'Que cada request puede procesarse sin depender de una sesión almacenada.',
        explanation:
          'Esa es la idea clave del enfoque stateless con tokens.',
      },
      {
        id: 'c',
        text: 'Que el token no tiene fecha de vencimiento.',
        explanation:
          'La expiración es habitual y recomendada; no se relaciona con la definición de stateless.',
      },
      {
        id: 'd',
        text: 'Que el cliente nunca guarda información local.',
        explanation:
          'El cliente suele guardar el token; eso no contradice el modelo stateless.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Muy bien. Stateless significa que el servidor no necesita reconstruir una sesión guardada para cada request; valida lo que llega en el token.',
    incorrectFeedback:
      'La idea correcta era independencia respecto de sesiones almacenadas. No significa ausencia de validación ni ausencia de vencimiento.',
  },
  {
    id: 'jwt-3',
    moduleId: 'jwt-auth',
    prompt: '¿Qué afirmación es correcta sobre el payload de un JWT?',
    options: [
      {
        id: 'a',
        text: 'Está cifrado por defecto, así que puede guardar contraseñas sin problema.',
        explanation:
          'Eso es falso y peligroso: el payload se puede decodificar fácilmente.',
      },
      {
        id: 'b',
        text: 'Puede leerse, por eso no conviene guardar datos sensibles.',
        explanation:
          'Esa es una de las advertencias más importantes del tema.',
      },
      {
        id: 'c',
        text: 'Solo contiene el algoritmo de firma.',
        explanation:
          'Eso corresponde al header, no al payload.',
      },
      {
        id: 'd',
        text: 'No influye en autorización ni expiración.',
        explanation:
          'El payload puede incluir roles, permisos y expiración, así que sí influye.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Exacto. JWT protege integridad mediante firma, pero no debe confundirse con cifrado del contenido.',
    incorrectFeedback:
      'La respuesta correcta recordaba que el payload puede leerse. Por eso nunca conviene guardar contraseñas ni datos sensibles ahí.',
  },
  {
    id: 'js-1',
    moduleId: 'javascript-core',
    prompt: '¿Qué relación hay entre JavaScript y ECMAScript?',
    options: [
      {
        id: 'a',
        text: 'ECMAScript es un navegador y JavaScript es un plugin.',
        explanation:
          'No se trata de un navegador ni de un plugin.',
      },
      {
        id: 'b',
        text: 'ECMAScript es la especificación y JavaScript una implementación de esa especificación.',
        explanation:
          'Esa relación teórica está planteada de forma directa en el material.',
      },
      {
        id: 'c',
        text: 'Son dos nombres distintos para sistemas operativos.',
        explanation:
          'No tienen relación con sistemas operativos.',
      },
      {
        id: 'd',
        text: 'JavaScript reemplazó a ECMAScript en 2015.',
        explanation:
          'No hubo reemplazo: ECMAScript sigue siendo la especificación.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Bien. Esa distinción ordena mucho la teoría: ECMAScript describe cómo debe funcionar el lenguaje y JavaScript lo implementa.',
    incorrectFeedback:
      'La respuesta correcta era la de especificación e implementación. Si te confunden esos términos, perdés la base conceptual del tema.',
  },
  {
    id: 'js-2',
    moduleId: 'javascript-core',
    prompt: '¿Qué significa que JavaScript tenga tipado dinámico y débil?',
    options: [
      {
        id: 'a',
        text: 'Que las variables pueden cambiar de tipo y existen conversiones implícitas.',
        explanation:
          'Esa explicación junta bien las dos ideas principales del material.',
      },
      {
        id: 'b',
        text: 'Que no existen tipos de datos en ningún momento.',
        explanation:
          'Sí existen tipos; lo que cambia es cómo se manejan en tiempo de ejecución.',
      },
      {
        id: 'c',
        text: 'Que JavaScript solo funciona con texto.',
        explanation:
          'JavaScript maneja muchos tipos, no solo strings.',
      },
      {
        id: 'd',
        text: 'Que solo puede ejecutarse en servidores.',
        explanation:
          'Eso no tiene relación con el tipado.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Dinámico habla del cambio de tipo en tiempo de ejecución; débil, de ciertas conversiones automáticas del lenguaje.',
    incorrectFeedback:
      'La respuesta correcta ligaba cambio de tipo y conversiones implícitas. No significa que el lenguaje carezca totalmente de tipos.',
  },
  {
    id: 'js-3',
    moduleId: 'javascript-core',
    prompt: '¿Cuál es la diferencia conceptual entre JavaScript y Node.js?',
    options: [
      {
        id: 'a',
        text: 'JavaScript es el lenguaje y Node.js es un entorno para ejecutarlo fuera del navegador.',
        explanation:
          'Esa es la comparación central que conviene saber decir sin vueltas.',
      },
      {
        id: 'b',
        text: 'Node.js es un lenguaje nuevo que reemplaza a JavaScript.',
        explanation:
          'Node.js no reemplaza el lenguaje; lo usa.',
      },
      {
        id: 'c',
        text: 'JavaScript solo sirve para frontend y Node.js solo para bases de datos.',
        explanation:
          'Node.js puede intervenir en backend, pero esa formulación es incorrecta y reducida.',
      },
      {
        id: 'd',
        text: 'No hay diferencia real entre ambos términos.',
        explanation:
          'Sí la hay: uno es lenguaje y el otro entorno.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Muy bien. Esa distinción aparece muchísimo: JavaScript es el lenguaje; Node.js es una plataforma para ejecutarlo fuera del navegador.',
    incorrectFeedback:
      'La respuesta correcta separaba lenguaje y entorno de ejecución. Conviene poder decirlo en una sola frase clara.',
  },
  {
    id: 'stack-1',
    moduleId: 'hybrid-stack',
    prompt: '¿Qué rol cumple Angular dentro del stack híbrido visto en clase?',
    options: [
      {
        id: 'a',
        text: 'Organiza la lógica y estructura de la aplicación mediante componentes.',
        explanation:
          'Ese es su papel central dentro del proyecto.',
      },
      {
        id: 'b',
        text: 'Reemplaza al hardware del teléfono.',
        explanation:
          'Angular no interactúa de esa manera con el hardware.',
      },
      {
        id: 'c',
        text: 'Es un editor de código.',
        explanation:
          'Eso correspondería a VS Code, no a Angular.',
      },
      {
        id: 'd',
        text: 'Es el protocolo usado por las APIs REST.',
        explanation:
          'Los protocolos no se confunden con frameworks frontend.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Angular se encarga de ordenar cómo funciona la aplicación, no de la capa visual mobile por sí sola.',
    incorrectFeedback:
      'La respuesta correcta era la vinculada a componentes, estructura y lógica. Angular no es editor, hardware ni protocolo.',
  },
  {
    id: 'stack-2',
    moduleId: 'hybrid-stack',
    prompt: '¿Qué diferencia principal hay entre Ionic y Angular según el material?',
    options: [
      {
        id: 'a',
        text: 'Ionic se ocupa más de la interfaz mobile y Angular de la lógica y estructura.',
        explanation:
          'Esa complementariedad es una de las ideas más repetidas en la presentación.',
      },
      {
        id: 'b',
        text: 'Ionic reemplaza completamente a Angular en todos los proyectos.',
        explanation:
          'El material aclara justamente que no compiten ni se reemplazan.',
      },
      {
        id: 'c',
        text: 'Angular se usa solo para escribir HTML y Ionic solo para bases de datos.',
        explanation:
          'Esa división es incorrecta.',
      },
      {
        id: 'd',
        text: 'No hay ninguna diferencia; son sinónimos.',
        explanation:
          'No son sinónimos y cumplen roles distintos.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. Una forma rápida de recordarlo es: Angular hace funcionar la app; Ionic la hace verse y sentirse mobile.',
    incorrectFeedback:
      'La respuesta correcta separaba interfaz y lógica. El material insiste en que Angular e Ionic se complementan, no se reemplazan.',
  },
  {
    id: 'stack-3',
    moduleId: 'hybrid-stack',
    prompt: '¿Para qué sirve Capacitor en una aplicación híbrida?',
    options: [
      {
        id: 'a',
        text: 'Para conectar la app con funciones nativas como cámara o GPS.',
        explanation:
          'Esa es la función práctica central de Capacitor.',
      },
      {
        id: 'b',
        text: 'Para reemplazar a GitHub en el versionado del proyecto.',
        explanation:
          'Capacitor no tiene relación con control de versiones.',
      },
      {
        id: 'c',
        text: 'Para dibujar tablas HTML automáticamente.',
        explanation:
          'No es una herramienta de maquetado HTML.',
      },
      {
        id: 'd',
        text: 'Para firmar tokens JWT del lado del servidor.',
        explanation:
          'Eso no corresponde al rol de Capacitor.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Capacitor funciona como puente entre la app hecha con tecnologías web y capacidades nativas del dispositivo.',
    incorrectFeedback:
      'La respuesta correcta era la del acceso a funciones nativas. Capacitor no administra Git, HTML ni autenticación del servidor.',
  },
  {
    id: 'html-1',
    moduleId: 'html-basics',
    prompt: '¿Qué estructura mínima debería tener un documento HTML5?',
    options: [
      {
        id: 'a',
        text: 'doctype, html, head y body',
        explanation:
          'Esa es la base estructural que la guía trabaja desde el primer ejercicio.',
      },
      {
        id: 'b',
        text: 'Solo body y script',
        explanation:
          'Eso deja afuera partes esenciales del documento.',
      },
      {
        id: 'c',
        text: 'header, footer y nav únicamente',
        explanation:
          'Esas etiquetas pueden aparecer dentro del body, pero no reemplazan la estructura mínima.',
      },
      {
        id: 'd',
        text: 'html y css son suficientes',
        explanation:
          'CSS no reemplaza la estructura básica del documento.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Esa estructura mínima conviene tenerla de memoria porque suele ser punto de partida para cualquier consigna HTML.',
    incorrectFeedback:
      'La respuesta correcta era doctype, html, head y body. Las demás opciones mezclaban etiquetas parciales o tecnologías distintas.',
  },
  {
    id: 'html-2',
    moduleId: 'html-basics',
    prompt: '¿Cuál es la diferencia conceptual entre HTML, CSS y JavaScript?',
    options: [
      {
        id: 'a',
        text: 'HTML estructura, CSS presenta y JavaScript agrega comportamiento.',
        explanation:
          'Esa es la triada clásica que conviene poder explicar con claridad.',
      },
      {
        id: 'b',
        text: 'HTML programa, CSS almacena datos y JavaScript enruta paquetes.',
        explanation:
          'Esa descripción mezcla funciones que no corresponden.',
      },
      {
        id: 'c',
        text: 'Los tres hacen exactamente lo mismo.',
        explanation:
          'Tienen roles distintos dentro de una aplicación web.',
      },
      {
        id: 'd',
        text: 'CSS reemplaza a HTML y JavaScript.',
        explanation:
          'CSS no reemplaza ni estructura ni lógica.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Muy bien. Esa separación conceptual es simple, pero muy útil para ordenar cualquier explicación de frontend.',
    incorrectFeedback:
      'La respuesta correcta separaba estructura, estilo y comportamiento. Esa tríada es básica y conviene dominarla de memoria.',
  },
  {
    id: 'html-3',
    moduleId: 'html-basics',
    prompt: '¿Para qué sirven atributos como required, minlength o max en un formulario HTML5?',
    options: [
      {
        id: 'a',
        text: 'Para aplicar validaciones nativas sobre los campos del formulario.',
        explanation:
          'Esos atributos permiten validar entrada sin lógica adicional compleja.',
      },
      {
        id: 'b',
        text: 'Para reemplazar completamente a la base de datos.',
        explanation:
          'La validación del formulario no reemplaza almacenamiento ni persistencia.',
      },
      {
        id: 'c',
        text: 'Para cambiar la dirección IP del navegador.',
        explanation:
          'No tienen ninguna relación con red.',
      },
      {
        id: 'd',
        text: 'Para convertir automáticamente HTML en una API REST.',
        explanation:
          'No existe esa función en atributos de formulario.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Son validaciones propias de HTML5 que ayudan a controlar la entrada de datos desde el lado del cliente.',
    incorrectFeedback:
      'La respuesta correcta era la de validación nativa. No tienen relación con APIs, red ni bases de datos.',
  },
  {
    id: 'html-4',
    moduleId: 'html-basics',
    prompt: '¿Para qué sirven etiquetas semánticas como header, nav, main o footer?',
    options: [
      {
        id: 'a',
        text: 'Para organizar y describir mejor la estructura del contenido.',
        explanation:
          'Esa es la idea principal: aportar significado estructural al documento.',
      },
      {
        id: 'b',
        text: 'Para reemplazar completamente a CSS.',
        explanation:
          'Las etiquetas semánticas no reemplazan estilo ni presentación.',
      },
      {
        id: 'c',
        text: 'Para convertir una página en API REST.',
        explanation:
          'No tienen ninguna relación con APIs.',
      },
      {
        id: 'd',
        text: 'Para ejecutar JavaScript sin script.',
        explanation:
          'No cumplen esa función.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Las etiquetas semánticas ordenan mejor el contenido y hacen más clara la intención estructural de cada bloque.',
    incorrectFeedback:
      'La respuesta correcta apuntaba a estructura y significado. No son una herramienta de estilo ni de lógica.',
  },
  {
    id: 'html-5',
    moduleId: 'html-basics',
    prompt: '¿Qué diferencia general hay entre una lista ul y una lista ol?',
    options: [
      {
        id: 'a',
        text: 'ul es desordenada y ol es ordenada.',
        explanation:
          'Esa es la diferencia básica entre ambas estructuras.',
      },
      {
        id: 'b',
        text: 'ul se usa para imágenes y ol para enlaces.',
        explanation:
          'No describen funciones de imágenes o enlaces.',
      },
      {
        id: 'c',
        text: 'ul reemplaza a table y ol a form.',
        explanation:
          'Listas, tablas y formularios cumplen funciones distintas.',
      },
      {
        id: 'd',
        text: 'No hay diferencia real entre ambas.',
        explanation:
          'Sí hay diferencia: una expresa secuencia/orden y la otra no.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. `ul` representa una lista sin orden específico y `ol` una lista con secuencia u orden marcado.',
    incorrectFeedback:
      'La respuesta correcta era la diferencia entre desordenada y ordenada. Es una base simple, pero importante.',
  },
  {
    id: 'html-6',
    moduleId: 'html-basics',
    prompt: '¿Para qué sirve un iframe en HTML?',
    options: [
      {
        id: 'a',
        text: 'Para incrustar otro contenido o documento dentro de la página.',
        explanation:
          'Ese uso aparece en la guía con el ejemplo del mapa.',
      },
      {
        id: 'b',
        text: 'Para validar formularios automáticamente.',
        explanation:
          'La validación de formularios usa otros mecanismos.',
      },
      {
        id: 'c',
        text: 'Para reemplazar a JavaScript en eventos.',
        explanation:
          'iframe no cumple ese rol.',
      },
      {
        id: 'd',
        text: 'Para compilar CSS a HTML.',
        explanation:
          'No existe esa función en iframe.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. Un iframe permite mostrar contenido externo o embebido dentro de la misma página.',
    incorrectFeedback:
      'La respuesta correcta era la de incrustar otro contenido. En la guía aparece con un mapa, que es un caso clásico.',
  },
  {
    id: 'git-1',
    moduleId: 'git-github',
    prompt: '¿Qué diferencia hay entre Git y GitHub?',
    options: [
      {
        id: 'a',
        text: 'Git es el sistema de control de versiones y GitHub una plataforma para alojar repositorios Git.',
        explanation:
          'Esa es la diferencia central que conviene poder dar sin dudar.',
      },
      {
        id: 'b',
        text: 'Git es para frontend y GitHub para backend.',
        explanation:
          'La división por capa no aplica a estas herramientas.',
      },
      {
        id: 'c',
        text: 'Git y GitHub son dos nombres del mismo programa local.',
        explanation:
          'No son lo mismo ni viven necesariamente en el mismo entorno.',
      },
      {
        id: 'd',
        text: 'GitHub reemplaza a los commits dentro de Git.',
        explanation:
          'GitHub se apoya en commits Git; no los reemplaza.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Si te piden una diferencia corta, esa fórmula suele alcanzar: Git versiona; GitHub aloja y comparte.',
    incorrectFeedback:
      'La respuesta correcta era la que separa herramienta de versionado y plataforma remota. No son sinónimos.',
  },
  {
    id: 'git-2',
    moduleId: 'git-github',
    prompt: '¿Para qué sirve una branch o rama en Git?',
    options: [
      {
        id: 'a',
        text: 'Para trabajar cambios en paralelo sin tocar directamente la línea principal.',
        explanation:
          'Ese aislamiento de trabajo es una de las razones principales para usar ramas.',
      },
      {
        id: 'b',
        text: 'Para convertir automáticamente el proyecto en PDF.',
        explanation:
          'Las ramas no tienen esa función.',
      },
      {
        id: 'c',
        text: 'Para reemplazar el historial de commits.',
        explanation:
          'El historial sigue existiendo; la rama organiza una línea de trabajo.',
      },
      {
        id: 'd',
        text: 'Para editar la base de datos del servidor.',
        explanation:
          'No tiene relación con bases de datos del servidor.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Una rama te permite desarrollar o probar cambios sin afectar de inmediato la rama principal.',
    incorrectFeedback:
      'La idea correcta era trabajo paralelo y aislado. Esa es la lógica detrás de branch antes de hacer merge.',
  },
  {
    id: 'git-3',
    moduleId: 'git-github',
    prompt: '¿Qué significa que haya un conflicto al hacer merge?',
    options: [
      {
        id: 'a',
        text: 'Que Git no puede decidir automáticamente qué cambio conservar.',
        explanation:
          'Eso obliga a una resolución manual por parte de quien integra los cambios.',
      },
      {
        id: 'b',
        text: 'Que el repositorio fue borrado para siempre.',
        explanation:
          'Un conflicto no implica destrucción del repositorio.',
      },
      {
        id: 'c',
        text: 'Que GitHub dejó de funcionar en internet.',
        explanation:
          'No es un problema del servicio remoto sino de integración de cambios.',
      },
      {
        id: 'd',
        text: 'Que ya no se pueden hacer más commits.',
        explanation:
          'Tras resolver el conflicto, se puede continuar trabajando normalmente.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. Un conflicto indica que Git necesita intervención humana para elegir o combinar cambios incompatibles.',
    incorrectFeedback:
      'La respuesta correcta era la incapacidad de Git para resolver automáticamente qué versión dejar. No significa pérdida total del repo.',
  },
  {
    id: 'git-4',
    moduleId: 'git-github',
    prompt: '¿Qué hace exactamente `git add` dentro del flujo de trabajo?',
    options: [
      {
        id: 'a',
        text: 'Prepara cambios para que formen parte del próximo commit.',
        explanation:
          'Esa es la función del staging area: seleccionar qué cambios pasan al commit siguiente.',
      },
      {
        id: 'b',
        text: 'Envía inmediatamente los cambios a GitHub.',
        explanation:
          'Eso corresponde a push, no a add.',
      },
      {
        id: 'c',
        text: 'Borra archivos viejos del repositorio.',
        explanation:
          'git add no se usa para borrar por sí mismo.',
      },
      {
        id: 'd',
        text: 'Cambia el nombre de la rama actual.',
        explanation:
          'Renombrar ramas es otra operación distinta.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. `git add` pasa cambios al área de preparación para decidir qué se incluirá en el próximo commit.',
    incorrectFeedback:
      'La idea central era la preparación de cambios. `git add` no sube nada al remoto ni reemplaza al commit.',
  },
  {
    id: 'git-5',
    moduleId: 'git-github',
    prompt: '¿Qué diferencia principal hay entre `git commit` y `git push`?',
    options: [
      {
        id: 'a',
        text: 'commit registra cambios en el repo local y push los envía al remoto.',
        explanation:
          'Esa diferencia entre historia local y publicación remota es básica y muy importante.',
      },
      {
        id: 'b',
        text: 'commit crea carpetas y push las elimina.',
        explanation:
          'No describen operaciones sobre carpetas.',
      },
      {
        id: 'c',
        text: 'commit y push hacen exactamente lo mismo.',
        explanation:
          'No son equivalentes; se ejecutan en momentos distintos del flujo.',
      },
      {
        id: 'd',
        text: 'push solo sirve para cambiar permisos SSH.',
        explanation:
          'Push no gestiona permisos de claves.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Muy bien. El commit deja asentada una versión en tu historial local; push publica esa historia en el remoto.',
    incorrectFeedback:
      'La respuesta correcta separaba registro local y envío remoto. Esa diferencia conviene tenerla totalmente clara.',
  },
  {
    id: 'git-6',
    moduleId: 'git-github',
    prompt: '¿Por qué se recomienda restringir permisos de la clave privada SSH con `chmod 600`?',
    options: [
      {
        id: 'a',
        text: 'Porque la clave privada debe quedar accesible solo para su dueño.',
        explanation:
          'Ese permiso reduce exposición y evita que otros usuarios del sistema puedan leerla.',
      },
      {
        id: 'b',
        text: 'Porque así Git crea commits más rápidos.',
        explanation:
          'Los permisos de la clave no aceleran commits.',
      },
      {
        id: 'c',
        text: 'Porque GitHub exige que la clave pública sea secreta.',
        explanation:
          'La clave pública es justamente la que se comparte; la privada es la sensible.',
      },
      {
        id: 'd',
        text: 'Porque chmod 600 convierte HTTPS en SSH.',
        explanation:
          'El comando no cambia el protocolo remoto.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. La clave privada SSH no debe quedar legible por otros usuarios del sistema; por eso se usan permisos restrictivos.',
    incorrectFeedback:
      'La respuesta correcta apuntaba a la protección de la clave privada. La pública se comparte; la privada se resguarda.',
  },
  {
    id: 'git-7',
    moduleId: 'git-github',
    prompt: 'Si necesitás ver en qué carpeta estás parado dentro del proyecto, ¿qué comando es el más directo?',
    options: [
      {
        id: 'a',
        text: 'pwd',
        explanation:
          'pwd muestra el directorio actual y es uno de los comandos de navegación más básicos.',
      },
      {
        id: 'b',
        text: 'mkdir',
        explanation:
          'mkdir crea carpetas; no muestra la ubicación actual.',
      },
      {
        id: 'c',
        text: 'mv',
        explanation:
          'mv mueve o renombra archivos/carpetas.',
      },
      {
        id: 'd',
        text: 'git push',
        explanation:
          'push envía commits al remoto; no sirve para ubicación en el sistema de archivos.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. `pwd` muestra la ruta actual y es clave para no ejecutar comandos en la carpeta equivocada.',
    incorrectFeedback:
      'La respuesta correcta era `pwd`. Es un comando simple, pero muy útil para orientarte dentro del proyecto.',
  },
  {
    id: 'git-8',
    moduleId: 'git-github',
    prompt: '¿Qué comando usarías para ver los archivos y carpetas del directorio actual antes de hacer cambios?',
    options: [
      {
        id: 'a',
        text: 'ls',
        explanation:
          'ls lista contenido del directorio y es el comando típico para inspección rápida.',
      },
      {
        id: 'b',
        text: 'rm',
        explanation:
          'rm elimina archivos y sería riesgoso usarlo con ese objetivo.',
      },
      {
        id: 'c',
        text: 'commit',
        explanation:
          'Eso ni siquiera es un comando de shell por sí solo en ese contexto.',
      },
      {
        id: 'd',
        text: 'chmod',
        explanation:
          'chmod cambia permisos, no lista archivos.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. `ls` te deja inspeccionar el contenido del directorio actual antes de crear, mover o borrar archivos.',
    incorrectFeedback:
      'La respuesta correcta era `ls`. Conviene dominar estos comandos de entorno porque acompañan siempre al trabajo con Git.',
  },
  {
    id: 'git-9',
    moduleId: 'git-github',
    prompt: '¿Para qué sirve `eval "$(ssh-agent -s)"` dentro del flujo con GitHub por SSH?',
    options: [
      {
        id: 'a',
        text: 'Para iniciar el agente SSH en la sesión actual.',
        explanation:
          'Ese comando levanta el agente y permite luego cargar claves con ssh-add.',
      },
      {
        id: 'b',
        text: 'Para borrar la clave privada anterior.',
        explanation:
          'No elimina claves; inicia el agente.',
      },
      {
        id: 'c',
        text: 'Para convertir el repositorio en público.',
        explanation:
          'No cambia visibilidad del repositorio.',
      },
      {
        id: 'd',
        text: 'Para hacer push automáticamente después del commit.',
        explanation:
          'No ejecuta comandos Git de publicación.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Ese eval levanta el agente SSH en la sesión, y después suele venir ssh-add para cargar la clave privada.',
    incorrectFeedback:
      'La respuesta correcta era iniciar el agente SSH. Es parte del flujo de autenticación, no del versionado en sí mismo.',
  },
  {
    id: 'git-10',
    moduleId: 'git-github',
    prompt: '¿Qué hace `ssh-add ~/.ssh/id_ed25519` después de iniciar el agente SSH?',
    options: [
      {
        id: 'a',
        text: 'Carga la clave privada en el agente para usarla en autenticación.',
        explanation:
          'Eso permite que la sesión use la clave sin tener que indicarla manualmente cada vez.',
      },
      {
        id: 'b',
        text: 'Sube la clave pública a GitHub automáticamente.',
        explanation:
          'La clave pública se agrega en GitHub por otro paso; ssh-add no hace eso.',
      },
      {
        id: 'c',
        text: 'Renombra la clave privada.',
        explanation:
          'No renombra archivos, solo los carga en el agente.',
      },
      {
        id: 'd',
        text: 'Protege la clave con chmod 600.',
        explanation:
          'Eso se hace con chmod, no con ssh-add.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. `ssh-add` mete la clave privada en el agente activo para que Git pueda autenticarse vía SSH.',
    incorrectFeedback:
      'La respuesta correcta era cargar la clave en el agente. No sube la clave pública ni cambia permisos del archivo.',
  },
  {
    id: 'git-11',
    moduleId: 'git-github',
    prompt: '¿Cuál es la diferencia más importante entre `git merge` y `git rebase`?',
    options: [
      {
        id: 'a',
        text: 'merge integra historias; rebase reescribe la base de una rama sobre otra.',
        explanation:
          'Esa distinción resume bien el comportamiento conceptual de ambos comandos.',
      },
      {
        id: 'b',
        text: 'merge borra commits y rebase crea repositorios.',
        explanation:
          'Ninguna de esas acciones define correctamente esos comandos.',
      },
      {
        id: 'c',
        text: 'merge solo sirve en GitHub y rebase solo en Linux.',
        explanation:
          'Ambos son comandos Git generales, no dependientes de esa forma.',
      },
      {
        id: 'd',
        text: 'No hay diferencia: son dos nombres para lo mismo.',
        explanation:
          'No son equivalentes y tienen impactos distintos en el historial.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Merge une historias manteniendo la divergencia; rebase mueve o reescribe la base de una rama para dejar un historial más lineal.',
    incorrectFeedback:
      'La respuesta correcta era integración versus reescritura de base. Esa diferencia es clave para entender el historial resultante.',
  },
  {
    id: 'git-12',
    moduleId: 'git-github',
    prompt: '¿Para qué usarías `git cherry-pick`?',
    options: [
      {
        id: 'a',
        text: 'Para traer un commit puntual a otra rama sin fusionar toda la rama original.',
        explanation:
          'Ese es el caso de uso típico y más útil para teoría.',
      },
      {
        id: 'b',
        text: 'Para listar archivos del directorio actual.',
        explanation:
          'Eso corresponde a comandos del shell como ls.',
      },
      {
        id: 'c',
        text: 'Para reemplazar por completo a git log.',
        explanation:
          'No sirve para inspección de historial.',
      },
      {
        id: 'd',
        text: 'Para iniciar el agente SSH.',
        explanation:
          'Eso se hace con ssh-agent, no con cherry-pick.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. `cherry-pick` permite aplicar un commit específico sobre otra rama sin traer toda la historia de la rama fuente.',
    incorrectFeedback:
      'La respuesta correcta era traer un commit puntual. Conviene asociarlo con “seleccionar una sola pieza del historial”.',
  },
  {
    id: 'git-13',
    moduleId: 'git-github',
    prompt: '¿Qué comando usarías para ver diferencias todavía no confirmadas entre archivos modificados y el último commit?',
    options: [
      {
        id: 'a',
        text: 'git diff',
        explanation:
          'git diff muestra cambios no confirmados y es básico para revisar antes de confirmar.',
      },
      {
        id: 'b',
        text: 'git clone',
        explanation:
          'clone crea una copia del repositorio, no muestra diferencias.',
      },
      {
        id: 'c',
        text: 'git checkout',
        explanation:
          'checkout cambia de rama o referencia, pero no es la consulta principal de diferencias.',
      },
      {
        id: 'd',
        text: 'git remote',
        explanation:
          'remote administra remotos; no compara cambios locales.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. `git diff` es la forma clásica de inspeccionar qué cambió antes de hacer add o commit.',
    incorrectFeedback:
      'La respuesta correcta era `git diff`. Es el comando que conviene mirar antes de confirmar cambios, especialmente si querés revisar detalle.',
  },
  {
    id: 'git-14',
    moduleId: 'git-github',
    prompt: '¿Qué diferencia conceptual conviene recordar entre `git restore`, `git reset` y `git revert`?',
    options: [
      {
        id: 'a',
        text: 'restore recupera archivos, reset mueve o reconfigura estado/historial, revert crea un commit inverso.',
        explanation:
          'Esa separación es la forma más segura de estudiar esos tres comandos sin mezclarlos.',
      },
      {
        id: 'b',
        text: 'Los tres borran commits de la misma manera.',
        explanation:
          'No hacen lo mismo ni tienen el mismo impacto.',
      },
      {
        id: 'c',
        text: 'restore y revert son de Linux; reset es de GitHub.',
        explanation:
          'Los tres pertenecen al flujo Git.',
      },
      {
        id: 'd',
        text: 'No existe diferencia práctica entre ellos.',
        explanation:
          'Sí existe, y mezclarla puede causar errores importantes.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Muy bien. Esa es una forma clara de separarlos: restore toca archivos, reset toca posición/estado, revert conserva historial pero compensa con un commit inverso.',
    incorrectFeedback:
      'La respuesta correcta era la que diferenciaba recuperar archivos, mover estado e invertir cambios con nuevo commit. Es una distinción importante.',
  },
  {
    id: 'git-15',
    moduleId: 'git-github',
    prompt: '¿Qué hace `git clone` dentro del trabajo con un repositorio remoto?',
    options: [
      {
        id: 'a',
        text: 'Crea una copia local completa del repositorio remoto.',
        explanation:
          'Ese es el comportamiento esperado al clonar desde GitHub u otro remoto.',
      },
      {
        id: 'b',
        text: 'Solo descarga el último archivo editado.',
        explanation:
          'No baja un solo archivo; copia el repositorio completo.',
      },
      {
        id: 'c',
        text: 'Convierte automáticamente HTTPS en SSH.',
        explanation:
          'El protocolo depende de la URL usada, no de clone por sí mismo.',
      },
      {
        id: 'd',
        text: 'Hace merge de todas las ramas en main.',
        explanation:
          'No fusiona ramas automáticamente.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. `git clone` trae una copia local del repositorio remoto, con su historial y configuración básica.',
    incorrectFeedback:
      'La respuesta correcta era copiar localmente el repositorio remoto. No baja un único archivo ni fusiona ramas automáticamente.',
  },
]
