//FUNCIÓN LLAMADA API
//Función que utiliza fecth para hacer la consulta a la API con el método GET por defecto
function obtenerDatos() {
  //Llamada a la API PreguntApi

  let endpoint =
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";

  fetch(endpoint)
    .then((respuesta) => respuesta.json()) //Devuelve una promesa
    .then((data) => {
      //La respuesta de la API es un array de objetos que almaceno en mi variable global preguntas
      preguntas = data.results;
      //Compruebo que el array de datos contenga preguntas antes de llamar a la función
      //para mostrar preguntas e iniciar la cuenta atrás
      if (preguntas.length > 0) {
        mostrarPregunta();
        cuentaAtras();
      }
    }) //Capturamos errores en caso de un fallo en la solicitud
    .catch((err) => {
      console.log("Solicitud fallida", err);
      mostrarMensajeError();
    });
}
