import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";

const API_GENERAR_LINK = `${API_BASE_URL}/api/postulantes/generar-link`;

export function CopiarUrlFormulario() {
    const [abierto, setAbierto] = useState(false);
    const [link, setLink] = useState("");
    const [cargando, setCargando] = useState(false);
    const [copiado, setCopiado] = useState(false);
    const [error, setError] = useState("");

    const generarLink = async () => {
        setCargando(true);
        setError("");
        setCopiado(false);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No hay sesión activa. Iniciá sesión como administrador.");
            setCargando(false);
            return;
        }

        try {
            const res = await fetch(API_GENERAR_LINK, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `No se pudo generar el enlace (HTTP ${res.status})`);
            }
            const data = await res.json();
            setLink(data.link);
        } catch (err) {
            setError(err.message || "Error al generar el enlace.");
        } finally {
            setCargando(false);
        }
    };

    const copiarAlPortapapeles = async () => {
        try {
            await navigator.clipboard.writeText(link);
        } catch (err) {
            // Fallback para navegadores sin permisos de clipboard
            const input = document.createElement("input");
            input.value = link;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
        }
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    const toggle = () => {
        setAbierto(!abierto);
        if (!abierto && !link) {
            generarLink();
        }
    };

    return (
        <div className="position-relative">
            <button
                className="btn btn-outline-secondary"
                style={{ fontWeight: "600" }}
                onClick={toggle}
            >
                Copiar URL del Formulario
            </button>

            {abierto && (
                <div
                    className="position-absolute end-0 mt-2 p-3 bg-white rounded shadow border text-start"
                    style={{ width: "380px", zIndex: 2000 }}
                >
                    {cargando && (
                        <div className="text-secondary small mb-2">Generando enlace...</div>
                    )}

                    {error && (
                        <div className="text-danger small mb-2">{error}</div>
                    )}

                    {link && (
                        <>
                            <label className="form-label mb-1 fw-bold text-secondary small">
                                Enlace de postulación
                            </label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={link}
                                    readOnly
                                    onFocus={(e) => e.target.select()}
                                />
                                <button className="btn btn-primary" onClick={copiarAlPortapapeles}>
                                    {copiado ? "¡Copiado!" : "Copiar"}
                                </button>
                            </div>
                            <div className="text-secondary mt-2 small">Expira en 48 horas.</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}