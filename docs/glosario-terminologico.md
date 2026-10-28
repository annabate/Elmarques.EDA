# Glosario terminológico del proyecto

## Finalidad y alcance

Este documento fija el vocabulario preferente para la edición digital de *El marqués de las Navas*. Su función es evitar que la terminología de la interfaz dependa de convenciones informáticas o de traducciones literales y asegurar la coherencia entre tres ámbitos que se solapan en el proyecto:

1. **crítica textual y ecdótica**;
2. **texto dramático y análisis teatral**;
3. **crítica genética y descripción del manuscrito de autor**.

Las decisiones que siguen son **normativas para la interfaz y la documentación del proyecto**, pero no pretenden establecer equivalencias universales entre tradiciones terminológicas distintas. Cuando un término tiene varios usos legítimos, se indica el sentido adoptado aquí.

---

# 1. Principios generales

### 1.1. Evitar sinonimias innecesarias

Un mismo fenómeno debe recibir siempre la misma denominación en la interfaz. En particular:

- **testimonio**, no alternar con *testigo*;
- **parlamento**, no alternar con *intervención* cuando se habla de una unidad de discurso dramático;
- **intervención de escritura** o **intervención genética**, no *parlamento*, para una modificación material del manuscrito;
- **acotación**, no *didascalia*, cuando se designa específicamente el contenido codificado mediante `<stage>`;
- **lección** para el contenido transmitido por un testimonio en un lugar determinado;
- **variante** para la relación de diferencia entre dos o más lecciones o estados textuales.

### 1.2. No convertir categorías técnicas de la codificación en categorías filológicas

Elementos como `<l>`, `<sp>`, `<stage>`, `<app>` o `<rdg>` son mecanismos de representación TEI. La etiqueta visible debe nombrar el **fenómeno filológico o dramático** que representan, no el elemento XML.

### 1.3. Distinguir descripción y explicación

La interfaz debe privilegiar formulaciones descriptivas cuando la dirección histórica del cambio no sea demostrable. Por ejemplo:

- preferir **«ausente en P»** a «suprimido por P» si solo conocemos la divergencia textual;
- preferir **«variante de atribución»** a «cambio de atribución» cuando no se pretende establecer qué forma es anterior;
- usar **«intervención de otra mano»** antes que «intervención postautorial» si la posterioridad cronológica no está demostrada de manera independiente.

---

# 2. Crítica textual y ecdótica

## Testimonio

**Definición.** Documento o ejemplar que transmite el texto de la obra y que interviene en la recensio y el cotejo.

**Uso preferente.** *testimonio O*, *testimonio P*, *testimonios manuscritos e impresos*.

**Evitar en la interfaz.** *testigo*, salvo en una cita bibliográfica que reproduzca la terminología de otro autor.

**Correspondencia TEI.** `<witness>`, `@wit`.

---

## Sigla

**Definición.** Abreviatura convencional mediante la que se identifica un testimonio.

**Uso preferente.** *sigla O*, *siglas de los testimonios*.

**No confundir con.** El testimonio mismo: O es la sigla; el manuscrito de Melbury House es el testimonio.

---

## Cotejo / colación

**Definición.** Confrontación sistemática de los testimonios con el fin de localizar coincidencias y divergencias textuales.

**Decisión del proyecto.**
- En la **interfaz**, preferir **Cotejar con**, por ser inmediato para el lector.
- En la **documentación metodológica**, pueden emplearse *cotejo* y *colación*, aclarando que PROLOPE utiliza ambos términos.

**Etiqueta actual.** `Cotejar con` → **mantener**.

---

## Texto base

**Definición.** Testimonio elegido como punto de partida material para la constitución del texto crítico.

**No confundir con.** *Texto crítico*. El texto crítico es el resultado de la labor editorial; el texto base es uno de los instrumentos de esa constitución.

**Uso.** Principalmente en la documentación metodológica, no necesariamente como etiqueta de interfaz.

---

## Texto crítico

**Definición.** Texto constituido por el editor como resultado del examen de la tradición y de las decisiones ecdóticas adoptadas.

**Etiqueta actual.** `Texto crítico` → **mantener**.

---

## Lección

**Definición.** Forma textual transmitida por un testimonio en un lugar determinado.

