# Manual de codificación genética — *El marqués de las Navas*

Este manual fija las reglas operativas del modelo TEI genético del proyecto.

## 1. Principio general

La codificación distingue:

1. el **evento genético**: qué modificación material se produce;
2. el **estrato de la lección**: A0, A1, A2 o B;
3. la **fase documental**: primera redacción, revisión autorial posterior o fase postautorial;
4. la **inmediatez** de una corrección autorial;
5. el **orden local** entre varias intervenciones;
6. la **mano**, únicamente cuando puede identificarse con seguridad.

La interfaz no debe condicionar la semántica del XML.

## 2. Estratos del proyecto

| Estrato | Significado | Codificación principal | Reconstrucción |
| --- | --- | --- | --- |
| A0 | primera redacción autógrafa | `change="#stage-A0"` heredado del `body`; `ana="#layer-A0"` en las lecciones afectadas | A0 |
| A1 | corrección autorial inmediata | `hand="#Lope"`, `instant="true"`, `ana="#layer-A1"` | A0+A1 |
| A2 | revisión autorial posterior | `hand="#Lope"`, `change="#stage-A2"`, `ana="#layer-A2"` | A0+A1+A2 |
| B | intervención no autógrafa | `change="#stage-B"`, `ana="#layer-B"`; `@hand` facultativo | estado documental con B |

A0/A1/A2/B son categorías editoriales, no testimonios; no deben codificarse mediante `@wit`.

## 3. Evento y lección

`mod/@ana` identifica el estrato del **evento**.

`del/@ana` y `add/@ana` identifican el estrato de la **lección**.

Ejemplo A1:

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

Una lección cancelada no pertenece necesariamente a A0. Si A2 elimina una lección A1, el `del` llevará `ana="#layer-A1"`. Si una segunda intervención B actúa sobre una lectura ya introducida dentro de B, el `del` llevará `ana="#layer-B"`.

## 4. A1 — correcciones inmediatas

### Cancelación

```xml
<mod xml:id="g0005"
     type="del"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
  <del ana="#layer-A0">m</del>
</mod>
```

### Sustitución

```xml
<mod xml:id="g0107"
     type="subst"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
  <del ana="#layer-A0">sale aquel día</del>
  <add ana="#layer-A1">salir porfía</add>
</mod>
```

A1 no se trata como una campaña autónoma: `instant="true"` expresa su carácter inmediato.

## 5. A2 — revisión autorial posterior

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

A2 no debe llevar `instant="true"`.

## 6. B — fase postautorial

B es una categoría general que reúne las intervenciones no autógrafas.

No se presupone:

- un número fijo de manos;
- que dos intervenciones parecidas pertenezcan al mismo escribiente;
- que las manos de la cubierta, los repartos y el cuerpo de la comedia coincidan;
- una cronología global B1/B2.

Por ello `@hand` es facultativo en B.

### Sustitución B simple

```xml
<mod xml:id="gB001"
     type="subst"
     change="#stage-B"
     ana="#layer-B #B-substitution">
  <del ana="#layer-A0">Mar</del>
  <add ana="#layer-B">Cond</add>
</mod>
```

## 7. Taxonomía funcional interna de B

La taxonomía `B-functions` contiene:

- `#B-substitution`: sustitución no autógrafa;
- `#B-restoration`: restitución posterior de una lección previamente modificada dentro de B;
- `#B-performance`: intervención vinculada al uso escénico o a la representación.

Estas categorías son secundarias. Toda intervención sigue perteneciendo a B mediante `#layer-B`.

## 8. Dos intervenciones sucesivas dentro de B

Cuando puede demostrarse localmente que una intervención actúa sobre otra:

```xml
<mod xml:id="gB0170-1"
     type="subst"
     change="#stage-B"
     ana="#layer-B #B-substitution"
     seq="1">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">
    <mod xml:id="gB0170-2"
         type="subst"
         change="#stage-B"
         ana="#layer-B #B-restoration"
         seq="2">
      <del ana="#layer-B">conde</del>
      <add ana="#layer-B">marqués</add>
    </mod>
  </add>
</mod>
```

`@seq` expresa solo el orden local.

