// Lógica del formulario de feedback Kushki: navegación entre vistas, validaciones,
// ramificación condicional y armado/envío del payload hacia el Sheet.

const STEP_LABELS = ["Identificación", "Revisión", "Ajustes", "Cierre"];
const STEP_CONTAINER_IDS = ["step-indicator", "step-indicator-2", "step-indicator-3", "step-indicator-4"];

const state = {
  nombre: "",
  cargo: "",
  categoria: "",
  paginasSeleccionadas: [],
  respuestas: { q1: null, q2: null, q3: null, q4: null },
  ajustes: [],
  comentarioFinal: "",
  skippedAjustes: false,
};

let draftCaptura = null;
let checkboxCounter = 0;
const customSelects = {};

// ── NAVEGACIÓN ──

function showView(viewId) {
  document.querySelectorAll(".view").forEach((el) => el.classList.remove("view--active"));
  document.getElementById(viewId).classList.add("view--active");
  window.scrollTo(0, 0);
}

function renderStepIndicators(currentStepIndex, skippedStepIndex) {
  STEP_CONTAINER_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    STEP_LABELS.forEach((_, i) => {
      if (i > 0) {
        const connector = document.createElement("span");
        connector.className = "step-connector";
        el.appendChild(connector);
      }
      const dot = document.createElement("span");
      dot.className = "step-dot";
      dot.textContent = String(i + 1);
      if (skippedStepIndex === i) {
        dot.classList.add("is-skipped");
      } else if (i < currentStepIndex) {
        dot.classList.add("is-done");
      } else if (i === currentStepIndex) {
        dot.classList.add("is-active");
      }
      el.appendChild(dot);
    });
  });
}

// ── HELPERS DE VALIDACIÓN ──

function setFieldError(fieldId, hasError) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.toggle("has-error", hasError);
}

// ── DROPDOWN CON DISEÑO PROPIO (envuelve un <select> nativo oculto) ──

function setupCustomSelect(nativeSelectId, wrapperId) {
  const nativeSelect = document.getElementById(nativeSelectId);
  const wrapper = document.getElementById(wrapperId);
  const trigger = wrapper.querySelector(".custom-select-trigger");
  const valueEl = trigger.querySelector(".custom-select-value");
  const optionsEl = wrapper.querySelector(".custom-select-options");

  function close() {
    wrapper.classList.remove("is-open");
  }

  function render() {
    optionsEl.innerHTML = "";
    let selectedText = "";

    Array.from(nativeSelect.options).forEach((opt) => {
      if (opt.disabled) {
        if (!nativeSelect.value) selectedText = opt.textContent;
        return;
      }

      const li = document.createElement("li");
      li.className = "custom-select-option";
      li.setAttribute("role", "option");
      li.textContent = opt.textContent;

      if (opt.value === nativeSelect.value) {
        li.classList.add("is-selected");
        selectedText = opt.textContent;
      }

      li.addEventListener("click", () => {
        nativeSelect.value = opt.value;
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        render();
        close();
      });

      optionsEl.appendChild(li);
    });

    valueEl.textContent = selectedText;
    valueEl.classList.toggle("is-placeholder", !nativeSelect.value);
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !wrapper.classList.contains("is-open");
    document.querySelectorAll(".custom-select.is-open").forEach((el) => el.classList.remove("is-open"));
    if (willOpen) {
      render();
      wrapper.classList.add("is-open");
    }
  });

  customSelects[nativeSelectId] = render;
  render();
}

document.addEventListener("click", (e) => {
  document.querySelectorAll(".custom-select.is-open").forEach((el) => {
    if (!el.contains(e.target)) el.classList.remove("is-open");
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".custom-select.is-open").forEach((el) => el.classList.remove("is-open"));
  }
});

// ── PÁGINA 2: IDENTIFICACIÓN Y SELECCIÓN ──

function populateCategoriaSelect() {
  const select = document.getElementById("select-categoria");
  CATEGORIES.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat.label;
    opt.textContent = cat.label;
    select.appendChild(opt);
  });
  const variasOpt = document.createElement("option");
  variasOpt.value = VARIAS_CATEGORIAS_VALUE;
  variasOpt.textContent = VARIAS_CATEGORIAS_VALUE;
  select.appendChild(variasOpt);
}

