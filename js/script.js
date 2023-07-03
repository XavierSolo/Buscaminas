// Creamos un Json llamado Nuscaminas
let buscaminas = {
    numBombas: 0,
    numFilas: 0,
    numColumnas: 0,
    finJuego: false,
    celdas: []
}

let numeroCeldas;

// Esta variable global la he utilizado para saber la celda seleccionada en cada momento la cual la llamo en varias funciones
let celdaSelect;


document.oncontextmenu = function() {
    // Esta función sirve para que al dar click derecho no se abra el menú
    return false
}

document.addEventListener("DOMContentLoaded", asignadorEventos);

function asignadorEventos() {
    if (!buscaminas.finJuego) {
        document.querySelector('#botones').addEventListener('click', elegirAccion);
        document.querySelector('#cajonTabla').addEventListener('mousedown', teclaPulsada);
        document.querySelector('#botonExit').addEventListener('click', volverMenu);
    }
}

function elegirAccion(e) {
    //Gestiona la acción de pende del botón que se pulse
    if (e.target.value == 'Iniciar Juego') {
        empezarJuego();
    } else {
        console.log(e.target);
        terminarJuego();
    }
}

function terminarJuego() {
    //Se termina el juego y limpia todo
    document.querySelector('#filas').value = '';
    document.querySelector('#columnas').value = '';
    document.querySelector('#botones').removeChild(document.getElementById('botonFinal'));
    document.querySelector('#botones').innerHTML += '<input type="button" value="Iniciar Juego" id="botonInicio"></input>';
    document.querySelector('#cajonTabla').innerHTML = '';
}

function empezarJuego() {
    //Se utiliza en la función crear matriz para indicar filas y columnas

    let filas = document.querySelector('#filas');
    let columnas = document.querySelector('#columnas');

    if (controlErrores() == true) {
        document.querySelector('#mostrarMensaje').innerHTML = '';
        document.querySelector('#cajonTabla').innerHTML = '';
        crearMatriz();
        calcularBombas();
        perimetroBombas();
        crearTabla();
        reiniciarJuego();
    } else {
        // Si no has puesto las medidas requeridas automáticamente te pone dos mensajes uno con delay para poder darte una información sobre la dificultad del juego
        notificacion('error', '¡HAS PUESTO MAL LAS MEDIDAS!', 'Mínimo 5x5 y máximo 20x20');

        setTimeout(() => {
            notificacion('warning', '¡RECOMENDACIÓN!', '-Fácil 5x5    -Medio 10x10  -Difícil 20x20')
        }, 2000);

    }
}


function teclaPulsada(e) {
    //Este switch existe para poder ordenar las opciones que pulsar, se podría haber hecho con un if else, pero así el código se lee mejor
    switch (e.which) {

        case 3:
            ponerBanderin(e);

            break;

        case 1:
            destaparCelda(e.target.getAttribute('fila'), e.target.getAttribute('columna'));

            break;
    }

};

function ponerBanderin(e) {
    //He creado una función para poder designar clases las cuales tienen las imágenes de fondo metidas
    switch (e.target.className) {
        case 'tapado':
            cambiarContenido(e.target, 'tapado', 'pregunta', '');
            break;
        case 'pregunta':
            cambiarContenido(e.target, 'pregunta', 'banderin', '');
            break;
        case 'banderin':
            cambiarContenido(e.target, 'banderin', 'tapado', '');
            break;
        case 'destapado':
            break;
    }
}




function crearMatriz() {
    //Extrae el número de filas y columnas para introducrilo en el objeto y trabajar con eso 
    buscaminas.numFilas = filas.value;
    buscaminas.numColumnas = columnas.value;

    //Hace un doble bucle para la creación de la matriz
    for (let i = 0; i < buscaminas.numFilas; i++) {
        let celdas = [];

        for (let e = 0; e < buscaminas.numColumnas; e++) {
            celdas[e] = 0;
        };

        buscaminas.celdas[i] = celdas;
    }
    numeroCeldas = buscaminas.numFilas * buscaminas.numColumnas;
}





