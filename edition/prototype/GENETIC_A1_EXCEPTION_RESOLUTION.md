# Resolución de las excepciones A1 del piloto

Este documento recoge la revisión individual de los 15 casos A0→A1 que habían quedado fuera de la primera conversión automática.

La revisión se ha realizado distinguiendo tres situaciones diferentes:

1. irregularidades puramente estructurales de la codificación antigua;
2. lecturas inciertas que pueden expresarse mediante mecanismos TEI específicos;
3. casos que requieren comprobar el facsímil o tomar una decisión filológica adicional.

## 1. Criterio para las lecturas inciertas

La TEI P5 4.12.0 utiliza `<unclear>` cuando existe una lectura posible, pero esta no puede transcribirse con plena seguridad a causa de la legibilidad de la fuente. Cuando una parte no puede transcribirse en absoluto, el mecanismo adecuado es `<gap>`.

En el piloto se adopta provisionalmente:

```xml
<unclear cert="low">...</unclear>
```

para sustituir el signo interrogativo añadido a una lectura conjetural. El signo `?` deja así de formar parte del texto transcrito y la incertidumbre pasa a expresarse estructuralmente.

## 2. Casos resueltos y migrados

### APP-040 — f. 3v, v. 130

La nota ya indica expresamente que la lectura bajo la tachadura no puede establecerse con seguridad. La clasificación A1 se mantiene y la incertidumbre pasa a `<unclear>`.

```xml
<mod xml:id="g040" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    <unclear cert="low">llévame</unclear>
  </del>
</mod>
```

### APP-048 — f. 4v, entorno del v. 180

La codificación antigua expresaba simplemente `j → c` mediante dos lecturas, sin marcar materialmente la sustitución. Dado que se trata de un cambio de una grafía por otra dentro de una secuencia A0→A1, se normaliza como sustitución inmediata.

```xml
<mod xml:id="g048" type="subst"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">j</del>
  <add ana="#layer-A1">c</add>
</mod>
```

### APP-062 — f. 6r, entorno del v. 270

La lectura cancelada se conserva como conjetura, pero sin incorporar `?` al texto.

```xml
<mod xml:id="g062" type="subst"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    <unclear cert="low">amores</unclear>
  </del>
  <add ana="#layer-A1">envido</add>
</mod>
```

### APP-063 — f. 6v, entorno del v. 305

La lectura A0 del aparato era `la defen`, pero solo `defen` aparece materialmente cancelado. La secuencia `la` debe permanecer fuera del evento genético.

```xml
la
<mod xml:id="g063" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">defen</del>
</mod>
```

Esta solución evita atribuir a la cancelación material una porción de texto que no está tachada.

### APP-065 — f. 7v, v. 360

El aparato incluía dentro del `<lem>` tanto el texto cancelado como la continuación no marcada. La nota describe un error de anticipación corregido de inmediato.

La cancelación se modela como evento A1; la continuación `Voluntades diferentes` permanece como texto corriente, porque no está descrita materialmente como una adición.

```xml
<mod xml:id="g065" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">conciert</del>
</mod>Voluntades diferentes
```

### APP-080 — f. 8v, entorno del v. 425

```xml
<mod xml:id="g080" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    <unclear cert="low">Si er</unclear>
  </del>
</mod>
```

### APP-083 — f. 9r, entorno del v. 435

El problema era doble: el error tipográfico `hand="auhtorial"` y la presencia de `por Dios.` dentro de `<app>` pero fuera de `<lem>`.

Solo `tu nombre` está representado como cancelado; `por Dios.` permanece como continuación del texto.

```xml
<mod xml:id="g083" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">tu nombre</del>
</mod> por Dios.
```

### APP-084 — f. 9r, entorno del v. 445

```xml
<mod xml:id="g084" type="subst"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    <unclear cert="low">quien</unclear>
  </del>
  <add ana="#layer-A1">pues</add>
</mod>
```

### APP-085 — f. 10r, entorno del v. 485

Como en APP-065, el texto posterior a la cancelación estaba incluido dentro de `<lem>` sin constituir una adición material.

```xml
<mod xml:id="g085" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">podré</del>
</mod>después sólo de mí tendré la queja.
```

### APP-090 — f. 11v, entorno del v. 565

```xml
<mod xml:id="g090" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    <unclear cert="low">tan</unclear>
  </del>
</mod>
```

### APP-092 — f. 11v, entorno del v. 580

```xml
<mod xml:id="g092" type="subst"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    <unclear cert="low">le</unclear>
  </del>
  <add ana="#layer-A1">me</add>
</mod>
```

## 3. Casos todavía pendientes

### APP-088 — f. 11v, entorno del v. 560

Existe una contradicción entre la lectura A0 del aparato:

```text
para mí fue
```

y el contenido de `<del>`:

```text
fue para mí
```

No es posible decidir cuál de las dos secuencias reproduce la materialidad del manuscrito sin volver al facsímil. El caso permanece sin migrar.

### APP-093 — f. 12r, entorno del v. 595

La codificación actual reúne en una única `<subst>`:

- una primera cancelación incierta (`tu?`);
- el texto no modificado `has`;
- una segunda cancelación (`trazado`);
- una adición (`pensado`).

Una posible solución sería separar dos eventos:

```xml
<mod type="del" ...>
  <del><unclear cert="low">tu</unclear></del>
</mod>
has
<mod type="subst" ...>
  <del>trazado</del>
  <add>pensado</add>
</mod>
```

pero antes es necesario comprobar en el facsímil si se trata efectivamente de dos operaciones distinguibles o de una única corrección compleja. Por esta razón, el caso permanece pendiente.

### APP-098 — f. 13r, entorno del v. 645

La lectura `ci.. a su?` contiene tanto una conjetura como una porción aparentemente no transcrita. No es posible establecer automáticamente si los dos puntos representan:

- grafemas ilegibles;
- una laguna de extensión desconocida;
- una convención provisional de transcripción.

El caso requiere comprobar el facsímil para decidir entre `<unclear>`, `<gap>` o una combinación de ambos.

### APP-127 — f. 15r, entorno del v. 755

La lectura `yo s?` es demasiado fragmentaria para establecer si toda la secuencia debe tratarse como `<unclear>` o si existe una porción ilegible que deba representarse mediante `<gap>`. Por ello, permanece pendiente hasta comprobar el facsímil.

## 4. Resultado del segundo paso

Después de esta revisión:

- **23** casos se habían migrado en la primera fase;
- **11** casos adicionales se han podido resolver y migrar;
- **34** casos A1 están ahora codificados con el nuevo modelo;
- **4** casos permanecen deliberadamente pendientes: APP-088, APP-093, APP-098 y APP-127.

El hecho de que queden únicamente cuatro casos pendientes confirma que el modelo A1 es suficientemente estable para la mayor parte del acto I, pero también muestra la conveniencia de mantener una vía explícita para la incertidumbre y para las configuraciones genéticas complejas.