function appendCheckboxRow(container, pageName) {
  const row = document.createElement("label");
  row.className = "checkbox-row";
  const id = `page-cb-${checkboxCounter++}`;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = id;
  input.value = pageName;
  const text = document.createElement("span");
  text.className = "checkbox-label-text";
  text.textContent = pageName;
  row.appendChild(input);
  row.appendChild(text);
  container.appendChild(row);
}

function renderPagesForCategory(categoriaValue) {
  const container = document.getElementById("pages-group");
  container.innerHTML = "";

  if (!categoriaValue) {
    const hint = document.createElement("p");
    hint.className = "field-hint";
    hint.textContent = "Selecciona primero una categoría para ver sus páginas.";
    container.appendChild(hint);
    return;
  }

  if (categoriaValue === VARIAS_CATEGORIAS_VALUE) {
    CATEGORIES.forEach((cat) => {
      const heading = document.createElement("div");
      heading.className = "pages-group-heading";
      heading.textContent = cat.label;
      container.appendChild(heading);
      cat.pages.forEach((page) => appendCheckboxRow(container, page));
    });
    return;
  }

  const cat = CATEGORIES.find((c) => c.label === categoriaValue);
  if (cat) cat.pages.forEach((page) => appendCheckboxRow(container, page));
}

function getCheckedPages() {
  return Array.from(document.querySelectorAll("#pages-group input[type='checkbox']:checked")).map(
    (input) => input.value
  );
}

function validateIdentificacion() {
  let valid = true;

  const nombre = document.getElementById("input-nombre").value.trim();
  setFieldError("field-nombre", !nombre);
  if (!nombre) valid = false;

  const cargo = document.getElementById("input-cargo").value.trim();
  setFieldError("field-cargo", !cargo);
  if (!cargo) valid = false;

  const categoria = document.getElementById("select-categoria").value;
  setFieldError("field-categoria", !categoria);
  if (!categoria) valid = false;

  const paginas = getCheckedPages();
  setFieldError("field-paginas", paginas.length === 0);
  if (paginas.length === 0) valid = false;

  if (valid) {
    state.nombre = nombre;
    state.cargo = cargo;
    state.categoria = categoria;
    state.paginasSeleccionadas = paginas;
  }

  return valid;
}

// ── PÁGINA 3: PREGUNTAS DE REVISIÓN ──

function renderQuestions() {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  REVIEW_QUESTIONS.forEach((q, index) => {
    const block = document.createElement("div");
    block.className = "question-block";
    block.id = `question-block-${q.id}`;

    const row = document.createElement("div");
    row.className = "question-row";

    const textEl = document.createElement("p");
    textEl.className = "question-text";
    const numberEl = document.createElement("span");
    numberEl.className = "question-number";
    numberEl.textContent = `${index + 1}.`;
    textEl.appendChild(numberEl);
    textEl.appendChild(document.createTextNode(q.text));
    row.appendChild(textEl);

    const segmented = document.createElement("div");
    segmented.className = "segmented";

    ANSWER_OPTIONS.forEach((opt) => {
      const wrap = document.createElement("div");
      wrap.className = "segmented-option";
      const id = `${q.id}-opt-${opt}`;

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.id = id;
      input.value = opt;

      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.textContent = opt;

      wrap.appendChild(input);
      wrap.appendChild(label);
      segmented.appendChild(wrap);
    });

    row.appendChild(segmented);
    block.appendChild(row);

    const errorEl = document.createElement("p");
    errorEl.className = "field-error";
    errorEl.textContent = "Por favor selecciona una respuesta.";
    block.appendChild(errorEl);

    container.appendChild(block);
  });
}

function validatePreguntas() {
  let valid = true;
  const respuestas = {};

  REVIEW_QUESTIONS.forEach((q) => {
    const checked = document.querySelector(`input[name='${q.id}']:checked`);
    const block = document.getElementById(`question-block-${q.id}`);
    if (!checked) {
      block.classList.add("has-error");
      valid = false;
    } else {
      block.classList.remove("has-error");
      respuestas[q.id] = checked.value;
    }
  });

  if (valid) state.respuestas = respuestas;
  return valid;
}

