const textos = {
  tiempo:
    "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una de las cosas principales que comía su comida con más salsa que sal, y las noches de invierno se acostaba de dos en dos, y los lunes se ponía las calzas de paño, para hacerse honra de día de fiesta.",
  palabras:
    "el veloz murciélago hindú comía feliz cardillo y kiwi además goza de un buen día entero",
  cita: "La vida no es esperar a que pase la tormenta, sino aprender a bailar bajo la lluvia.",
};

const textosCita = [
  "La vida no es esperar a que pase la tormenta, sino aprender a bailar bajo la lluvia.",
  "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.",
  "No importa lo lento que vayas, siempre y cuando no te detengas.",
  "El conocimiento habla, pero la sabiduría escucha.",
  "La simplicidad es la sofisticación suprema.",
];

const textoEl = document.getElementById("texto");
const entrada = document.getElementById("entrada");
const stTiempo = document.getElementById("stTiempo");
const stPpm = document.getElementById("stPpm");
const stAcc = document.getElementById("stAcc");
const pista = document.getElementById("pista");
const zonaTexto = document.getElementById("zonaTexto");
const modal = document.getElementById("modalResultado");
const modalPpm = document.getElementById("modalPpm");
const modalAcc = document.getElementById("modalAcc");
const kb = document.getElementById("kb");

let objetivo = textos.tiempo;
let inicio = null,
  timerId = null,
  segundosRestantes = 60,
  terminado = false;
let shiftActive = false,
  capsActive = false;
let modo = "tiempo";
let testFinalizado = false;

const filas = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

function crearTecla(texto, dataTecla, clasesExtra) {
  const tecla = document.createElement("div");
  tecla.textContent = texto;
  if (dataTecla) tecla.setAttribute("data-tecla", dataTecla);
  tecla.className = "kb-key" + (clasesExtra ? " " + clasesExtra : "");
  return tecla;
}

function crearFilaTeclas(lista) {
  const fila = document.createElement("div");
  fila.className = "kb-row";
  lista.forEach((item) => fila.appendChild(item));
  return fila;
}

function crearFilaEspeciales() {
  const fila = document.createElement("div");
  fila.className = "kb-row";
  fila.appendChild(crearTecla("shift", "ShiftLeft", "kb-key-shift"));
  filas[2].forEach((k) => fila.appendChild(crearTecla(k, k)));
  fila.appendChild(crearTecla(",", ",", "kb-key-symbol"));
  fila.appendChild(crearTecla(".", ".", "kb-key-symbol"));
  fila.appendChild(crearTecla("borrar", "Backspace", "kb-key-backspace"));
  return fila;
}

function crearFilaInferior() {
  const fila = document.createElement("div");
  fila.className = "kb-row";
  fila.appendChild(crearTecla("mayús", "CapsLock", "kb-key-caps"));
  fila.appendChild(crearTecla("espacio", " ", "kb-space"));
  return fila;
}

function construirTeclado() {
  kb.innerHTML = "";
  kb.appendChild(crearFilaTeclas(filas[0].map((k) => crearTecla(k, k))));
  kb.appendChild(crearFilaTeclas(filas[1].map((k) => crearTecla(k, k))));
  kb.appendChild(crearFilaEspeciales());
  kb.appendChild(crearFilaInferior());
}

function actualizarVisualShift() {
  const todasTeclas = kb.querySelectorAll(".kb-key[data-tecla]");
  todasTeclas.forEach((t) => {
    const val = t.getAttribute("data-tecla");
    if (val && val.length === 1 && val !== val.toUpperCase() && val !== ",") {
      const mostrarMayus = shiftActive !== capsActive;
      t.textContent = mostrarMayus ? val.toUpperCase() : val;
    }
  });
  const capsBtn = kb.querySelector('[data-tecla="CapsLock"]');
  if (capsBtn) {
    if (capsActive) {
      capsBtn.classList.add("key-caps-active");
    } else {
      capsBtn.classList.remove("key-caps-active");
    }
  }
}

