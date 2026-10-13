import React, { useState } from "react";
import { DatosPersonales } from "./DatosPersonales";
import { FormacionAcademica } from "./Formacion_maxima";
import { EnviarCV } from "./Enviar_cv";
import { validarFormulario } from "../validaciones/Validar";
import { API_BASE_URL } from "../../config/api";

export function BaseForm() {
    // aca vamos a crear todas las variables que vamos a usar en el formulario, sirven para almacenar los datos que el usuario va ingresando
    // por ejemplo el nombre, apellido, dni, telefono, etc
    const [user, setUser] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: "",
        telefono: '',
        correo: '',
        residencia: '',
        municipio: '',
        localidad: '',
        calle: '',
        altura: '',
        especialidades: [],
        formacion: '',
        otrasFormaciones: '',
        linkedin: '',
        experienciaDocencia: false,
        cv: null
    });

    // aca vamos a crear la funcion que se va a ejecutar cuando se envie el formulario, esta funcion va a recibir el evento 'e' como parametro, 
    // evita que la pagina se recargue al enviar el formulario y valida los datos con Validar.js
    const handleSumbitForm = async (e) => {
    e.preventDefault();
    const { valido, errores } = validarFormulario(user);
    if (!valido) {
        alert("Por favor revise los siguientes campos obligatorios:\n\n• " + Object.values(errores).join("\n• "));
        return;
    }

    const idSituacion = user.experienciaDocencia ? 1 : 3;
    const tags = user.especialidades.map(esp => Number(esp.value));
    if (user.experienciaDocencia) tags.push(10);

    //El token viene del link 
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
        alert("Enlace de postulación inválido: falta el token de invitación.");
        return;
    }

    const payload = {
        token,
        nombre: user.nombre,
        apellido: user.apellido,
        dni: user.dni,
        fecha_nacimiento: user.fechaNacimiento,   
        id_localidad: Number(user.localidad),           
        mail_personal: user.correo,
        telefono_principal: user.telefono,
        linkedin: user.linkedin,
        nivel_titulacion: user.formacion,
        otras_formaciones: user.otrasFormaciones,
        id_situacion_institucional: idSituacion,
        tags,
    };

    try {
        //Datos en JSON
        const resForm = await fetch(`${API_BASE_URL}/api/postulantes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!resForm.ok) {
            let detalle = "";
            try {
                const data = await resForm.json();
                detalle = data.error || data.message || "";
            } catch (_) { /* cuerpo no JSON */ }
            throw new Error(detalle || `Falló el envío de datos (HTTP ${resForm.status})`);
        }
        const { postulante_id } = await resForm.json();

        //PDF
        const formData = new FormData();
        formData.append("cv", user.cv);           
        const resCv = await fetch(`${API_BASE_URL}/api/postulantes/${postulante_id}/cv`, {
            method: "POST",
            body: formData,                        
        });
        if (!resCv.ok) throw new Error("Falló la subida del CV");

        alert("¡Postulación enviada con éxito!");
    } catch (err) {
        console.error(err);
        alert(err.message || "Hubo un error al enviar. Intentá de nuevo.");
    }
};

    // Creo la funcion que se ejecuta cada vez que el usuario interactua con un campo (evento OnChange), 
    // donde recibe el evento "e" como parametro, extraigo de e.target las propiedades name, value, type, checked y files
    // soporta checkboxes, archivos (files), filtrado numérico para DNI y teléfono, y componentes personalizados
    const handleUsernameInput = (e) => {
        const { name, value, type, checked, files } = e.target;

        let valorFinal = value;
        if (type === "checkbox") {
            valorFinal = checked;
        } else if (type === "file") {
            valorFinal = files && files.length > 0 ? files[0] : null;
        }
        
        if (name === "dni" || name === "telefono") {
            const soloNumeros = (value || "").replace(/\D/g, "");
            setUser(prevUser => ({ ...prevUser, [name]: soloNumeros }));
            return;
        }
        setUser(prevUser => ({ ...prevUser, [name]: valorFinal }));
    };

    //Aca es donde se renderiza los componentes del formulario, le asignamos el state 'user' y la funcion 'handleUsernameInput' a cada componente que necesite 
    //recibir los datos
    return (
        <>
            <div className="container p-2">
                <div className="card mx-auto ">
                    <div className="card-body">
                        <h5 className="text-center mb-3">Formulario de postulación Docente UNPilar</h5>
                        <img className="logo" src="./logo-unpi.png" alt="logo-unpi"/>
                        <form onSubmit={handleSumbitForm}>
                            <div className="datos-personales mb-2">
                                <DatosPersonales user={user} onChange={handleUsernameInput} />
                            </div>

                            <div className="formacion-academica mb-2">
                                <FormacionAcademica user={user} onChange={handleUsernameInput} />
                            </div>

                            <div className="enviar-cv mb-2">
                                <EnviarCV user={user} onChange={handleUsernameInput} />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{width:"40%"}}>Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}