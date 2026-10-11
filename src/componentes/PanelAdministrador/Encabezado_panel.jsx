import {CopiarUrlFormulario} from "./Url_copiar";
export function EncabezadoPanelAdmin({ colorPrimario = "#14589f" }) {
    return (
        <>
            {/* Encabezado del Panel */}
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border-start border-4" style={{ borderLeftColor: colorPrimario }}>
                <h4 className="mb-0" style={{ color: colorPrimario, fontWeight: "600" }}>Portal de Aspirantes a Cátedra</h4>
                <div className="d-flex align-items-center gap-2">
                    <CopiarUrlFormulario />
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill={colorPrimario} viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                    </svg>
                    <span className="fw-bold" style={{ color: colorPrimario }}>Admin UNPilar</span>
                </div>
            </div>
        </>
    )
}