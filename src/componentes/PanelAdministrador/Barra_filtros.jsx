import { BarraBusquedaPanel } from "./Busqueda_panel.jsx";

const ESPECIALIDADES = [
    "Humanidades y Ciencias Sociales",
    "Tecnologia e Informatica",
    "Arte y Creatividad",
    "Ciencias de la salud",
    "Ciencias economicas y empresariales",
    "Ciencias exactas y naturales",
    "Construccion e ingenierias",
];

const NIVELES = ["Grado", "Maestría", "Doctorado"];

const ESTADOS = ["Pendiente", "Revisado", "Entrevista Agendada"];

export function BarraFiltros({
    busqueda,
    setBusqueda,
    especialidad,
    setEspecialidad,
    nivel,
    setNivel,
    expDocente,
    setExpDocente,
    estado,
    setEstado,
    onLimpiar
}) {
    return (
        <div className="row g-3 mb-4 p-4 bg-white rounded shadow-sm align-items-end text-start mx-0 w-100">
            {/* Buscar Postulante */}
            <div className="col-xl-3 col-lg-3 col-md-6">
                <label className="form-label mb-1 fw-bold text-secondary small">Buscar Postulante</label>
                <BarraBusquedaPanel
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                />
            </div>

            {/* Especialidad */}
            <div className="col-xl-3 col-lg-3 col-md-6">
                <label className="form-label mb-1 fw-bold text-secondary small">Especialidad</label>
                <select
                    className="form-select border-secondary-subtle"
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                >
                    <option value="">Seleccione...</option>
                    {ESPECIALIDADES.map((esp) => (
                        <option key={esp} value={esp}>{esp}</option>
                    ))}
                </select>
            </div>

            {/* Nivel de Titulación */}
            <div className="col-xl-2 col-lg-2 col-md-6">
                <label className="form-label mb-1 fw-bold text-secondary small">Nivel de Titulación</label>
                <select
                    className="form-select border-secondary-subtle"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                >
                    <option value="">Todos</option>
                    {NIVELES.map((n) => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>

            {/* Exp. Docente */}
            <div className="col-xl-2 col-lg-2 col-md-6">
                <label className="form-label mb-1 fw-bold text-secondary small">Exp. Docente</label>
                <select
                    className="form-select border-secondary-subtle"
                    value={expDocente}
                    onChange={(e) => setExpDocente(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                </select>
            </div>

            {/* Estado */}
            <div className="col-xl-2 col-lg-2 col-md-6">
                <label className="form-label mb-1 fw-bold text-secondary small">Estado</label>
                <select
                    className="form-select border-secondary-subtle"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value="">Todos</option>
                    {ESTADOS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Botones */}
            <div className="col-12 d-flex gap-2 justify-content-end mt-3">
                <button className="btn btn-outline-secondary px-4" onClick={onLimpiar}>
                    Limpiar
                </button>
            </div>
        </div>
    );
}