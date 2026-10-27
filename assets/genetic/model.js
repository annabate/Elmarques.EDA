(function (global) {
  "use strict";

  const LAYER_RANK = { A0: 0, A1: 1, A2: 2, B: 3 };
  const INTERVENTION_LAYERS = ["A1", "A2", "B"];

  function attr(el, name) {
    if (!el || !el.getAttribute) return "";
    return (
      el.getAttribute(name) ||
      el.getAttribute(name.toLowerCase()) ||
      ""
    );
  }

  function anaTokens(el) {
    return attr(el, "ana")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token.replace(/^#/, ""));
  }

  function eventLayer(el) {
    const tokens = anaTokens(el);
    for (const layer of INTERVENTION_LAYERS) {
      if (tokens.includes(`layer-${layer}`)) return layer;
    }
    return "";
  }

  function bFunction(el) {
    return (
      anaTokens(el).find((token) => token.startsWith("B-")) || ""
    );
  }

  function directChild(el, localName) {
    const tag = `tei-${localName}`;
    return Array.from(el.children || []).find(
      (child) => child.tagName && child.tagName.toLowerCase() === tag,
    );
  }

  function normalizeXmlIds(root) {
    root.querySelectorAll("*").forEach((el) => {
      const xmlId =
        el.getAttribute("xml:id") ||
        el.getAttribute("xmlid") ||
        el.getAttribute("data-xml-id");
      if (xmlId && !el.id) el.id = xmlId;
    });
    return root;
  }

  function depth(el) {
    let d = 0;
    let current = el.parentElement;
    while (current) {
      d += 1;
      current = current.parentElement;
    }
    return d;
  }

  function replaceWithReading(mod, useAdd) {
    const reading = directChild(mod, useAdd ? "add" : "del");
    const frag = document.createDocumentFragment();

    if (reading) {
      Array.from(reading.childNodes).forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
    }
    mod.replaceWith(frag);
  }

  function getTargetAnchor(root, pointer) {
    const id = (pointer || "").replace(/^#/, "");
    if (!id) return null;
    return Array.from(root.querySelectorAll("[id]")).find(
      (el) => el.id === id,
    );
  }

  function deleteSpanRange(span, anchor) {
    if (!anchor) return;
    const range = document.createRange();
    range.setStartAfter(span);
    range.setEndBefore(anchor);
    range.deleteContents();
  }

  function resolveSpans(root, targetRank) {
    const spans = Array.from(
      root.querySelectorAll("tei-delspan, tei-addspan"),
    );

    spans.forEach((span) => {
      const layer = eventLayer(span);
      const layerRank = LAYER_RANK[layer];
      const pointer = attr(span, "spanTo") || attr(span, "spanto");
      const anchor = getTargetAnchor(root, pointer);
      const isDeletion = span.tagName.toLowerCase() === "tei-delspan";
      const eventApplies =
        layerRank !== undefined && targetRank >= layerRank;

      const shouldDeleteRange = isDeletion ? eventApplies : !eventApplies;
      if (shouldDeleteRange) deleteSpanRange(span, anchor);
      span.remove();
    });

    root.querySelectorAll("tei-anchor").forEach((anchor) => {
      anchor.hidden = true;
    });
  }

  function resolveUnselectedSpans(root, activeLayers) {
    const active = new Set(activeLayers);
    const maxActiveRank = Math.max(
      -1,
      ...Array.from(active)
        .map((layer) => LAYER_RANK[layer])
        .filter((rank) => rank !== undefined),
    );

    root.querySelectorAll("tei-delspan, tei-addspan").forEach((span) => {
      const layer = eventLayer(span);
      if (!layer || active.has(layer)) return;

      const rank = LAYER_RANK[layer];
      const applyEvent = maxActiveRank > rank;
      const isDeletion = span.tagName.toLowerCase() === "tei-delspan";
      const pointer = attr(span, "spanTo") || attr(span, "spanto");
      const anchor = getTargetAnchor(root, pointer);

      const shouldDeleteRange = isDeletion ? applyEvent : !applyEvent;
      if (shouldDeleteRange) deleteSpanRange(span, anchor);
      span.remove();
    });
  }

  function pruneEmptyStructures(root) {
    [
      "tei-castitem",
      "tei-stage",
      "tei-head",
      "tei-castlist",
    ].forEach((selector) => {
      Array.from(root.querySelectorAll(selector))
        .reverse()
        .forEach((el) => {
          const hasText = (el.textContent || "").trim().length > 0;
          const hasMeaningfulChildren = Array.from(el.children).some(
            (child) =>
              !["tei-anchor", "tei-pb"].includes(
                child.tagName.toLowerCase(),
              ),
          );
          if (!hasText && !hasMeaningfulChildren) el.remove();
        });
    });
  }

  function materializeStage(sourceRoot, stage) {
    const targetRank = LAYER_RANK[stage];
    if (targetRank === undefined) {
      throw new Error(`Unknown reconstruction stage: ${stage}`);
    }

    const root = normalizeXmlIds(sourceRoot.cloneNode(true));
    const mods = Array.from(root.querySelectorAll("tei-mod")).sort(
      (a, b) => depth(b) - depth(a),
    );

    mods.forEach((mod) => {
      const layer = eventLayer(mod);
      const rank = LAYER_RANK[layer];
      if (rank === undefined) return;
      replaceWithReading(mod, targetRank >= rank);
    });

    resolveSpans(root, targetRank);
    pruneEmptyStructures(root);
    root.classList.add("reconstructed-text");
    root.dataset.reconstruction = stage;
    return root;
  }

  function collapseUnselectedMods(root, activeLayers) {
    const active = new Set(activeLayers);
    const maxActiveRank = Math.max(
      -1,
      ...Array.from(active)
        .map((layer) => LAYER_RANK[layer])
        .filter((rank) => rank !== undefined),
    );

    const mods = Array.from(root.querySelectorAll("tei-mod")).sort(
      (a, b) => depth(b) - depth(a),
    );

    mods.forEach((mod) => {
      const layer = eventLayer(mod);
      const rank = LAYER_RANK[layer];
      if (!layer || rank === undefined) return;

      if (!active.has(layer)) {
        // If a later layer is being inspected, silently apply this earlier
        // event so that the later intervention keeps its proper textual base.
        // Otherwise rewind it to its previous reading.
        replaceWithReading(mod, maxActiveRank > rank);
      }
    });
  }

  function decorateVisibleEvents(root) {
    root.querySelectorAll("tei-mod").forEach((mod) => {
      const layer = eventLayer(mod);
      if (!layer) return;

      mod.classList.add("genetic-event", `event-${layer.toLowerCase()}`);
      mod.dataset.eventLayer = layer;

      const fn = bFunction(mod);
      if (fn) mod.dataset.function = fn;

      const seq = attr(mod, "seq");
      if (seq) mod.dataset.seq = seq;

      const marker = document.createElement("span");
      marker.className = "genetic-event-marker";
      marker.textContent = layer;

      const details = [];
      if (fn) details.push(fn.replace(/^B-/, ""));
      if (seq) details.push(`seq. ${seq}`);
      if (details.length) marker.title = details.join(" · ");

      mod.prepend(marker);
    });

    root.querySelectorAll("tei-delspan, tei-addspan").forEach((span) => {
      const layer = eventLayer(span);
      if (!layer) return;
      span.classList.add("genetic-span", `event-${layer.toLowerCase()}`);
      span.dataset.eventLayer = layer;
    });
  }

  function renderInterventions(sourceRoot, activeLayers) {
    const root = normalizeXmlIds(sourceRoot.cloneNode(true));
    collapseUnselectedMods(root, activeLayers);
    resolveUnselectedSpans(root, activeLayers);
    pruneEmptyStructures(root);
    decorateVisibleEvents(root);
    root.classList.add("genetic-intervention-view");
    return root;
  }

  function layerCounts(sourceRoot) {
    const counts = { A1: 0, A2: 0, B: 0 };
    sourceRoot
      .querySelectorAll("tei-mod, tei-delspan, tei-addspan")
      .forEach((event) => {
        const layer = eventLayer(event);
        if (counts[layer] !== undefined) counts[layer] += 1;
      });
    return counts;
  }

  global.EMNGeneticModel = {
    LAYER_RANK,
    eventLayer,
    bFunction,
    materializeStage,
    renderInterventions,
    normalizeXmlIds,
    layerCounts,
  };
})(window);
