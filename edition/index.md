---
layout: edition
title: El marqués de las Navas - edición genética digital
---

<div
  id="genetic-app"
  data-baseurl="{{ site.baseurl }}"
  data-genetic-source="{{ site.baseurl }}/edition/prototype/EMN_mod_act1_pilot.xml"
  data-diplomatic-source="{{ site.baseurl }}/edition/EMN_dip.xml"
>
  <header class="edition-toolbar" aria-label="Controles de la edición genética">
    <div class="toolbar-section">
      <strong>Paneles</strong>
      <label class="pane-toggle">
        <input type="checkbox" data-toggle-pane="facsimile-pane" checked>
        Facsímil
      </label>
      <label class="pane-toggle">
        <input type="checkbox" data-toggle-pane="genetic-pane" checked>
        Edición genética
      </label>
      <label class="pane-toggle">
        <input type="checkbox" data-toggle-pane="diplomatic-pane" checked>
        Transcripción
      </label>
    </div>

    <div class="toolbar-section" aria-label="Intervenciones visibles">
      <strong>Filtrar intervenciones</strong>
      <label class="layer-toggle">
        <input type="checkbox" name="intervention-layer" value="A1" checked>
        <span class="layer-chip a1">A1</span>
      </label>
      <label class="layer-toggle">
        <input type="checkbox" name="intervention-layer" value="A2" checked>
        <span class="layer-chip a2">A2</span>
      </label>
      <label class="layer-toggle">
        <input type="checkbox" name="intervention-layer" value="B" checked>
        <span class="layer-chip b">B</span>
      </label>
    </div>

    <div class="toolbar-section">
      <label for="reconstruction-select"><strong>Reconstruir texto</strong></label>
      <select id="reconstruction-select">
        <option value="genesis" selected>Mostrar génesis</option>
        <option value="A0">A0 · primera redacción</option>
        <option value="A1">A0 + A1</option>
        <option value="A2">A0 + A1 + A2 · último estado autorial</option>
        <option value="B">A0 + A1 + A2 + B · estado documental</option>
      </select>
    </div>

    <div class="toolbar-section">
      <label for="verse-input"><strong>Ir al verso</strong></label>
      <input id="verse-input" type="number" min="1" inputmode="numeric" placeholder="n.º">
      <button id="go-verse" type="button">Ir</button>
    </div>

    <div class="toolbar-section toolbar-search">
      <label for="search-input" class="visually-hidden">Buscar</label>
      <input id="search-input" type="text" placeholder="Buscar en ambos textos…">
      <button id="search-button" type="button">Buscar</button>
      <button id="search-prev" type="button" title="Coincidencia anterior">↑</button>
      <button id="search-next" type="button" title="Coincidencia siguiente">↓</button>
      <button id="search-clear" type="button" title="Limpiar búsqueda">×</button>
      <span id="search-count" aria-live="polite"></span>
    </div>
  </header>

  <div class="edition-statusbar">
    <span id="model-status">Preparando edición…</span>
    <span id="genetic-mode-hint">
      Vista genética: A1, A2 y B pueden filtrarse independientemente.
    </span>
  </div>

  <main id="edition-grid">
    <section id="facsimile-pane" class="edition-pane facsimile-pane" aria-label="Facsímil">
      <header class="pane-header">
        <span>Facsímil</span>
        <div class="facsimile-controls">
          <button id="folio-prev" type="button" title="Folio anterior">←</button>
          <select id="folio-selector" aria-label="Seleccionar folio"></select>
          <button id="folio-next" type="button" title="Folio siguiente">→</button>
          <button id="zoom-out" type="button" title="Reducir">−</button>
          <button id="zoom-reset" type="button" title="Restablecer zoom">1:1</button>
          <button id="zoom-in" type="button" title="Ampliar">+</button>
        </div>
      </header>
      <div class="pane-scroll">
        <div class="facsimile-stage">
          <img id="facsimile-image" src="" alt="Facsímil">
        </div>
      </div>
    </section>

    <section id="genetic-pane" class="edition-pane genetic-pane" aria-label="Edición genética">
      <header class="pane-header">
        <span>Edición genética · acto I</span>
        <span>A0 / A1 / A2 / B</span>
      </header>
      <div id="genetic-scroll" class="pane-scroll"></div>
    </section>

    <section id="diplomatic-pane" class="edition-pane diplomatic-pane" aria-label="Transcripción diplomática">
      <header class="pane-header">
        <span>Transcripción diplomática</span>
        <span>Manuscrito</span>
      </header>
      <div id="diplomatic-scroll" class="pane-scroll"></div>
    </section>
  </main>
</div>

<script src="{{ site.baseurl }}/assets/genetic/model.js"></script>
<script src="{{ site.baseurl }}/assets/genetic/facsimile.js"></script>
<script src="{{ site.baseurl }}/assets/genetic/app.js"></script>
