function generarUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}

function obtenerIdEncuesta() {
  const params = new URLSearchParams(
    window.location.search
  );
  return params.get("id");
}

function obtenerEncuestas() {
  try {
    const data =
      localStorage.getItem("encuestas");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(
      "Error al parsear encuestas:",
      e
    );
    return [];
  }
}

function guardarRespuesta(
  idEncuesta,
  respuestaTexto
) {
  const usuarioActual = JSON.parse(
    localStorage.getItem("usuarioActual")
  );
  if (!usuarioActual) {
    alert("No hay usuario logueado.");
    window.location.href = "login.html";
    return;
  }

  const respuestasGuardadas =
    localStorage.getItem("respuestas");
  let respuestas = respuestasGuardadas
    ? JSON.parse(respuestasGuardadas)
    : [];

  respuestas.push({
    encuestaId: idEncuesta,
    respuesta: respuestaTexto,
    usuario: usuarioActual.usuario,
    fecha: new Date().toISOString(),
  });

  localStorage.setItem(
    "respuestas",
    JSON.stringify(respuestas)
  );

  let respondidas =
    JSON.parse(
      localStorage.getItem("respondidas")
    ) || {};
  if (!respondidas[usuarioActual.usuario]) {
    respondidas[usuarioActual.usuario] = [];
  }

  if (
    !respondidas[usuarioActual.usuario].includes(
      idEncuesta
    )
  ) {
    respondidas[usuarioActual.usuario].push(
      idEncuesta
    );
  }

  localStorage.setItem(
    "respondidas",
    JSON.stringify(respondidas)
  );
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const usuarioActual = JSON.parse(
      localStorage.getItem("usuarioActual")
    );
    if (!usuarioActual) {
      alert("No hay usuario logueado.");
      window.location.href = "login.html";
      return;
    }

    const ruta = window.location.pathname;

    if (ruta.includes("inicio.html")) {
      const encuestas = obtenerEncuestas();
      const respondidas =
        JSON.parse(
          localStorage.getItem("respondidas")
        ) || {};
      const yaRespondidas =
        respondidas[usuarioActual.usuario] || [];

      const encuestasVisibles = encuestas.filter(
        (encuesta) => {
          return !yaRespondidas.includes(
            encuesta.id
          );
        }
      );

      const contenedor = document.getElementById(
        "listaEncuestas"
      );
      contenedor.innerHTML = "";

      if (encuestasVisibles.length === 0) {
        contenedor.innerHTML =
          "<p>No hay encuestas pendientes para ti.</p>";
        return;
      }

      encuestasVisibles.forEach((encuesta) => {
        const div = document.createElement("div");
        div.innerHTML = `
        <h3>${
          encuesta.titulo || "Sin título"
        }</h3>
        <p>${
          encuesta.descripcion ||
          "Sin descripción"
        }</p>
        <a href="encuesta.html?id=${
          encuesta.id
        }">Responder encuesta</a>
        <hr/>
      `;
        contenedor.appendChild(div);
      });
    }

    if (ruta.includes("contestar.html")) {
      const id = obtenerIdEncuesta();
      const encuestas = obtenerEncuestas();
      const encuesta = encuestas.find(
        (e) => e.id === id
      );

      if (!encuesta) {
        document.body.innerHTML =
          "<p>Encuesta no encontrada.</p>";
        return;
      }

      const respondidas =
        JSON.parse(
          localStorage.getItem("respondidas")
        ) || {};
      const yaRespondidas =
        respondidas[usuarioActual.usuario] || [];

      if (yaRespondidas.includes(id)) {
        document.body.innerHTML =
          "<p>Ya has respondido esta encuesta.</p>";
        return;
      }

      document.getElementById(
        "tituloEncuesta"
      ).textContent =
        encuesta.titulo || "Sin título";
      document.getElementById(
        "descripcionEncuesta"
      ).textContent =
        encuesta.descripcion || "Sin descripción";

      const formulario = document.getElementById(
        "formularioRespuesta"
      );
      formulario.addEventListener(
        "submit",
        function (e) {
          e.preventDefault();
          const respuesta = document
            .getElementById("respuesta")
            .value.trim();

          if (respuesta === "") {
            alert(
              "Por favor, escribe una respuesta."
            );
            return;
          }

          guardarRespuesta(id, respuesta);
          alert("¡Gracias por tu respuesta!");
          window.location.href = "inicio.html";
        }
      );
    }
  }
);
