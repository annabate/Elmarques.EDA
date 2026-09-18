# Documentación del modelo de codificación genética de *El marqués de las Navas*

**Proyecto:** *El marqués de las Navas. Estudio y edición en el entorno digital*  
**Responsable científica:** Anna Abate  
**Estado del documento:** documentación metodológica de trabajo  
**Versión TEI de referencia:** TEI P5 4.12.0  
**Rama de desarrollo:** `tei-genetic-model-prototype`

---

## 1. Objetivo de este documento

Este documento reconstruye de manera unitaria el recorrido que ha llevado desde la primera codificación genética de *El marqués de las Navas* hasta el nuevo modelo TEI actualmente en fase de experimentación y validación.

Su finalidad no es únicamente describir **cómo** se ha modificado el archivo XML, sino explicar sobre todo **por qué** se han tomado determinadas decisiones. La codificación genética no constituye un mero problema técnico: cada elección XML implica una interpretación concreta del manuscrito, de la sucesión de las intervenciones y de la relación entre texto, autor, manos posteriores y estados documentales.

La documentación está concebida para ser legible en varios niveles:

- como introducción al modelo para quien no conozca en detalle la TEI;
- como memoria de las decisiones editoriales adoptadas durante el desarrollo;
- como base para la sección metodológica de la tesis o de una futura publicación;
- como manual de referencia para la conversión completa del archivo genético;
- como puente entre la codificación XML y la futura interfaz web.

El principio de fondo que guía todo el trabajo puede formularse así:

> **La codificación debe describir el fenómeno documental del modo más correcto posible según la TEI, pero debe preservar al mismo tiempo toda la información necesaria para reconstruir y visualizar por separado los estratos genéticos A0, A1, A2 y B.**

Estos dos objetivos —corrección semántica y visualización— no son alternativos. El nuevo modelo nace precisamente del intento de mantenerlos unidos sin forzar la TEI en función de la interfaz.

---

## 2. Punto de partida: el modelo genético inicial

El archivo genético originario, `edition/EMN_mod.xml`, había sido construido para hacer visibles en la interfaz distintos estratos del proceso de escritura. La solución adoptada recurría a los elementos del aparato crítico TEI:

```xml
<app>
  <rdg wit="A0" varSeq="0" hand="authorial">...</rdg>
  <lem wit="A1" varSeq="1" hand="authorial">...</lem>
</app>
```

o bien:

```xml
<app>
  <rdg wit="A0" varSeq="0" hand="authorial">a los más sabios</rdg>
  <lem wit="A1" varSeq="1" hand="authorial">
    <subst>
      <del>a los más sabios</del>
      <add>como lo esperes</add>
    </subst>
  </lem>
</app>
```

Las siglas A0, A1, A2 y B se utilizaban, por tanto, mediante `@wit`, como si representaran testimonios distintos. El atributo personalizado `@varSeq` indicaba además el orden de las transformaciones, mientras que `@hand` asumía valores libres como:

```xml
hand="authorial"
hand="non-authorial"
```

Esta solución respondía a una necesidad práctica clara. Permitía tratar cada modificación como una sucesión de “lecturas” y facilitaba la construcción de una visualización en la que los distintos estratos pudieran destacarse mediante colores diferentes.

Desde el punto de vista de la interfaz, por tanto, el sistema resultaba eficaz: A0, A1, A2 y B eran fácilmente reconocibles por el código JavaScript y podían transformarse en clases, filtros o estados de visualización.

El problema aparecía en el plano **semántico y filológico**.

---

## 3. Por qué el modelo inicial resultaba problemático

### 3.1 A0, A1, A2 y B no son testimonios

El atributo `@wit` pertenece al modelo del aparato crítico y sirve para indicar los **testimonios** que sustentan una determinada lección.

En el caso de *El marqués de las Navas*, sin embargo:

- A0 no es un manuscrito distinto;
- A1 no es un segundo testimonio;
- A2 no es una copia alternativa;
- B no es un testimonio independiente.

Son categorías editoriales que describen **estratos o momentos diferentes de la historia del mismo documento**.

El uso de `<app>`, `<lem>`, `<rdg>` y `@wit` superponía así dos modelos conceptualmente distintos:

