document.getElementById("recuperar-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const usuario = document.getElementById("usuario").value.trim();
    const nuevaContrasena = document.getElementById("nuevaContrasena").value;
    const mensaje = document.getElementById("mensaje");
  
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  
    const index = usuarios.findIndex(u => u.usuario === usuario);
    if (index === -1) {
      mensaje.textContent = "Usuario no encontrado.";
      mensaje.style.color = "red";
      return;
    }
  
    // Actualizar la contraseña
    usuarios[index].contrasena = nuevaContrasena;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mensaje.textContent = "Contraseña actualizada correctamente.";
    mensaje.style.color = "green";
  });
  