# Migración piloto A1: comparación entre la codificación anterior y la nueva

**Archivo de origen:** `edition/EMN_mod.xml` de `main`  
**Archivo piloto:** `edition/prototype/EMN_mod_A1_pilot.xml`  
**Fecha:** 21 de octubre de 2026

## 1. Criterio aplicado

La primera clasificación automática había identificado 38 casos A0→A1 de baja prioridad. Antes de transformar el archivo se añadió un segundo control más estricto: solo se consideran convertibles automáticamente los casos en los que la estructura antigua es **isomorfa** con el nuevo modelo.

Para una cancelación se exige que:

- exista una única lectura A0;
- el `<lem>` A1 contenga un único `<del>`;
- el contenido de A0 coincida con el contenido cancelado;
- no haya texto significativo fuera de `<del>`;
- no haya marcas de incertidumbre mediante «?».

Para una sustitución se exige que:

- exista una única lectura A0;
- haya exactamente un `<del>` y un `<add>`;
- el contenido de A0 coincida con el `<del>`;
- no haya texto significativo fuera de `<del>/<add>`;
- no haya marcas de incertidumbre.

Con este criterio, **23 de los 38 casos** pudieron convertirse automáticamente en la primera fase. La revisión individual posterior de las 15 excepciones permitió migrar **11 casos adicionales**, de modo que el piloto contiene actualmente **34 casos A1 migrados** y **4 pendientes**.

## 2. Casos convertidos

### APP-031 — cancelación

Localización aproximada: [Fol. 1r], verso numerado previo 5.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">m</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>m</del></lem></app>
```

**Después**

```xml
<mod xml:id="g031" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">m</del></mod>
```

### APP-032 — cancelación

Localización aproximada: [Fol. 1r], verso numerado previo 5.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">para mi</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>para mi</del></lem></app>
```

**Después**

```xml
<mod xml:id="g032" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">para mi</del></mod>
```

### APP-034 — cancelación

Localización aproximada: [Fol. 1r], verso numerado previo 15.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">ser</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>ser</del></lem></app>
```

**Después**

```xml
<mod xml:id="g034" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">ser</del></mod>
```

### APP-035 — cancelación

Localización aproximada: [Fol. 1v], verso numerado previo 25.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">si ha hecho</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>si ha hecho</del></lem></app>
```

**Después**

```xml
<mod xml:id="g035" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">si ha hecho</del></mod>
```

### APP-036 — cancelación

Localización aproximada: [Fol. 1v], verso numerado previo 35.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">que aun</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>que aun</del></lem></app>
```

**Después**

```xml
<mod xml:id="g036" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">que aun</del></mod>
```

### APP-038 — cancelación

Localización aproximada: [Fol. 2v], verso numerado previo 80.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">d</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>d</del></lem></app>
```

**Después**

```xml
<mod xml:id="g038" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">d</del></mod>
```

### APP-041 — sustitución

Localización aproximada: [Fol. 4r], verso numerado previo 165.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">Ger</rdg><lem wit="A1" varSeq="1" hand="authorial"><susbt><del>Ger</del><add>Lau</add></susbt></lem></app>
```

**Después**

```xml
<mod xml:id="g041" type="subst" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">Ger</del><add ana="#layer-A1">Lau</add></mod>
```

### APP-049 — sustitución

Localización aproximada: [Fol. 4v], verso numerado previo 190.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">de Olofernes</rdg> <lem wit="A1" varSeq="1" hand="authorial"><subst><del>de Olofernes</del> <add>diligente</add></subst></lem></app>
```

**Después**

```xml
<mod xml:id="g049" type="subst" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">de Olofernes</del><add ana="#layer-A1">diligente</add></mod>
```

### APP-050 — sustitución

Localización aproximada: [Fol. 4v], verso numerado previo 190.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">en la entrada de un ginete</rdg> <lem wit="A1" varSeq="1" hand="authorial"><subst><del>en la entrada de un ginete</del> <add>bizarro como un alférez</add></subst></lem></app>
```

**Después**

```xml
<mod xml:id="g050" type="subst" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">en la entrada de un ginete</del><add ana="#layer-A1">bizarro como un alférez</add></mod>
```

### APP-059 — cancelación

Localización aproximada: [Fol. 5v], verso numerado previo 235.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">ya</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>ya</del></lem></app>
```

**Después**

```xml
<mod xml:id="g059" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">ya</del></mod>
```

### APP-061 — sustitución

Localización aproximada: [Fol. 5v], verso numerado previo 255.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">dele</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>dele</del><add>deme</add></subst></lem></app>
```

**Después**

```xml
<mod xml:id="g061" type="subst" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">dele</del><add ana="#layer-A1">deme</add></mod>
```

### APP-076 — cancelación

Localización aproximada: [Fol. 8v], verso numerado previo 420.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">acabarse</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>acabarse</del></lem></app>
```

**Después**

```xml
<mod xml:id="g076" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">acabarse</del></mod>
```

### APP-081 — cancelación

Localización aproximada: [Fol. 9r], verso numerado previo 430.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">a</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>a</del></lem></app>
```

**Después**

```xml
<mod xml:id="g081" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">a</del></mod>
```

### APP-082 — cancelación

Localización aproximada: [Fol. 9r], verso numerado previo 430.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">llam</rdg> <lem wit="A1" varSeq="1" hand="authorial"><del>llam</del></lem></app>
```

