//EXAMEN DESARROLLO ENTORNO CLIENTE - CORAL GUTIÉRREZ SÁNCHEZ

//MANEJO DEL DOM, BOM, EVENTOS Y JQUERY

//Cuando la ventana se carga llamo a la función inicio
window.onload = inicio;

//VARIABLES GLOBALES DEL JUEGO
let preguntas = {};
let contador = 0;
let puntuacion = 0;
let minuto = 1;
let segundo = 0;
let cuentaAtrasID;

//FUNCIÓN INICIO prepara los manejadores de eventos y los efectos del DOM
function inicio() {
  //JQUERY: Efecto inicial al título para que aumente de tamaño de manera animada
  $(document).ready(function () {
    $("#titulo").animate({ fontSize: "2.7em" }, "slow");
  });
  //JQUERY: Oculto formulario de registro para mostrar al final
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

//FUNCIÓN INICIAR JUEGO
//Obtiene datos de la API, cambia el título y elimino el botón de iniciar juego
function iniciarJuego() {
  obtenerDatos(); //Obtengo los datos de la API
  document.getElementById("titulo").innerHTML = "The TechQuiz"; //Cambio título
  document
    .getElementById("contenedor-juego")
    .removeChild(document.getElementById("start")); //Elimino botón
}

//Función para generar pregunta
//Utiliza la variable global de preguntas y el contador para crear una pregunta y agregarla al DOM
function generarPregunta() {
  //Creo y añado pregunta
  let pregunta = preguntas[contador].question;
  let contenedorPregunta = document.createElement("h2");
  contenedorPregunta.innerHTML = pregunta;
  document.getElementById("juego").appendChild(contenedorPregunta);
}

//Función para generar respuestas
//Utiliza la variable global de preguntas y el contador para crear las respuestas
function generarRespuestas() {
  //Creo y añado respuestas
  let respuestaCorrecta = preguntas[contador].correct_answer;
  let respuestas = preguntas[contador].incorrect_answers; //Array de respuestas incorrectas
  respuestas.push(respuestaCorrecta); //Meto respuesta correcta en array de incorrectas
  aleatorias(respuestas); //Desordeno las respuestas
  crearBotonesRespuestas(respuestas, respuestaCorrecta);
}
//Función para crear botones de respuestas
function crearBotonesRespuestas(respuestas, resCorrecta) {
  //Recorro las posibles respuestas, creando y añadiendo botones para cada una
  let respuestaCorrecta = resCorrecta;
  respuestas.forEach((respuesta) => {
    let botonRespuesta = document.createElement("button");
    botonRespuesta.className = "boton-respuesta";
    botonRespuesta.innerHTML = respuesta;

    //Añado manejador de evento a los botones para comprobar si es la respuesta correcta o no
    botonRespuesta.addEventListener("click", () =>
      validarRespuesta(botonRespuesta, respuestaCorrecta)
    );
    //Añado botón al div juego
    document.getElementById("juego").appendChild(botonRespuesta);
  });
}

//Función para mostrar una pregunta, las respuestas y la puntuación
function mostrarPregunta() {
  //Elimino datos de preguntas anteriores si las hubiera
  document.getElementById("juego").innerHTML = "";

  generarPregunta();
  generarRespuestas();

  //Muestro puntuación
  document.getElementById("puntuacion").innerHTML = "Score: " + puntuacion;
}

//Función para validar la respuesta seleccionada
function validarRespuesta(botonRes, resCorrecta) {
  let respuestaCorrecta = descodificar(resCorrecta);
  let mensaje = document.createElement("p");

  //Si la respuesta es correcta el botón cambia el fondo a verde, aparece el mensaje Correct!
  if (botonRes.innerHTML == respuestaCorrecta) {
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

//Función para pasar de pregunta
function siguientePregunta() {
  //Si hay más datos en la variable preguntas y si los segundos de la cuenta atrás son >0
  //añado uno al contador de preguntas y muestro la siguiente pregunta
  if (contador < preguntas.length - 1 && segundo > 0) {
    contador = contador + 1;
    mostrarPregunta();
  } else {
    //Si no hay más preguntas o el tiempo se ha agotado finaliza el juego
    finalizarJuego();
  }
}

//Función para descodificar la respuesta correcta
//Transforma las respuestas codificadas de la API a HTML para poder compararlas después con el HTML de la respuesta seleccionada
//De manera que aparezcan bien los caracteres especiales como apóstrofes y la comparación se realice correctamente
function descodificar(respuestaCorrecta) {
  let resDescodificada = document.createElement("p");
  resDescodificada.innerHTML = respuestaCorrecta;
  return resDescodificada.innerHTML;
}

//Función para desorderan de manera aleatoria el array de respuestas
function aleatorias(respuestas) {
  return respuestas.sort(function () {
    return Math.random() - 0.5;
  });
}

//Función para finalizar el juego muestra la puntuación final y opciones
//Vaciando los contenedores del juego y reseteando la cuenta atrás
function finalizarJuego() {
  //Reseteo cuenta atrás
  clearTimeout(cuentaAtrasID);
  //Reseteo los datos del juego
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

//Función para mostrar el mensaje de puntuación obtenida
function mostrarPuntuacionFinal() {
  //Creo mensaje final con puntuación
  let mensajeFinal = document.createElement("div");
  mensajeFinal.id = "mensaje-final";
  mensajeFinal.innerHTML = "Game Over!<br>Final score: " + puntuacion;
  juego.appendChild(mensajeFinal);
}

//Función que crea un botón para reiniciar el juego
function botonReiniciarJuego() {
  //Creo botón de reiniciar juego
  let botonReiniciarJuego = document.createElement("button");
  botonReiniciarJuego.className = "boton-replay";
  botonReiniciarJuego.innerHTML = "Play again!";
  botonReiniciarJuego.setAttribute("style", "display:block");
  //Añado manejador de eventos para que al hacer click reinicie el juego
  botonReiniciarJuego.addEventListener("click", reiniciarJuego);
  document.getElementById("juego").appendChild(botonReiniciarJuego);
}

//Función para reiniciar el juego
//Reseto variables globales del juego y vacío contenedor del ranking y formulario
//y vuelvo a llamar a la API para obtener nuevas preguntas
function reiniciarJuego() {
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

//Función para crear el botón de registrar la puntuación
//que despliega el formulario de registro
function botonRegistrarScore() {
  let registrarScore = document.createElement("button");
  registrarScore.className = "boton-formulario";
  registrarScore.innerHTML = "Register score";
  registrarScore.setAttribute("style", "display:block");
  registrarScore.addEventListener("click", function () {
    //JQUERY: al hacer click en el botón se despliega el formulario de registro
    $("#formulario").slideToggle("slow");
  });
  document.getElementById("juego").appendChild(registrarScore);
}

//Función cuenta atrás para delimitar el tiempo de juego en cuenta regresiva
function cuentaAtras() {
  //Establezco un temporizador con setTimeout que llama a la misma función
  //De manera recursiva para ir mostrando los segundos en descenso simulando una cuenta atrás
  cuentaAtrasID = setTimeout(cuentaAtras, 1 * 1000);

  if (minuto == 1 && segundo == 0) {
    minuto = 0;
    segundo = 60;
  }
  segundo -= 1;

  mostrarTiempo();

  //Cuando los minutos y los segundos llegan a 0 finaliza el juego
  if (minuto == 0 && segundo == 0) {
    finalizarJuego(); //
  }
}

//Función para mostrar el tiempo restante en el DOM
function mostrarTiempo() {
  //Formateo los minutos y segundos para que tengan 2 dígitos siempre
  let minutoFormat = minuto.toString().padStart(2, "0");
  let segundoFormat = segundo.toString().padStart(2, "0");
  let cuentaAtrasHTML = document.getElementById("cuenta-atras");

  //Aplico estilo especial con dígitos en rojo y más grandes cuando quedan 5 segundos
  //como si el tiempo palpitara, avisando de que la partida está próxima a finalizar
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

//Muestra un mensaje de error en caso de que la API no esté disponible
function mostrarMensajeError() {
  document.getElementById("cuenta-atras").innerHTML = "";
  document.getElementById("puntuacion").innerHTML = "";
  document.getElementById("juego").innerHTML =
    "Sorry! The TechQuiz game is not available right now.<br>Please try again later...";
}

//JQUERY animaciones que hacen aparecer elementos finales del juego de manera gradual
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
