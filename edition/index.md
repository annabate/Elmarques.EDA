---
layout: edition
title: El marqués de las Navas - edición genética digital
---

<header id="main-header">

  <div id="toolbar">
    <!-- Toolbar toggle button -->
    

    <!-- Collapsible toolbar content -->
    <div id="toolbar-content" class="toolbar-content">
      <!-- Column toggles -->
      <div class="toolbar-group">
      <label
        ><input
          type="checkbox"
          class="toggle-col"
          data-target="facsimile-container"
          checked
        />
        Facsímil</label
      >
      <label
        ><input
          type="checkbox"
          class="toggle-col"
          data-target="modern-container"
          checked
        />
        Edición genética</label
      >
      <label
        ><input
          type="checkbox"
          class="toggle-col"
          data-target="diplomatic-container"
          checked
        />
        Transcripción</label
      >
    </div>

    <!-- Font size -->
    <div class="toolbar-group" title="Ajustar fuente de texto">
      <button onclick="adjustFontSize(-1)" title="Reducir fuente">A−</button>
      <button onclick="adjustFontSize(1)" title="Aumentar fuente">A+</button>
    </div>

    <!-- Typology filter -->
    <div class="toolbar-group">
      <label for="variant-selector" style="font-size: 1rem; font-weight: bold"
        >Filtrar intervenciones por tipología:</label
      >
      <select id="variant-selector">
        <option value="all">Mostrar todas</option>
        <option value="A0">A0 (original)</option>
        <option value="A1">A1 (correcciones inmediatas)</option>
        <option value="A2">A2 (revisión posterior)</option>
        <option value="B">B (mano ajena)</option>
      </select>
      <div class="color-legend">
        <span><span class="color-box wit-A0"></span> A0 (original)</span>
        <span
          ><span class="color-box wit-A1"></span> A1 (correcciones
          inmediatas)</span
        >
        <span
          ><span class="color-box wit-A2"></span> A2 (revisión posterior)</span
        >
        <span><span class="color-box wit-B"></span> B (mano ajena)</span>
      </div>
      <button id="clean-text-button">Texto limpio</button>
    </div>

    <!-- Search toggle -->
    <div class="toolbar-group" style="margin-left: auto">
      <button id="toggle-search" title="Buscar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 2a8 8 0 015.293 13.707l5 5a1 1 0 01-1.414 1.414l-5-5A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z"
          />
        </svg>
      </button>
    </div>
    </div>
    <!-- End toolbar-content -->
<button id="toolbar-toggle" class="toolbar-toggle" title="Mostrar/ocultar barra de herramientas">
      <span class="toggle-icon">|</span>
    </button>
  </div>

  <!-- Hidden search bar -->
  <div id="search-bar" class="hidden">
    <input type="text" id="search-input" placeholder="Buscar en el texto..." />
    <button id="search-button" title="Buscar">🔍</button>
    <button id="prev-match" title="Coincidencia anterior">⬆</button>
    <button id="next-match" title="Coincidencia siguiente">⬇</button>
    <select id="search-scope" title="Seleccionar texto">
      <option value="both">Ambos</option>
      <option value="modern">Edición genética</option>
      <option value="diplomatic">Transcripción</option>
    </select>
    <button
      id="close-search"
      class="close-search"
      aria-label="Close search"
      title="Close search"
    >
      ✕
    </button>
  </div>
</header>

<!-- ✅ CORRECT WRAPPER -->
<div id="tei-wrapper" class="synoptic-view">
  <div id="facsimile-container" class="tei-column sticky">
    <div class="column-header">
      <label for="pb-selector">Folio:</label>
      <select id="pb-selector"></select>
      <button id="prev-folio">←</button>
      <button id="next-folio">→</button>
      <button class="close-column" title="cerrar">✕</button>
    </div>
    <div id="facsimile-wrapper">
      <img id="facsimile-image" src="" alt="Facsímil" />
    </div>
  </div>

  <div class="column-resizer" data-left="facsimile-container" data-right="modern-container" aria-hidden="true"></div>

  <div id="modern-container" class="tei-column">
    <div class="column-header">
      <span>Edición genética</span>
      <button class="close-column" title="cerrar">✕</button>
    </div>
    <div class="tei-column-scroll"></div>
  </div>

  <div class="column-resizer" data-left="modern-container" data-right="diplomatic-container" aria-hidden="true"></div>

  <div id="diplomatic-container" class="tei-column">
    <div class="column-header">
      <span>Transcripción</span>
      <button class="close-column" title="cerrar">✕</button>
    </div>
    <div class="tei-column-scroll"></div>
  </div>
</div>