1. **aparato crítico**, que compara lecciones transmitidas por testimonios diferentes;
2. **codificación genético-documental**, que describe modificaciones producidas sobre un mismo objeto manuscrito.

Esta distinción es especialmente importante en el proyecto porque la edición crítica y la edición genético-evolutiva están deliberadamente separadas también en la interfaz. El modelo genético no debe, por tanto, simular un aparato crítico.

### 3.2 Las siglas mezclaban informaciones de naturaleza distinta

En el sistema originario A0/A1/A2/B parecían formar una secuencia homogénea:

```text
A0 → A1 → A2 → B
```

En realidad no describen exactamente la misma clase de información.

- **A0** indica la primera redacción.
- **A1** identifica intervenciones inmediatas realizadas durante el propio acto de escritura.
- **A2** identifica una revisión autorial diferida.
- **B** identifica intervenciones no autógrafas e introduce, por tanto, una dimensión adicional de responsabilidad gráfica.

A1 es, en primera instancia, una **modalidad de intervención**; A2 corresponde a una **campaña de revisión**; B implica además la identificación de **manos diferentes**.

La codificación inicial tendía a reducir todas estas dimensiones a una única categoría de “variante”.

### 3.3 `hand="authorial"` y `hand="non-authorial"` eran demasiado genéricos

El manuscrito presenta intervenciones de manos distintas. En determinados pasajes pueden distinguirse al menos dos manos no autógrafas, una de las cuales sustituye ciertos nombres mientras otra restituye posteriormente la lección anterior.

Escribir simplemente:

```xml
hand="non-authorial"
```

impide conservar esa información.

En el nuevo modelo las manos se declaran en el `teiHeader` mediante `<handNotes>` y `<handNote>`, y se remiten después mediante punteros:

```xml
hand="#Lope"
hand="#hB1"
hand="#hB2"
```

De este modo la responsabilidad material de la intervención deja de ser una cadena descriptiva libre y pasa a constituir una relación explícita con una mano documentada.

### 3.4 `@varSeq` era un atributo local no estándar

`@varSeq` se había introducido para conservar el orden de las modificaciones. La TEI ofrece, sin embargo, `@seq` para expresar el orden relativo de intervenciones transcripcionales.

La eliminación de `@varSeq` reduce así el marcado personalizado y hace el modelo más comprensible también fuera del proyecto.

### 3.5 Algunos fenómenos estructurales exigen elementos específicos

Las modificaciones que atraviesan varios versos se representaban mediante soluciones no conformes, por ejemplo:

```xml
<delSpan from="#l_410" to="#l_415">...</delSpan>
```

La TEI utiliza `<delSpan>` como elemento vacío que señala **el inicio** de la cancelación y emplea `@spanTo` para apuntar a un `<anchor>` final:

```xml
<delSpan spanTo="#end"/>
...
<anchor xml:id="end"/>
```

Este caso mostró de manera especialmente clara la necesidad de replantear el modelo a partir de la semántica del módulo `transcr`.

---

## 4. Cambio de perspectiva: de la “lectura” al evento genético

El paso decisivo consistió en dejar de tratar cada transformación como una relación entre “lecturas concurrentes” y empezar a describirla como un **evento ocurrido sobre el documento**.

La pregunta ya no es únicamente:

> ¿Cuál es la lección A0 y cuál es la lección A1?

sino:

> ¿Qué ha sucedido materialmente? ¿Quién ha intervenido? ¿En qué momento? ¿Qué lección se ha eliminado y cuál se ha introducido?

Esta perspectiva conduce naturalmente al módulo TEI dedicado a la **representación de fuentes primarias**, que ofrece elementos y atributos específicamente concebidos para cancelaciones, adiciones, sustituciones, manos, revisiones, modificaciones extensas y campañas genéticas.

El núcleo del nuevo modelo está formado por:

- `<mod>`: evento de modificación;
- `<del>`: material cancelado;
- `<add>`: material añadido;
- `@hand`: mano responsable;
- `@instant`: carácter inmediato o no de la corrección;
- `@change`: pertenencia a una fase o campaña;
- `@seq`: orden relativo entre intervenciones;
- `@ana`: clasificación analítica propia del proyecto;
- `<listChange>` / `<change>`: descripción de campañas o fases documentales;
- `<handNotes>` / `<handNote>`: descripción de las manos;
- `<addSpan>` / `<delSpan>`: intervenciones que atraviesan límites estructurales.

