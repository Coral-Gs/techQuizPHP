//EXAMEN DESARROLLO ENTORNO CLIENTE - CORAL GUTIÉRREZ SÁNCHEZ

//AJAX GET Y POST

//Función para mostrar el ranking de puntuaciones de la base de datos
function mostrarScore() {
  let ajax = new XMLHttpRequest(); //Creo el objeto ajax
  let scoresCont = document.getElementById("scores");

  ajax.onreadystatechange = function () {
    //Compruebo si el estado de la solicitud es 4 (listo) y 200 (correcto)
    if (ajax.readyState === 4 && ajax.status === 200) {
      //Parseo la respuesta que devuelve y creo la tabla con los resultados
      let scores = JSON.parse(ajax.responseText);
      crearTablaScores(scores);

      //Si el el estado es 4 pero el estatus no es 200, muestro mensaje de error
    } else if (ajax.readyState === 4) {
      scoresCont.innerHTML = "";
      scoresCont.innerHTML = "Sorry! We are unable to show current results";
    }
  };
  ajax.open("GET", "php/mostrar.php", true);
  ajax.send();
}

//Función para formatear fecha de YYYY-MM-DD a DD-MM-YYYY con la función split()
//para pasar de String a un Array y manejo las posiciones para mostrar los datos commo quiero
function formatearFecha(resultados) {
  let fechaOrigen = resultados.date;
  let fechaSplit = fechaOrigen.split("-");
  let fecha = fechaSplit[2] + "-" + fechaSplit[1] + "-" + fechaSplit[0];
  return fecha;
}

//Función para crear la tabla de los resultados
function crearTablaScores(resultados) {
  let scores = resultados;
  let tabla = document.getElementById("scores");
  let tablaHTML = `
      <table>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Date</th>
        <th>Score</th>
      `;

  //Agrego a la tabla los valores recogidos de la BD
  scores.forEach((score) => {
    let fecha = formatearFecha(score);

    tablaHTML += ` 
        <tr>
          <td>${score.name}</td>
          <td>${score.email}</td>
          <td>${score.phone}</td>
          <td>${fecha}</td>
          <td>${score.score}</td>
        </tr>        
`;
  });

  //Cierro la tabla
  tablaHTML += `</table>`;
  //Añado el contenido al HTML
  tabla.innerHTML = tablaHTML;
}

//Función para registrar la puntuación obtenida en la partida
function registrarScore() {
  let ajax = new XMLHttpRequest(); //Creo objeto ajax
  //Recojo los datos de los campos que voy a registrar
  let nombre = document.getElementById("nombre").value;
  let email = document.getElementById("email").value;
  let score = puntuacion;
  let phone = document.getElementById("phone").value;
  let date = fechaActual();

  ajax.onreadystatechange = function () {
    //Compruebo si el estado de la solicitud es 4 (listo) y 200 (correcto)
    if (ajax.readyState === 4 && ajax.status === 200) {
      //Una vez insertado el nuevo registro en la base de datos
      //cargo de nuevo la tabla del ranking de usuarios y puntuaciones
      //para que aparezca actualizada
      mostrarScore();
    }
  };
  //Envío cadena con todos los datos mediante el método POSTs
  ajax.open("POST", "php/agregar.php", true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(
    `nombre=${nombre}&email=${email}&date=${date}&phone=${phone}&score=${score}`
  );
}

//Función para obtener la fecha actual de la partida
//Devuelve un string con el formato adecuando para insertarlo en la base de datos
function fechaActual() {
  let fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth();
  let anio = fecha.getFullYear();
  let fechaHoy = anio + "-" + (mes + 1) + "-" + dia;
  return fechaHoy.toString();
}

//Función para comprobar si un email dado está ya en la base de datos
function comprobarEmail(emailForm, mensajes) {
  let ajax = new XMLHttpRequest();
  let email = emailForm.value;

  ajax.onreadystatechange = function () {
    //Compruebo si el estado de la solicitud es 4 (listo) y 200 (correcto)
    if (ajax.readyState === 4 && ajax.status === 200) {
      let emailExiste = JSON.parse(ajax.responseText);

      //Verifica si el correo electrónico existe
      //Si es así muestra un mensaje de error
      if (emailExiste) {
        mensajes.push(
          "The email is already registered. Please enter another email"
        );
      }
    } else if (ajax.readyState === 4) {
      console.error("Error al obtener los datos");
      mensajes.push("Error verifying the email. Please try again later");
    }
    //Llamo a la función mostrar avisos una vez que la llamada AJAX se ha completado
    mostrarAvisos(mensajes);
  };

  //Envío el dato del email mediante solicitud POST
  ajax.open("POST", "php/buscar.php", true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send("email=" + email);
}
