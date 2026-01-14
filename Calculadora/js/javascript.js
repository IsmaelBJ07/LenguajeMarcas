// Variables globales
let numeroActual = '0';
let numeroAnterior = null;
let operadorActivo = null;
let resultadoMostrado = false;

// Elementos del DOM
const pantalla = document.getElementById('pantalla');
const btnPunto = document.getElementById('btn-punto');

/**
 * @brief Deshabilita el botón del punto decimal en la calculadora.
 * 
 * Cambia el estado del botón para evitar que el usuario introduzca múltiples puntos decimales en un mismo número.
 * Además, actualiza su clase CSS para reflejar visualmente que está deshabilitado.
 * 
 */
function deshabilitarPunto() {
    btnPunto.disabled = true;
    btnPunto.classList.add('btn-deshabilitado');
}

/**
 * @brief Habilita nuevamente el botón del punto decimal en la calculadora.
 * 
 * Esta función restaura la capacidad de usar el punto decimal, normalmente después de haber introducido una operación o un número válido.
 * Además, actualiza su clase CSS para reflejar visualmente que está activo.
 * 
 */
function habilitarPunto() {
    btnPunto.disabled = false;
    btnPunto.classList.remove('btn-deshabilitado');
}

/**
 * @brief Actualiza el contenido mostrado en la pantalla de la calculadora.
 * 
 * Esta función se encarga de mostrar en la pantalla el número con el que se opera, aplicando controles para evitar desbordamientos visuales o resultados demasiado largos.
 * 
 * - Si el número supera los 12 caracteres o no es finito, se redondea a 12 dígitos.
 * - Si el resultado redondeado es un número entero, elimina la parte decimal.
 * - Si tiene decimales, elimina ceros innecesarios al final.
 * - Si el número es corto y válido, se muestra tal cual.
 * 
 */
function actualizarPantalla() {
    let valorMostrar = numeroActual;
    
    // Si el número es muy largo o no es finito
    if (valorMostrar.length > 12 || !isFinite(parseFloat(valorMostrar))) {
        if (valorMostrar !== 'Error') {
            let num = parseFloat(valorMostrar);
            if (isFinite(num)) {
                valorMostrar = num.toPrecision(12);
                // Eliminar ceros innecesarios
                valorMostrar = parseFloat(valorMostrar).toString();
            }
        }
    }
    
    pantalla.textContent = valorMostrar;
}

/**
 * @brief Muestra un número en la pantalla gestionando correctamente la entrada.
 * 
 * Esta función controla la lógica al introducir un dígito en la calculadora:
 * 
 * - Si previamente se ha mostrado un resultado de una operación, se inicia una nueva entrada reemplazando el valor actual por el número pulsado.
 * - Si el valor actual es 0, se sustituye por el nuevo número pulsado para evitar acumulación de ceros a la izquierda.
 * - En cualquier otro caso permite formar números de varias cifras.
 * 
 * @param {string} numero - El dígito que el usuario ha pulsado (0–9).
 * 
 */
function mostrarNumeroPantalla(numero) {
    if (resultadoMostrado) {
        numeroActual = numero;
        resultadoMostrado = false;
        pantallaColorNormal();
        habilitarPunto();
    } else if (numeroActual === '0') {
        numeroActual = numero;
    } else {
        // Limitar a 12 dígitos totales
        if (numeroActual.length < 12) {
            numeroActual += numero;
        }
    }
    actualizarPantalla();
}

/**
 * @brief Agrega un punto decimal a la pantalla de la calculadora.
 * 
 * Comprueba si ya se ha mostrado un resultado o si el número actual no contiene un punto.
 * Si corresponde, agrega un punto y actualiza la pantalla.
 * Deshabilita el botón de punto para evitar múltiples decimales.
 */
function mostrarPuntoPantalla() {
    if (resultadoMostrado) {
        numeroActual = '0.';
        resultadoMostrado = false;
        pantallaColorNormal();
    } else if (!numeroActual.includes('.')) {
        numeroActual += '.';
    }
    deshabilitarPunto();
    actualizarPantalla();
}

