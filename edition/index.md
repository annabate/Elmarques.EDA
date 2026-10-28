---
layout: edition
title: El marqués de las Navas - edición genética digital
permalink: /genetic/
edition_label: Edición genético-evolutiva · prototipo
---

<div
  id="genetic-app"
  data-baseurl="{{ site.baseurl }}"
  data-genetic-source="{{ site.baseurl }}/edition/prototype/EMN_mod_act1_pilot.xml"
  data-diplomatic-source="{{ site.baseurl }}/edition/EMN_dip.xml"
>
  <header class="edition-workspace-header">
    <div>
      <p class="workspace-kicker">Edición genético-evolutiva · prototipo</p>
      <h1><em>El marqués de las Navas</em></h1>
      <p class="workspace-subtitle">Acto I · manuscrito autógrafo de Lope de Vega</p>
    </div>
    <div id="model-status" class="workspace-status" aria-live="polite">
      Preparando edición…
    </div>
  </header>

  <div class="edition-toolbar" aria-label="Controles de la edición genética">
    <div class="toolbar-group toolbar-view">
      <label for="reconstruction-select" class="toolbar-label">Vista textual</label>
      <select id="reconstruction-select">
        <option value="genesis" selected>Génesis del texto</option>
        <option value="A0">A0 · primera redacción</option>
        <option value="A1">A0 + A1 · correcciones inmediatas</option>
        <option value="A2">A0 + A1 + A2 · último estado autorial</option>
        <option value="B">A0 + A1 + A2 + B · estado documental</option>
      </select>
    </div>

    <fieldset class="toolbar-group toolbar-layers">
      <legend class="toolbar-label">Intervenciones</legend>
      <label class="layer-toggle layer-a1">
        <input type="checkbox" name="intervention-layer" value="A1" checked>
        <span>A1</span>
        <small>inmediatas</small>
      </label>
      <label class="layer-toggle layer-a2">
        <input type="checkbox" name="intervention-layer" value="A2" checked>
        <span>A2</span>
        <small>revisión</small>
      </label>
      <label class="layer-toggle layer-b">
        <input type="checkbox" name="intervention-layer" value="B" checked>
        <span>B</span>
        <small>postautoriales</small>
      </label>
    </fieldset>

    <details class="toolbar-tools">
      <summary>Herramientas</summary>
      <div class="toolbar-tools-panel">
        <fieldset class="toolbar-group toolbar-panels">
          <legend class="toolbar-label">Paneles</legend>
          <label class="pane-toggle">
            <input type="checkbox" data-toggle-pane="facsimile-pane" checked>
            <span>Facsímil</span>
          </label>
          <label class="pane-toggle">
            <input type="checkbox" data-toggle-pane="genetic-pane" checked>
            <span>Genética</span>
          </label>
          <label class="pane-toggle">
            <input type="checkbox" data-toggle-pane="diplomatic-pane">
            <span>Diplomática</span>
          </label>
        </fieldset>

        <label class="sync-toggle">
          <input id="sync-views" type="checkbox" checked>
          <span>Sincronizar las vistas</span>
        </label>

        <div class="toolbar-group toolbar-navigation">
          <label for="verse-input" class="toolbar-label">Ir al verso</label>
          <div class="compact-control">
            <input id="verse-input" type="number" min="1" inputmode="numeric" placeholder="n.º · Intro">
          </div>
        </div>

        <div class="toolbar-group toolbar-search">
          <label for="search-input" class="toolbar-label">Buscar</label>
          <div class="search-control">
            <input id="search-input" type="text" placeholder="Palabra clave · Intro">
            <button id="search-prev" class="icon-button" type="button" title="Coincidencia anterior" aria-label="Coincidencia anterior">↑</button>
            <button id="search-next" class="icon-button" type="button" title="Coincidencia siguiente" aria-label="Coincidencia siguiente">↓</button>
            <button id="search-clear" class="icon-button" type="button" title="Limpiar búsqueda" aria-label="Limpiar búsqueda">×</button>
            <span id="search-count" aria-live="polite"></span>
          </div>
        </div>
      </div>
    </details>
  </div>

  <div class="edition-statusbar">
    <span id="genetic-mode-hint">
      Vista genética: A1, A2 y B pueden filtrarse independientemente.
    </span>
    <span class="status-legend" aria-label="Leyenda de estratos">
      <span><i class="legend-dot a1"></i>A1</span>
      <span><i class="legend-dot a2"></i>A2</span>
      <span><i class="legend-dot b"></i>B</span>
    </span>
  </div>

  <main id="edition-grid" class="two-pane">
    <section id="facsimile-pane" class="edition-pane facsimile-pane" aria-label="Facsímil">
      <header class="pane-header" title="Arrastrar para cambiar la posición del panel">
        <div class="pane-title">
          <span class="pane-eyebrow">Manuscrito</span>
          <strong>Facsímil</strong>
        </div>
        <div class="pane-header-actions">
          <div class="facsimile-controls">
          <button id="folio-prev" type="button" title="Folio anterior" aria-label="Folio anterior">←</button>
          <select id="folio-selector" aria-label="Seleccionar folio"></select>
          <button id="folio-next" type="button" title="Folio siguiente" aria-label="Folio siguiente">→</button>
          <span class="control-divider" aria-hidden="true"></span>
          <button id="zoom-out" type="button" title="Reducir" aria-label="Reducir">−</button>
          <button id="zoom-reset" type="button" title="Ajustar el facsímil al panel" aria-label="Ajustar el facsímil al panel">↺</button>
          <button id="zoom-in" type="button" title="Ampliar" aria-label="Ampliar">+</button>
        </div>
        </div>
      </header>
      <div class="pane-scroll">
        <div class="facsimile-stage">
          <img id="facsimile-image" src="" alt="Facsímil">
        </div>
      </div>
    </section>

    <section id="genetic-pane" class="edition-pane genetic-pane" aria-label="Edición genética">
      <header class="pane-header" title="Arrastrar para cambiar la posición del panel">
        <div class="pane-title">
          <span class="pane-eyebrow">Texto</span>
          <strong>Edición genética</strong>
        </div>
        <div class="pane-header-actions">
          <span class="pane-meta">A0 · A1 · A2 · B</span>
          <div class="text-size-controls" data-text-target="genetic-scroll" aria-label="Tamaño del texto de la edición genética">
            <button type="button" data-text-size="-1" title="Reducir texto" aria-label="Reducir texto">A−</button>
            <button type="button" data-text-size="1" title="Aumentar texto" aria-label="Aumentar texto">A+</button>
          </div>
        </div>
      </header>
      <div id="genetic-scroll" class="pane-scroll text-scroll"></div>
    </section>

    <section id="diplomatic-pane" class="edition-pane diplomatic-pane is-hidden-pane" aria-label="Transcripción diplomática">
      <header class="pane-header" title="Arrastrar para cambiar la posición del panel">
        <div class="pane-title">
          <span class="pane-eyebrow">Transcripción</span>
          <strong>Diplomática</strong>
        </div>
        <div class="pane-header-actions">
          <span class="pane-meta">Acto I</span>
          <div class="text-size-controls" data-text-target="diplomatic-scroll" aria-label="Tamaño del texto de la transcripción diplomática">
            <button type="button" data-text-size="-1" title="Reducir texto" aria-label="Reducir texto">A−</button>
            <button type="button" data-text-size="1" title="Aumentar texto" aria-label="Aumentar texto">A+</button>
          </div>
        </div>
      </header>
      <div id="diplomatic-scroll" class="pane-scroll text-scroll"></div>
    </section>
  </main>
</div>

<script src="{{ site.baseurl }}/assets/genetic/model.js"></script>
<script src="{{ site.baseurl }}/assets/genetic/facsimile.js"></script>
<script src="{{ site.baseurl }}/assets/genetic/app.js"></script>
