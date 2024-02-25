//EXAMEN DESARROLLO ENTORNO CLIENTE - CORAL GUTIÉRREZ SÁNCHEZ
//DOM, BOM, EVENTOS Y JQUERY
//Elementos DOM utilizados:
//selectores: getElementById(), querySelectorAll(),appendChild(), setAttribute()
//propiedades: .id, .className, .style, .innerHTML,
//Elementos BOM utilizados:
//Eventos: addEventListener()
//Jquery: animate(), fadeIn(), slideToggle(), hide()
//Otros elementos y funciones: .toString(), .padStart(), Date, Math

//Cuando la ventana se carga llamo a la función inicio
window.onload = inicio;

//VARIABLES GLOBALES DEL JUEGO

let preguntas = []; //Array global de preguntas
let contador = 0; //Contador global de preguntas
let puntuacion = 0; //Puntuación de partida
let minuto = 1;
let segundo = 0;
let cuentaAtrasID;

//FUNCIÓN INICIO prepara los manejadores de eventos y los efectos del DOM
function inicio() {
  //EFECTOS JQUERY
  //Efecto inicial al título para que aumente de tamaño de manera animada
  $(document).ready(function () {
    $("#titulo").animate({ fontSize: "2.7em" }, "slow");
  });
  //Oculto formulario de registro para mostrar al final
  $("#formulario").hide();

  //Añado manejadores de eventos a botones presentes en el DOM
  document.getElementById("start").addEventListener("click", iniciarJuego);
  document
    .getElementById("boton-registrar")
    .addEventListener("click", function (event) {
      event.preventDefault();
      validarCampos();
    });
}

//
function iniciarJuego() {
  obtenerDatos(); //Obtengo los datos de la API
  document.getElementById("titulo").innerHTML = "The TechQuiz"; //El título cambia
  document.getElementById("start").style.display = "none"; //El botón de Start desaparece una vez se inicia el juego
}

function generarPregunta() {
  //Creo y añado pregunta
  let pregunta = preguntas[contador].question;
  let contenedorPregunta = document.createElement("h2");
  contenedorPregunta.innerHTML = pregunta;
  document.getElementById("juego").appendChild(contenedorPregunta);
}

function generarRespuestas() {
  //Creo y añado respuestas
  let respuestaCorrecta = preguntas[contador].correct_answer;
  let respuestas = preguntas[contador].incorrect_answers; //Array de respuestas incorrectas
  respuestas.push(respuestaCorrecta); //Meto respuesta correcta en array de incorrectas
  aleatorias(respuestas); //Desordeno las respuestas
  crearBotonesRespuestas(respuestas, respuestaCorrecta);
}

function crearBotonesRespuestas(respuestas, resCorrecta) {
  //Recorro las posibles respuestas, creando y añadiendo botones para cada una
  let respuestaCorrecta = resCorrecta;
  respuestas.forEach((respuesta) => {
    let botonRespuesta = document.createElement("button");
    botonRespuesta.className = "boton-respuesta";
    botonRespuesta.innerHTML = respuesta;

    //Añado manejador de evento a los botones para comprobar la respuesta
    botonRespuesta.addEventListener("click", () =>
      validarRespuesta(botonRespuesta, respuestaCorrecta)
    );
    //Añado botón al div juego
    document.getElementById("juego").appendChild(botonRespuesta);
  });
}

//FUNCIÓN PARA MOSTRAR PREGUNTAS Y RESPUESTAS
function mostrarPregunta() {
  //Elimino datos de preguntas anteriores si las hubiera
  document.getElementById("juego").innerHTML = "";

  generarPregunta();
  generarRespuestas();

  //Muestro puntuación
  document.getElementById("puntuacion").innerHTML = "Score: " + puntuacion;
}

//FUNCIÓN PARA VALIDAR RESPUESTA
function validarRespuesta(botonRes, resCorrecta) {
  let respuestaCorrecta = descodificar(resCorrecta);
  let mensaje = document.createElement("p");

  if (botonRes.innerHTML == respuestaCorrecta) {
    //Si la respuesta es correcta el botón cambia el fondo a verde y aparece "Correct!
    botonRes.style.backgroundColor = "#50a561";
    mensaje.id = "correcto";
    mensaje.innerHTML = "Correct!";
    puntuacion = puntuacion + 100; //Añado 100 puntos por cada respuesta correcta
  } else {
    //Si la respuesta es incorrecta se muestra en rojo y aparece mensaje con la respuesta correcta
    botonRes.style.backgroundColor = "#a73d3d";
    mensaje.id = "incorrecto";
    mensaje.innerHTML = "Incorrect! Correct answer is: " + respuestaCorrecta;
  }
  //Muestro mensaje
  document.getElementById("juego").appendChild(mensaje);
  //Inactivo los botones de respuesta
  document.querySelectorAll(".boton-respuesta").forEach((boton) => {
    boton.disabled = true;
  });
  //Temporizador que muestra la solución durante 2 segundos y pasa a la siguiente pregunta
  setTimeout(siguientePregunta, 2 * 1000);
}

//FUNCIÓN PARA PASAR DE PREGUNTA
function siguientePregunta() {
  //Si hay más datos en el array preguntas y si los segundos de la cuenta atrás son >1 muestro
  //añado uno al contador de preguntas y muestro la siguiente pregunta
  if (contador < preguntas.length - 1 && segundo > 0) {
    contador = contador + 1;
    mostrarPregunta();
  } else {
    //Si no hay más preguntas en el array llamo a la función reiniciarJuego()
    reiniciarJuego();
  }
}