/**
 * @brief Gestiona de forma correcta la operación matemática que hemos seleccionado (suma, resta, multiplicación, división).
 *  
 * Esta función gestiona la operación matemática seleccionada asegurando que:
 * 
 * - Se guarda la operación matemática seleccionada para luego aplicarla.
 * - Se guarda el número que había escrito en la pantalla.
 * - Se resetea la pantalla volviendo a poner el número a 0.
 * 
 */
function manejarOperador(operador) {
    if (operadorActivo !== null && !resultadoMostrado) {
        calcularOperacion();
    }
    
    numeroAnterior = parseFloat(numeroActual);
    operadorActivo = operador;
    numeroActual = '0';
    resultadoMostrado = false;
    habilitarPunto();
    actualizarPantalla();
}

/**
 * @brief Realiza la operación matemática indicada por el operador almacenado.
 * 
 * Esta función toma los valores de los números seleccionados por el usuario, aplica el operador seleccionado y muestra el resultado en pantalla.
 * Gestiona también el caso especial de división entre cero, mostrando "Error".
 * 
 */
function calcularOperacion() {
    if (operadorActivo === null || numeroAnterior === null) {
        return;
    }
    
    const num1 = numeroAnterior;
    const num2 = parseFloat(numeroActual);
    let resultado;
    
    switch (operadorActivo) {
        case '+':
            resultado = num1 + num2;
            break;
        case '-':
            resultado = num1 - num2;
            break;
        case '×':
            resultado = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                numeroActual = 'Error';
                pantalla.classList.remove('color-normal', 'color-suma', 'color-resta', 'color-multiplicacion', 'color-division', 'color-inverso', 'color-cuadrado', 'color-raiz');
                pantalla.classList.add('color-error');
                resultadoMostrado = true;
                operadorActivo = null;
                numeroAnterior = null;
                actualizarPantalla();
                return;
            }
            resultado = num1 / num2;
            break;
        default:
            return;
    }
    
    numeroActual = resultado.toString();
    aplicarColorResultado(operadorActivo);
    resultadoMostrado = true;
    numeroAnterior = null;
    operadorActivo = null;
    actualizarPantalla();
}

/**
 * @brief Restaura el color por defecto de la pantalla de la calculadora.
 * 
 * Establece la clase CSS correspondiente al estado visual normal de la pantalla.
 * 
 */
function pantallaColorNormal() {
    pantalla.classList.remove('color-error', 'color-suma', 'color-resta', 'color-multiplicacion', 'color-division', 'color-inverso', 'color-cuadrado', 'color-raiz');
    pantalla.classList.add('color-normal');
}

/**
 * @brief Borra el número introducido actualmente en la pantalla.
 * 
 * Restablece la entrada actual a 0.
 * 
 */
function borrarEntrada() {
    numeroActual = '0';
    habilitarPunto();
    pantallaColorNormal();
    actualizarPantalla();
}

/**
 * @brief Restablece completamente la calculadora a su estado inicial.
 * 
 * Reinicia todos los valores almacenados, incluidos el número actual, el número anterior, el operador activo y el indicador de resultado mostrado.
 * También actualiza la pantalla, restaura el color normal y habilita el punto decimal.
 * 
 */
function borrarTodo() {
    numeroActual = '0';
    numeroAnterior = null;
    operadorActivo = null;
    resultadoMostrado = false;
    habilitarPunto();
    pantallaColorNormal();
    actualizarPantalla();
}

/**
 * @brief Elimina el último carácter del número mostrado en pantalla.
 * 
 * Gestiona el borrado dígito a dígito. Si se había mostrado un resultado previo reinicia la pantalla a 0. Si se elimina un punto decimal, vuelve a habilitarse que se pueda seleccionar.
 * Cuando solo queda un carácter, la pantalla vuelve a mostrar 0.
 * 
 */
function retroceder() {
    if (resultadoMostrado) {
        numeroActual = '0';
        resultadoMostrado = false;
        pantallaColorNormal();
        habilitarPunto();
    } else {
        if (numeroActual.length > 1) {
            // Si el último carácter es un punto, habilitar el botón de punto
            if (numeroActual.charAt(numeroActual.length - 1) === '.') {
                habilitarPunto();
            }
            numeroActual = numeroActual.slice(0, -1);
        } else {
            numeroActual = '0';
            habilitarPunto();
        }
    }
    actualizarPantalla();
}