**Uso preferente.**
- *P transmite la lección «X»*;
- *la lección de O*;
- *lección omitida / lección divergente*, cuando proceda.

**No usar como sinónimo automático de.** *variante*. Una lección es el contenido atestiguado; la variante surge de la comparación entre lecciones.

**Correspondencia TEI aproximada.** Contenido de `<lem>` o `<rdg>`, según la función que cumpla en el aparato.

---

## Variante

**Definición.** Diferencia textual documentada por la confrontación de dos o más lecciones o estados del texto.

**Uso preferente.** *variante textual*, *variante de atribución*, *variantes de los testimonios*.

**Precaución.** No toda lección debe ser denominada aisladamente «variante» sin indicar respecto de qué otra lección se establece la diferencia.

---

## Aparato crítico

**Definición.** Sistema que registra de forma organizada las lecciones relevantes de la tradición y las decisiones editoriales.

**Etiqueta actual.**
- botón `Aparato` → **admisible como forma abreviada**;
- título `Aparato crítico` → **mantener**.

**Nota.** El panel sintético que permite filtrar y navegar por el aparato no debe confundirse conceptualmente con el aparato mismo. Si se mantiene una denominación específica para ese panel, se recomienda **Panorama del aparato** o **Exploración del aparato**.

---

## Entrada del aparato

**Definición.** Unidad individual registrada en el aparato crítico.

**Uso recomendado para los contadores de interfaz.** **Entradas** o **Entradas del aparato**.

**Etiqueta actual.** `Loci` → **revisar**.

**Razón.** *Locus* es comprensible en un entorno especializado, pero mezclarlo con etiquetas íntegramente españolas no aporta claridad. Además, **lugar crítico / locus criticus** posee un valor más fuerte: no toda entrada de un aparato tiene necesariamente que constituir un problema ecdótico en sentido estricto.

---

## Lugar crítico / locus criticus

**Definición operativa.** Lugar textual que plantea un problema relevante para la constitución o interpretación ecdótica del texto.

**Uso.** En el discurso filológico y en notas editoriales.

**No usar automáticamente para.** Cada `<app>` o cada entrada del aparato.

---

## Omisión

**Definición.** Ausencia en uno o varios testimonios de un segmento presente en el texto de referencia empleado para el cotejo.

**Uso preferente.**
- *omisión en P*;
- *P omite los vv. 351–359*;
- abreviatura convencional **om.** en el aparato.

**Precaución.** En visualizaciones comparativas debe quedar claro cuál es el punto de referencia. Cuando interese una formulación puramente descriptiva puede usarse **ausente en P**.

**Etiqueta actual.** `Omisiones` → **mantener**, con esta definición.

---

## Adición

**Definición.** Segmento presente en uno o varios testimonios y ausente del texto que actúa como referencia del cotejo.

**Uso preferente.** *adición en E*, *pasaje añadido en E respecto del texto crítico*.

**Precaución.** La categoría es relacional. No debe implicar por sí sola que podamos reconstruir históricamente el acto de añadir.

**Etiqueta actual.** `Adiciones` → **mantener**, con esta definición.

---

## Enmienda

**Definición.** Modificación introducida por el editor en la constitución del texto crítico.

**Uso preferente.** *enmienda del editor*, *enmienda por conjetura*.

**Referencia de proyecto.** PROLOPE utiliza explícitamente *enmienda* y, en su aparato digital, la abreviatura `Enm` para hacer visible la intervención editorial.

---

## Error / errata

**Error.** Innovación textual explicable dentro del proceso de transmisión.

**Errata.** Error material relacionado específicamente con la producción impresa, cuando pueda caracterizarse como tal.

**Precaución.** No calificar una divergencia como error antes de justificar la relación textual.

---

## Variante de atribución

**Definición.** Divergencia entre testimonios acerca del personaje al que se atribuye un parlamento.

**Etiqueta recomendada.** **Variantes de atribución**.

**Etiquetas actuales.**
- `Interlocutores` [filtro del aparato] → **Atribuciones** o **Atribuciones de parlamento**;
- `Diferencias de atribución` → **Variantes de atribución**;
- `Cambios de atribución` → **Variantes de atribución**.

**Razón.** «Cambio» introduce una direccionalidad histórica que la mera divergencia de los testimonios no demuestra.

