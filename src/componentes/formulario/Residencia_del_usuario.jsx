import { useState, useEffect } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { API_BASE_URL } from "../../config/api";

export function Residencia({ user, onChange }) {
  //Esto es para manejar la selección de municipio y localidad, así como la búsqueda dentro de ellos.
  const [municipio, setMunicipio] = useState(null); //Para almacenar el municipio seleccionado.
  const [municipios, setMunicipios] = useState([]); //Para almacenar la lista de municipios de la API.
  const [busquedaMunicipio, setBusquedaMunicipio] = useState(""); //Para almacenar el texto de búsqueda del municipio y mostrarlo en el dropdown.

  const [localidad, setLocalidad] = useState(null); //Para almacenar la localidad seleccionada.
  const [localidades, setLocalidades] = useState([]); //Para almacenar la lista de localidades de la API.
  const [busquedaLocalidad, setBusquedaLocalidad] = useState(""); //Para almacenar el texto de búsqueda de la localidad y mostrarlo en el dropdown.

  //Carga la lista de municipios según la residencia elegida (PBA -> municipios; CABA -> comunas).
  useEffect(() => {
    const esPBA = user?.residencia === "PBA";
    const esCABA = user?.residencia === "CABA";

    if (!esPBA && !esCABA) {
      setMunicipios([]);
      setMunicipio(null);
      return;
    }

    setMunicipio(null); //Reinicia el municipio seleccionado al cambiar la residencia.

    fetch(`${API_BASE_URL}/api/municipios`)
      .then((res) => res.json())
      .then((data) => {
        const todos = data.municipios || [];
        const esComuna = (m) => /^comuna\s*\d/i.test(m.nombre);
        const filtrados = esCABA
          ? todos.filter(esComuna)
          : todos.filter((m) => !esComuna(m));
        setMunicipios(filtrados);
      })
      .catch((err) => console.error("Error al cargar municipios:", err));
  }, [user?.residencia]);

  //Carga la lista de localidades cuando eligen un municipio.
  useEffect(() => {
    if (!municipio) {
      setLocalidades([]);
      return;
    }

    setLocalidad(null); //Reinicia la localidad seleccionada al cambiar el municipio.

    fetch(
      `${API_BASE_URL}/api/localidades?id_municipio=${municipio.id}`,
    )
      .then((res) => res.json())
      .then((data) => setLocalidades(data.localidades || []))
      .catch((err) => console.error("Error al cargar localidades:", err));
  }, [municipio]);

  //Filtra los municipios y localidades según la búsqueda de la persona.
  const municipiosFiltrados = municipios.filter((m) =>
    m.nombre.toLowerCase().includes(busquedaMunicipio.toLowerCase()),
  );

  const localidadesFiltradas = localidades.filter((l) =>
    l.nombre.toLowerCase().includes(busquedaLocalidad.toLowerCase()),
  );

  //Muestra el campo Calle y Altura:
  //En CABA, recien cuando se elige esa opción.
  //En PBA, recién cuando ya hay localidad elegida.
  const mostrarDireccion =
    user?.residencia === "CABA" || (user?.residencia === "PBA" && localidad);

  // Los campos Calle y Altura se reservan para una etapa posterior (aún no en uso).
  void mostrarDireccion;

  return (
    <>
      <div className="col-md-6 mb-3">
        <label className="form-label">Residencia *</label>
        <select
          className="form-select"
          name="residencia"
          value={user?.residencia || ""}
          onChange={(e) => {
            onChange(e);
            // Limpia municipio y localidad en el usuario y estado local si cambia
            if (onChange) {
              onChange({ target: { name: "municipio", value: "" } });
              onChange({ target: { name: "localidad", value: "" } });
            }
            setMunicipio(null);
            setLocalidad(null);
            setBusquedaMunicipio("");
            setBusquedaLocalidad("");
          }}
          required
        >
          <option value="">Seleccionar...</option>
          <option value="CABA">C.A.B.A</option>
          <option value="PBA">Provincia de Buenos Aires</option>
        </select>
      </div>

      {(user?.residencia === "PBA" || user?.residencia === "CABA") && (
        <>
          <div className="col-md-6 mb-3">
            <label className="form-label">{user?.residencia === "CABA" ? "Comuna *" : "Municipio *"}</label>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                className="w-100 text-start d-flex justify-content-between align-items-center"
              >
                <span>
                  {municipio
                    ? municipio.nombre
                    : user?.residencia === "CABA"
                      ? "Seleccionar comuna..."
                      : "Seleccionar municipio..."}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="w-100 p-2"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  className="mb-2"
                  value={busquedaMunicipio}
                  onChange={(e) => setBusquedaMunicipio(e.target.value)}
                  onClick={(e) => e.stopPropagation()} //Evita que el click cierre el menú.
                />
                {municipiosFiltrados.length === 0 && (
                  <Dropdown.ItemText>Sin resultados</Dropdown.ItemText>
                )}
                {municipiosFiltrados.map((m) => (
                  <Dropdown.Item
                    key={m.id}
                    onClick={() => {
                      setMunicipio(m);
                      setLocalidad(null);
                      setBusquedaMunicipio("");
                      if (onChange) {
                        onChange({ target: { name: "municipio", value: m.id } });
                        onChange({ target: { name: "localidad", value: "" } });
                      }
                    }}
                  >
                    {m.nombre}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{user?.residencia === "CABA" ? "Barrio *" : "Localidad *"}</label>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                className="w-100 text-start d-flex justify-content-between align-items-center"
                disabled={!municipio}
              >
                <span className={localidad ? "" : "text-muted"}>
                  {localidad
                    ? localidad.nombre
                    : municipio
                      ? (user?.residencia === "CABA" ? "Seleccionar barrio..." : "Seleccionar localidad...")
                      : (user?.residencia === "CABA" ? "Seleccione comuna primero..." : "Seleccione municipio primero...")}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="w-100 p-2"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  className="mb-2"
                  value={busquedaLocalidad}
                  onChange={(e) => setBusquedaLocalidad(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                {localidadesFiltradas.length === 0 && (
                  <Dropdown.ItemText>Sin resultados</Dropdown.ItemText>
                )}
                {localidadesFiltradas.map((l) => (
                  <Dropdown.Item
                    key={l.id}
                    onClick={() => {
                      setLocalidad(l);
                      setBusquedaLocalidad("");
                      if (onChange) {
                        onChange({ target: { name: "localidad", value: l.id } });
                      }
                    }}
                  >
                    {l.nombre}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      )}
    </>
  );
}

export default Residencia;
