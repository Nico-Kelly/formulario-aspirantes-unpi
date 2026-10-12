import React, { useState, useEffect } from "react";
import { EncabezadoPanelAdmin } from "./Encabezado_panel.jsx";
import { BarraFiltros } from "./Barra_filtros.jsx";
import { ModalDetalles } from "./Modal_detalles.jsx";
import { ModalEntrevista } from "./Modal_entrevista.jsx";
import { TablaAspirantes } from "./Tabla_aspirantes.jsx";

const API_POSTULANTES = "http://localhost:3001/api/postulantes";

export function PanelPrincipal() {
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalEntrevista, setModalEntrevista] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [nivel, setNivel] = useState("");
  const [expDocente, setExpDocente] = useState("");
  const [estado, setEstado] = useState("");
  const [aspirantes, setAspirantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const colorPrimario = "#14589f";
  const colorAcento = "#0d6efd";

  const limpiarFiltros = () => {
    setBusqueda("");
    setEspecialidad("");
    setNivel("");
    setExpDocente("");
    setEstado("");
  };

  useEffect(() => {
    const cargarPostulantes = async () => {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay sesión activa. Iniciá sesión como administrador.");
        setCargando(false);
        return;
      }

      try {
        const res = await fetch(API_POSTULANTES, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          setError("Sesión expirada o inválida. Volvé a iniciar sesión.");
          setCargando(false);
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Error al cargar postulantes (HTTP ${res.status})`);
        }

        const data = await res.json();
        setAspirantes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Error al cargar las postulaciones.");
      } finally {
        setCargando(false);
      }
    };

    cargarPostulantes();
  }, []);

  const normalizar = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const aspirantesFiltrados = aspirantes.filter((a) => {
    // Búsqueda por texto (nombre, apellido, DNI, email)
    const nombreCompleto = a.apellido_y_nombre || `${a.apellido}, ${a.nombre}`;
    const texto = normalizar(`${nombreCompleto} ${a.dni || ""} ${a.mail || ""}`);
    const palabras = normalizar(busqueda).split(" ").filter(Boolean);
    if (!palabras.every((p) => texto.includes(p))) return false;

    // Especialidad
    if (especialidad && (a.especialidad || "") !== especialidad) return false;

    // Nivel de titulación
    if (nivel && (a.nivel_academico || "") !== nivel) return false;

    // Estado
    if (estado && (a.estado || "Pendiente") !== estado) return false;

    // Experiencia docente
    if (expDocente) {
      const situacion = ((a.exp_docente || a.situacion_institucional) || "").toLowerCase();
      if (expDocente === "Sí") {
        if (situacion !== "es docente" && situacion !== "fue docente") return false;
      } else if (expDocente === "No") {
        if (situacion !== "nunca fue docente") return false;
      }
    }

    return true;
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#f4f6f9",
        overflowY: "auto",
        zIndex: 1000
      }}
      className="text-dark"
    >
      <div className="container-fluid py-4 px-4 px-xl-5 d-flex flex-column align-items-center">
        <div className="w-100">

          {/* Encabezado */}
          <EncabezadoPanelAdmin colorPrimario={colorPrimario} />

          {/* Barra de Filtros */}
          <BarraFiltros
            colorPrimario={colorPrimario}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            especialidad={especialidad}
            setEspecialidad={setEspecialidad}
            nivel={nivel}
            setNivel={setNivel}
            expDocente={expDocente}
            setExpDocente={setExpDocente}
            estado={estado}
            setEstado={setEstado}
            onLimpiar={limpiarFiltros}
          />

          {/* Tabla de Aspirantes */}
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: colorPrimario }} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-secondary mt-3 mb-0">Cargando postulaciones...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
              <span>{error}</span>
            </div>
          ) : aspirantesFiltrados.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              {busqueda || especialidad || nivel || expDocente || estado
                ? "No se encontraron postulaciones que coincidan con los filtros."
                : "Todavía no hay postulaciones enviadas."}
            </div>
          ) : (
            <TablaAspirantes
              aspirantes={aspirantesFiltrados}
              busqueda={busqueda}
              colorPrimario={colorPrimario}
              onVerDetalles={() => setModalDetalles(true)}
              onAgendarEntrevista={() => setModalEntrevista(true)}
            />
          )}

        </div>

        {/* Modales */}
        <ModalDetalles
          modalDetalles={modalDetalles}
          setModalDetalles={setModalDetalles}
          colorPrimario={colorPrimario}
        />
        <ModalEntrevista
          modalEntrevista={modalEntrevista}
          setModalEntrevista={setModalEntrevista}
          colorPrimario={colorPrimario}
          colorAcento={colorAcento}
        />

      </div>
    </div>
  );
}