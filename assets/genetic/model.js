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
      if (attr(span, "type") === "material-group") { span.remove(); return; }
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
      if (attr(span, "type") === "material-group") return;
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
    if (targetRank === undefined) throw new Error(`Unknown reconstruction stage: ${stage}`);

    // A0 is the reconstructed first inscription, not an intervention view.
    // Resolve every later operation backwards, including nested corrections,
    // and suppress the genetic apparatus in this mode.
    if (stage === "A0") {
      const initial = normalizeXmlIds(sourceRoot.cloneNode(true));
      Array.from(initial.querySelectorAll("tei-mod"))
        .sort((a, b) => depth(b) - depth(a))
        .forEach((mod) => replaceWithReading(mod, false));
      resolveSpans(initial, 0);
      pruneEmptyStructures(initial);
      initial.classList.add("reconstructed-text");
      initial.dataset.reconstruction = "A0";
      return initial;
    }

    const root = normalizeXmlIds(sourceRoot.cloneNode(true));
    // Retain the complete sequence of earlier readings. Only interventions
    // later than the requested stage are rewound to their initial reading.
    Array.from(root.querySelectorAll("tei-mod"))
      .sort((a, b) => depth(b) - depth(a))
      .forEach((mod) => {
        const rank = LAYER_RANK[eventLayer(mod)];
        if (rank !== undefined && rank > targetRank) replaceWithReading(mod, false);
      });

    resolveUnselectedSpans(root, INTERVENTION_LAYERS.filter(
      (layer) => LAYER_RANK[layer] <= targetRank
    ));
    decorateVisibleEvents(root);

    root.querySelectorAll("tei-mod").forEach((mod) => {
      if (eventLayer(mod) !== stage) {
        mod.classList.add("reconstruction-earlier");
        mod.querySelectorAll(".genetic-event-marker").forEach((marker) => marker.remove());
      }
    });
    root.querySelectorAll("tei-delspan, tei-addspan").forEach((span) => {
      if (eventLayer(span) !== stage) span.classList.add("reconstruction-earlier");
    });
    pruneEmptyStructures(root);
    root.classList.add("genetic-intervention-view", "cumulative-reconstruction");
    root.dataset.reconstruction = stage;
    return root;
  }

  // Reconstruct the resulting reading, not the momentary false starts.
  // Immediate A1 corrections belong to the first writing state.
  function renderCleanStage(sourceRoot, stage) {
    const rank = LAYER_RANK[stage];
    if (rank === undefined || stage === "A0") throw new Error("Invalid clean-text stage");
    const root = normalizeXmlIds(sourceRoot.cloneNode(true));
    Array.from(root.querySelectorAll("tei-mod"))
      .sort((a, b) => depth(b) - depth(a))
      .forEach((mod) => {
        const layer = eventLayer(mod);
        const eventRank = LAYER_RANK[layer];
        replaceWithReading(mod, eventRank === undefined || eventRank <= rank);
      });
    resolveSpans(root, rank);
    root.querySelectorAll("tei-add, tei-del").forEach((el) => el.replaceWith(...Array.from(el.childNodes)));
    pruneEmptyStructures(root);
    root.classList.add("reconstructed-text", "clean-text-view");
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

  function decorateMarginalGroups(root) {
    root.querySelectorAll('tei-addspan[type="material-group"]').forEach((span) => {
      const target = getTargetAnchor(root, attr(span, "spanTo") || attr(span, "spanto"));
      if (!target) return;
      const place = attr(span, "place").toLowerCase();
      const side = place === "right" ? "derecho" : place === "left" ? "izquierdo" : "";
      if (!side) return;
      const label = `Añadido en el margen ${side}`;
      const groupId = attr(span, "xml:id") || span.id;
      let current = span.nextElementSibling;
      while (current) {
        if (current.matches("tei-l[n]")) {
          current.classList.add("marginal-group-line");
          current.dataset.marginGroup = groupId;
          current.dataset.marginLabel = label;
          current.dataset.marginLayer = eventLayer(span) || "A2";
        }
        if (current === target || current.contains(target)) break;
        current = current.nextElementSibling;
      }
      span.removeAttribute("title");
    });
  }

  // Mark the text covered by a deletion span, including spans across speeches.
  // Structural span elements themselves remain invisible in the interface.
  function decorateDeletionSpans(root) {
    root.querySelectorAll("tei-delspan, tei-addspan").forEach((span) => {
      const layer = eventLayer(span);
      const isDeletion = span.tagName.toLowerCase() === "tei-delspan";
      if (!isDeletion && !attr(span, "xml:id").startsWith("Brestore_")) return;
      const target = getTargetAnchor(root, attr(span, "spanTo") || attr(span, "spanto"));
      if (!target || !layer) return;
      const range = document.createRange();
      try {
        range.setStartAfter(span);
        range.setEndBefore(target);
      } catch (_) { return; }
      root.querySelectorAll("tei-l").forEach((line) => {
        if (!range.intersectsNode(line)) return;
        line.classList.add(isDeletion ? "genetic-span-deleted" : "genetic-span-restored",
          `genetic-span-${isDeletion ? "deleted" : "restored"}-${layer.toLowerCase()}`);
      });
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
      const adoptedState = attr(mod, "n").match(/^\d+T$/)?.[0] ||
        attr(directChild(mod, "add"), "n").match(/^\d+T$/)?.[0] || "";
      if (adoptedState) mod.dataset.adoptedState = adoptedState;
      const related = attr(mod, "corresp").trim().split(/\s+/).filter(Boolean);
      if (related.length) mod.dataset.relatedEvents = related.join(" ");

      const marker = document.createElement("span");
      marker.className =
        `genetic-event-marker marker-${layer.toLowerCase()}`;

      if (seq) {
        const phase = document.createElement("sup");
        phase.className = "genetic-event-phase";
        const adoptedHere = adoptedState === `${seq}T`;
        phase.textContent = adoptedHere ? `${seq}T` : seq;
        phase.setAttribute("aria-label", adoptedHere ? `fase ${seq}, lezione accolta` : `fase ${seq}`);
        marker.appendChild(phase);
      }

      const details = [];
      if (fn) details.push(fn.replace(/^B-/, ""));
      if (seq) details.push(`fase ${seq}`);
      if (adoptedState) details.push(`estado adoptado ${adoptedState}`);
      if (related.length) details.push(`intervenciones vinculadas: ${related.join(", ")}`);
      if (details.length) marker.title = details.join(" · ");

      const markerLabel = seq ? `${layer}, fase ${seq}${adoptedState === `${seq}T` ? ", lezione accolta" : ""}` : layer;
      marker.setAttribute("aria-label", markerLabel);
      marker.title = [markerLabel, ...details].join(" · ");
      if (!seq) marker.hidden = true;

      // Material placement is independent of the genetic layer.
      // Display a tooltip only when the TEI explicitly records a margin.
      const additions = Array.from(mod.querySelectorAll("tei-add"));
      additions.forEach((addition) => {
        const place = (attr(addition, "place") || "").toLowerCase().trim();
        const tokens = place.split(/[\\s,;]+/);
        const left = tokens.some((token) => ["margin-left", "left-margin"].includes(token));
        const right = tokens.some((token) => ["margin-right", "right-margin"].includes(token));
        if (left === right) return;
        const label = left
          ? "Añadido en el margen izquierdo"
          : "Añadido en el margen derecho";
        addition.classList.add("marginal-addition");
        addition.dataset.marginSide = left ? "left" : "right";
        addition.setAttribute("title", label);
        addition.setAttribute("aria-label", label);
      });

      const addReading = directChild(mod, "add");
      const delReading = directChild(mod, "del");
      const type = attr(mod, "type").toLowerCase();

      // For additions and substitutions the marker identifies the
      // reading produced by the intervention, so it belongs immediately
      // before that reading. Pure deletions have no resulting reading:
      // in that case the marker stays with the deleted text.
      if (addReading && type !== "del") {
        addReading.prepend(marker);
      } else if (delReading) {
        delReading.prepend(marker);
      } else {
        mod.prepend(marker);
      }
    });

    decorateMarginalGroups(root);
    decorateDeletionSpans(root);
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
    renderCleanStage,
    renderInterventions,
    normalizeXmlIds,
    layerCounts,
  };
})(window);
