(function () {
  "use strict";

  const app = document.getElementById("genetic-app");
  if (!app) return;

  const baseUrl = app.dataset.baseurl || "";
  const geneticSourceUrl = app.dataset.geneticSource;
  const diplomaticSourceUrl = app.dataset.diplomaticSource;

  const geneticPane = document.getElementById("genetic-scroll");
  const diplomaticPane = document.getElementById("diplomatic-scroll");
  const reconstructionSelect = document.getElementById("reconstruction-select");
  const layerInputs = Array.from(
    document.querySelectorAll('input[name="intervention-layer"]'),
  );
  const modeHint = document.getElementById("genetic-mode-hint");
  const modelStatus = document.getElementById("model-status");

  const folioSelector = document.getElementById("folio-selector");
  const facsimileImage = document.getElementById("facsimile-image");
  const verseInput = document.getElementById("verse-input");

  let geneticSource = null;
  let diplomaticSource = null;
  let facsimileController = null;
  let searchGroups = [];
  let searchIndex = -1;
  let syncScrollLock = false;
  let syncScrollTimer = null;
  const textScales = new Map();
  let floatingNoteZ = 200;
  let noteCounter = 0;

  function loadTEI(cetei, url) {
    return new Promise((resolve, reject) => {
      try {
        cetei.getHTML5(url, (data) => resolve(data));
      } catch (error) {
        reject(error);
      }
    });
  }

  function activeLayers() {
    return layerInputs
      .filter((input) => input.checked)
      .map((input) => input.value);
  }

  function setLayerControlsDisabled(disabled) {
    layerInputs.forEach((input) => {
      input.disabled = disabled;
      input.closest("label")?.classList.toggle("is-disabled", disabled);
    });
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function bringFloatingNoteToFront(panel) {
    floatingNoteZ += 1;
    panel.style.zIndex = String(floatingNoteZ);
  }

  function makeFloatingNoteDraggable(panel, handle) {
    let drag = null;

    handle.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      event.preventDefault();
      bringFloatingNoteToFront(panel);

      const rect = panel.getBoundingClientRect();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: rect.left,
        top: rect.top,
      };
      handle.setPointerCapture(event.pointerId);
      panel.classList.add("is-dragging");
    });

    handle.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      const nextLeft = clamp(
        drag.left + event.clientX - drag.startX,
        8,
        Math.max(8, window.innerWidth - Math.min(width, window.innerWidth) - 8),
      );
      const nextTop = clamp(
        drag.top + event.clientY - drag.startY,
        8,
        Math.max(8, window.innerHeight - Math.min(height, window.innerHeight) - 8),
      );
      panel.style.left = `${nextLeft}px`;
      panel.style.top = `${nextTop}px`;
    });

    function endDrag(event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      drag = null;
      panel.classList.remove("is-dragging");
      if (handle.hasPointerCapture(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId);
      }
    }

    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
  }

  function closeFloatingNote(panel, trigger) {
    panel.remove();
    if (trigger?.isConnected) {
      trigger.setAttribute("aria-expanded", "false");
    }
  }

  function openFloatingNote(trigger, content) {
    const noteId = trigger.dataset.noteId;
    const existing = document.querySelector(
      `.floating-note[data-note-id="${noteId}"]`,
    );

    if (existing) {
      bringFloatingNoteToFront(existing);
      return;
    }

    const panel = document.createElement("aside");
    panel.className = "floating-note";
    panel.dataset.noteId = noteId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Nota editorial");

    const header = document.createElement("div");
    header.className = "floating-note-header";

    const title = document.createElement("span");
    title.className = "floating-note-title";
    title.textContent = "Nota editorial";

    const hint = document.createElement("span");
    hint.className = "floating-note-drag-hint";
    hint.textContent = "arrastrar";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "floating-note-close";
    close.setAttribute("aria-label", "Cerrar nota");
    close.textContent = "×";

    const body = document.createElement("div");
    body.className = "floating-note-body";
    body.textContent = content;

    header.append(title, hint, close);
    panel.append(header, body);
    document.body.appendChild(panel);

    bringFloatingNoteToFront(panel);
    trigger.setAttribute("aria-expanded", "true");

    const triggerRect = trigger.getBoundingClientRect();
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const preferredLeft = triggerRect.right + 12;
    const preferredTop = triggerRect.top - 12;

    panel.style.left = `${clamp(
      preferredLeft,
      8,
      Math.max(8, window.innerWidth - Math.min(width, window.innerWidth) - 8),
    )}px`;
    panel.style.top = `${clamp(
      preferredTop,
      8,
      Math.max(8, window.innerHeight - Math.min(height, window.innerHeight) - 8),
    )}px`;

    close.addEventListener("click", () =>
      closeFloatingNote(panel, trigger),
    );
    panel.addEventListener("pointerdown", () =>
      bringFloatingNoteToFront(panel),
    );
    makeFloatingNoteDraggable(panel, header);
  }

  function decorateNotes(root) {
    root.querySelectorAll("tei-note").forEach((note) => {
      if (note.dataset.decorated === "true") return;
      const content = note.textContent.trim();
      note.textContent = "";
      note.dataset.decorated = "true";
      note.classList.add("edition-note");

      const button = document.createElement("button");
      button.type = "button";
      button.className = "note-trigger";
      button.textContent = "·";
      button.dataset.noteId = `note-${++noteCounter}`;
      button.setAttribute("aria-label", "Abrir nota editorial");
      button.setAttribute("aria-expanded", "false");

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        openFloatingNote(button, content);
      });

      note.append(button);
    });
  }

  function closeNotesOnOutsideClick() {
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const panels = Array.from(
        document.querySelectorAll(".floating-note"),
      );
      if (!panels.length) return;
      const topmost = panels.sort(
        (a, b) =>
          Number.parseInt(a.style.zIndex || "0", 10) -
          Number.parseInt(b.style.zIndex || "0", 10),
      ).pop();
      topmost?.remove();
    });
  }

  function decorateLines(root) {
    root.querySelectorAll("tei-l[n]").forEach((line) => {
      line.dataset.verse = line.getAttribute("n");
      line.title = `v. ${line.getAttribute("n")}`;
    });
  }

  function decorateLongSpans(root) {
    root.querySelectorAll("tei-delspan, tei-addspan").forEach((span) => {
      const layer = window.EMNGeneticModel.eventLayer(span);
      if (!layer) return;
      span.dataset.eventLayer = layer;
      span.title =
        span.tagName.toLowerCase() === "tei-delspan"
          ? `${layer}: supresión extensa`
          : `${layer}: adición extensa`;
    });
  }

  function prepareRenderedRoot(root) {
    decorateNotes(root);
    decorateLines(root);
    decorateLongSpans(root);
    return root;
  }

  function clearPane(pane) {
    while (pane.firstChild) pane.removeChild(pane.firstChild);
  }

  function renderGenetic() {
    if (!geneticSource) return;
    clearSearch();

    const mode = reconstructionSelect.value;
    let rendered;

    if (mode === "genesis") {
      rendered = window.EMNGeneticModel.renderInterventions(
        geneticSource,
        activeLayers(),
      );
      setLayerControlsDisabled(false);
      modeHint.textContent =
        "Génesis del texto · intervenciones A1, A2 y B visibles.";
    } else {
      rendered = window.EMNGeneticModel.materializeStage(
        geneticSource,
        mode,
      );
      setLayerControlsDisabled(true);
      const labels = {
        A0: "A0 · primera redacción",
        A1: "A0 + A1 · estado tras las correcciones inmediatas",
        A2: "A0 + A1 + A2 · último estado autorial",
        B: "A0 + A1 + A2 + B · estado documental",
      };
      modeHint.textContent = labels[mode];
    }

    clearPane(geneticPane);
    geneticPane.appendChild(prepareRenderedRoot(rendered));
  }

  function renderDiplomatic() {
    if (!diplomaticSource) return;
    clearPane(diplomaticPane);
    diplomaticPane.appendChild(
      prepareRenderedRoot(diplomaticSource.cloneNode(true)),
    );
  }

  function lineForVerse(pane, verse) {
    const value = String(verse || "").trim();
    if (!value) return null;
    return Array.from(pane.querySelectorAll("tei-l[n]")).find(
      (line) => line.getAttribute("n") === value,
    ) || null;
  }

  function scrollElementIntoPane(element, pane, behavior = "smooth") {
    if (!element || !pane) return;
    const paneRect = pane.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const target =
      pane.scrollTop +
      elementRect.top -
      paneRect.top -
      Math.min(90, pane.clientHeight * 0.18);

    pane.scrollTo({
      top: Math.max(0, target),
      behavior,
    });
  }

  function alignPaneToVerse(pane, verse, behavior = "auto") {
    const line = lineForVerse(pane, verse);
    if (!line) return null;
    scrollElementIntoPane(line, pane, behavior);
    return line;
  }

  function folioForElement(container, element) {
    if (!container || !element) return "";
    let current = "";

    for (const pb of container.querySelectorAll("tei-pb")) {
      const position = pb.compareDocumentPosition(element);
      if (
        pb === element ||
        position & Node.DOCUMENT_POSITION_FOLLOWING
      ) {
        current = pb.getAttribute("n") || "";
      } else {
        break;
      }
    }
    return current;
  }

  function syncFacsimileToElement(container, element) {
    if (!facsimileController || !element) return;
    const folio = folioForElement(container, element);
    if (!folio) return;
    facsimileController.showFolio(folio, {
      scrollText: false,
      resetView: false,
    });
  }

  function goToVerse(verse) {
    const value = String(verse || "").trim();
    if (!value) return;

    const geneticLine = alignPaneToVerse(geneticPane, value, "smooth");
    const diplomaticLine = alignPaneToVerse(
      diplomaticPane,
      value,
      "smooth",
    );

    [geneticLine, diplomaticLine].filter(Boolean).forEach((line) => {
      line.classList.add("verse-target");
      window.setTimeout(
        () => line.classList.remove("verse-target"),
        1800,
      );
    });

    if (geneticLine) {
      syncFacsimileToElement(geneticPane, geneticLine);
    } else if (diplomaticLine) {
      syncFacsimileToElement(diplomaticPane, diplomaticLine);
    }
  }

  function unwrapSearchMarks() {
    document.querySelectorAll("mark.search-hit").forEach((mark) => {
      mark.replaceWith(document.createTextNode(mark.textContent));
    });
    [geneticPane, diplomaticPane].forEach((pane) => pane.normalize());
  }

  function updateSearchControls() {
    document
      .querySelector(".search-control")
      ?.classList.toggle("has-results", searchGroups.length > 0);
  }

  function clearSearch() {
    unwrapSearchMarks();
    searchGroups = [];
    searchIndex = -1;
    document.getElementById("search-count").textContent = "";
    updateSearchControls();
  }

  function verseForSearchNode(element) {
    const directLine = element.closest("tei-l[n]");
    if (directLine) return directLine.getAttribute("n") || "";

    const speech = element.closest("tei-sp");
    const speechLine = speech?.querySelector("tei-l[n]");
    return speechLine?.getAttribute("n") || "";
  }

  function markMatches(container, query, source) {
    const matches = [];
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (
            !parent ||
            parent.closest(
              "button, script, style, .genetic-event-marker",
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    const needle = query.toLocaleLowerCase("es");

    nodes.forEach((node) => {
      const text = node.nodeValue;
      const lower = text.toLocaleLowerCase("es");
      let cursor = 0;
      let index = lower.indexOf(needle);
      if (index < 0) return;

      const frag = document.createDocumentFragment();

      while (index >= 0) {
        if (index > cursor) {
          frag.appendChild(
            document.createTextNode(text.slice(cursor, index)),
          );
        }

        const mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = text.slice(index, index + query.length);
        mark.dataset.searchSource = source;
        frag.appendChild(mark);

        matches.push(mark);

        cursor = index + query.length;
        index = lower.indexOf(needle, cursor);
      }

      if (cursor < text.length) {
        frag.appendChild(document.createTextNode(text.slice(cursor)));
      }

      node.replaceWith(frag);
    });

    matches.forEach((mark) => {
      mark.dataset.searchVerse = verseForSearchNode(mark);
    });

    return matches;
  }

  function bucketSearchHits(hits) {
    const byVerse = new Map();
    const unaligned = [];

    hits.forEach((hit) => {
      const verse = hit.dataset.searchVerse || "";
      if (!verse) {
        unaligned.push(hit);
        return;
      }
      if (!byVerse.has(verse)) byVerse.set(verse, []);
      byVerse.get(verse).push(hit);
    });

    return { byVerse, unaligned };
  }

  function verseSortValue(value) {
    const numeric = Number.parseFloat(value);
    return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
  }

  function buildSearchGroups(geneticHits, diplomaticHits) {
    const genetic = bucketSearchHits(geneticHits);
    const diplomatic = bucketSearchHits(diplomaticHits);

    const verses = Array.from(
      new Set([
        ...genetic.byVerse.keys(),
        ...diplomatic.byVerse.keys(),
      ]),
    ).sort((a, b) => {
      const numeric = verseSortValue(a) - verseSortValue(b);
      return numeric || a.localeCompare(b, "es");
    });

    const groups = [];

    verses.forEach((verse) => {
      const left = genetic.byVerse.get(verse) || [];
      const right = diplomatic.byVerse.get(verse) || [];
      const count = Math.max(left.length, right.length);

      for (let i = 0; i < count; i += 1) {
        groups.push({
          verse,
          genetic: left[i] || null,
          diplomatic: right[i] || null,
        });
      }
    });

    const unalignedCount = Math.max(
      genetic.unaligned.length,
      diplomatic.unaligned.length,
    );

    for (let i = 0; i < unalignedCount; i += 1) {
      groups.push({
        verse: "",
        genetic: genetic.unaligned[i] || null,
        diplomatic: diplomatic.unaligned[i] || null,
      });
    }

    return groups;
  }

  function showSearchMatch(index) {
    if (!searchGroups.length) return;

    document
      .querySelectorAll("mark.search-hit-current")
      .forEach((mark) => mark.classList.remove("search-hit-current"));

    searchIndex =
      ((index % searchGroups.length) + searchGroups.length) %
      searchGroups.length;

    const group = searchGroups[searchIndex];
    const entries = [
      [group.genetic, geneticPane],
      [group.diplomatic, diplomaticPane],
    ];

    entries.forEach(([mark, pane]) => {
      if (mark) {
        mark.classList.add("search-hit-current");
        scrollElementIntoPane(mark, pane, "smooth");
      } else if (group.verse) {
        alignPaneToVerse(pane, group.verse, "smooth");
      }
    });

    const reference =
      group.genetic || group.diplomatic;
    if (reference) {
      const pane =
        reference.dataset.searchSource === "genetic"
          ? geneticPane
          : diplomaticPane;
      syncFacsimileToElement(pane, reference);
    }

    const verseLabel = group.verse ? ` · v. ${group.verse}` : "";
    document.getElementById("search-count").textContent =
      `${searchIndex + 1}/${searchGroups.length}${verseLabel}`;
  }

  function runSearch() {
    clearSearch();
    const query = document.getElementById("search-input").value.trim();
    if (!query) return;

    const geneticHits = markMatches(
      geneticPane,
      query,
      "genetic",
    );
    const diplomaticHits = markMatches(
      diplomaticPane,
      query,
      "diplomatic",
    );

    searchGroups = buildSearchGroups(geneticHits, diplomaticHits);

    updateSearchControls();
    if (searchGroups.length) showSearchMatch(0);
    else document.getElementById("search-count").textContent = "0";
  }

  function currentTextReference(pane) {
    const lines = Array.from(pane.querySelectorAll("tei-l[n]"));
    if (!lines.length) return null;

    const paneRect = pane.getBoundingClientRect();
    const targetY = paneRect.top + Math.min(90, pane.clientHeight * 0.18);

    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    lines.forEach((line) => {
      const rect = line.getBoundingClientRect();
      if (rect.bottom < paneRect.top || rect.top > paneRect.bottom) return;

      const distance = Math.abs(rect.top - targetY);
      if (distance < bestDistance) {
        best = line;
        bestDistance = distance;
      }
    });

    if (!best) return null;

    return {
      line: best,
      verse: best.getAttribute("n") || "",
      folio: folioForElement(pane, best),
    };
  }

  function syncFromTextPane(sourcePane) {
    const syncToggle = document.getElementById("sync-views");
    if (!syncToggle?.checked || syncScrollLock) return;

    const reference = currentTextReference(sourcePane);
    if (!reference?.verse) return;

    syncScrollLock = true;

    const targetPane =
      sourcePane === geneticPane ? diplomaticPane : geneticPane;

    alignPaneToVerse(targetPane, reference.verse, "auto");

    if (facsimileController && reference.folio) {
      facsimileController.showFolio(reference.folio, {
        scrollText: false,
        resetView: false,
      });
    }

    requestAnimationFrame(() => {
      syncScrollLock = false;
    });
  }

  function setupViewSynchronization() {
    [geneticPane, diplomaticPane].forEach((pane) => {
      pane.addEventListener(
        "scroll",
        () => {
          if (syncScrollLock) return;
          window.clearTimeout(syncScrollTimer);
          syncScrollTimer = window.setTimeout(
            () => syncFromTextPane(pane),
            70,
          );
        },
        { passive: true },
      );
    });
  }

  function setupTextSizing() {
    document
      .querySelectorAll(".text-size-controls")
      .forEach((control) => {
        const target = document.getElementById(
          control.dataset.textTarget,
        );
        if (!target) return;

        textScales.set(target.id, 1);

        control.querySelectorAll("[data-text-size]").forEach((button) => {
          button.addEventListener("click", () => {
            const delta = Number(button.dataset.textSize || "0");
            const current = textScales.get(target.id) || 1;
            const next = clamp(
              Math.round((current + delta * 0.1) * 10) / 10,
              0.8,
              1.5,
            );
            textScales.set(target.id, next);
            target.style.setProperty("--text-scale", String(next));
            target.dataset.textScale = String(next);
          });
        });
      });
  }

  const editionGrid = document.getElementById("edition-grid");

  function visiblePanes() {
    return Array.from(
      editionGrid.querySelectorAll(":scope > .edition-pane"),
    ).filter((pane) => !pane.classList.contains("is-hidden-pane"));
  }

  function setPaneWeight(pane, weight) {
    const safeWeight = Math.max(0.25, Number(weight) || 1);
    pane.dataset.flexWeight = String(safeWeight);
    pane.style.setProperty("--pane-weight", String(safeWeight));
  }

  function equalizeVisiblePanes() {
    visiblePanes().forEach((pane) => setPaneWeight(pane, 1));
    rebuildPaneResizers();
  }

  function movePane(pane, direction) {
    const panes = visiblePanes();
    const index = panes.indexOf(pane);
    if (index < 0) return;

    if (direction === "left" && index > 0) {
      editionGrid.insertBefore(pane, panes[index - 1]);
    } else if (direction === "right" && index < panes.length - 1) {
      editionGrid.insertBefore(panes[index + 1], pane);
    } else {
      return;
    }

    rebuildPaneResizers();
  }


  function resizePanePair(leftPane, rightPane, startEvent) {
    if (window.matchMedia("(max-width: 760px)").matches) return;

    const leftRect = leftPane.getBoundingClientRect();
    const rightRect = rightPane.getBoundingClientRect();
    const total = leftRect.width + rightRect.width;
    const minWidth = Math.min(220, total * 0.32);
    const startX = startEvent.clientX;

    document.body.classList.add("is-resizing-panes");

    function onMove(event) {
      const delta = event.clientX - startX;
      const leftWidth = clamp(
        leftRect.width + delta,
        minWidth,
        total - minWidth,
      );
      const rightWidth = total - leftWidth;
      setPaneWeight(leftPane, leftWidth);
      setPaneWeight(rightPane, rightWidth);
    }

    function onEnd() {
      document.body.classList.remove("is-resizing-panes");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd, { once: true });
    window.addEventListener("pointercancel", onEnd, { once: true });
  }

  function makePaneResizer(leftPane, rightPane) {
    const resizer = document.createElement("div");
    resizer.className = "pane-resizer";
    resizer.setAttribute("role", "separator");
    resizer.setAttribute("aria-orientation", "vertical");
    resizer.setAttribute("aria-label", "Redimensionar paneles");
    resizer.tabIndex = 0;

    resizer.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      resizePanePair(leftPane, rightPane, event);
    });

    resizer.addEventListener("dblclick", () => {
      equalizeVisiblePanes();
    });

    resizer.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();

      const leftRect = leftPane.getBoundingClientRect();
      const rightRect = rightPane.getBoundingClientRect();
      const total = leftRect.width + rightRect.width;
      const step = event.shiftKey ? 48 : 20;
      const delta = event.key === "ArrowLeft" ? -step : step;
      const minWidth = Math.min(220, total * 0.32);
      const leftWidth = clamp(
        leftRect.width + delta,
        minWidth,
        total - minWidth,
      );
      setPaneWeight(leftPane, leftWidth);
      setPaneWeight(rightPane, total - leftWidth);
    });

    return resizer;
  }

  function rebuildPaneResizers() {
    editionGrid
      .querySelectorAll(":scope > .pane-resizer")
      .forEach((resizer) => resizer.remove());

    const panes = visiblePanes();
    panes.forEach((pane) => {
      if (!pane.dataset.flexWeight) setPaneWeight(pane, 1);
    });

    panes.slice(0, -1).forEach((pane, index) => {
      pane.after(makePaneResizer(pane, panes[index + 1]));
    });

  }

  function clearPaneDropHints() {
    editionGrid
      .querySelectorAll(".pane-drop-before, .pane-drop-after")
      .forEach((pane) =>
        pane.classList.remove("pane-drop-before", "pane-drop-after"),
      );
  }

  function setupPaneDragging() {
    editionGrid.querySelectorAll(":scope > .edition-pane").forEach((pane) => {
      const header = pane.querySelector(".pane-header");
      const handle = pane.querySelector(".pane-title");
      if (!header || !handle || handle.dataset.dragReady === "true") return;

      handle.dataset.dragReady = "true";
      handle.draggable = true;
      handle.tabIndex = 0;
      handle.setAttribute("role", "button");
      handle.setAttribute("aria-label", "Arrastrar para cambiar la posición del panel");

      handle.addEventListener("dragstart", (event) => {
        if (window.matchMedia("(max-width: 760px)").matches) {
          event.preventDefault();
          return;
        }
        pane.classList.add("is-pane-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", pane.id);
        editionGrid
          .querySelectorAll(":scope > .pane-resizer")
          .forEach((resizer) => resizer.remove());
      });

      handle.addEventListener("dragend", () => {
        pane.classList.remove("is-pane-dragging");
        clearPaneDropHints();
        rebuildPaneResizers();
      });

      pane.addEventListener("dragover", (event) => {
        if (!document.querySelector(".is-pane-dragging")) return;
        event.preventDefault();
        const rect = pane.getBoundingClientRect();
        const before = event.clientX < rect.left + rect.width / 2;
        clearPaneDropHints();
        pane.classList.add(before ? "pane-drop-before" : "pane-drop-after");
      });

      pane.addEventListener("drop", (event) => {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text/plain");
        const draggedPane = document.getElementById(draggedId);
        if (!draggedPane || draggedPane === pane) return;

        const rect = pane.getBoundingClientRect();
        const before = event.clientX < rect.left + rect.width / 2;
        if (before) pane.before(draggedPane);
        else pane.after(draggedPane);

        clearPaneDropHints();
        rebuildPaneResizers();
      });

      handle.addEventListener("keydown", (event) => {
        if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) {
          return;
        }
        event.preventDefault();
        movePane(
          pane,
          event.key === "ArrowLeft" ? "left" : "right",
        );
        handle.focus();
      });
    });
  }

  function updatePaneLayout({ equalize = false } = {}) {
    const panes = visiblePanes();

    editionGrid.classList.toggle("single-pane", panes.length === 1);
    editionGrid.classList.toggle("two-pane", panes.length === 2);
    editionGrid.classList.toggle("three-pane", panes.length >= 3);

    if (equalize) {
      equalizeVisiblePanes();
    } else {
      rebuildPaneResizers();
    }
  }

  function setupToolbar() {
    reconstructionSelect.addEventListener("change", renderGenetic);
    layerInputs.forEach((input) =>
      input.addEventListener("change", renderGenetic),
    );

    verseInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") goToVerse(verseInput.value);
    });

    document
      .getElementById("search-input")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") runSearch();
        if (event.key === "Escape") {
          event.currentTarget.value = "";
          clearSearch();
        }
      });
    document
      .getElementById("search-next")
      .addEventListener("click", () => showSearchMatch(searchIndex + 1));
    document
      .getElementById("search-prev")
      .addEventListener("click", () => showSearchMatch(searchIndex - 1));
    document
      .getElementById("search-clear")
      .addEventListener("click", () => {
        document.getElementById("search-input").value = "";
        clearSearch();
      });

    document.querySelectorAll("[data-toggle-pane]").forEach((input) => {
      input.addEventListener("change", () => {
        const pane = document.getElementById(input.dataset.togglePane);
        pane?.classList.toggle("is-hidden-pane", !input.checked);
        if (input.checked && pane) setPaneWeight(pane, 1);
        updatePaneLayout({ equalize: true });
      });
    });

    setupPaneDragging();
    setupTextSizing();
    setupViewSynchronization();
    updateSearchControls();
    updatePaneLayout({ equalize: true });

    const facsimilePanel = document.getElementById("facsimile-pane");
    const geneticPanel = document.getElementById("genetic-pane");
    if (
      facsimilePanel &&
      geneticPanel &&
      !facsimilePanel.classList.contains("is-hidden-pane") &&
      !geneticPanel.classList.contains("is-hidden-pane")
    ) {
      setPaneWeight(facsimilePanel, 0.9);
      setPaneWeight(geneticPanel, 1.1);
      rebuildPaneResizers();
    }
  }

  function keepFirstAct(root) {
    const clone = root.cloneNode(true);
    const acts = Array.from(
      clone.querySelectorAll(
        'tei-div[type="act"], tei-div[type="jornada"], tei-div[subtype="ACTO"], tei-div[subtype="acto"]',
      ),
    );
    acts.slice(1).forEach((act) => act.remove());
    return clone;
  }

  async function boot() {
    modelStatus.textContent = "Cargando TEI…";

    const [genetic, diplomatic] = await Promise.all([
      loadTEI(new CETEI(), geneticSourceUrl),
      loadTEI(new CETEI(), diplomaticSourceUrl),
    ]);

    geneticSource =
      window.EMNGeneticModel.normalizeXmlIds(genetic.cloneNode(true));
    diplomaticSource =
      window.EMNGeneticModel.normalizeXmlIds(keepFirstAct(diplomatic));

    const counts = window.EMNGeneticModel.layerCounts(geneticSource);
    modelStatus.textContent =
      `Acto I validado · A1: ${counts.A1} · A2: ${counts.A2} · B: ${counts.B}`;
    modelStatus.hidden = true;

    renderGenetic();
    renderDiplomatic();
    setupToolbar();
    closeNotesOnOutsideClick();

    facsimileController = window.EMNFacsimile.setup({
      selector: folioSelector,
      image: facsimileImage,
      prevButton: document.getElementById("folio-prev"),
      nextButton: document.getElementById("folio-next"),
      zoomInButton: document.getElementById("zoom-in"),
      zoomOutButton: document.getElementById("zoom-out"),
      resetZoomButton: document.getElementById("zoom-reset"),
      baseUrl,
      textContainers: [geneticPane, diplomaticPane],
      roots: [geneticSource, diplomaticSource],
    });

    app.classList.add("is-ready");
  }

  boot().catch((error) => {
    console.error(error);
    modelStatus.hidden = false;
    modelStatus.textContent =
      "No se ha podido cargar la edición genética.";
    app.classList.add("has-error");
  });
})();
