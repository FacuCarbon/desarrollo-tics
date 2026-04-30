import type { QuizQuestion, StudyModule } from '../types/study'

export const studyModules: StudyModule[] = [
  {
    id: 'sociedad-tic',
    title: 'Sociedad de la Información y TIC',
    shortLabel: 'TIC',
    summary:
      'Explica por qué la información es el recurso central de la actualidad y cómo las TIC permiten producirla, almacenarla, compartirla y usarla.',
    focusAreas: [
      'La información como recurso estratégico de la economía y la cultura actual.',
      'Definición de TIC: computadoras, celulares, internet, software y servicios relacionados.',
      'Interactividad: ida y vuelta entre usuario y sistema.',
      'Instantaneidad: circulación de información en tiempo real sin importar la distancia.',
    ],
    deepDive: [
      'Si te preguntan por sociedad de la información, no alcanza con decir “hay tecnología”: hay que remarcar que el valor está en producir, guardar y distribuir información.',
      'Las TIC no son solo aparatos; son herramientas para trabajar con información y comunicación.',
      'Interactividad e instantaneidad son claves porque distinguen a estas tecnologías de medios más pasivos o lentos.',
    ],
    practiceTips: [
      'Intentá explicar con un ejemplo cotidiano cómo una app combina información, comunicación e instantaneidad.',
      'Prepará una respuesta corta donde conectes información, TIC y redes en una sola idea.',
      'Si aparece una consigna teórica, usá vocabulario preciso: recurso, almacenamiento, distribución, interacción.',
    ],
  },
  {
    id: 'redes-dispositivos',
    title: 'Redes, Alcance y Dispositivos',
    shortLabel: 'Redes',
    summary:
      'Resume qué es una red, cómo se clasifican por alcance y qué rol cumplen dispositivos como router y switch dentro de una infraestructura.',
    focusAreas: [
      'Definición de red como conjunto de dispositivos conectados para compartir información y recursos.',
      'Tipos de red: PAN, LAN, MAN y WAN.',
      'Router: conecta redes distintas y suele actuar como gateway, NAT y DHCP.',
      'Switch: conecta equipos dentro de una misma red usando direcciones MAC.',
    ],
    deepDive: [
      'La clasificación PAN-LAN-MAN-WAN suele evaluarse con ejemplos concretos, así que conviene asociar cada tipo a una situación real.',
      'Router y switch se confunden mucho: el router conecta tu red con otras redes; el switch organiza comunicación interna.',
      'Cuando aparezca Internet en una respuesta, ubicala como ejemplo de WAN.',
    ],
    practiceTips: [
      'Hacé un cuadro comparando PAN, LAN, MAN y WAN por alcance y ejemplo.',
      'Explicá con tus palabras qué hace el router de tu casa y qué problema resuelve.',
      'Pensá un caso donde necesites más puertos dentro de la misma red: ahí aparece el switch.',
    ],
  },
  {
    id: 'protocolos-modelos',
    title: 'Protocolos, Direccionamiento y Modelos',
    shortLabel: 'Protocolos',
    summary:
      'Agrupa los conceptos que ordenan la comunicación: TCP, UDP, IP, DNS, NAT, DHCP, gateway y la diferencia entre los modelos OSI y TCP/IP.',
    focusAreas: [
      'Protocolo como conjunto de reglas que hace posible la comunicación entre dispositivos.',
      'TCP vs UDP: confiabilidad frente a velocidad.',
      'Conceptos de red: IP, DNS, NAT, DHCP y gateway.',
      'OSI como modelo teórico de 7 capas y TCP/IP como modelo práctico de 4 capas.',
    ],
    deepDive: [
      'TCP no es “mejor” que UDP en todo: uno prioriza orden y garantía, el otro velocidad y menor sobrecarga.',
      'DNS, NAT y DHCP suelen aparecer juntos en ejercicios porque cumplen funciones distintas pero complementarias.',
      'OSI sirve para estudiar y diagnosticar; TCP/IP describe mejor cómo funciona Internet en la práctica.',
    ],
    practiceTips: [
      'Prepará una comparación de TCP y UDP con uso, velocidad y garantía de entrega.',
      'Explicá el recorrido simplificado de entrar a una web usando DNS, IP y gateway.',
      'Memorizá una frase corta para OSI y otra para TCP/IP, sin mezclar teoría con implementación.',
    ],
  },
  {
    id: 'linux-shell',
    title: 'Linux, Shell y Administración Básica',
    shortLabel: 'Linux',
    summary:
      'Cubre el enfoque general de Linux, la diferencia entre kernel y shell, y los comandos más importantes de navegación, archivos, procesos y red.',
    focusAreas: [
      'Linux como sistema operativo open source usado en infraestructura real.',
      'Kernel como núcleo que interactúa con el hardware.',
      'Shell como interfaz donde se escriben comandos para interactuar con el sistema.',
      'Comandos clave: navegación, archivos, procesos, red y utilidades generales.',
    ],
    deepDive: [
      'Kernel y shell no cumplen el mismo rol: uno controla el sistema, el otro interpreta lo que escribe el usuario.',
      'Muchos comandos conviene estudiarlos por categoría para recordar mejor cuándo usar cada uno.',
      'En Linux los comandos no se memorizan aislados: hay que entender qué transforman o consultan.',
    ],
    practiceTips: [
      'Agrupá comandos en navegación, archivos, procesos y red para repasarlos más rápido.',
      'Intentá describir una mini rutina: ver dónde estás, entrar a una carpeta, crear archivo y revisar procesos.',
      'Prestá atención a comandos destructivos como rm y rm -r, porque suelen aparecer en preguntas trampa.',
    ],
  },
  {
    id: 'ejercicios-parcial',
    title: 'Ejercicios de Configuración de Red y Comandos',
    shortLabel: 'Ejercicios',
    summary:
      'Incluye los temas que el profesor marcó aparte del PDF: ejercicios de configuración de red y de uso/combinación de comandos en terminal.',
    focusAreas: [
      'Identificar IP, gateway, DNS y DHCP dentro de una configuración básica.',
      'Entender cuándo una IP se asigna automática o manualmente.',
      'Resolver secuencias de comandos usando rutas, redirección y pipes.',
      'Elegir el comando correcto según la tarea: listar, moverse, copiar, matar procesos o consultar conectividad.',
    ],
    deepDive: [
      'En ejercicios de red casi siempre conviene ubicar primero qué dato identifica al equipo, cuál permite salir y cuál traduce nombres.',
      'En ejercicios de comandos, una orden puede ser correcta conceptualmente pero incorrecta si borra, sobrescribe o apunta al lugar equivocado.',
      'Los pipes y redirecciones aparecen porque permiten encadenar herramientas simples para resolver tareas más completas.',
    ],
    practiceTips: [
      'Ensayá explicar para qué sirven IP, gateway y DNS dentro de una red hogareña.',
      'Armá ejercicios cortos con comandos como ls, cd, mkdir, cp, mv, rm, ps, kill, ping, curl y chmod.',
      'Practicá reconocer cuándo usar >, >> y | según si querés sobrescribir, agregar o filtrar salida.',
    ],
  },
]

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'tic-1',
    moduleId: 'sociedad-tic',
    prompt: '¿Qué idea define mejor a la sociedad de la información?',
    options: [
      {
        id: 'a',
        text: 'La tierra volvió a ser el recurso más valioso',
        explanation:
          'Eso contradice el resumen: el foco actual está en la información como recurso estratégico.',
      },
      {
        id: 'b',
        text: 'La información es un recurso central de la economía y la cultura',
        explanation:
          'Esa es la idea principal del tema: producir, almacenar y distribuir información mueve gran parte de la vida actual.',
      },
      {
        id: 'c',
        text: 'Solo importa la velocidad de las computadoras',
        explanation:
          'La velocidad puede influir, pero no define el concepto de sociedad de la información.',
      },
      {
        id: 'd',
        text: 'Internet reemplaza por completo a las organizaciones',
        explanation:
          'Es una afirmación exagerada e incorrecta; la red es una herramienta, no un reemplazo total de estructuras sociales.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Bien. Lo importante es entender que el valor ya no está solo en recursos materiales, sino en generar, guardar y circular información.',
    incorrectFeedback:
      'La respuesta correcta apuntaba a la información como recurso clave. El tema no habla solo de aparatos o velocidad, sino del valor estratégico de la información.',
  },
  {
    id: 'tic-2',
    moduleId: 'sociedad-tic',
    prompt: '¿Cuál de estas opciones describe mejor a las TIC?',
    options: [
      {
        id: 'a',
        text: 'Herramientas para trabajar con información y comunicación',
        explanation:
          'Computadoras, celulares, internet y software entran en esta definición general.',
      },
      {
        id: 'b',
        text: 'Solo redes físicas y cables',
        explanation:
          'Las TIC incluyen mucho más que la capa física de conexión.',
      },
      {
        id: 'c',
        text: 'Únicamente programas de edición de texto',
        explanation:
          'Es un ejemplo posible, pero no define el conjunto de las TIC.',
      },
      {
        id: 'd',
        text: 'Cualquier máquina que no use información',
        explanation:
          'Eso va en contra de la definición: justamente las TIC trabajan con información.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. Las TIC son el conjunto de tecnologías y herramientas que permiten gestionar información y comunicación.',
    incorrectFeedback:
      'La definición correcta es más amplia. Las TIC no son solo cables o un programa puntual: abarcan herramientas para trabajar con información y comunicación.',
  },
  {
    id: 'tic-3',
    moduleId: 'sociedad-tic',
    prompt: '¿Qué significa instantaneidad dentro de las TIC?',
    options: [
      {
        id: 'a',
        text: 'Que la información viaja en tiempo real',
        explanation:
          'La idea central es la rapidez de circulación sin importar la distancia.',
      },
      {
        id: 'b',
        text: 'Que no hace falta red para comunicarse',
        explanation:
          'La conectividad sigue siendo necesaria; la instantaneidad no elimina la red.',
      },
      {
        id: 'c',
        text: 'Que el usuario nunca interactúa con el sistema',
        explanation:
          'Eso contradice la característica de interactividad.',
      },
      {
        id: 'd',
        text: 'Que toda la información queda guardada para siempre',
        explanation:
          'Persistencia y almacenamiento no son lo mismo que instantaneidad.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Muy bien. Instantaneidad apunta a la circulación inmediata de la información.',
    incorrectFeedback:
      'La clave era asociar instantaneidad con tiempo real. No habla de almacenamiento ni de ausencia de interacción.',
  },
  {
    id: 'red-1',
    moduleId: 'redes-dispositivos',
    prompt: '¿Qué tipo de red representa mejor a Internet?',
    options: [
      {
        id: 'a',
        text: 'PAN',
        explanation:
          'PAN cubre distancias muy cortas, como Bluetooth entre dispositivos cercanos.',
      },
      {
        id: 'b',
        text: 'LAN',
        explanation:
          'LAN es una red local, como la de una casa o escuela.',
      },
      {
        id: 'c',
        text: 'MAN',
        explanation:
          'MAN cubre una ciudad o zona metropolitana, no escala global.',
      },
      {
        id: 'd',
        text: 'WAN',
        explanation:
          'WAN abarca grandes distancias, incluso países y continentes; Internet es el ejemplo típico.',
      },
    ],
    correctOptionId: 'd',
    correctFeedback:
      'Correcto. Internet se toma como ejemplo clásico de WAN por su alcance global.',
    incorrectFeedback:
      'La respuesta correcta era WAN. PAN, LAN y MAN cubren escalas más chicas que Internet.',
  },
  {
    id: 'red-2',
    moduleId: 'redes-dispositivos',
    prompt: '¿Cuál es la función principal de un router?',
    options: [
      {
        id: 'a',
        text: 'Conectar dispositivos dentro de la misma red usando MAC',
        explanation:
          'Esa es la función más asociada al switch.',
      },
      {
        id: 'b',
        text: 'Conectar redes distintas, como tu red doméstica con Internet',
        explanation:
          'Ese es el rol central del router, además de gateway y muchas veces NAT/DHCP.',
      },
      {
        id: 'c',
        text: 'Mostrar procesos activos del sistema',
        explanation:
          'Eso corresponde a comandos del sistema operativo, no a un dispositivo de red.',
      },
      {
        id: 'd',
        text: 'Traducir nombres de dominio a IP',
        explanation:
          'Eso corresponde a DNS.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Bien. El router une redes distintas y suele actuar como punto de salida hacia Internet.',
    incorrectFeedback:
      'El error típico es confundir router con switch. El router conecta redes; el switch organiza comunicación dentro de una misma red.',
  },
  {
    id: 'red-3',
    moduleId: 'redes-dispositivos',
    prompt: '¿Qué característica distingue al switch frente a un hub?',
    options: [
      {
        id: 'a',
        text: 'Asigna nombres de dominio automáticamente',
        explanation:
          'La asignación de nombres no es su función; eso no describe ni switch ni hub.',
      },
      {
        id: 'b',
        text: 'Sabe a qué dispositivo enviar cada dato usando direcciones MAC',
        explanation:
          'Esa inteligencia de conmutación es la diferencia clave frente al hub.',
      },
      {
        id: 'c',
        text: 'Siempre conecta la red local con Internet',
        explanation:
          'Esa función se asocia más al router.',
      },
      {
        id: 'd',
        text: 'Reemplaza al sistema operativo del equipo',
        explanation:
          'No tiene relación con el rol real de un switch.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Exacto. El switch dirige mejor el tráfico porque identifica a qué equipo debe enviar cada dato.',
    incorrectFeedback:
      'La diferencia importante era el uso de direcciones MAC para mandar datos al destino correcto en vez de enviarlos a todos.',
  },
  {
    id: 'proto-1',
    moduleId: 'protocolos-modelos',
    prompt: '¿Qué opción describe mejor a TCP frente a UDP?',
    options: [
      {
        id: 'a',
        text: 'TCP prioriza la entrega ordenada y confiable',
        explanation:
          'TCP establece conexión, verifica y garantiza la entrega en orden.',
      },
      {
        id: 'b',
        text: 'TCP es más rápido porque no verifica nada',
        explanation:
          'Eso describe más a UDP que a TCP.',
      },
      {
        id: 'c',
        text: 'TCP solo sirve para videojuegos',
        explanation:
          'No; se usa en web, email y descargas, entre otros casos.',
      },
      {
        id: 'd',
        text: 'TCP nunca establece conexión previa',
        explanation:
          'Eso es incorrecto: el handshake es parte de su lógica.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Muy bien. TCP se asocia a confiabilidad y orden, aunque eso implique más sobrecarga.',
    incorrectFeedback:
      'La pista era diferenciar confiabilidad y rapidez. TCP garantiza más; UDP sacrifica control para ganar velocidad.',
  },
  {
    id: 'proto-2',
    moduleId: 'protocolos-modelos',
    prompt: '¿Para qué sirve DNS?',
    options: [
      {
        id: 'a',
        text: 'Para traducir nombres legibles a direcciones IP',
        explanation:
          'Esa es la función central de DNS dentro de Internet.',
      },
      {
        id: 'b',
        text: 'Para asignar direcciones IP automáticamente',
        explanation:
          'Esa función corresponde a DHCP, no a DNS.',
      },
      {
        id: 'c',
        text: 'Para compartir una sola IP pública entre varios equipos',
        explanation:
          'Esa función se asocia a NAT, no a DNS.',
      },
      {
        id: 'd',
        text: 'Para definir la puerta de salida hacia otras redes',
        explanation:
          'Eso describe al gateway, no a DNS.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. DNS funciona como una guía que convierte nombres de dominio en direcciones IP.',
    incorrectFeedback:
      'DNS está vinculado con nombres e IPs. No resuelve permisos, compresión ni procesos.',
  },
  {
    id: 'proto-3',
    moduleId: 'protocolos-modelos',
    prompt: '¿Cuál es la diferencia más importante entre OSI y TCP/IP según el resumen?',
    options: [
      {
        id: 'a',
        text: 'OSI es teórico y TCP/IP es práctico',
        explanation:
          'OSI se usa mucho para estudiar y diagnosticar; TCP/IP refleja la implementación real de Internet.',
      },
      {
        id: 'b',
        text: 'OSI se usa en casas y TCP/IP solo en universidades',
        explanation:
          'La diferencia no es geográfica ni de tipo de institución.',
      },
      {
        id: 'c',
        text: 'OSI tiene menos capas que TCP/IP',
        explanation:
          'Es al revés: OSI tiene 7 capas y TCP/IP 4.',
      },
      {
        id: 'd',
        text: 'TCP/IP solo sirve para Linux',
        explanation:
          'TCP/IP es la base práctica de Internet, no algo exclusivo de Linux.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. Esa síntesis sirve mucho para examen: OSI ayuda a entender; TCP/IP ayuda a implementar.',
    incorrectFeedback:
      'La respuesta correcta separaba teoría y práctica. También convenía recordar la cantidad de capas: 7 en OSI y 4 en TCP/IP.',
  },
  {
    id: 'linux-1',
    moduleId: 'linux-shell',
    prompt: '¿Qué parte de Linux interactúa directamente con el hardware?',
    options: [
      {
        id: 'a',
        text: 'El kernel',
        explanation:
          'El kernel es el núcleo y el único que habla directamente con CPU, memoria y disco.',
      },
      {
        id: 'b',
        text: 'La shell',
        explanation:
          'La shell interpreta comandos del usuario, pero no reemplaza al kernel.',
      },
      {
        id: 'c',
        text: 'El comando ls',
        explanation:
          'ls es una herramienta puntual, no una parte estructural del sistema.',
      },
      {
        id: 'd',
        text: 'El navegador',
        explanation:
          'Un navegador es una aplicación, no el núcleo del sistema operativo.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. El kernel es el núcleo del sistema y quien trata directamente con el hardware.',
    incorrectFeedback:
      'Kernel y shell se confunden fácil. La shell recibe tus comandos; el kernel controla el vínculo con el hardware.',
  },
  {
    id: 'linux-2',
    moduleId: 'linux-shell',
    prompt: '¿Qué hace el comando `cd ..`?',
    options: [
      {
        id: 'a',
        text: 'Borra la carpeta actual',
        explanation:
          'No elimina nada; solo cambia de ubicación en el sistema de archivos.',
      },
      {
        id: 'b',
        text: 'Sube al directorio padre',
        explanation:
          'Los dos puntos representan un nivel arriba en la estructura de carpetas.',
      },
      {
        id: 'c',
        text: 'Lista archivos ocultos',
        explanation:
          'Eso se relaciona más con `ls -la`.',
      },
      {
        id: 'd',
        text: 'Muestra procesos activos',
        explanation:
          'Los procesos se consultan con herramientas como `ps` o `top`.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Correcto. `cd ..` te mueve a la carpeta padre, un nivel arriba.',
    incorrectFeedback:
      'Era una pregunta de navegación. `cd ..` no lista ni borra: cambia al directorio padre.',
  },
  {
    id: 'linux-3',
    moduleId: 'linux-shell',
    prompt: '¿Qué comando se usa para terminar un proceso conociendo su PID?',
    options: [
      {
        id: 'a',
        text: 'ps PID',
        explanation:
          'ps sirve para listar procesos, pero no para terminarlos.',
      },
      {
        id: 'b',
        text: 'kill PID',
        explanation:
          'Ese comando finaliza un proceso a partir de su identificador.',
      },
      {
        id: 'c',
        text: 'top PID',
        explanation:
          'top muestra procesos en vivo, pero no finaliza uno con ese formato.',
      },
      {
        id: 'd',
        text: 'mv PID',
        explanation:
          'mv mueve o renombra archivos y carpetas; no administra procesos.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Muy bien. `kill PID` termina un proceso usando el identificador obtenido por `ps` o `top`.',
    incorrectFeedback:
      'La clave era relacionar procesos con su PID. `kill` es el comando específico para finalizarlos.',
  },
  {
    id: 'ej-1',
    moduleId: 'ejercicios-parcial',
    prompt: 'En un ejercicio de configuración de red, ¿qué dato identifica de manera única a un dispositivo dentro de la red?',
    options: [
      {
        id: 'a',
        text: 'La dirección IP',
        explanation:
          'La IP funciona como la dirección del dispositivo dentro de la red.',
      },
      {
        id: 'b',
        text: 'La puerta de enlace o gateway',
        explanation:
          'El gateway indica por dónde sale la red, pero no identifica de forma única al equipo.',
      },
      {
        id: 'c',
        text: 'El servidor DNS',
        explanation:
          'El DNS traduce nombres a IP, pero no identifica al dispositivo dentro de la red.',
      },
      {
        id: 'd',
        text: 'La máscara de subred',
        explanation:
          'La máscara define el alcance lógico de la red, pero no identifica un equipo puntual.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Bien. En ejercicios de configuración, la IP es el dato básico para identificar al equipo en la red.',
    incorrectFeedback:
      'La respuesta correcta era IP. El resto de las opciones pertenecen a usuarios, comandos o permisos, no a configuración de red.',
  },
  {
    id: 'ej-2',
    moduleId: 'ejercicios-parcial',
    prompt: 'Si una consigna dice que no querés configurar la IP manualmente, ¿qué servicio debería estar activo?',
    options: [
      {
        id: 'a',
        text: 'DHCP',
        explanation:
          'DHCP asigna IPs automáticamente cuando un dispositivo se conecta.',
      },
      {
        id: 'b',
        text: 'DNS',
        explanation:
          'DNS traduce nombres a IP, pero no asigna direcciones.',
      },
      {
        id: 'c',
        text: 'NAT',
        explanation:
          'NAT comparte una IP pública hacia Internet, pero no entrega IPs privadas automáticamente.',
      },
      {
        id: 'd',
        text: 'Gateway',
        explanation:
          'El gateway es la salida hacia otras redes, no el servicio que asigna IP automáticamente.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Correcto. DHCP evita la configuración manual asignando parámetros de red de forma automática.',
    incorrectFeedback:
      'En configuración de red, DHCP es el servicio que entrega IPs automáticamente. DNS y otros comandos cumplen funciones distintas.',
  },
  {
    id: 'ej-3',
    moduleId: 'ejercicios-parcial',
    prompt: '¿Qué operador de redirección agrega texto al final de un archivo sin borrar el contenido previo?',
    options: [
      {
        id: 'a',
        text: '>',
        explanation:
          'Ese operador sobrescribe el contenido existente.',
      },
      {
        id: 'b',
        text: '>>',
        explanation:
          'Ese operador agrega al final del archivo sin borrar lo que ya estaba.',
      },
      {
        id: 'c',
        text: '|',
        explanation:
          'El pipe envía salida de un comando como entrada de otro, no agrega texto a un archivo.',
      },
      {
        id: 'd',
        text: '<',
        explanation:
          'Ese símbolo se usa como redirección de entrada, no para agregar texto al final de un archivo.',
      },
    ],
    correctOptionId: 'b',
    correctFeedback:
      'Muy bien. `>>` sirve para anexar información al final de un archivo.',
    incorrectFeedback:
      'La diferencia importante era entre sobrescribir y agregar. `>` pisa el contenido; `>>` lo conserva y agrega al final.',
  },
  {
    id: 'ej-4',
    moduleId: 'ejercicios-parcial',
    prompt: '¿Qué comando elegirías en un ejercicio si te piden verificar conectividad con otro equipo o servidor?',
    options: [
      {
        id: 'a',
        text: 'ping host',
        explanation:
          'Ese es el comando clásico para comprobar si hay respuesta de otro equipo o servidor.',
      },
      {
        id: 'b',
        text: 'curl host',
        explanation:
          'curl interactúa con URLs o servicios web, pero no es la herramienta básica para comprobar conectividad simple entre hosts.',
      },
      {
        id: 'c',
        text: 'wget host',
        explanation:
          'wget descarga recursos, pero no se usa como prueba básica de alcance hacia otro host.',
      },
      {
        id: 'd',
        text: 'ps host',
        explanation:
          'ps muestra procesos del sistema local; no verifica conexión con otro equipo.',
      },
    ],
    correctOptionId: 'a',
    correctFeedback:
      'Exacto. `ping` es la herramienta básica para probar conectividad de red.',
    incorrectFeedback:
      'La consigna pedía conectividad. Entre las opciones, solo `ping` se usa para verificar comunicación con otro host.',
  },
]