---

# 3. Texto dramático y terminología teatral

## Personaje

**Definición.** Entidad ficticia del drama encarnada escénicamente por un actor.

**Uso preferente.** *personaje*, *distribución del texto por personaje*.

**No confundir con.** *actor* ni, estrictamente, con *interlocutor*.

---

## Interlocutor

**Definición operativa.** Personaje identificado como emisor de un parlamento concreto en el texto dramático.

**Uso.** Útil para describir la indicación nominal que precede a un parlamento.

**No recomendado como categoría del aparato.** Si lo que se registra es que los testimonios atribuyen un parlamento a personajes distintos, la categoría debe llamarse **atribución de parlamento**.

**Correspondencia TEI.** `<speaker>` expresa la indicación de interlocutor; `@who` identifica al emisor.

---

## Parlamento

**Definición.** Unidad de discurso atribuida a un personaje hasta que se produce un cambio de emisor.

**Decisión del proyecto.** Es el término preferente para la unidad representada por `<sp>`.

**Etiqueta actual.** `Intervenciones` en la estadística de personajes → **Parlamentos**.

**Razón.** *Intervención* es legítimo en estudios teatrales, pero en este proyecto se reserva preferentemente para la descripción genética de modificaciones del manuscrito. *Parlamento* evita la ambigüedad.

---

## Réplica

**Definición.** Toma de palabra considerada en su relación dialógica con un parlamento precedente o siguiente.

**Decisión del proyecto.** No usar como sinónimo general de `<sp>` en la interfaz. Puede emplearse en el análisis dramático cuando interese específicamente la dinámica de respuesta.

---

## Acotación

**Definición.** Indicación escénica explícita situada fuera del discurso pronunciado por los personajes o inserta en él como instrucción de representación.

**Decisión del proyecto.** Término preferente para el contenido codificado como `<stage>`.

**Etiqueta actual.** `Acotaciones` → **mantener**.

---

## Didascalia

**Definición.** Categoría más amplia que la de acotación. Según la tradición teórica adoptada, puede abarcar el conjunto de marcas no dialogadas del texto dramático —identificación de personajes, nómina inicial, divisiones estructurales, acotaciones— y también didascalias implícitas contenidas en el diálogo.

**Decisión del proyecto.** Reservar **didascalia** para el discurso teórico y analítico. No usarla como sinónimo de `<stage>` en la interfaz.

---

## Acto / jornada

**Definición.** Grandes unidades de segmentación externa de la comedia.

**Decisión del proyecto.** Usar **acto** como término normal de la interfaz.

**Razones.**
1. el autógrafo de *El marqués de las Navas* emplea «Acto primero»;
2. *acto* y *jornada* pueden funcionar históricamente como sinónimos, pero en Lope la frecuencia de *acto* es muy alta;
3. la interfaz debe respetar, cuando sea posible, la terminología material del testimonio principal.

**Etiqueta actual.** `Acto`, `Distribución por acto` → **mantener**.

---

## Cuadro

**Definición de proyecto.** Unidad de segmentación dramática analítica caracterizada por una combinación de continuidad espacial, temporal y de acción, conforme al modelo empleado en el análisis estructural.

**Uso.** En las herramientas de navegación o análisis estructural cuando se incorpore la división en cuadros.

**No confundir con.** Una división material presente en el manuscrito.

---

## Escena

**Decisión del proyecto.** Evitar como etiqueta estructural genérica si no se define previamente el criterio de segmentación.

**Uso posible.** *Escena a la francesa* cuando se adopte expresamente ese criterio, o en referencias bibliográficas que utilicen el término.

**Razón.** En la crítica del teatro áureo *escena* puede responder a modelos de segmentación diferentes y no debe convertirse automáticamente en sinónimo de *cuadro*.

---

## Verso

**Definición.** Unidad métrica del texto versificado.

**Etiqueta actual.** `Líneas` en la comparación de personajes → **revisar antes de sustituir**.

**Decisión pendiente.** La interfaz debería preferir **Versos** únicamente si el algoritmo contabiliza como una sola unidad métrica los versos partidos entre dos o más parlamentos (`part="I/M/F"`). Si cada fragmento codificado como `<l>` se cuenta por separado, denominar la cifra «versos» sería inexacto.