**Después**

```xml
<mod xml:id="g082" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">llam</del></mod>
```

### APP-086 — cancelación

Localización aproximada: [Fol. 10v], verso numerado previo 510.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">que</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>que</del></lem></app>
```

**Después**

```xml
<mod xml:id="g086" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">que</del></mod>
```

### APP-087 — cancelación

Localización aproximada: [Fol. 10v], verso numerado previo 520.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">de</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>de</del></lem></app>
```

**Después**

```xml
<mod xml:id="g087" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">de</del></mod>
```

### APP-089 — sustitución

Localización aproximada: [Fol. 11v], verso numerado previo 560.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">de noche</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>de noche</del><add>para mí!</add></subst></lem></app>
```

**Después**

```xml
<mod xml:id="g089" type="subst" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">de noche</del><add ana="#layer-A1">para mí!</add></mod>
```

### APP-091 — cancelación

Localización aproximada: [Fol. 11v], verso numerado previo 565.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">Vi</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>Vi</del></lem></app>
```

**Después**

```xml
<mod xml:id="g091" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">Vi</del></mod>
```

### APP-094 — cancelación

Localización aproximada: [Fol. 12v], verso numerado previo 615.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">A don Filipe</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>A don Filipe</del></lem></app>
```

**Después**

```xml
<mod xml:id="g094" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">A don Filipe</del></mod>
```

### APP-122 — cancelación

Localización aproximada: [Fol. 14r], verso numerado previo 705.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">m</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>m</del></lem></app>
```

**Después**

```xml
<mod xml:id="g122" type="del" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">m</del></mod>
```

### APP-125 — sustitución

Localización aproximada: [Fol. 14v], verso numerado previo 725.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">y los aforros</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>y los aforros</del><add>hasta el aforro</add></subst></lem></app>
```

**Después**

```xml
<mod xml:id="g125" type="subst" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">y los aforros</del><add ana="#layer-A1">hasta el aforro</add></mod>
```

### APP-130 — sustitución

Localización aproximada: [Fol. 15v], verso numerado previo 775.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">nuestras</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>nuestras</del><add>de nuestra casa</add></subst></lem></app>
```

**Después**

```xml
<mod xml:id="g130" type="subst" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">nuestras</del><add ana="#layer-A1">de nuestra casa</add></mod>
```

### APP-136 — sustitución

Localización aproximada: [Fol. 16v], verso numerado previo 835.

**Antes**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">que quien comienza</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>que quien comienza</del><add>que los que empiezan</add></subst></lem></app>
```

**Después**

```xml
<mod xml:id="g136" type="subst" hand="#Lope" instant="true" ana="#layer-A1"><del ana="#layer-A0">que quien comienza</del><add ana="#layer-A1">que los que empiezan</add></mod>
```


## 3. Casos excluidos de la conversión automática

- **APP-040**: lectura incierta marcada con «?».
- **APP-048**: la lectura A1 aparece como texto directo en <lem>, sin <del>/<add>/<subst>.
- **APP-062**: lectura incierta marcada con «?».
- **APP-063**: la lectura A0 («la defen») no coincide con el contenido cancelado («defen»).
- **APP-065**: hay texto significativo fuera de <del> dentro de <lem> («Voluntades diferentes»).
- **APP-080**: lectura incierta marcada con «?».
- **APP-083**: hay texto significativo fuera de <lem> pero dentro de <app> («por Dios.»).
- **APP-084**: lectura incierta marcada con «?».
- **APP-085**: hay texto significativo fuera de <del> dentro de <lem>.
- **APP-088**: la lectura A0 no coincide con el contenido de <del> y cambia el orden verbal.
- **APP-090**: lectura incierta marcada con «?».
- **APP-092**: lectura incierta marcada con «?».
- **APP-093**: sustitución compleja con dos <del>, texto intermedio y lectura incierta.
- **APP-098**: lectura incierta marcada con «?».
- **APP-127**: lectura incierta marcada con «?».

Estos casos permanecen sin modificar en el archivo piloto y deben resolverse mediante revisión filológica y/o una codificación específica de la incertidumbre.

## 4. Naturaleza del archivo piloto

`EMN_mod_A1_pilot.xml` es deliberadamente un archivo **híbrido de transición**: contiene los 23 casos A1 ya migrados al nuevo modelo y conserva el aparato antiguo en todos los demás lugares. Por esta razón no debe validarse todavía contra `EMN_genetic.odd`, cuyo propósito es controlar un archivo ya completamente migrado.

El objetivo del piloto es verificar que la transformación conserva el contenido textual, permite reconocer con claridad los casos no convertidos y ofrece una base segura para extender progresivamente la migración.


## 5. Segunda fase del piloto

La revisión individual de las excepciones se documenta en `GENETIC_A1_EXCEPTION_RESOLUTION.md`. Se han añadido al piloto los casos APP-040, APP-048, APP-062, APP-063, APP-065, APP-080, APP-083, APP-084, APP-085, APP-090 y APP-092. Los casos APP-088, APP-093, APP-098 y APP-127 permanecen sin migrar hasta comprobar el facsímil o resolver su estructura genética.
