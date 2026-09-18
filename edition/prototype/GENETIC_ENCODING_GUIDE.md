# Manual de codificación genética — *El marqués de las Navas*

Versión de trabajo para la rama `tei-genetic-model-prototype`.

Este documento traduce el modelo teórico y el ODD del proyecto en reglas operativas de codificación. El principio general consiste en separar siempre:

1. **el evento genético**: qué sucede materialmente y en qué momento o campaña;
2. **la lección implicada**: a qué estrato editorial pertenece el texto escrito, cancelado o sustituido;
3. **la mano**: quién realiza materialmente la intervención;
4. **la visualización**: cómo filtra la interfaz las intervenciones y cómo reconstruye los estados del texto.

## 1. Vocabulario del proyecto

| Sigla | Significado editorial | Expresión TEI principal | Uso en la interfaz |
| --- | --- | --- | --- |
| A0 | primera redacción autógrafa | estado de base; `change="#stage-A0"` heredado del `body`; `ana="#layer-A0"` en las lecciones implicadas en modificaciones | reconstrucción de la primera redacción; color A0 cuando la lección participa en una intervención |
| A1 | intervención autorial inmediata durante la primera redacción | `hand="#Lope"` + `instant="true"` + `ana="#layer-A1"` en el evento | filtro A1; aplicación de las correcciones inmediatas en la reconstrucción A0+A1 |
| A2 | revisión autorial diferida | `hand="#Lope"` + `change="#stage-A2"` + `ana="#layer-A2"` en el evento | filtro A2; aplicación de la revisión en la reconstrucción A0+A1+A2 |
| B | intervención no autógrafa | `hand="#hB…"` + `change="#stage-B…"` + `ana="#layer-B"` | filtro B; aplicación de las intervenciones postautoriales en el estado documental final |

A1, A2 y B son, por tanto, **categorías editoriales interrogables**; no son testimonios y no deben codificarse mediante `@wit`.

## 2. Regla fundamental: evento y lección

En el contenedor de la intervención se codifica **el evento**:

```xml
<mod
  xml:id="g..."
  type="subst"
  hand="#Lope"
  instant="true"
  ana="#layer-A1">
```

En `<del>` y `<add>` se codifica, en cambio, **el estrato de la lección**:

```xml
<del ana="#layer-A0">lección anterior</del>
<add ana="#layer-A1">lección introducida</add>
```

De ello se deriva esta regla general:

- `mod/@ana` = **estrato del evento**;
- `add/@ana` y `del/@ana` = **estrato de la lección**.

La lección cancelada no pertenece necesariamente a A0: si A2 elimina una lección introducida en A1, el `<del>` llevará `ana="#layer-A1"`. Del mismo modo, una intervención B2 puede cancelar una lección introducida por B1.

## 3. Tabla normativa de fenómenos

