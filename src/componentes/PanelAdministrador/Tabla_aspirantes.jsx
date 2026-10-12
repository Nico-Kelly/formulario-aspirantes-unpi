import React from "react";

import { IconosPanelAdmin } from "./Iconos_panel.jsx";

const formatearFecha = (valor) => {
  if (!valor) return "—";
  const fecha = new Date(valor);
  if (isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const estiloEstado = (estado) => {
  switch (estado) {
    case "Revisado":
      return "bg-success";
    case "Entrevista Agendada":
      return "bg-info text-dark";
    case "Pendiente":
    default:
      return "bg-warning text-dark";
  }
};

export function TablaAspirantes({
  aspirantes,
  busqueda,
  colorPrimario = "#14589f",
  onVerDetalles,
  onAgendarEntrevista
}) {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden border w-100">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 text-start">
          <thead>
            <tr>
              <th className="py-3 px-4 fw-medium text-white" style={{ backgroundColor: colorPrimario }}>
                Fecha
              </th>
              <th className="py-3 px-4 fw-medium text-white" style={{ backgroundColor: colorPrimario }}>
                Apellido y Nombre
              </th>
              <th className="py-3 px-4 fw-medium text-white" style={{ backgroundColor: colorPrimario }}>
                Especialidad
              </th>
              <th className="py-3 px-4 fw-medium text-white" style={{ backgroundColor: colorPrimario }}>
                Nivel Académico
              </th>
              <th className="py-3 px-4 fw-medium text-white" style={{ backgroundColor: colorPrimario }}>
                Estado
              </th>
              <th
                className="py-3 px-4 fw-medium text-white text-center"
                style={{ backgroundColor: colorPrimario, width: "180px" }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {aspirantes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-4">
                  No se encontraron aspirantes para "{busqueda}"
                </td>
              </tr>
            ) : (
              aspirantes.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 text-secondary">{formatearFecha(a.fecha)}</td>
                  <td className="px-4 py-3 fw-bold">
                    {a.apellido_y_nombre || `${a.apellido}, ${a.nombre}`}
                  </td>
                  <td className="px-4 py-3 text-secondary">{a.especialidad || "—"}</td>
                  <td className="px-4 py-3 text-secondary">{a.nivel_academico || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${estiloEstado(a.estado)} border px-3 py-2 rounded-pill shadow-sm`}
                    >
                      {a.estado || "Pendiente"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <IconosPanelAdmin
                      onVerDetalles={() => onVerDetalles(a)}
                      onAgendarEntrevista={() => onAgendarEntrevista(a)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
