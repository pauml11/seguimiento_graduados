document.addEventListener("DOMContentLoaded", function () {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuarioActual) {
    alert("No hay usuario logueado.");
    window.location.href = "index.html";
    return;
  }

  function mostrarDatos(usuario) {
    document.getElementById("nombre").textContent = usuario.nombre || "";
    document.getElementById("usuario").textContent = usuario.usuario || "";
    document.getElementById("cedula").textContent = usuario.cedula || "";
    document.getElementById("fecha_nacimiento").textContent = usuario.fecha_nacimiento || "";
    document.getElementById("carrera").textContent = usuario.carrera || "";
    document.getElementById("direccion").textContent = usuario.direccion || "";
    document.getElementById("telefono").textContent = usuario.telefono || "";
    document.getElementById("correo").textContent = usuario.correo || "";
    document.getElementById("estado-laboral-texto").textContent = usuario.estado_laboral || "";

    document.getElementById("empresa-texto").textContent =
      usuario.estado_laboral === "empleo" ? usuario.empresa || "" : "-";
    document.getElementById("cargo-texto").textContent =
      usuario.estado_laboral === "empleo" ? usuario.cargo || "" : "-";

    if (usuario.foto) {
      const img = document.getElementById("foto-perfil");
      img.src = usuario.foto;
      img.style.display = "block";
    }

    const cont = document.getElementById("historial-trabajos");
    cont.innerHTML = "";
    if (usuario.trabajos?.length) {
      usuario.trabajos.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = `${t.empresa} - ${t.cargo} (${t.fechaInicio} a ${t.fechaFin || "Actualidad"})`;
        cont.appendChild(li);
      });
    } else {
      cont.innerHTML = "<li>No hay trabajos registrados.</li>";
    }
  }

  function toggleTrabajoActual() {
    const mostrar =
      document.getElementById("estado-laboral")
        .value === "empleo";

    // NUEVO: Guardar trabajo actual si pasa de empleo a desempleo
    const nuevoEstado = document.getElementById(
      "estado-laboral"
    ).value;
    if (
      usuarioActual.estado_laboral === "empleo" &&
      nuevoEstado === "desempleo"
    ) {
      const empresa = document
        .getElementById("trabajo-empresa")
        .value.trim();
      const cargo = document
        .getElementById("trabajo-cargo")
        .value.trim();
      const fechaInicio = document
        .getElementById("trabajo-fecha-inicio")
        .value.trim();

      if (empresa && cargo && fechaInicio) {
        const fechaFin = new Date()
          .toISOString()
          .slice(0, 7); // YYYY-MM
        usuarioActual.trabajos =
          usuarioActual.trabajos || [];
        usuarioActual.trabajos.push({
          empresa,
          cargo,
          fechaInicio,
          fechaFin,
        });

        // Limpiar campos de empleo actual
        document.getElementById(
          "trabajo-empresa"
        ).value = "";
        document.getElementById(
          "trabajo-cargo"
        ).value = "";
        document.getElementById(
          "trabajo-fecha-inicio"
        ).value = "";
        document.getElementById(
          "trabajo-fecha-fin"
        ).value = "";

        usuarioActual.empresa = "";
        usuarioActual.cargo = "";
        usuarioActual.fechaInicio = "";
        usuarioActual.fechaFin = "";
      }
    }

    // Actualizar estado laboral y guardar
    usuarioActual.estado_laboral = nuevoEstado;
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify(usuarioActual)
    );
    mostrarDatos(usuarioActual);

    const campos = [
      "trabajo-empresa",
      "trabajo-cargo",
      "trabajo-fecha-inicio",
      "trabajo-fecha-fin",
    ];

    campos.forEach((id) => {
      const input = document.getElementById(id);
      const label = input.previousElementSibling;
      input.style.display = mostrar
        ? "block"
        : "none";
      if (label && label.tagName === "LABEL") {
        label.style.display = mostrar
          ? "block"
          : "none";
      }
    });
  }

  document.getElementById("estado-laboral").addEventListener("change", toggleTrabajoActual);

  document.getElementById("btn-agregar-trabajo-anterior")?.addEventListener("click", function () {
    const form = document.getElementById("form-trabajo-anterior");
    form.style.display = form.style.display === "none" ? "block" : "none";
  });

  document.getElementById("guardar-trabajo-anterior")?.addEventListener("click", function () {
    const empresa = document.getElementById("anterior-empresa").value.trim();
    const cargo = document.getElementById("anterior-cargo").value.trim();
    const inicio = document.getElementById("anterior-fecha-inicio").value.trim();
    const fin = document.getElementById("anterior-fecha-fin").value.trim();

    if (!empresa || !cargo || !inicio || !fin) {
      alert("Todos los campos son obligatorios para registrar un trabajo anterior.");
      return;
    }

    usuarioActual.trabajos = usuarioActual.trabajos || [];
    usuarioActual.trabajos.push({ empresa, cargo, fechaInicio: inicio, fechaFin: fin });

    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    alert("Trabajo anterior agregado correctamente.");
    mostrarDatos(usuarioActual);

    document.getElementById("anterior-empresa").value = "";
    document.getElementById("anterior-cargo").value = "";
    document.getElementById("anterior-fecha-inicio").value = "";
    document.getElementById("anterior-fecha-fin").value = "";
    document.getElementById("form-trabajo-anterior").style.display = "none";
  });

  document
    .getElementById("guardar")
    ?.addEventListener("click", function () {
      const nombre = document
        .getElementById("edit-nombre")
        .value.trim();
      const usuario = document
        .getElementById("edit-usuario")
        .value.trim();
      const cedula = document
        .getElementById("edit-cedula")
        .value.trim();
      const fechaNacimiento =
        document.getElementById(
          "edit-fecha_nacimiento"
        ).value;
      const carrera = document
        .getElementById("edit-carrera")
        .value.trim();
      const direccion = document
        .getElementById("edit-direccion")
        .value.trim();
      const telefono = document
        .getElementById("edit-telefono")
        .value.trim();
      const correo = document
        .getElementById("edit-correo")
        .value.trim();
      const estadoLaboral = document
        .getElementById("estado-laboral")
        .value.trim();
      const empresa = document
        .getElementById("trabajo-empresa")
        .value.trim();
      const cargo = document
        .getElementById("trabajo-cargo")
        .value.trim();
      const fechaInicio = document
        .getElementById("trabajo-fecha-inicio")
        .value.trim();
      const fechaFin = document
        .getElementById("trabajo-fecha-fin")
        .value.trim();

      if (
        !nombre ||
        !usuario ||
        !cedula ||
        !fechaNacimiento ||
        !carrera ||
        !direccion ||
        !telefono ||
        !correo
      ) {
        alert(
          "Todos los campos son obligatorios."
        );
        return;
      }

      usuarioActual.nombre = nombre;
      usuarioActual.usuario = usuario;
      usuarioActual.cedula = cedula;
      usuarioActual.fecha_nacimiento =
        fechaNacimiento;
      usuarioActual.carrera = carrera;
      usuarioActual.direccion = direccion;
      usuarioActual.telefono = telefono;
      usuarioActual.correo = correo;
      usuarioActual.estado_laboral =
        estadoLaboral;

      if (estadoLaboral === "empleo") {
        usuarioActual.empresa = empresa;
        usuarioActual.cargo = cargo;
        usuarioActual.fechaInicio = fechaInicio;
        usuarioActual.fechaFin = fechaFin;
      } else {
        usuarioActual.empresa = "";
        usuarioActual.cargo = "";
        usuarioActual.fechaInicio = "";
        usuarioActual.fechaFin = "";
      }

      localStorage.setItem(
        "usuarioActual",
        JSON.stringify(usuarioActual)
      );
      mostrarDatos(usuarioActual);

      alert("Datos actualizados correctamente.");

      // Ocultar formulario y mostrar botón de edición
      document.getElementById(
        "form-editar-perfil"
      ).style.display = "none";
      document.getElementById(
        "btn-editar-perfil"
      ).style.display = "block";
    });
  


  document.getElementById("btn-editar-perfil").addEventListener("click", function () {
    const form = document.getElementById("form-editar-perfil");
    form.style.display = "block";
    this.style.display = "none";

    // Cargar datos en el formulario
    document.getElementById("edit-nombre").value = usuarioActual.nombre || "";
    document.getElementById("edit-usuario").value = usuarioActual.usuario || "";
    document.getElementById("edit-cedula").value = usuarioActual.cedula || "";
    document.getElementById("edit-fecha_nacimiento").value = usuarioActual.fecha_nacimiento || "";
    document.getElementById("edit-carrera").value = usuarioActual.carrera || "";
    document.getElementById("edit-direccion").value = usuarioActual.direccion || "";
    document.getElementById("edit-telefono").value = usuarioActual.telefono || "";
    document.getElementById("edit-correo").value = usuarioActual.correo || "";
    document.getElementById("estado-laboral").value = usuarioActual.estado_laboral || "desempleo";
    document.getElementById("trabajo-empresa").value = usuarioActual.empresa || "";
    document.getElementById("trabajo-cargo").value = usuarioActual.cargo || "";
    document.getElementById("trabajo-fecha-inicio").value = usuarioActual.fechaInicio || "";
    document.getElementById("trabajo-fecha-fin").value = usuarioActual.fechaFin || "";

    toggleTrabajoActual();
  });

  document.getElementById("form-editar-perfil").addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener datos del formulario
    usuarioActual.nombre = document.getElementById("edit-nombre").value.trim();
    usuarioActual.usuario = document.getElementById("edit-usuario").value.trim();
    usuarioActual.cedula = document.getElementById("edit-cedula").value.trim();
    usuarioActual.fecha_nacimiento = document.getElementById("edit-fecha_nacimiento").value;
    usuarioActual.carrera = document.getElementById("edit-carrera").value.trim();
    usuarioActual.direccion = document.getElementById("edit-direccion").value.trim();
    usuarioActual.telefono = document.getElementById("edit-telefono").value.trim();
    usuarioActual.correo = document.getElementById("edit-correo").value.trim();
    usuarioActual.estado_laboral = document.getElementById("estado-laboral").value;

    if (usuarioActual.estado_laboral === "empleo") {
      usuarioActual.empresa = document.getElementById("trabajo-empresa").value.trim();
      usuarioActual.cargo = document.getElementById("trabajo-cargo").value.trim();
      usuarioActual.fechaInicio = document.getElementById("trabajo-fecha-inicio").value;
      usuarioActual.fechaFin = document.getElementById("trabajo-fecha-fin").value;
    } else {
      usuarioActual.empresa = "";
      usuarioActual.cargo = "";
      usuarioActual.fechaInicio = "";
      usuarioActual.fechaFin = "";
    }

    const fileInput = document.getElementById("input-foto");
    if (fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        usuarioActual.foto = e.target.result;
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
        mostrarDatos(usuarioActual);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
      mostrarDatos(usuarioActual);
    }

    alert("Perfil actualizado correctamente.");
    document.getElementById("form-editar-perfil").style.display = "none";
    document.getElementById("btn-editar-perfil").style.display = "inline-block";
  });

  document.getElementById("cerrarSesion")?.addEventListener("click", function () {
    localStorage.removeItem("usuarioActual");
    window.location.href = "index.html";
  });

  mostrarDatos(usuarioActual);
  toggleTrabajoActual();
});
