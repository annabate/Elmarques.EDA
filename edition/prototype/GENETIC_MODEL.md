# Prototipo del modelo genético TEI

Este documento define una primera propuesta de recodificación para la edición genético-evolutiva de *El marqués de las Navas*.

## Principios

1. La información genética deja de modelarse como aparato crítico (`app/lem/rdg`).
2. Las intervenciones materiales se describen mediante los elementos del módulo `transcr`; en el modelo EMN las sustituciones en línea se normalizan como `mod type="subst"` que contiene `del` y `add`, mientras que `addSpan`/`delSpan` se reservan para intervenciones extensas.
3. Las verdaderas campañas o fases documentales se describen con `listChange/change` y se remiten mediante `@change`.
4. Las manos se declaran en `handNotes/handNote` y se remiten mediante `@hand`.
5. Los estratos editoriales A0/A1/A2/B siguen siendo siempre interrogables mediante una taxonomía y `@ana`.
6. A1 no se trata como una campaña autónoma: representa las intervenciones inmediatas producidas durante la primera redacción y se expresa principalmente mediante `@instant="true"`, manteniendo `@ana="#layer-A1"` para garantizar su filtrado.
7. Los colores pertenecen exclusivamente al capa de presentación; el TEI conserva únicamente los identificadores semánticos de los estratos.

## Estratos editoriales

- `#layer-A0`: primera redacción autógrafa.
- `#layer-A1`: lección introducida mediante una corrección inmediata durante la primera redacción.
- `#layer-A2`: lección introducida durante una revisión autorial posterior.
- `#layer-B`: lección introducida por una mano no autógrafa.

## Fases documentales

- `#stage-A0`: primera redacción autógrafa.
- `#stage-A2`: revisión autorial posterior.
- `#stage-B1`, `#stage-B2`, etc.: campañas no autógrafas, únicamente cuando su ordenación puede sostenerse paleográficamente.

## Reglas de visualización

La transformación a HTML deberá exponer por separado al menos dos informaciones:

- `data-reading-layer`: estrato al que pertenece una determinada lección (`A0`, `A1`, `A2`, `B`).
- `data-event-layer`: clase de la intervención que introduce, modifica o elimina esa lección.

Esto permite distinguir dos funciones:

- **filtro de intervenciones**: muestra u oculta A1, A2 y B y sus correspondientes resaltados;
- **reconstrucción del estado textual**: devuelve A0, A0+A1, A0+A1+A2 y el estado documental con B.

A0, A1, A2 y B siguen siendo, por tanto, categorías de la edición y de la interfaz, pero ya no se codifican impropiamente como `@wit`.

## Ejemplos

### Cancelación inmediata

```xml
<mod xml:id="g0005" type="del" hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">m</del>
</mod>
```

### Sustitución inmediata

```xml
<mod xml:id="g0065" type="subst" hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">a los más sabios</del>
  <add ana="#layer-A1">como lo esperes</add>
</mod>
```

### Revisión autorial posterior

```xml
<mod xml:id="g0777" type="subst" hand="#Lope" change="#stage-A2" ana="#layer-A2">
  <del ana="#layer-A0">que los angeles</del>
  <add ana="#layer-A2">que angel que viene</add>
</mod>
```

### Intervención de otra mano

```xml
<mod xml:id="gB001" type="subst" hand="#hB1" change="#stage-B1" ana="#layer-B">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">conde</add>
</mod>
```

## Estado actual

El modelo se ha formalizado en `EMN_genetic.odd` y se ha validado con casos A1, A2, B, secuencias B1→B2 y cancelaciones de largo alcance. Las reglas operativas completas se recogen en `GENETIC_ENCODING_GUIDE.md`.

Antes de la conversión integral quedan por verificar paleográficamente la distinción entre las manos no autógrafas y las atribuciones dudosas A1/A2 del archivo actual.