// ── PÁGINA 4: REGISTRO DE AJUSTES ──

function populateAjustePaginaSelect() {
  const select = document.getElementById("select-ajuste-pagina");
  select.innerHTML = '<option value="" selected disabled>Selecciona una página</option>';
  state.paginasSeleccionadas.forEach((page) => {
    const opt = document.createElement("option");
    opt.value = page;
    opt.textContent = page;
    select.appendChild(opt);
  });
  if (customSelects["select-ajuste-pagina"]) customSelects["select-ajuste-pagina"]();
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function clearAjusteDraftFields() {
  document.getElementById("select-ajuste-pagina").value = "";
  document.getElementById("textarea-ajuste-desc").value = "";
  document.getElementById("input-ajuste-captura").value = "";
  document.getElementById("ajuste-captura-status").textContent = "Ningún archivo seleccionado";
  draftCaptura = null;
  setFieldError("field-ajuste-pagina", false);
  setFieldError("field-ajuste-desc", false);
  setFieldError("field-ajuste-captura", false);
  if (customSelects["select-ajuste-pagina"]) customSelects["select-ajuste-pagina"]();
}

function tryCollectAjusteDraft() {
  const pagina = document.getElementById("select-ajuste-pagina").value;
  const descripcion = document.getElementById("textarea-ajuste-desc").value.trim();

  let valid = true;
  setFieldError("field-ajuste-pagina", !pagina);
  if (!pagina) valid = false;
  setFieldError("field-ajuste-desc", !descripcion);
  if (!descripcion) valid = false;
  setFieldError("field-ajuste-captura", !draftCaptura);
  if (!draftCaptura) valid = false;

  if (!valid) return null;

  return {
    pagina,
    categoria: PAGE_TO_CATEGORY[pagina] || state.categoria,
    descripcion,
    captura: draftCaptura,
  };
}

function renderAjustesList() {
  const container = document.getElementById("ajustes-list");
  container.innerHTML = "";

  state.ajustes.forEach((ajuste, index) => {
    const item = document.createElement("div");
    item.className = "ajuste-item";

    const info = document.createElement("div");
    const pageEl = document.createElement("p");
    pageEl.className = "ajuste-item-page";
    pageEl.textContent = ajuste.pagina;
    const descEl = document.createElement("p");
    descEl.className = "ajuste-item-desc";
    descEl.textContent = ajuste.descripcion;
    info.appendChild(pageEl);
    info.appendChild(descEl);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "ajuste-remove";
    removeBtn.textContent = "Quitar";
    removeBtn.addEventListener("click", () => {
      state.ajustes.splice(index, 1);
      renderAjustesList();
    });

    item.appendChild(info);
    item.appendChild(removeBtn);
    container.appendChild(item);
  });
}

// ── PAYLOAD Y ENVÍO ──

function buildPayload() {
  return {
    timestamp: new Date().toISOString(),
    nombre: state.nombre,
    cargo: state.cargo,
    categoriaSeleccionada: state.categoria,
    paginasSeleccionadas: state.paginasSeleccionadas,
    respuestas: state.respuestas,
    tieneAjustes: state.respuestas.q4 !== "No",
    ajustes: state.ajustes.map((a) => ({
      pagina: a.pagina,
      categoria: a.categoria,
      descripcion: a.descripcion,
      captura: a.captura
        ? {
            fileName: a.captura.fileName,
            mimeType: a.captura.mimeType,
            base64: a.captura.base64,
            driveFolderId: DRIVE_FOLDER_ID,
          }
        : null,
    })),
    comentarioFinal: state.comentarioFinal,
  };
}

async function submitToSheet(payload) {
  if (!SHEET_ENDPOINT_URL || SHEET_ENDPOINT_URL.startsWith("REEMPLAZAR")) {
    console.warn("[Kushki feedback] SHEET_ENDPOINT_URL no configurado todavía. Payload listo para enviar:", payload);
    return;
  }
  try {
    // Apps Script Web Apps no responden con headers CORS por defecto; se usa
    // 'no-cors' + text/plain para evitar el preflight y evitar bloquear el envío.
    await fetch(SHEET_ENDPOINT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[Kushki feedback] Error enviando datos al Sheet:", err);
  }
}

// ── EVENTOS ──

document.getElementById("btn-comenzar").addEventListener("click", () => {
  showView("view-identificacion");
  renderStepIndicators(0);
});

document.getElementById("select-categoria").addEventListener("change", (e) => {
  renderPagesForCategory(e.target.value);
  setFieldError("field-categoria", false);
});

document.getElementById("input-nombre").addEventListener("input", () => setFieldError("field-nombre", false));
document.getElementById("input-cargo").addEventListener("input", () => setFieldError("field-cargo", false));
document.getElementById("pages-group").addEventListener("change", () => {
  if (getCheckedPages().length > 0) setFieldError("field-paginas", false);
});

document.getElementById("btn-id-siguiente").addEventListener("click", () => {
  if (!validateIdentificacion()) return;
  showView("view-preguntas");
  renderStepIndicators(1);
});

document.getElementById("btn-preguntas-atras").addEventListener("click", () => {
  showView("view-identificacion");
  renderStepIndicators(0);
});

document.getElementById("btn-preguntas-siguiente").addEventListener("click", () => {
  if (!validatePreguntas()) return;

  if (state.respuestas.q4 === "No") {
    state.skippedAjustes = true;
    state.ajustes = [];
    showView("view-cierre");
    renderStepIndicators(3, 2);
  } else {
    state.skippedAjustes = false;
    populateAjustePaginaSelect();
    showView("view-ajustes");
    renderStepIndicators(2);
  }
});

document.getElementById("input-ajuste-captura").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const statusEl = document.getElementById("ajuste-captura-status");
  if (!file) {
    draftCaptura = null;
    statusEl.textContent = "Ningún archivo seleccionado";
    return;
  }
  const base64 = await readFileAsBase64(file);
  draftCaptura = { fileName: file.name, mimeType: file.type, base64 };
  statusEl.textContent = `Archivo seleccionado: ${file.name}`;
  setFieldError("field-ajuste-captura", false);
});

