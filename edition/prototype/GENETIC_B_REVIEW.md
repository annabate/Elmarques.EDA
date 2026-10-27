# Revisión sistemática de B en el acto I

**Archivo de trabajo:** `edition/prototype/EMN_mod_act1_pilot.xml`  
**Fecha:** 27 de octubre de 2026

## 1. Principio general

B se define como un **estrato postautorial unitario** que reúne las intervenciones no autógrafas.

El modelo no presupone:

- un número determinado de manos no autógrafas;
- la identidad de una misma mano en sectores diferentes del manuscrito;
- una correspondencia estable entre «primera» y «segunda» intervención y dos escribientes concretos;
- una cronología global interna de B.

Esta decisión responde a la situación material del manuscrito: en algunos lugares es posible distinguir con bastante seguridad dos intervenciones sucesivas, pero no puede establecerse con la misma seguridad cuántas manos intervienen en el conjunto del códice ni si las observables en la cubierta, los repartos y el cuerpo de la comedia corresponden a los mismos escribientes.

## 2. Información que sí puede codificarse con seguridad

El modelo separa cuatro niveles:

- `ana="#layer-B"`: pertenencia general al estrato postautorial B;
- `change="#stage-B"`: pertenencia a la fase postautorial;
- `@seq`: orden relativo entre intervenciones B únicamente cuando este puede establecerse en un lugar concreto;
- una taxonomía funcional secundaria para describir qué hace cada intervención.

La atribución mediante `@hand` es **facultativa** en B y solo deberá usarse en el futuro si una mano puede identificarse con suficiente seguridad.

## 3. Taxonomía funcional de B

Se declara una taxonomía independiente:

```xml
<taxonomy xml:id="B-functions">
  <category xml:id="B-substitution">
    <catDesc>Sustitución no autógrafa de una lección anterior.</catDesc>
  </category>
  <category xml:id="B-restoration">
    <catDesc>
      Restitución posterior, dentro de B, de una lección previamente modificada.
    </catDesc>
  </category>
  <category xml:id="B-performance">
    <catDesc>
      Intervención no autógrafa vinculada al uso escénico o a la representación.
    </catDesc>
  </category>
</taxonomy>
```

Estas categorías no sustituyen a `#layer-B`: lo complementan.

## 4. Sustitución B simple

Una sustitución postautorial puede codificarse sin atribuirla a una mano:

```xml
<mod xml:id="gB001"
     type="subst"
     change="#stage-B"
     ana="#layer-B #B-substitution">
  <del ana="#layer-A0">Mar</del>
  <add ana="#layer-B">Cond</add>
</mod>
```

El marcado afirma únicamente:

1. que la intervención no es autógrafa;
2. que pertenece a B;
3. que sustituye una lección anterior.

No afirma quién la ejecutó.

## 5. Sustitución seguida de restitución

En numerosos lugares se observa una secuencia material del tipo:

```text
A0: marqués
    ↓
B, intervención 1: conde
    ↓
B, intervención 2: marqués
```

La lógica del fenómeno y los rasgos materiales permiten sostener que existen dos intervenciones diferentes y sucesivas. No es necesario, sin embargo, convertir esa observación en la identificación de dos manos globales.

Se codifica:

```xml
<mod xml:id="gB001-1"
     type="subst"
     change="#stage-B"
     ana="#layer-B #B-substitution"
     seq="1">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">
    <mod xml:id="gB001-2"
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

La segunda lección `marqués` continúa perteneciendo a B: aunque coincida con A0, constituye una nueva inscripción postautorial.

## 6. Qué significa `@seq`

`@seq` expresa solamente una cronología **local**.

Por tanto:

```xml
seq="1"
seq="2"
```

significa que, en ese punto concreto, una segunda intervención actúa sobre el resultado de la primera.

No significa:

- «mano 1» y «mano 2»;
- «campaña B1» y «campaña B2»;
- que todos los eventos con `seq="1"` pertenezcan al mismo escribiente;
- que todos los eventos con `seq="2"` pertenezcan a otro escribiente común.

## 7. B sobre A1 o A2

Cuando B interviene sobre una lección autorial ya modificada, la cronología global está suficientemente expresada por los estratos.

Por ejemplo, en `Fili → He → Fad`:

- `Fili` pertenece a A0;
- `He` es una revisión A2;
- `Fad` es una sustitución B.

```xml
<mod type="subst"
     hand="#Lope"
     change="#stage-A2"
     ana="#layer-A2">
  <del ana="#layer-A0">Fili</del>
  <add ana="#layer-A2">
    <mod type="subst"
         change="#stage-B"
         ana="#layer-B #B-substitution">
      <del ana="#layer-A2">He</del>
      <add ana="#layer-B">Fad</add>
    </mod>
  </add>