| Fenómeno manuscrito | Codificación TEI del proyecto | Atributos obligatorios | Estrato de la lección | Comportamiento en la interfaz |
| --- | --- | --- | --- | --- |
| Texto de primera redacción no modificado | texto normal en el `body` | ninguno específico en el segmento | A0 por herencia | visible en A0 y en todos los estados posteriores mientras no sea modificado |
| Cancelación autorial inmediata | `<mod type="del"><del>…</del></mod>` | `xml:id`, `hand="#Lope"`, `instant="true"`, `ana="#layer-A1"` | `del/@ana` = estrato de la lección eliminada, normalmente A0 | el filtro A1 resalta el evento; A0 muestra la lección y A0+A1 la elimina |
| Adición autorial inmediata | `<mod type="add"><add>…</add></mod>` | `xml:id`, `hand="#Lope"`, `instant="true"`, `ana="#layer-A1"` | `add/@ana="#layer-A1"` | oculta en A0; visible desde A0+A1 |
| Sustitución autorial inmediata | `<mod type="subst"><del>…</del><add>…</add></mod>` | `xml:id`, `hand="#Lope"`, `instant="true"`, `ana="#layer-A1"` | `del` = estrato anterior; `add/@ana="#layer-A1"` | A0 muestra el `del`; A0+A1 muestra el `add` |
| Cancelación autorial diferida | `<mod type="del"><del>…</del></mod>` | `xml:id`, `hand="#Lope"`, `change="#stage-A2"`, `ana="#layer-A2"` | `del` = A0 o A1 según la historia real de la lección | visible hasta el estado anterior a A2; eliminada en A2 |
| Adición autorial diferida | `<mod type="add"><add>…</add></mod>` | `xml:id`, `hand="#Lope"`, `change="#stage-A2"`, `ana="#layer-A2"` | `add/@ana="#layer-A2"` | oculta antes de A2; visible en A2 |
| Sustitución autorial diferida | `<mod type="subst"><del>…</del><add>…</add></mod>` | `xml:id`, `hand="#Lope"`, `change="#stage-A2"`, `ana="#layer-A2"` | `del` = estrato anterior; `add/@ana="#layer-A2"` | permite reconstruir automáticamente el estado anterior a A2 y el estado A2 |
| Cancelación no autógrafa | `<mod type="del"><del>…</del></mod>` | `xml:id`, `hand="#hB…"`, `change="#stage-B…"`, `ana="#layer-B"` | `del` = estrato de la lección cancelada | filtro B; la lección permanece en el último estado autorial y desaparece en el estado documental B |
| Adición no autógrafa | `<mod type="add"><add>…</add></mod>` | `xml:id`, `hand="#hB…"`, `change="#stage-B…"`, `ana="#layer-B"` | `add/@ana="#layer-B"` | ausente en el último estado autorial; presente en B |
| Sustitución no autógrafa | `<mod type="subst"><del>…</del><add>…</add></mod>` | `xml:id`, `hand="#hB…"`, `change="#stage-B…"`, `ana="#layer-B"` | `del` = estrato anterior; `add/@ana="#layer-B"` | permite comparar el último estado autorial con el estado documental |
| Dos intervenciones sucesivas sobre la misma lección | `<mod>` anidado dentro de la lección introducida por la modificación anterior | además de los atributos del estrato: `seq="1"`, `seq="2"`, etc. | cada `del/add` conserva el estrato de su propia lección | puede reconstruir también B1 y B2 manteniendo un único filtro o color B |
| Cancelación que atraviesa varios elementos o versos | `<delSpan ... spanTo="#end"/>` + `<anchor xml:id="end"/>` | `xml:id`, `spanTo`, `hand`, `ana`; además `instant` o `change` según A1/A2/B | el span se trata como evento; el texto atravesado conserva su estructura | el renderizador oculta o restituye el intervalo completo sin destruir la estructura de los versos |
| Adición que atraviesa varios elementos o versos | `<addSpan ... spanTo="#end"/>` + `<anchor xml:id="end"/>` | como en `delSpan` | el span pertenece al estrato del evento que lo introduce | el renderizador puede activar o desactivar el intervalo completo |
| Restitución material de texto previamente cancelado | `<restore>` **solo si el fenómeno material corresponde realmente a la restitución de una cancelación anterior** | se definirá a partir del caso real: al menos identificación de mano y fase cuando puedan reconstruirse | depende de la lección restituida | no debe usarse como atajo para una segunda sustitución B |
| Repaso gráfico de letras ya escritas | `<retrace>` cuando existe materialmente un repaso de los trazos | mano y fase cuando puedan reconstruirse | no crea automáticamente un nuevo estrato textual | visualización paleográfica; no implica necesariamente un cambio de estado |
| Signo o instrucción gráfica no asimilable al texto | `<metamark>` | `xml:id`; eventualmente `function`, `target`, `spanTo`, `hand` según el fenómeno | normalmente no crea un estrato de lectura autónomo | visualización documental; puede expresar relaciones o instrucciones |
| Transposición de segmentos | `<listTranspose>` / `<transpose>` y referencias a los segmentos implicados | identificadores estables de los segmentos y orden explícito | las palabras conservan su estrato; cambia el orden | reconstrucción del orden anterior y posterior; se implementará cuando aparezca un caso real |

## 4. Ejemplos canónicos

### A1 — sustitución inmediata

```xml
<mod xml:id="g0065"
     type="subst"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
  <del ana="#layer-A0">a los más sabios</del>
  <add ana="#layer-A1">como lo esperes</add>
</mod>
```

### A2 — revisión posterior

```xml
<mod xml:id="g0219a"
     type="subst"
     hand="#Lope"
     change="#stage-A2"
     ana="#layer-A2">
  <del ana="#layer-A0">las caras</del>
  <add ana="#layer-A2">de noche</add>
</mod>
```

### B1 → B2 — dos manos sucesivas

```xml
<mod xml:id="gB0170-1"
     type="subst"
     hand="#hB1"
     change="#stage-B1"
     ana="#layer-B"
     seq="1">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">
    <mod xml:id="gB0170-2"
         type="subst"
         hand="#hB2"
         change="#stage-B2"
         ana="#layer-B"
         seq="2">
      <del ana="#layer-B">conde</del>
      <add ana="#layer-B">marqués</add>
    </mod>
  </add>
</mod>
```

