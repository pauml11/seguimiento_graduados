// Obtener usuarios desde localStorage
const usuarios =
  JSON.parse(localStorage.getItem("usuarios")) ||
  [];

// Referencia al contenedor
const container =
  document.querySelector(".container");

// Agregar filtros y tabla al HTML
const filtrosHTML = `
  <div class="filtros">
    <label for="filtroNombre">Nombre:</label>
    <input type="text" id="filtroNombre" placeholder="Buscar por nombre">

    <label for="filtroCarrera">Carrera:</label>
    <select id="filtroCarrera">
      <option value="">Todas</option>
    </select>

    <label for="filtroAnio">Año de registro:</label>
    <select id="filtroAnio">
      <option value="">Todos</option>
    </select>
  </div>

  <table class="tabla-usuarios">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Carrera</th>
        <th>Año de registro</th>
      </tr>
    </thead>
    <tbody id="tablaUsuarios"></tbody>
  </table>
`;

container.insertAdjacentHTML(
  "beforeend",
  filtrosHTML
);

// Referencias a los filtros
const filtroNombre = document.getElementById(
  "filtroNombre"
);
const filtroCarrera = document.getElementById(
  "filtroCarrera"
);
const filtroAnio =
  document.getElementById("filtroAnio");
const tablaUsuarios = document.getElementById(
  "tablaUsuarios"
);

// Rellenar filtros únicos
function cargarOpcionesFiltros() {
  const carrerasUnicas = [
    ...new Set(usuarios.map((u) => u.carrera)),
  ];
  const aniosUnicos = [
    ...new Set(
      usuarios.map((u) =>
        new Date(u.fecha_registro).getFullYear()
      )
    ),
  ];

  carrerasUnicas.forEach((carrera) => {
    const opt = document.createElement("option");
    opt.value = carrera;
    opt.textContent = carrera;
    filtroCarrera.appendChild(opt);
  });

  aniosUnicos.sort().forEach((anio) => {
    const opt = document.createElement("option");
    opt.value = anio;
    opt.textContent = anio;
    filtroAnio.appendChild(opt);
  });
}

function mostrarUsuarios() {
  const nombreFiltro =
    filtroNombre.value.toLowerCase();
  const carreraFiltro = filtroCarrera.value;
  const anioFiltro = filtroAnio.value;

  const filtrados = usuarios.filter((u) => {
    const nombreCoincide = u.nombre
      .toLowerCase()
      .includes(nombreFiltro);
    const carreraCoincide =
      carreraFiltro === "" ||
      u.carrera === carreraFiltro;
    const anioRegistro = new Date(
      u.fecha_registro
    )
      .getFullYear()
      .toString();
    const anioCoincide =
      anioFiltro === "" ||
      anioRegistro === anioFiltro;

    return (
      nombreCoincide &&
      carreraCoincide &&
      anioCoincide
    );
  });

  tablaUsuarios.innerHTML = filtrados
    .map((u, index) => {
      const anio = new Date(
        u.fecha_registro
      ).getFullYear();
      return `
        <tr>
          <td>${u.nombre}</td>
          <td>${u.carrera}</td>
          <td>${anio}</td>
          <td><button class="eliminar-btn" data-index="${usuarios.indexOf(
            u
          )}">Eliminar</button></td>
        </tr>
      `;
    })
    .join("");

  // Agregar eventos a los botones de eliminar
  document
    .querySelectorAll(".eliminar-btn")
    .forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(
          this.getAttribute("data-index")
        );
        const usuario = usuarios[index];
        const confirmar = confirm(
          `¿Eliminar a "${usuario.nombre}" definitivamente?`
        );
        if (confirmar) {
          usuarios.splice(index, 1);
          localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
          );
          mostrarUsuarios(); // Recargar tabla
        }
      });
    });
}  

// Eventos de filtro
filtroNombre.addEventListener(
  "input",
  mostrarUsuarios
);
filtroCarrera.addEventListener(
  "change",
  mostrarUsuarios
);
filtroAnio.addEventListener(
  "change",
  mostrarUsuarios
);

document
  .getElementById("cerrarSesion")
  ?.addEventListener("click", function () {
    localStorage.removeItem("usuarioActual");
    window.location.href = "index.html";
  });

// Inicializar
cargarOpcionesFiltros();
mostrarUsuarios();
