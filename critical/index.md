---
layout: critical
title: El marqués de las Navas – Edición Digital Académica
edition_label: Edición crítica · prototipo
---

<header id="sticky-header" class="critical-toolbar" aria-label="Herramientas de la edición crítica">
  <div class="critical-toolbar-title">
    <span class="critical-toolbar-eyebrow">Edición crítica</span>
  </div>

  <div id="floating-tools" class="critical-toolbar-actions">
    <label class="witness-picker" for="witness-select">
      <span>Cotejar con</span>
      <select id="witness-select">
        <option value="">Selecciona testimonio</option>
      </select>
    </label>
    <button
      id="open-witness-info-btn"
      class="tool-button tool-button-secondary icon-tool-button"
      type="button"
      aria-label="Información de los testimonios"
      title="Testimonios"
    >
      <svg class="tool-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 3.75h8.75a2 2 0 0 1 2 2V17.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.75a2 2 0 0 1 2-2Z"></path>
        <path d="M8.25 7h6.25M8.25 10h6.25M8.25 13h4.5"></path>
        <path d="M4.75 6.5H4a2 2 0 0 0-2 2v9.75a2 2 0 0 0 2 2h8.75"></path>
      </svg>
    </button>
    <button id="open-variants-btn" class="tool-button tool-button-secondary" type="button">
      Aparato
    </button>
    <button id="open-characters-btn" class="tool-button tool-button-secondary" type="button">
      Personajes
    </button>
  </div>
</header>

<div id="tei-wrapper" class="synoptic-view" data-comparison="closed">
  <section id="critical-pane" class="edition-pane critical-pane" aria-label="Texto crítico">
    <header class="pane-header pane-header-simple">
      <h1>Texto crítico</h1>
    </header>
    <div id="critical-container" class="tei-column critical-column">
      <div class="edition-loading" id="critical-loading" role="status">Cargando la edición…</div>
    </div>
  </section>

  <section id="witness-pane" class="edition-pane witness-pane hidden" aria-label="Testimonio comparado">
    <header class="pane-header pane-header-simple">
      <button id="witness-title" class="witness-title-button" type="button" aria-label="Ver información del testimonio">—</button>
      <button id="close-witness-btn" class="pane-close" type="button" aria-label="Cerrar comparación">
        Cerrar
      </button>
    </header>
    <div id="witness-container" class="tei-column witness-column"></div>
  </section>
</div>

<div id="witness-info-modal-wrapper" class="modal hidden">
  <div id="witness-info-modal" class="info-modal" role="dialog" aria-modal="true" aria-labelledby="witness-info-title">
    <button id="close-witness-info-btn" class="modal-close" type="button" aria-label="Cerrar">×</button>
    <h3 id="witness-info-title">Testimonios</h3>
    <div id="witness-info-content" class="witness-info-content"></div>
  </div>
</div>

<div id="variants-modal-wrapper" class="modal hidden">
  <div id="variants-modal" class="variants-modal" role="dialog" aria-modal="true" aria-labelledby="variants-title">
    <button id="close-variants-btn" class="modal-close" type="button" aria-label="Cerrar">×</button>
    <div class="variants-modal-heading">
      <div>
        <span class="variants-kicker">Edición crítica</span>
        <h3 id="variants-title">Aparato crítico</h3>
      </div>
      <span id="variants-scope" class="variants-scope"></span>
    </div>

    <div id="variants-summary" class="variants-summary" aria-label="Resumen de variantes"></div>

    <div class="variants-toolbar">
      <div id="variants-filters" class="variants-filters" role="group" aria-label="Filtrar variantes"></div>
      <span id="variants-result-count" class="variants-result-count"></span>
    </div>

    <div class="variants-layout">
      <div class="variants-list-panel">
        <div id="variants-list" class="variants-list"></div>
      </div>
      <aside class="variants-distribution-panel">
        <h4>Distribución por acto</h4>
        <div id="variants-distribution" class="variants-distribution"></div>
      </aside>
    </div>
  </div>
</div>

<div id="characters-modal-wrapper" class="modal hidden">
  <div id="characters-modal" class="characters-modal" role="dialog" aria-modal="true" aria-labelledby="characters-title">
    <button id="close-characters-btn" class="modal-close" type="button" aria-label="Cerrar">×</button>
    <div class="characters-modal-heading">
      <div>
        <span class="characters-kicker">Tradición textual</span>
        <h3 id="characters-title">Comparación de personajes</h3>
      </div>
      <span id="characters-scope" class="characters-scope"></span>
    </div>

    <div id="characters-summary" class="characters-summary"></div>

    <div class="characters-controls">
      <div class="characters-metric-toggle" role="group" aria-label="Métrica de comparación">
        <button type="button" class="characters-metric-btn is-active" data-character-metric="lines">Líneas</button>
        <button type="button" class="characters-metric-btn" data-character-metric="interventions">Intervenciones</button>
      </div>
      <label class="characters-differences-toggle">
        <input id="characters-only-differences" type="checkbox" checked>
        <span>Solo diferencias</span>
      </label>
    </div>

    <div class="characters-layout">
      <div class="characters-table-panel">
        <div id="characters-table"></div>
      </div>
      <aside class="characters-bars-panel">
        <h4>Diferencias de atribución</h4>
        <div id="attribution-changes" class="attribution-changes"></div>
      </aside>
    </div>

    <p class="characters-method-note">
      El texto crítico funciona como referencia. En los testimonios, «—» indica que el valor coincide con el texto crítico; cuando existe una diferencia se muestra el valor del testimonio y, entre paréntesis, su variación. Los versos partidos entre dos personajes se contabilizan en ambas intervenciones.
    </p>
  </div>
</div>

