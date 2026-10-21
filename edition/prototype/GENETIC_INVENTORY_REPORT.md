# Inventario de la codificación genética actual

**Archivo analizado:** `edition/EMN_mod.xml`  
**Fuente:** rama `main`  
**SHA del archivo:** `0841554a66c58e52e4d61a47df1c0f29423b9dd7`  
**Finalidad:** preparar la migración al modelo TEI genético definido en `EMN_genetic.odd`.

> **Alcance del inventario.** El archivo `EMN_mod.xml` disponible actualmente en `main` contiene únicamente el **acto I**, hasta aproximadamente el v. 835. Por tanto, este inventario es completo respecto del archivo actual, pero no respecto de la comedia completa. El archivo diplomático `EMN_dip.xml` contiene también el acto II, por lo que la extensión del modelo a los actos restantes deberá abordarse como una fase posterior.

## 1. Resultado general

El archivo contiene **136 aparatos `<app>`**. El inventario confirma que una parte relevante puede convertirse de forma semiautomática, pero también que existen grupos que requieren revisión filológica antes de la migración.

| Prioridad de revisión | Casos |
| --- | ---: |
| Baja | 38 |
| Media | 93 |
| Alta | 5 |

Los **38 casos A0→A1 de prioridad baja** constituyen el primer núcleo razonable para una conversión automatizada controlada.

## 2. Secuencias actuales de `@wit`

- `A0→A1`: 41
- `A0→B`: 39
- `B`: 32
- `A0→B→B`: 16
- `A0→A2`: 4
- `B→A2`: 1
- `A1→A0`: 1
- `A0→A1→B→B`: 1
- `A0→A2→B`: 1

Estas secuencias no se interpretan ya como testimonios en el nuevo modelo. Se utilizan aquí únicamente para reconstruir la lógica de la codificación precedente y proponer su conversión.

## 3. Tipos de fenómeno detectados

- sustitución: 76
- lectura/adición simple: 33
- cancelación: 25
- otro: 1
- delSpan: 1

La categoría «lectura/adición simple» corresponde sobre todo a intervenciones B registradas como una única `<rdg>` sin oposición explícita con una lección anterior. No deben transformarse automáticamente en `<add>` hasta determinar su relación documental con el soporte y con las demás manos.

## 4. Problemas formales detectados

- `<susbt>` en lugar de `<subst>`: **42** ocurrencias.
- `hand="auhtorial"`: **1** ocurrencia.
- `hand="non--authorial"`: **1** ocurrencia.
- `@varSeq`: **231** ocurrencias.
- `<delSpan>`: **1** caso, actualmente con una construcción que debe migrarse a `@spanTo`.

Estos errores y peculiaridades deben corregirse durante la migración, no mediante una limpieza aislada que pueda borrar información necesaria para reconstruir la secuencia previa.

## 5. Casos A2

Se han localizado **6 aparatos que contienen A2**. Todos deben revisarse manualmente antes de fijar `change="#stage-A2"`, aunque algunos parecen claramente compatibles con una revisión diferida.

- **APP-030**, línea XML 64, [Fol. 1r]: `A0→A2`, sustitución.
- **APP-033**, línea XML 90, [Fol. 1r], verso numerado previo 10: `B→A2`, lectura/adición simple.
- **APP-054**, línea XML 588, [Fol. 5r], verso numerado previo 215: `A0→A2`, sustitución.
- **APP-055**, línea XML 589, [Fol. 5r], verso numerado previo 220: `A0→A2`, sustitución.
- **APP-115**, línea XML 1958, [Fol. 13v], verso numerado previo 685: `A0→A2→B`, sustitución.
- **APP-129**, línea XML 2264, [Fol. 15v], verso numerado previo 775: `A0→A2`, sustitución.

## 6. Casos de prioridad alta

### APP-033

- Línea XML: 90
- Acto: 1
- Folio: [Fol. 1r]
- Verso numerado previo: 10
- Secuencia actual: `B→A2`
- Fenómeno: lectura/adición simple
- Alertas: secuencia excepcional
- Contexto: debes tan buenas. Leonardo, a mi fin ordenas de que te vengo a deber quererle agora poner a tantas injustas penas. Feli Leo ¡Suéltame la capa! ¡Suelta! Suelta en paz, que una porfía convierte en descortesía determinación resuelta. El Fénix atribu

### APP-051

- Línea XML: 564
- Acto: 1
- Folio: [Fol. 5r]
- Verso numerado previo: 200
- Secuencia actual: `A1→A0`
- Fenómeno: otro
- Alertas: secuencia excepcional; nota con cautela interpretativa
- Contexto: stro puede ser molde de hacer diablos para el jueves en que al despensero cuelgan que afrenta los calabreses? (?) Mayormente si es tan Roma (?) En este pasaje se documenta un proceso de génesis textual caracterizado por sucesivas intervenciones de reescritura, visibles en las tachaduras y sustituciones registradas en

### APP-067

- Línea XML: 1061
- Acto: 1
- Folio: [Fol. 8r]
- Verso numerado previo: 390
- Secuencia actual: `A0→A1→B→B`
- Fenómeno: sustitución
- Alertas: secuencia excepcional
- Contexto: > yo te diré libremente calidad, nombres y casa de estas damas. Me Pues advierte: los que están a esta parte los que están a esta parte este es marqués de las Navas este es marqués de las Navas este es el conde don Felis este es el conde don Felis este es marqués de las Navas . Cla ¿El de las Navas

### APP-074

- Línea XML: 1142
- Acto: 1
- Folio: [Fol. 8v]
- Verso numerado previo: 415
- Secuencia actual: `B`
- Fenómeno: delSpan
- Alertas: long-span
- Contexto: , nuevo Orestes, nuevo Acates de Filipe Segundo, mas tú no entiendes antigüedades ni historia. díjese la tachadura por parte de la primera mano parece responder a la misma intención de encubrimiento ya señal

### APP-115

- Línea XML: 1958
- Acto: 1
- Folio: [Fol. 13v]
- Verso numerado previo: 685
- Secuencia actual: `A0→A2→B`
- Fenómeno: sustitución
- Alertas: secuencia excepcional
- Contexto: como hijo del almirante, el mundo en ombros, Atlante, que le podrá sustentar. ¡Qué bizarro caballero! Fili Fili He He Fad > La fiesta ha de ser famosa. Fili Si aquella ninfa amorosa por quien desde anoche muero <pb t


## 7. Notas que expresan cautela interpretativa

Se han detectado **7 casos** cuya nota contiene formulaciones como «parece», «probable», «al parecer», referencias a tinta/mano o indicaciones de incertidumbre. La detección es heurística: sirve para priorizar la revisión, no sustituye el juicio filológico.

## 8. Estrategia de migración recomendada

La migración debería empezar por los casos **A0→A1 de prioridad baja**, porque su estructura actual suele corresponder de manera clara a cancelaciones o sustituciones inmediatas autoriales. Después pueden abordarse los A2 ya confirmados, y solo en un tercer bloque las intervenciones B, que requieren primero establecer de manera coherente la relación entre manos y campañas.

El archivo completo, con una fila por cada `<app>`, se conserva en `GENETIC_INVENTORY.csv`. La lista de los casos que requieren atención filológica se resume en `GENETIC_REVIEW_CASES.md`.