/**
 * @brief Realiza operaciones inmediatas sobre el número mostrado.
 * 
 * Soporta las siguientes operaciones:
 * - Inverso (1/x)
 * - Cuadrado (x²)
 * - Raíz cuadrada (√x)
 * 
 * Gestiona errores como división entre cero o raíz cuadrada de un número negativo, mostrando "Error" en pantalla y cambiando el color de la misma.
 * 
 * @param {string} operacion - La operación a realizar: 'inverso', 'cuadrado' o 'raiz'.
 * 
 */
function operacionInmediata(operacion) {
    const num = parseFloat(numeroActual);
    let resultado;
    
    switch (operacion) {
        case 'inverso':
            if (num === 0) {
                numeroActual = 'Error';
                pantalla.classList.remove('color-normal', 'color-suma', 'color-resta', 'color-multiplicacion', 'color-division', 'color-inverso', 'color-cuadrado', 'color-raiz');
                pantalla.classList.add('color-error');
                resultadoMostrado = true;
                actualizarPantalla();
                return;
            }
            resultado = 1 / num;
            break;
        case 'cuadrado':
            resultado = num * num;
            break;
        case 'raiz':
            if (num < 0) {
                numeroActual = 'Error';
                pantalla.classList.remove('color-normal', 'color-suma', 'color-resta', 'color-multiplicacion', 'color-division', 'color-inverso', 'color-cuadrado', 'color-raiz');
                pantalla.classList.add('color-error');
                resultadoMostrado = true;
                actualizarPantalla();
                return;
            }
            resultado = Math.sqrt(num);
            break;
        default:
            return;
    }
    
    numeroActual = resultado.toString();
    aplicarColorResultado(operacion);
    resultadoMostrado = true;
    actualizarPantalla();
}

/**
 * @brief Aplica un color específico a la pantalla según la operación realizada.
 * 
 * Cambia la clase CSS de la pantalla para reflejar visualmente el tipo de operación que se acaba de ejecutar, tanto para operaciones binarias (+, -, ×, /) como operaciones inmediatas (inverso, cuadrado, raíz).
 * 
 * @param {string} operador - Operación realizada: '+', '-', '×', '/', 'inverso', 'cuadrado', 'raiz'.
 * 
 */
function aplicarColorResultado(operador) {
    pantalla.classList.remove('color-normal', 'color-error', 'color-suma', 'color-resta', 'color-multiplicacion', 'color-division', 'color-inverso', 'color-cuadrado', 'color-raiz');
    
    switch (operador) {
        case '+':
            pantalla.classList.add('color-suma');
            break;
        case '-':
            pantalla.classList.add('color-resta');
            break;
        case '×':
            pantalla.classList.add('color-multiplicacion');
            break;
        case '/':
            pantalla.classList.add('color-division');
            break;
        case 'inverso':
            pantalla.classList.add('color-inverso');
            break;
        case 'cuadrado':
            pantalla.classList.add('color-cuadrado');
            break;
        case 'raiz':
            pantalla.classList.add('color-raiz');
            break;
        default:
            pantalla.classList.add('color-normal');
    }
}

// Funcionalidad de teclado (OPCIONAL)
document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    
    // Números 0-9
    if (key >= '0' && key <= '9') {
        mostrarNumeroPantalla(key);
    }
    // Punto decimal
    else if (key === '.') {
        mostrarPuntoPantalla();
    }
    // Operadores
    else if (key === '+') {
        manejarOperador('+');
    }
    else if (key === '-') {
        manejarOperador('-');
    }
    else if (key === '*' || key === 'x') {
        manejarOperador('×');
    }
    else if (key === '/') {
        event.preventDefault(); // Evitar búsqueda rápida en navegador
        manejarOperador('/');
    }
    // Igual
    else if (key === 'enter' || key === '=') {
        event.preventDefault();
        calcularOperacion();
    }
    // Retroceso
    else if (key === 'backspace') {
        event.preventDefault();
        retroceder();
    }
    // Borrar todo
    else if (key === 'c') {
        borrarTodo();
    }
    // Operaciones inmediatas
    else if (key === 'i') {
        operacionInmediata('inverso');
    }
    else if (key === 's') {
        operacionInmediata('cuadrado');
    }
    else if (key === 'r') {
        operacionInmediata('raiz');
    }
});

// Inicialización
actualizarPantalla();