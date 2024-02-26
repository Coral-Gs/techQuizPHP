//EXAMEN DESARROLLO ENTORNO CLIENTE - CORAL GUTIÉRREZ SÁNCHEZ

//CONSUMICIÓN API

//Función que utiliza fetch para hacer la consulta a la API con el método GET por defecto
function obtenerDatos() {
  //Llamada a la API Open Trivia Database
  let endpoint =
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";

  fetch(endpoint) //Fetch realiza una solicitud HTTP al endpoint
    .then((respuesta) => respuesta.json()) //Devuelve una promesa que se convierte a formato JSON
    .then((data) => {
      //Maneja los datos devueltos por la API
      //La respuesta de la API es un array de objetos que almaceno en mi variable global preguntas
      preguntas = data.results;

      //Llamo a las funciones de mostrar pregunta y comenzar la cuenta atrás
      mostrarPregunta();
      cuentaAtras();
    }) //Capturamos errores en caso de un fallo en la solicitud
    .catch((err) => {
      console.log("Solicitud fallida", err);
      //Llamo a la función para mostrar un mensaje de error personalizado al usuario
      //Solicitando que vuelva a intentar jugar más tarde
      mostrarMensajeError();
    });
}

//Simulación solicitud POST
//Función para agregar una nueva pregunta a la BD
function agregarPreguntaBD() {
  //Endpoint ficticio para llamadas mediante método post
  let endpoint = "https://opentdb.com/api.php/questions";
  //Objeto con los datos de la nueva pregunta
  let nuevaPregunta = {
    category: "Science: Computers",
    correct_answer: ".php",
    difficulty: "easy",
    incorrect_answers: [".ph", ".py", ".js"],
    question: "What is the default file extension for PHP files?",
    type: "multiple",
    id: 1,
  };

  fetch(endpoint, {
    method: "POST", //El método por el que se envía la solicitud
    headers: {
      //La cabecera de la solicitud
      "Content-Type": "application/json",
      Authorization: "APIKEY0000000", //Autorización para la solicitud
    },
    //En el body incluimos los datos de la nueva pregunta siguiendo el mismo formato
    //que la respuesta que recibo de la API cuando hago un GET en la función obtenerDatos
    body: JSON.stringify(nuevaPregunta),
    // JSON.stringify() convierte un objeto en una cadena de texto en formato JSON
  })
    .then((response) => response.json())
    .then((data) => {
      //Muestra si la solicitud se ha completado
      console.log("Pregunta creada con éxito: ", data);
    })
    .catch((err) => {
      //Captura posibles errores y los muestra
      console.log("Error en la creación de la pregunta: ", err);
    });
}

//Simulación solicitud PUT
//Función para actualizar una pregunta completa de la BD
function actualizarPregunta() {
  //Endpoint ficticio tendría al final el id de la pregunta
  let endpoint = "https://opentdb.com/api.php/questions/1";
  //Objeto con los datos completos de la pregunta a actualizar
  let datosCompletos = {
    category: "Science: Computers",
    correct_answer: "Hypertext Preprocessor",
    difficulty: "middle",
    incorrect_answers: [
      "Personal Home Page",
      "Preprocessed Hypertext Processor",
      "Primary Hyperlink Processing",
    ],
    question: "What does PHP stand for?",
    type: "multiple",
    id: 1,
  };

  fetch(endpoint, {
    method: "PUT", //El método por el que se envía la solicitud
    headers: {
      //La cabecera de la solicitud
      "Content-Type": "application/json",
      Authorization: "APIKEY0000000", //Autorización para la solicitud
    },
    //La solicitud PUT actualiza/reemplaza el recurso completo,
    //por lo que debemos incluir todos campos, aunque algunos no presenten cambios
    body: JSON.stringify(datosCompletos),
  })
    .then((response) => response.json())
    .then((data) => {
      //Muestra si la solicitud se ha completado con éxito
      console.log("Actualización realizada con éxito: ", data);
    })
    .catch((err) => {
      //Captura posibles errores y los muestra
      console.log("Error en la actualización: ", err);
    });
}

//Simulación solicitud PATCH
//Función para actualizar parcialmente una pregunta
function actualizarDatoPregunta() {
  //Endpoint ficticio tendría al final el id de la pregunta
  let endpoint = "https://opentdb.com/api.php/questions/1";
  //Objeto con los datos que quiero modificar
  let datosNuevos = {
    correct_answer: "Personal Home Page",
    question: "What did PHP stand for originally?",
  };
  fetch(endpoint, {
    method: "PATCH", //El método por el que se envía la solicitud
    headers: {
      //La cabecera de la solicitud
      "Content-Type": "application/json",
      Authorization: "APIKEY0000000", //Autorización para la solicitud
    },
    //La solicitud PATCH no necesita que incluyamos todos los campos
    //Ya que puede actualizar parcialmente un recurso, dejando el resto como estaba
    //En este caso solo cambiamos la pregunta y la respuesta correcta
    body: JSON.stringify(datosNuevos),
  })
    .then((response) => response.json())
    .then((data) => {
      //Muestra si la solicitud se ha completado con éxito
      console.log("Modificación realizada con éxito:", data);
    })
    .catch((err) => {
      //Captura posibles errores y los muestra
      console.log("Error en la modificación: ", err);
    });
}

//Simulación solicitud DELETE
//Función para borrar una pregunta de la BD
function borrarPregunta() {
  //Endpoint ficticio tendría al final el id de la pregunta
  let endpoint = "https://opentdb.com/api.php/questions/1";
  fetch(endpoint, {
    method: "DELETE", //No necesita body ya que no enviamos datos al servidor
    headers: {
      //La cabecera de la solicitud
      "Content-Type": "application/json",
      Authorization: "APIKEY0000000", //Autorización para la solicitud
    },
  })
    .then(() => {
      //Muestra si la solicitud se ha completado con éxito
      console.log("La pregunta se ha eliminado con éxito");
    })
    .catch((err) => {
      //Captura posibles errores y los muestra
      console.log("La pregunta no ha podido eliminarse", err);
    });
}
