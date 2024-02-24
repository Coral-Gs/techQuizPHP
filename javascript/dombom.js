//Cuando la ventana se carga llamo a la función inicio
window.onload = inicio;

//FUNCIÓN INICIO prepara los manejadores de eventos y los efectos del DOM
function inicio() {
  //EFECTOS JQUERY
  //Efecto inicial al título para que aumente de tamaño de manera animada
  $(document).ready(function () {
    $("#titulo").animate({ fontSize: "2.7em" }, "slow");
  });
  //Oculto formulario de registro para mostrar al final
  $("#formulario").hide();

  //BOTÓN INICIAR JUEGO
  document.getElementById("start").addEventListener("click", iniciarJuego);
  //BOTÓN REGISTRAR PUNTUACIÓN
  document
    .getElementById("boton-registrar")
    .addEventListener("click", function (event) {
      event.preventDefault();
      validarCampos();
    });
}

//FUNCIÓN PARA MOSTRAR PREGUNTAS
function mostrarPregunta() {
  console.log(preguntas);
  console.log(contador);

  //Elimino datos de preguntas anteriores si las hubiera
  document.getElementById("juego").innerHTML = "";

  //La respuesta de la API es un array de objetos
  //Obtengo la información que me interesa y la almaceno en variables
  let pregunta = preguntas[contador].question;
  let respuestaCorrecta = preguntas[contador].correct_answer;
  let respuestas = preguntas[contador].incorrect_answers; //Array de respuestas incorrectas
  respuestas.push(respuestaCorrecta); //Meto respuesta correcta en array de incorrectas

  //Desordeno las respuestas
  aleatorias(respuestas);

  //Creo y añado elementos del DOM para las preguntas
  let contenedorPregunta = document.createElement("h2");
  contenedorPregunta.innerHTML = pregunta;
  document.getElementById("juego").appendChild(contenedorPregunta);

  //Reccorro las posibles respuestas, creando y añadiendo botones para cada una
  respuestas.forEach((respuesta) => {
    let botonRespuesta = document.createElement("button");
    botonRespuesta.className = "boton-respuesta";
    botonRespuesta.innerHTML = respuesta;

    //Añado manejador de evento a los botones para comprobar la respuesta
    botonRespuesta.addEventListener("click", () =>
      validarRespuesta(botonRespuesta, respuestaCorrecta)
    );
    document.getElementById("juego").appendChild(botonRespuesta);
  });

  //Muestro puntuación
  document.getElementById("puntuacion").innerHTML = "Score: " + puntuacion;
}

function validarRespuesta(botonRes, resCorrecta) {
  let respuestaCorrecta = descodificar(resCorrecta);
  let mensaje = document.createElement("p");

  if (botonRes.innerHTML == respuestaCorrecta) {
    //Si la respuesta es correcta el botón cambia el fondo a verde y aparece "Correct!
    botonRes.style.backgroundColor = "#50a561";
    mensaje.id = "correcto";
    mensaje.innerHTML = "Correct!";
    //Añado 100 puntos por cada respuesta correcta
    puntuacion = puntuacion + 100;
    //Inactivo los botones de respuesta
    document.querySelectorAll(".boton-respuesta").forEach((boton) => {
      boton.disabled = true;
    });
    document.getElementById("juego").appendChild(mensaje);

    //Temporizador que muestra la solución durante 2 segundos y pasa a la siguiente pregunta
    setTimeout(siguientePregunta, 2 * 1000);
  } else {
    botonRes.style.backgroundColor = "#a73d3d";
    mensaje.id = "incorrecto";
    mensaje.innerHTML = "Incorrect! Correct answer is: " + respuestaCorrecta;
    document.getElementById("juego").appendChild(mensaje);
    //Inactivo los botones de respuesta
    document.querySelectorAll(".boton-respuesta").forEach((boton) => {
      boton.disabled = true;
    });
    //Temporizador que muestra la solución durante 3 segundos y pasa a la siguiente pregunta
    setTimeout(siguientePregunta, 3 * 1000);
  }
}

//FUNCIÓN PARA PASAR DE PREGUNTA
function siguientePregunta() {
  //Si hay más datos en el array preguntas y si los segundos de la cuenta atrás son >1 muestro
  //añado uno al contador de preguntas y muestro la siguiente pregunta
  if (contador < preguntas.length - 1 && segundo > 1) {
    contador = contador + 1;
    mostrarPregunta();
  } else {
    //Si no hay más preguntas en el array llamo a la función reiniciarJuego()
    reiniciarJuego();
  }
}

function iniciarJuego() {
  obtenerDatos(); //Obtengo los datos de la API
  document.getElementById("start").style.display = "none"; //El botón de Start desaparece una vez se inicia el juego
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
  let juego = document.getElementById("juego");
  juego.innerHTML = "";
  document.getElementById("cuenta-atras").innerHTML = "";
  document.getElementById("cuenta-atras").className = "";
  document.getElementById("puntuacion").innerHTML = "";

  //Creo mensaje final con puntuación
  let mensajeFinal = document.createElement("div");
  mensajeFinal.id = "mensaje-final";
  mensajeFinal.innerHTML = "Game Over!<br>Final score: " + puntuacion;
  juego.appendChild(mensajeFinal);

  //Creo botón de reiniciar juego
  let botonReiniciarJuego = document.createElement("button");
  botonReiniciarJuego.className = "boton-replay";
  botonReiniciarJuego.id = "boton-replay";
  botonReiniciarJuego.setAttribute("style", "display:block");
  botonReiniciarJuego.innerHTML = "Play again!";
  //Añado manejador de eventos para que al hacer click reinicie el juego
  botonReiniciarJuego.addEventListener("click", function () {
    //Reseteo variables globales del juego y vuelvo a llamar a la API para obtener nuevas preguntas
    minuto = 1;
    segundo = 0;
    preguntas = [];
    contador = 0;
    puntuacion = 0;
    document
      .getElementById("cuenta-atras")
      .setAttribute("style", "color:black; font-weight: 200");
    obtenerDatos();
  });
  document.getElementById("juego").appendChild(botonReiniciarJuego);

  botonRegistrarScore();
  mostrarScore();
  animacionFinal();
}

function botonRegistrarScore() {
  let registrarScore = document.createElement("button");
  registrarScore.className = "boton-formulario";
  registrarScore.setAttribute("style", "display:block");
  registrarScore.innerHTML = "Register score";
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

  if (segundo == 0) {
    minuto = 0;
    segundo = 1;
  }
  segundo -= 1;

  //Formateo los minutos y segundos para que tengan 2 dígitos siempre
  let minutoFormat = minuto.toString().padStart(2, "0");
  let segundoFormat = segundo.toString().padStart(2, "0");
  let cuentaAtrasHTML = document.getElementById("cuenta-atras");
  cuentaAtrasHTML.className = "cuenta-atras";
  cuentaAtrasHTML.innerHTML = minutoFormat + ":" + segundoFormat;

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

  //Cuando los minutos y los segundos llegan a 0, es decir finaliza el tiempo de juego
  //se elimina el contenido del juego y el temporizador y llamo a la función reiniciarJuego()
  if (minuto == 0 && segundo == 0) {
    document.getElementById("juego").innerText = ""; //Elimino elementos del juego
    reiniciarJuego(); // Muestro mensaje final
  }
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
  $("#boton-replay").hide();
  $("#boton-replay").fadeIn(2000);
  $(".boton-formulario").hide();
  $(".boton-formulario").fadeIn(2000);
  $("#scores").hide();
  $("#scores").fadeIn(2000);
}
