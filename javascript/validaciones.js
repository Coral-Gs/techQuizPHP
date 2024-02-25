function validarCampos() {
  let mensajes = []; // Array para almacenar mensajes de error
  let nombre = document.getElementById("nombre");
  let email = document.getElementById("email");
  let telefono = document.getElementById("phone");
  let edad = document.getElementById("edad");

  validarNombre(nombre, mensajes);
  validarEmail(email, mensajes);
  validarTelefono(telefono, mensajes);
  validarEdad(edad, mensajes);
  //Hago una llamada AJAX para comprobar si el email ya existe en la BD
  comprobarEmail(email, mensajes);
  //Muestro los mensajes de error desde la función de la llamada AJAX comprobarEmail
  //para que aparezcan una vez se ha comprobado el email de manera asíncrona
  //Ya que si no solo me aparecen los mensajes de validación de los datos que no requiren AJAX
}

function validarNombre(nombre, mensajes) {
  if (!nombre.checkValidity()) {
    if (nombre.validity.valueMissing) {
      mensajes.push("You must enter a name");
    }
    if (nombre.validity.patternMismatch) {
      mensajes.push("The name cannot contain spaces or special characters");
    }
  }
}

function validarEmail(email, mensajes) {
  if (!email.checkValidity()) {
    if (email.validity.valueMissing) {
      mensajes.push("You must enter an email");
    }
    if (email.validity.typeMismatch) {
      mensajes.push("The email must have the format email@email.com");
    }
  }
}

function validarTelefono(telefono, mensajes) {
  if (!telefono.checkValidity()) {
    if (telefono.validity.valueMissing) {
      mensajes.push("You must enter a phone number");
    }
    if (telefono.validity.patternMismatch) {
      mensajes.push("The phone number can only contain numbers");
    }
    if (telefono.validity.tooLong || telefono.validity.tooShort) {
      mensajes.push("The phone number must have 9 digits");
    }
  }
}

function validarEdad(edad, mensajes) {
  if (!edad.checked) {
    mensajes.push("You must be of legal age");
  }
}

function mostrarAvisos(mensajes) {
  let mensajesDiv = document.getElementById("avisos");
  mensajesDiv.innerHTML = ""; //Limpio posibles mensajes de error anteriores
  if (mensajes.length > 0) {
    mensajes.forEach((mensaje) => {
      let mensajeError = document.createElement("p");
      mensajeError.id = "mensajeError";
      mensajeError.innerHTML = mensaje;
      mensajesDiv.appendChild(mensajeError);
    });
  } else {
    registrarScore();
  }
}