---

## 5. Distinción fundamental: evento y lección

El nuevo modelo introduce una separación esencial tanto para el análisis filológico como para la futura visualización.

### 5.1 El contenedor `<mod>` describe el evento

Por ejemplo:

```xml
<mod xml:id="g0065"
     type="subst"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
```

indica que:

- existe una intervención identificable mediante `xml:id="g0065"`;
- se trata de una sustitución;
- la mano responsable es la de Lope;
- la intervención es inmediata;
- dentro de la taxonomía editorial del proyecto pertenece a A1.

### 5.2 `<del>` y `<add>` describen las lecciones implicadas

Dentro del mismo evento:

```xml
<del ana="#layer-A0">a los más sabios</del>
<add ana="#layer-A1">como lo esperes</add>
```

el primer elemento indica que la lección eliminada pertenece al estrato A0; el segundo, que la nueva lección se introduce en A1.

De aquí se deriva una distinción especialmente útil:

```text
mod/@ana           = estrato del EVENTO
del/@ana, add/@ana = estrato de la LECCIÓN
```

Esto evita un problema importante. Una revisión A2 puede, por ejemplo, eliminar una lección que no pertenece a A0, sino a A1. En ese caso tendremos:

```xml
<mod ana="#layer-A2" ...>
  <del ana="#layer-A1">...</del>
  <add ana="#layer-A2">...</add>
</mod>
```

La intervención es A2, pero la lección eliminada pertenece a A1.

---

## 6. Redefinición de A0, A1, A2 y B

### 6.1 A0: primera redacción

A0 representa el texto de primera redacción.

No resulta necesario marcar cada palabra ordinaria con:

```xml
ana="#layer-A0"
```

porque ello volvería el archivo excesivamente pesado y redundante.

En el modelo del proyecto el `<body>` se asocia a la primera redacción:

```xml
<body change="#stage-A0">
```

El texto no afectado por modificaciones pertenece, por tanto, implícitamente a la base A0.

`ana="#layer-A0"` se utiliza sobre todo cuando es necesario identificar explícitamente una lección eliminada o sustituida.

### 6.2 A1: corrección inmediata

A1 ha sido el punto que ha requerido la revisión conceptual más importante.

Las TEI distinguen las modificaciones realizadas después de la escritura de las llamadas **instant corrections**, es decir, correcciones producidas inmediatamente durante el propio acto de escribir. En estos casos `@instant="true"` permite señalar que la modificación pertenece al mismo momento genético que su contexto de escritura.

Por esta razón A1 no se trata como una campaña autónoma equivalente a A2.

Un caso A1 se codifica, por ejemplo, así:

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

Lo importante es distinguir dos niveles:

- `instant="true"` expresa la semántica documental;
- `ana="#layer-A1"` conserva la categoría editorial utilizada por el proyecto.

A1 sigue siendo, por tanto, perfectamente filtrable en la interfaz sin convertirse artificialmente en un `<change>` autónomo.

### 6.3 A2: revisión autorial diferida

A2 corresponde a una revisión posterior, reconocible paleográfica o materialmente como distinta de la primera redacción.

Por ello se declara una campaña:

```xml
<change xml:id="stage-A2">
  Campaña de revisión autorial posterior.
</change>
```

y las intervenciones se vinculan a ella:

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

Aquí `@change` y `@ana` desempeñan funciones diferentes:

- `@change` vincula el fenómeno a la campaña documental;
- `@ana` lo vincula a la clasificación editorial A2 utilizada también por la interfaz.

### 6.4 B: intervenciones no autógrafas

B sigue funcionando como un estrato editorial unitario, especialmente útil en el plano de la visualización.

Internamente, sin embargo, puede articularse cuando la evidencia paleográfica lo permite.

Por ejemplo:

```xml
<handNote xml:id="hB1">Primera mano no autógrafa.</handNote>
<handNote xml:id="hB2">Segunda mano no autógrafa.</handNote>
```

y:

```xml
<change xml:id="stage-B1">Primera campaña no autógrafa.</change>
<change xml:id="stage-B2">Segunda campaña no autógrafa.</change>
```

Todos estos eventos pueden seguir llevando:

