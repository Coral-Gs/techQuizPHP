//VALIDACIÓN DE FORMULARIO

//El nombre solo permite letras en mayúsculas y minúsculas y números,
//sin espacios ni caracteres especiales
function validarCampos() {
  let mensajes = []; //Meter en array mensaje y luego mostrar
  validarNombre();
  validarEmail();
  validarFecha();
}

function validarNombre() {
  let nombre = document.getElementById("nombre");
  let mensaje = "";
  if (!nombre.checkValidity()) {
    if (nombre.value.length === 0) {
      alert("Debe introducir un nombre");
      mensaje = "Debe introducir un nombre";
    }
    if (nombre.validity.patternMismatch) {
      mensaje = "El nombre no puede contener espacios o caracteres especiales";
    }
  }
  document.getElementById("validaciones").innerHTML = mensaje;
}

function validarEmail() {
  let email = document.getElementById("email");
  let mensaje = "";
  if (!email.checkValidity()) {
    if (email.value.length === 0) {
      alert("Debe introducir un email");
      mensaje = "Debe introducir un email";
    }
    if (email.validity.typeMismatch) {
      mensaje = "El email debe tener el formato email@email.com";
    }
  }
  document.getElementById("validaciones").innerHTML = mensaje;
}

function validarFecha() {}
