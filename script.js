document.addEventListener("DOMContentLoaded", () => {
  actualizarTotales();
  mostrarActividades();
  mostrarReflexiones();
  mostrarReflexionesPreview();
  cargarHorario();

  const formAct = document.getElementById("formActividad");
  if (formAct) formAct.addEventListener("submit", guardarActividad);

  const formRef = document.getElementById("formReflexion");
  if (formRef) formRef.addEventListener("submit", guardarReflexion);

  const guardarHorarioBtn = document.getElementById("guardarHorario");
  if (guardarHorarioBtn) guardarHorarioBtn.addEventListener("click", guardarHorario);

  const limpiarHorarioBtn = document.getElementById("limpiarHorario");
  if (limpiarHorarioBtn) limpiarHorarioBtn.addEventListener("click", limpiarHorario);
});

// === ACTIVIDADES ===
function guardarActividad(e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const categoria = document.getElementById("categoria").value;
  const horas = parseInt(document.getElementById("horas").value);
  const fecha = document.getElementById("fecha").value;
  const descripcion = document.getElementById("descripcion").value.trim();

  const actividades = JSON.parse(localStorage.getItem("actividadesCAS")) || [];
  actividades.push({ nombre, categoria, horas, fecha, descripcion });
  localStorage.setItem("actividadesCAS", JSON.stringify(actividades));
  e.target.reset();
  mostrarActividades();
  actualizarTotales();
}

function mostrarActividades() {
  const tabla = document.querySelector("#tablaActividades tbody");
  if (!tabla) return;
  const actividades = JSON.parse(localStorage.getItem("actividadesCAS")) || [];
  tabla.innerHTML = "";
  actividades.forEach((act, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${act.nombre}</td>
      <td>${act.categoria}</td>
      <td>${act.horas}</td>
      <td>${act.fecha}</td>
      <td>${act.descripcion}</td>
      <td><button onclick="eliminarActividad(${i})">🗑️</button></td>`;
    tabla.appendChild(tr);
  });
}

function eliminarActividad(index) {
  const actividades = JSON.parse(localStorage.getItem("actividadesCAS")) || [];
  actividades.splice(index, 1);
  localStorage.setItem("actividadesCAS", JSON.stringify(actividades));
  mostrarActividades();
  actualizarTotales();
}

function actualizarTotales() {
  const actividades = JSON.parse(localStorage.getItem("actividadesCAS")) || [];
  let totalC = 0, totalA = 0, totalS = 0;
  actividades.forEach(a => {
    if (a.categoria === "C") totalC += a.horas;
    if (a.categoria === "A") totalA += a.horas;
    if (a.categoria === "S") totalS += a.horas;
  });
  const elC = document.getElementById("totalC");
  if (elC) elC.textContent = `${totalC} horas`;
  const elA = document.getElementById("totalA");
  if (elA) elA.textContent = `${totalA} horas`;
  const elS = document.getElementById("totalS");
  if (elS) elS.textContent = `${totalS} horas`;

  const totalGeneral = totalC + totalA + totalS;
const elG = document.getElementById("totalGeneral");
if (elG) elG.textContent = `${totalGeneral} horas`;
}

// === REFLEXIONES ===
function guardarReflexion(e) {
  e.preventDefault();
  const titulo = document.getElementById("tituloReflexion").value.trim();
  const texto = document.getElementById("textoReflexion").value.trim();
  const fecha = new Date().toLocaleDateString("es-ES");
  const reflexiones = JSON.parse(localStorage.getItem("reflexionesCAS")) || [];
  reflexiones.push({ id: Date.now(), titulo, texto, fecha });
  localStorage.setItem("reflexionesCAS", JSON.stringify(reflexiones));
  e.target.reset();
  mostrarReflexiones();
}

function mostrarReflexiones() {
  const cont = document.getElementById("listaReflexiones");
  if (!cont) return;
  const reflexiones = JSON.parse(localStorage.getItem("reflexionesCAS")) || [];
  cont.innerHTML = "";
  reflexiones.slice().reverse().forEach(ref => {
    const div = document.createElement("div");
    div.className = "reflexion";
    div.innerHTML = `
      <h3>${ref.titulo}</h3>
      <small>${ref.fecha}</small>
      <p>${ref.texto}</p>
      <button onclick="eliminarReflexion(${ref.id})">🗑️ Eliminar</button>
    `;
function eliminarReflexion(id) {
  let reflexiones = JSON.parse(localStorage.getItem("reflexionesCAS")) || [];

  reflexiones = reflexiones.map((r, i) => {
    if (!r.id) r.id = i + 1;
    return r;
  });

  const nuevas = reflexiones.filter(r => r.id !== id);
  localStorage.setItem("reflexionesCAS", JSON.stringify(nuevas));
  mostrarReflexiones();
}
    cont.appendChild(div);
  });
}

function mostrarReflexionesPreview() {
  const cont = document.getElementById("previewReflexiones");
  if (!cont) return;
  const reflexiones = JSON.parse(localStorage.getItem("reflexionesCAS")) || [];
  cont.innerHTML = "";
  reflexiones.slice(-2).reverse().forEach(ref => {
    const div = document.createElement("div");
    div.className = "reflexion";
    div.innerHTML = `<strong>${ref.titulo}</strong><br><small>${ref.fecha}</small><p>${ref.texto.substring(0,100)}...</p>`;
    cont.appendChild(div);
  });
}

// === HORARIO ===
function guardarHorario() {
  const filas = document.querySelectorAll("#tablaHorario tbody tr");
  const horario = [];
  filas.forEach(row => {
    const dia = row.children[0].textContent;
    const actividad = row.children[1].textContent.trim();
    horario.push({ dia, actividad });
  });
  localStorage.setItem("horarioCAS", JSON.stringify(horario));
  alert("Horario guardado ✅");
}

function cargarHorario() {
  const horario = JSON.parse(localStorage.getItem("horarioCAS")) || [];
  const filas = document.querySelectorAll("#tablaHorario tbody tr");
  if (!filas.length) return;
  horario.forEach((h, i) => {
    if (filas[i]) filas[i].children[1].textContent = h.actividad;
  });
}

function limpiarHorario() {
  localStorage.removeItem("horarioCAS");
  document.querySelectorAll("#tablaHorario tbody tr td:nth-child(2)").forEach(td => td.textContent = "");
  alert("Horario limpiado 🧹");
}

function exportarDatos() {
  const data = {
    actividades: JSON.parse(localStorage.getItem("actividadesCAS")) || [],
    reflexiones: JSON.parse(localStorage.getItem("reflexionesCAS")) || [],
    horario: JSON.parse(localStorage.getItem("horarioCAS")) || []
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cas_backup.json";
  a.click();
}