function calcularBombas() {
    //Calculo las bombas (el 10% de las celdas totales)
    buscaminas.numBombas = Math.floor((buscaminas.numFilas * buscaminas.numColumnas) * 0.1);

    //Asignación de ubicación para las bombas
    for (let a = 0; a < buscaminas.numBombas; a++) {
        let bombaFila = Math.floor(Math.random() * buscaminas.numFilas);
        let bombaColumna = Math.floor(Math.random() * buscaminas.numColumnas);
        let ubiBomba = buscaminas.celdas[bombaFila][bombaColumna];

        if (ubiBomba == 'B') {
            a--
        } else {
            buscaminas.celdas[bombaFila][bombaColumna] = 'B';
        }
    }
}


function perimetroBombas() {
    // Recorre el la matriz en busca de las bombas

    for (let i = 0; i < buscaminas.numFilas; i++) {
        for (let j = 0; j < buscaminas.numColumnas; j++) {


            if (buscaminas.celdas[i][j] == 'B') {
                // Coloca un +1 en las celdas colindantes a la bomba en un ratio de 3x3 y revisa los límites
                comprobarPerimetroBomba(i, j, (1), (0));
                comprobarPerimetroBomba(i, j, (1), (1));
                comprobarPerimetroBomba(i, j, (1), (-1));
                comprobarPerimetroBomba(i, j, (0), (1));
                comprobarPerimetroBomba(i, j, (0), (-1));
                comprobarPerimetroBomba(i, j, (-1), (0));
                comprobarPerimetroBomba(i, j, (-1), (1));
                comprobarPerimetroBomba(i, j, (-1), (-1));
            }

        }
    }

}

function comprobarPerimetroBomba(i, j, operador1, operador2) {
    // Comprueba el perímetro de las bombas sin poner 8 ifs ni hacer más bucles
    if ((j + operador2 >= 0) && i + operador1 >= 0 && i + operador1 != buscaminas.numFilas && j + operador2 != buscaminas.numColumnas) {
        if (comprobarBomba((i + operador1), (j + operador2)) == false) {
            buscaminas.celdas[i + operador1][j + operador2]++;
        }
    }
}



function crearTabla() {
    let ubiTabla = document.querySelector('#cajonTabla');
    let tabla = document.createElement("table");
    let tblBody = document.createElement("tbody");

    // Crea las celdas
    for (let i = 0; i < buscaminas.numFilas; i++) {
        // Crea las filas de la tabla
        let hilera = document.createElement("tr");

        for (let j = 0; j < buscaminas.numColumnas; j++) {
            // Crea un elemento <td> y un nodo de texto, haz que el nodo de
            // texto sea el contenido de <td>, ubica el elemento <td> al final
            // de la hilera de la tabla
            let celda = document.createElement("td");
            let textoCelda = document.createTextNode('');
            celda.appendChild(textoCelda);
            celda.className += 'tapado';
            celda.setAttribute('fila', i);
            celda.setAttribute('columna', j);

            
            hilera.appendChild(celda);
        }

        // agrega la hilera al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(hilera);
    }

    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // añadir tabla dentro de ubiTabla
    ubiTabla.appendChild(tabla);

}


function destapar(e) {
    numeroCeldas--;
    cambiarContenido(e, e.className, 'destapado', '');
    // Coge el e.target, le quita la clase y añade destapado, mientras baja el número de celdas y saber a cuanto se está de la victoria
    ;
}