```xml
ana="#layer-B"
```

de modo que la interfaz conserve un único filtro B, mientras que el TEI mantiene una granularidad mucho mayor.

---

## 7. Un caso decisivo: `marqués → conde → marqués`

Uno de los pasajes más útiles para poner a prueba el modelo es aquel en que dos manos no autógrafas intervienen sucesivamente sobre el mismo texto.

La secuencia material es:

```text
A0   marqués
      ↓ primera mano no autógrafa
B1   conde
      ↓ segunda mano no autógrafa
B2   marqués
```

En el modelo antiguo ambas transformaciones quedaban simplemente clasificadas como B.

En el nuevo modelo se conserva la sucesión real anidando la segunda intervención dentro de la lección introducida por la primera:

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

Esta construcción permite conservar simultáneamente:

- la primera lección autógrafa;
- la nueva lección introducida por la primera mano;
- la segunda modificación;
- el orden de los eventos;
- la responsabilidad de cada mano;
- la pertenencia global al estrato B.

Es importante subrayar que no se utiliza automáticamente `<restore>`. El hecho de que la segunda mano vuelva a una palabra idéntica a la lección originaria no significa necesariamente que esté “restaurando” materialmente una cancelación en el sentido técnico previsto por la TEI. Si ejecuta una nueva sustitución sobre la lección previa, describirla como una segunda `<mod>` resulta más prudente y más fiel al fenómeno observable.

---

## 8. Modificaciones que atraviesan varios versos

El manuscrito contiene casos en los que una única intervención afecta a una secuencia de versos.

En estas situaciones un elemento en línea como `<del>` no puede contener simplemente todos los versos, porque ello entraría en conflicto con la estructura jerárquica del texto.

La solución TEI consiste en utilizar un span:

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

La ventaja es clara:

- los versos conservan su codificación normal;
- la cancelación puede atravesar varios elementos;
- el renderer puede identificar el intervalo completo;
- no es necesario duplicar ni deformar el texto.

Este modelo sustituye las anteriores construcciones no estándar basadas en `from/to`.

---

## 9. Las manos en el nuevo modelo

Las manos se declaran en el `profileDesc`:

```xml
<handNotes>
  <handNote xml:id="Lope"
            scope="major"
            scribe="author">
    Mano autógrafa de Lope de Vega.
  </handNote>

  <handNote xml:id="hB1"
            scope="minor">
    Primera mano no autógrafa.
  </handNote>

  <handNote xml:id="hB2"
            scope="minor">
    Segunda mano no autógrafa.
  </handNote>
</handNotes>
```

Las intervenciones remiten después a estos identificadores:

```xml
hand="#Lope"
hand="#hB1"
hand="#hB2"
```

Este sistema ofrece varias ventajas:

1. evita valores textuales incoherentes y errores tipográficos;
2. permite describir paleográficamente una mano una sola vez;
3. hace posible modificar más adelante una identificación sin cambiar todas las intervenciones;
4. permite distinguir responsabilidad gráfica y campaña cronológica.

Un principio metodológico importante es que **mano y campaña no coinciden necesariamente**.

La misma mano podría intervenir en momentos diferentes. A la inversa, una misma fase podría incluir intervenciones de más de una mano. Por ello ambas informaciones se mantienen separadas.

---

## 10. Campañas de revisión

Las campañas o fases documentales se describen mediante `<listChange>`:

```xml
<creation>
  <listChange ordered="true">

    <change xml:id="stage-A0">
      Primera redacción autógrafa.
    </change>

    <change xml:id="stage-A2">
      Campaña de revisión autorial posterior.
    </change>

    <listChange xml:id="stage-B" ordered="true">

      <change xml:id="stage-B1">
        Primera campaña no autógrafa.
      </change>

      <change xml:id="stage-B2">
        Segunda campaña no autógrafa.
      </change>

    </listChange>

  </listChange>
</creation>
```

El anidamiento permite expresar una jerarquía sin fingir que todos los estratos poseen el mismo estatuto.

A0 y A2 pertenecen a la historia autorial. B reúne, en cambio, una historia postautorial que puede articularse internamente.

Esta estructura debe mantenerse prudente: B1 y B2 solo se utilizan cuando el orden entre las manos puede sostenerse paleográficamente.

---

