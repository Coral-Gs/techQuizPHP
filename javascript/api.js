//VARIABLES GLOBALES DEL JUEGO

let preguntas = []; //Array global de preguntas
let contador = 0; //Contador global de preguntas
let puntuacion = 0; //Puntuación de partida
let minuto = 0;
let segundo = 30;
let cuentaAtrasID;

//FUNCIÓN LLAMADA API
//Función que utiliza fecth para hacer la consulta a la API con el método GET por defecto
function obtenerDatos() {
  //Llamada a la API PreguntApi

  let endpoint =
    "https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple";

  fetch(endpoint)
    .then((respuesta) => respuesta.json()) //Devuelve una promesa
    .then((data) => {
      preguntas = data.results;
      //Compruebo que el array de datos contenga preguntas antes de llamar a la función
      //para mostrar preguntas e iniciar la cuenta atrás
      if (preguntas.length > 0) {
        mostrarPregunta();
        cuentaAtras();
      }
    }) //Devuelve la respuesta de la API en una función externa
    .catch((err) => {
      console.log("Solicitud fallida", err);
      mostrarMensajeError();
    }); //Capturamos errores en caso de solicitud fallida
}
