---
layout: critical
title: El marqués de las Navas – Edición Digital Académica
edition_label: Edición crítica · prototipo
---

<header id="sticky-header" class="critical-toolbar" aria-label="Herramientas de la edición crítica">
  <div class="critical-toolbar-title">
    <span class="critical-toolbar-eyebrow">Edición crítica</span>
    <strong>Texto y aparato</strong>
  </div>

  <div id="floating-tools" class="critical-toolbar-actions">
    <label class="witness-picker" for="witness-select">
      <span>Comparar con</span>
      <select id="witness-select">
        <option value="">Selecciona testimonio</option>
      </select>
    </label>
    <button id="open-stats-btn" class="tool-button tool-button-secondary" type="button">
      Estadísticas
    </button>
  </div>
</header>

<div id="tei-wrapper" class="synoptic-view" data-comparison="closed">
  <section id="critical-pane" class="edition-pane critical-pane" aria-label="Texto crítico">
    <header class="pane-header">
      <div>
        <span class="pane-eyebrow">Texto crítico</span>
        <h1>El marqués de las Navas</h1>
      </div>
      <span class="pane-meta">Numeración crítica</span>
    </header>
    <div id="critical-container" class="tei-column critical-column">
      <div class="edition-loading" id="critical-loading" role="status">Cargando la edición…</div>
    </div>
  </section>

  <section id="witness-pane" class="edition-pane witness-pane hidden" aria-label="Testimonio comparado">
    <header class="pane-header">
      <div>
        <span class="pane-eyebrow">Testimonio</span>
        <h2 id="witness-title">—</h2>
        <p id="witness-description" class="pane-description"></p>
        <span class="pane-numbering-note">Numeración propia del testimonio</span>
      </div>
      <button id="close-witness-btn" class="pane-close" type="button" aria-label="Cerrar comparación">
        Cerrar
      </button>
    </header>
    <div id="witness-container" class="tei-column witness-column"></div>
  </section>
</div>