**Consecuencia técnica.** Antes de renombrar la métrica hay que definir el algoritmo de cómputo:
- verso completo = 1;
- verso partido = 1 verso métrico global;
- participación de cada personaje en un verso partido = debe explicitarse si se cuenta como fragmento o como verso compartido.

---

# 4. Crítica genética y manuscrito de autor

## Crítica genética

**Definición.** Disciplina orientada al estudio del proceso de escritura a partir de las huellas materiales conservadas y de las transformaciones del manuscrito o dossier genético.

**Principio del proyecto.** La finalidad genética no es reconstruir un único texto correcto, sino describir e interpretar el proceso de escritura y sus estados.

---

## Edición genética

**Definición.** Representación editorial destinada a hacer legibles los procesos y estados de escritura documentados.

**Decisión del proyecto.** Usar **Edición genética** en la interfaz. El sintagma *genético-evolutiva* queda descartado como etiqueta de navegación; solo podría emplearse en un desarrollo teórico si se definiera de forma expresa.

**Denominación global del proyecto.** **Edición crítico-genética** es adecuada cuando se alude conjuntamente a los dos niveles editoriales.

---

## Génesis del texto / génesis textual

**Definición.** Proceso de constitución y transformación de la obra durante la escritura.

**Etiqueta actual.** `Génesis del texto` → **mantener**.

---

## Estado textual

**Definición.** Configuración del texto reconstruible en un momento o estadio determinado del proceso de escritura.

**Uso recomendado para.** Las vistas acumulativas A0; A0+A1; A0+A1+A2; A0+A1+A2+B.

**Etiqueta actual.** `Vista textual` → **Estado textual**.

**Razón.** No se trata solo de una modalidad visual de la interfaz, sino de la reconstrucción de una configuración textual distinta.

---

## Estrato de escritura

**Definición de proyecto.** Conjunto de intervenciones agrupadas por criterios paleográficos, materiales y/o cronológicos suficientemente coherentes para distinguir una capa del proceso de escritura.

**Uso.** A0, A1, A2, B cuando se habla de las capas del modelo.

**Etiqueta recomendada.** **Estratos** o **Estratos de escritura**.

**Etiqueta actual.** `Intervenciones` como título general de A1/A2/B → **Estratos**.

---

## Fase de escritura

**Definición.** Momento o etapa del proceso genético inferido a partir de la secuencia de operaciones.

**Precaución.** No identificar automáticamente *fase* y *estrato*. Un estrato es una construcción descriptiva basada en huellas; una fase supone una interpretación temporal del proceso.

---

## Intervención de escritura / intervención genética

**Definición.** Acto individual o conjunto local de modificación material del texto: adición, supresión, sustitución, desplazamiento, restauración, etc.

**Uso.** Para fenómenos concretos codificados mediante `<add>`, `<del>`, `<subst>`, `<mod>`, `<addSpan>`, `<delSpan>`, etc.

**Decisión del proyecto.** Reservar aquí el término **intervención**, evitando usarlo como etiqueta principal de los parlamentos teatrales.

---

## Operación de escritura

**Definición.** Tipo observable de transformación material efectuada sobre el texto.

**Ejemplos.** *adición*, *supresión*, *sustitución*, *desplazamiento*, *restauración*.

**Uso.** Especialmente útil en filtros y documentación del modelo de codificación.

---

## Mano

**Definición.** Agente gráfico identificable paleográficamente.

**Uso.** *mano de Lope*, *otra mano*, *mano 1B*, *mano 2B*.

**No confundir con.** *Estrato* o *fase*. Una misma mano puede intervenir en fases distintas; un estrato se define por más criterios que la sola identidad de la mano.

---

## Autorial / no autorial

**Definición.** Clasificación de una intervención según su atribución a la mano o autoridad del autor.

**Uso preferente.** *intervenciones autoriales*, *intervenciones no autoriales*.

**Decisión del proyecto.** En la interfaz, usar **B · otras manos**. En la documentación analítica puede desarrollarse como **intervenciones de otras manos** o **intervenciones no autoriales**, según el contexto.

**Razón.** *Postautorial* introduce una afirmación cronológica más fuerte que la evidencia paleográfica necesaria para identificar manos distintas.

---

## Primera redacción

