(function (global) {
  "use strict";

  function attr(el, name) {
    if (!el) return "";
    return (
      el.getAttribute(name) ||
      el.getAttribute(name.toLowerCase()) ||
      ""
    );
  }

  function canonicalFolio(label) {
    return String(label || "")
      .toLocaleLowerCase("es")
      .replace(/[\[\]]/g, "")
      .replace(/^fol\.?\s*/i, "")
      .replace(/\s+/g, "")
      .replace(/\.+/g, ".")
      .replace(/^n\.n\.([rv])\.?$/, "nn$1")
      .replace(/^guarda([rv])\.?$/, "guarda$1")
      .replace(/^(\d+)([rv])\.?$/, "$1$2");
  }

  function folioLabel(canonical) {
    if (/^\d+[rv]$/.test(canonical)) {
      return `Fol. ${canonical}`;
    }
    if (canonical === "nnr") return "Fol. n. n. r.";
    if (canonical === "nnv") return "Fol. n. n. v.";
    if (canonical === "guardar") return "Fol. guarda r.";
    if (canonical === "guardav") return "Fol. guarda v.";
    return canonical || "Folio";
  }

  function folioImageName(label) {
    const canonical = canonicalFolio(label);

    if (/^\d+[rv]$/.test(canonical)) {
      return `fol${canonical}.jpg`;
    }

    const special = {
      nnr: "foln.n.r..jpg",
      nnv: "foln.n.v..jpg",
      guardar: "folguarda.jpg",
      guardav: "folguardav..jpg",
    };

    return special[canonical] || "placeholder.jpg";
  }

  function collectFolios(roots) {
    const seen = new Set();
    const folios = [];

    roots.forEach((root) => {
      if (!root) return;
      root.querySelectorAll("tei-pb").forEach((pb) => {
        const raw = attr(pb, "n");
        const canonical = canonicalFolio(raw);
        if (!canonical || seen.has(canonical)) return;

        seen.add(canonical);
        folios.push({
          key: canonical,
          n: raw,
          label: folioLabel(canonical),
          image: folioImageName(canonical),
        });
      });
    });

    return folios;
  }

  function findPb(container, folioN) {
    if (!container) return null;
    const target = canonicalFolio(folioN);

    return Array.from(container.querySelectorAll("tei-pb")).find(
      (pb) => canonicalFolio(attr(pb, "n")) === target,
    ) || null;
  }

  function scrollToFolio(container, folioN) {
    const pb = findPb(container, folioN);
    if (!pb) return;
    const containerRect = container.getBoundingClientRect();
    const pbRect = pb.getBoundingClientRect();
    container.scrollTo({
      top: Math.max(
        0,
        container.scrollTop + pbRect.top - containerRect.top - 24,
      ),
      behavior: "smooth",
    });
  }

  function clamp01(value) {
    return Math.min(1, Math.max(0, value));
  }

  function setup(options) {
    const {
      selector,
      image,
      prevButton,
      nextButton,
      zoomInButton,
      zoomOutButton,
      resetZoomButton,
      baseUrl,
      textContainers,
      roots,
    } = options;

    const folios = collectFolios(roots);
    selector.innerHTML = "";

    folios.forEach((folio) => {
      const option = document.createElement("option");
      option.value = folio.key;
      option.textContent = folio.label;
      option.dataset.rawFolio = folio.n;
      option.dataset.image = folio.image;
      selector.appendChild(option);
    });

    const stage = image.closest(".facsimile-stage");
    let scale = 1;
    let fittedWidth = 0;
    let resetOnNextLoad = true;
    let panState = null;
    let zoomInteraction = false;

    function computeFittedWidth() {
      if (!stage || !image.naturalWidth || !image.naturalHeight) return 0;

      const availableWidth = Math.max(120, stage.clientWidth - 28);
      const availableHeight = Math.max(160, stage.clientHeight - 28);
      const widthScale = availableWidth / image.naturalWidth;
      const heightScale = availableHeight / image.naturalHeight;
      const fitScale = Math.min(widthScale, heightScale, 1);

      return Math.max(120, Math.round(image.naturalWidth * fitScale));
    }

    function applyZoom() {
      if (!fittedWidth) fittedWidth = computeFittedWidth();
      if (!fittedWidth) return;

      const width = Math.round(fittedWidth * scale);
      image.style.width = `${width}px`;
      image.style.height = "auto";
      image.style.maxWidth = "none";
      image.style.transform = "none";
      image.dataset.zoom = scale.toFixed(2);
      stage?.classList.toggle("is-pannable", scale > 1.05);

      const percentage = Math.round(scale * 100);
      resetZoomButton.textContent = "↺";
      resetZoomButton.hidden = scale <= 1.05;
      resetZoomButton.title =
        scale === 1
          ? "Facsímil ajustado al panel"
          : `Volver al ajuste del panel (zoom actual: ${percentage} %)`;
    }

    function refit({ preserveZoom = true } = {}) {
      fittedWidth = computeFittedWidth();
      if (!preserveZoom) scale = 1;
      applyZoom();
    }

    function resetZoom() {
      scale = 1;
      refit({ preserveZoom: true });
      if (stage) {
        stage.scrollLeft = 0;
        stage.scrollTop = 0;
      }
    }

    function showFolio(
      folioN,
      { scrollText = true, resetView = true } = {},
    ) {
      const canonical = canonicalFolio(folioN);
      const option = Array.from(selector.options).find(
        (item) => item.value === canonical,
      );
      if (!option) return;

      const currentFolio = image.dataset.currentFolio || "";
      const sameFolio =
        currentFolio === canonical && Boolean(image.currentSrc);

      selector.value = canonical;

      if (!sameFolio) {
        resetOnNextLoad = resetView;
        image.dataset.currentFolio = canonical;
        image.src = `${baseUrl}/facs/${option.dataset.image}`;
        image.alt = `Facsímil: ${option.textContent}`;
      } else if (resetView) {
        resetZoom();
      }

      if (scrollText) {
        textContainers.forEach((container) =>
          scrollToFolio(container, canonical),
        );
      }
    }

    selector.addEventListener("change", () => {
      showFolio(selector.value);
    });

    prevButton.addEventListener("click", () => {
      const nextIndex = selector.selectedIndex - 1;
      if (nextIndex < 0) return;
      showFolio(selector.options[nextIndex].value);
    });

    nextButton.addEventListener("click", () => {
      const nextIndex = selector.selectedIndex + 1;
      if (nextIndex >= selector.options.length) return;
      showFolio(selector.options[nextIndex].value);
    });

    zoomInButton.addEventListener("click", () => {
      scale = Math.min(4, scale + 0.25);
      applyZoom();
    });

    zoomOutButton.addEventListener("click", () => {
      scale = Math.max(0.5, scale - 0.25);
      applyZoom();
    });

    resetZoomButton.addEventListener("click", resetZoom);

    image.addEventListener("load", () => {
      refit({ preserveZoom: !resetOnNextLoad });
      resetOnNextLoad = true;
      if (stage) {
        stage.scrollLeft = 0;
        stage.scrollTop = 0;
      }
    });

    if (stage && "ResizeObserver" in window) {
      const observer = new ResizeObserver(() => {
        // When zoomed, scrollbars alter the stage's client box by a few
        // pixels. Re-fitting in response would create a visible feedback
        // loop ("flicker"). Only recompute the fit in the base view.
        if (zoomInteraction || scale > 1.05) return;
        refit({ preserveZoom: true });
      });
      observer.observe(stage);
    }

    image.addEventListener(
      "wheel",
      (event) => {
        if (!event.ctrlKey && !event.metaKey) return;
        event.preventDefault();
        scale = Math.max(
          0.5,
          Math.min(4, scale + (event.deltaY < 0 ? 0.15 : -0.15)),
        );
        applyZoom();
      },
      { passive: false },
    );

    image.draggable = false;

    image.addEventListener("dblclick", (event) => {
      if (!stage) return;

      event.preventDefault();
      event.stopPropagation();

      const rect = image.getBoundingClientRect();
      const relativeX = clamp01(
        (event.clientX - rect.left) / rect.width,
      );
      const relativeY = clamp01(
        (event.clientY - rect.top) / rect.height,
      );

      zoomInteraction = true;
      scale = Math.min(4, scale <= 1.05 ? 2 : scale * 1.5);
      applyZoom();

      requestAnimationFrame(() => {
        const targetX =
          relativeX * image.offsetWidth - stage.clientWidth / 2;
        const targetY =
          relativeY * image.offsetHeight - stage.clientHeight / 2;

        // Instant repositioning avoids a second visual movement after
        // the image itself has already changed size.
        stage.scrollLeft = Math.max(0, targetX);
        stage.scrollTop = Math.max(0, targetY);

        requestAnimationFrame(() => {
          zoomInteraction = false;
        });
      });
    });

    if (stage) {
      stage.addEventListener("pointerdown", (event) => {
        if (scale <= 1.05 || event.button !== 0) return;
        if (event.target !== image) return;

        panState = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          left: stage.scrollLeft,
          top: stage.scrollTop,
        };
        stage.setPointerCapture(event.pointerId);
        stage.classList.add("is-panning");
      });

      stage.addEventListener("pointermove", (event) => {
        if (!panState || event.pointerId !== panState.pointerId) return;
        stage.scrollLeft =
          panState.left - (event.clientX - panState.x);
        stage.scrollTop =
          panState.top - (event.clientY - panState.y);
      });

      function endPan(event) {
        if (!panState || event.pointerId !== panState.pointerId) return;
        panState = null;
        stage.classList.remove("is-panning");
        if (stage.hasPointerCapture(event.pointerId)) {
          stage.releasePointerCapture(event.pointerId);
        }
      }

      stage.addEventListener("pointerup", endPan);
      stage.addEventListener("pointercancel", endPan);
    }

    textContainers.forEach((container) => {
      container.addEventListener("click", (event) => {
        const pb = event.target.closest("tei-pb");
        if (!pb) return;
        const n = attr(pb, "n");
        if (n) showFolio(n, { scrollText: false });
      });
    });

    if (folios.length) showFolio(folios[0].key, { scrollText: false });

    return {
      folios,
      showFolio,
      resetZoom,
      getScale: () => scale,
    };
  }

  global.EMNFacsimile = {
    setup,
    canonicalFolio,
    folioLabel,
    folioImageName,
    collectFolios,
    scrollToFolio,
  };
})(window);
