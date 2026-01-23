let numeroActual = '0';
let numeroAnterior = null;
let operadorActivo = null;
let resultadoMostrado = false;

const pantalla = document.getElementById('pantalla');
const btnPunto = document.getElementById('btn-punto');

function deshabilitarPunto() {
    btnPunto.disabled = true;
    btnPunto.classList.add('btn-deshabilitado');
}

function habilitarPunto() {
    btnPunto.disabled = false;
    btnPunto.classList.remove('btn-deshabilitado');
}

function actualizarPantalla() {
    let valor = numeroActual;

    if (valor !== 'Error' && valor.length > 12) {
        valor = Number(valor).toPrecision(12);
        valor = parseFloat(valor).toString();
    }

    pantalla.textContent = valor;
}

function mostrarNumeroPantalla(numero) {
    if (resultadoMostrado) {
        numeroActual = numero;
        resultadoMostrado = false;
        pantallaColorNormal();
        habilitarPunto();
    } else if (numeroActual === '0') {
        numeroActual = numero;
    } else if (numeroActual.length < 12) {
        numeroActual += numero;
    }

    actualizarPantalla();
}

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

function manejarOperador(operador) {
    if (operadorActivo && !resultadoMostrado) {
        calcularOperacion();
    }

    numeroAnterior = parseFloat(numeroActual);
    operadorActivo = operador;
    numeroActual = '0';
    resultadoMostrado = false;
    habilitarPunto();
    actualizarPantalla();
}

function calcularOperacion() {
    if (!operadorActivo) return;

    const a = numeroAnterior;
    const b = parseFloat(numeroActual);
    let resultado;

    switch (operadorActivo) {
        case '+': resultado = a + b; break;
        case '-': resultado = a - b; break;
        case '×': resultado = a * b; break;
        case '/':
            if (b === 0) return mostrarError();
            resultado = a / b;
            break;
    }

    numeroActual = resultado.toString();
    aplicarColorResultado(operadorActivo);
    resultadoMostrado = true;
    operadorActivo = null;
    actualizarPantalla();
}

function pantallaColorNormal() {
    pantalla.className = 'pantalla color-normal';
}

function borrarEntrada() {
    numeroActual = '0';
    habilitarPunto();
    pantallaColorNormal();
    actualizarPantalla();
}

function borrarTodo() {
    numeroActual = '0';
    numeroAnterior = null;
    operadorActivo = null;
    resultadoMostrado = false;
    habilitarPunto();
    pantallaColorNormal();
    actualizarPantalla();
}

function retroceder() {
    if (resultadoMostrado) {
        borrarEntrada();
        resultadoMostrado = false;
        return;
    }

    if (numeroActual.length > 1) {
        if (numeroActual.endsWith('.')) habilitarPunto();
        numeroActual = numeroActual.slice(0, -1);
    } else {
        numeroActual = '0';
        habilitarPunto();
    }

    actualizarPantalla();
}

function operacionInmediata(op) {
    const num = parseFloat(numeroActual);
    let resultado;

    if (op === 'inverso') {
        if (num === 0) return mostrarError();
        resultado = 1 / num;
    }
    if (op === 'cuadrado') resultado = num * num;
    if (op === 'raiz') {
        if (num < 0) return mostrarError();
        resultado = Math.sqrt(num);
    }

    numeroActual = resultado.toString();
    aplicarColorResultado(op);
    resultadoMostrado = true;
    actualizarPantalla();
}

function aplicarColorResultado(op) {
    pantalla.className = 'pantalla';

    const colores = {
        '+': 'color-suma',
        '-': 'color-resta',
        '×': 'color-multiplicacion',
        '/': 'color-division',
        'inverso': 'color-inverso',
        'cuadrado': 'color-cuadrado',
        'raiz': 'color-raiz'
    };

    pantalla.classList.add(colores[op] || 'color-normal');
}

function mostrarError() {
    numeroActual = 'Error';
    pantalla.className = 'pantalla color-error';
    resultadoMostrado = true;
    actualizarPantalla();
}

/* Teclado (opcional) */
document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k >= '0' && k <= '9') mostrarNumeroPantalla(k);
    if (k === '.') mostrarPuntoPantalla();
    if (k === '+') manejarOperador('+');
    if (k === '-') manejarOperador('-');
    if (k === '*' || k === 'x') manejarOperador('×');
    if (k === '/') { e.preventDefault(); manejarOperador('/'); }
    if (k === '=' || k === 'enter') calcularOperacion();
    if (k === 'backspace') retroceder();
    if (k === 'c') borrarTodo();
    if (k === 'i') operacionInmediata('inverso');
    if (k === 's') operacionInmediata('cuadrado');
    if (k === 'r') operacionInmediata('raiz');
});

actualizarPantalla();