<script>
  // =========================
  // CETEI + setup di base
  // =========================
  const CETEIcean = new CETEI();
  CETEIcean.addBehaviors({
    tei: {
      anchor(el) {
        const span = document.createElement("span");
        const xmlID = el.getAttribute("xml:id");
        if (xmlID) span.setAttribute("data-xml-id", xmlID);
        return span;
      },
    },
  });

  let originalData, baseTEI;

  // =========================
  // Alias & utilità
  // =========================
  const speakerAliasMap = {
    1: "Luis",
    2: "Juan",
    MUSICO: "Asián",
    Músico: "Asián",
    "Fer.": "Filipe",
    Felipe: "Filipe",
  };

  function normalizeName(s) {
    if (!s) return "";
    const up = s
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return up
      .replace(/^(EL|LA|LOS|LAS)\s+/, "")
      .replace(/[^A-Z0-9#]+/g, " ")
      .trim();
  }
  function directChildren(el, tagName) {
    const t = tagName.toLowerCase();
    return Array.from(el.children).filter(
      (c) => c.tagName && c.tagName.toLowerCase() === t,
    );
  }

  function assignLocusIds(root) {
    root.querySelectorAll("tei-app").forEach((app, index) => {
      if (!app.dataset.locusId) {
        app.dataset.locusId = `locus-${String(index + 1).padStart(4, "0")}`;
      }
    });
  }

  function cleanReadingText(node) {
    return (node?.textContent || "").trim().replace(/\s+/g, " ");
  }

  function nearestVerseNumber(app) {
    const line = app.closest("tei-l");
    if (line?.getAttribute("n")) return line.getAttribute("n");

    let cursor = app;
    while (cursor) {
      const previous = cursor.previousElementSibling;
      if (previous) {
        const directN =
          previous.tagName?.toLowerCase() === "tei-l"
            ? previous.getAttribute("n")
            : null;
        if (directN) return directN;
        const nested = Array.from(previous.querySelectorAll?.("tei-l[n]") || []).at(-1);
        if (nested) return nested.getAttribute("n");
        cursor = previous;
        continue;
      }
      cursor = cursor.parentElement;
      if (!cursor || cursor.tagName?.toLowerCase() === "tei-body") break;
    }
    return "";
  }

  function actForNode(node) {
    const act = node.closest('tei-div[type="act"], tei-div[type="jornada"]');
    if (!act) return "Sin acto";
    const n = act.getAttribute("n");
    return n ? `Acto ${n}` : "Acto";
  }

  function verseRangeForApp(app, root) {
    const from = app.getAttribute("from");
    const to = app.getAttribute("to");
    if (!from || !to) return null;

    const resolveAnchor = (ref) => {
      const id = ref.replace(/^#/, "");
      return (
        root.querySelector(`tei-anchor[id="${CSS.escape(id)}"]`) ||
        root.querySelector(`tei-anchor[xml\\:id="${CSS.escape(id)}"]`) ||
        root.querySelector(`[data-xml-id="${CSS.escape(id)}"]`) ||
        root.querySelector(`#${CSS.escape(id)}`)
      );
    };

    const startAnchor = resolveAnchor(from);
    const endAnchor = resolveAnchor(to);
    if (!startAnchor || !endAnchor) return null;

    const numbers = [];
    let inRange = false;
    Array.from(root.querySelectorAll("*")).forEach((el) => {
      if (el === startAnchor) {
        inRange = true;
        return;
      }
      if (el === endAnchor) {
        inRange = false;
        return;
      }
      if (!inRange || el.tagName?.toLowerCase() !== "tei-l") return;
      const n = el.getAttribute("n");
      if (n) numbers.push(n);
    });

    if (!numbers.length) return null;
    const first = numbers[0];
    const last = numbers[numbers.length - 1];
    return {
      first,
      last,
      label: first === last ? `v. ${first}` : `vv. ${first}–${last}`,
    };
  }

  // =========================
  // Witness reconstruction
  // Inline apparatus is resolved recursively so nested <app> remains valid.
  // Long-span apparatus is left in place for the dedicated range decorators.
  // =========================
  function witnessTokens(value) {
    return (value || "")
      .trim()
      .split(/\s+/)
      .map((w) => w.replace(/^#/, ""))
      .filter(Boolean);
  }

  function readingMatchesWitness(reading, witID) {
    return witnessTokens(reading?.getAttribute("wit")).includes(
      (witID || "").replace(/^#/, ""),
    );
  }

  function cloneForWitness(node, witID) {
    if (node.nodeType === Node.TEXT_NODE) return node.cloneNode(true);
    if (node.nodeType !== Node.ELEMENT_NODE) return node.cloneNode(true);

    const tag = node.tagName.toLowerCase();

    // Resolve inline apparatus recursively. Range apparatus is handled later.
    if (tag === "tei-app" && !node.hasAttribute("from") && !node.hasAttribute("to")) {
      const rdgs = directChildren(node, "tei-rdg");
      const lemma = directChildren(node, "tei-lem")[0] || null;
      const matchingRdg = rdgs.find((rdg) =>
        readingMatchesWitness(rdg, witID),
      );
      const chosen = matchingRdg || lemma;
      const frag = document.createDocumentFragment();

      if (!chosen) return frag;
      Array.from(chosen.childNodes).forEach((child) => {
        frag.appendChild(cloneForWitness(child, witID));
      });
      return frag;
    }

    // <add> belongs to the selected reading: keep the added text, but mark
    // added verse lines so the comparison can distinguish them from the base text.
    if (tag === "tei-add") {
      const frag = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => {
        const cloned = cloneForWitness(child, witID);
        if (
          cloned?.nodeType === Node.ELEMENT_NODE &&
          cloned.tagName?.toLowerCase() === "tei-l"
        ) {
          cloned.setAttribute("data-witness-addition", "true");
        }
        frag.appendChild(cloned);
      });
      return frag;
    }

    const copy = node.cloneNode(false);
    Array.from(node.childNodes).forEach((child) => {
      copy.appendChild(cloneForWitness(child, witID));
    });
    return copy;
  }

  function reconstructWitness(witID, originalData) {
    const clone = originalData.cloneNode(true);

    // Preserve cast information when reconstructing an act fragment.
    if (
      !clone.querySelector("tei-castList") &&
      originalData.querySelector("tei-castList")
    ) {
      const cast = originalData.querySelector("tei-castList").cloneNode(true);
      clone.insertBefore(cast, clone.firstChild);
    }

    const resolveAnchor = (ctx, ref) => {
      const id = (ref || "").replace(/^#/, "");
      return (
        ctx.querySelector(`tei-anchor[id="${CSS.escape(id)}"]`) ||
        ctx.querySelector(`tei-anchor[xml\\:id="${CSS.escape(id)}"]`) ||
        ctx.querySelector(`[data-xml-id="${CSS.escape(id)}"]`) ||
        ctx.querySelector(`#${CSS.escape(id)}`) ||
        ctx.querySelector(`[id="${CSS.escape(id)}"]`)
      );
    };

    // Long-span omissions: mark the affected lines for the selected witness.
    clone
      .querySelectorAll('tei-app[from][to]:not([type="addition"])')
      .forEach((app) => {
        const omittedForThisWit = directChildren(app, "tei-rdg").some(
          (rdg) =>
            readingMatchesWitness(rdg, witID) &&
            rdg.textContent.trim() === "",
        );
        if (omittedForThisWit) {
          const startAnchor = resolveAnchor(clone, app.getAttribute("from"));
          const endAnchor = resolveAnchor(clone, app.getAttribute("to"));

          if (startAnchor && endAnchor) {
            const all = Array.from(clone.querySelectorAll("*"));
            let inRange = false;
            const affected = [];
            for (const el of all) {
              if (el === startAnchor) {
                inRange = true;
                continue;
              }
              if (el === endAnchor) break;
              const tag = el.tagName?.toLowerCase();
              if (inRange && (tag === "tei-l" || tag === "tei-speaker")) {
                affected.push(el);
              }
            }

            const affectedLines = affected.filter(
              (el) => el.tagName?.toLowerCase() === "tei-l",
            );
            const includesSpeaker = affected.some(
              (el) => el.tagName?.toLowerCase() === "tei-speaker",
            );
            const omissionLabel =
              affectedLines.length === 1
                ? "verso omitido"
                : includesSpeaker
                  ? "pasaje omitido"
                  : "versos omitidos";

            affected.forEach((el) => {
              const tag = el.tagName?.toLowerCase();
              while (el.firstChild) el.removeChild(el.firstChild);

              if (tag === "tei-l") {
                el.setAttribute("data-witness-omitted", "true");

                const wrap = document.createElement("span");
                wrap.className = "omission-placeholder-wrap";

                const placeholder = document.createElement("span");
                placeholder.className = "omission-placeholder";
                placeholder.textContent = "[...........................................]";
                wrap.appendChild(placeholder);

                if (el === affectedLines[0]) {
                  const label = document.createElement("span");
                  label.className = "omission-kind-label";
                  label.textContent = omissionLabel;
                  wrap.appendChild(label);
                }

                el.appendChild(wrap);
              } else if (tag === "tei-speaker") {
                const slot = document.createElement("span");
                slot.className = "speaker-alignment-slot";
                slot.setAttribute("aria-hidden", "true");
                slot.innerHTML = "&nbsp;";
                el.appendChild(slot);
              }
            });
          }
        }

        // A reconstructed witness should not retain critical range apparatus.
        app.remove();
      });

    // Resolve only outermost inline apparatus. Nested apparatus is resolved
    // recursively by cloneForWitness(), preventing descendant <rdg> leakage.
    const inlineApps = Array.from(
      clone.querySelectorAll("tei-app:not([from]):not([to])"),
    ).filter(
      (app) =>
        !app.parentElement?.closest("tei-app:not([from]):not([to])"),
    );

    inlineApps.forEach((app) => {
      const resolved = cloneForWitness(app, witID);
      const parentL = app.closest("tei-l");
      const isWholeLine =
        parentL && parentL.textContent.trim() === app.textContent.trim();
      const resolvedText = (resolved.textContent || "").trim();

      if (!resolvedText && isWholeLine) {
        const wrap = document.createElement("span");
        wrap.className = "omission-placeholder-wrap";

        const placeholder = document.createElement("span");
        placeholder.className = "omission-placeholder";
        placeholder.textContent = "[...........................................]";

        const label = document.createElement("span");
        label.className = "omission-kind-label";
        label.textContent = "verso omitido";

        wrap.append(placeholder, label);
        parentL?.setAttribute("data-witness-omitted", "true");
        app.replaceWith(wrap);
      } else {
        app.replaceWith(resolved);
      }
    });

    return clone;
  }

  // =========================
  // Notes
  // =========================
  function decorateNotes(data) {
    data.querySelectorAll("tei-note, note").forEach((originalNote) => {
      const content = originalNote.textContent.trim();
      const wrapper = document.createElement("span");
      wrapper.className = "tei-note";
      const icon = document.createElement("sup");
      icon.className = "note-icon";
      icon.textContent = "❋";
      const tooltip = document.createElement("div");
      tooltip.className = "note-tooltip";
      tooltip.textContent = content;
      wrapper.append(icon, tooltip);
      originalNote.replaceWith(wrapper);
    });
  }
  function attachNoteEvents(container = document) {
    const notes = container.querySelectorAll(".tei-note");
    notes.forEach((note) => {
      const icon = note.querySelector(".note-icon");
      if (!icon || icon.__noteBound) return;
      icon.__noteBound = true;
      icon.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".tei-note.active").forEach((n) => {
          if (n !== note) n.classList.remove("active");
        });
        note.classList.toggle("active");
      });
    });

    if (!window.__noteClickAwayBound) {
      document.addEventListener("click", () => {
        document
          .querySelectorAll(".tei-note.active")
          .forEach((n) => n.classList.remove("active"));
      });
      window.__noteClickAwayBound = true;
    }
  }

  // =========================
  // Verse coordinates and displayed numbering
  // =========================
  function insertLeftAlignedLineNumbers(root, { mode = "critical" } = {}) {
    root.querySelectorAll("tei-l, l").forEach((line) => {
      if (line.querySelector(":scope > .line-container")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "line-container";

      const lineNum = document.createElement("span");
      lineNum.className = "line-number";
      lineNum.setAttribute("aria-hidden", "true");

      // Critical numbering comes from @n. Witness numbering is assigned later,
      // after omissions/additions have been resolved.
      if (mode === "critical") {
        const num = line.getAttribute("n");
        if (num && parseInt(num, 10) % 5 === 0) lineNum.textContent = num;
      }

      const lineText = document.createElement("span");
      lineText.className = "line-text";
      while (line.firstChild) lineText.appendChild(line.firstChild);

      wrapper.append(lineText, lineNum);
      line.appendChild(wrapper);
    });
  }

  // Stable critical coordinate used only for alignment/synchronisation.
  // M/F fragments inherit the @n of the first fragment of the split verse.
  function assignLogicalLineNumbers(root) {
    let currentVerse = null;
    root.querySelectorAll("tei-l, l").forEach((line) => {
      const own = line.getAttribute("n");
      const part = line.getAttribute("part");

      if (own) currentVerse = own;
      const logical =
        own || ((part === "M" || part === "F") ? currentVerse : null);

      if (logical) {
        line.classList.add(`line-n-${logical}`);
        line.setAttribute("data-line-n", logical);
        line.setAttribute("data-critical-n", logical);
        line.setAttribute("data-sync-key", `v-${logical}`);
      } else if (line.hasAttribute("data-witness-addition") && currentVerse) {
        line.setAttribute("data-critical-anchor", currentVerse);
        line.setAttribute("data-sync-key", `add-after-${currentVerse}`);
      }
    });
  }

  // Displayed numbering for a reconstructed witness.
  // It counts only verses actually present in that witness:
  // omitted verses do not count, additions do, and I/M/F fragments count once.
  function assignWitnessLineNumbers(root) {
    let localNumber = 0;
    let previousPresentLine = null;

    root.querySelectorAll("tei-l, l").forEach((line) => {
      const numberEl = line.querySelector(":scope > .line-container > .line-number");
      if (numberEl) numberEl.textContent = "";

      const omitted =
        line.hasAttribute("data-witness-omitted") ||
        !!line.querySelector(".omission-placeholder, .placeholder-block");
      if (omitted) {
        line.setAttribute("data-witness-omitted", "true");
        line.removeAttribute("data-witness-n");
        previousPresentLine = null;
        return;
      }

      const part = line.getAttribute("part");
      const previousPart = previousPresentLine?.getAttribute("part");
      const continuesSplitVerse =
        (part === "M" || part === "F") &&
        previousPresentLine &&
        (previousPart === "I" || previousPart === "M") &&
        previousPresentLine.hasAttribute("data-witness-n");

      if (!continuesSplitVerse) localNumber += 1;

      const witnessNumber = continuesSplitVerse
        ? previousPresentLine.getAttribute("data-witness-n")
        : String(localNumber);

      line.setAttribute("data-witness-n", witnessNumber);

      // As in the critical text, print a number every five verses, once per verse.
      if (
        numberEl &&
        !continuesSplitVerse &&
        localNumber % 5 === 0
      ) {
        numberEl.textContent = String(localNumber);
      }

      previousPresentLine = line;
    });
  }

  function alignSplitVerses(root) {
    const lines = Array.from(root.querySelectorAll("tei-l, l"));

    // The function can be called again after a pane/layout change.
    // Always clear the previous calculation first.
    lines.forEach((line) => {
      const text = line.querySelector(".line-text");
      if (!text) return;
      text.style.removeProperty("--split-indent");
      line.removeAttribute("data-split-indent");
    });

    lines.forEach((line, index) => {
      const part = line.getAttribute("part");
      const text = line.querySelector(".line-text");
      if (!part || !text) return;

      const prev = lines[index - 1];
      const prevPart = prev?.getAttribute("part");
      const prevText = prev?.querySelector(".line-text");
      const continuesPrevious =
        (part === "M" && prevPart === "I") ||
        (part === "F" && (prevPart === "M" || prevPart === "I"));

      if (!continuesPrevious || !prevText) return;

      // .line-text is content-sized, so this is the width of the preceding
      // fragment itself (including an earlier split indent), not the grid cell.
      const indent = Math.max(0, prevText.getBoundingClientRect().width);
      text.style.setProperty("--split-indent", `${indent}px`);
      line.setAttribute("data-split-indent", String(Math.round(indent)));
    });
  }

  // =========================
  // Inline apparatus
  // Decorate deepest apparatus first so nested variants keep their structure.
  // =========================
  function decorateApparatus(data) {
    const depthOf = (el) => {
      let depth = 0;
      let current = el.parentElement;
      while (current) {
        depth += 1;
        current = current.parentElement;
      }
      return depth;
    };

    const apps = Array.from(
      data.querySelectorAll("tei-app:not([from]):not([to])"),
    ).sort((a, b) => depthOf(b) - depthOf(a));

    if (!data.__apparatusClickAwayBound) {
      document.addEventListener(
        "click",
        () => {
          data.querySelectorAll(".lem-apparatus.active").forEach((el) => {
            el.classList.remove("active");
            el.querySelector(":scope > .app-tooltip")?.style.setProperty(
              "display",
              "none",
            );
            el.setAttribute("aria-expanded", "false");
          });
        },
        { passive: true },
      );
      data.__apparatusClickAwayBound = true;
    }

    apps.forEach((app) => {
      // It may already have been removed with an enclosing apparatus.
      if (!app.isConnected && !data.contains(app)) return;

      const rdgs = directChildren(app, "tei-rdg");
      const lemma = directChildren(app, "tei-lem")[0] || null;
      const isAddition = rdgs.some(
        (rdg) => directChildren(rdg, "tei-add").length > 0,
      );
      if (isAddition || !lemma) return;

      const wrapper = document.createElement("span");
      wrapper.className = "lem-wrapper lem-apparatus";
      if (app.dataset.locusId) wrapper.dataset.locusId = app.dataset.locusId;
      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("aria-haspopup", "true");
      wrapper.setAttribute("aria-expanded", "false");

      // Move the lemma content instead of flattening textContent.
      // If a nested <app> has already been decorated, its interactive wrapper
      // is preserved here.
      while (lemma.firstChild) wrapper.appendChild(lemma.firstChild);

      const tooltip = document.createElement("span");
      tooltip.className = "app-tooltip";
      tooltip.style.display = "none";
      tooltip.setAttribute("role", "listbox");

      rdgs.forEach((rdg) => {
        const entry = document.createElement("span");
        entry.className = "apparatus-entry";
        entry.setAttribute("role", "option");

        const rdgSpan = document.createElement("span");
        rdgSpan.className = "rdg-text";
        rdgSpan.textContent = rdg.textContent.trim() || "om.";

        const witSpan = document.createElement("span");
        witSpan.className = "witness-label";
        witSpan.textContent = rdg.getAttribute("wit") || "";

        entry.append(rdgSpan, witSpan);
        tooltip.append(entry);
      });

      wrapper.append(tooltip);

      const toggle = (e) => {
        e.stopPropagation();
        data.querySelectorAll(".lem-apparatus.active").forEach((el) => {
          if (el !== wrapper) {
            el.classList.remove("active");
            el.querySelector(":scope > .app-tooltip")?.style.setProperty(
              "display",
              "none",
            );
            el.setAttribute("aria-expanded", "false");
          }
        });
        const open = !wrapper.classList.contains("active");
        wrapper.classList.toggle("active", open);
        tooltip.style.display = open ? "block" : "none";
        wrapper.setAttribute("aria-expanded", String(open));
      };

      wrapper.addEventListener("click", toggle);
      wrapper.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(e);
        }
      });

      app.replaceWith(wrapper);
    });
  }

  // Rende cliccabili le sigle dei testimoni nell’apparato (chip)
  function makeApparatusSiglaClickable(scope = document) {
    scope.querySelectorAll(".witness-label").forEach((lbl) => {
      if (lbl.__chipsified) return; // evita doppio lavoro
      const wits = (lbl.textContent || "")
        .trim()
        .split(/\s+/)
        .map((w) => w.replace(/^#/, ""))
        .filter(Boolean);

      lbl.__chipsified = true;
      lbl.textContent = "";
      wits.forEach((w) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "wit-chip";
        chip.dataset.wit = w;
        chip.textContent = w;
        lbl.appendChild(chip);
      });
    });
  }

  // =========================
  // Long-span omissions in the critical text
  // Keep the critical reading untouched; mark the range discreetly.
  // =========================
  function decorateOmissionSpans(root, inWitnessView = false) {
    if (inWitnessView) return;

    const apps = root.querySelectorAll(
      'tei-app[from][to]:not([type="addition"])',
    );

    const resolveAnchor = (ref) => {
      const id = (ref || "").replace(/^#/, "");
      let el =
        root.querySelector(`tei-anchor[id="${CSS.escape(id)}"]`) ||
        root.querySelector(`tei-anchor[xml\\:id="${CSS.escape(id)}"]`);
      if (!el) {
        const inner = root.querySelector(`[data-xml-id="${CSS.escape(id)}"]`);
        if (inner) el = inner.closest("tei-anchor") || inner;
      }
      if (!el) {
        el =
          root.querySelector(`#${CSS.escape(id)}`) ||
          root.querySelector(`[id="${CSS.escape(id)}"]`);
      }
      return el;
    };

    apps.forEach((app) => {
      const fromRef = app.getAttribute("from");
      const toRef = app.getAttribute("to");
      if (!fromRef || !toRef) return;

      const omittedWits = new Set();
      directChildren(app, "tei-rdg").forEach((rdg) => {
        if (!rdg.textContent || rdg.textContent.trim() === "") {
          witnessTokens(rdg.getAttribute("wit")).forEach((w) =>
            omittedWits.add(w),
          );
        }
      });
      if (omittedWits.size === 0) {
        app.remove();
        return;
      }

      const startAnchor = resolveAnchor(fromRef);
      const endAnchor = resolveAnchor(toRef);
      if (!startAnchor || !endAnchor) return;

      const all = Array.from(root.querySelectorAll("*"));
      let inRange = false;
      const affectedElements = [];

      for (const el of all) {
        if (el === startAnchor) {
          inRange = true;
          continue;
        }
        if (el === endAnchor) break;
        const tag = el.tagName?.toLowerCase();
        if (inRange && (tag === "tei-l" || tag === "tei-speaker")) {
          affectedElements.push(el);
        }
      }

      const affectedLines = affectedElements.filter(
        (el) => el.tagName?.toLowerCase() === "tei-l",
      );

      if (affectedLines.length) {
        const sigla = Array.from(omittedWits);
        const includesSpeaker = affectedElements.some(
          (el) => el.tagName?.toLowerCase() === "tei-speaker",
        );
        const omissionLabel =
          affectedLines.length === 1
            ? "Verso omitido"
            : includesSpeaker
              ? "Pasaje omitido"
              : "Versos omitidos";

        affectedLines.forEach((line, index) => {
          line.classList.add("critical-omission-range");
          if (index === 0) line.classList.add("omission-range-start");
          if (index === affectedLines.length - 1) {
            line.classList.add("omission-range-end");
          }
          line.dataset.omittedIn = sigla.join(" ");
          if (app.dataset.locusId) {
            const loci = new Set(
              (line.dataset.omissionLoci || "").split(/\s+/).filter(Boolean),
            );
            loci.add(app.dataset.locusId);
            line.dataset.omissionLoci = Array.from(loci).join(" ");
          }
        });

        const first = affectedLines[0];
        const marker = document.createElement("button");
        marker.type = "button";
        marker.className = "transmission-note omission-note";
        if (app.dataset.locusId) marker.dataset.locusId = app.dataset.locusId;
        marker.setAttribute(
          "aria-label",
          `${omissionLabel} en ${sigla.join(", ")}`,
        );
        marker.textContent = "om.";

        const tooltip = document.createElement("span");
        tooltip.className = "transmission-tooltip";
        tooltip.textContent = `${omissionLabel} en: ${sigla.join(", ")}`;
        marker.appendChild(tooltip);

        marker.addEventListener("click", (e) => {
          e.stopPropagation();
          marker.classList.toggle("active");
        });

        first.appendChild(marker);
      }

      app.remove();
    });
  }

  // =========================
  // Aggiunte long-span (funzione unificata)
  // mode: "base" | "witness"
  // =========================
  function processAdditionSpans(root, { mode = "base", witID = null } = {}) {
    const apps = root.querySelectorAll(`tei-app[type="addition"][from][to]`);

    const anchorIn = (ctx, ref) => {
      const id = (ref || "").replace(/^#/, "");
      return ctx.querySelector(
        `tei-anchor[id="${CSS.escape(id)}"], tei-anchor[xml\\:id="${CSS.escape(
          id,
        )}"], [data-xml-id="${CSS.escape(id)}"], #${CSS.escape(id)}`,
      );
    };

    apps.forEach((app) => {
      const from = app.getAttribute("from");
      const to = app.getAttribute("to");
      if (!from || !to) return;

      const startAnchor = anchorIn(root, from);
      const endAnchor = anchorIn(root, to);
      if (!startAnchor || !endAnchor) return;

      const rdgs = directChildren(app, "tei-rdg");
      const witsWithAdd = rdgs
        .filter((rdg) => rdg.querySelector("tei-add"))
        .flatMap((rdg) => (rdg.getAttribute("wit") || "").trim().split(/\s+/))
        .map((w) => w.replace(/^#/, ""))
        .filter(Boolean);

      const range = document.createRange();
      range.setStartAfter(startAnchor);
      range.setEndBefore(endAnchor);

      if (mode === "base") {
        range.deleteContents();
        const wrapper = document.createElement("span");
        wrapper.className = "addition-marker-wrapper";
        if (app.dataset.locusId) wrapper.dataset.locusId = app.dataset.locusId;
        const marker = document.createElement("span");
        marker.className = "addition-marker";
        marker.textContent = "✚";
        const tooltip = document.createElement("span");
        tooltip.className = "addition-tooltip";
        tooltip.textContent = witsWithAdd.length
          ? `Se añade un pasaje en: #${witsWithAdd.join(", ")}`
          : `Se añade un pasaje en algunos testigos`;
        wrapper.append(marker, tooltip);
        startAnchor.parentNode.insertBefore(wrapper, startAnchor.nextSibling);
        app.remove();
        range.detach?.();
        return;
      }

      if (mode === "witness") {
        const wanted = (witID || "").replace(/^#/, "");
        const match = rdgs.find((rdg) =>
          (rdg.getAttribute("wit") || "")
            .split(/\s+/)
            .map((w) => w.replace(/^#/, ""))
            .includes(wanted),
        );
        const hasAddForWit = !!(match && match.querySelector("tei-add"));

        const frag = range.extractContents();

        if (hasAddForWit) {
          const wrapper = document.createElement("div");
          wrapper.className = "witness-addition";
          wrapper.appendChild(frag);
          startAnchor.parentNode.insertBefore(wrapper, startAnchor.nextSibling);
        } // else: omissione nel testimone → non reinseriamo (sparisce)

        app.remove();
        range.detach?.();
        return;
      }
    });
  }

  // =========================
  // Inline added verses in witnesses
  // In the critical text create a neutral alignment slot.
  // =========================
  function decorateInlineAdditionsWithoutAnchors(root) {
    const apps = Array.from(
      root.querySelectorAll("tei-app:not([from]):not([to])"),
    ).filter((app) => app.querySelector("tei-rdg tei-add") !== null);

    apps.forEach((app) => {
      const witSet = new Set();
      directChildren(app, "tei-rdg").forEach((rdg) => {
        if (rdg.querySelector("tei-add")) {
          witnessTokens(rdg.getAttribute("wit")).forEach((w) => witSet.add(w));
        }
      });

      // Find the nearest preceding numbered critical verse.
      let previousN = null;
      let cursor = app.previousElementSibling;
      while (cursor && !previousN) {
        if (cursor.tagName?.toLowerCase() === "tei-l" && cursor.getAttribute("n")) {
          previousN = cursor.getAttribute("n");
          break;
        }
        const nested = cursor.querySelector?.("tei-l[n]:last-of-type");
        if (nested) previousN = nested.getAttribute("n");
        cursor = cursor.previousElementSibling;
      }

      if (!previousN) {
        const parent = app.closest("tei-sp, tei-div");
        const preceding = parent
          ? Array.from(parent.querySelectorAll("tei-l[n]")).filter(
              (line) =>
                line.compareDocumentPosition(app) &
                Node.DOCUMENT_POSITION_FOLLOWING,
            )
          : [];
        previousN = preceding.at(-1)?.getAttribute("n") || "";
      }

      const slot = document.createElement("div");
      slot.className = "transmission-slot addition-slot";
      if (app.dataset.locusId) slot.dataset.locusId = app.dataset.locusId;
      slot.dataset.additionWits = Array.from(witSet).join(" ");
      if (previousN) {
        slot.dataset.additionAfter = previousN;
        slot.dataset.syncKey = `add-after-${previousN}`;
      }

      const body = document.createElement("span");
      body.className = "transmission-slot-body";

      const sign = document.createElement("span");
      sign.className = "transmission-sign";
      sign.textContent = "+";

      const label = document.createElement("span");
      label.className = "transmission-label";
      label.textContent = `Verso añadido en ${Array.from(witSet).join(", ")}`;

      body.append(sign, label);
      slot.append(body);
      app.replaceWith(slot);
    });
  }

  function updateCriticalAdditionSlots(witID = null) {
    const critical = document.getElementById("critical-container");
    if (!critical) return;

    const wanted = (witID || "").replace(/^#/, "");
    critical.querySelectorAll(".addition-slot").forEach((slot) => {
      const wits = witnessTokens(slot.dataset.additionWits);
      slot.classList.remove("is-alignment-active", "is-suppressed");

      if (!wanted) return;
      if (wits.includes(wanted)) slot.classList.add("is-alignment-active");
      else slot.classList.add("is-suppressed");
    });
  }

  // =========================
  // Hover sync linee (robusta)
  // =========================
  function enableLineSyncHighlighting() {
    if (window.__syncHLBound) return;
    const scope = document.getElementById("tei-wrapper") || document;

    const getSyncNode = (node) =>
      node ? node.closest?.("[data-sync-key]") : null;
    const highlight = (key) =>
      document
        .querySelectorAll(`[data-sync-key="${CSS.escape(key)}"]`)
        .forEach((el) => el.classList.add("line-highlight"));
    const unhighlight = (key) =>
      document
        .querySelectorAll(`[data-sync-key="${CSS.escape(key)}"]`)
        .forEach((el) => el.classList.remove("line-highlight"));

    scope.addEventListener("pointerover", (e) => {
      const to = getSyncNode(e.target);
      if (!to) return;
      const from = getSyncNode(e.relatedTarget);
      const key = to.getAttribute("data-sync-key");
      if (from && from.getAttribute("data-sync-key") === key) return;
      highlight(key);
    });

    scope.addEventListener("pointerout", (e) => {
      const from = getSyncNode(e.target);
      if (!from) return;
      const to = getSyncNode(e.relatedTarget);
      const key = from.getAttribute("data-sync-key");
      if (to && to.getAttribute("data-sync-key") === key) return;
      unhighlight(key);
    });

    window.__syncHLBound = true;
  }

  // =========================
  // Variant explorer
  // =========================
  const variantFilterLabels = {
    todos: "Todos",
    texto: "Texto",
    acotaciones: "Acotaciones",
    interlocutores: "Interlocutores",
    omisiones: "Omisiones",
    adiciones: "Adiciones",
  };

  function clearNode(node) {
    while (node?.firstChild) node.removeChild(node.firstChild);
  }

  function extractWitnessSigla(data) {
    const siglaSet = new Set();
    data.querySelectorAll("tei-rdg[wit], tei-lem[wit]").forEach((reading) => {
      witnessTokens(reading.getAttribute("wit")).forEach((wit) =>
        siglaSet.add(wit),
      );
    });
    return Array.from(siglaSet).sort();
  }

  function locusTags(app) {
    const tags = new Set();
    const rdgs = directChildren(app, "tei-rdg");
    const hasAddition =
      app.getAttribute("type") === "addition" ||
      rdgs.some((rdg) => !!rdg.querySelector("tei-add"));
    const hasOmission = rdgs.some((rdg) => cleanReadingText(rdg) === "");

    if (hasAddition) tags.add("adiciones");
    if (hasOmission) tags.add("omisiones");
    if (app.closest("tei-stage")) tags.add("acotaciones");
    else if (app.closest("tei-speaker")) tags.add("interlocutores");
    else tags.add("texto");

    return Array.from(tags);
  }

  function buildVariantInventory(root) {
    return Array.from(root.querySelectorAll("tei-app")).map((app) => {
      const lemma = directChildren(app, "tei-lem")[0] || null;
      const readings = directChildren(app, "tei-rdg").map((rdg) => ({
        text: cleanReadingText(rdg) || "om.",
        witnesses: witnessTokens(rdg.getAttribute("wit")),
      }));
      const lemmaWitnesses = witnessTokens(lemma?.getAttribute("wit"));
      const allWitnesses = new Set(lemmaWitnesses);
      readings.forEach((reading) =>
        reading.witnesses.forEach((wit) => allWitnesses.add(wit)),
      );

      const verse = nearestVerseNumber(app);
      const stage = app.closest("tei-stage");
      const speaker = app.closest("tei-speaker");
      const tags = locusTags(app);
      const verseRange = verseRangeForApp(app, root);
      const reference = verseRange?.label
        || (verse
          ? `v. ${verse}`
          : stage
            ? "Acotación"
            : speaker
              ? "Interlocutor"
              : actForNode(app));

      return {
        id: app.dataset.locusId,
        tags,
        act: actForNode(app),
        verse: verseRange?.first || verse,
        verseRange,
        reference,
        lemma: cleanReadingText(lemma) || (tags.includes("adiciones") ? "∅" : ""),
        lemmaWitnesses,
        readings,
        witnesses: Array.from(allWitnesses),
      };
    });
  }

  function locusDiffersForWitness(locus, witID) {
    const wanted = (witID || "").replace(/^#/, "");
    if (!wanted) return true;
    return locus.readings.some((reading) =>
      reading.witnesses.includes(wanted),
    );
  }

  function readingsForScope(locus, witID) {
    const wanted = (witID || "").replace(/^#/, "");
    if (!wanted) return locus.readings;
    return locus.readings.filter((reading) =>
      reading.witnesses.includes(wanted),
    );
  }

  function shortened(text, max = 170) {
    const clean = (text || "").trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max - 1).trimEnd()}…`;
  }

  function countVariantTags(loci) {
    const counts = {
      todos: loci.length,
      texto: 0,
      acotaciones: 0,
      interlocutores: 0,
      omisiones: 0,
      adiciones: 0,
    };
    loci.forEach((locus) => {
      locus.tags.forEach((tag) => {
        if (tag in counts) counts[tag] += 1;
      });
    });
    return counts;
  }

  function renderVariantSummary(loci) {
    const summary = document.getElementById("variants-summary");
    if (!summary) return;
    clearNode(summary);

    const counts = countVariantTags(loci);
    [
      ["Loci", counts.todos],
      ["Omisiones", counts.omisiones],
      ["Adiciones", counts.adiciones],
      ["Acotaciones", counts.acotaciones],
      ["Interlocutores", counts.interlocutores],
    ].forEach(([label, value]) => {
      const card = document.createElement("div");
      card.className = "variant-summary-card";

      const number = document.createElement("strong");
      number.textContent = String(value);
      const caption = document.createElement("span");
      caption.textContent = label;

      card.append(number, caption);
      summary.appendChild(card);
    });
  }

  function renderVariantDistribution(loci) {
    const container = document.getElementById("variants-distribution");
    if (!container) return;
    clearNode(container);

    const counts = new Map();
    loci.forEach((locus) =>
      counts.set(locus.act, (counts.get(locus.act) || 0) + 1),
    );

    const entries = Array.from(counts.entries());
    const max = Math.max(1, ...entries.map(([, count]) => count));

    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "variants-empty";
      empty.textContent = "No hay loci para este filtro.";
      container.appendChild(empty);
      return;
    }

    entries.forEach(([act, count]) => {
      const row = document.createElement("div");
      row.className = "distribution-row";

      const head = document.createElement("div");
      head.className = "distribution-head";
      const label = document.createElement("span");
      label.textContent = act;
      const value = document.createElement("strong");
      value.textContent = String(count);
      head.append(label, value);

      const track = document.createElement("div");
      track.className = "distribution-track";
      const bar = document.createElement("span");
      bar.className = "distribution-bar";
      bar.style.width = `${(count / max) * 100}%`;
      track.appendChild(bar);

      row.append(head, track);
      container.appendChild(row);
    });
  }

  function openCriticalLocus(locus) {
    const modal = document.getElementById("variants-modal-wrapper");
    modal?.classList.add("hidden");

    const omissionLines = Array.from(
      document.querySelectorAll("#critical-container [data-omission-loci]"),
    ).filter((line) =>
      (line.dataset.omissionLoci || "")
        .split(/\s+/)
        .includes(locus.id),
    );

    let target =
      omissionLines[0] ||
      document.querySelector(
        `#critical-container [data-locus-id="${CSS.escape(locus.id)}"]`,
      );

    if (!target && locus.verse) {
      target = document.querySelector(
        `#critical-container [data-critical-n="${CSS.escape(locus.verse)}"]`,
      );
    }
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });

    const highlightTargets = omissionLines.length ? omissionLines : [target];
    highlightTargets.forEach((el) => el.classList.remove("flash-highlight"));
    requestAnimationFrame(() => {
      highlightTargets.forEach((el) => el.classList.add("flash-highlight"));
      setTimeout(
        () =>
          highlightTargets.forEach((el) =>
            el.classList.remove("flash-highlight"),
          ),
        1800,
      );
    });

    const interactiveTarget =
      target.matches?.("[data-locus-id]")
        ? target
        : target.querySelector?.(
            `[data-locus-id="${CSS.escape(locus.id)}"]`,
          );

    if (interactiveTarget?.classList.contains("lem-apparatus")) {
      setTimeout(() => {
        if (!interactiveTarget.classList.contains("active")) {
          interactiveTarget.click();
        }
      }, 350);
    } else if (interactiveTarget?.classList.contains("transmission-note")) {
      setTimeout(() => interactiveTarget.click(), 350);
    }
  }

  function renderVariantList(loci, witID) {
    const list = document.getElementById("variants-list");
    const count = document.getElementById("variants-result-count");
    if (!list) return;
    clearNode(list);
    if (count) count.textContent = `${loci.length} loci`;

    if (!loci.length) {
      const empty = document.createElement("p");
      empty.className = "variants-empty";
      empty.textContent = "No hay variantes para este criterio.";
      list.appendChild(empty);
      return;
    }

    loci.forEach((locus) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "variant-locus-item";
      item.dataset.locusId = locus.id;

      const meta = document.createElement("span");
      meta.className = "variant-locus-meta";

      const reference = document.createElement("strong");
      reference.textContent = `${locus.act} · ${locus.reference}`;

      const badges = document.createElement("span");
      badges.className = "variant-locus-badges";
      locus.tags.forEach((tag) => {
        const badge = document.createElement("span");
        badge.className = `variant-type-badge variant-type-${tag}`;
        badge.textContent = variantFilterLabels[tag] || tag;
        badges.appendChild(badge);
      });
      meta.append(reference, badges);

      const reading = document.createElement("span");
      reading.className = "variant-locus-reading";

      const lemma = document.createElement("span");
      lemma.className = "variant-locus-lemma";

      const arrow = document.createElement("span");
      arrow.className = "variant-reading-arrow";
      arrow.textContent = "→";

      const rdgs = readingsForScope(locus, witID);
      const variants = document.createElement("span");
      variants.className = "variant-locus-rdgs";

      if (locus.tags.includes("omisiones") && locus.verseRange) {
        lemma.textContent = locus.verseRange.label;
        variants.textContent = witID
          ? "omitido"
          : `omitido [${rdgs.flatMap((rdg) => rdg.witnesses).join(" ")}]`;
      } else {
        lemma.textContent = shortened(locus.lemma || "∅");
        variants.textContent = rdgs.length
          ? rdgs
              .map((rdg) => {
                const sigla = witID ? "" : ` [${rdg.witnesses.join(" ")}]`;
                return `${shortened(rdg.text)}${sigla}`;
              })
              .join(" · ")
          : "—";
      }

      reading.append(lemma, arrow, variants);
      item.append(meta, reading);
      item.addEventListener("click", () => openCriticalLocus(locus));
      list.appendChild(item);
    });
  }

  function setupVariantExplorer(inventory) {
    const openBtn = document.getElementById("open-variants-btn");
    const closeBtn = document.getElementById("close-variants-btn");
    const modal = document.getElementById("variants-modal-wrapper");
    const filterContainer = document.getElementById("variants-filters");
    const scopeLabel = document.getElementById("variants-scope");
    let activeFilter = "todos";

    const scopedInventory = () => {
      const wit = document.getElementById("witness-select")?.value || "";
      return {
        wit,
        loci: wit
          ? inventory.filter((locus) => locusDiffersForWitness(locus, wit))
          : inventory,
      };
    };

    const refresh = () => {
      const { wit, loci } = scopedInventory();
      if (scopeLabel) {
        scopeLabel.textContent = wit
          ? `Diferencias de ${wit} respecto al texto crítico`
          : "Todos los testimonios";
      }

      renderVariantSummary(loci);

      const filtered =
        activeFilter === "todos"
          ? loci
          : loci.filter((locus) => locus.tags.includes(activeFilter));

      filterContainer
        ?.querySelectorAll(".variant-filter-btn")
        .forEach((button) =>
          button.classList.toggle(
            "is-active",
            button.dataset.filter === activeFilter,
          ),
        );

      renderVariantList(filtered, wit);
      renderVariantDistribution(filtered);
    };

    clearNode(filterContainer);
    Object.entries(variantFilterLabels).forEach(([key, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "variant-filter-btn";
      button.dataset.filter = key;
      button.textContent = label;
      button.addEventListener("click", () => {
        activeFilter = key;
        refresh();
      });
      filterContainer.appendChild(button);
    });

    openBtn?.addEventListener("click", () => {
      activeFilter = "todos";
      refresh();
      modal?.classList.remove("hidden");
    });

    closeBtn?.addEventListener("click", () => modal?.classList.add("hidden"));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });

    document.getElementById("witness-select")?.addEventListener("change", () => {
      if (!modal?.classList.contains("hidden")) refresh();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal?.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }
    });
  }

  // =========================
  // Character comparison across witnesses
  // =========================
  function canonicalSpeakerLabel(raw, fallback = "") {
    const value = (raw || fallback || "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/^#/, "");
    if (!value) return "Sin atribución";

    const directAlias = speakerAliasMap[value];
    if (directAlias) return String(directAlias).replace(/^#/, "");

    const normalized = normalizeName(value);
    const normalizedAlias = speakerAliasMap[normalized];
    if (normalizedAlias) return String(normalizedAlias).replace(/^#/, "");

    if (normalized === "EL MARQUES" || normalized === "MARQUES") return "Marqués";
    return value.replace(/_/g, " ");
  }

  function renderedSpeakerLabel(sp) {
    const speaker = directChildren(sp, "tei-speaker")[0] || null;
    const text = cleanReadingText(speaker);
    const who = (sp.getAttribute("who") || "").split(/\s+/)[0] || "";
    return canonicalSpeakerLabel(text, who);
  }

  function presentVerseLines(sp) {
    return Array.from(sp.querySelectorAll("tei-l")).filter((line) => {
      if (line.hasAttribute("data-witness-omitted")) return false;
      if (line.querySelector(".omission-placeholder")) return false;
      const text = cleanReadingText(line);
      return !!text && !/^\[\.+\]$/.test(text);
    });
  }

  function calculateCharacterStats(scope) {
    const stats = new Map();

    scope.querySelectorAll("tei-sp").forEach((sp) => {
      const lines = presentVerseLines(sp);
      if (!lines.length) return;

      const name = renderedSpeakerLabel(sp);
      if (!stats.has(name)) {
        stats.set(name, { name, lines: 0, interventions: 0 });
      }
      const row = stats.get(name);
      row.lines += lines.length;
      row.interventions += 1;
    });

    return stats;
  }

  function firstVerseReference(sp) {
    const line = Array.from(sp?.querySelectorAll("tei-l") || []).find(
      (el) => el.getAttribute("n"),
    );
    return line?.getAttribute("n") || "";
  }

  function buildCriticalCharacterModel() {
    const clone = baseTEI.cloneNode(true);

    // Critical text excludes witness-only long-span additions.
    processAdditionSpans(clone, { mode: "base" });

    const inlineApps = Array.from(
      clone.querySelectorAll("tei-app:not([from]):not([to])"),
    ).filter(
      (app) =>
        !app.parentElement?.closest("tei-app:not([from]):not([to])"),
    );

    inlineApps.forEach((app) => {
      const resolved = cloneForWitness(app, "__critical__");
      app.replaceWith(resolved);
    });

    // Long-span omission apparatus annotates text retained by the critical edition.
    clone
      .querySelectorAll('tei-app[from][to]:not([type="addition"])')
      .forEach((app) => app.remove());

    return clone;
  }

  function buildWitnessCharacterModel(witID) {
    const model = reconstructWitness(witID, baseTEI);
    processAdditionSpans(model, { mode: "witness", witID });
    return model;
  }

  function attributionChangesForWitness(witID) {
    const changes = [];

    baseTEI.querySelectorAll("tei-speaker tei-app").forEach((app) => {
      const lemma = directChildren(app, "tei-lem")[0] || null;
      if (!lemma) return;

      const rdg = directChildren(app, "tei-rdg").find((reading) =>
        readingMatchesWitness(reading, witID),
      );
      if (!rdg) return;

      const from = canonicalSpeakerLabel(cleanReadingText(lemma));
      const to = canonicalSpeakerLabel(cleanReadingText(rdg));
      if (!to || normalizeName(from) === normalizeName(to)) return;

      changes.push({
        witness: witID,
        from,
        to,
        verse: firstVerseReference(app.closest("tei-sp")),
      });
    });

    return changes;
  }

  function buildCharacterComparison(witnessIDs) {
    const criticalModel = buildCriticalCharacterModel();
    const criticalStats = calculateCharacterStats(criticalModel);
    const witnessStats = new Map();
    const attributionChanges = new Map();
    const names = new Set(criticalStats.keys());

    witnessIDs.forEach((witID) => {
      const model = buildWitnessCharacterModel(witID);
      const stats = calculateCharacterStats(model);
      witnessStats.set(witID, stats);
      attributionChanges.set(witID, attributionChangesForWitness(witID));
      stats.forEach((_, name) => names.add(name));
    });

    const rows = Array.from(names)
      .map((name) => {
        const critical =
          criticalStats.get(name) || { lines: 0, interventions: 0 };
        const witnesses = {};
        witnessIDs.forEach((witID) => {
          witnesses[witID] =
            witnessStats.get(witID)?.get(name) || {
              lines: 0,
              interventions: 0,
            };
        });
        return { name, critical, witnesses };
      })
      .sort(
        (a, b) =>
          b.critical.lines - a.critical.lines ||
          a.name.localeCompare(b.name, "es"),
      );

    return { rows, attributionChanges };
  }

  function signedNumber(value) {
    if (value > 0) return `+${value}`;
    if (value < 0) return `−${Math.abs(value)}`;
    return "0";
  }

  function characterRowDiffers(row, witnessIDs) {
    return witnessIDs.some((witID) => {
      const value = row.witnesses[witID];
      return (
        value.lines !== row.critical.lines ||
        value.interventions !== row.critical.interventions
      );
    });
  }

  function renderCharacterSummary(comparison, witnessIDs) {
    const summary = document.getElementById("characters-summary");
    if (!summary) return;
    clearNode(summary);

    const differingCharacters = comparison.rows.filter((row) =>
      characterRowDiffers(row, witnessIDs),
    ).length;
    const attributionCount = witnessIDs.reduce(
      (sum, witID) =>
        sum + (comparison.attributionChanges.get(witID)?.length || 0),
      0,
    );

    [
      ["Testimonios", witnessIDs.length],
      ["Personajes", comparison.rows.length],
      ["Con diferencias", differingCharacters],
      ["Cambios de atribución", attributionCount],
    ].forEach(([label, value]) => {
      const card = document.createElement("div");
      card.className = "character-summary-card";
      const number = document.createElement("strong");
      number.textContent = String(value);
      const caption = document.createElement("span");
      caption.textContent = label;
      card.append(number, caption);
      summary.appendChild(card);
    });
  }

  function metricLabel(metric) {
    return metric === "interventions" ? "Intervenciones" : "Líneas";
  }

  function characterMetricDiffers(row, witnessIDs, metric) {
    return witnessIDs.some(
      (witID) =>
        row.witnesses[witID][metric] !== row.critical[metric],
    );
  }

  function renderCharacterTable(
    comparison,
    witnessIDs,
    selectedWit,
    metric = "lines",
    onlyDifferences = true,
  ) {
    const container = document.getElementById("characters-table");
    if (!container) return;
    clearNode(container);

    const table = document.createElement("table");
    table.className = "characters-table comparison-table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    const personHead = document.createElement("th");
    personHead.textContent = "Personaje";
    headRow.appendChild(personHead);

    const criticalHead = document.createElement("th");
    criticalHead.innerHTML =
      `Texto crítico<span class="table-metric-label">${metricLabel(metric)}</span>`;
    headRow.appendChild(criticalHead);

    witnessIDs.forEach((witID) => {
      const th = document.createElement("th");
      th.textContent = witID;
      th.dataset.wit = witID;
      if (witID === selectedWit) th.classList.add("is-selected-witness");
      headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    const visibleRows = comparison.rows.filter(
      (row) =>
        !onlyDifferences ||
        characterMetricDiffers(row, witnessIDs, metric),
    );

    const tbody = document.createElement("tbody");
    visibleRows.forEach((row) => {
      const tr = document.createElement("tr");
      if (characterMetricDiffers(row, witnessIDs, metric)) {
        tr.classList.add("has-transmission-difference");
      }

      const name = document.createElement("th");
      name.scope = "row";
      name.textContent = row.name;
      tr.appendChild(name);

      const critical = document.createElement("td");
      critical.className = "character-stat-cell critical-stat-cell";
      critical.innerHTML = `<strong>${row.critical[metric]}</strong>`;
      tr.appendChild(critical);

      witnessIDs.forEach((witID) => {
        const value = row.witnesses[witID][metric];
        const baseline = row.critical[metric];
        const delta = value - baseline;
        const td = document.createElement("td");
        td.className = "character-stat-cell";
        td.dataset.wit = witID;

        if (witID === selectedWit) td.classList.add("is-selected-witness");

        if (!delta) {
          td.classList.add("is-same");
          td.innerHTML = `<span class="same-as-critical" aria-label="Coincide con el texto crítico">—</span>`;
        } else {
          td.classList.add("is-different");
          td.innerHTML =
            `<strong>${value}</strong><span class="character-inline-delta">(${signedNumber(delta)})</span>`;
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    if (!visibleRows.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = witnessIDs.length + 2;
      td.className = "characters-empty-row";
      td.textContent =
        "No se registran diferencias para esta métrica entre los testimonios codificados.";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
  }

  function renderAttributionChanges(comparison, witnessIDs, selectedWit) {
    const container = document.getElementById("attribution-changes");
    if (!container) return;
    clearNode(container);

    const ordered = selectedWit
      ? [
          selectedWit,
          ...witnessIDs.filter((witID) => witID !== selectedWit),
        ]
      : witnessIDs;

    let hasAny = false;
    ordered.forEach((witID) => {
      const changes = comparison.attributionChanges.get(witID) || [];
      if (!changes.length) return;
      hasAny = true;

      const group = document.createElement("section");
      group.className = "attribution-witness-group";
      if (witID === selectedWit) group.classList.add("is-selected-witness");

      const heading = document.createElement("h5");
      heading.textContent = witID;
      group.appendChild(heading);

      changes.forEach((change) => {
        const item = document.createElement("div");
        item.className = "attribution-change";
        const ref = change.verse ? `v. ${change.verse} · ` : "";
        item.textContent = `${ref}${change.from} → ${change.to}`;
        group.appendChild(item);
      });

      container.appendChild(group);
    });

    if (!hasAny) {
      const empty = document.createElement("p");
      empty.className = "characters-empty";
      empty.textContent =
        "No se registran cambios explícitos de atribución entre los testimonios codificados.";
      container.appendChild(empty);
    }
  }

  function setupCharacterExplorer(witnessIDs) {
    const openBtn = document.getElementById("open-characters-btn");
    const closeBtn = document.getElementById("close-characters-btn");
    const modal = document.getElementById("characters-modal-wrapper");
    const scopeLabel = document.getElementById("characters-scope");
    const onlyDifferencesControl =
      document.getElementById("characters-only-differences");
    const metricButtons = Array.from(
      document.querySelectorAll("[data-character-metric]"),
    );

    let cachedComparison = null;
    let metric = "lines";

    const refresh = () => {
      const selectedWit =
        document.getElementById("witness-select")?.value || "";
      const onlyDifferences = onlyDifferencesControl?.checked ?? true;

      if (!cachedComparison) {
        cachedComparison = buildCharacterComparison(witnessIDs);
      }

      if (scopeLabel) {
        scopeLabel.textContent = selectedWit
          ? `Todos los testimonios · ${selectedWit} seleccionado`
          : "Todos los testimonios";
      }

      metricButtons.forEach((button) => {
        const active = button.dataset.characterMetric === metric;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });

      renderCharacterSummary(cachedComparison, witnessIDs);
      renderCharacterTable(
        cachedComparison,
        witnessIDs,
        selectedWit,
        metric,
        onlyDifferences,
      );
      renderAttributionChanges(
        cachedComparison,
        witnessIDs,
        selectedWit,
      );
    };

    metricButtons.forEach((button) => {
      button.addEventListener("click", () => {
        metric = button.dataset.characterMetric || "lines";
        refresh();
      });
    });

    onlyDifferencesControl?.addEventListener("change", refresh);

    openBtn?.addEventListener("click", () => {
      refresh();
      modal?.classList.remove("hidden");
    });

    closeBtn?.addEventListener("click", () => modal?.classList.add("hidden"));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });

    document.getElementById("witness-select")?.addEventListener("change", () => {
      if (!modal?.classList.contains("hidden")) refresh();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal?.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }
    });
  }

  // =========================
  // Pipeline di decorazione
  // =========================
  function decorateEdition(root, { inWitnessView = false } = {}) {
    // 1) long-span
    decorateOmissionSpans(root, inWitnessView);
    processAdditionSpans(root, { mode: "base" }); // unificata (base)
    // 2) inline
    decorateInlineAdditionsWithoutAnchors(root);
    updateCriticalAdditionSlots(
      document.getElementById("witness-select")?.value || null,
    );
    decorateApparatus(root);
    // 3) numerazione/impaginazione
    insertLeftAlignedLineNumbers(root);
    alignSplitVerses(root);
    // 4) hover sync
    enableLineSyncHighlighting();
    root.__decoratedOnce = true;
  }

  // =========================
  // UI
  // =========================
  function closeWitness() {
    const pane = document.getElementById("witness-pane");
    const container = document.getElementById("witness-container");
    const wrapper = document.getElementById("tei-wrapper");
    const select = document.getElementById("witness-select");
    const title = document.getElementById("witness-title");

    pane?.classList.add("hidden");
    if (container) container.innerHTML = "";
    if (wrapper) wrapper.dataset.comparison = "closed";
    if (select) select.value = "";
    if (title) title.textContent = "—";
    updateCriticalAdditionSlots(null);
  }

  function setupFloatingControls() {
    const select = document.getElementById("witness-select");
    const closeBtn = document.getElementById("close-witness-btn");

    select.addEventListener("change", () => {
      if (select.value) openWitness(select.value);
      else closeWitness();
    });

    closeBtn?.addEventListener("click", closeWitness);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !document.getElementById("witness-pane")?.classList.contains("hidden")) {
        closeWitness();
      }
    });
  }

  function getWitnessDescription(witID) {
    const id = (witID || "").replace(/^#/, "");
    const witness =
      baseTEI?.querySelector(`tei-witness[id="${CSS.escape(id)}"]`) ||
      baseTEI?.querySelector(`tei-witness[xml\\:id="${CSS.escape(id)}"]`);
    return (witness?.textContent || "").trim().replace(/\s+/g, " ");
  }

  function witnessInfoRecord(witID) {
    const id = (witID || "").replace(/^#/, "");
    const description = getWitnessDescription(id);
    return {
      id,
      description:
        description || "Información bibliográfica pendiente de completar en listWit.",
      isDefined: !!description,
    };
  }

  function renderWitnessInfo(witnessIDs, title = "Testimonios") {
    const modal = document.getElementById("witness-info-modal-wrapper");
    const heading = document.getElementById("witness-info-title");
    const content = document.getElementById("witness-info-content");
    if (!modal || !heading || !content) return;

    heading.textContent = title;
    content.innerHTML = "";

    witnessIDs.map(witnessInfoRecord).forEach((record) => {
      const item = document.createElement("article");
      item.className = "witness-info-item";
      if (!record.isDefined) item.classList.add("is-incomplete");

      const siglum = document.createElement("div");
      siglum.className = "witness-info-siglum";
      siglum.textContent = record.id;

      const description = document.createElement("p");
      description.className = "witness-info-description";
      description.textContent = record.description;

      item.append(siglum, description);
      content.appendChild(item);
    });

    modal.classList.remove("hidden");
  }

  function setupWitnessInfo(allWitnesses) {
    const openAll = document.getElementById("open-witness-info-btn");
    const close = document.getElementById("close-witness-info-btn");
    const modal = document.getElementById("witness-info-modal-wrapper");
    const titleButton = document.getElementById("witness-title");

    openAll?.addEventListener("click", () => {
      renderWitnessInfo(allWitnesses, "Testimonios");
    });

    titleButton?.addEventListener("click", () => {
      const wit = titleButton.dataset.wit || titleButton.textContent.trim();
      if (wit && wit !== "—") {
        renderWitnessInfo([wit], `Testimonio ${wit}`);
      }
    });

    close?.addEventListener("click", () => modal?.classList.add("hidden"));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal?.classList.contains("hidden")) {
        modal.classList.add("hidden");
      }
    });
  }

  function populateWitnessSelect(allWitnesses) {
    const select = document.getElementById("witness-select");
    select.innerHTML = '<option value="">Selecciona testimonio</option>';
    allWitnesses.forEach((witID) => {
      const option = document.createElement("option");
      const description = getWitnessDescription(witID);
      option.value = witID;
      option.textContent = description ? `${witID} — ${description}` : witID;
      option.title = description || witID;
      select.appendChild(option);
    });
  }

  function openWitness(witnessID) {
    if (!witnessID) return;

    const pane = document.getElementById("witness-pane");
    const container = document.getElementById("witness-container");
    const wrapper = document.getElementById("tei-wrapper");
    const title = document.getElementById("witness-title");

    container.innerHTML = "";
    pane.classList.remove("hidden");
    wrapper.dataset.comparison = "open";
    title.textContent = witnessID;
    title.dataset.wit = witnessID;
    updateCriticalAdditionSlots(witnessID);

    const witnessDOM = reconstructWitness(witnessID, baseTEI);
    witnessDOM.setAttribute("data-witness-id", witnessID);
    container.appendChild(witnessDOM);

    requestAnimationFrame(() => {
      decorateNotes(witnessDOM);
      attachNoteEvents(witnessDOM);
      decorateApparatus(witnessDOM);
      makeApparatusSiglaClickable(witnessDOM);

      // Resolve witness-specific additions before numbering.
      processAdditionSpans(witnessDOM, {
        mode: "witness",
        witID: witnessID,
      });

      // Critical coordinates stay hidden and stable for synchronisation.
      assignLogicalLineNumbers(witnessDOM);

      // Visible numbering belongs to the reconstructed witness itself.
      insertLeftAlignedLineNumbers(witnessDOM, { mode: "witness" });
      assignWitnessLineNumbers(witnessDOM);
      alignSplitVerses(witnessDOM);
      enableLineSyncHighlighting();
    });
  }

  // =========================
  // Boot
  // =========================
  window.onload = function () {
    CETEIcean.getHTML5("el_marques.xml", function (data) {
      // 1) Clona prima di montare
      baseTEI = data.cloneNode(true);
      originalData = data.cloneNode(true);

      // Stable apparatus coordinates must match in source and rendered clones.
      assignLocusIds(baseTEI);
      assignLocusIds(originalData);
      assignLocusIds(data);

      // 2) Monta nel DOM
      const criticalContainer = document.getElementById("critical-container");
      document.getElementById("critical-loading")?.remove();
      criticalContainer.appendChild(data);
      const root = criticalContainer;

      // 3) Dati di supporto
      const allSigla = extractWitnessSigla(baseTEI);
      const variantInventory = buildVariantInventory(baseTEI);
      populateWitnessSelect(allSigla);
      setupWitnessInfo(allSigla);
      setupVariantExplorer(variantInventory);
      setupCharacterExplorer(allSigla);

      // Delegated handler: click su chip → apri testimone (senza passare dal <select>)
      const wrapper = document.getElementById("tei-wrapper") || document;
      wrapper.addEventListener("pointerdown", (e) => {
        const chip = e.target.closest(".wit-chip");
        if (!chip) return;
        e.stopPropagation(); // evita il click-away del tooltip
        const wit = chip.dataset.wit;

        // apri subito la colonna del testimone
        openWitness(wit);

        // (opzionale) sincronizza il select, anche se è nascosto
        const sel = document.getElementById("witness-select");
        if (sel) sel.value = wit;
      });

      // 4) Decora il testo base (una volta pronto nel DOM)
      requestAnimationFrame(() => {
        decorateNotes(root);
        decorateEdition(root, { inWitnessView: false });
        attachNoteEvents(root);

        // Logical verse ids include M/F fragments of split verses.
        assignLogicalLineNumbers(root);

        // Dopo che decorateApparatus ha creato i tooltip, rendi le sigle cliccabili
        makeApparatusSiglaClickable(root);

        // Evidenziazione sincronizzata (delegata, bind una sola volta)
        enableLineSyncHighlighting();
      });

      // 5) Controlli flottanti
      setupFloatingControls();
    });
  };
</script>
