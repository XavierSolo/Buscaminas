document.addEventListener("DOMContentLoaded", asignadorEventos);

function asignadorEventos() {
    document.querySelector('#play').addEventListener('click', inicioBuscaminas);
}

function inicioBuscaminas() {
    // No me ha dado tiempo en averiguar un error implementando la página sin recargar, así que he implementado de esta manera
    window.location = "recurso/juego.html";
}