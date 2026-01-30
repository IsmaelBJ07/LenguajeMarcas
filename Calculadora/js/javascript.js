const pantalla = document.getElementById('pantalla');
const btnPunto = document.getElementById('btn-punto');

let valorActual = '0';
let operadorPendiente = null;
let primerOperando = null;
let reiniciarPantalla = false;
let resultadoMostrado = false;

const colores = {
    '+': 'estilo-texto-suma', '-': 'estilo-texto-resta', 'x': 'estilo-texto-multi',
    '/': 'estilo-texto-div', 'inverso': 'estilo-texto-inverso', 'cuadrado': 'estilo-texto-cuadrado',
    'raiz': 'estilo-texto-raiz', 'error': 'estilo-texto-error', 'normal': 'estilo-texto-normal'
};

function actualizarPantalla() {
    let str = valorActual.toString();
    if (str === 'Error') {
        pantalla.innerText = 'Error';
        cambiarColor('error');
        return;
    }
    if (str.length > 12) {
        str = str.includes('.') ? parseFloat(valorActual).toFixed(7) : parseFloat(valorActual).toExponential(5);
    }
    pantalla.innerText = str.toString().substring(0, 12);
}

function cambiarColor(tipo) {
    pantalla.className = 'estilo-pantalla ' + (colores[tipo] || colores['normal']);
}

function añadirNumero(n) {
    if (resultadoMostrado) { cambiarColor('normal'); resultadoMostrado = false; valorActual = ''; }
    if (reiniciarPantalla) {
        valorActual = n;
        reiniciarPantalla = false;
        btnPunto.disabled = false;
    } else {
        valorActual = (valorActual === '0') ? n : valorActual + n;
    }
    actualizarPantalla();
}

function añadirPunto() {
    if (reiniciarPantalla) { valorActual = '0.'; reiniciarPantalla = false; }
    else if (!valorActual.includes('.')) { valorActual += '.'; }
    btnPunto.disabled = true;
    actualizarPantalla();
}

function setOperacion(op) {
    if (operadorPendiente && !reiniciarPantalla) ejecutarCalculo();
    primerOperando = parseFloat(valorActual);
    operadorPendiente = op;
    reiniciarPantalla = true;
    btnPunto.disabled = false;
    cambiarColor('normal');
}

function ejecutarCalculo() {
    if (!operadorPendiente || reiniciarPantalla) return;
    let segundo = parseFloat(valorActual);
    let res = 0;
    
    if (operadorPendiente === '+') res = primerOperando + segundo;
    if (operadorPendiente === '-') res = primerOperando - segundo;
    if (operadorPendiente === 'x') res = primerOperando * segundo;
    if (operadorPendiente === '/') {
        if (segundo === 0) { valorActual = 'Error'; actualizarPantalla(); return; }
        res = primerOperando / segundo;
    }

    valorActual = res.toString();
    cambiarColor(operadorPendiente);
    operadorPendiente = null;
    reiniciarPantalla = true;
    resultadoMostrado = true;
    actualizarPantalla();
}

function inmediata(tipo) {
    let n = parseFloat(valorActual);
    let r = 0;
    if (tipo === 'inverso') { if (n === 0) { valorActual = 'Error'; actualizarPantalla(); return; } r = 1/n; }
    if (tipo === 'cuadrado') r = n * n;
    if (tipo === 'raiz') { if (n < 0) { valorActual = 'Error'; actualizarPantalla(); return; } r = Math.sqrt(n); }
    
    valorActual = r.toString();
    cambiarColor(tipo);
    reiniciarPantalla = true;
    resultadoMostrado = true;
    actualizarPantalla();
}

function borrar(todo) {
    valorActual = '0';
    if (todo) { primerOperando = null; operadorPendiente = null; }
    reiniciarPantalla = false;
    resultadoMostrado = false;
    btnPunto.disabled = false;
    cambiarColor('normal');
    actualizarPantalla();
}

// Registro de eventos
document.getElementById('btn-0').addEventListener('click', () => añadirNumero('0'));
document.getElementById('btn-1').addEventListener('click', () => añadirNumero('1'));
document.getElementById('btn-2').addEventListener('click', () => añadirNumero('2'));
document.getElementById('btn-3').addEventListener('click', () => añadirNumero('3'));
document.getElementById('btn-4').addEventListener('click', () => añadirNumero('4'));
document.getElementById('btn-5').addEventListener('click', () => añadirNumero('5'));
document.getElementById('btn-6').addEventListener('click', () => añadirNumero('6'));
document.getElementById('btn-7').addEventListener('click', () => añadirNumero('7'));
document.getElementById('btn-8').addEventListener('click', () => añadirNumero('8'));
document.getElementById('btn-9').addEventListener('click', () => añadirNumero('9'));

document.getElementById('btn-punto').addEventListener('click', añadirPunto);
document.getElementById('btn-ce').addEventListener('click', () => borrar(false));
document.getElementById('btn-c').addEventListener('click', () => borrar(true));
document.getElementById('btn-sumar').addEventListener('click', () => setOperacion('+'));
document.getElementById('btn-restar').addEventListener('click', () => setOperacion('-'));
document.getElementById('btn-multiplicar').addEventListener('click', () => setOperacion('x'));
document.getElementById('btn-dividir').addEventListener('click', () => setOperacion('/'));
document.getElementById('btn-igual').addEventListener('click', ejecutarCalculo);
document.getElementById('btn-inverso').addEventListener('click', () => inmediata('inverso'));
document.getElementById('btn-cuadrado').addEventListener('click', () => inmediata('cuadrado'));
document.getElementById('btn-raiz').addEventListener('click', () => inmediata('raiz'));
document.getElementById('btn-retroceso').addEventListener('click', () => {
    valorActual = valorActual.length > 1 ? valorActual.slice(0, -1) : '0';
    if (!valorActual.includes('.')) btnPunto.disabled = false;
    actualizarPantalla();
});