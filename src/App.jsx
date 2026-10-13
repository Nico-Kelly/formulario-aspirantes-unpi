import React, { useState } from 'react';
import "./App.css";
import { BaseForm } from "./componentes/formulario/Base";
import { LoginUsuario } from "./componentes/PanelAdministrador/Login_usuario";
import { PanelPrincipal } from "./componentes/PanelAdministrador/Panel_principal";

function App() {
  const esPostulacion = typeof window !== "undefined" && (
    new URLSearchParams(window.location.search).has("token") ||
    window.location.pathname.includes("postulacion")
  );
  const [vistaActual, setVistaActual] = useState(esPostulacion ? "formulario" : "login"); 

  const manejarLoginExitoso = () => {
    setVistaActual("panel");
  };

  return (
    <div className="App">
      
      {/* Menú de navegación para desarrollo */}
      <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 9999, backgroundColor: "rgba(255,255,255,0.9)", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
        <span className="me-3 fw-bold text-dark">Navegación de prueba:</span>
        <button 
          className={`btn btn-sm ${vistaActual === "formulario" ? "btn-primary" : "btn-outline-primary"} me-2`}
          onClick={() => setVistaActual("formulario")}
        >
          Formulario
        </button>
        <button 
          className={`btn btn-sm ${vistaActual === "login" ? "btn-primary" : "btn-outline-primary"} me-2`}
          onClick={() => setVistaActual("login")}
        >
          Login Admin
        </button>
        <button 
          className={`btn btn-sm ${vistaActual === "panel" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setVistaActual("panel")}
        >
          Panel
        </button>
      </div>

      {vistaActual === "formulario" && <BaseForm />}
      {vistaActual === "login" && <LoginUsuario onLoginExitoso={manejarLoginExitoso} />}
      {vistaActual === "panel" && <PanelPrincipal />}
      
    </div>
  );
}

export default App;