</mod>
```

No se añade `@seq` a la intervención B porque A2→B ya está expresado por la sucesión de fases. `@seq` se reserva a las sucesiones internas de B.

## 8. Cancelaciones B

Una cancelación no autógrafa no necesita una categoría funcional secundaria si la estructura `type="del"` ya describe adecuadamente el fenómeno:

```xml
<mod xml:id="gB..."
     type="del"
     change="#stage-B"
     ana="#layer-B">
  <del ana="#layer-A0">...</del>
</mod>
```

El mismo principio se aplica a una cancelación extensa.

## 9. Cancelación extensa de los vv. 410–415

El intervalo se representa mediante `delSpan/@spanTo`:

```xml
<l n="410">
  <anchor xml:id="l_410"/>
  <delSpan xml:id="gB020"
           spanTo="#l_415"
           change="#stage-B"
           ana="#layer-B"/>
  Ya habrás oído mil veces
</l>
...
<anchor xml:id="l_415"/>
```

No se añade `@hand`: la nota permite hablar de una intervención no autógrafa dentro del mismo proceso de ocultación, pero no es necesario identificar esa «primera mano» con una entidad paleográfica global.

## 10. Intervenciones vinculadas a la representación

La categoría:

```xml
ana="#layer-B #B-performance"
```

queda disponible para intervenciones cuya relación con el uso escénico pueda sostenerse, por ejemplo determinadas adiciones o anotaciones de representación.

No se aplicará automáticamente a todo el material de los repartos: la función concreta de cada inscripción deberá comprobarse.

## 11. Repartos, cubierta y otros sectores del manuscrito

Las intervenciones de la cubierta y de los repartos se mantienen deliberadamente fuera de una identificación paleográfica fuerte.

Las notas permiten afirmar que:

- el material no es autógrafo;
- probablemente intervienen varias manos;
- en determinados sectores pueden distinguirse diferencias gráficas.

No permiten afirmar con seguridad:

- cuántas manos no autógrafas existen en total;
- que las manos de los repartos sean las mismas que las del cuerpo;
- que una misma mano intervenga en todos los casos aparentemente análogos.

Por ello, estos sectores se integrarán en B sin crear identificadores de mano salvo que una futura revisión paleográfica proporcione una base suficiente.

## 12. Casos todavía pendientes en el cuerpo

Tres aparatos B permanecen provisionalmente en la codificación heredada:

### `Feli → Leo`

La nota indica que la corrección fue realizada «al parecer por otra mano». Esto basta para excluirla de A2 y situarla en B, pero la estructura exacta se revisará antes de migrarla.

### `Siéntense`

Es una adición no autógrafa de probable valor escénico. Podrá utilizar `#B-performance` cuando se cierre su interpretación.

### `díjese`

Aparece junto a la cancelación extensa de los vv. 410–415. Debe decidirse si constituye una adición ligada al mismo evento o una intervención independiente.

## 13. Estado final de la migración B en el acto I

La migración B del acto I está completa.

El archivo `EMN_mod_act1_pilot.xml` contiene:

- **106 eventos B codificados mediante `<mod>`**;
- **1 cancelación extensa B mediante `<delSpan>`**;
- **107 intervenciones B en total**;
- **74 sustituciones B**;
- **31 adiciones B**;
- **1 cancelación B en línea**;
- **57 eventos funcionalmente clasificados como `#B-substitution`**;
- **17 eventos funcionalmente clasificados como `#B-restoration`**;
- **29 eventos funcionalmente clasificados como `#B-performance`**;
- **34 eventos con `@seq`**, correspondientes a 17 secuencias locales de dos intervenciones;
- **0 intervenciones B con `@hand`**;
- **0 aparatos `<app>` con B** restantes.

Los 29 casos de cubierta y repartos se han migrado como adiciones B sin atribución de mano. El título añadido se conserva como adición B simple; las 28 entradas de reparto se clasifican además mediante `#B-performance`.

Los tres últimos casos del cuerpo se han resuelto así:

- `Feli → Leo`: sustitución B;
- `Siéntense`: adición B con función escénica;
- `díjese`: adición B sin clasificación funcional adicional.

## 14. Resultado metodológico

La migración confirma que el estrato B puede describirse de forma suficientemente precisa sin reconstruir un inventario global de manos no autógrafas.

La estructura actual permite recuperar:

- el carácter postautorial de cada intervención;
- su relación con A0/A1/A2;
- la función de sustitución, restitución o uso escénico cuando resulta pertinente;
- el orden local de operaciones sucesivas.

Al mismo tiempo, evita afirmar datos no demostrables sobre el número y la identidad de las manos.