No significa «mano 1 / mano 2» ni «campaña B1 / campaña B2».

## 9. B sobre A1 o A2

Cuando B modifica una lección A1 o A2 no es necesario añadir `@seq`: la relación cronológica ya está expresada por los estratos.

Ejemplo A2 → B:

```xml
<mod xml:id="g115"
     type="subst"
     hand="#Lope"
     change="#stage-A2"
     ana="#layer-A2">
  <del ana="#layer-A0">Fili</del>
  <add ana="#layer-A2">
    <mod xml:id="gB043"
         type="subst"
         change="#stage-B"
         ana="#layer-B #B-substitution">
      <del ana="#layer-A2">He</del>
      <add ana="#layer-B">Fad</add>
    </mod>
  </add>
</mod>
```

## 10. Cancelaciones extensas

Las intervenciones que atraviesan varios elementos se representan mediante `delSpan/@spanTo`:

```xml
<l n="410">
  <delSpan xml:id="gB0410"
           spanTo="#gB0415-end"
           change="#stage-B"
           ana="#layer-B"/>
  Ya habrás oído mil veces
</l>
...
<l n="415">antigüedades ni historia.</l>
<anchor xml:id="gB0415-end"/>
```

No se utilizan `from/to` en `delSpan`.

## 11. Reglas para `@hand`

### A1 y A2

La atribución autógrafa es explícita:

```xml
hand="#Lope"
```

y `#Lope` debe declararse mediante `<handNote>`.

### B

`@hand` se omite cuando la identidad paleográfica no puede sostenerse con seguridad.

Solo se añadirá un identificador de mano si una revisión paleográfica permite definir una entidad estable y reutilizable.

No deben emplearse valores libres como:

```xml
hand="authorial"
hand="non-authorial"
hand="non--authorial"
```

## 12. Reglas para `@change`, `@instant` y `@seq`

- `instant="true"`: corrección autorial inmediata A1.
- `change="#stage-A2"`: revisión autorial posterior.
- `change="#stage-B"`: intervención postautorial.
- `@seq`: sucesión local entre intervenciones B que actúan sobre la misma lección.

`@seq` no debe utilizarse para fabricar una cronología global interna de B.

## 13. Identificadores

Convención provisional:

- `gNNNN`: intervención autorial;
- `gBNNNN`: intervención B;
- sufijos `-1`, `-2`: sucesión local sobre el mismo punto.

Los identificadores expresan identidad técnica, no atribución paleográfica.

## 14. Lecturas inciertas

Cuando existe una propuesta de lectura pero no es segura:

```xml
<unclear cert="low">te</unclear>
```

Cuando una porción no puede transcribirse debe evaluarse `<gap>`.

El signo interrogativo editorial no debe incorporarse como si formara parte del texto del manuscrito.

## 15. Visualización

El renderizador debería poder producir atributos como:

```html
data-event-layer="B"
data-reading-layer="A0"
data-function="B-substitution"
data-seq="1"
```

`data-hand` solo se generará si el TEI contiene una atribución de mano.

La interfaz principal seguirá ofreciendo:

- A0;
- A1;
- A2;
- B.

Las categorías funcionales de B podrán aparecer como información secundaria, no como nuevos estratos principales.

## 16. Criterio de prudencia

La codificación no debe transformar una hipótesis paleográfica en un hecho estructural.

Cuando no sea posible establecer con seguridad:

- si una intervención es A1 o A2;
- la identidad de una mano no autógrafa;
- si dos intervenciones pertenecen al mismo escribiente;
- el orden relativo entre modificaciones B;

debe omitirse la información no demostrable.

La ausencia de `@hand` en B es, por tanto, una decisión filológica positiva y no una carencia de codificación.

## 17. Estado del modelo

El modelo se ha probado con:

- cancelaciones y sustituciones A1;
- revisiones A2;
- intervenciones B simples sin atribución de mano;
- sucesiones locales de sustitución y restitución dentro de B;
- B sobre A1/A2;
- cancelaciones de largo alcance mediante `delSpan/@spanTo`.

Los archivos principales de prueba son:

- `EMN_mod_sample.xml`;
- `EMN_complex_cases.xml`;
- `EMN_mod_act1_pilot.xml`.
