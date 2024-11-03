class Tarjeta {  
    constructor(id, urlImage) {  
        this.id = id;
        this.urlImage = urlImage;  
    }  
}  

class Jugador extends Tarjeta {  
    constructor(id, urlImage, nombre) {
        super(id, urlImage);
        this.nombre = nombre;
    }
}  

class Media extends Tarjeta {  
    constructor(id, urlImage, media) {
        super(id, urlImage);
        this.media = media; 
    }
}  

const jugadores = [];  
const medias = [];  

jugadores.push(new Jugador(1, '/cartas/messi.png', 'Messi'));  
jugadores.push(new Jugador(2, '/cartas/ronaldo.png', 'Ronaldo'));  
jugadores.push(new Jugador(3, '/cartas/haaland.png', 'Haaland'));  
jugadores.push(new Jugador(4, '/cartas/vinicius.png', 'Vinicius'));  
jugadores.push(new Jugador(5, '/cartas/yamal.png', 'Yamal'));  
jugadores.push(new Jugador(6, '/cartas/alvarez.png', 'Alvarez'));  

medias.push(new Media(1, '/cartas/88-messi.png', 88));  
medias.push(new Media(2, '/cartas/86-ronaldo.png', 86));  
medias.push(new Media(3, '/cartas/91-haaland.png', 91));  
medias.push(new Media(4, '/cartas/90-vini.png', 90));  
medias.push(new Media(5, '/cartas/81-yamal.png', 81));  
medias.push(new Media(6, '/cartas/84-alvarez.png', 84));  

function mezclarVector(vec) {
    for (let i = vec.length - 1; i > 0; i--) {  
        const j = Math.floor(Math.random() * (i + 1));
        let flag = vec[i];
        vec[i] = vec[j];
        vec[j] = flag;
    }
}


let timer;
let segundos = 0;
let minutos = 0;
let tiempoFinal;

function iniciarTemporizador() {
    clearInterval(timer);

    segundos = 0;
    minutos = 0;

    actualizarTemporizador();

    timer = setInterval(() => {
        segundos++;
        if (segundos == 60) {
            segundos = 0;
            minutos++;
        }
        actualizarTemporizador();
    }, 1000);
}

function actualizarTemporizador() {
    const temporizadorElemento = document.getElementById('temporizador');
    if (temporizadorElemento) {
        temporizadorElemento.innerText = `Tiempo: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }
}

function detenerTemporizador() {
    clearInterval(timer);
}


let tarjetaAnterior = null;  
let tarjetaAnteriorId = null;
let correcto = 0;
let clicks = 0;

function manejarClic(tar, divid) {
    if (tarjetaAnteriorId) {
        document.getElementById(tarjetaAnteriorId).classList.remove('borde-seleccionado');
    }
    const divActual = document.getElementById(divid);
    divActual.classList.add('borde-seleccionado');
    
    if (tarjetaAnterior != null) {
        verificarContenedoresDistintos(tarjetaAnterior, tar, divid, tarjetaAnteriorId);
        tarjetaAnterior = null;
        tarjetaAnteriorId = null;
        divActual.classList.remove('borde-seleccionado');
    } else {
        tarjetaAnterior = tar;
        tarjetaAnteriorId = divid;
    }
}

function verificarContenedoresDistintos(jugador, media, divid, tarjetaAnteriorId) {
    if (jugador.urlImage !== media.urlImage) {
        unirTarjetas(jugador, media, divid, tarjetaAnteriorId);
        clicks++;
    } else {
        document.getElementById(tarjetaAnteriorId).classList.remove('borde-seleccionado');
    }
}

function verificarIdsCoinciden(jugador, media) {
    return jugador.id === media.id;
}

function verificarFinalizarJuego(){
    return correcto == 6;
}

function unirTarjetas(jugador, media, divid, tarjetaAnteriorId) {
    const divJugador = document.getElementById(divid);
    const divMedia = document.getElementById(tarjetaAnteriorId);

    if (verificarIdsCoinciden(jugador, media)) {
        if (divJugador && divMedia) {
            divJugador.innerHTML = '<img src="/cartas/correcto.png" alt="Correcto" />';
            divMedia.innerHTML = '<img src="/cartas/correcto.png" alt="Correcto" />';
            divJugador.style.pointerEvents = 'none';
            divMedia.style.pointerEvents = 'none';
            correcto++;
            if (verificarFinalizarJuego()) {
                detenerTemporizador();
                tiempoFinal = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                setTimeout(() => {
                    const nombre = prompt("¡Has ganado! Ahora pon tu nombre para guardar el registro: ");
                    if (nombre) {
                        guardarRegistro(nombre, tiempoFinal, clicks);
                    }
                    correcto = 0;
                    limpiarTableros();
                    mostrarImagenes();
                }, 100);
            }
        }
    } else {
        alert("No coinciden");
    }
}

function limpiarTableros() {
    clicks = 0;
    const contenedorJugadores = document.getElementById('jugador');
    const contenedorMedias = document.getElementById('media');
    contenedorJugadores.innerHTML = '';
    contenedorMedias.innerHTML = '';
}

function guardarRegistro(nombre, tiempoFinal, clicks) {
    const registro = {
        nombre: nombre,
        tiempoFinal: tiempoFinal,
        clicks: clicks
    };

    const registrosGuardados = JSON.parse(localStorage.getItem('registros')) || [];
    registrosGuardados.push(registro);
    localStorage.setItem('registros', JSON.stringify(registrosGuardados));
}


function mostrarImagenes() {
    iniciarTemporizador();

    mezclarVector(jugadores);
    mezclarVector(medias);

    const contenedorJugadores = document.getElementById('jugador');
    const contenedorMedias = document.getElementById('media');

    for (let i = 0; i < jugadores.length; i++) {
        let jugador = jugadores[i];
        let div = document.createElement('div');
        let divid = `jtar${i}`;
        div.id = divid;
        div.innerHTML = `<img src="${jugador.urlImage}" alt="${jugador.nombre}" />`;
        div.onclick = () => manejarClic(jugador, divid);
        contenedorJugadores.appendChild(div);
    }

    for (let i = 0; i < medias.length; i++) {
        let media = medias[i];
        let div = document.createElement('div');
        let divid = `mtar${i}`;
        div.id = divid;
        div.innerHTML = `<img src="${media.urlImage}" alt="Media ${media.media}" />`;
        div.onclick = () => manejarClic(media, divid);
        contenedorMedias.appendChild(div);
    }
}

window.onload = () => {
    document.body.innerHTML = '<div id="temporizador">Tiempo: 00:00</div>' + document.body.innerHTML;
    mostrarImagenes();
};