### B de largo alcance — cancelación vv. 410–415

```xml
<l n="410">
  <delSpan xml:id="gB0410"
           spanTo="#gB0415-end"
           hand="#hB1"
           change="#stage-B1"
           ana="#layer-B"/>
  Ya habrás oído mil veces
</l>
...
<l n="415">antigüedades ni historia.</l>
<anchor xml:id="gB0415-end"/>
```

## 5. Reglas para `@hand`

Las manos deben declararse una sola vez en `<handNotes>` y remitirse mediante puntero:

```xml
<handNotes>
  <handNote xml:id="Lope" scope="major" scribe="author">
    Mano autógrafa de Lope de Vega.
  </handNote>
  <handNote xml:id="hB1" scope="minor">
    Primera mano no autógrafa.
  </handNote>
  <handNote xml:id="hB2" scope="minor">
    Segunda mano no autógrafa.
  </handNote>
</handNotes>
```

No se admiten valores libres como:

```xml
hand="authorial"
hand="non-authorial"
hand="non--authorial"
```

La identificación de hB1/hB2 debe mantenerse prudente: una misma mano y una misma campaña no son necesariamente equivalentes. La asociación entre mano y campaña solo se establece cuando el dato paleográfico permite sostenerla.

## 6. Reglas para `@change`, `@instant` y `@seq`

- `@instant="true"` indica una intervención inmediata durante el acto de escritura y caracteriza A1.
- `@change="#stage-A2"` indica una revisión autorial diferida.
- `@change="#stage-B1"`, `#stage-B2`, etc. identifica campañas no autógrafas cuando su ordenación puede sostenerse.
- `@seq` se usa cuando es necesario expresar el orden relativo de varias intervenciones sobre la misma porción de texto.
- `@seq` no sustituye a `@change`: el primero expresa una secuencia local; el segundo, una campaña o fase documental.

## 7. Reglas para los identificadores

Todo evento genético que deba ser interrogado, vinculado al facsímil, anotado o visualizado debe tener un `xml:id` estable.

Convención provisional:

- `gNNNN` = intervención autorial;
- `gBNNNN` = intervención no autógrafa;
- sufijos `-1`, `-2` = sucesión local de intervenciones sobre el mismo punto.

La convención de los ID es técnica, no semántica: la clasificación científica permanece en los atributos TEI.

## 8. Reglas de renderización

La transformación TEI → HTML deberá exportar al menos:

```html
data-event-layer="A1|A2|B"
data-reading-layer="A0|A1|A2|B"
data-hand="Lope|hB1|hB2|..."
data-change="stage-A2|stage-B1|..."
data-seq="..."
```

Los colores no se codifican en el TEI.

La interfaz deberá ofrecer dos mecanismos distintos:

### Filtros de intervenciones

Permiten resaltar u ocultar los eventos A1, A2 y B sin alterar la reconstrucción textual.

### Reconstrucción de estados

Orden editorial por defecto:

```text
A0
A0 + A1
A0 + A1 + A2
A0 + A1 + A2 + B
```

El último estado autorial es **A0+A1+A2**. El estado con B corresponde, en cambio, al **estado documental postautorial**.

Cuando la cronología interna de B sea suficientemente segura, el renderizador podrá ofrecer opcionalmente:

```text
... + B1
... + B1 + B2
```

sin necesidad de introducir colores distintos para B1 y B2.

## 9. Criterio de prudencia

La codificación no debe transformar una hipótesis paleográfica en un hecho estructural.

Cuando no sea posible establecer con seguridad:

- si una intervención es A1 o A2;
- qué mano no autógrafa interviene;
- el orden entre dos campañas B;

la solución debe conservar la incertidumbre y aplazar la clasificación fuerte. No se deben asignar `@instant`, `@change`, `@hand` o `@seq` más específicos de lo que permitan los datos materiales.

## 10. Estado del modelo

Ya se han validado formalmente frente al ODD del proyecto:

- cancelaciones y sustituciones A1;
- revisiones A2;
- intervenciones B simples;
- secuencias B1 → B2;
- cancelaciones de largo alcance mediante `delSpan/@spanTo`.

Los archivos de prueba son:

- `EMN_mod_sample.xml`;
- `EMN_complex_cases.xml`.

El siguiente paso consiste en aplicar estas reglas sistemáticamente a todo `EMN_mod.xml`, registrando por separado los casos que requieran una decisión filológica.
