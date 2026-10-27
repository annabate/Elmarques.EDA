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

  function folioImageName(label) {
    return (
      (label || "")
        .replace(/[\[\]]/g, "")
        .replace(/^Fol\.?\s*/i, "fol")
        .replace(/\s+/g, "")
        .toLowerCase() + ".jpg"
    );
  }

  function collectFolios(roots) {
    const seen = new Set();
    const folios = [];

    roots.forEach((root) => {
      if (!root) return;
      root.querySelectorAll("tei-pb").forEach((pb) => {
        const n = attr(pb, "n");
        if (!n || seen.has(n)) return;
        seen.add(n);
        folios.push({
          n,
          image: folioImageName(n),
        });
      });
    });

    return folios;
  }

  function findPb(container, folioN) {
    if (!container) return null;
    return Array.from(container.querySelectorAll("tei-pb")).find(
      (pb) => attr(pb, "n") === folioN,
    );
  }

  function scrollToFolio(container, folioN) {
    const pb = findPb(container, folioN);
    if (!pb) return;
    pb.scrollIntoView({ block: "start", behavior: "smooth" });
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
      option.value = folio.n;
      option.textContent = folio.n;
      option.dataset.image = folio.image;
      selector.appendChild(option);
    });

    let scale = 1;

    function applyZoom() {
      image.style.transform = `scale(${scale})`;
      image.dataset.zoom = scale.toFixed(2);
    }

    function resetZoom() {
      scale = 1;
      applyZoom();
    }

    function showFolio(folioN, { scrollText = true } = {}) {
      const option = Array.from(selector.options).find(
        (item) => item.value === folioN,
      );
      if (!option) return;

      selector.value = folioN;
      image.src = `${baseUrl}/facs/${option.dataset.image}`;
      image.alt = `Facsímil: ${folioN}`;

      if (scrollText) {
        textContainers.forEach((container) =>
          scrollToFolio(container, folioN),
        );
      }
      resetZoom();
    }

    selector.addEventListener("change", () => {
      showFolio(selector.value);
    });

    prevButton.addEventListener("click", () => {
      if (selector.selectedIndex <= 0) return;
      selector.selectedIndex -= 1;
      showFolio(selector.value);
    });

    nextButton.addEventListener("click", () => {
      if (selector.selectedIndex >= selector.options.length - 1) return;
      selector.selectedIndex += 1;
      showFolio(selector.value);
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

    textContainers.forEach((container) => {
      container.addEventListener("click", (event) => {
        const pb = event.target.closest("tei-pb");
        if (!pb) return;
        const n = attr(pb, "n");
        if (n) showFolio(n, { scrollText: false });
      });
    });

    if (folios.length) showFolio(folios[0].n, { scrollText: false });

    return {
      folios,
      showFolio,
      resetZoom,
    };
  }

  global.EMNFacsimile = {
    setup,
    folioImageName,
    collectFolios,
    scrollToFolio,
  };
})(window);
