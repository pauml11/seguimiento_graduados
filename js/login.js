document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const usuario = document
      .getElementById("usuario")
      .value.trim();
    const contrasena =
      document.getElementById("contrasena").value;

    if (!usuario || !contrasena) {
      alert(
        "Por favor, complete todos los campos."
      );
      return;
    }

    // Obtener usuarios de localStorage
    const usuariosGuardados =
      JSON.parse(
        localStorage.getItem("usuarios")
      ) || [];

    // Buscar el usuario en la lista de usuarios guardados
    const encontrado = usuariosGuardados.find(
      (u) =>
        u.usuario === usuario &&
        u.contrasena === contrasena
    );

    // También verificar el usuario admin
    const admin = {
      usuario: "admin",
      contrasena: "admin123",
      rol: "admin",
    };

    // Si el usuario es el admin, asignar el objeto admin
    if (
      usuario === admin.usuario &&
      contrasena === admin.contrasena
    ) {
      localStorage.setItem(
        "usuarioActual",
        JSON.stringify(admin)
      );
      alert("Inicio de sesión exitoso");
      window.location.href = "admin.html";
    } else if (encontrado) {
      alert("Inicio de sesión exitoso");
      localStorage.setItem(
        "usuarioActual",
        JSON.stringify(encontrado)
      );
      if (encontrado.rol === "usuario") {
        window.location.href = "inicio.html";
      }
    } else {
      alert(
        "Usuario o contraseña no existe/incorrectos"
      );
    }
  });