document.getElementById("btn-agregar-ajuste").addEventListener("click", () => {
  const ajuste = tryCollectAjusteDraft();
  if (!ajuste) return;
  state.ajustes.push(ajuste);
  renderAjustesList();
  clearAjusteDraftFields();
  document.getElementById("ajustes-list-error").style.display = "none";
});

document.getElementById("btn-finalizar-ajustes").addEventListener("click", () => {
  const pagina = document.getElementById("select-ajuste-pagina").value;
  const descripcion = document.getElementById("textarea-ajuste-desc").value.trim();

  if (pagina || descripcion) {
    const ajuste = tryCollectAjusteDraft();
    if (!ajuste) return;
    state.ajustes.push(ajuste);
    renderAjustesList();
    clearAjusteDraftFields();
  }

  if (state.ajustes.length === 0) {
    document.getElementById("ajustes-list-error").style.display = "block";
    return;
  }

  document.getElementById("ajustes-list-error").style.display = "none";
  showView("view-cierre");
  renderStepIndicators(3);
});

document.getElementById("btn-ajustes-atras").addEventListener("click", () => {
  showView("view-preguntas");
  renderStepIndicators(1);
});

document.getElementById("btn-cierre-atras").addEventListener("click", () => {
  if (state.skippedAjustes) {
    showView("view-preguntas");
    renderStepIndicators(1);
  } else {
    showView("view-ajustes");
    renderStepIndicators(2);
  }
});

document.getElementById("btn-enviar").addEventListener("click", () => {
  state.comentarioFinal = document.getElementById("textarea-comentario-final").value.trim();
  const payload = buildPayload();
  submitToSheet(payload);
  showView("view-gracias");
});

document.getElementById("btn-volver-inicio").addEventListener("click", () => {
  showView("view-bienvenida");
});

// ── INICIALIZACIÓN ──

populateCategoriaSelect();
renderPagesForCategory("");
renderQuestions();
setupCustomSelect("select-categoria", "categoria-select-wrap");
setupCustomSelect("select-ajuste-pagina", "ajuste-pagina-select-wrap");
