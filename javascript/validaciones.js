function validarCampos() {
  let mensajes = []; // Array para almacenar mensajes de error
  let mensajesDiv = document.getElementById("avisos");
  let nombre = document.getElementById("nombre");
  let email = document.getElementById("email");
  let telefono = document.getElementById("phone");
  let edad = document.getElementById("edad");

  validarNombre(nombre, mensajes);
  validarEmail(email, mensajes);
  validarTelefono(telefono, mensajes);
  validarEdad(edad, mensajes);

  mostrarMensajesDeError(mensajes, mensajesDiv);
}

function validarNombre(nombre, mensajes) {
  if (!nombre.checkValidity()) {
    if (nombre.validity.valueMissing) {
      mensajes.push("Debe introducir un nombre");
    }
    if (nombre.validity.patternMismatch) {
      mensajes.push(
        "El nombre no puede contener espacios o caracteres especiales"
      );
    }
  }
}

function validarEmail(email, mensajes) {
  if (!email.checkValidity()) {
    if (email.validity.valueMissing) {
      mensajes.push("Debe introducir un email");
    }
    if (email.validity.typeMismatch) {
      mensajes.push("El email debe tener el formato email@email.com");
    }
  }
}

function validarTelefono(telefono, mensajes) {
  if (!telefono.checkValidity()) {
    if (telefono.validity.valueMissing) {
      mensajes.push("Debe introducir un teléfono");
    }
    if (telefono.validity.tooLong || telefono.validity.tooShort) {
      mensajes.push("El teléfono debe tener 9 dígitos");
    }
  }
}

function validarEdad(edad, mensajes) {
  if (!edad.checked) {
    mensajes.push("Debe ser mayor de edad");
  }
}

function mostrarMensajesDeError(mensajes, mensajesDiv) {
  mensajesDiv.innerHTML = ""; //Limpio posibles mensajes de error anteriores
  if (mensajes.length > 0) {
    mensajes.forEach((mensaje) => {
      let mensajeError = document.createElement("p");
      mensajeError.innerHTML = mensaje;
      mensajeError.setAttribute("style", "color: red");
      mensajesDiv.appendChild(mensajeError);
    });
  } else {
    registrarScore();
  }
}
