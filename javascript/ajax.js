function mostrarScore() {
  let ajax = new XMLHttpRequest();

  let scoresCont = document.getElementById("scores");

  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      //Parseo la respuesta que devuelve
      let scores = JSON.parse(ajax.responseText);
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
        //Cambio el formato de la fecha de YYYY-MM-DD a DD-MM-YYYY con la función split()
        //para pasar de String a un Array y manejo las posiciones para mostrar los datos commo quiero
        let fechaOrigen = score.date;
        console.log(fechaOrigen);
        let fechaSplit = fechaOrigen.split("-");
        console.log(fechaSplit);

        let fecha = fechaSplit[2] + "-" + fechaSplit[1] + "-" + fechaSplit[0];

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

      tabla.innerHTML = tablaHTML;

      //Si no hay datos en la BD, muestro un mensaje
    } else if (scores.length === 0) {
      scoresCont.innerHTML = "";
      scoresCont.innerHTML = "No scores. Register your score now!";
      //Si el el estado es 4 pero el estatus no es 200, muestro mensaje de error
    } else if (ajax.readyState === 4) {
      scoresCont.innerHTML = "";
      scoresCont.innerHTML = "Sorry! We are unable to show current results";
    }
  };

  ajax.open("GET", "php/mostrar.php", true);
  ajax.send();
}

function registrarScore() {
  let ajax = new XMLHttpRequest();
  let nombre = document.getElementById("nombre").value;
  let email = document.getElementById("email").value;
  let score = puntuacion;
  let phone = document.getElementById("phone").value;
  //Compongo la fecha actual
  let fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth();
  let anio = fecha.getFullYear();
  let fechaHoy = anio + "-" + (mes + 1) + "-" + dia;
  let date = fechaHoy.toString();

  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      console.log("Todo OK!");
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