<script>
  /* =========================
   GLOBAL STATE (no TDZ)
   ========================= */
  const spanRanges = []; // { id, type:'del'|'add', phase, nodes: Element[] }
  let spanRangeAutoId = 0;
  // Only mark real line/paragraph blocks, not big wrappers:
  const HIGHLIGHT_BLOCK_SEL = "tei-l, l, tei-p, p, tei-ab, tei-s, tei-head";
  // Map each block node -> array of {id, type, phase, [subtype], [place]} it belongs to (for overlaps)
  const nodeToRanges = new Map();
  // Clean mode flag: when true, spans must be invisible and not rebuilt
  let CLEAN_MODE = false;

  // show the entire sequence up to the selected phase (if you need it elsewhere)
  const DISPLAY_SEQUENCE = {
    A0: ["A0"],
    A1: ["A0", "A1"],
    A2: ["A0", "A1", "A2"],
    B: ["A0", "A1", "A2", "B"],
  };

  // Convert "#rrggbb" to rgba(r,g,b,alpha)
  function hexToRgba(hex, alpha) {
    const h = (hex || "").replace("#", "");
    const r = parseInt(h.substring(0, 2) || "00", 16);
    const g = parseInt(h.substring(2, 4) || "00", 16);
    const b = parseInt(h.substring(4, 6) || "00", 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Phase palette: stroke = decoration color; tint = base hex (we'll add alpha in code)
  const PHASE_PALETTE = {
  A0: { stroke: "#4d9db5", tint: "#b7cbd0" }, // blue
  A1: { stroke: "#f7bb47", tint: "#f9d495" }, // orange
  A2: { stroke: "#7578ac", tint: "#dfbee4" }, // purple
  B: { stroke: "#159644", tint: "#b9eca8" }, // green
  };

  // Tuning knobs for clarity
  const TINT_ALPHA_SINGLE = 0.14; // single range: faint background
  const OVERLAP_ALPHA = 0.16; // per-layer alpha when multiple phases overlap
  const GUTTER_WIDTH_PX = 4; // thin left gutter bar in stroke color (reserved)

  // Stronger washes
  const DEL_WASH_ALPHA = 0.45; // deletion blocks (split painter)
  const ADD_WASH_ALPHA = 0.42; // marginal add blocks when revealed

  // =========================
  //TEI pointer normalizers
  //=========================
  function normWitList(val) {
  return (val || "")
  .trim()
  .split(/\s+/)
  .map((v) => v.replace(/^#/, ""))
  .map((v) => v.toUpperCase())
  .filter(Boolean);
  }
  function normWit(val) {
  return normWitList(val)[0] || "";
  }
  function uniquePhases(arr) {
  return Array.from(
  new Set((arr || []).map((p) => (p || "").toUpperCase()).filter(Boolean)),
  );
  }

  // =========================
  // CETEI + BEHAVIORS
  // =========================
  const CETEIcean = new CETEI();
  CETEIcean.addBehaviors({
  tei: { rdg: variantHandler, lem: variantHandler },
  });

  // =========================
  // FONT SIZE
  // =========================
  let currentFontSize = 100;
  function adjustFontSize(change) {
  currentFontSize = Math.max(
  60,
  Math.min(160, currentFontSize + change * 10),
  );
  document.documentElement.style.setProperty(
  "--user-font-size",
  `${currentFontSize}%`,
  );
  }

  // =========================
  // VARIANT WRAPPER (CETEI)
  // =========================
  function variantHandler(el) {
  const span = document.createElement("span");
  span.innerHTML = el.innerHTML;
  span.setAttribute("varSeq", el.getAttribute("varSeq") || "");
  span.setAttribute("wit", normWit(el.getAttribute("wit")) || "LEM");
  span.setAttribute("hand", normWit(el.getAttribute("hand")));
  span.dataset.originalHtml = el.innerHTML;
  return span;
  }

  // =========================
  // UTIL
  // =========================
  function getMaxSeq() {
  let max = -1;
  document
  .querySelectorAll(
  "tei-rdg[data-authorial='true'], tei-lem[data-authorial='true']",
  )
  .forEach((rdg) => {
  const seq = parseInt(rdg.getAttribute("varSeq"), 10);
  if (!isNaN(seq) && seq > max) max = seq;
  });
  return max;
  }

  const variantSelector = document.getElementById("variant-selector");
  let lastWit = null;
  if (variantSelector) {
  variantSelector.value = "all";
  filterReadings({ showAll: true });
  }

  // =========================
  // BASIC UI HELPERS
  // =========================
  function toggleView(id) {
  const el = document.getElementById(id);
  el.classList.toggle("hidden");
  updateLayoutClasses();
  }
  function decorateNotes(data) {
  const notes = data.querySelectorAll("tei-note");
  notes.forEach((originalNote) => {
  const content = originalNote.cloneNode(true).textContent.trim();
  const cleanNote = document.createElement("tei-note");
  cleanNote.setAttribute("data-note", content);
  cleanNote.classList.add("note-decorated");
  const span = document.createElement("span");
  span.className = "note-icon";
  span.textContent = "*";
  span.style.fontWeight = "bold";
  span.style.fontSize = "1.2em";
  span.style.color = "#FF0000";
  span.style.cursor = "pointer";
  cleanNote.appendChild(span);
  originalNote.replaceWith(cleanNote);
  });
  }
  function attachNoteEvents(container = document) {
  const notes = container.querySelectorAll("tei-note");
  notes.forEach((note) => {
  const content = note.getAttribute("data-note");
  note.addEventListener("click", (e) => {
  e.stopPropagation();
  document.querySelectorAll(".floating-note").forEach((n) => n.remove());
  const rect = e.target.getBoundingClientRect();
  const floating = document.createElement("div");
  floating.className = "floating-note";
  floating.innerHTML = `
          <div style="position: relative; padding-right: 1.2em;">
            <button class="close-note" style="position:absolute;top:.1em;right:.1em;border:none;background:none;font-size:.8em;cursor:pointer;color:#444;">✖</button>
            <div style="padding-top:1.1em;">${content}</div>
          </div>`;
  document.body.appendChild(floating);
  floating.style.left = `${rect.right + 10 + window.scrollX}px`;
  floating.style.top = `${rect.top + window.scrollY}px`;
  floating
  .querySelector(".close-note")
  .addEventListener("click", () => floating.remove());
  });
  });
  document.addEventListener("click", () => {
  document.querySelectorAll(".floating-note").forEach((n) => n.remove());
  });
  }
  function updateLayoutClasses() {
  const wrapper = document.getElementById("tei-wrapper");
  const columns = wrapper.querySelectorAll(".tei-column");
  const visible = Array.from(columns).filter(
  (col) => col.offsetParent !== null,
  ).length;
  wrapper.classList.remove("single-view", "dual-view", "synoptic-view");
  if (visible === 1) wrapper.classList.add("single-view");
  else if (visible === 2) wrapper.classList.add("dual-view");
  else wrapper.classList.add("synoptic-view");
  resetVisibleColumns();
  refreshResizerVisibility();
  }

  function resetVisibleColumns() {
  const wrapper = document.getElementById("tei-wrapper");
  const visibleCols = Array.from(wrapper.querySelectorAll(".tei-column")).filter(
  (col) => !col.classList.contains("hidden"),
  );
  if (!visibleCols.length) return;
  const width = 100 / visibleCols.length;
  visibleCols.forEach((col) => {
  col.style.flex = `0 0 ${width}%`;
  col.style.maxWidth = `${width}%`;
  });
  }

  function refreshResizerVisibility() {
  const resizers = document.querySelectorAll(".column-resizer");
  resizers.forEach((resizer) => {
  const left = document.getElementById(resizer.dataset.left);
  const right = document.getElementById(resizer.dataset.right);
  const hidden = !left || !right || left.classList.contains("hidden") || right.classList.contains("hidden");
  resizer.style.display = hidden ? "none" : "flex";
  });
  }

  function initResizeHandles() {
  const wrapper = document.getElementById("tei-wrapper");
  const resizers = wrapper.querySelectorAll(".column-resizer");
  resizers.forEach((resizer) => {
  let dragging = false;
  let startX = 0;
  let leftCol = null;
  let rightCol = null;
  let leftStartWidth = 0;
  let rightStartWidth = 0;
  const minWidth = 180;

  const onMouseMove = (e) => {
  if (!dragging) return;
  const delta = e.clientX - startX;
  const total = leftStartWidth + rightStartWidth;
  let newLeft = leftStartWidth + delta;
  let newRight = rightStartWidth - delta;
  if (newLeft < minWidth) {
  newLeft = minWidth;
  newRight = total - minWidth;
  } else if (newRight < minWidth) {
  newRight = minWidth;
  newLeft = total - minWidth;
  }
  const wrapperWidth = wrapper.getBoundingClientRect().width;
  const leftPct = (newLeft / wrapperWidth) * 100;
  const rightPct = (newRight / wrapperWidth) * 100;
  leftCol.style.flex = `0 0 ${leftPct}%`;
  leftCol.style.maxWidth = `${leftPct}%`;
  rightCol.style.flex = `0 0 ${rightPct}%`;
  rightCol.style.maxWidth = `${rightPct}%`;
  };

  const stopDrag = () => {
  if (!dragging) return;
  dragging = false;
  resizer.classList.remove("active");
  document.body.style.cursor = "";
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", stopDrag);
  };

  resizer.addEventListener("mousedown", (e) => {
  e.preventDefault();
  leftCol = document.getElementById(resizer.dataset.left);
  rightCol = document.getElementById(resizer.dataset.right);
  if (!leftCol || !rightCol || leftCol.classList.contains("hidden") || rightCol.classList.contains("hidden")) return;
  dragging = true;
  startX = e.clientX;
  leftStartWidth = leftCol.getBoundingClientRect().width;
  rightStartWidth = rightCol.getBoundingClientRect().width;
  resizer.classList.add("active");
  document.body.style.cursor = "col-resize";
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", stopDrag);
  });
  });
  }

  initResizeHandles();

  // =========================
  // CLEANER (NON-DESTRUCTIVE)
  // =========================
  function getCleanReadingHTML(rdgEl) {
  const clone = rdgEl.cloneNode(true);
  clone.querySelectorAll("tei-subst").forEach((subst) => {
  const add = subst.querySelector("tei-add");
  const del = subst.querySelector("tei-del");
  if (add) {
  const frag = document.createElement("span");
  frag.innerHTML = add.innerHTML;
  subst.replaceWith(frag);
  } else if (del) {
  subst.remove();
  } else {
  subst.remove();
  }
  });
  clone.querySelectorAll("tei-del").forEach((del) => del.remove());
  clone.querySelectorAll("tei-add").forEach((add) => {
  const span = document.createElement("span");
  span.innerHTML = add.innerHTML;
  add.replaceWith(span);
  });
  return clone.innerHTML;
  }
  function renderFinalAuthorialRdg(rdg) {
  const clone = rdg.cloneNode(true);
  clone.querySelectorAll("tei-del").forEach((del) => del.remove());
  clone.querySelectorAll("tei-add").forEach((add) => {
  const span = document.createElement("span");
  span.innerHTML = add.innerHTML;
  add.replaceWith(span);
  });
  rdg.innerHTML = clone.innerHTML;
  }

  // =========================
  // PHASE HIERARCHY
  // =========================
  const phaseHierarchy = {
  A0: ["A0"],
  A1: ["A0", "A1"],
  A2: ["A1", "A2"],
  B: ["A1", "A2", "B"],
  };
  function allowedWitsForPhase(phase) {
  if (!phase || phase.toLowerCase() === "all") return null;
  return phaseHierarchy[phase] || [phase];
  }

  // =========================
  // DECORATION (INLINE)
  // =========================
  function decorateRdgWithHighlight(rdg) {
  if (!rdg.dataset.originalHtml) rdg.dataset.originalHtml = rdg.innerHTML;
  if (rdg.classList.contains("decorated")) return;

      const wit = normWit(rdg.getAttribute("wit")) || "UNKNOWN";
      const seq = rdg.getAttribute("varSeq") || "";

      rdg.classList.add(`wit-${wit}`, "decorated");

      if (seq && !rdg.querySelector(".rdg-seq")) {
        const sup = document.createElement("sup");
        sup.className = "rdg-seq";
        sup.textContent = seq;
        rdg.appendChild(sup);
      }

      const subst = rdg.querySelector("tei-subst");
      if (subst) {
        const del = subst.querySelector("tei-del");
        const add = subst.querySelector("tei-add");
        if (del) del.outerHTML = `<span class="deletion">${del.innerHTML}</span>`;
        if (add) add.outerHTML = `<span class="addition">${add.innerHTML}</span>`;
      }

  }

  // =========================
  // MARGINALIA (single-line helper retained)
  // =========================
  function setupMarginalAdd(add, wit) {
  const currentPhase = (
  document.getElementById("variant-selector")?.value || "all"
  )
  .trim()
  .toUpperCase();
  const noteWit = normWit(wit || add.getAttribute("wit") || "unknown");
  const isActive = currentPhase === "ALL" || currentPhase === noteWit;

      const placeRaw = (add.getAttribute("place") || "left").toLowerCase();
      const dir = ["left", "right", "top", "bottom"].includes(placeRaw)
        ? placeRaw
        : "left";
      const sideES = {
        left: "izquierdo",
        right: "derecho",
        top: "alto",
        bottom: "bajo",
      }[dir];

      // Hover on the revealed box (single-line)
      add.setAttribute("title", `añadido en el margen ${sideES}`);

      // avoid duplicate buttons after switches
      if (add.previousElementSibling?.classList?.contains("marginal-toggle"))
        add.previousElementSibling.remove();
      if (add.nextElementSibling?.classList?.contains("marginal-toggle"))
        add.nextElementSibling.remove();

      add.classList.remove(
        "marginal-hidden",
        "marginal-active",
        "marginal-a0-block",
        "highlighted-marginal",
        "marginal-processed",
        "reveal",
        "reveal-in",
      );
      add.removeAttribute("data-reveal");
      add.style.display = "";
      add.style.removeProperty("--note-left");
      add.style.removeProperty("--note-nudge-x");

      if (!add.dataset.originalContent)
        add.dataset.originalContent = add.innerHTML;
      else add.innerHTML = add.dataset.originalContent;

      add.classList.add(`wit-${noteWit}`, "marginal-processed");

      const verse = add.closest("tei-l, l");
      if (verse) {
        const cs = getComputedStyle(verse);
        const pad = parseFloat(cs.paddingLeft) || 0;
        const indent = parseFloat(cs.textIndent) || 0;
        add.style.setProperty("--note-left", `${pad + indent}px`);
      }

      if (!isActive) {
        add.style.display = "inline";
        return;
      }

      add.classList.add("marginal-active", "highlighted-marginal");
      if (noteWit === "A0") add.classList.add("marginal-a0-block");
      add.classList.add("marginal-hidden");

      const btn = document.createElement("button");
      btn.textContent = "+";
      btn.className = "marginal-toggle";
      btn.title = `Mostrar marginalia — añadido en el margen ${sideES} en ${noteWit}`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        add.classList.remove("marginal-hidden");
        add.classList.add("reveal");
        add.dataset.reveal = dir;
        add.style.display = "inline-block";
        btn.replaceWith(add);
        requestAnimationFrame(() => add.classList.add("reveal-in"));
      });
      add.parentNode?.insertBefore(btn, add);

  }

  // =========================
  // Helpers for multi-line marginalia
  // =========================
  function isMarginalLine(node) {
  if (!node || !node.matches) return false;
  if (node.matches("tei-l[type='marginalia'], l[type='marginalia']"))
  return true;
  // also treat wrappers that only contain marginal lines as marginal blocks
  const onlyMarginalChildren = node.querySelector(
  ":scope > tei-l[type='marginalia'], :scope > l[type='marginalia']",
  );
  return (
  !!onlyMarginalChildren &&
  !node.querySelector(
  ":scope > tei-l:not([type='marginalia']), :scope > l:not([type='marginalia'])",
  )
  );
  }

  function setMarginalLineVisibility(node, { visible, place }) {
  if (!node.dataset.marginalSetup) {
  node.style.transition = "opacity 220ms ease, transform 220ms ease";
  node.style.willChange = "opacity, transform";
  node.dataset.marginalSetup = "1";
  }
  const side = (place || "left").toLowerCase();
  let offX = 0,
  offY = 0;
  const px = 14;
  if (!visible) {
  if (side === "left") offX = -px;
  if (side === "right") offX = px;
  if (side === "top") offY = -px;
  if (side === "bottom") offY = px;
  node.style.opacity = "0";
  node.style.transform = `translate(${offX}px, ${offY}px)`;
  node.classList.add("marginal-hidden"); // has display:none in CSS
  } else {
  node.style.opacity = "1";
  node.style.transform = "translate(0, 0)";
  node.classList.remove("marginal-hidden");
  }
  }

  // =========================
  // RANGE SPANS with overlaps
  // =========================
  function cssEscapeSafe(s) {
  if (window.CSS && CSS.escape) return CSS.escape(s);
  return String(s).replace(/[^a-zA-Z0-9_\-:.]/g, "\\$&");
    }
    function findAnchor(root, ref) {
      const id = (ref || "").replace(/^#/, "");
      if (!id) return null;
      return (
        root.querySelector(`#${cssEscapeSafe(id)}`) ||
        root.querySelector(`[xml\\:id="${cssEscapeSafe(id)}"]`)
      );
    }
    // Stable key so buttons are not duplicated across rebuilds
    function stableSpanId(spanEl, type, phaseId) {
      const xmlid = spanEl.getAttribute("xml:id") || spanEl.getAttribute("id");
      if (xmlid) return `${type}-span:${xmlid}`;
      const fromRef = (spanEl.getAttribute("from") || "").trim();
      const toRef = (spanEl.getAttribute("to") || "").trim();
      const subtype =
        type === "add" &&
        (spanEl.getAttribute("type") || "").toLowerCase() === "marginalia"
          ? "marginalia"
          : "";
      const place = (spanEl.getAttribute("place") || "").toLowerCase();
      const composite = `${fromRef}|${toRef}|${(
        phaseId || ""
      ).toUpperCase()}|${subtype}|${place}`;
      return composite.replace(/[|#]/g, "")
        ? `${type}-span:${composite}`
        : `${type}-span:auto-${++spanRangeAutoId}`;
  }

  function clearSpanRangeMarks(root) {
  root
  .querySelectorAll(
  ".int--del-range, .int--add-range, [data-range-id], .marginalia-range",
  )
  .forEach((el) => {
  el.classList.remove(
  "int--del-range",
  "int--add-range",
  "has-del-gutter",
  "marginalia-range",
  "wit-A0",
  "wit-A1",
  "wit-A2",
  "wit-B",
  "collapsed-del",
  "wit-MULTI",
  );
  el.removeAttribute("data-range-id");
  el.removeAttribute("data-marginalia-phases");
  el.removeAttribute("data-marginalia-place");

          // wipe background using shorthand so we beat any CSS rules
          el.style.background = "none";
          el.style.removeProperty("background-color");
          el.style.removeProperty("background-image");
          el.style.removeProperty("background-blend-mode");
          el.style.removeProperty("background-position");
          el.style.removeProperty("background-size");
          el.style.removeProperty("background-repeat");

          el.style.removeProperty("text-decoration");
          el.style.removeProperty("text-decoration-color");
          el.style.removeProperty("text-decoration-thickness");
          el.style.removeProperty("text-underline-offset");
        });

      // unhide marginal lines if hidden in the previous pass
      root
        .querySelectorAll("tei-l[type='marginalia'], l[type='marginalia']")
        .forEach((el) => el.classList.remove("marginal-hidden"));

      for (const [node] of nodeToRanges) {
        if (root.contains(node)) nodeToRanges.delete(node);
      }

      for (let i = spanRanges.length - 1; i >= 0; i--) {
        const r = spanRanges[i];
        if (r.nodes.length && root.contains(r.nodes[0])) spanRanges.splice(i, 1);
      }

  }

  function walkElementsFromTo(startBlock, endAnchor, boundaryRoot, cb) {
  const nextEl = (n) => {
  if (n.firstElementChild) return n.firstElementChild;
  while (n && n !== boundaryRoot && !n.nextElementSibling)
  n = n.parentElement;
  return n && n !== boundaryRoot ? n.nextElementSibling : null;
  };
  let node = startBlock;
  while (node) {
  if (node.nodeType === 1) cb(node);
  if (node.contains(endAnchor) || node === endAnchor) break;
  node = nextEl(node);
  }
  }

  function decorateSpanRanges(root) {
  if (!root) return;

      if (CLEAN_MODE) {
        clearSpanRangeMarks(root);
        return;
      }

      clearSpanRangeMarks(root);
      const scrollRoot = root.closest(".tei-column-scroll") || root;

      const processSpan = (spanEl, type) => {
        const fromRef = spanEl.getAttribute("from");
        const toRef = spanEl.getAttribute("to");
        if (!fromRef || !toRef) return;

        const startAnchor = findAnchor(root, fromRef);
        const endAnchor = findAnchor(root, toRef);
        if (!startAnchor || !endAnchor) return;

        let first = startAnchor,
          last = endAnchor;
        if (
          first.compareDocumentPosition(last) & Node.DOCUMENT_POSITION_PRECEDING
        ) {
          [first, last] = [last, first];
        }

        const innerRdg = spanEl.querySelector("tei-rdg");
        const phaseId =
          normWit(innerRdg?.getAttribute("wit")) ||
          normWit(spanEl.getAttribute("wit")) ||
          normWit(spanEl.getAttribute("hand")) ||
          "";

        // detect marginalia addSpan subtype + place
        const subtype =
          type === "add" &&
          (spanEl.getAttribute("type") || "").toLowerCase() === "marginalia"
            ? "marginalia"
            : "";
        const place = (spanEl.getAttribute("place") || "").toLowerCase();

        const id = stableSpanId(spanEl, type, phaseId);
        const nodes = [];

        const startBlock =
          first.closest(HIGHLIGHT_BLOCK_SEL) ||
          first.parentElement?.closest(HIGHLIGHT_BLOCK_SEL) ||
          first;

        walkElementsFromTo(startBlock, last, scrollRoot, (el) => {
          if (!el.matches || !el.matches(HIGHLIGHT_BLOCK_SEL)) return;
          const entry = { id, type, phase: phaseId };
          if (subtype) entry.subtype = subtype;
          if (place) entry.place = place;
          const list = nodeToRanges.get(el) || [];
          list.push(entry);
          nodeToRanges.set(el, list);
          el.dataset.rangeId =
            (el.dataset.rangeId ? el.dataset.rangeId + "," : "") + id;
          nodes.push(el);
        });

        spanEl.style.display = "none";
        spanRanges.push({ id, type, phase: phaseId, nodes, subtype, place });
      };

      root
        .querySelectorAll("tei-delspan")
        .forEach((el) => processSpan(el, "del"));
      root
        .querySelectorAll("tei-addspan")
        .forEach((el) => processSpan(el, "add"));
      root
        .querySelectorAll("tei-delSpan")
        .forEach((el) => processSpan(el, "del"));
      root
        .querySelectorAll("tei-addSpan")
        .forEach((el) => processSpan(el, "add"));

      const currentPhase = (
        document.getElementById("variant-selector")?.value || "ALL"
      ).toUpperCase();
      updateSpanRangesVisibility(currentPhase);

  }

  // =========================
  // ZIG-ZAG SPLIT for two-witness overlaps (deletions)
  // =========================
  function applyZigZagSplitBackground(
  node,
  leftColor,
  rightColor,
  {
  biasPercent = 50, // 50=even; >50 favors left color, <50 favors right
  toothPx = 10, // horizontal bite (as % of width)
  stepPx = 14, // vertical spacing between teeth
  } = {},
  ) {
  node.style.background = "none";

      const dx = Math.max(1, Math.min(20, (toothPx / 100) * 100));
      const step = Math.max(4, Math.min(30, (stepPx / 100) * 100));
      const mid = Math.max(5, Math.min(95, biasPercent));

      const zig = [];
      let x = mid;
      let dir = -1;
      for (let y = 0; y <= 100; y += step) {
        zig.push([x, Math.min(y, 100)]);
        x = mid + dir * dx;
        dir *= -1;
      }
      if (zig[zig.length - 1][1] !== 100) zig.push([mid, 100]);

      const leftPts = [[0, 0], [mid, 0], ...zig.slice(1), [0, 100]];
      const rightPts = [[mid, 0], ...zig.slice(1), [100, 100], [100, 0]];
      const pts = (ptsArr) => ptsArr.map(([px, py]) => `${px},${py}`).join(" ");

      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">` +
        `<polygon fill="${leftColor}" points="${pts(leftPts)}"/>` +
        `<polygon fill="${rightColor}" points="${pts(rightPts)}"/>` +
        `</svg>`;

      const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
      node.style.backgroundImage = url;
      node.style.backgroundRepeat = "no-repeat";
      node.style.backgroundSize = "100% 100%";
      node.style.backgroundPosition = "0 0";

  }

  // =========================
  // Deletion background painter (split inside one block)
  // =========================
  function applyDelBackgroundSplit(node, delPhases) {
  node.style.background = "none";
  node.style.removeProperty("background-color");
  node.style.removeProperty("background-image");
  node.style.removeProperty("background-blend-mode");
  node.style.removeProperty("background-position");
  node.style.removeProperty("background-size");
  node.style.removeProperty("background-repeat");

      const list = uniquePhases(delPhases);
      if (!list.length) return;

      if (list.length === 1) {
        const p = list[0];
        const c = hexToRgba(PHASE_PALETTE[p]?.tint || "#cccccc", DEL_WASH_ALPHA);
        node.style.background = c;
        return;
      }

      if (list.length === 2) {
        const c1 = hexToRgba(
          PHASE_PALETTE[list[0]]?.tint || "#ccc",
          DEL_WASH_ALPHA,
        );
        const c2 = hexToRgba(
          PHASE_PALETTE[list[1]]?.tint || "#ccc",
          DEL_WASH_ALPHA,
        );
        applyZigZagSplitBackground(node, c1, c2, {
          biasPercent: 50,
          toothPx: 10,
          stepPx: 14,
        });
        return;
      }

      const n = list.length;
      const parts = [];
      for (let i = 0; i < n; i++) {
        const p = list[i];
        const c = hexToRgba(PHASE_PALETTE[p]?.tint || "#ccc", DEL_WASH_ALPHA);
        const start = (100 / n) * i;
        const end = (100 / n) * (i + 1);
        parts.push(`${c} ${start}% ${end}%`);
      }
      node.style.background = `linear-gradient(90deg, ${parts.join(", ")})`;
      node.style.backgroundRepeat = "no-repeat";
      node.style.backgroundSize = "100% 100%";

  }

  // =========================
  // Addition (marginalia) wash painter
  // =========================
  function applyAddBackgroundSplit(node, phases, alpha = ADD_WASH_ALPHA) {
  node.style.background = "none";
  node.style.removeProperty("background-image");
  node.style.removeProperty("background-blend-mode");
  node.style.removeProperty("background-position");
  node.style.removeProperty("background-size");
  node.style.removeProperty("background-repeat");

      const list = uniquePhases(phases);
      if (!list.length) return;

      if (list.length === 1) {
        const p = list[0];
        const c = hexToRgba(PHASE_PALETTE[p]?.tint || "#cccccc", alpha);
        node.style.background = c;
        return;
      }

      const n = list.length;
      const parts = [];
      for (let i = 0; i < n; i++) {
        const p = list[i];
        const c = hexToRgba(PHASE_PALETTE[p]?.tint || "#ccc", alpha);
        const start = (100 / n) * i;
        const end = (100 / n) * (i + 1);
        parts.push(`${c} ${start}% ${end}%`);
      }
      node.style.background = `linear-gradient(90deg, ${parts.join(", ")})`;
      node.style.backgroundRepeat = "no-repeat";
      node.style.backgroundSize = "100% 100%";

  }

  // =========================
  // Strike style helper
  // =========================
  function setStrike(node, { colored = false, phase = null }) {
  node.style.textDecoration = "line-through";
  node.style.textDecorationThickness = "1.6px";
  node.style.textDecorationColor =
  colored && phase && PHASE_PALETTE[phase]
  ? PHASE_PALETTE[phase].stroke
  : "#222";
  node.style.removeProperty("text-underline-offset");
  }

  // =========================
  // Visibility/update application
  // =========================
  function updateSpanRangesVisibility(currentPhase) {
  const phase = (currentPhase || "ALL").toUpperCase();
  const showAll = phase === "ALL";

      if (typeof CLEAN_MODE !== "undefined" && CLEAN_MODE) {
        for (const [node] of nodeToRanges) {
          node.classList.remove(
            "int--del-range",
            "int--add-range",
            "has-del-gutter",
            "marginalia-range",
            "wit-A0",
            "wit-A1",
            "wit-A2",
            "wit-B",
            "collapsed-del",
          );
          node.style.background = "none";
          node.style.removeProperty("background-color");
          node.style.removeProperty("background-image");
          node.style.removeProperty("background-blend-mode");
          node.style.removeProperty("background-position");
          node.style.removeProperty("background-size");
          node.style.removeProperty("background-repeat");

          node.style.removeProperty("text-decoration");
          node.style.removeProperty("text-decoration-thickness");
          node.style.removeProperty("text-decoration-color");
          node.style.removeProperty("text-underline-offset");
          node.removeAttribute("data-marginalia-phases");
          node.removeAttribute("data-marginalia-place");
        }
        return;
      }

      // reset
      for (const [node] of nodeToRanges) {
        node.classList.remove(
          "int--del-range",
          "int--add-range",
          "has-del-gutter",
          "marginalia-range",
          "wit-A0",
          "wit-A1",
          "wit-A2",
          "wit-B",
          "collapsed-del",
        );
        node.style.background = "none";
        node.style.removeProperty("background-color");
        node.style.removeProperty("background-image");
        node.style.removeProperty("background-blend-mode");
        node.style.removeProperty("background-position");
        node.style.removeProperty("background-size");
        node.style.removeProperty("background-repeat");

        node.style.removeProperty("text-decoration");
        node.style.removeProperty("text-decoration-thickness");
        node.style.removeProperty("text-decoration-color");
        node.style.removeProperty("text-underline-offset");
        node.removeAttribute("data-marginalia-phases");
        node.removeAttribute("data-marginalia-place");
      }

      // Collect marginal addSpan ranges for per-range buttons
      const marginalAddRangesThisPass = new Map(); // rangeId -> { nodes, place, phases, marginalNodes }

      // apply
      for (const [node, ranges] of nodeToRanges) {
        const visible = ranges.filter((r) => {
          const p = (r.phase || "").toUpperCase();
          if (!showAll) {
            if (phase !== "B" && p === "B") return false; // never show B in A0/A1/A2 views
            return p === phase;
          }
          return true; // ALL
        });

        if (!visible.length) continue;

        const hasDel = visible.some((r) => r.type === "del");
        const hasAdd = visible.some((r) => r.type === "add");
        const phases = uniquePhases(visible.map((r) => r.phase));

        phases.forEach((p) => node.classList.add(`wit-${p}`));

        // Deletions
        const delPhases = uniquePhases(
          visible.filter((r) => r.type === "del").map((r) => r.phase),
        );
        if (delPhases.length) {
          applyDelBackgroundSplit(node, delPhases);
          node.classList.add("int--del-range", "has-del-gutter");
          if (showAll) setStrike(node, { colored: false });
          else setStrike(node, { colored: true, phase });
        }

        // Additions
        const addRanges = visible.filter((r) => r.type === "add");
        const marginalAdd = addRanges.filter(
          (r) => (r.subtype || "") === "marginalia",
        );

        if (marginalAdd.length) {
          const phasesForMarg = uniquePhases(marginalAdd.map((r) => r.phase));
          const place = (marginalAdd[0].place || "left").toLowerCase();

          node.classList.add("marginalia-range");
          node.dataset.marginaliaPhases = JSON.stringify(phasesForMarg);
          node.dataset.marginaliaPlace = place;

          // Start hidden background (alpha 0) until click
          applyAddBackgroundSplit(node, phasesForMarg, 0);

          // If a marginal-line block, hide its text until reveal
          if (isMarginalLine(node)) {
            setMarginalLineVisibility(node, { visible: false, place });
          }

          // Register nodes by range id for a single toggle button per range per column
          const ids = (node.dataset.rangeId || "").split(",").filter(Boolean);
          ids.forEach((rangeId) => {
            if (!marginalAddRangesThisPass.has(rangeId)) {
              marginalAddRangesThisPass.set(rangeId, {
                nodes: [],
                place,
                phases: phasesForMarg,
                marginalNodes: [],
              });
            }
            const pack = marginalAddRangesThisPass.get(rangeId);
            pack.nodes.push(node);
            if (isMarginalLine(node)) pack.marginalNodes.push(node);
          });
        }

        // Plain non-marginal additions keep underline
        if (hasAdd && !marginalAdd.length) {
          node.classList.add("int--add-range");
          node.style.textDecoration = "underline dashed";
          node.style.textDecorationThickness = "1.6px";
          node.style.textUnderlineOffset = "0.15em";
          node.style.textDecorationColor =
            phases.length === 1 && PHASE_PALETTE[phases[0]]
              ? PHASE_PALETTE[phases[0]].stroke
              : "currentColor";
        }
      }

      // Buttons + interactions for marginal add ranges
      enhanceMarginalAddRangeInteractions(marginalAddRangesThisPass);

  }

  // =========================
  // Buttons/Interactions for multi-line marginalia
  // =========================
  function enhanceMarginalAddRangeInteractions(rangeMap) {
  rangeMap.forEach(({ nodes, place, phases }, rangeId) => {
  if (!nodes?.length) return;

        // Collect ALL marginal-line elements within the range
        const marginalLineSet = new Set();
        nodes.forEach((n) => {
          if (isMarginalLine(n)) marginalLineSet.add(n);
          n.querySelectorAll(
            "tei-l[type='marginalia'], l[type='marginalia']",
          ).forEach((x) => marginalLineSet.add(x));
        });
        const marginalNodes = Array.from(marginalLineSet);

        // One button per COLUMN per range
        const column = nodes[0].closest(".tei-column-scroll") || document;
        const existingBtn = column.querySelector(
          `button.marginal-range-toggle[data-range-id="${CSS.escape(rangeId)}"]`,
        );
        if (existingBtn) return;

        const anchor = nodes.find((n) => !isMarginalLine(n)) || nodes[0];

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "marginal-range-toggle";
        btn.dataset.rangeId = rangeId;
        btn.textContent = "+";

        // full Spanish words, like single-line
        const sideES =
          {
            left: "izquierdo",
            right: "derecho",
            top: "alto",
            bottom: "bajo",
          }[(place || "left").toLowerCase()] || "margen";

        // choose witness for the tooltip: current phase if present, else the first phase of the range
        const currentPhase = (
          document.getElementById("variant-selector")?.value || "all"
        ).toUpperCase();
        const titleWit =
          currentPhase !== "ALL" && phases.includes(currentPhase)
            ? currentPhase
            : phases[0] || "A0";

        btn.title = `Mostrar marginalia — añadido en el margen ${sideES} en ${titleWit}`;

        Object.assign(btn.style, {
          display: "inline-block",
          padding: "0 .4rem",
          lineHeight: "1.2",
          border: "1px solid #999",
          borderRadius: "4px",
          background: "#fff",
          cursor: "pointer",
          marginRight: ".35rem",
          verticalAlign: "middle",
          whiteSpace: "nowrap",
        });

        anchor.parentNode?.insertBefore(btn, anchor);

        // On click: reveal text with the same animation + set final hover title
        btn.addEventListener("click", (e) => {
          e.stopPropagation();

          // Wash in background for all blocks in the range
          nodes.forEach((n) => {
            const p = JSON.parse(n.dataset.marginaliaPhases || "[]");
            applyAddBackgroundSplit(n, p, ADD_WASH_ALPHA);
            n.classList.add("reveal-in");
          });

          const side = (place || "left").toLowerCase();
          const dirMap = {
            left: "left",
            right: "right",
            top: "top",
            bottom: "bottom",
          };
          const dir = dirMap[side] || "left";

          // 👉 Reveal the marginal lines (remove hidden styles) and wrap to reuse single-line CSS
          marginalNodes.forEach((line) => {
            // make it visible (undo opacity/transform + display:none from class)
            setMarginalLineVisibility(line, { visible: true, place: side });

            // avoid double wrapping
            if (line.querySelector('tei-add[data-span-wrap="1"]')) return;

            const wrap = document.createElement("tei-add");
            wrap.setAttribute("place", side);
            wrap.dataset.spanWrap = "1";
            wrap.dataset.rangeId = rangeId;
            wrap.dataset.reveal = dir;
            wrap.classList.add("marginal-active", "reveal");

            // final hover title like single-line (no witness mention)
            wrap.setAttribute("title", `añadido en el margen ${sideES}`);

            // move content inside wrapper
            const kids = [...line.childNodes];
            line.insertBefore(wrap, line.firstChild);
            kids.forEach((k) => wrap.appendChild(k));

            requestAnimationFrame(() => wrap.classList.add("reveal-in"));
          });

          btn.remove();
        });
      });

  }

  // =========================
  // Overlap backgrounds — (kept for compatibility)
  // =========================
  function applyPhaseBackground(node, phases) {
  node.style.background = "none";
  node.style.removeProperty("background-blend-mode");

      const list = phases.filter((p) => PHASE_PALETTE[p]);
      if (!list.length) return;

      if (list.length === 1) {
        const p = list[0];
        node.style.background = hexToRgba(
          PHASE_PALETTE[p].tint,
          TINT_ALPHA_SINGLE,
        );
        return;
      }

      const layers = list.map((p) => {
        const c = hexToRgba(PHASE_PALETTE[p].tint, OVERLAP_ALPHA);
        return `linear-gradient(0deg, ${c}, ${c})`;
      });

      node.style.background = layers.join(", ");
      node.style.backgroundBlendMode = "multiply";

  }

  function collapseAllDelSpans(collapsed = true) {
  spanRanges
  .filter((r) => r.type === "del")
  .forEach((r) =>
  r.nodes.forEach((n) => n.classList.toggle("collapsed-del", collapsed)),
  );
  }

  // =========================
  // FILTERING
  // =========================
  function filterReadings({
  wit = null,
  showAll = false,
  defaultView = false,
  }) {
  const apps = document.querySelectorAll("tei-app");

      apps.forEach((app) => {
        const rdgs = Array.from(app.querySelectorAll("tei-rdg, tei-lem"));

        if (!showAll && !defaultView) {
          rdgs.forEach((rdg) => {
            rdg.style.display = "none";
            rdg.classList.remove(
              "active-reading",
              "decorated",
              "wit-A0",
              "wit-A1",
              "wit-A2",
              "wit-B1",
              "wit-B2",
            );
            if (rdg.dataset.originalHtml)
              rdg.innerHTML = rdg.dataset.originalHtml;
            const sup = rdg.querySelector(".rdg-seq");
            if (sup) sup.remove();
          });
        }

        if (wit) {
          let found = false;
          const allowedWits = (phaseHierarchy[wit] || [wit]).map(normWit);

          rdgs.forEach((rdg) => {
            const rdgWit = normWit(rdg.getAttribute("wit"));
            if (allowedWits.includes(rdgWit)) {
              rdg.style.display = "inline";
              found = true;
              rdg
                .querySelectorAll("tei-add[place]")
                .forEach((add) => setupMarginalAdd(add, rdgWit));
            }
            if (rdgWit === normWit(wit)) {
              decorateRdgWithHighlight(rdg);
              rdg.classList.add("active-reading");
            }
          });

          if (
            !rdgs.some((r) => r.style.display !== "none") &&
            (wit === "A1" || wit === "A2")
          ) {
            const a0 = rdgs.find((r) => normWit(r.getAttribute("wit")) === "A0");
            if (a0) {
              a0.style.display = "inline";
              a0.querySelectorAll("tei-add[place]").forEach((add) =>
                setupMarginalAdd(add, "A0"),
              );
              found = true;
            }
          }

          app.style.display = found ? "inline" : "none";
          return;
        }

        if (showAll || defaultView) {
          rdgs.forEach((rdg) => {
            rdg.style.display = "inline";
            decorateRdgWithHighlight(rdg);
            rdg.querySelectorAll("tei-add[place]").forEach((add) => {
              setupMarginalAdd(
                add,
                normWit(rdg.getAttribute("wit")) || "unknown",
              );
            });
          });
          app.style.display = "inline";
        }
      });

  }

  // =========================
  // PHASE CHANGE HANDLER
  // =========================
  function handleVariantChange(value) {
  CLEAN_MODE = false;

      document.body.classList.remove("clean-mode");
      restoreAllReadings();

      if (value === "all") filterReadings({ showAll: true });
      else if (["A0", "A1", "A2", "B"].includes(value))
        filterReadings({ wit: value });

      highlightMarginaliaForPhase(value);
      document.querySelectorAll("tei-add[place]").forEach((add) => {
        const parentRdg = add.closest("tei-rdg, tei-lem");
        const wit = normWit(parentRdg?.getAttribute("wit") || "unknown");
        setupMarginalAdd(add, wit);
      });

      rebuildSpanRanges();
      updateSpanRangesVisibility((value || "ALL").toUpperCase());

  }

  // =========================
  // CLEAN / RESTORE
  // =========================
  function showCleanLemmasOnly() {
  CLEAN_MODE = true;

      const apps = document.querySelectorAll("tei-app");
      apps.forEach((app) => {
        const rdgs = app.querySelectorAll("tei-rdg");
        const lems = app.querySelectorAll("tei-lem");
        rdgs.forEach((rdg) => {
          rdg.style.display = "none";
        });
        lems.forEach((lem) => {
          if (!lem.dataset.originalHtml) lem.dataset.originalHtml = lem.innerHTML;
          lem.style.display = "inline";
          lem.classList.remove("decorated", "active-reading");
          Array.from(lem.classList).forEach((cls) => {
            if (cls.startsWith("wit-")) lem.classList.remove(cls);
          });
          const sup = lem.querySelector(".rdg-seq");
          if (sup) sup.remove();
          lem.innerHTML = getCleanReadingHTML(lem);
        });
        document.querySelectorAll("tei-note.note-decorated").forEach((note) => {
          note.style.display = "none";
        });
        app.style.display = "inline";
      });

      for (const [node] of nodeToRanges) {
        node.classList.remove(
          "int--del-range",
          "int--add-range",
          "has-del-gutter",
          "wit-A0",
          "wit-A1",
          "wit-A2",
          "wit-B",
          "collapsed-del",
        );
        node.style.background = "none";
        node.style.removeProperty("background-color");
        node.style.removeProperty("background-image");
        node.style.removeProperty("background-blend-mode");
        node.style.removeProperty("background-position");
        node.style.removeProperty("background-size");
        node.style.removeProperty("background-repeat");

        node.style.removeProperty("text-decoration");
        node.style.removeProperty("text-decoration-thickness");
        node.style.removeProperty("text-decoration-color");
        node.style.removeProperty("text-underline-offset");
      }
      spanRanges.length = 0;
      nodeToRanges.clear();

  }

  function restoreAllReadings() {
  document.querySelectorAll("tei-rdg, tei-lem").forEach((el) => {
  if (el.dataset.originalHtml) el.innerHTML = el.dataset.originalHtml;
  el.style.display = "";
  el.classList.remove("active-reading", "decorated");
  Array.from(el.classList).forEach((cls) => {
  if (cls.startsWith("wit-")) el.classList.remove(cls);
  });
  });
  document.querySelectorAll("tei-note.note-decorated").forEach((note) => {
  note.style.display = "inline";
  });
  collapseAllDelSpans(false);
  }

  // =========================
  // REBUILD helper (both columns)
  // =========================
  function unwrapSyntheticSpanWrappers(scope = document) {
  scope.querySelectorAll('tei-add[data-span-wrap="1"]').forEach((w) => {
  const parent = w.parentNode;
  while (w.firstChild) parent.insertBefore(w.firstChild, w);
  w.remove();
  });
  }
  function rebuildSpanRanges() {
  if (CLEAN_MODE) return;

      // remove previous buttons and synthetic wrappers
      document
        .querySelectorAll(".marginal-range-toggle")
        .forEach((b) => b.remove());
      unwrapSyntheticSpanWrappers(document);

      spanRanges.length = 0;
      nodeToRanges.clear();
      const modern = document.querySelector(
        "#modern-container .tei-column-scroll",
      );
      const diplomatic = document.querySelector(
        "#diplomatic-container .tei-column-scroll",
      );
      if (modern) decorateSpanRanges(modern);
      if (diplomatic) decorateSpanRanges(diplomatic);

  }

  // =========================
  // Marginalia highlighting helper (unchanged)
  // =========================
  function highlightMarginaliaForPhase(wit) {
  document.querySelectorAll("tei-add[place]").forEach((add) => {
  add.classList.remove("highlighted-marginal");
  });
  if (!wit || wit === "all") return;
  const allowedWits = (phaseHierarchy[wit] || [wit]).map(normWit);
  document.querySelectorAll("tei-rdg, tei-lem").forEach((varEl) => {
  const varWit = normWit(varEl.getAttribute("wit"));
  if (allowedWits.includes(varWit) && varWit === normWit(wit)) {
  varEl.querySelectorAll("tei-add[place]").forEach((add) => {
  add.classList.add("highlighted-marginal");
  });
  }
  });
  }

  // =========================
  // ONLOAD: SYNC, LOAD TEI, SEARCH
  // =========================
  window.onload = function () {
  const pbSelector = document.getElementById("pb-selector");
  let diplomaticLoaded = false;
  let modernLoaded = false;

      /* ===== Sync guards (pause ONLY during search) ===== */
      let isSyncing = false;
      let isSearchActive = false;
      const SEARCH_SUSPEND_MS = 900;
      let searchSuspendTimer = null;

      function beginSearchSuspend() {
        isSearchActive = true;
        isSyncing = true;
        if (searchSuspendTimer) clearTimeout(searchSuspendTimer);
      }
      function endSearchSuspendSoon() {
        if (searchSuspendTimer) clearTimeout(searchSuspendTimer);
        searchSuspendTimer = setTimeout(() => {
          isSearchActive = false;
          isSyncing = false;
        }, SEARCH_SUSPEND_MS);
      }

      // Toggle search bar
      document.getElementById("toggle-search").addEventListener("click", () => {
        const searchBar = document.getElementById("search-bar");
        searchBar.classList.toggle("hidden");
        if (!searchBar.classList.contains("hidden")) {
          document.getElementById("search-input").focus();
        } else {
          clearAllSearch();
        }
      });

      // Toggle toolbar
      document.getElementById("toolbar-toggle").addEventListener("click", () => {
        const toolbar = document.getElementById("toolbar");
        const btn = document.getElementById("toolbar-toggle");
        toolbar.classList.toggle("collapsed");
        btn.classList.toggle("collapsed");
      });

      // Column open/close
      document.querySelectorAll(".close-column").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const col = e.target.closest(".tei-column");
          col.classList.add("hidden");
          document.querySelector(
            `.toggle-col[data-target="${col.id}"]`,
          ).checked = false;
          updateLayoutClasses();
        });
      });
      document.querySelectorAll(".toggle-col").forEach((cb) => {
        cb.addEventListener("change", (e) => {
          const target = e.target.dataset.target;
          document
            .getElementById(target)
            .classList.toggle("hidden", !e.target.checked);
          updateLayoutClasses();
        });
      });

      /* ===== PB sync helpers (edition drives others) ===== */
      let modernPbAnchors = [];
      let currentScrolledPbId = null;

      function computeModernAnchors() {
        const modernScroll = document.querySelector(
          "#modern-container .tei-column-scroll",
        );
        if (!modernScroll) return;
        const pbs = modernScroll.querySelectorAll("tei-pb, pb, [id^='pb']");
        modernPbAnchors = [];
        pbs.forEach((pb) => {
          const id = pb.getAttribute("id") || pb.getAttribute("xml:id");
          if (!id) return;
          modernPbAnchors.push({ id, top: pb.offsetTop });
        });
        modernPbAnchors.sort((a, b) => a.top - b.top);
      }

      function findPbByScrollY(y) {
        if (!modernPbAnchors.length) return null;
        let lo = 0,
          hi = modernPbAnchors.length - 1,
          ans = 0;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (modernPbAnchors[mid].top <= y) {
            ans = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
        return modernPbAnchors[ans];
      }

      function updateFacsimile(id) {
        const option = pbSelector.querySelector(`option[value="${id}"]`);
        if (option) {
          const facs = option.dataset.facs;
          const img = document.getElementById("facsimile-image");
          img.src = `../facs/${facs}.jpg`;
          img.onerror = () => {
            img.src = "../facs/placeholder.jpg";
          };
        }
      }

      function scrollToPb(id, { force = false } = {}) {
        if (!force && (isSearchActive || isSyncing)) return;

        const containers = [
          document.querySelector("#modern-container .tei-column-scroll"),
          document.querySelector("#diplomatic-container .tei-column-scroll"),
        ];

        isSyncing = true;
        containers.forEach((container) => {
          const target = container?.querySelector(`#${id}`);
          if (target && container) {
            container.scrollTo({
              top: target.offsetTop - 40,
              behavior: "smooth",
            });
          }
        });

        updateFacsimile(id);
        if (pbSelector.value !== id) pbSelector.value = id;

        setTimeout(() => {
          isSyncing = false;
        }, 600);
      }

      function checkReadyAndInit() {
        if (diplomaticLoaded && modernLoaded) {
          pbSelector.addEventListener("change", (e) =>
            scrollToPb(e.target.value, { force: true }),
          );

          computeModernAnchors();
          window.addEventListener("resize", computeModernAnchors);

          const modernScroll = document.querySelector(
            "#modern-container .tei-column-scroll",
          );
          if (modernScroll) {
            modernScroll.addEventListener(
              "scroll",
              () => {
                if (isSearchActive || isSyncing) return;
                const y = modernScroll.scrollTop + 50;
                const anchor = findPbByScrollY(y);
                if (!anchor) return;
                const id = anchor.id;
                if (id && id !== currentScrolledPbId) {
                  currentScrolledPbId = id;
                  scrollToPb(id);
                }
              },
              { passive: true },
            );
          }

          const firstOption = pbSelector.options[0];
          if (firstOption) {
            pbSelector.value = firstOption.value;
            scrollToPb(firstOption.value, { force: true });
          }
        }
      }

      // ======= Zoom & Pan for facsimile image (mouse + touch) =======
      const wrap = document.getElementById("facsimile-wrapper");
      const img = document.getElementById("facsimile-image");

      const Z = { scale: 1, min: 1, max: 6, x: 0, y: 0 }; // zoom/pan state
      let isPanning = false;
      let panStart = { x: 0, y: 0 };
      let lastTapTime = 0;

      // Apply transform to image
      function apply() {
        img.style.transform = `translate(${Z.x}px, ${Z.y}px) scale(${Z.scale})`;
      }

      // Constrain panning so the image doesn't slide away completely
      function clampPan() {
        const vw = wrap.clientWidth;
        const vh = wrap.clientHeight;
        const bw = img.offsetWidth * Z.scale;
        const bh = img.offsetHeight * Z.scale;

        // If the image is smaller than the viewport, keep it centered
        const minX = Math.min(0, vw - bw);
        const minY = Math.min(0, vh - bh);

        Z.x = Math.max(minX, Math.min(0, Z.x));
        Z.y = Math.max(minY, Math.min(0, Z.y));
      }

      // Zoom at a specific clientX/clientY point
      function zoomAt(clientX, clientY, nextScale) {
        nextScale = Math.max(Z.min, Math.min(Z.max, nextScale));
        const rect = wrap.getBoundingClientRect();

        // point coordinates relative to the current transform
        const px = (clientX - rect.left - Z.x) / Z.scale;
        const py = (clientY - rect.top - Z.y) / Z.scale;

        // update scale and reposition so the point stays under the cursor/finger
        Z.scale = nextScale;
        Z.x = clientX - rect.left - px * Z.scale;
        Z.y = clientY - rect.top - py * Z.scale;

        clampPan();
        apply();
      }

      // --- Mouse wheel zoom (desktop)
      wrap.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          const factor = Math.exp(-e.deltaY * 0.0015); // smooth zoom factor
          zoomAt(e.clientX, e.clientY, Z.scale * factor);
        },
        { passive: false },
      );

      // --- Mouse drag panning
      img.addEventListener("mousedown", (e) => {
        if (Z.scale <= 1) return; // no pan when fully zoomed out
        isPanning = true;
        img.classList.add("grabbing");
        panStart = { x: e.clientX - Z.x, y: e.clientY - Z.y };
      });

      window.addEventListener("mousemove", (e) => {
        if (!isPanning) return;
        Z.x = e.clientX - panStart.x;
        Z.y = e.clientY - panStart.y;
        clampPan();
        apply();
      });

      window.addEventListener("mouseup", () => {
        isPanning = false;
        img.classList.remove("grabbing");
      });

      // --- Double click to zoom in, Shift+click to zoom out
      wrap.addEventListener("dblclick", (e) => {
        e.preventDefault();
        const targetScale = e.shiftKey
          ? Math.max(Z.min, Z.scale / 2)
          : Math.min(Z.max, Z.scale * 2);
        zoomAt(e.clientX, e.clientY, targetScale);
      });

      // --- Touch helpers (pan with 1 finger, pinch with 2 fingers)
      let touchState = null; // { d, cx, cy } previous distance & center

      function getTouchCenterAndDistance(touches) {
        const t1 = touches[0],
          t2 = touches[1];
        const cx = (t1.clientX + t2.clientX) / 2;
        const cy = (t1.clientY + t2.clientY) / 2;
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        const d = Math.hypot(dx, dy);
        return { cx, cy, d };
      }

      wrap.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length === 1) {
            // double tap to zoom in/out
            const now = Date.now();
            if (now - lastTapTime < 300) {
              const t = e.touches[0];
              const target =
                Z.scale < 2
                  ? Math.min(Z.max, Z.scale * 2)
                  : Math.max(1, Z.scale / 2);
              zoomAt(t.clientX, t.clientY, target);
              lastTapTime = 0;
              return;
            }
            lastTapTime = now;
            if (Z.scale > 1) {
              isPanning = true;
              panStart = {
                x: e.touches[0].clientX - Z.x,
                y: e.touches[0].clientY - Z.y,
              };
            }
          } else if (e.touches.length === 2) {
            e.preventDefault();
            touchState = getTouchCenterAndDistance(e.touches);
          }
        },
        { passive: false },
      );

      wrap.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches.length === 1 && isPanning) {
            e.preventDefault();
            Z.x = e.touches[0].clientX - panStart.x;
            Z.y = e.touches[0].clientY - panStart.y;
            clampPan();
            apply();
          } else if (e.touches.length === 2) {
            e.preventDefault();
            const cur = getTouchCenterAndDistance(e.touches);
            if (touchState && touchState.d > 0) {
              const factor = cur.d / touchState.d;
              zoomAt(cur.cx, cur.cy, Z.scale * factor);
              // update state for continuous gesture
              touchState = { cx: cur.cx, cy: cur.cy, d: cur.d };
            } else {
              touchState = cur;
            }
          }
        },
        { passive: false },
      );

      wrap.addEventListener(
        "touchend",
        () => {
          isPanning = false;
          touchState = null;
        },
        { passive: false },
      );

      // Reset zoom/pan when switching folio
      function resetFacsView() {
        Z.scale = 1;
        Z.x = 0;
        Z.y = 0;
        apply();
      }
      document
        .getElementById("prev-folio")
        .addEventListener("click", resetFacsView);
      document
        .getElementById("next-folio")
        .addEventListener("click", resetFacsView);
      document
        .getElementById("pb-selector")
        .addEventListener("change", resetFacsView);

      // Recalculate after image load (ensures correct offsetWidth)
      img.addEventListener("load", () => {
        resetFacsView();
      });

      // Initialize
      apply();

      function loadTEI(filename, containerId, prefix, onComplete) {
        CETEIcean.getHTML5(filename, (data) => {
          decorateNotes(data);
          attachNoteEvents(data);

          const container = document.querySelector(
            `#${containerId} .tei-column-scroll`,
          );
          container.appendChild(data);

          // 🔧 Build range spans NOW that the column has content
          decorateSpanRanges(container);

          const pbs = data.querySelectorAll("tei-pb");
          pbs.forEach((pb, i) => {
            const id = pb.getAttribute("xml:id") || `pb-${i + 1}`;
            const n = pb.getAttribute("n") || `Página ${i + 1}`;
            const facsName = n
              .replace(/\[|\]/g, "")
              .replace(/Fol\.?\s*/i, "fol")
              .replace(/\s/g, "")
              .toLowerCase();
            pb.setAttribute("id", id);

            if (!Array.from(pbSelector.options).some((o) => o.value === id)) {
              const opt = document.createElement("option");
              opt.value = id;
              opt.textContent = n;
              opt.dataset.facs = facsName;
              pbSelector.appendChild(opt);
            }
          });

          onComplete();
        });
      }

      // Load both TEI files
      loadTEI("EMN_dip.xml", "diplomatic-container", "pb-d", () => {
        diplomaticLoaded = true;
        checkReadyAndInit();
      });

      loadTEI("EMN_mod.xml", "modern-container", "pb-m", () => {
        modernLoaded = true;
        checkReadyAndInit();
        setTimeout(() => {
          filterReadings({ showAll: true });
          document.getElementById("variant-selector").value = "all";
          computeModernAnchors();
          // Rebuild ranges after the initial filter pass
          rebuildSpanRanges();
        }, 100);
      });

      document.getElementById("prev-folio").addEventListener("click", () => {
        if (pbSelector.selectedIndex > 0) {
          pbSelector.selectedIndex--;
          pbSelector.dispatchEvent(new Event("change"));
        }
      });
      document.getElementById("next-folio").addEventListener("click", () => {
        if (pbSelector.selectedIndex < pbSelector.options.length - 1) {
          pbSelector.selectedIndex++;
          pbSelector.dispatchEvent(new Event("change"));
        }
      });

      document
        .getElementById("variant-selector")
        .addEventListener("change", function () {
          handleVariantChange(this.value);
          computeModernAnchors();
          rebuildSpanRanges(); // variants can restructure content, so recompute ranges
        });

      document
        .getElementById("clean-text-button")
        .addEventListener("click", () => {
          document.body.classList.add("clean-mode");
          showCleanLemmasOnly();
          document.getElementById("variant-selector").value = "";
          computeModernAnchors();
          rebuildSpanRanges();
        });

      /* =========================
      🔎 SEARCH
      ========================= */
      let searchResults = [];
      let currentResultIndex = -1;

      function clearHighlights(container) {
        if (!container) return;
        const highlights = container.querySelectorAll(".search-highlight");
        highlights.forEach((span) => {
          const parent = span.parentNode;
          parent.replaceChild(document.createTextNode(span.textContent), span);
          parent.normalize();
        });
      }

      function clearAllSearch() {
        document.getElementById("search-input").value = "";
        clearHighlights(
          document.querySelector("#modern-container .tei-column-scroll"),
        );
        clearHighlights(
          document.querySelector("#diplomatic-container .tei-column-scroll"),
        );
        searchResults = [];
        currentResultIndex = -1;
        isSearchActive = false;
        isSyncing = false;
        if (searchSuspendTimer) clearTimeout(searchSuspendTimer);
      }

      function highlightText(container, query, results = [], scope) {
        clearHighlights(container);
        if (!query || !container) return [];
        const regex = new RegExp(
          query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi",
        );

        container.querySelectorAll("*:not(script):not(style)").forEach((node) => {
          Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType !== 3) return;
            const text = child.textContent || "";
            const matches = text.match(regex);
            if (!matches) return;

            const split = text.split(regex);
            const fragments = [];
            for (let i = 0; i < split.length; i++) {
              fragments.push(document.createTextNode(split[i]));
              if (i < split.length - 1) {
                const span = document.createElement("span");
                span.className = "search-highlight";
                span.textContent = matches[i];
                fragments.push(span);
                results.push({ el: span, scope });
              }
            }
            const parent = child.parentNode;
            fragments.forEach((f) => parent.insertBefore(f, child));
            parent.removeChild(child);
          });
        });
        return results;
      }

      function scrollToMatch(index) {
        if (!searchResults.length) return;
        if (index < 0) index = searchResults.length - 1;
        if (index >= searchResults.length) index = 0;
        currentResultIndex = index;

        searchResults.forEach((r) => r.el.classList.remove("active-match"));
        const match = searchResults[currentResultIndex].el;
        match.classList.add("active-match");

        const container = match.closest(".tei-column-scroll");
        if (!container) return;

        beginSearchSuspend();
        const cRect = container.getBoundingClientRect();
        const mRect = match.getBoundingClientRect();
        const offsetWithin = mRect.top - cRect.top + container.scrollTop;

        const behavior =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth";

        container.scrollTo({ top: Math.max(offsetWithin - 40, 0), behavior });

        if (typeof match.focus === "function")
          match.focus({ preventScroll: true });
        endSearchSuspendSoon();
      }

      function runSearch() {
        beginSearchSuspend();
        const query = document.getElementById("search-input").value.trim();
        const scopeChoice = document.getElementById("search-scope").value;

        const modern = document.querySelector(
          "#modern-container .tei-column-scroll",
        );
        const diplomatic = document.querySelector(
          "#diplomatic-container .tei-column-scroll",
        );

        clearHighlights(modern);
        clearHighlights(diplomatic);
        searchResults = [];
        currentResultIndex = -1;

        if (scopeChoice === "modern" || scopeChoice === "both") {
          searchResults.push(...highlightText(modern, query, [], "modern"));
        }
        if (scopeChoice === "diplomatic" || scopeChoice === "both") {
          searchResults.push(
            ...highlightText(diplomatic, query, [], "diplomatic"),
          );
        }

        if (searchResults.length > 0) {
          scrollToMatch(0);
        }
        endSearchSuspendSoon();
      }

      document
        .getElementById("search-button")
        .addEventListener("click", runSearch);
      document
        .getElementById("search-scope")
        .addEventListener("change", runSearch);

      document.getElementById("search-input").addEventListener("input", () => {
        if (document.getElementById("search-input").value.trim() === "") {
          clearAllSearch();
        }
      });

      document.getElementById("next-match").addEventListener("click", () => {
        if (searchResults.length === 0) return;
        scrollToMatch(currentResultIndex + 1);
      });
      document.getElementById("prev-match").addEventListener("click", () => {
        if (searchResults.length === 0) return;
        scrollToMatch(currentResultIndex - 1);
      });

      // close button handler
      document.getElementById("close-search").addEventListener("click", () => {
        document.getElementById("search-bar").classList.add("hidden");
        clearAllSearch();
      });

      // Escape key closes search too
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const bar = document.getElementById("search-bar");
          if (!bar.classList.contains("hidden")) {
            bar.classList.add("hidden");
            clearAllSearch();
          }
        }
      });

  };
</script>