function pintarTexto(valor) {
  let html = "";
  for (let i = 0; i < objetivo.length; i++) {
    let color = "rgba(212, 196, 183, 0.5)";
    let bg = "transparent";
    if (i < valor.length) {
      if (valor[i] === objetivo[i]) {
        color = "#e5e2e1";
      } else {
        color = "#ffdad6";
        bg = "rgba(239, 68, 68, 0.3)";
      }
    }
    if (i === valor.length) {
      bg = "#f2be8c";
      color = "#131313";
    }
    html +=
      '<span style="color:' +
      color +
      ";background:" +
      bg +
      ';border-radius:2px;padding:0 1px;">' +
      objetivo[i] +
      "</span>";
  }
  textoEl.innerHTML = html;
  scrollTexto();
}

function scrollTexto() {
  const cursorPos = entrada.value.length;
  const spans = textoEl.children;
  if (cursorPos === 0 || !spans[cursorPos]) {
    textoEl.style.transform = "translateY(0px)";
    return;
  }

  const firstTop = spans[0].offsetTop;
  const cursorTop = spans[cursorPos].offsetTop;
  const spanH = spans[0].offsetHeight;
  const linesVisible = 3;

  const cursorLine = Math.round((cursorTop - firstTop) / spanH);
  let scroll = Math.max(0, cursorLine - 1) * spanH;

  const lastTop = spans[spans.length - 1].offsetTop;
  const totalLines = Math.round((lastTop - firstTop) / spanH) + 1;
  const maxScroll = Math.max(0, (totalLines - linesVisible) * spanH);
  scroll = Math.min(scroll, maxScroll);

  textoEl.style.transform = "translateY(-" + scroll + "px)";
}

function actualizarStats(valor) {
  let totalCorrectas = 0;
  for (let i = 0; i < valor.length; i++) {
    if (valor[i] === objetivo[i]) totalCorrectas++;
  }
  const acc =
    valor.length > 0 ? Math.round((totalCorrectas / valor.length) * 100) : 100;
  stAcc.textContent = acc + "%";
  if (inicio) {
    const minutos = (Date.now() - inicio) / 60000;
    const ppm = minutos > 0 ? Math.round(totalCorrectas / 5 / minutos) : 0;
    stPpm.textContent = ppm;
  }
}

function terminarTest() {
  if (testFinalizado) return;
  testFinalizado = true;
  terminado = true;
  clearInterval(timerId);
  modalPpm.textContent = stPpm.textContent;
  modalAcc.textContent = stAcc.textContent;
  modal.classList.add("active");
  pista.textContent = "";
}

function reiniciar() {
  clearInterval(timerId);
  inicio = null;
  segundosRestantes = parseInt(stTiempo.dataset.original || "60");
  terminado = false;
  testFinalizado = false;
  shiftActive = false;
  capsActive = false;
  entrada.value = "";
  actualizarTiempoVisual();
  stPpm.textContent = "0";
  stAcc.textContent = "100%";
  modal.classList.remove("active");
  pista.textContent = "haz clic en el texto y empieza a escribir";
  actualizarObjetivo();
  pintarTexto("");
  actualizarVisualShift();
  entrada.focus();
}

function actualizarObjetivo() {
  if (modo === "tiempo") {
    objetivo = textos.tiempo;
  } else if (modo === "palabras") {
    objetivo = textos.palabras;
  } else if (modo === "cita") {
    objetivo = textosCita[Math.floor(Math.random() * textosCita.length)];
  }
  pintarTexto("");
}

function actualizarTiempoVisual() {
  stTiempo.textContent = segundosRestantes;
  stTiempo.dataset.original = segundosRestantes;
}

function seleccionarTiempo(seg) {
  segundosRestantes = seg;
  actualizarTiempoVisual();
  document.querySelectorAll(".btn-time").forEach((b) => {
    b.classList.remove("text-primary");
    b.classList.add("text-on-surface-variant");
  });
  document
    .querySelector('[data-time="' + seg + '"]')
    .classList.remove("text-on-surface-variant");
  document
    .querySelector('[data-time="' + seg + '"]')
    .classList.add("text-primary");
  reiniciar();
}

