// Obtiene las encuestas del localStorage
function obtenerEncuestas() {
  const encuestasGuardadas =
    localStorage.getItem("encuestas");
  try {
    return encuestasGuardadas
      ? JSON.parse(encuestasGuardadas)
      : [];
  } catch (e) {
    console.error(
      "Error al parsear encuestas:",
      e
    );
    return [];
  }
}

function obtenerRespondidas(usuario) {
  const data = localStorage.getItem(
    "respondidas"
  );
  if (!data) return [];
  try {
    const respondidas = JSON.parse(data);
    return respondidas[usuario] || [];
  } catch (e) {
    console.error(
      "Error al parsear respondidas:",
      e
    );
    return [];
  }
}

function mostrarEncuestas() {
  const lista = document.getElementById(
    "encuestas-lista"
  );
  const usuarioActual = JSON.parse(
    localStorage.getItem("usuarioActual")
  );

  if (!usuarioActual) {
    alert("No hay usuario logueado.");
    window.location.href = "index.html";
    return;
  }

  const encuestas = obtenerEncuestas();
  const respondidas = obtenerRespondidas(
    usuarioActual.usuario
  );

  const encuestasPendientes = encuestas.filter(
    (encuesta) =>
      !respondidas.includes(encuesta.id)
  );

  if (encuestasPendientes.length === 0) {
    lista.innerHTML =
      "<li>No hay encuestas pendientes para ti.</li>";
    return;
  }

  lista.innerHTML = "";

  encuestasPendientes.forEach((encuesta) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${encuesta.titulo}</strong><br>
      <span>${encuesta.descripcion}</span><br>
      <button class="contestarEncuesta" data-id="${encuesta.id}">Contestar</button>
    `;
    lista.appendChild(li);
  });

  asignarEventosContestar(); // Importante: mover aquí para que funcione
}

function asignarEventosContestar() {
  const botones = document.querySelectorAll(
    ".contestarEncuesta"
  );
  botones.forEach((boton) => {
    boton.addEventListener("click", function () {
      const id = this.dataset.id;
      // Redirigir usando el nuevo sistema basado en ID
      window.location.href = `contestar.html?id=${id}`;
    });
  });
}

// Cerrar sesión
document
  .getElementById("cerrarSesion")
  ?.addEventListener("click", function () {
    localStorage.removeItem("usuarioActual");
    window.location.href = "index.html";
  });

// Ejecutar cuando el DOM esté listo
document.addEventListener(
  "DOMContentLoaded",
  function () {
    mostrarEncuestas();
  }
);
