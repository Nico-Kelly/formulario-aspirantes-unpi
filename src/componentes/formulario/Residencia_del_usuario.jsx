import { useState, useEffect } from "react";
import { Dropdown, Form } from "react-bootstrap";

export function Residencia({ user, onChange }) {
  //Esto es para manejar la selección de municipio y localidad, así como la búsqueda dentro de ellos.
  const [municipio, setMunicipio] = useState(null); //Para almacenar el municipio seleccionado.
  const [municipios, setMunicipios] = useState([]); //Para almacenar la lista de municipios de la API.
  const [busquedaMunicipio, setBusquedaMunicipio] = useState(""); //Para almacenar el texto de búsqueda del municipio y mostrarlo en el dropdown.

  const [localidad, setLocalidad] = useState(null); //Para almacenar la localidad seleccionada.
  const [localidades, setLocalidades] = useState([]); //Para almacenar la lista de localidades de la API.
  const [busquedaLocalidad, setBusquedaLocalidad] = useState(""); //Para almacenar el texto de búsqueda de la localidad y mostrarlo en el dropdown.

  //Carga la lista de municipios cuando eligen PBA.
  useEffect(() => {
    if (user?.residencia !== "PBA") {
      setMunicipios([]);
      setMunicipio(null);
      return;
    }

    setMunicipio(null); //Reinicia el municipio seleccionado al cambiar la residencia.

    fetch(
      "https://apis.datos.gob.ar/georef/api/municipios?provincia=buenos%20aires&max=200&campos=id,nombre&orden=nombre",
    )
      .then((res) => res.json())
      .then((data) => setMunicipios(data.municipios || []))
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
      `https://apis.datos.gob.ar/georef/api/localidades?municipio=${municipio.id}&max=200&campos=id,nombre&orden=nombre`,
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
    user?.residencia === "CABA" || (user?.residencia === "PBA" && (localidad || user?.localidad));

  return (
    <>
      <div className="col-md-6 mb-3">
        <label className="form-label">Residencia *</label>
        <select
          className="form-select"
          name="residencia"
          value={user?.residencia || ""}
          onChange={(e) => {
            const nuevaResidencia = e.target.value;
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

      {user?.residencia === "PBA" && (
        <>
          <div className="col-md-6 mb-3">
            <label className="form-label">Municipio *</label>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                className="w-100 text-start d-flex justify-content-between align-items-center"
              >
                <span>{user?.municipio || (municipio ? municipio.nombre : "Seleccionar municipio...")}</span>
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
                        onChange({ target: { name: "municipio", value: m.nombre } });
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
            <label className="form-label">Localidad *</label>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                className="w-100 text-start d-flex justify-content-between align-items-center"
                disabled={!municipio}
              >
                <span className={user?.localidad ? "" : "text-muted"}>
                  {user?.localidad || (municipio ? "Seleccionar localidad..." : "Seleccione municipio primero...")}
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
                        onChange({ target: { name: "localidad", value: l.nombre } });
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