function seleccionarModo(m) {
  modo = m;
  document.querySelectorAll(".btn-mode").forEach((b) => {
    b.classList.remove("text-primary");
    b.classList.add("text-on-surface-variant");
  });
  document
    .querySelector('[data-mode="' + m + '"]')
    .classList.remove("text-on-surface-variant");
  document
    .querySelector('[data-mode="' + m + '"]')
    .classList.add("text-primary");
  reiniciar();
}

document.querySelectorAll(".btn-time").forEach((btn) => {
  btn.addEventListener("click", () => {
    seleccionarTiempo(parseInt(btn.dataset.time));
  });
});

document.querySelectorAll(".btn-mode").forEach((btn) => {
  btn.addEventListener("click", () => {
    seleccionarModo(btn.dataset.mode);
  });
});

entrada.addEventListener("input", () => {
  if (terminado) return;
  if (!inicio) {
    inicio = Date.now();
    pista.textContent = "";
    timerId = setInterval(() => {
      segundosRestantes--;
      stTiempo.textContent = segundosRestantes;
      actualizarStats(entrada.value);
      if (modo === "tiempo" && segundosRestantes <= 0) terminarTest();
    }, 1000);
  }
  let valor = entrada.value;
  if (valor.length > objetivo.length) {
    valor = valor.slice(0, objetivo.length);
    entrada.value = valor;
  }
  pintarTexto(valor);
  actualizarStats(valor);
  if (modo !== "tiempo" && valor.length === objetivo.length) terminarTest();
});

zonaTexto.addEventListener("click", () => entrada.focus());
entrada.focus();

document.getElementById("btnReiniciar").addEventListener("click", reiniciar);
document.getElementById("modalReiniciar").addEventListener("click", reiniciar);
document
  .getElementById("btnInfo")
  .addEventListener("click", () =>
    document.getElementById("modalInfo").classList.add("active"),
  );
document
  .getElementById("modalInfoCerrar")
  .addEventListener("click", () =>
    document.getElementById("modalInfo").classList.remove("active"),
  );

construirTeclado();
pintarTexto("");
actualizarTiempoVisual();

window.addEventListener("keydown", (e) => {
  if (terminado) return;

  if (e.key === "Shift") {
    shiftActive = true;
    actualizarVisualShift();
    const el = kb.querySelector('[data-tecla="ShiftLeft"]');
    if (el) el.classList.add("key-correct");
    return;
  }

  if (e.key === "CapsLock") {
    capsActive = !capsActive;
    actualizarVisualShift();
    return;
  }

  let k = e.key;
  let kBusqueda = k === " " ? " " : k;

  const mostrarMayus = shiftActive !== capsActive;
  if (mostrarMayus && k.length === 1) {
    kBusqueda = k.toLowerCase();
  } else if (k.length === 1) {
    kBusqueda = k.toLowerCase();
  }

  const el = kb.querySelector('[data-tecla="' + CSS.escape(kBusqueda) + '"]');
  if (el) {
    const pos = entrada.value.length;
    const esperado = objetivo[pos] || "";
    const ok =
      k === esperado ||
      (mostrarMayus && k.length === 1 && k.toLowerCase() === esperado);
    el.classList.add(ok ? "key-correct" : "key-wrong");
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Shift") {
    shiftActive = false;
    actualizarVisualShift();
    const el = kb.querySelector('[data-tecla="ShiftLeft"]');
    if (el) el.classList.remove("key-correct");
    return;
  }

  let k = e.key;
  let kBusqueda = k === " " ? " " : k;
  if (k.length === 1) {
    kBusqueda = k.toLowerCase();
  }

  const el = kb.querySelector('[data-tecla="' + CSS.escape(kBusqueda) + '"]');
  if (el) el.classList.remove("key-correct", "key-wrong");
});
