import type { QuizQuestion, StudyModule } from '../types/study'

export const ticsSecondPartialModules: StudyModule[] = [
  {
    id: 'linux-arquitectura',
    title: 'Linux: arquitectura, usos y modelo abierto',
    shortLabel: 'Linux',
    summary:
      'Ordena la base conceptual de Linux: kernel, shell, utilidades, distribuciones, usos reales y diferencia entre Open Source y Software Libre.',
    focusAreas: [
      'Linux como sistema Unix-like, multitarea, multiusuario y modular.',
      'Kernel como núcleo que gestiona hardware, memoria, procesos, dispositivos, archivos y seguridad.',
      'Shell como interfaz e intérprete de comandos entre usuario y sistema.',
      'Utilidades del sistema: gestores de paquetes, editores, red, archivos y compresión.',
      'Distribución Linux como sistema completo construido alrededor del kernel.',
      'Open Source orientado al desarrollo abierto; Software Libre orientado a libertades del usuario.',
    ],
    deepDive: [
      'No conviene decir que Linux es solo “un programa”: es una estructura de componentes que administran recursos y ofrecen servicios.',
      'El kernel no recibe comandos humanos directamente; el shell interpreta lo que escribís y solicita operaciones al sistema.',
      'Ubuntu, Debian, Fedora y CentOS son ejemplos de distribuciones: todas se apoyan en Linux, pero empaquetan herramientas y configuraciones distintas.',
      'Open Source y Software Libre se parecen, pero no enfatizan lo mismo: uno mira beneficios prácticos del código abierto y el otro las libertades del usuario.',
    ],
    practiceTips: [
      'Prepará una explicación corta separando kernel, shell y utilidades sin mezclarlos.',
      'Usá ejemplos reales: Android para móviles, servidores web para infraestructura y Ubuntu para aprendizaje en servidores.',
      'Ensayá una comparación entre distribución, kernel y sistema operativo completo.',
    ],
  },
  {
    id: 'comandos-linux',
    title: 'Terminal y comandos básicos de Linux',
    shortLabel: 'Comandos',
    summary:
      'Reúne comandos de navegación, archivos, permisos, procesos, recursos, red, paquetes, compresión, ayuda y redirecciones para resolver ejercicios prácticos.',
    focusAreas: [
      'Terminal como interfaz textual explícita, precisa y automatizable.',
      'Navegación: pwd, ls, cd, cd .., cd ~ y ls -la.',
      'Archivos y carpetas: mkdir, touch, cp, mv y rm.',
      'Visualización y búsqueda: cat, head, tail, tail -f, grep y find.',
      'Permisos, propietarios, procesos y recursos: chmod, chown, ps aux, top, kill, free -h, df -h, du -sh.',
      'Red, paquetes, compresión y flujo: ping, curl, wget, apt, tar, unzip, echo, clear, history, man, >, >> y |.',
    ],
    deepDive: [
      'La terminal no es solo otra interfaz: en servidores muchas veces es la forma principal de trabajo porque no hay entorno gráfico.',
      'rm, rm -r y rm -rf requieren cuidado: Linux asume que el usuario sabe lo que hace y no siempre hay papelera.',
      'Los permisos numéricos se calculan sumando lectura 4, escritura 2 y ejecución 1 para propietario, grupo y otros.',
      'Las redirecciones permiten construir tareas compuestas: > sobrescribe, >> agrega y | conecta la salida de un comando con otro.',
    ],
    practiceTips: [
      'Armá una rutina de práctica: pwd -> ls -la -> mkdir -> touch -> cp -> mv -> cat -> rm.',
      'Practicá buscar errores en logs con grep y monitorearlos con tail -f.',
      'Separá comandos de consulta de comandos destructivos antes de responder una consigna.',
    ],
    examples: [
      {
        title: 'Navegación e inspección básica',
        language: 'bash',
        description:
          'Flujo mínimo para ubicarse, listar contenido, entrar a una carpeta y volver.',
        code: `pwd
ls -la
cd proyectos
cd ..
cd ~`,
      },
      {
        title: 'Buscar dentro de procesos o archivos',
        language: 'bash',
        description:
          'Combina comandos simples para encontrar información puntual.',
        code: `ps aux | grep firefox
grep "error" app.log
find . -type d`,
      },
      {
        title: 'Redirecciones',
        language: 'bash',
        description:
          'Diferencia entre sobrescribir, agregar y encadenar comandos.',
        code: `ls > lista.txt
echo "otra linea" >> lista.txt
ps aux | grep python`,
      },
    ],
  },
  {
    id: 'cliente-servidor-apache',
    title: 'Arquitectura cliente-servidor y Apache',
    shortLabel: 'Apache',
    summary:
      'Explica el modelo cliente-servidor y cómo Apache publica sitios web desde Ubuntu usando servicios, carpetas de configuración, puertos y VirtualHost.',
    focusAreas: [
      'Cliente solicita, red transporta y servidor responde.',
      'Ventajas: centralización, seguridad y escalabilidad; desventajas: costo y dependencia del servidor.',
      'Apache como servidor web que responde solicitudes HTTP/HTTPS con recursos estáticos o aplicaciones integradas.',
      'Ubuntu como plataforma común para servidores por estabilidad, documentación y apt.',
      'systemctl para consultar, iniciar, habilitar y recargar el servicio apache2.',
      'Estructura Apache: apache2.conf, ports.conf, sites-available, sites-enabled, mods-available, mods-enabled y /var/www/html.',
    ],
    deepDive: [
      'Apache no diseña páginas ni inventa contenido: recibe una solicitud, localiza el recurso y lo devuelve al cliente.',
      'ports.conf define por dónde escucha Apache; los VirtualHost definen qué sitio atiende, desde qué carpeta y con qué reglas.',
      'sites-available contiene configuraciones disponibles, pero Apache carga las que están habilitadas en sites-enabled.',
      '/etc/hosts permite simular dominios localmente apuntando nombres como ejemplo.com a 127.0.0.1.',
    ],
    practiceTips: [
      'Repasá el recorrido: navegador -> DNS o hosts -> Apache -> VirtualHost -> DocumentRoot -> index.html.',
      'Memorizá los comandos base: apt update, apt install apache2, systemctl status/start/enable/reload apache2.',
      'Practicá identificar qué archivo cambia puertos, cuál habilita sitios y dónde se ubica el contenido web.',
    ],
    examples: [
      {
        title: 'Instalar y administrar Apache',
        language: 'bash',
        description:
          'Comandos mínimos para instalar, revisar estado, iniciar y recargar Apache en Ubuntu.',
        code: `sudo apt update
sudo apt install apache2
sudo systemctl status apache2
sudo systemctl start apache2
sudo systemctl enable apache2
sudo systemctl reload apache2`,
      },
      {
        title: 'VirtualHost básico',
        language: 'apache',
        description:
          'Estructura conceptual de un sitio Apache con dominio y carpeta pública.',
        code: `<VirtualHost *:80>
  ServerName ejemplo.com
  ServerAlias www.ejemplo.com
  DocumentRoot /var/www/ejemplo.com/public_html

  <Directory /var/www/ejemplo.com/public_html>
    AllowOverride All
    Require all granted
  </Directory>

  ErrorLog /var/log/apache2/ejemplo-error.log
  CustomLog /var/log/apache2/ejemplo-access.log combined
</VirtualHost>`,
      },
    ],
  },
  {
    id: 'docker-fundamentos',
    title: 'Docker: DevOps, imágenes, contenedores y Dockerfile',
    shortLabel: 'Docker I',
    summary:
      'Introduce Docker desde el problema DevOps hasta sus componentes: Docker Engine, imágenes, contenedores, registros, Dockerfile, capas y comandos base.',
    focusAreas: [
      'DevOps busca unir desarrollo y operaciones con colaboración, CI/CD, automatización, monitoreo y mejora continua.',
      'Docker empaqueta aplicaciones con dependencias para ejecutar entornos consistentes.',
      'Docker Engine incluye daemon, API REST y CLI.',
      'Imagen como plantilla inmutable; contenedor como instancia en ejecución de una imagen.',
      'Dockerfile como receta reproducible para construir imágenes.',
      'Capas, tags, Docker Hub, registros privados y comandos básicos de contenedores e imágenes.',
    ],
    deepDive: [
      'La frase “en mi máquina funciona” aparece porque los entornos difieren; Docker reduce ese problema empaquetando dependencias y configuración.',
      'Una imagen no “corre” por sí sola: se usa para crear uno o varios contenedores.',
      'EXPOSE documenta el puerto interno, pero publicar hacia el host se hace con -p al ejecutar el contenedor.',
      'Las capas del Dockerfile son inmutables y se cachean, por eso el orden de instrucciones influye en la reconstrucción.',
      'Docker no reemplaza siempre a las máquinas virtuales: los contenedores son más livianos, pero comparten kernel y aíslan menos.',
    ],
    practiceTips: [
      'Estudiá Dockerfile, imagen y contenedor como receta, plantilla y ejecución.',
      'Practicá explicar docker run -d -p 8080:80 nginx con cada opción.',
      'Compará contenedores y VM por kernel, recursos, velocidad, aislamiento y compatibilidad.',
    ],
    examples: [
      {
        title: 'Dockerfile para app Node/Angular',
        language: 'dockerfile',
        description:
          'Ejemplo con instrucciones típicas de construcción de imagen.',
        code: `FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]`,
      },
      {
        title: 'Comandos base de contenedores',
        language: 'bash',
        description:
          'Operaciones habituales para ejecutar, listar, detener, revisar logs y entrar a un contenedor.',
        code: `docker run -d -p 8080:80 nginx
docker ps
docker stop nombre_contenedor
docker logs nombre_contenedor
docker exec -it nombre_contenedor bash
docker rm nombre_contenedor`,
      },
    ],
  },
  {
    id: 'compose-redes-volumenes',
    title: 'Docker Compose, redes y volúmenes',
    shortLabel: 'Compose',
    summary:
      'Profundiza en aplicaciones multicontenedor: Docker Compose, servicios, docker-compose.yml, redes virtuales, resolución por nombre y persistencia con volúmenes.',
    focusAreas: [
      'Dockerfile construye imágenes; Docker Compose coordina servicios y relaciones entre contenedores.',
      'docker-compose.yml centraliza imágenes, build, puertos, variables de entorno, redes, volúmenes y dependencias.',
      'Servicios como unidad lógica dentro de Compose.',
      'Volúmenes para conservar datos fuera del ciclo de vida del contenedor.',
      'Redes Docker para comunicación e aislamiento entre servicios.',
      'Comandos compose: up, up -d, down, build, ps, logs y exec.',
    ],
    deepDive: [
      'Compose evita administrar a mano varios docker run con puertos, variables, redes y volúmenes repetidos.',
      'Los datos escritos solo dentro del contenedor se pierden al eliminarlo; los volúmenes resuelven esa persistencia.',
      'En una misma red Docker, los contenedores pueden encontrarse por nombre de servicio o contenedor, no hace falta fijar IPs.',
      'down elimina contenedores y redes creadas por Compose, pero los volúmenes persisten salvo que se pidan explícitamente.',
    ],
    practiceTips: [
      'Leé un docker-compose.yml identificando services, ports, environment, volumes y networks.',
      'Practicá cuándo usar build y cuándo usar image.',
      'Explicá por qué una app Node puede conectarse a MongoDB usando mongo como host dentro de Compose.',
    ],
    examples: [
      {
        title: 'Compose con app y MongoDB',
        language: 'yaml',
        description:
          'Ejemplo típico de dos servicios conectados por nombre y con datos persistentes.',
        code: `services:
  app:
    build: ./app
    ports:
      - "3000:3000"
    environment:
      MONGO_URL: mongodb://mongo:27017/app
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:`,
      },
      {
        title: 'Comandos de Docker Compose',
        language: 'bash',
        description:
          'Administración básica de una aplicación definida en docker-compose.yml.',
        code: `docker compose up -d
docker compose ps
docker compose logs
docker compose exec app bash
docker compose build
docker compose down`,
      },
    ],
  },
  {
    id: 'docker-practica-multicontenedor',
    title: 'Docker práctico: puertos, variables, redes y apps multicontenedor',
    shortLabel: 'Práctica',
    summary:
      'Aplica Docker en ejercicios con MySQL, Adminer y WordPress: publicación de puertos, variables de entorno, redes personalizadas y volúmenes persistentes.',
    focusAreas: [
      'Mapeo de puertos con -p puerto_host:puerto_contenedor.',
      'Variables de entorno con -e para configurar imágenes oficiales.',
      'Variables MySQL: MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, MYSQL_USER y MYSQL_PASSWORD.',
      'Variables WordPress: WORDPRESS_DB_HOST, WORDPRESS_DB_NAME, WORDPRESS_DB_USER y WORDPRESS_DB_PASSWORD.',
      'Redes personalizadas para controlar qué contenedores se comunican.',
      'Volúmenes para conservar bases de datos y contenido al recrear contenedores.',
    ],
    deepDive: [
      'Publicar puertos sirve para acceder desde la máquina anfitriona; no es necesario para comunicación interna entre contenedores en la misma red.',
      'MySQL y WordPress deben compartir red para que WordPress resuelva el host de base de datos por nombre.',
      'Adminer requiere publicar su puerto si querés abrirlo desde el navegador, pero puede conectarse internamente a MySQL por red Docker.',
      'La documentación de Docker Hub importa porque cada imagen define sus propias variables y rutas de volúmenes.',
    ],
    practiceTips: [
      'Dibujá cada ejercicio marcando contenedores, red, volumen y puertos publicados.',
      'Verificá qué servicios necesitan acceso desde navegador: WordPress y Adminer sí; MySQL normalmente no.',
      'Ensayá qué pasa si eliminás solo el contenedor MySQL con y sin volumen persistente.',
    ],
    examples: [
      {
        title: 'MySQL con volumen persistente',
        language: 'bash',
        description:
          'Patrón de ejercicio para conservar datos al recrear el contenedor.',
        code: `docker volume create mysql-data
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=secreta \
  -e MYSQL_DATABASE=clientes \
  -v mysql-data:/var/lib/mysql \
  mysql:latest`,
      },
      {
        title: 'Red para WordPress y MySQL',
        language: 'bash',
        description:
          'WordPress puede usar el nombre del contenedor MySQL como host si comparten red.',
        code: `docker network create wp-red

docker run -d --name mysql --network wp-red \
  -e MYSQL_ROOT_PASSWORD=secreta \
  -e MYSQL_DATABASE=wordpress \
  -e MYSQL_USER=wpuser \
  -e MYSQL_PASSWORD=wppass \
  mysql:latest

docker run -d --name wordpress --network wp-red \
  -p 8080:80 \
  -e WORDPRESS_DB_HOST=mysql \
  -e WORDPRESS_DB_NAME=wordpress \
  -e WORDPRESS_DB_USER=wpuser \
  -e WORDPRESS_DB_PASSWORD=wppass \
  wordpress:latest`,
      },
    ],
  },
]

