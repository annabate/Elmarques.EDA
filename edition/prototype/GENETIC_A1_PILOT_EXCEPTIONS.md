# Excepciones detectadas durante la migración piloto A1

La primera selección contenía 38 casos A0→A1 considerados inicialmente de baja prioridad. Un primer control estructural redujo a 23 los casos aptos para conversión automática. La revisión individual de las 15 excepciones permitió resolver y migrar **11 casos adicionales**.

El estado actual del piloto es, por tanto:

- **34 casos A1 migrados** al nuevo modelo;
- **4 casos pendientes** de comprobación filológica o facsimilar.

La resolución detallada de los 15 casos se documenta en `GENETIC_A1_EXCEPTION_RESOLUTION.md`.

## Casos todavía pendientes

### APP-088

- **Localización aproximada:** [Fol. 11v], entorno del v. 560.
- **Problema:** la lectura A0 del aparato (`para mí fue`) no coincide con el contenido de `<del>` (`fue para mí`), por lo que no puede establecerse automáticamente cuál de las dos secuencias reproduce la materialidad del manuscrito.
- **Codificación heredada:**

```xml
<app>
  <rdg wit="A0" varSeq="0" hand="authorial"> para mí fue</rdg>
  <lem wit="A1" varSeq="1" hand="authorial">
    <subst>
      <del>fue para mí</del>
      <add>, Gerarda, fue</add>
    </subst>
  </lem>
</app>
```

### APP-093

- **Localización aproximada:** [Fol. 12r], entorno del v. 595.
- **Problema:** una única `<subst>` reúne dos cancelaciones, texto intermedio no modificado y una adición. Además, la primera lectura es incierta.
- **Decisión pendiente:** comprobar si deben distinguirse dos eventos inmediatos —cancelación de `tu?` y sustitución `trazado → pensado`— o si la materialidad aconseja mantener un único evento complejo.

### APP-098

- **Localización aproximada:** [Fol. 13r], entorno del v. 645.
- **Problema:** la lectura `ci.. a su?` combina una conjetura con una porción aparentemente no transcrita.
- **Decisión pendiente:** comprobar el facsímil para determinar si corresponde usar `<unclear>`, `<gap>` o ambos.

### APP-127

- **Localización aproximada:** [Fol. 15r], entorno del v. 755.
- **Problema:** la lectura fragmentaria `yo s?` no permite decidir automáticamente si toda la secuencia es incierta o si existe una porción ilegible no transcrita.
- **Decisión pendiente:** comprobación del facsímil antes de migrar.

## Casos resueltos en la segunda fase

Se han incorporado al archivo piloto:

`APP-040`, `APP-048`, `APP-062`, `APP-063`, `APP-065`, `APP-080`, `APP-083`, `APP-084`, `APP-085`, `APP-090` y `APP-092`.

En los casos de lectura conjetural se ha sustituido el signo interrogativo editorial por una codificación explícita mediante `<unclear cert="low">`. Las irregularidades estructurales se han resuelto distinguiendo el material realmente cancelado del texto que simplemente continúa después de la corrección.

## Criterio general

Que un caso figure en este registro no implica que su clasificación A1 sea errónea. El registro identifica únicamente los lugares en los que la estructura heredada no permite una migración mecánica segura o en los que la transcripción debe comprobarse directamente sobre el manuscrito.