function destaparCelda(Numberfila, Numbercolumna) {

    //Debido a la potencia del procesador al realizar ciclos, llegaba un momento que me solapaba los resultados de la suma convirtiéndolos en string y he necesitado hacer un parseInt para que en cada ciclo que descubra un 0, detecte que sigue siendo un número entero la posición extraída de la tabla.
    let fila = Number.parseInt(Numberfila);
    let columna = Number.parseInt(Numbercolumna);


    // Añado un control para que no de error lo demás por si comprueba una celda exterior
    if (fila >= 0 && fila < buscaminas.numFilas && columna >= 0 && columna < buscaminas.numColumnas) {

        celdaSelect = document.querySelector(`[fila='${fila}'][columna='${columna}']`);
        // Aquí se pierde, si tocas una 'B' automáticamente entra en las funciones y pierdes
        if (buscaminas.celdas[fila][columna] == 'B') {
            buscaminas.finJuego = true;
            destaparTodas();
            notificacion('error', '¡HAS PERDIDO!', '¿Te parece difícil el juego? ¡Recuerda que puedes jugar en fácil (5x5)!');
        }
        // Si no está destapado, lo destapa y comprueba que haya 0 cerca suya
        if (celdaSelect.className && celdaSelect.className != 'destapado') {

            destapar(celdaSelect);
            if (buscaminas.celdas[fila][columna] != 'B') {
                if (numeroCeldas == buscaminas.numBombas) {
                    buscaminas.finJuego = true;
                    destaparTodas();
                    notificacion('success', '¡HAS GANADO!', 'Muy bien, te has pasado el juego, vuelva a intentarlo haciéndolo más difícil');
                }
            }

            if (buscaminas.celdas[fila][columna] != 0 && buscaminas.celdas[fila][columna] != 'B') {

                celdaSelect.innerHTML = buscaminas.celdas[fila][columna];

            }

            if (buscaminas.celdas[fila][columna] == 0) {
                destaparCelda(fila - 1, columna - 1);
                destaparCelda(fila - 1, columna);
                destaparCelda(fila - 1, columna + 1);
                destaparCelda(fila, columna - 1);
                destaparCelda(fila, columna + 1);
                destaparCelda(fila + 1, columna - 1);
                destaparCelda(fila + 1, columna);
                destaparCelda(fila + 1, columna + 1);
            }

        }
    }
}

function reiniciarJuego() {
    // Reinicia todo en el caso de que pulses al botón
    document.querySelector('#botones').removeChild(document.getElementById('botonInicio'));
    document.querySelector('#botones').innerHTML += '<input type="button" value="Finalizar Juego" id="botonFinal"></input>';
}

function destaparTodas() {
    // Destapa todas las celdas recorriendo la tabla y asignando los valores mientras destapa la clase
    let celdaDestapar;
    for (let i = 0; i < buscaminas.numFilas; i++) {
        for (let j = 0; j < buscaminas.numColumnas; j++) {
            celdaDestapar = document.querySelector(`[fila='${i}'][columna='${j}']`);
            if (buscaminas.celdas[i][j] == 'B') {
                destapar(celdaDestapar);
                celdaDestapar.innerHTML = '<img src="../assets/bomba.png" width="20px" height="20px" alt=""></img>';
            } else {
                destapar(celdaDestapar);
                celdaDestapar.innerHTML = buscaminas.celdas[i][j];
            }
        }
    }
}


function cambiarContenido(elemento, quitar, poner, imagen) {
    // Intercambia clases y añade imágenes
    console.log(elemento);
    elemento.classList.remove(quitar);
    elemento.classList.add(poner);
    elemento.innerHTML = imagen;
}

function comprobarBomba(fila, columna) {
    // Compruebo que no se haya tocado una bomba
    console.log(fila)
    console.log(columna)
    if (buscaminas.celdas[fila][columna] == 'B') {
        return true;
    } else {
        return false;
    }
}

function controlErrores() {
    // Se comprueba que la tabla está dentro de las dimensiones requeridas en el ejercicio
    if (filas.value <= 20 && filas.value >= 5 && columnas.value <= 20 && columnas.value >= 5) {
        return true;

    } else {
        return false;
    }
}

function volverMenu() {
    // Vuelve a la página principal
    window.location = "../index.html";
}

function notificacion(tipo, titulo, mensaje) {
    // Función utilizada para la librería
    toastr[tipo](mensaje, titulo, {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "800",
        "hideDuration": "1000",
        "timeOut": "4100",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    });
}