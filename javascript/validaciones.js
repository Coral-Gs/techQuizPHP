//EXAMEN DESARROLLO ENTORNO CLIENTE - CORAL GUTIÉRREZ SÁNCHEZ

//VALIDACIONES

//Función para validar todos los campos
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

//Función para validar nombre
function validarNombre(nombre, mensajes) {
  if (!nombre.checkValidity()) {
    //Si el nombre está vacío muestro un aviso
    if (nombre.validity.valueMissing) {
      mensajes.push("You must enter a name");
    }
    //Si el nombre no coincide con las especificaciones del HTML
    //(solo puede contener letras y números sin espacios ni caracteres especiales)
    //muestra un aviso
    if (nombre.validity.patternMismatch) {
      mensajes.push("The name cannot contain spaces or special characters");
    }
  }
}

//Función para validar email
function validarEmail(email, mensajes) {
  if (!email.checkValidity()) {
    //Comprueba si el email está vacío
    if (email.validity.valueMissing) {
      mensajes.push("You must enter an email");
    }
    //Comprueba si el email coincide con el formato adecuado
    if (email.validity.typeMismatch) {
      mensajes.push("The email must have the format email@email.com");
    }
  }
}

//Función validar teléfono
function validarTelefono(telefono, mensajes) {
  if (!telefono.checkValidity()) {
    //Comprueba si el teléfono está vacío
    if (telefono.validity.valueMissing) {
      mensajes.push("You must enter a phone number");
    }
    //Comprueba si el teléfono solo tiene números
    if (telefono.validity.patternMismatch) {
      mensajes.push("The phone number can only contain numbers");
    }
    //Comprueba si el teléfono contiene 9 dígitos o es más corto/más largo
    if (telefono.validity.tooLong || telefono.validity.tooShort) {
      mensajes.push("The phone number must have 9 digits");
    }
  }
}

//Comprueba si la caja de mayor de edad está seleccionada
function validarEdad(edad, mensajes) {
  if (!edad.checked) {
    mensajes.push("You must be of legal age");
  }
}

//Muestra los avisos en el div avisos
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
    //Si no hay mensajes de error de registro,
    //llama a la función para registrar los datos en el archivo ajax.js
    registrarScore();
  }
}