## 11. Por qué `@ana` es esencial para el proyecto

La TEI describe el fenómeno documental mediante `@instant`, `@change`, `@hand`, `@seq` y los elementos transcripcionales.

La interfaz, sin embargo, debe seguir trabajando con las categorías editoriales A0/A1/A2/B.

Para evitar deformar la TEI en función del frontend, el modelo utiliza `@ana` como **puente entre ambos niveles**.

En el `teiHeader` se define una taxonomía:

```xml
<taxonomy xml:id="genetic-layers">

  <category xml:id="layer-A0">
    <catDesc>Primera redacción autógrafa.</catDesc>
  </category>

  <category xml:id="layer-A1">
    <catDesc>Intervención inmediata.</catDesc>
  </category>

  <category xml:id="layer-A2">
    <catDesc>Revisión autorial posterior.</catDesc>
  </category>

  <category xml:id="layer-B">
    <catDesc>Intervención no autógrafa.</catDesc>
  </category>

</taxonomy>
```

Los elementos pueden clasificarse entonces mediante:

```xml
ana="#layer-A1"
ana="#layer-A2"
ana="#layer-B"
```

La visualización no tiene que interpretar toda la lógica paleográfica: puede leer directamente estos identificadores.

---

## 12. Codificación y visualización: dos niveles separados

La futura transformación TEI → HTML deberá exponer al menos dos informaciones:

```html
data-event-layer="A1"
data-reading-layer="A0"
```

La primera indica **a qué estrato pertenece la intervención**.

La segunda indica **a qué estrato pertenece esa lección concreta**.

Esto hace posibles dos funciones de interfaz que deben mantenerse claramente separadas.

### 12.1 Filtrar las intervenciones

El usuario podrá decidir mostrar únicamente:

- A1;
- A2;
- B;
- o una combinación de ellos.

Esta modalidad sirve para estudiar el **proceso de escritura**.

Los colores asociados actualmente a los estratos siguen siendo plenamente utilizables, pero la paleta pertenece al CSS/frontend y no se almacena en el TEI.

### 12.2 Reconstruir los estados del texto

El usuario podrá pedir, en cambio, una reconstrucción del texto a un determinado nivel:

```text
A0
A0 + A1
A0 + A1 + A2
A0 + A1 + A2 + B
```

Esta modalidad responde a otra pregunta:

> ¿Cómo se lee el texto si aplico todas las modificaciones hasta este punto?

Conviene precisar que `A0 + A1` es una **reconstrucción editorial acumulativa**, no necesariamente un estado material global del manuscrito que haya existido simultáneamente en un momento preciso.

### 12.3 Último estado autorial y estado documental final

El nuevo modelo permite además distinguir con claridad:

```text
último estado autorial = A0 + A1 + A2

estado documental final = A0 + A1 + A2 + B
```

Esta distinción es filológicamente significativa y debería mantenerse también en la futura interfaz.

---

## 13. Por qué los colores no deben codificarse en el XML

El TEI debe registrar conceptos, no decisiones gráficas contingentes.

Por ello el archivo XML contiene:

```xml
ana="#layer-A1"
```

y no:

```xml
color="..."
```

El color se asigna en el frontend.

Esto aporta una ventaja importante de sostenibilidad: una futura modificación de la gráfica, del CSS o incluso de toda la plataforma de publicación no obligará a modificar los datos TEI.

El mismo principio vale para Jekyll, Astro, CETEIcean o cualquier otra tecnología de publicación. El modelo documental debe mantenerse independiente de la herramienta empleada para representarlo.

---

## 14. El papel del ODD

El nuevo modelo no se limita a una documentación en prosa.

Se ha creado un ODD de proyecto:

```text
edition/prototype/EMN_genetic.odd
```

que fija la versión:

```xml
<schemaSpec
    ident="emn-genetic"
    start="TEI"
    source="tei:4.12.0">
```

La referencia explícita a TEI P5 4.12.0 es importante para la reproducibilidad. El proyecto no depende así automáticamente de futuras modificaciones de `tei:current`.

El módulo `textcrit` no forma parte del modelo genético.

Se incluyen, en cambio, los módulos necesarios para:

- estructura TEI;
- cabecera;
- texto;
- teatro;
- verso;
- transcripción de fuentes primarias;
- análisis;
- linking;
- descripción manuscrita;
- nombres y fechas.