export const ticsSecondPartialQuestions: QuizQuestion[] = [
  {
    id: 'linux2-1',
    moduleId: 'linux-arquitectura',
    prompt: '¿Qué componente de Linux tiene acceso directo al hardware?',
    options: [
      {
        id: 'a',
        text: 'El kernel',
        explanation:
          'El kernel es el núcleo y gestiona recursos como CPU, memoria, dispositivos y archivos.',
      },
      {
        id: 'b',
        text: 'El navegador web',
        explanation:
          'El navegador es una aplicación de usuario, no el componente central del sistema operativo.',
      },
      {
        id: 'c',
        text: 'El comando history',
        explanation:
          'history es una utilidad de terminal para ver comandos anteriores.',
      },
      {
        id: 'd',
        text: 'Docker Hub',
        explanation:
          'Docker Hub es un registro de imágenes, no parte de la arquitectura Linux.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. El kernel intermedia entre programas y hardware para mantener orden y seguridad.',
    incorrectFeedback:
      'La respuesta correcta era kernel. Shell y utilidades se apoyan en él, pero no lo reemplazan.',
  },
  {
    id: 'linux2-2',
    moduleId: 'linux-arquitectura',
    prompt: '¿Cuál es la función principal del shell?',
    options: [
      {
        id: 'a',
        text: 'Interpretar comandos del usuario y pedir acciones al sistema',
        explanation:
          'El shell procesa comandos, valida sintaxis y solicita operaciones al sistema.',
      },
      {
        id: 'b',
        text: 'Guardar imágenes Docker en internet',
        explanation:
          'Eso corresponde a registros como Docker Hub.',
      },
      {
        id: 'c',
        text: 'Asignar puertos HTTP a Apache',
        explanation:
          'Los puertos de Apache se definen en su configuración, no por el shell como función principal.',
      },
      {
        id: 'd',
        text: 'Crear automáticamente distribuciones Linux',
        explanation:
          'Una distribución es un sistema completo, no algo que el shell cree automáticamente.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. El shell es el puente operativo entre lo que escribe el usuario y las acciones del sistema.',
    incorrectFeedback:
      'La clave era ubicar al shell como intérprete de comandos, no como kernel ni como repositorio.',
  },
  {
    id: 'linux2-3',
    moduleId: 'linux-arquitectura',
    prompt: '¿Qué es una distribución Linux?',
    options: [
      {
        id: 'a',
        text: 'Un sistema completo armado alrededor del kernel Linux',
        explanation:
          'Incluye kernel, herramientas, aplicaciones, configuración y muchas veces interfaz gráfica.',
      },
      {
        id: 'b',
        text: 'Una sola instrucción del Dockerfile',
        explanation:
          'Dockerfile pertenece al ecosistema Docker, no define una distribución Linux.',
      },
      {
        id: 'c',
        text: 'Un puerto publicado por Apache',
        explanation:
          'Los puertos permiten recibir conexiones; no son distribuciones.',
      },
      {
        id: 'd',
        text: 'Un permiso numérico como 755',
        explanation:
          '755 es una combinación de permisos, no un sistema operativo.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Ubuntu, Debian, Fedora y CentOS son ejemplos de distribuciones.',
    incorrectFeedback:
      'La respuesta correcta era la de sistema completo construido alrededor del kernel.',
  },
  {
    id: 'linux2-4',
    moduleId: 'linux-arquitectura',
    prompt: '¿Qué diferencia resume mejor Open Source frente a Software Libre?',
    options: [
      {
        id: 'a',
        text: 'Open Source enfatiza el modelo práctico de desarrollo abierto; Software Libre enfatiza libertades del usuario',
        explanation:
          'Esa diferencia aparece en el material como distinción conceptual e ideológica.',
      },
      {
        id: 'b',
        text: 'Open Source solo funciona en Windows y Software Libre solo en Linux',
        explanation:
          'No es una diferencia por sistema operativo.',
      },
      {
        id: 'c',
        text: 'Software Libre significa que no tiene código fuente',
        explanation:
          'Es al revés: estudiar y modificar el código es una de sus libertades.',
      },
      {
        id: 'd',
        text: 'Son puertos distintos de Apache',
        explanation:
          'No tienen relación con puertos HTTP/HTTPS.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Ambos pueden compartir prácticas, pero no parten del mismo énfasis.',
    incorrectFeedback:
      'La respuesta correcta separaba beneficios prácticos del desarrollo abierto y libertades del usuario.',
  },
  {
    id: 'linux2-5',
    moduleId: 'linux-arquitectura',
    prompt: '¿Por qué Linux se usa mucho en servidores?',
    options: [
      {
        id: 'a',
        text: 'Por estabilidad, seguridad y buen uso de recursos',
        explanation:
          'El material lo presenta como una plataforma fuerte para servicios continuos.',
      },
      {
        id: 'b',
        text: 'Porque no permite usuarios múltiples',
        explanation:
          'Linux es multiusuario; esa afirmación contradice el material.',
      },
      {
        id: 'c',
        text: 'Porque elimina la necesidad de redes',
        explanation:
          'Los servidores justamente suelen prestar servicios a través de redes.',
      },
      {
        id: 'd',
        text: 'Porque solo ejecuta una tarea a la vez',
        explanation:
          'Linux es multitarea.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Esa combinación explica su adopción en infraestructura real.',
    incorrectFeedback:
      'La respuesta correcta apuntaba a estabilidad, seguridad y eficiencia.',
  },
  {
    id: 'cmd2-1',
    moduleId: 'comandos-linux',
    prompt: '¿Qué comando muestra el directorio actual?',
    options: [
      {
        id: 'a',
        text: 'pwd',
        explanation:
          'pwd muestra la ruta donde estás parado.',
      },
      {
        id: 'b',
        text: 'mkdir',
        explanation:
          'mkdir crea directorios.',
      },
      {
        id: 'c',
        text: 'rm',
        explanation:
          'rm elimina archivos.',
      },
      {
        id: 'd',
        text: 'tar',
        explanation:
          'tar empaqueta o desempaqueta archivos.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. pwd es básico para no ejecutar comandos en una ubicación equivocada.',
    incorrectFeedback:
      'La respuesta correcta era pwd. El resto manipula archivos o paquetes, pero no muestra dónde estás.',
  },
  {
    id: 'cmd2-2',
    moduleId: 'comandos-linux',
    prompt: '¿Qué hace `ls -la`?',
    options: [
      {
        id: 'a',
        text: 'Lista contenido con más detalle e incluye archivos ocultos',
        explanation:
          '-l muestra formato largo y -a incluye entradas ocultas.',
      },
      {
        id: 'b',
        text: 'Borra todo sin confirmación',
        explanation:
          'Eso se asocia a rm -rf, no a ls -la.',
      },
      {
        id: 'c',
        text: 'Instala Apache',
        explanation:
          'Apache se instala con apt install apache2.',
      },
      {
        id: 'd',
        text: 'Publica puertos Docker',
        explanation:
          'Docker publica puertos con -p en docker run o ports en Compose.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Esta opción ayuda a ver permisos, tamaño, fechas y archivos ocultos.',
    incorrectFeedback:
      'La clave era reconocer flags de listado, no comandos destructivos ni de instalación.',
  },
  {
    id: 'cmd2-3',
    moduleId: 'comandos-linux',
    prompt: '¿Qué operador agrega salida al final de un archivo sin borrar lo anterior?',
    options: [
      {
        id: 'a',
        text: '>>',
        explanation:
          '>> anexa contenido al final del archivo.',
      },
      {
        id: 'b',
        text: '>',
        explanation:
          '> redirige pero sobrescribe el contenido anterior.',
      },
      {
        id: 'c',
        text: '|',
        explanation:
          'El pipe conecta la salida de un comando con la entrada de otro.',
      },
      {
        id: 'd',
        text: '-p',
        explanation:
          '-p se usa, por ejemplo, para publicar puertos en Docker o crear carpetas intermedias con mkdir.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. > pisa; >> conserva y agrega.',
    incorrectFeedback:
      'La respuesta correcta era >>. Es una diferencia típica de examen.',
  },
  {
    id: 'cmd2-4',
    moduleId: 'comandos-linux',
    prompt: '¿Para qué sirve `tail -f`?',
    options: [
      {
        id: 'a',
        text: 'Para ver las últimas líneas de un archivo mientras se actualiza',
        explanation:
          'La opción follow permite monitorear cambios en tiempo real.',
      },
      {
        id: 'b',
        text: 'Para cambiar el propietario de un archivo',
        explanation:
          'Eso se hace con chown.',
      },
      {
        id: 'c',
        text: 'Para listar contenedores Docker',
        explanation:
          'Eso se hace con docker ps.',
      },
      {
        id: 'd',
        text: 'Para habilitar un sitio Apache',
        explanation:
          'Eso se hace con a2ensite.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Es especialmente útil para mirar logs vivos.',
    incorrectFeedback:
      'La respuesta correcta era monitoreo de archivo en tiempo real.',
  },
  {
    id: 'cmd2-5',
    moduleId: 'comandos-linux',
    prompt: 'En permisos Linux, ¿qué significa 755?',
    options: [
      {
        id: 'a',
        text: 'Propietario con lectura/escritura/ejecución; grupo y otros con lectura/ejecución',
        explanation:
          '7 = 4+2+1, 5 = 4+1.',
      },
      {
        id: 'b',
        text: 'Todos sin permisos',
        explanation:
          'Sin permisos sería 000.',
      },
      {
        id: 'c',
        text: 'Solo propietario con lectura',
        explanation:
          'Eso no coincide con 755.',
      },
      {
        id: 'd',
        text: 'Todos con lectura/escritura/ejecución',
        explanation:
          'Eso sería 777, que además suele evitarse por inseguro.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. 755 es común en carpetas web porque permite acceso sin escritura para otros.',
    incorrectFeedback:
      'La respuesta correcta era 7 para propietario y 5 para grupo/otros.',
  },
  {
    id: 'apache2-1',
    moduleId: 'cliente-servidor-apache',
    prompt: '¿Qué describe mejor el modelo cliente-servidor?',
    options: [
      {
        id: 'a',
        text: 'El cliente solicita servicios y el servidor responde a través de una red',
        explanation:
          'Esa es la lógica base: cliente solicita, red transporta, servidor responde.',
      },
      {
        id: 'b',
        text: 'Todos los equipos hacen exactamente lo mismo sin roles',
        explanation:
          'El modelo separa responsabilidades.',
      },
      {
        id: 'c',
        text: 'El servidor siempre es un navegador',
        explanation:
          'En la Web, el navegador suele ser el cliente.',
      },
      {
        id: 'd',
        text: 'No intervienen redes ni protocolos',
        explanation:
          'La comunicación cliente-servidor se apoya en redes y protocolos.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Esa frase resume el modelo completo de forma clara.',
    incorrectFeedback:
      'La respuesta correcta separaba roles: cliente, red y servidor.',
  },
  {
    id: 'apache2-2',
    moduleId: 'cliente-servidor-apache',
    prompt: '¿Cuál es la función principal de Apache HTTP Server?',
    options: [
      {
        id: 'a',
        text: 'Recibir solicitudes web y devolver recursos o respuestas',
        explanation:
          'Apache sirve contenido mediante HTTP/HTTPS.',
      },
      {
        id: 'b',
        text: 'Crear imágenes Docker',
        explanation:
          'Las imágenes Docker se construyen con Dockerfile y docker build.',
      },
      {
        id: 'c',
        text: 'Cambiar permisos de archivos Linux',
        explanation:
          'Eso corresponde a chmod.',
      },
      {
        id: 'd',
        text: 'Administrar logs de contenedores Compose',
        explanation:
          'Compose tiene sus propios comandos para logs.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Apache administra conexiones y entrega recursos solicitados por clientes.',
    incorrectFeedback:
      'La respuesta correcta era servir contenido web, no construir imágenes ni cambiar permisos.',
  },
  {
    id: 'apache2-3',
    moduleId: 'cliente-servidor-apache',
    prompt: '¿Qué archivo define los puertos en los que escucha Apache en Ubuntu?',
    options: [
      {
        id: 'a',
        text: '/etc/apache2/ports.conf',
        explanation:
          'ports.conf contiene directivas Listen como 80 o 443.',
      },
      {
        id: 'b',
        text: '/var/www/html/index.html',
        explanation:
          'Ese archivo puede ser contenido web, no configuración de puertos.',
      },
      {
        id: 'c',
        text: 'docker-compose.yml',
        explanation:
          'Ese archivo pertenece a Docker Compose.',
      },
      {
        id: 'd',
        text: '/etc/hosts',
        explanation:
          '/etc/hosts resuelve nombres localmente, no define puertos de Apache.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. ports.conf le indica a Apache por qué puertos atender conexiones.',
    incorrectFeedback:
      'La respuesta correcta era ports.conf. No hay que confundir contenido, hosts y configuración Apache.',
  },
  {
    id: 'apache2-4',
    moduleId: 'cliente-servidor-apache',
    prompt: '¿Qué diferencia hay entre sites-available y sites-enabled?',
    options: [
      {
        id: 'a',
        text: 'sites-available guarda sitios disponibles; sites-enabled contiene los activos',
        explanation:
          'Apache carga los sitios habilitados en sites-enabled.',
      },
      {
        id: 'b',
        text: 'sites-enabled guarda imágenes Docker',
        explanation:
          'No tiene relación con imágenes Docker.',
      },
      {
        id: 'c',
        text: 'sites-available solo contiene logs',
        explanation:
          'Allí se guardan configuraciones de sitios disponibles.',
      },
      {
        id: 'd',
        text: 'No hay diferencia',
        explanation:
          'Sí hay diferencia operativa: disponible no significa activo.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. a2ensite habilita un sitio creando el vínculo correspondiente.',
    incorrectFeedback:
      'La respuesta correcta distinguía disponible de habilitado.',
  },
  {
    id: 'apache2-5',
    moduleId: 'cliente-servidor-apache',
    prompt: '¿Para qué sirve /etc/hosts en la práctica local con Apache?',
    options: [
      {
        id: 'a',
        text: 'Para asociar manualmente un nombre de dominio con una IP local',
        explanation:
          'Permite probar ejemplo.com apuntando a 127.0.0.1.',
      },
      {
        id: 'b',
        text: 'Para instalar Apache',
        explanation:
          'Apache se instala con apt.',
      },
      {
        id: 'c',
        text: 'Para construir una imagen desde Dockerfile',
        explanation:
          'Eso se hace con docker build.',
      },
      {
        id: 'd',
        text: 'Para eliminar volúmenes Docker',
        explanation:
          'Los volúmenes se gestionan con docker volume.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. /etc/hosts permite simular resolución DNS localmente.',
    incorrectFeedback:
      'La respuesta correcta era asociación manual de dominio e IP.',
  },
  {
    id: 'docker1-1',
    moduleId: 'docker-fundamentos',
    prompt: '¿Qué problema histórico ayuda a resolver Docker?',
    options: [
      {
        id: 'a',
        text: 'Diferencias entre entornos de desarrollo, prueba y producción',
        explanation:
          'Docker empaqueta aplicación, dependencias y configuración para reproducibilidad.',
      },
      {
        id: 'b',
        text: 'La imposibilidad de usar Linux en servidores',
        explanation:
          'Linux sí se usa ampliamente en servidores.',
      },
      {
        id: 'c',
        text: 'La falta de comandos de navegación',
        explanation:
          'Eso pertenece al uso de terminal, no al problema central de Docker.',
      },
      {
        id: 'd',
        text: 'La necesidad de abrir páginas HTML sin navegador',
        explanation:
          'No es el foco de Docker.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Docker reduce el típico “en mi máquina funciona”.',
    incorrectFeedback:
      'La respuesta correcta era consistencia entre entornos.',
  },
  {
    id: 'docker1-2',
    moduleId: 'docker-fundamentos',
    prompt: '¿Qué diferencia hay entre imagen y contenedor?',
    options: [
      {
        id: 'a',
        text: 'La imagen es una plantilla; el contenedor es una instancia en ejecución',
        explanation:
          'Una misma imagen puede generar múltiples contenedores.',
      },
      {
        id: 'b',
        text: 'La imagen solo existe en Apache y el contenedor solo en Linux',
        explanation:
          'Ambos son conceptos Docker.',
      },
      {
        id: 'c',
        text: 'El contenedor es la receta y la imagen el comando',
        explanation:
          'La receta es el Dockerfile.',
      },
      {
        id: 'd',
        text: 'No hay ninguna diferencia',
        explanation:
          'Sí hay diferencia entre plantilla estática e instancia activa.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Esa distinción es central para todo Docker.',
    incorrectFeedback:
      'La respuesta correcta separaba plantilla e instancia activa.',
  },
  {
    id: 'docker1-3',
    moduleId: 'docker-fundamentos',
    prompt: '¿Para qué sirve un Dockerfile?',
    options: [
      {
        id: 'a',
        text: 'Para definir instrucciones reproducibles de construcción de una imagen',
        explanation:
          'FROM, RUN, COPY, WORKDIR, EXPOSE y CMD son instrucciones típicas.',
      },
      {
        id: 'b',
        text: 'Para listar procesos Linux',
        explanation:
          'Eso se hace con ps aux o top.',
      },
      {
        id: 'c',
        text: 'Para resolver nombres en /etc/hosts',
        explanation:
          'Dockerfile no modifica la resolución local de nombres.',
      },
      {
        id: 'd',
        text: 'Para configurar exclusivamente Apache',
        explanation:
          'Apache tiene archivos propios como apache2.conf y VirtualHost.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Dockerfile documenta y automatiza la construcción de imágenes.',
    incorrectFeedback:
      'La respuesta correcta era construcción reproducible de imagen.',
  },
  {
    id: 'docker1-4',
    moduleId: 'docker-fundamentos',
    prompt: 'En `docker run -d -p 8080:80 nginx`, ¿qué indica `-p 8080:80`?',
    options: [
      {
        id: 'a',
        text: 'Mapea el puerto 8080 del host al puerto 80 del contenedor',
        explanation:
          'Así se accede desde la máquina anfitriona al servicio interno.',
      },
      {
        id: 'b',
        text: 'Crea una red llamada 8080',
        explanation:
          'Las redes se crean con docker network create.',
      },
      {
        id: 'c',
        text: 'Elimina el contenedor cuando termina',
        explanation:
          'Eso se asocia a --rm, no a -p.',
      },
      {
        id: 'd',
        text: 'Instala Nginx dentro de Ubuntu',
        explanation:
          'El comando ejecuta un contenedor basado en la imagen nginx.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. El orden es host:contenedor.',
    incorrectFeedback:
      'La respuesta correcta era publicación de puerto host hacia puerto del contenedor.',
  },
  {
    id: 'docker1-5',
    moduleId: 'docker-fundamentos',
    prompt: '¿Cuál es una diferencia importante entre Docker y una máquina virtual?',
    options: [
      {
        id: 'a',
        text: 'Los contenedores comparten el kernel del host; las VM tienen sistema operativo completo',
        explanation:
          'Esa diferencia explica consumo, velocidad y aislamiento.',
      },
      {
        id: 'b',
        text: 'Docker siempre aísla más que una VM',
        explanation:
          'El material marca que la VM puede aislar más porque tiene kernel propio.',
      },
      {
        id: 'c',
        text: 'Las VM no pueden ejecutar sistemas operativos',
        explanation:
          'Justamente una VM incluye un sistema operativo completo.',
      },
      {
        id: 'd',
        text: 'Docker solo sirve para abrir archivos HTML',
        explanation:
          'Docker administra aplicaciones contenedorizadas.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Docker suele ser más liviano, pero el aislamiento no es igual al de una VM.',
    incorrectFeedback:
      'La respuesta correcta era kernel compartido frente a sistema operativo completo.',
  },
  {
    id: 'compose2-1',
    moduleId: 'compose-redes-volumenes',
    prompt: '¿Qué diferencia resume mejor Dockerfile y Docker Compose?',
    options: [
      {
        id: 'a',
        text: 'Dockerfile construye imágenes; Compose coordina varios servicios',
        explanation:
          'Ambos se complementan en aplicaciones reales.',
      },
      {
        id: 'b',
        text: 'Compose reemplaza al kernel Linux',
        explanation:
          'Compose es una herramienta Docker, no un kernel.',
      },
      {
        id: 'c',
        text: 'Dockerfile solo sirve para abrir PDFs',
        explanation:
          'Dockerfile construye imágenes.',
      },
      {
        id: 'd',
        text: 'No existe relación entre ambos',
        explanation:
          'Pueden usarse juntos: build en Compose puede apuntar a un Dockerfile.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Imagen por un lado; orquestación local de servicios por el otro.',
    incorrectFeedback:
      'La respuesta correcta era construcción de imágenes versus coordinación de servicios.',
  },
  {
    id: 'compose2-2',
    moduleId: 'compose-redes-volumenes',
    prompt: '¿Qué archivo usa Docker Compose para definir servicios, redes, puertos y volúmenes?',
    options: [
      {
        id: 'a',
        text: 'docker-compose.yml',
        explanation:
          'Ese archivo YAML centraliza la configuración de la aplicación multicontenedor.',
      },
      {
        id: 'b',
        text: '/etc/apache2/ports.conf',
        explanation:
          'ports.conf pertenece a Apache.',
      },
      {
        id: 'c',
        text: '/etc/hosts',
        explanation:
          '/etc/hosts resuelve nombres localmente.',
      },
      {
        id: 'd',
        text: 'index.html',
        explanation:
          'index.html es contenido web, no configuración Compose.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Compose usa YAML para describir el entorno.',
    incorrectFeedback:
      'La respuesta correcta era docker-compose.yml.',
  },
  {
    id: 'compose2-3',
    moduleId: 'compose-redes-volumenes',
    prompt: '¿Para qué sirve un volumen Docker?',
    options: [
      {
        id: 'a',
        text: 'Para conservar datos fuera del ciclo de vida del contenedor',
        explanation:
          'Así los datos sobreviven al eliminar y recrear contenedores.',
      },
      {
        id: 'b',
        text: 'Para detener todos los servicios',
        explanation:
          'Eso se hace con docker compose down o docker stop según el caso.',
      },
      {
        id: 'c',
        text: 'Para listar procesos del host',
        explanation:
          'Eso corresponde a ps aux o top.',
      },
      {
        id: 'd',
        text: 'Para activar un VirtualHost',
        explanation:
          'Eso se hace con a2ensite.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Volumen = persistencia de datos.',
    incorrectFeedback:
      'La respuesta correcta era conservar datos más allá del contenedor.',
  },
  {
    id: 'compose2-4',
    moduleId: 'compose-redes-volumenes',
    prompt: '¿Por qué una app en Compose puede conectarse a MongoDB usando el host `mongo`?',
    options: [
      {
        id: 'a',
        text: 'Porque Docker resuelve nombres de servicios dentro de la misma red',
        explanation:
          'Compose crea una red donde los servicios pueden encontrarse por nombre.',
      },
      {
        id: 'b',
        text: 'Porque mongo siempre es una IP pública',
        explanation:
          'mongo es el nombre del servicio, no una IP pública fija.',
      },
      {
        id: 'c',
        text: 'Porque Apache modifica /etc/hosts automáticamente',
        explanation:
          'La resolución interna la da Docker, no Apache.',
      },
      {
        id: 'd',
        text: 'Porque no existe aislamiento entre contenedores',
        explanation:
          'Sí existe aislamiento; la red habilita comunicación controlada.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Esa resolución por nombre evita depender de IPs manuales.',
    incorrectFeedback:
      'La respuesta correcta era resolución interna de nombres en redes Docker.',
  },
  {
    id: 'compose2-5',
    moduleId: 'compose-redes-volumenes',
    prompt: '¿Qué hace `docker compose up -d`?',
    options: [
      {
        id: 'a',
        text: 'Crea e inicia los servicios definidos en segundo plano',
        explanation:
          '-d significa detached mode.',
      },
      {
        id: 'b',
        text: 'Elimina imágenes oficiales de Docker Hub',
        explanation:
          'No elimina imágenes.',
      },
      {
        id: 'c',
        text: 'Muestra manuales de Linux',
        explanation:
          'Los manuales se consultan con man.',
      },
      {
        id: 'd',
        text: 'Cambia permisos de una carpeta web',
        explanation:
          'Eso se hace con chmod.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Levanta el entorno definido por Compose en background.',
    incorrectFeedback:
      'La respuesta correcta era iniciar servicios Compose en segundo plano.',
  },
  {
    id: 'practica2-1',
    moduleId: 'docker-practica-multicontenedor',
    prompt: '¿Cuándo hace falta publicar un puerto con `-p`?',
    options: [
      {
        id: 'a',
        text: 'Cuando un servicio del contenedor debe ser accedido desde la máquina anfitriona',
        explanation:
          'Por ejemplo, abrir WordPress o Adminer desde el navegador del host.',
      },
      {
        id: 'b',
        text: 'Siempre que dos contenedores estén en la misma red',
        explanation:
          'La comunicación interna no requiere publicar puertos hacia el host.',
      },
      {
        id: 'c',
        text: 'Para crear un volumen',
        explanation:
          'Los volúmenes se crean con docker volume create o se declaran en Compose.',
      },
      {
        id: 'd',
        text: 'Para cambiar el usuario propietario de un archivo',
        explanation:
          'Eso se hace con chown.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Publicar puertos expone un servicio al host.',
    incorrectFeedback:
      'La respuesta correcta era acceso desde anfitrión, no comunicación interna.',
  },
  {
    id: 'practica2-2',
    moduleId: 'docker-practica-multicontenedor',
    prompt: '¿Qué variable de MySQL define la contraseña del usuario root en la imagen oficial?',
    options: [
      {
        id: 'a',
        text: 'MYSQL_ROOT_PASSWORD',
        explanation:
          'Es una variable central para inicializar MySQL.',
      },
      {
        id: 'b',
        text: 'WORDPRESS_DB_HOST',
        explanation:
          'Esa variable pertenece a WordPress.',
      },
      {
        id: 'c',
        text: 'APACHE_PORT',
        explanation:
          'No es la variable indicada por la guía para MySQL.',
      },
      {
        id: 'd',
        text: 'DOCKER_HOST_PASSWORD',
        explanation:
          'No es una variable de la imagen oficial MySQL.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. MYSQL_ROOT_PASSWORD configura la clave de root al crear el contenedor.',
    incorrectFeedback:
      'La respuesta correcta era MYSQL_ROOT_PASSWORD.',
  },
  {
    id: 'practica2-3',
    moduleId: 'docker-practica-multicontenedor',
    prompt: '¿Qué valor debería usar WORDPRESS_DB_HOST si el contenedor MySQL se llama `mysql` y comparten red?',
    options: [
      {
        id: 'a',
        text: 'mysql',
        explanation:
          'Docker permite resolver el nombre del contenedor dentro de la red compartida.',
      },
      {
        id: 'b',
        text: 'localhost:8080',
        explanation:
          'localhost dentro del contenedor apunta al propio contenedor, no al MySQL externo.',
      },
      {
        id: 'c',
        text: '/var/lib/mysql',
        explanation:
          'Eso es una ruta de datos, no un host de conexión.',
      },
      {
        id: 'd',
        text: 'sites-enabled',
        explanation:
          'Eso pertenece a Apache.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. El nombre del contenedor funciona como host dentro de la red Docker.',
    incorrectFeedback:
      'La respuesta correcta era mysql, porque ambos contenedores comparten red.',
  },
  {
    id: 'practica2-4',
    moduleId: 'docker-practica-multicontenedor',
    prompt: 'En una arquitectura WordPress + MySQL + Adminer, ¿qué servicios normalmente necesitan puertos publicados al host?',
    options: [
      {
        id: 'a',
        text: 'WordPress y Adminer, porque se acceden desde navegador',
        explanation:
          'MySQL puede quedar solo en la red interna si lo consumen otros contenedores.',
      },
      {
        id: 'b',
        text: 'Solo MySQL, porque siempre se abre en navegador',
        explanation:
          'MySQL no se usa normalmente desde navegador directamente.',
      },
      {
        id: 'c',
        text: 'Ninguno, porque Docker no usa puertos',
        explanation:
          'Docker sí usa publicación de puertos para exponer servicios al host.',
      },
      {
        id: 'd',
        text: 'Solo el volumen',
        explanation:
          'Los volúmenes no son servicios de red.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Se publican los servicios que el usuario debe abrir desde el host.',
    incorrectFeedback:
      'La respuesta correcta era WordPress y Adminer; MySQL puede comunicarse internamente.',
  },
  {
    id: 'practica2-5',
    moduleId: 'docker-practica-multicontenedor',
    prompt: '¿Qué ventaja aporta recrear MySQL usando el mismo volumen?',
    options: [
      {
        id: 'a',
        text: 'Los datos de la base permanecen disponibles aunque el contenedor se haya eliminado',
        explanation:
          'El volumen vive fuera del ciclo de vida del contenedor.',
      },
      {
        id: 'b',
        text: 'Elimina automáticamente WordPress',
        explanation:
          'Reusar un volumen no elimina otros servicios.',
      },
      {
        id: 'c',
        text: 'Impide que Adminer se conecte',
        explanation:
          'La persistencia no impide la conexión si la red y credenciales están bien.',
      },
      {
        id: 'd',
        text: 'Cambia Apache de puerto 80 a 443',
        explanation:
          'No tiene relación con Apache.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Esa es la idea central de persistencia con volúmenes.',
    incorrectFeedback:
      'La respuesta correcta era conservar datos aunque el contenedor cambie.',
  },
]