**Definición de proyecto.** Estado inicial reconocible de la escritura antes de las correcciones integradas en estratos posteriores.

**Etiqueta actual.** `A0 · primera redacción` → **mantener**.

---

## Correcciones inmediatas

**Definición de proyecto.** Intervenciones autoriales realizadas en estrecha continuidad con la primera redacción, cuando la evidencia material permite sostener esa proximidad.

**Etiqueta actual.** `A1 · correcciones inmediatas` → **mantener provisionalmente**, sujeta a la definición metodológica del estrato A1.

---

## Revisión autorial

**Definición de proyecto.** Intervenciones atribuibles a Lope que corresponden a una fase de revisión diferenciable de la primera redacción y de las correcciones inmediatas.

**Etiqueta actual.** `A2 · revisión` → **A2 · revisión autorial**.

---

## Último estado autorial

**Definición.** Estado reconstruido después de incorporar todas las intervenciones consideradas autoriales y antes de integrar modificaciones de otras manos.

**Etiqueta actual.** `A0 + A1 + A2 · último estado autorial` → **mantener**.

---

## Estado final conservado del manuscrito

**Definición.** Configuración documental resultante de todas las intervenciones conservadas en el manuscrito, incluidas las no autoriales.

**Decisión del proyecto.** Usar **estado final del manuscrito** en la interfaz para A0 + A1 + A2 + B. La expresión *estado documental* puede conservarse en la documentación metodológica únicamente si se define.

---

## Transcripción diplomática

**Definición.** Transcripción orientada a conservar de manera sistemática los rasgos relevantes del documento y de su configuración textual, conforme a los criterios establecidos por el proyecto.

**Etiqueta actual.** `Transcripción diplomática` → **mantener**.

---

## Facsímil

**Definición.** Reproducción digital de la imagen del documento.

**Etiqueta actual.** `Facsímil` → **mantener**.

---

# 5. Mapa de normalización de la interfaz actual

| Área | Etiqueta actual | Forma recomendada | Estado |
|---|---|---|---|
| Crítica | Edición crítica | Edición crítica | Mantener |
| Crítica | Texto crítico | Texto crítico | Mantener |
| Crítica | Testimonios | Testimonios | Mantener |
| Crítica | Cotejar con | Cotejar con | Mantener |
| Crítica | Selecciona testimonio | Seleccionar testimonio | Ajuste de estilo |
| Crítica | Aparato | Aparato | Mantener como botón |
| Crítica | Aparato crítico | Aparato crítico | Mantener |
| Crítica | Loci | Entradas / Entradas del aparato | Aplicado |
| Crítica | Texto | Texto | Mantener provisionalmente |
| Crítica | Acotaciones | Acotaciones | Mantener |
| Crítica | Interlocutores | Atribuciones | Aplicado |
| Crítica | Omisiones | Omisiones | Mantener |
| Crítica | Adiciones | Adiciones | Mantener |
| Crítica | Diferencias de atribución | Variantes de atribución | Aplicado |
| Crítica | Cambios de atribución | Variantes de atribución | Aplicado |
| Crítica | Distribución por acto | Distribución por acto | Mantener |
| Crítica | Comparación de personajes | Distribución textual por personaje | Aplicado |
| Crítica | Líneas | Versos | Pendiente de corregir el cómputo |
| Crítica | Intervenciones | Parlamentos | Aplicado |
| Crítica | Solo diferencias | Solo diferencias | Mantener |
| Genética | Edición genético-evolutiva | Edición genética | Aplicado |
| Genética | Vista textual | Estado textual | Aplicado |
| Genética | Génesis del texto | Génesis del texto | Mantener |
| Genética | Intervenciones [A1/A2/B] | Estratos / Estratos de escritura | Aplicado |
| Genética | A0 · primera redacción | A0 · primera redacción | Mantener |
| Genética | A1 · correcciones inmediatas | A1 · correcciones inmediatas | Mantener provisionalmente |
| Genética | A2 · revisión | A2 · revisión autorial | Aplicado |
| Genética | B · postautoriales | B · otras manos | Aplicado |
| Genética | último estado autorial | último estado autorial | Mantener |
| Genética | estado documental | estado final del manuscrito | Aplicado |
| Genética | Edición genética | Edición genética | Mantener |
| Genética | Transcripción diplomática | Transcripción diplomática | Mantener |
| Genética | Facsímil | Facsímil | Mantener |
| Genética | Leyenda de estratos | Leyenda de estratos | Mantener |