---

## 15. Reglas Schematron del proyecto

El ODD contiene también reglas específicas que convierten las decisiones metodológicas en controles automáticos.

Entre las condiciones verificadas:

- cada `<mod>` debe poseer un `xml:id`;
- cada `<mod>` debe declarar el tipo de intervención;
- cada `<mod>` debe tener una mano;
- A1 debe ser autógrafo y llevar `instant="true"`;
- A2 debe ser autógrafo y remitir a `#stage-A2`;
- B debe asociarse a una mano no autógrafa declarada;
- `<add>` y `<del>` deben declarar un estrato interpretable por la interfaz;
- una sustitución debe contener `<del>` y `<add>`;
- una cancelación debe contener `<del>` y no `<add>`;
- una adición debe contener `<add>` y no `<del>`;
- las intervenciones anidadas deben declarar `@seq`;
- la segunda modificación de una secuencia debe tener un valor de secuencia superior al de la primera;
- `<delSpan>` y `<addSpan>` deben declarar `@spanTo`;
- el archivo genético no debe reintroducir `<app>`, `<lem>` o `<rdg>`.

Estos controles tienen una función científica, no solo informática. Impiden que la codificación pierda coherencia progresivamente durante el trabajo sobre el texto completo.

---

## 16. Validación realizada

El modelo se ha probado sobre dos archivos de muestra.

### 16.1 `EMN_mod_sample.xml`

Contiene un primer segmento recodificado hasta aproximadamente el v. 150 e incluye:

- cancelaciones inmediatas;
- sustituciones inmediatas;
- intervenciones no autógrafas;
- casos reclasificados respecto de la codificación inicial.

### 16.2 `EMN_complex_cases.xml`

Se creó como auténtico **stress test** y contiene:

- un caso A2 diferido;
- una secuencia B1 → B2;
- una cancelación de largo alcance a través de varios versos.

Ambos archivos se han verificado contra:

1. el esquema RELAX NG generado a partir del ODD;
2. las reglas Schematron específicas del proyecto.

La validación se ejecuta automáticamente mediante GitHub Actions en el workflow:

```text
.github/workflows/validate-genetic-tei.yml
```

El ODD se compila con los Stylesheets TEI y cada modificación de los archivos del prototipo puede comprobarse así de manera reproducible.

Hasta el momento los stress tests han superado todas las reglas activas.

---

## 17. Un ejemplo de reclasificación filológica

La revisión del modelo ha mostrado ya que corregir la sintaxis XML no basta: algunos casos deben reevaluarse también filológicamente.

Un ejemplo es la corrección del nombre del interlocutor:

```text
Leo → Feli
```

En el archivo inicial estaba codificada como A2.

La nota editorial, sin embargo, describe una intervención que parece inmediata: Lope se habría dado cuenta del error antes incluso de completar normalmente la indicación del personaje.

Si esta interpretación se confirma, el fenómeno resulta más coherente con:

```xml
<mod type="subst"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
  <del ana="#layer-A0">Leo</del>
  <add ana="#layer-A1">Feli</add>
</mod>
```

Este ejemplo muestra un principio fundamental de la migración:

> **La conversión no puede reducirse a una operación automática de búsqueda y sustitución.**

Toda transformación automatizada deberá ir acompañada de una revisión de los casos en los que la antigua etiqueta A1/A2 pueda no corresponder al análisis material descrito por las notas.

---

## 18. Qué no cambia

El nuevo modelo no modifica algunos principios fundamentales de la edición.

### 18.1 La edición crítica y la genética permanecen separadas

No se pretende reunificar todo en un único XML.

La separación entre:

- edición crítica;
- edición genético-evolutiva

sigue siendo metodológicamente válida y responde a necesidades distintas.

La edición crítica utiliza el modelo del aparato y de los testimonios.

La edición genética describe el manuscrito autógrafo y sus transformaciones.

### 18.2 A0/A1/A2/B siguen siendo el lenguaje editorial de la interfaz

El hecho de que estos estratos ya no se codifiquen mediante `@wit` no significa que se abandonen.

Al contrario, el nuevo modelo los hace más explícitos como **categorías analíticas del proyecto**.

### 18.3 Siguen siendo posibles los filtros y los colores