//Función para descodificar la respuesta correcta
//Utilizando expresiones regulares y replace() no cambiaba todas las comillas de las respuestas
//Así que esta función permite transformar las respuestas codificadas de la API a HTML y compararlas con el botón
//presionado por el usuario
function descodificar(respuestaCorrecta) {
  let resDescodificada = document.createElement("p");
  resDescodificada.innerHTML = respuestaCorrecta;
  return resDescodificada.innerHTML;
}

function aleatorias(respuestas) {
  return respuestas.sort(function () {
    return Math.random() - 0.5;
  });
}

//FUNCIÓN MOSTRAR PUNTUACIÓN FINAL Y REINICIAR JUEGO
function reiniciarJuego() {
  //Reseteo cuenta atrás
  clearTimeout(cuentaAtrasID);
  //Reseteo lo que hay en juego
  document.getElementById("juego").innerHTML = "";
  document.getElementById("cuenta-atras").innerHTML = "";
  document.getElementById("cuenta-atras").className = "";
  document.getElementById("puntuacion").innerHTML = "";

  mostrarPuntuacionFinal();
  botonReiniciarJuego();
  botonRegistrarScore();
  mostrarScore();
  animacionFinal();
}

function mostrarPuntuacionFinal() {
  //Creo mensaje final con puntuación
  let mensajeFinal = document.createElement("div");
  mensajeFinal.id = "mensaje-final";
  mensajeFinal.innerHTML = "Game Over!<br>Final score: " + puntuacion;
  juego.appendChild(mensajeFinal);
}

function botonReiniciarJuego() {
  //Creo botón de reiniciar juego
  let botonReiniciarJuego = document.createElement("button");
  botonReiniciarJuego.className = "boton-replay";
  botonReiniciarJuego.innerHTML = "Play again!";
  botonReiniciarJuego.setAttribute("style", "display:block");
  //Añado manejador de eventos para que al hacer click reinicie el juego
  botonReiniciarJuego.addEventListener("click", resetearJuego);
  document.getElementById("juego").appendChild(botonReiniciarJuego);
}

function resetearJuego() {
  //Reseteo variables globales del juego y contenedor de scores
  //y vuelvo a llamar a la API para obtener nuevas preguntas
  minuto = 1;
  segundo = 0;
  preguntas = [];
  contador = 0;
  puntuacion = 0;
  document
    .getElementById("cuenta-atras")
    .setAttribute("style", "color:black; font-weight: 200");
  document.getElementById("scores").innerHTML = "";
  document.getElementById("formulario").innerHTML = "";
  obtenerDatos();
}

function botonRegistrarScore() {
  let registrarScore = document.createElement("button");
  registrarScore.className = "boton-formulario";
  registrarScore.innerHTML = "Register score";
  registrarScore.setAttribute("style", "display:block");
  registrarScore.addEventListener("click", function () {
    //JQUERY al hacer click en el botón se despliega el formulario de registro
    $("#formulario").slideToggle("slow");
  });
  document.getElementById("juego").appendChild(registrarScore);
}

//FUNCIÓN TIEMPO JUEGO 1 MINUTO 30 segundos

function cuentaAtras() {
  //Establezco un temporizador con setTimeout que llama a la misma función
  //De manera recursiva para ir mostrando los segundos simulando una cuenta atrás
  cuentaAtrasID = setTimeout(cuentaAtras, 1 * 1000);
  if (minuto == 1 && segundo == 0) {
    minuto = 0;
    segundo = 60;
  }
  segundo -= 1;
  mostrarTiempo();

  //Cuando los minutos y los segundos llegan a 0 finaliza el tiempo de juego
  //llamo a la función reiniciarJuego
  if (minuto == 0 && segundo == 0) {
    reiniciarJuego(); // Reinicio juego
  }
}

function mostrarTiempo() {
  //Formateo los minutos y segundos para que tengan 2 dígitos siempre
  let minutoFormat = minuto.toString().padStart(2, "0");
  let segundoFormat = segundo.toString().padStart(2, "0");
  let cuentaAtrasHTML = document.getElementById("cuenta-atras");

  //Aplico estilo especial con dígitos en rojo y más grandes cuando quedan 5 segundos
  //como si el tiempo palpitara
  if (minuto == 0 && segundo <= 5 && segundo >= 0) {
    cuentaAtrasHTML.setAttribute(
      "style",
      "color:red; font-size: 35px; font-weight: 600"
    );
    setTimeout(function () {
      cuentaAtrasHTML.setAttribute("style", "color:red; font-weight: 600");
    }, 500);
  }
  cuentaAtrasHTML.className = "cuenta-atras";
  cuentaAtrasHTML.innerHTML = minutoFormat + ":" + segundoFormat;
}

function mostrarMensajeError() {
  document.getElementById("cuenta-atras").innerHTML = "";
  document.getElementById("puntuacion").innerHTML = "";
  document.getElementById("juego").innerHTML =
    "Sorry! The TechQuiz game is not available right now.<br>Please try again later...";
}

//JQUERY animación que hace aparecer elementos finales de manera gradual
function animacionFinal() {
  $("#mensaje-final").hide();
  $("#mensaje-final").fadeIn(2000);
  $(".boton-replay").hide();
  $(".boton-replay").fadeIn(2000);
  $(".boton-formulario").hide();
  $(".boton-formulario").fadeIn(2000);
  $("#scores").hide();
  $("#scores").fadeIn(2000);
}