---

# 6. Decisiones que deben preceder a los cambios de interfaz

## 6.1. «Líneas» / «Versos»

No debe cambiarse la etiqueta hasta que el algoritmo de la estadística de personajes trate de forma filológicamente explícita los versos partidos entre parlamentos. La unidad TEI `<l>` no debe equipararse automáticamente a una unidad métrica.

## 6.2. «Distribución textual por personaje»

La herramienta no compara cualidades de los personajes, sino **la distribución del texto atribuido a cada personaje en los distintos testimonios**. La denominación normativa del panel es **Distribución textual por personaje**. Las métricas internas pueden variar —por ahora, líneas y parlamentos— sin alterar el nombre general del instrumento.

## 6.3. «Panorama del aparato»

El aparato crítico y la herramienta que lo resume/navega no son exactamente la misma entidad. La denominación normativa del panel sintético e interactivo es **Panorama del aparato**. El botón de acceso puede conservar la forma breve **Aparato**.

## 6.4. B y las otras manos

La interfaz adopta la formulación **B · otras manos**, que expresa la atribución paleográfica sin añadir una cronología no demostrada por la propia etiqueta. La documentación deberá distinguir, cuando sea pertinente, las manos concretas incluidas en B y su secuencia relativa.

---

# 7. Referencias terminológicas de base

### Crítica textual

- PROLOPE, **«Transmisión y edición del teatro de Lope de Vega»**: empleo de *cotejo*, *filiación*, *texto base*, *texto crítico*, *aparato crítico* y *colación*.  
  https://prolope.uab.cat/transmision-y-edicion-del-teatro-de-lope-de-vega/

- PROLOPE, **«Criterios de edición»**, Biblioteca Digital PROLOPE: *testimonio*, *variantes*, *aparato crítico*, *aparato positivo*, *enmienda*.  
  https://prolope.uab.cat/biblioteca/criterios-de-edicion

- PROLOPE, **«Criterios de codificación»**: tratamiento digital de variantes, alteraciones de orden, desplazamientos y problemas de visualización.  
  https://prolope.uab.cat/biblioteca/criterios-de-codificacion

- José Manuel Lucía Megías, **«Manuales de Crítica Textual. Las líneas maestras de la ecdótica española»**, para la terminología de edición crítica, testimonios, lecciones y edición diplomática.

### Teatro

- José Luis García Barrientos, trabajos de dramatología empleados en el proyecto, como referencia general para *personaje dramático*, estructura y categorías de análisis teatral.

- Alfredo Hermenegildo, trabajos sobre el diálogo teatral y el **parlamento como unidad dramática**.

- María del Carmen Bobes Naves, estudios sobre diálogo dramático, acotaciones y didascalias.

- Biblioteca Virtual Miguel de Cervantes, **«Acercamiento al estudio de las didascalias del teatro castellano primitivo»**: distinción entre la noción amplia de *didascalia* y las *acotaciones escénicas*.  
  https://www.cervantesvirtual.com/portales/federico_garcia_lorca/obra-visor/acercamiento-al-estudio-de-las-didascalias-del-teatro-castellano-primitivo-lucas-fernandez/

### Crítica genética

- Almuth Grésillon, trabajos fundacionales sobre crítica genética y génesis de la escritura.

- Élida Lois, trabajos sobre crítica genética y antetexto.

- Javier Blasco, trabajos sobre crítica genética y edición de manuscritos de autor.

- Estudios hispánicos sobre genética textual que distinguen la finalidad de la edición crítica —constitución del texto— de la finalidad genética —descripción e interpretación de los procesos de escritura—.

---

# 8. Criterio de implementación

La normalización debe hacerse **después de aprobar este glosario** y en una única revisión transversal de:

- edición crítica;
- aparato y tooltips;
- comparación de testimonios;
- estadísticas/distribución de personajes;
- edición genética;
- leyendas de estratos;
- notas y mensajes de ayuda;
- documentación metodológica.

No se recomienda sustituir términos uno a uno sin revisar simultáneamente su definición y la lógica de la función que nombran.
