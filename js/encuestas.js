(function () {
  const usuarioActual = JSON.parse(
    localStorage.getItem("usuarioActual")
  );
  if (!usuarioActual) {
    alert("No hay usuario logueado.");
    window.location.href = "login.html";
    return;
  }

  function obtenerEncuestas() {
    const data =
      localStorage.getItem("encuestas");
    return data ? JSON.parse(data) : [];
  }

  function obtenerRespuestas() {
    const data =
      localStorage.getItem("respuestas");
    return data ? JSON.parse(data) : [];
  }

  function mostrarRespuestas() {
    const contenedor = document.getElementById(
      "respuestas-lista"
    );
    const encuestas = obtenerEncuestas();
    const respuestas = obtenerRespuestas();

    if (encuestas.length === 0) {
      contenedor.innerHTML =
        "<p>No hay encuestas disponibles.</p>";
      return;
    }

    contenedor.innerHTML = "";

    encuestas.forEach((encuesta) => {
      const respuestasEncuesta =
        respuestas.filter(
          (r) => r.encuestaId === encuesta.id
        );

      const div = document.createElement("div");
      div.classList.add("encuesta-bloque");

      div.innerHTML = `
        <h3>${encuesta.titulo}</h3>
        <p>${encuesta.descripcion}</p>
        <h4>Respuestas:</h4>
      `;

      if (respuestasEncuesta.length === 0) {
        div.innerHTML +=
          "<p>No hay respuestas aún.</p>";
      } else {
        const ul = document.createElement("ul");
        respuestasEncuesta.forEach((r) => {
          const li = document.createElement("li");
          const fecha = new Date(
            r.fecha
          ).toLocaleString();
          li.innerHTML = `<strong>${r.usuario}</strong> (${fecha}): ${r.respuesta}`;
          ul.appendChild(li);
        });
        div.appendChild(ul);
      }

      contenedor.appendChild(div);
    });
  }

  document.addEventListener(
    "DOMContentLoaded",
    mostrarRespuestas
  );
})();
