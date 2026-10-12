//Aca van las validaciones para cada uno de los campos del formulario.
//Busque como se validaba en React esos datos y me aparecieron estos codigos generales, se utiliza Regex.
export const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const regexCorreo = regexEmail;

export const regexDni = /^\d{7,8}$/;

export const regexTelefono = /^\d{10,15}$/;

//Esta funcion se fija campo por campo, si es que el usuario completo bien los datos.
//Por lo que vi, para que no quede un matete de "if... else..." por cada dato, se puede usar el "switch" y el "case".
export function campoCompletado(nombreDelCampo, valor) {
  switch (nombreDelCampo) { //El switch aca va a ir chequeando cada uno de los campos del formulario, y el case va a ser cada uno de los campos que se van a validar.
    //Switch significa "chequear", y case significa "caso", o sea, cada caso del formulario que se va a chequear. Osea cada campo.
    case "nombre":
    case "apellido":
      //Que no este vacio.
      return typeof valor === "string" && valor.trim().length > 0;

    case "dni":
      return typeof valor === "string" && regexDni.test(valor.trim());

    case "telefono":
      return typeof valor === "string" && regexTelefono.test(valor.trim());

    case "correo":
      return typeof valor === "string" && regexCorreo.test(valor.trim());

    case "nivelTitulacion":
    case "formacion":
      //Esta bien si el usuario ya eligio alguna opcion (no quedo vacio).
      return valor !== "" && valor !== null && valor !== undefined;

    case "residencia":
      return typeof valor === "string" && valor.trim().length > 0;

    case "especialidades":
      return Array.isArray(valor) && valor.length > 0;

    case "experienciaDocencia":
      return typeof valor === "boolean";

    case "fechaNacimiento":
      return typeof valor === "string" && valor.trim().length > 0;

    case "cv":
      //Esta bien si hay un archivo cargado (osea, no es null ni vacio).
      return valor !== null && valor !== undefined && valor !== "";

    default:
      return true;
  }
}

export function validarFormulario(user) {
  const errores = {};

  if (!campoCompletado("nombre", user.nombre)) {
    errores.nombre = "El nombre es obligatorio.";
  }
  if (!campoCompletado("apellido", user.apellido)) {
    errores.apellido = "El apellido es obligatorio.";
  }
  if (!campoCompletado("dni", user.dni)) {
    errores.dni = "El DNI debe contener 7 u 8 dígitos numéricos.";
  }
  if (!campoCompletado("telefono", user.telefono)) {
    errores.telefono = "El teléfono debe contener entre 10 y 15 dígitos numéricos.";
  }
  if (!campoCompletado("correo", user.correo)) {
    errores.correo = "El correo electrónico no tiene un formato válido.";
  }
  if (!campoCompletado("residencia", user.residencia)) {
    errores.residencia = "Debe seleccionar su lugar de residencia.";
  } else if ((user.residencia === "PBA" || user.residencia === "CABA") && (!user.municipio || !user.localidad)) {
    errores.residencia = user.residencia === "CABA"
      ? "Para C.A.B.A debe seleccionar comuna y barrio."
      : "Para Provincia de Buenos Aires debe seleccionar municipio y localidad.";
  }
  if (!campoCompletado("especialidades", user.especialidades)) {
    errores.especialidades = "Debe seleccionar al menos una especialidad.";
  }
  if (!campoCompletado("formacion", user.formacion)) {
    errores.formacion = "Debe seleccionar su nivel máximo de titulación.";
  }
  if (!campoCompletado("cv", user.cv)) {
    errores.cv = "Debe adjuntar su Curriculum Vitae en formato PDF.";
  }

  if (!campoCompletado("fechaNacimiento", user.fechaNacimiento)) {
    errores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
  };
}


