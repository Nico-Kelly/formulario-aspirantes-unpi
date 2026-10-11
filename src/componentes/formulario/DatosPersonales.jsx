import { Residencia } from "./Residencia_del_usuario";
export function DatosPersonales({ user, onChange, required }) {
  // aca voy a crear la estructura que va a tener el formulario, por ejemplo el nombre, apellido, dni, telefono, etc
  // uso el  el componente 'div' para crear los campos del formulario, el componente 'input-group' para agrupar los campos,
  // el componente 'input-group-prepend' para agregar un icono antes del campo, el componente 'input-group-text' para agregar un texto antes del campo
  // el componente 'form-control' para que el campo tenga el estilo de bootstrap, el componente 'form-group' para agrupar los campos
  // le asigno los atributos de name y value, en name para que sirva como identificador para guardar los datos en el objeto user y en value para que muestre el valor del input,
  // tambien en value utilizo el ? que es un operador de encadenamiento que sirve para que si el valor es null, no muestre nada,
  // tambien utilizo el 'onChange' para que se ejecute la funcion 'handleUsernameInput' cuando el usuario escriba en el input

  return (
    <>
      <h5 className="text-center mb-3">Datos Personales</h5>

      <div className="row">
        {/* Nombre */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={user?.nombre || ""}
            onChange={onChange}
            required
          />
        </div>

        {/* Apellido */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Apellido *</label>
          <input
            type="text"
            className="form-control"
            name="apellido"
            value={user?.apellido || ""}
            onChange={onChange}
            required
          />
        </div>

        {/* DNI */}
        <div className="col-md-6 mb-3">
          <label className="form-label">DNI *</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="form-control"
            name="dni"
            value={user?.dni || ""}
            onChange={onChange}
            required
          />
        </div>

        {/* Fecha de Nacimiento */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha de nacimiento *</label>
          <input
            type="date"
            className="form-control"
            name="fechaNacimiento"
            value={user?.fechaNacimiento || ""}
            onChange={onChange}
            required
          />
        </div>

        {/* Teléfono */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Teléfono *</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="form-control"
            name="telefono"
            value={user?.telefono || ""}
            onChange={onChange}
            required
          />
        </div>

        {/* Correo electrónico */}
        <div className="col-md-6 mb-3" style={{ maxWidth: "800px" }} x>
          <label className="form-label">Correo electrónico *</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={user?.correo || ""}
            onChange={onChange}
            required
          />
        </div>
        {/* Columna para LinkedIn */}
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Perfil de LinkedIn <i className="bi bi-linkedin"></i>
          </label>
          <input
            type="text"
            className="form-control"
            name="linkedin"
            value={user?.linkedin || ""}
            onChange={onChange}
          />
        </div>

        {/* Residencia del usuario */}
        <Residencia user={user} onChange={onChange} required />

        {/* Experiencia en docencia universitaria */}
        <div className="col-12 mb-3 mt-2">
          <div className="form-check d-flex align-items-center gap-2">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              id="flexCheckDefault"
              name="experienciaDocencia"
              checked={Boolean(user?.experienciaDocencia)}
              onChange={onChange}
            />
            <label
              className="form-check-label mb-0"
              htmlFor="flexCheckDefault"
            >
              Poseo experiencia como Docente universitario
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
