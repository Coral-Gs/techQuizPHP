function mostrarScore() {
  let ajax = new XMLHttpRequest();
  let scoresCont = document.getElementById("scores");

  ajax.onreadystatechange = function () {
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

function registrarScore() {
  let ajax = new XMLHttpRequest();
  let nombre = document.getElementById("nombre").value;
  let email = document.getElementById("email").value;
  let score = puntuacion;
  let phone = document.getElementById("phone").value;
  let date = fechaActual();

  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      //Cargo de nuevo la tabla de registros de usuarios y puntuaciones
      mostrarScore();
    }
  };

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

function comprobarEmail(emailForm, mensajes) {
  let ajax = new XMLHttpRequest();
  let email = emailForm.value;

  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      let emailExiste = JSON.parse(ajax.responseText);

      // Verificar si el correo electrónico existe
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

  ajax.open("POST", "php/buscar.php", true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send("email=" + email);
}