La nueva codificación no reduce las posibilidades de la interfaz actual.

Permite, de hecho, distinguir con mayor precisión:

- estrato;
- mano;
- fase;
- orden;
- tipo de intervención;
- lección anterior;
- lección posterior.

---

## 19. Qué cambia

El cambio puede resumirse así.

### Antes

```text
variante = app + rdg/lem
A0/A1/A2/B = wit
orden = varSeq
mano = cadena libre
```

### Después

```text
evento documental = mod / add / del / spans
fase = change
inmediatez = instant
orden local = seq
mano = hand → handNote
categoría editorial = ana → taxonomy
```

El nuevo modelo separa así informaciones que antes estaban comprimidas dentro de un mismo constructo.

---

## 20. Principio de prudencia interpretativa

El ODD es deliberadamente riguroso, pero no debe obligar a declarar información que el manuscrito no permite conocer realmente.

Cuando no sea posible establecer con seguridad:

- si una intervención es inmediata o diferida;
- si una mano es hB1 o hB2;
- si dos intervenciones pertenecen a la misma campaña;
- cuál es el orden preciso entre dos modificaciones;

la codificación debe conservar la incertidumbre.

La modelización no debe transformar una hipótesis filológica en una falsa certeza estructural.

Este principio será especialmente importante durante la conversión del archivo completo.

---

## 21. Estrategia prevista para la migración completa

La conversión de `EMN_mod.xml` debería desarrollarse en varias fases.

### Fase 1 — inventario

Localizar todos los actuales:

- `<app>`;
- `<lem>`;
- `<rdg>`;
- `<subst>`;
- `<add>`;
- `<del>`;
- construcciones de largo alcance;
- valores de `@wit`;
- valores de `@hand`;
- valores de `@varSeq`.

### Fase 2 — clasificación

Para cada caso registrar:

- fenómeno material;
- lección anterior;
- lección nueva;
- A1/A2/B;
- mano;
- eventual orden local;
- eventual incertidumbre.

### Fase 3 — conversión automatizable

Convertir mediante script los casos no ambiguos.

Por ejemplo:

```text
A0 → A1 + subst
```

puede transformarse con frecuencia en:

```xml
<mod type="subst" hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">...</del>
  <add ana="#layer-A1">...</add>
</mod>
```

### Fase 4 — revisión filológica

Aislar los casos en los que:

- la nota contradice la clasificación antigua;
- el número de manos es incierto;
- la cronología es dudosa;
- el fenómeno material exige un elemento más específico.

### Fase 5 — validación

Cada nueva sección convertida deberá superar:

- RELAX NG;
- Schematron;
- controles de punteros;
- pruebas de reconstrucción de estados.

### Fase 6 — integración con el frontend

Solo cuando la estructura TEI esté estabilizada será oportuno reescribir el renderer.

Este orden evita construir una nueva interfaz alrededor de un modelo todavía inestable.

---

## 22. Relación con la futura interfaz

La transformación podrá producir marcado HTML del tipo:

```html
<span
  data-event-layer="A2"
  data-reading-layer="A0"
  data-hand="Lope"
  data-change="stage-A2">
  ...
</span>
```

A partir de ahí la interfaz podrá implementar, sin conocer toda la sintaxis TEI:

- filtros A1/A2/B;
- leyenda;
- colores;
- ventanas o paneles con información sobre la mano;
- información sobre la fase;
- reconstrucción A0;
- reconstrucción A0+A1;
- reconstrucción A0+A1+A2;
- estado documental con B;
- eventualmente B1/B2 cuando su orden sea seguro.

En otras palabras, el TEI conserva la complejidad científica; el HTML expone únicamente los datos necesarios para la navegación.

---

## 23. Sostenibilidad del modelo

El nuevo sistema responde también al objetivo general de sostenibilidad del proyecto.

La separación entre:

```text
datos TEI
        ↓
transformación
        ↓
HTML
        ↓
CSS / JavaScript
```

impide que la semántica dependa de una tecnología específica de publicación.

La decisión de:

- usar elementos TEI estándar;
- limitar los atributos personalizados;
- fijar una release TEI;
- mantener un ODD;
- validar automáticamente;
- separar colores y datos;

