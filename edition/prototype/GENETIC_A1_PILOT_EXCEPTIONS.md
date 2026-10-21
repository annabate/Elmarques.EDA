# Excepciones detectadas durante la migración piloto A1

La primera selección contenía 38 casos A0→A1 considerados inicialmente de baja prioridad. Un control estructural más estricto ha reducido a 23 los casos aptos para conversión automática.

Los siguientes 15 casos requieren revisión antes de migrarse:

## APP-040

- **Localización aproximada:** [Fol. 3v], verso numerado previo 130.
- **Motivo:** lectura incierta marcada con «?».
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">llévame(?)</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>llévame(?)</del></lem></app>
```

## APP-048

- **Localización aproximada:** [Fol. 4v], verso numerado previo 180.
- **Motivo:** la lectura A1 aparece como texto directo en <lem>, sin <del>/<add>/<subst>.
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">j</rdg><lem wit="A1" varSeq="1" hand="authorial">c</lem></app>
```

## APP-062

- **Localización aproximada:** [Fol. 6r], verso numerado previo 270.
- **Motivo:** lectura incierta marcada con «?».
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">amores?</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>amores?</del><add>envido</add></subst></lem></app>
```

## APP-063

- **Localización aproximada:** [Fol. 6v], verso numerado previo 305.
- **Motivo:** la lectura A0 («la defen») no coincide con el contenido cancelado («defen»).
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">la defen</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>defen</del></lem></app>
```

## APP-065

- **Localización aproximada:** [Fol. 7v], verso numerado previo 360.
- **Motivo:** hay texto significativo fuera de <del> dentro de <lem> («Voluntades diferentes»).
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">conciert</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>conciert</del>Voluntades diferentes</lem></app>
```

## APP-080

- **Localización aproximada:** [Fol. 8v], verso numerado previo 425.
- **Motivo:** lectura incierta marcada con «?».
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">Si er?</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>Si er?</del></lem></app>
```

## APP-083

- **Localización aproximada:** [Fol. 9r], verso numerado previo 435.
- **Motivo:** hay texto significativo fuera de <lem> pero dentro de <app> («por Dios.»).
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="auhtorial">tu nombre</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>tu nombre</del></lem> por Dios.</app>
```

## APP-084

- **Localización aproximada:** [Fol. 9r], verso numerado previo 445.
- **Motivo:** lectura incierta marcada con «?».
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">quien?</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>quien?</del><add>pues</add></subst></lem></app>
```

## APP-085

- **Localización aproximada:** [Fol. 10r], verso numerado previo 485.
- **Motivo:** hay texto significativo fuera de <del> dentro de <lem>.
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">podré</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>podré</del>después sólo de mí tendré la queja.</lem></app>
```

## APP-088

- **Localización aproximada:** [Fol. 11v], verso numerado previo 560.
- **Motivo:** la lectura A0 no coincide con el contenido de <del> y cambia el orden verbal.
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial"> para mí fue</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>fue para mí</del><add>, Gerarda, fue</add></subst></lem></app>
```

## APP-090

- **Localización aproximada:** [Fol. 11v], verso numerado previo 565.
- **Motivo:** lectura incierta marcada con «?».
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">tan?</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>tan?</del></lem></app>
```

## APP-092

- **Localización aproximada:** [Fol. 11v], verso numerado previo 580.
- **Motivo:** lectura incierta marcada con «?».
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">le?</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>le?</del><add>me</add></subst></lem></app>
```

## APP-093

- **Localización aproximada:** [Fol. 12r], verso numerado previo 595.
- **Motivo:** sustitución compleja con dos <del>, texto intermedio y lectura incierta.
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">tu? has trazado</rdg><lem wit="A1" varSeq="1" hand="authorial"><subst><del>tu?</del> has <del>trazado</del> <add>pensado</add></subst></lem></app>
```

## APP-098

- **Localización aproximada:** [Fol. 13r], verso numerado previo 645.
- **Motivo:** lectura incierta marcada con «?».
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">ci.. a su?</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>ci.. a su?</del></lem></app>
```

## APP-127

- **Localización aproximada:** [Fol. 15r], verso numerado previo 755.
- **Motivo:** lectura incierta marcada con «?».
- **Codificación actual:**

```xml
<app><rdg wit="A0" varSeq="0" hand="authorial">yo s?</rdg><lem wit="A1" varSeq="1" hand="authorial"><del>yo s?</del></lem></app>
```


## Criterio

La presencia de uno de estos problemas no implica que la clasificación A1 sea errónea. Significa únicamente que la estructura heredada no permite una transformación mecánica segura. En particular, las lecturas marcadas con «?» deberán sustituirse posteriormente por una codificación explícita de la incertidumbre —por ejemplo mediante `<unclear>` cuando corresponda— en lugar de conservar el signo interrogativo como parte del texto.
