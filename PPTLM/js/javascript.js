// =====================================
//  Proyecto RA 03: PPTLS
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Búsqueda de elementos interactivos en el DOM
    const botonesEleccion = document.querySelectorAll('.boton-eleccion-jugada');

    const displayUsuario = document.getElementById("display-usuario");
    const displayCpu = document.getElementById("display-cpu");
    const mensajeResultado = document.getElementById("mensaje-resultado");

    const contadorVictorias = document.getElementById("contador-victorias");
    const contadorDerrotas = document.getElementById("contador-derrotas");
    const contadorEmpates = document.getElementById("contador-empates");

    const btnReiniciar = document.getElementById("btnReiniciar");
    const btnReglas = document.getElementById("btnReglas");

    // Variables de estadísticas
    let victorias = 0;
    let derrotas = 0;
    let empates = 0;

    // Constantes de soporte
    const opcionesValidas = ['piedra', 'papel', 'tijera', 'lagarto', 'spock'];

    const iconosJugada = {
        piedra: '🪨',
        papel: '📄',
        tijera: '✂️',
        lagarto: '🦎',
        spock: '🖖'
    };

    const reglasVenceA = {
        piedra: ['tijera', 'lagarto'],
        papel: ['piedra', 'spock'],
        tijera: ['papel', 'lagarto'],
        lagarto: ['papel', 'spock'],
        spock: ['piedra', 'tijera']
    };

    /**
     * @brief Inicializa el juego configurando los elementos, estados y eventos necesarios.
     *
     * Esta función prepara todo lo necesario para que el juego pueda comenzar,
     * incluyendo la configuración de la interfaz, los valores iniciales de los
     * jugadores y la vinculación de eventos a los controles.
     *
     * @return {void} No devuelve ningún valor.
     */
    function inicializarJuego() {
        try {
            botonesEleccion.forEach(boton => {
                boton.addEventListener('click', () => {
                    const eleccion = boton.getAttribute('data-jugada');
                    jugar(eleccion);
                });
            });

            if (btnReiniciar) {
                btnReiniciar.addEventListener('click', resetearJuego);
            }
            if (btnReglas) {
                btnReglas.addEventListener('click', mostrarReglas);
            }
        } catch (error) {
            console.log("Error al inicializar los botones del juego:", error);
        }
    }

    /**
     * @brief Ejecuta una ronda del juego con la elección del usuario.
     *
     * Esta función realiza los siguientes pasos:
     * 1. Reinicia los displays del juego.
     * 2. Genera la elección de la CPU de forma aleatoria.
     * 3. Muestra la elección del usuario y de la CPU con animaciones.
     * 4. Calcula el resultado de la ronda.
     * 5. Muestra el resultado y actualiza los contadores correspondientes.
     *
     * @param {string} eleccionUsuario La elección realizada por el usuario (por ejemplo: "piedra", "papel", "tijera"...).
     * @return {void} No devuelve ningún valor.
     */
    function jugar(eleccionUsuario) {
        try {
            reiniciarDisplays();
            const eleccionCPU = obtenerEleccionCPU();

            mostrarEleccion(displayUsuario, eleccionUsuario, 'TÚ');

            setTimeout(() => {
                mostrarEleccion(displayCpu, eleccionCPU, 'CPU');
                
                const resultadoFinal = calcularResultadoJugada(eleccionUsuario, eleccionCPU);
                mostrarResultadoJugada(resultadoFinal, eleccionUsuario, eleccionCPU);
            }, 500);

        } catch (error) {
            console.log("Error al ejecutar la jugada:", error);
        }
    }

    /**
     * @brief Genera aleatoriamente la elección de la CPU.
     *
     * Esta función selecciona una opción al azar entre las disponibles y la devuelve.
     *
     * @return {string} La elección de la CPU (por ejemplo: "piedra", "papel" o "tijera"...).
     */
    function obtenerEleccionCPU() {
        try {
            const aleatorio = Math.floor(Math.random() * opcionesValidas.length);
            return opcionesValidas[aleatorio];
        } catch (error) {
            console.log("Error al obtener la elección de la CPU:", error);
            return "piedra"; 
        }
    }

    /**
     * @brief Muestra la elección de un jugador (jugador humano o CPU) en un display con icono y texto.
     *
     * Esta función limpia el contenido del display, aplica la clase
     * para animación/estilo y agrega los elementos que representan
     * la jugada seleccionada (emoji y texto) del jugador indicado.
     *
     * @param {HTMLElement} display El contenedor donde se mostrará la elección.
     * @param {string} eleccion La clave de la elección (por ejemplo: "piedra", "papel", "tijera"...).
     * @param {string} jugador Nombre del jugador que realizó la elección (por ejemplo: "JUGADOR" o "CPU").
     * @return {void} No devuelve ningún valor.
     */
    function mostrarEleccion(display, eleccion, jugador) {
        try {
            if (!display) return;
            
            display.innerHTML = '';
            display.classList.add('active'); 

            const contenedorInterno = document.createElement("div");
            contenedorInterno.style.display = "flex";
            contenedorInterno.style.alignItems = "center";
            contenedorInterno.style.gap = "10px";
            
            const divIcon = document.createElement('div');
            divIcon.classList.add('icono-jugada-grande');
            divIcon.textContent = iconosJugada[eleccion];
            
            const divTexto = document.createElement('div');
            divTexto.classList.add('texto-jugada');
            divTexto.style.marginTop = "0"; 
            divTexto.textContent = eleccion.charAt(0).toUpperCase() + eleccion.slice(1);
            
            contenedorInterno.appendChild(divIcon);
            contenedorInterno.appendChild(divTexto);
            
            display.appendChild(contenedorInterno);
            
        } catch (error) {
            console.log("Error al mostrar la elección en el display:", error);
        }
    }

    /**
     * @brief Reinicia los displays del juego a su estado inicial.
     *
     * Esta función restablece el contenido de los displays del usuario y de la CPU,
     * elimina cualquier clase de animación activa y restablece el mensaje de resultado
     * al texto predeterminado "¡Batalla!".
     *
     * @return {void} No devuelve ningún valor.
     */
    function reiniciarDisplays() {
        try {
            if(displayUsuario) {
                displayUsuario.innerHTML = '<div class="placeholder">?</div>';
                displayUsuario.classList.remove('active');
            }
            if(displayCpu) {
                displayCpu.innerHTML = '<div class="placeholder">?</div>';
                displayCpu.classList.remove('active');
            }
            if(mensajeResultado) {
                mensajeResultado.textContent = '¡Batalla!';
                mensajeResultado.classList.remove('ganador', 'perdedor', 'empate');
            }
        } catch (error) {
            console.log("Error al reiniciar los displays del juego:", error);
        }
    }

    /**
     * @brief Calcula el resultado de una ronda entre el usuario y la CPU.
     *
     * Esta función compara la elección del usuario con la elección de la CPU
     * y determina si la ronda termina en victoria, derrota o empate según
     * las reglas del juego.
     *
     * @param {string} usuario La elección del usuario (por ejemplo: "piedra", "papel", "tijera"...).
     * @param {string} cpu La elección de la CPU (por ejemplo: "piedra", "papel", "tijera"...).
     * @return {string} El resultado de la ronda: "victoria", "derrota" o "empate".
     */
    function calcularResultadoJugada(usuario, cpu) {
        try {
            if (usuario === cpu) {
                return 'empate';
            }
            if (reglasVenceA[usuario].includes(cpu)) {
                return 'victoria';
            } else {
                return 'derrota';
            }
        } catch (error) {
            console.log("Error al calcular el resultado de la jugada:", error);
            return 'empate';
        }
    }

    /**
     * @brief Muestra el resultado de una ronda en la interfaz del juego.
     *
     * Esta función actualiza el mensaje de resultado según si el usuario ganó,
     * perdió o empató, aplica la clase correspondiente para estilos y
     * actualiza los contadores de victorias, derrotas o empates.
     *
     * @param {string} resultado Resultado de la ronda: "victoria", "derrota" o "empate".
     * @param {string} usuario Elección del usuario (por ejemplo: "piedra", "papel", "tijera"...).
     * @param {string} cpu Elección de la CPU (por ejemplo: "piedra", "papel", "tijera"...).
     * @return {void} No devuelve ningún valor.
     */
    function mostrarResultadoJugada(resultado, usuario, cpu) {
        try {
            if (!mensajeResultado) return;
            mensajeResultado.classList.remove('ganador', 'perdedor', 'empate');
            
            const strUsuario = usuario.charAt(0).toUpperCase() + usuario.slice(1);
            const strCpu = cpu.charAt(0).toUpperCase() + cpu.slice(1);

            switch(resultado) {
                case 'victoria':
                    victorias++;
                    mensajeResultado.textContent = `¡Ganaste! ${strUsuario} vence a ${strCpu}`;
                    mensajeResultado.classList.add('ganador');
                    break;
                case 'derrota':
                    derrotas++;
                    mensajeResultado.textContent = `Perdiste... ${strCpu} vence a ${strUsuario}`;
                    mensajeResultado.classList.add('perdedor');
                    break;
                case 'empate':
                    empates++;
                    mensajeResultado.textContent = `Empate. Los dos eligieron ${strUsuario}`;
                    mensajeResultado.classList.add('empate');
                    break;
            }

            actualizarContadores();

        } catch (error) {
            console.log("Error al mostrar el resultado en pantalla:", error);
        }
    }

    /**
     * @brief Actualiza los contadores de victorias, derrotas y empates en la interfaz.
     *
     * Esta función refleja los valores actuales de las variables globales
     * victorias, derrotas y empates en los elementos del DOM correspondientes.
     *
     * @return {void} No devuelve ningún valor.
     */
    function actualizarContadores() {
        try {
            if(contadorVictorias) contadorVictorias.textContent = victorias;
            if(contadorDerrotas) contadorDerrotas.textContent = derrotas;
            if(contadorEmpates) contadorEmpates.textContent = empates;
        } catch (error) {
            console.log("Error al actualizar los contadores HTML:", error);
        }
    }

    /**
     * @brief Inicializa los tooltips de los botones de elección.
     *
     * Esta función recorre todos los botones de elección, obtiene la jugada
     * asociada a cada uno y configura el atributo `title` para mostrar
     * un tooltip indicando qué opciones vence esa jugada.
     *
     * @return {void} No devuelve ningún valor.
     */
    function inicializarTooltips() {
        try {
            botonesEleccion.forEach(boton => {
                const jugada = boton.getAttribute('data-jugada');
                const objetivo = reglasVenceA[jugada];
                
                const mayus = jugada.charAt(0).toUpperCase() + jugada.slice(1);
                const p1 = objetivo[0].charAt(0).toUpperCase() + objetivo[0].slice(1);
                const p2 = objetivo[1].charAt(0).toUpperCase() + objetivo[1].slice(1);
                
                boton.setAttribute('title', `${mayus} vence a: ${p1} y ${p2}`);
            });
        } catch (error) {
            console.log("Error al inicializar los tooltips de los botones:", error);
        }
    }

    /**
     * @brief Muestra las reglas completas del juego en la consola.
     *
     * Esta función imprime un resumen de todas las reglas del juego,
     * indicando qué jugada vence a cuáles otras.
     *
     * @return {void} No devuelve ningún valor.
     */
    function mostrarReglas() {
        try {
            console.log("=== REGLAS: PPTLS ===");
            console.log("✂️ Tijera corta papel y decapita lagarto.");
            console.log("📄 Papel envuelve piedra y desautoriza Spock.");
            console.log("🪨 Piedra aplasta tijera y aplasta lagarto.");
            console.log("🦎 Lagarto envenena Spock y devora papel.");
            console.log("🖖 Spock rompe tijera y vaporiza piedra.");
            console.log("=====================");
            } catch (error) {
            console.log("Error al mostrar las reglas en la consola:", error);
        }
    }

    /**
     * @brief Reinicia el juego a su estado inicial.
     *
     * Esta función realiza las siguientes acciones:
     * - Restablece los contadores de victorias, derrotas y empates a cero.
     * - Reinicia los displays del juego.
     * - Actualiza los contadores en la interfaz.
     * - Muestra un mensaje temporal indicando que el juego ha sido reiniciado.
     *
     * @return {void} No devuelve ningún valor.
     */
    function resetearJuego() {
        console.log("=== JUEGO REINICIADO ===");
        try {
            victorias = 0;
            derrotas = 0;
            empates = 0;
            
            actualizarContadores();
            reiniciarDisplays();
            
            if (mensajeResultado) {
                mensajeResultado.textContent = '¡Juego Reiniciado!';
            }
        } catch (error) {
            console.log("Error al resetear los valores del juego:", error);
        }
    }

    // ==========================================
    // Inicialización y Eventos Finales
    // ==========================================
    
    try {
        // Efecto visual de carga
        setTimeout(() => {
            const contenedor = document.querySelector('main');
            if (contenedor) contenedor.style.opacity = '1';
        }, 100);

        inicializarJuego();
        inicializarTooltips();
        actualizarContadores();
        
        // Listener de teclado
        document.addEventListener('keydown', (event) => {
            try {
                switch(event.key.toLowerCase()) {
                    case '1': jugar('piedra'); break;
                    case '2': jugar('papel'); break;
                    case '3': jugar('tijera'); break;
                    case '4': jugar('lagarto'); break;
                    case '5': jugar('spock'); break;
                    case 'r': resetearJuego(); break;
                    case 's': mostrarReglas(); break;
                }
            } catch (error) {
                console.log("Error al procesar la pulsación del teclado:", error);
            }
        });
        
    } catch (error) {
        console.log("Error al arrancar los eventos principales:", error);
    }
});