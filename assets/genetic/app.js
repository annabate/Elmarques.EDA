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
  let searchMatches = [];
  let searchIndex = -1;

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
      button.textContent = "✶";
      button.setAttribute("aria-label", "Mostrar nota");
      button.setAttribute("aria-expanded", "false");

      const popover = document.createElement("span");
      popover.className = "note-popover";
      popover.textContent = content;
      popover.hidden = true;

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = popover.hidden;
        document
          .querySelectorAll(".note-popover:not([hidden])")
          .forEach((other) => {
            if (other !== popover) {
              other.hidden = true;
              other.previousElementSibling?.setAttribute(
                "aria-expanded",
                "false",
              );
            }
          });
        popover.hidden = !willOpen;
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });

      note.append(button, popover);
    });
  }

  function closeNotesOnOutsideClick() {
    document.addEventListener("click", (event) => {
      if (event.target.closest(".edition-note")) return;
      document.querySelectorAll(".note-popover").forEach((popover) => {
        popover.hidden = true;
        popover.previousElementSibling?.setAttribute(
          "aria-expanded",
          "false",
        );
      });
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
        "Vista genética: se muestran únicamente los eventos seleccionados; las demás capas se reconstruyen silenciosamente para conservar su contexto.";
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
      modeHint.textContent = `Reconstrucción: ${labels[mode]}`;
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

  function goToVerse(verse) {
    const value = String(verse || "").trim();
    if (!value) return;

    [geneticPane, diplomaticPane].forEach((pane) => {
      const line = Array.from(pane.querySelectorAll("tei-l[n]")).find(
        (item) => item.getAttribute("n") === value,
      );
      if (line) {
        line.classList.add("verse-target");
        line.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(
          () => line.classList.remove("verse-target"),
          1800,
        );
      }
    });
  }

  function unwrapSearchMarks() {
    document.querySelectorAll("mark.search-hit").forEach((mark) => {
      mark.replaceWith(document.createTextNode(mark.textContent));
    });
    [geneticPane, diplomaticPane].forEach((pane) => pane.normalize());
  }

  function clearSearch() {
    unwrapSearchMarks();
    searchMatches = [];
    searchIndex = -1;
    document.getElementById("search-count").textContent = "";
  }

  function markMatches(container, query) {
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
              "button, script, style, .note-popover, .genetic-event-marker",
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

    return matches;
  }

  function showSearchMatch(index) {
    if (!searchMatches.length) return;
    searchMatches.forEach((item) =>
      item.classList.remove("search-hit-current"),
    );
    searchIndex =
      ((index % searchMatches.length) + searchMatches.length) %
      searchMatches.length;
    const current = searchMatches[searchIndex];
    current.classList.add("search-hit-current");
    current.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("search-count").textContent =
      `${searchIndex + 1}/${searchMatches.length}`;
  }

  function runSearch() {
    clearSearch();
    const query = document.getElementById("search-input").value.trim();
    if (!query) return;

    searchMatches = [
      ...markMatches(geneticPane, query),
      ...markMatches(diplomaticPane, query),
    ];

    if (searchMatches.length) showSearchMatch(0);
    else document.getElementById("search-count").textContent = "0";
  }

  function setupToolbar() {
    reconstructionSelect.addEventListener("change", renderGenetic);
    layerInputs.forEach((input) =>
      input.addEventListener("change", renderGenetic),
    );

    document
      .getElementById("go-verse")
      .addEventListener("click", () => goToVerse(verseInput.value));

    verseInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") goToVerse(verseInput.value);
    });

    document
      .getElementById("search-button")
      .addEventListener("click", runSearch);
    document
      .getElementById("search-input")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") runSearch();
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
        document
          .getElementById("edition-grid")
          .classList.toggle(
            "single-pane",
            document.querySelectorAll(
              "#edition-grid > .edition-pane:not(.is-hidden-pane)",
            ).length === 1,
          );
      });
    });
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
    modelStatus.textContent =
      "No se ha podido cargar la edición genética.";
    app.classList.add("has-error");
  });
})();
