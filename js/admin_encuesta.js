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
    const encuestas =
      localStorage.getItem("encuestas");
    return encuestas ? JSON.parse(encuestas) : [];
  }

  function obtenerRespuestas() {
    const data =
      localStorage.getItem("respuestas");
    return data ? JSON.parse(data) : [];
  }

  function guardarEncuestas(encuestas) {
    localStorage.setItem(
      "encuestas",
      JSON.stringify(encuestas)
    );
  }

  function mostrarEncuestas() {
    const lista = document.getElementById(
      "encuestas-lista"
    );
    const encuestas = obtenerEncuestas();
    const respuestas = obtenerRespuestas();

    if (encuestas.length === 0) {
      lista.innerHTML =
        "<li>No hay encuestas disponibles.</li>";
      return;
    }

    lista.innerHTML = "";

    encuestas.forEach((encuesta, index) => {
      // Filtrar por encuesta.id (ya no por índice)
      const usuariosRespondieron = respuestas
        .filter(
          (r) => r.encuestaId === encuesta.id
        )
        .map((r) => r.usuario);

      const usuariosUnicos = [
        ...new Set(usuariosRespondieron),
      ];
      const usuariosTexto =
        usuariosUnicos.length > 0
          ? usuariosUnicos.join(", ")
          : "Nadie ha contestado";

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${encuesta.titulo}</strong><br>
        <span>${encuesta.descripcion}</span><br>
        <em><strong>Respondida por:</strong> ${usuariosTexto}</em><br>
        <button class="editarEncuesta" data-index="${index}">Editar</button>
        <button class="eliminarEncuesta" data-index="${index}">Eliminar</button>
      `;
      lista.appendChild(li);
    });
  }

  document
    .getElementById("formCrearEncuesta")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const titulo = document
        .getElementById("tituloEncuesta")
        .value.trim();
      const descripcion = document
        .getElementById("descripcionEncuesta")
        .value.trim();

      if (!titulo) {
        alert("El título es obligatorio");
        return;
      }

      const encuestas = obtenerEncuestas();
      const nuevaEncuesta = {
        id: crypto.randomUUID(), // Genera un ID único
        titulo,
        descripcion,
      };
      encuestas.push(nuevaEncuesta);
      guardarEncuestas(encuestas);

      this.reset();
      mostrarEncuestas();
    });

  document
    .getElementById("btnCancelarEncuesta")
    .addEventListener("click", function () {
      document
        .getElementById("formCrearEncuesta")
        .reset();
    });

  document
    .getElementById("encuestas-lista")
    .addEventListener("click", function (e) {
      const index = e.target.dataset.index;

      if (
        e.target.classList.contains(
          "eliminarEncuesta"
        )
      ) {
        const encuestas = obtenerEncuestas();
        encuestas.splice(index, 1);
        guardarEncuestas(encuestas);
        mostrarEncuestas();
      }

      if (
        e.target.classList.contains(
          "editarEncuesta"
        )
      ) {
        const encuestas = obtenerEncuestas();
        const encuesta = encuestas[index];

        document.getElementById(
          "editarEncuesta"
        ).style.display = "block";
        document.getElementById(
          "formEditarEncuesta"
        ).style.display = "block";
        document.getElementById(
          "idEncuestaEditar"
        ).value = index;
        document.getElementById(
          "tituloEncuestaEditar"
        ).value = encuesta.titulo;
        document.getElementById(
          "descripcionEncuestaEditar"
        ).value = encuesta.descripcion;
      }
    });

  document
    .getElementById("formEditarEncuesta")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const index = document.getElementById(
        "idEncuestaEditar"
      ).value;
      const titulo = document
        .getElementById("tituloEncuestaEditar")
        .value.trim();
      const descripcion = document
        .getElementById(
          "descripcionEncuestaEditar"
        )
        .value.trim();

      if (!titulo) {
        alert("El título es obligatorio");
        return;
      }

      const encuestas = obtenerEncuestas();
      encuestas[index].titulo = titulo;
      encuestas[index].descripcion = descripcion;
      guardarEncuestas(encuestas);

      mostrarEncuestas();
      this.reset();
      document.getElementById(
        "editarEncuesta"
      ).style.display = "none";
    });

  document
    .getElementById("btnCancelarEditarEncuesta")
    .addEventListener("click", function () {
      document
        .getElementById("formEditarEncuesta")
        .reset();
      document.getElementById(
        "editarEncuesta"
      ).style.display = "none";
    });

  mostrarEncuestas();
})();