<!-- Modal wrapper for centering and backdrop -->
<div id="modal-wrapper" class="modal hidden">
  <div id="stats-modal">
    <!-- Close button -->
    <button id="close-stats-btn">🗙</button>
    <!-- Witness selection -->
    <h3>Elige un testimonio</h3>
    <div class="witness-controls">
      <div id="witness-buttons"></div>
      <button id="toggle-global-chart-btn">Ver gráficas</button>
    </div>
    <!-- Stats panel (list + individual chart) -->
    <div id="stats-panel">
      <canvas id="stats-chart" width="800" height="300"></canvas>
    </div>
    <!-- Global charts (general + per-act) -->
    <div id="global-chart-modal" class="hidden">
      <button id="close-global-chart-btn">Cerrar</button>
      <h3>Comparativa global entre testimonios</h3>
      <div id="global-charts-container"></div>
    </div>
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

  // =========================
  // Cast helpers
  // =========================
  function buildCastMap(data) {
    const byId = {},
      byNorm = {};
    data.querySelectorAll("tei-castList tei-castItem").forEach((item) => {
      const rawId = item.getAttribute("xml:id") || item.id;
      const roleEl = item.querySelector("tei-role, tei-persona");
      const label = ((roleEl ? roleEl.textContent : item.textContent) || "")
        .trim()
        .replace(/\s+/g, " ");
      if (rawId) byId["#" + rawId] = label;
      if (label) byNorm[normalizeName(label)] = label;
    });
    data.querySelectorAll("tei-listPerson tei-person").forEach((p) => {
      const rawId = p.getAttribute("xml:id") || p.id;
      const nameEl = p.querySelector("tei-persName");
      const label = ((nameEl ? nameEl.textContent : p.textContent) || "")
        .trim()
        .replace(/\s+/g, " ");
      if (rawId) byId["#" + rawId] = label;
      if (label) byNorm[normalizeName(label)] = label;
    });
    return { byId, byNorm };
  }
  function mapFreeTextToCast(labelRaw, castMap) {
    if (!labelRaw) return null;
    const raw = labelRaw.trim();
    if (raw.startsWith("#")) {
      if (castMap.byId[raw]) return castMap.byId[raw];
      const stripped = raw.slice(1);
      const normId = normalizeName(stripped);
      return castMap.byNorm[normId] || stripped;
    }
    const norm = normalizeName(raw);
    if (castMap.byNorm[norm]) return castMap.byNorm[norm];
    const aliasVal = speakerAliasMap[raw] ?? speakerAliasMap[norm];
    if (aliasVal) {
      if (typeof aliasVal === "string" && aliasVal.startsWith("#")) {
        return (
          castMap.byId[aliasVal] ||
          castMap.byNorm[normalizeName(aliasVal.slice(1))] ||
          aliasVal.slice(1)
        );
      } else {
        return castMap.byNorm[normalizeName(aliasVal)] || aliasVal;
      }
    }
    return raw.replace(/^#/, "");
  }
  function resolveSpeakersForSp(sp, witID, castMap) {
    let spk = null;
    for (const kid of sp.children)
      if (kid.tagName?.toLowerCase() === "tei-speaker") {
        spk = kid;
        break;
      }
    if (spk) {
      const app = spk.querySelector("tei-app");
      if (app) {
        const rdg = app.querySelector(`tei-rdg[wit~="#${witID}"]`);
        const choice = rdg || app.querySelector("tei-lem");
        const txt =
          choice && choice.textContent ? choice.textContent.trim() : "";
        if (txt) return [mapFreeTextToCast(txt, castMap)].filter(Boolean);
      }
      const label = (spk.textContent || "").trim();
      if (label) return [mapFreeTextToCast(label, castMap)].filter(Boolean);
      const whoAttr = spk.getAttribute("who");
      if (whoAttr) {
        const names = whoAttr
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((t) => mapFreeTextToCast(t, castMap));
        return [...new Set(names.filter(Boolean))];
      }
    }
    const who = (sp.getAttribute("who") || "").trim();
    if (who) {
      const names = who
        .split(/\s+/)
        .filter(Boolean)
        .map((t) => mapFreeTextToCast(t, castMap));
      return [...new Set(names.filter(Boolean))];
    }
    return ["DESCONOCIDO"];
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
    const lines = root.querySelectorAll("tei-l, l");
    lines.forEach((line, index) => {
      const part = line.getAttribute("part");
      const container = line.querySelector(".line-text");
      if (!part || !container) return;
      const prev = lines[index - 1];
      const prevPart = prev?.getAttribute("part");
      const prevLineText = prev?.querySelector(".line-text");
      if (
        (part === "M" && prevPart === "I") ||
        (part === "F" && (prevPart === "M" || prevPart === "I"))
      ) {
        if (prevLineText) {
          const indent = prevLineText.getBoundingClientRect().width;
          container.style.paddingLeft = `${indent}px`;
        }
      }
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

        affectedLines.forEach((line) => {
          line.classList.add("critical-omission-range");
          line.dataset.omittedIn = sigla.join(" ");
        });

        const first = affectedLines[0];
        const marker = document.createElement("button");
        marker.type = "button";
        marker.className = "transmission-note omission-note";
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
  // Statistiche (D3)
  // =========================
  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function drawBarChartD3(container, rawStats, titleText) {
    const draw = () => {
      const old = container.querySelector("svg.d3-chart");
      if (old) old.remove();
      const data = Object.entries(rawStats)
        .map(([name, v]) => ({ name, value: Math.round(v) }))
        .sort((a, b) => b.value - a.value);

      const width = container.clientWidth || 900;
      const height = Math.max(360, 280 + Math.ceil(data.length / 12) * 28);
      const margin = { top: 44, right: 20, bottom: 150, left: 64 };

      const svg = d3
        .select(container)
        .append("svg")
        .attr("class", "d3-chart")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      if (titleText)
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", margin.top - 18)
          .attr("text-anchor", "middle")
          .attr("font-weight", "600")
          .attr("font-size", 16)
          .text(titleText);

      const maxVal = d3.max(data, (d) => d.value) || 1;
      const step =
        maxVal <= 80 ? 10 : maxVal <= 200 ? 25 : maxVal <= 400 ? 50 : 100;
      const upper = Math.ceil(maxVal / step) * step;
      const headroom = Math.max(6, Math.round(upper * 0.08));

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1);
      const y = d3
        .scaleLinear()
        .domain([0, upper + headroom])
        .range([height - margin.bottom, margin.top])
        .nice();
      const narrow = x.bandwidth() < 16;

      const xAxis = (g) =>
        g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("font-size", narrow ? 10 : 12)
          .attr("transform", narrow ? "rotate(-75)" : "rotate(-60)")
          .attr("text-anchor", "end")
          .attr("dx", "-.5em")
          .attr("dy", ".35em");
      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).tickValues(d3.range(0, upper + step, step)))
          .call((g) => g.select(".domain").remove())
          .selectAll("text")
          .attr("font-size", 12);

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      const g = svg.append("g");
      const bars = g
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(0) - y(d.value))
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", "#69b3a2");

      const labels = g
        .selectAll("g.value-label")
        .data(data)
        .join("g")
        .attr("class", "value-label")
        .attr(
          "transform",
          (d) =>
            `translate(${x(d.name) + x.bandwidth() / 2}, ${y(d.value) - 8})`,
        );
      labels.each(function (d) {
        const group = d3.select(this);
        const t = group
          .append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", 8)
          .style("paint-order", "stroke")
          .style("stroke", "#fff")
          .style("stroke-width", "2px")
          .style("stroke-opacity", 0.7)
          .text(d.value);
      });

      bars.append("title").text((d) => `${d.name}: ${d.value}`);
    };
    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
  }

  function drawGroupedBarChartD3(
    container,
    globalStats,
    allWitnesses,
    titleText,
  ) {
    const controls = document.createElement("div");
    controls.className = "witness-toggle-bar";
    controls.style.margin = "8px 0 6px 0";
    controls.style.display = "flex";
    controls.style.flexWrap = "wrap";
    controls.style.gap = "6px";
    const makeBtn = (label) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.type = "button";
      b.style.padding = "4px 8px";
      b.style.borderRadius = "8px";
      b.style.border = "1px solid #ccc";
      b.style.background = "#f6f6f6";
      b.style.cursor = "pointer";
      b.style.fontSize = "12px";
      return b;
    };
    const selected = new Set(allWitnesses);
    const selectAllBtn = makeBtn("Seleccionar todos");
    const clearAllBtn = makeBtn("Ninguno");
    controls.appendChild(selectAllBtn);
    controls.appendChild(clearAllBtn);
    const color = d3
      .scaleOrdinal()
      .domain(allWitnesses)
      .range(
        allWitnesses.map(
          (_, i) => `hsl(${(i * 360) / allWitnesses.length}, 70%, 55%)`,
        ),
      );
    const witnessBtns = allWitnesses.map((w) => {
      const b = makeBtn(w);
      b.dataset.wit = w;
      b.style.borderColor = color(w);
      b.style.background = "#eaf3ff";
      controls.appendChild(b);
      return b;
    });
    container.appendChild(controls);
    const refreshBtnStyles = () => {
      witnessBtns.forEach((b) => {
        const on = selected.has(b.dataset.wit);
        b.style.background = on ? "#eaf3ff" : "#f6f6f6";
        b.style.opacity = on ? "1" : "0.55";
      });
    };

    const draw = () => {
      const old = container.querySelector("svg.d3-chart");
      if (old) old.remove();
      const characters = Object.keys(globalStats);
      const totals = (name) =>
        allWitnesses.reduce((acc, w) => acc + (globalStats[name][w] || 0), 0);
      const labels = characters.sort((a, b) => totals(b) - totals(a));
      const active = allWitnesses.filter((w) => selected.has(w));

      const width = container.clientWidth || 900;
      const height = Math.max(440, 320 + Math.ceil(labels.length / 12) * 28);
      const margin = { top: 56, right: 24, bottom: 180, left: 64 };

      const svg = d3
        .select(container)
        .append("svg")
        .attr("class", "d3-chart")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      if (titleText)
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", margin.top - 26)
          .attr("text-anchor", "middle")
          .attr("font-weight", "600")
          .attr("font-size", 16)
          .text(titleText);

      if (active.length === 0) {
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("text-anchor", "middle")
          .text("Selecciona al menos un testimonio");
        return;
      }

      const data = labels.map((name) => ({
        name,
        values: active.map((w) => ({
          wit: w,
          value: Math.round(globalStats[name][w] || 0),
        })),
      }));

      const maxVal = d3.max(data, (d) => d3.max(d.values, (v) => v.value)) || 1;
      const step =
        maxVal <= 80 ? 10 : maxVal <= 200 ? 25 : maxVal <= 400 ? 50 : 100;
      const upper = Math.ceil(maxVal / step) * step;
      const headroom = Math.max(6, Math.round(upper * 0.1));

      const x0 = d3
        .scaleBand()
        .domain(labels)
        .range([margin.left, width - margin.right])
        .padding(0.08);
      const x1 = d3
        .scaleBand()
        .domain(active)
        .range([0, x0.bandwidth()])
        .padding(0.05);
      const y = d3
        .scaleLinear()
        .domain([0, upper + headroom])
        .range([height - margin.bottom, margin.top])
        .nice();

      const xTooNarrow = x0.bandwidth() < 22;
      const xAxis = (g) =>
        g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x0))
          .selectAll("text")
          .attr("font-size", xTooNarrow ? 10 : 12)
          .attr("transform", xTooNarrow ? "rotate(-80)" : "rotate(-60)")
          .attr("text-anchor", "end")
          .attr("dx", "-.55em")
          .attr("dy", ".35em");
      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).tickValues(d3.range(0, upper + step, step)))
          .call((g) => g.select(".domain").remove())
          .selectAll("text")
          .attr("font-size", 12);

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      const rows = svg
        .append("g")
        .selectAll("g.row")
        .data(data)
        .join("g")
        .attr("class", "row")
        .attr("transform", (d) => `translate(${x0(d.name)},0)`);

      const bars = rows
        .selectAll("rect")
        .data((d) => d.values)
        .join("rect")
        .attr("x", (v) => x1(v.wit))
        .attr("y", (v) => y(v.value))
        .attr("width", x1.bandwidth())
        .attr("height", (v) => y(0) - y(v.value))
        .attr("fill", (v) => color(v.wit))
        .attr("rx", 2)
        .attr("ry", 2);

      rows
        .selectAll("g.value-label")
        .data((d) => d.values)
        .join("g")
        .attr("class", "value-label")
        .attr(
          "transform",
          (v) =>
            `translate(${x1(v.wit) + x1.bandwidth() / 2}, ${y(v.value) - 7})`,
        )
        .each(function (v) {
          const group = d3.select(this);
          const t = group
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", 7)
            .attr("font-weight", "300")
            .text(v.value);
          const bb = t.node().getBBox();
          group
            .insert("rect", "text")
            .attr("x", bb.x - 3)
            .attr("y", bb.y - 1)
            .attr("width", bb.width + 6)
            .attr("height", bb.height + 2)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("fill", "#fff")
            .attr("opacity", 0.95);
        });

      bars.append("title").text((v) => `${v.wit}: ${v.value}`);

      const legend = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width - margin.right - 10}, ${margin.top - 10})`,
        );
      const lineH = 18;
      allWitnesses.forEach((wit, i) => {
        const y0 = i * lineH;
        legend
          .append("rect")
          .attr("x", -16)
          .attr("y", y0)
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", color(wit))
          .attr("opacity", selected.has(wit) ? 1 : 0.25);
        legend
          .append("text")
          .attr("x", 2)
          .attr("y", y0 + 10)
          .attr("font-size", 12)
          .attr("opacity", selected.has(wit) ? 1 : 0.5)
          .text(wit);
      });
    };

    witnessBtns.forEach((b) =>
      b.addEventListener("click", () => {
        const w = b.dataset.wit;
        if (selected.has(w)) selected.delete(w);
        else selected.add(w);
        refreshBtnStyles();
        draw();
      }),
    );
    selectAllBtn.addEventListener("click", () => {
      allWitnesses.forEach((w) => selected.add(w));
      refreshBtnStyles();
      draw();
    });
    clearAllBtn.addEventListener("click", () => {
      selected.clear();
      refreshBtnStyles();
      draw();
    });

    refreshBtnStyles();
    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
  }

  function calculateLineStats(container, witID, castMap) {
    const stats = Object.create(null);
    container.querySelectorAll("tei-sp").forEach((sp) => {
      const speakers = resolveSpeakersForSp(sp, witID, castMap);
      const k = speakers.length || 1,
        weight = 1 / k;
      let counted = 0;
      sp.querySelectorAll("tei-l").forEach((line) => {
        if (line.hasAttribute("data-witness-omitted")) return;
        const txt = (line.textContent || "").trim();
        if (!txt || /^\[\.+\]$/.test(txt)) return;
        counted++;
      });
      if (counted > 0)
        speakers.forEach((name) => {
          if (!stats[name]) stats[name] = 0;
          stats[name] += counted * weight;
        });
    });
    return stats;
  }
  function extractWitnessSigla(data) {
    const siglaSet = new Set();
    data.querySelectorAll("tei-rdg[wit], tei-lem[wit]").forEach((rdg) => {
      const witAttr = rdg.getAttribute("wit");
      if (!witAttr) return;
      witAttr
        .split(/\s+/)
        .forEach((wit) => siglaSet.add(wit.replace(/^#/, "")));
    });
    return Array.from(siglaSet).sort();
  }
  function calculateGlobalStats(allWitnesses, baseTEI, castMap) {
    const globalStats = Object.create(null);
    allWitnesses.forEach((witID) => {
      const dom = reconstructWitness(witID, baseTEI);
      const local = calculateLineStats(dom, witID, castMap);
      Object.entries(local).forEach(([name, count]) => {
        if (!globalStats[name]) globalStats[name] = Object.create(null);
        globalStats[name][witID] = (globalStats[name][witID] || 0) + count;
      });
    });
    return globalStats;
  }
  function calculateActStatsPerWitness(baseTEI, allWitnesses, castMap) {
    const acts = Array.from(
      baseTEI.querySelectorAll('tei-div[type="act"], tei-div[type="jornada"]'),
    );
    const allStats = {};
    acts.forEach((actDiv, idx) => {
      const actKey = actDiv.getAttribute("n")
        ? `Acto ${actDiv.getAttribute("n")}`
        : `Acto ${idx + 1}`;
      allStats[actKey] = {};
      allWitnesses.forEach((witID) => {
        const dom = reconstructWitness(witID, actDiv.cloneNode(true));
        allStats[actKey][witID] = calculateLineStats(dom, witID, castMap);
      });
    });
    return allStats;
  }
  function renderStatsPanel(stats, witID) {
    const panel = document.getElementById("stats-panel");
    clearNode(panel);
    const entries = Object.entries(stats)
      .map(([name, v]) => [name, Math.round(v)])
      .sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
      panel.innerHTML = `<h3>Sin líneas para ${witID}</h3>`;
      return;
    }
    const table = document.createElement("table");
    table.className = "stats-table";
    table.innerHTML = `
      <thead><tr><th style="font-variant: small-caps;">Personaje</th><th style="font-variant: small-caps;">Cantidad de líneas</th></tr></thead>
      <tbody>${entries
        .map(
          ([label, count]) =>
            `<tr><td><strong>${label}</strong></td><td>${count}</td></tr>`,
        )
        .join("")}</tbody>`;
    const h3 = document.createElement("h3");
    h3.textContent = `Estadísticas para testimonio #${witID}:`;
    panel.append(h3, table);
    const chartHolder = document.createElement("div");
    chartHolder.style.marginTop = "16px";
    panel.appendChild(chartHolder);
    drawBarChartD3(
      chartHolder,
      Object.fromEntries(entries),
      `Líneas habladas en ${witID}`,
    );
  }
  function renderGlobalStatsChartD3(
    globalStats,
    allWitnesses,
    container,
    title,
  ) {
    drawGroupedBarChartD3(container, globalStats, allWitnesses, title);
  }
  function attachGlobalChartToggle() {
    const toggleBtn = document.getElementById("toggle-global-chart-btn");
    const globalChartModal = document.getElementById("global-chart-modal");
    const closeBtn = document.getElementById("close-global-chart-btn");
    if (toggleBtn)
      toggleBtn.addEventListener("click", () => {
        globalChartModal.classList.toggle("hidden");
        if (!globalChartModal.classList.contains("hidden"))
          globalChartModal.scrollIntoView({ behavior: "smooth" });
      });
    if (closeBtn)
      closeBtn.addEventListener("click", () =>
        globalChartModal.classList.add("hidden"),
      );
  }
  function setupStatsPopup(allWitnesses, castMap) {
    const openBtn = document.getElementById("open-stats-btn");
    const closeBtn = document.getElementById("close-stats-btn");
    const modalWrapper = document.getElementById("modal-wrapper");
    const witnessButtons = document.getElementById("witness-buttons");
    const statsPanel = document.getElementById("stats-panel");
    const globalChartsContainer = document.getElementById(
      "global-charts-container",
    );

    openBtn.addEventListener("click", () => {
      modalWrapper.classList.remove("hidden");
      clearNode(statsPanel);
      clearNode(globalChartsContainer);

      const allW = allWitnesses;
      const globalStats = calculateGlobalStats(allW, baseTEI, castMap);
      const overallHolder = document.createElement("div");
      globalChartsContainer.appendChild(overallHolder);
      renderGlobalStatsChartD3(
        globalStats,
        allW,
        overallHolder,
        "Comparación general de líneas",
      );

      const actStats = calculateActStatsPerWitness(baseTEI, allW, castMap);
      Object.entries(actStats).forEach(([actName, witData]) => {
        const actTitle = document.createElement("h4");
        actTitle.textContent = `${actName}`;
        globalChartsContainer.appendChild(actTitle);
        const actHolder = document.createElement("div");
        globalChartsContainer.appendChild(actHolder);
        const actGlobalStats = {};
        Object.entries(witData).forEach(([witID, speakerCounts]) => {
          Object.entries(speakerCounts).forEach(([charName, count]) => {
            if (!actGlobalStats[charName]) actGlobalStats[charName] = {};
            actGlobalStats[charName][witID] = count;
          });
        });
        renderGlobalStatsChartD3(
          actGlobalStats,
          allW,
          actHolder,
          `Líneas por personaje – ${actName}`,
        );
      });
    });

    closeBtn.addEventListener("click", () => {
      modalWrapper.classList.add("hidden");
      clearNode(statsPanel);
      clearNode(globalChartsContainer);
    });

    witnessButtons.innerHTML = "";
    allWitnesses.forEach((witID) => {
      const btn = document.createElement("button");
      btn.textContent = witID;
      btn.classList.add("witness-btn");
      btn.addEventListener("click", () => {
        const witnessDOM = reconstructWitness(witID, baseTEI);
        const stats = calculateLineStats(witnessDOM, witID, castMap);
        renderStatsPanel(stats, witID);
        document.getElementById("global-chart-modal").classList.add("hidden");
        document
          .getElementById("stats-panel")
          .scrollIntoView({ behavior: "smooth" });
      });
      witnessButtons.appendChild(btn);
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
    const description = document.getElementById("witness-description");

    pane?.classList.add("hidden");
    if (container) container.innerHTML = "";
    if (wrapper) wrapper.dataset.comparison = "closed";
    if (select) select.value = "";
    if (title) title.textContent = "—";
    if (description) description.textContent = "";
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
    const description = document.getElementById("witness-description");

    container.innerHTML = "";
    pane.classList.remove("hidden");
    wrapper.dataset.comparison = "open";
    title.textContent = witnessID;
    description.textContent = getWitnessDescription(witnessID);
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

      // 2) Monta nel DOM
      const criticalContainer = document.getElementById("critical-container");
      document.getElementById("critical-loading")?.remove();
      criticalContainer.appendChild(data);
      const root = criticalContainer;

      // 3) Dati di supporto
      const castMap = buildCastMap(baseTEI);
      const allSigla = extractWitnessSigla(baseTEI);
      populateWitnessSelect(allSigla);
      setupStatsPopup(allSigla, castMap);

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
        attachGlobalChartToggle();

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
