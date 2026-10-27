# Prototipo del modelo genético TEI

Este documento define la propuesta actual de recodificación para la edición genético-evolutiva de *El marqués de las Navas*.

## Principios

1. La información genética deja de modelarse como aparato crítico (`app/lem/rdg`).
2. Las intervenciones materiales se describen mediante el módulo `transcr`; las sustituciones en línea se normalizan como `mod type="subst"` con `del` y `add`.
3. Las fases documentales se describen mediante `listChange/change` y se remiten mediante `@change`.
4. La mano autógrafa se identifica mediante `@hand="#Lope"`. En B, `@hand` es facultativo y solo debe utilizarse si una atribución paleográfica puede sostenerse con seguridad.
5. Los estratos editoriales A0/A1/A2/B siguen siendo interrogables mediante `@ana`.
6. A1 representa las intervenciones inmediatas producidas durante la primera redacción y se expresa mediante `@instant="true"`.
7. B funciona como un único estrato postautorial. Su articulación interna puede expresarse mediante `@seq` y categorías funcionales, sin convertir hipótesis paleográficas en identidades de mano estables.
8. Los colores pertenecen exclusivamente a la capa de presentación.

## Estratos editoriales

- `#layer-A0`: primera redacción autógrafa.
- `#layer-A1`: lección introducida mediante una corrección inmediata durante la primera redacción.
- `#layer-A2`: lección introducida durante una revisión autorial posterior.
- `#layer-B`: lección introducida mediante una intervención no autógrafa.

## Fases documentales

- `#stage-A0`: primera redacción autógrafa.
- `#stage-A2`: revisión autorial posterior.
- `#stage-B`: fase postautorial que reúne las intervenciones no autógrafas.

No se establecen fases globales B1/B2 ni se presupone un número fijo de manos no autógrafas.

## Funciones internas de B

La taxonomía `B-functions` permite añadir una clasificación funcional secundaria:

- `#B-substitution`: sustitución no autógrafa de una lección anterior;
- `#B-restoration`: restitución posterior, dentro de B, de una lección previamente modificada;
- `#B-performance`: intervención vinculada al uso escénico o a la representación.

Estas categorías complementan, pero nunca sustituyen, `#layer-B`.

## Reglas de visualización

La transformación a HTML deberá exponer por separado al menos:

- `data-reading-layer`: estrato de la lección (`A0`, `A1`, `A2`, `B`);
- `data-event-layer`: estrato del evento;
- opcionalmente, una categoría funcional B;
- `data-seq` cuando exista una sucesión local segura.

Esto permite mantener separados:

- **filtro de intervenciones**: A1, A2 y B;
- **reconstrucción del estado textual**: A0, A0+A1, A0+A1+A2 y estado documental con B.

## Ejemplos

### Cancelación inmediata A1

```xml
<mod xml:id="g0005" type="del"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
  <del ana="#layer-A0">m</del>
</mod>
```

### Sustitución A2

```xml
<mod xml:id="g0777" type="subst"
     hand="#Lope"
     change="#stage-A2"
     ana="#layer-A2">
  <del ana="#layer-A0">que los angeles</del>
  <add ana="#layer-A2">que angel que viene</add>
</mod>
```

### Sustitución B sin atribución de mano

```xml
<mod xml:id="gB001" type="subst"
     change="#stage-B"
     ana="#layer-B #B-substitution">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">conde</add>
</mod>
```

### Sustitución y restitución locales dentro de B

```xml
<mod xml:id="gB002-1" type="subst"
     change="#stage-B"
     ana="#layer-B #B-substitution"
     seq="1">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">
    <mod xml:id="gB002-2" type="subst"
         change="#stage-B"
         ana="#layer-B #B-restoration"
         seq="2">
      <del ana="#layer-B">conde</del>
      <add ana="#layer-B">marqués</add>
    </mod>
  </add>
</mod>
```

`seq="1"` y `seq="2"` expresan únicamente una sucesión local de intervenciones; no identifican manos ni campañas globales.

## Estado actual

El modelo se formaliza en `EMN_genetic.odd` y se prueba con A1, A2, B, sucesiones locales dentro de B y cancelaciones de largo alcance. Las reglas operativas se recogen en `GENETIC_ENCODING_GUIDE.md`.

El principio rector es conservador: se codifica con precisión el fenómeno material observable y se omite la atribución de mano cuando el manuscrito no permite establecerla con seguridad.