reduce el riesgo de que el proyecto quede inutilizable cuando cambien los frameworks o las bibliotecas frontend.

---

## 24. Archivos producidos durante la revisión

En la rama `tei-genetic-model-prototype` se encuentran actualmente:

### `edition/prototype/EMN_mod_sample.xml`

Primera muestra de conversión.

### `edition/prototype/EMN_complex_cases.xml`

Casos complejos empleados para poner a prueba el modelo.

### `edition/prototype/EMN_genetic.odd`

ODD del proyecto con esquema y reglas Schematron.

### `edition/prototype/GENETIC_MODEL.md`

Síntesis conceptual del modelo.

### `edition/prototype/GENETIC_ENCODING_GUIDE.md`

Manual normativo operativo: fenómeno → codificación → atributos → visualización.

### `.github/workflows/validate-genetic-tei.yml`

Workflow automático de validación.

### `edition/prototype/GENETIC_MODEL_DOCUMENTATION.md`

El presente documento, que reconstruye la historia y las razones de la revisión.

---

## 25. Principales referencias TEI

El modelo se ha desarrollado tomando como referencia TEI P5 4.12.0, con especial atención al capítulo **Representation of Primary Sources** y a los elementos del módulo `transcr`.

Referencias principales:

- TEI P5 4.12.0, *Representation of Primary Sources*:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/PH.html
- `<mod>`:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-mod.html
- `<change>`:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-change.html
- `<handNotes>`:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-handNotes.html
- `<delSpan>`:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-delSpan.html

La documentación TEI subraya, en particular, que:

- `@change` vincula un elemento a un estado o campaña de revisión;
- `@instant="true"` está previsto para falsas arrancadas y correcciones inmediatas;
- `<listChange>` puede expresar campañas ordenadas y puede anidarse;
- `<mod>` dispone de atributos como `@seq`, `@instant`, `@hand` y `@spanTo`;
- `<delSpan>` requiere `@spanTo` y permite representar cancelaciones que atraviesan varios elementos estructurales.

---

## 26. Síntesis final

El modelo inicial tenía una ventaja importante: hacía inmediatamente legibles A0/A1/A2/B y funcionaba bien para el frontend.

Su límite consistía, sin embargo, en representar la génesis del manuscrito mediante herramientas concebidas para el aparato crítico.

La revisión no ha abandonado, por tanto, la intuición originaria —la posibilidad de visualizar separadamente los estratos—, sino que ha buscado darle una base más adecuada.

El resultado puede resumirse en cuatro principios.

### 1. Describir primero el manuscrito

La codificación debe partir del fenómeno material:

```text
cancelación
adición
sustitución
repaso
span
mano
campaña
orden
```

### 2. No confundir el dato con la interpretación

```text
TEI documental     ≠     categoría editorial
```

`@instant`, `@change` y `@hand` describen el documento.

`@ana="#layer-A1/A2/B"` conserva la taxonomía interpretativa del proyecto.

### 3. No sacrificar la visualización

A0/A1/A2/B deben seguir siendo siempre interrogables y filtrables.

El modelo debe permitir tanto **mostrar el proceso** como **reconstruir los estados**.

### 4. Hacer verificables las decisiones

ODD, Schematron, archivos de prueba y validación automática garantizan que el modelo no dependa únicamente de la memoria del editor o del comportamiento contingente del JavaScript.

La codificación genética se convierte así simultáneamente en:

- una interpretación filológica;
- una descripción documental;
- un modelo computable;
- una base sostenible para la publicación digital.

---

## 27. Estado actual y próximos pasos

El modelo ha superado los primeros ensayos formales y los principales casos complejos seleccionados hasta ahora.

La siguiente fase consiste en la conversión sistemática de todo `EMN_mod.xml`.

Esta migración deberá producir dos resultados paralelos:

1. **un nuevo archivo TEI genéticamente coherente y validable**;
2. **un registro de casos dudosos**, en el que la incertidumbre filológica se haga explícita y no quede oculta por la codificación.

Solo después de esta fase será oportuno intervenir estructuralmente en la nueva interfaz web.

La prioridad sigue siendo, por tanto:

```text
manuscrito
    ↓
interpretación filológica
    ↓
modelo TEI
    ↓
validación
    ↓
transformación
    ↓
interfaz
```

y no el recorrido inverso.
