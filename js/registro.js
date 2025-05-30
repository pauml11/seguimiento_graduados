const form = document.getElementById(
  "registro-form"
);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const adminActual = JSON.parse(
    localStorage.getItem("usuarioActual")
  );

  const nombre = document
    .getElementById("nombre")
    .value.trim();
  const usuario = document
    .getElementById("usuario")
    .value.trim();
  const cedula = document
    .getElementById("cedula")
    .value.trim();
  const fechaNacimiento = document
    .getElementById("fecha_nacimiento")
    .value.trim();
  const carrera = document
    .getElementById("carrera")
    .value.trim();
  const direccion = document
    .getElementById("direccion")
    .value.trim();
  const telefono = document
    .getElementById("telefono")
    .value.trim();
  const correo = document
    .getElementById("correo")
    .value.trim();
  const contrasena =
    document.getElementById("contrasena").value;
  const confirmar = document.getElementById(
    "confirmar_contrasena"
  ).value;

  if (
    !nombre ||
    !usuario ||
    !cedula ||
    !fechaNacimiento ||
    !carrera ||
    !telefono ||
    !correo ||
    !contrasena ||
    !confirmar
  ) {
    alert(
      "Por favor, complete todos los campos obligatorios."
    );
    return;
  }

  if (!validarEmail(correo)) {
    alert(
      "Ingrese un correo electrónico válido."
    );
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(nombre)) {
    alert(
      "El nombre solo debe contener letras y espacios."
    );
    return;
  }

  if (!/^\d{7,15}$/.test(telefono)) {
    alert(
      "El teléfono debe contener solo números (mínimo 7 dígitos)."
    );
    return;
  }

  if (contrasena !== confirmar) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  if (contrasena.length < 6) {
    alert(
      "La contraseña debe tener al menos 6 caracteres."
    );
    return;
  }

  const nuevoUsuario = {
    nombre,
    usuario,
    cedula,
    fecha_nacimiento: fechaNacimiento,
    carrera,
    direccion,
    telefono,
    correo,
    contrasena, // nombre de propiedad corregido para consistencia
    rol: "usuario",
    fecha_registro: new Date().toISOString(),
  };

  const usuarios =
    JSON.parse(
      localStorage.getItem("usuarios")
    ) || [];

  if (
    usuarios.find((u) => u.usuario === usuario)
  ) {
    alert(
      "Este nombre de usuario ya está en uso."
    );
    return;
  }

  usuarios.push(nuevoUsuario);
  localStorage.setItem(
    "usuarios",
    JSON.stringify(usuarios)
  );

  // Restaurar el usuario actual (si era admin)
  if (
    adminActual &&
    adminActual.rol === "admin"
  ) {
    alert("Usuario registrado exitosamente.");
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify(adminActual)
    ); // restaurar admin
    window.location.href = "admin.html";
  } else {
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify(nuevoUsuario)
    );
    alert("Registro exitoso.");
    window.location.href = "login.html";
  }
});

// Función de validación de email
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
