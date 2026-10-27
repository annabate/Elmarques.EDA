# Revisión sistemática de B en el acto I

**Archivo de trabajo:** `edition/prototype/EMN_mod_act1_pilot.xml`  
**Fecha:** 27 de octubre de 2026

## 1. Objetivo

Esta revisión aborda las intervenciones no autógrafas del acto I y redefine su representación a partir de una distinción fundamental:

- **B** es el estrato o fase postautorial;
- **hB1 / hB2** son manos;
- el orden entre dos intervenciones B solo se expresa mediante `@seq` cuando puede demostrarse localmente.

No se presupone, por tanto, una cronología global del tipo «campaña B1 → campaña B2» para todo el manuscrito.

## 2. Inventario de partida

En el archivo heredado se localizaron **90 aparatos que contienen B**.

Se distribuyen en dos conjuntos diferentes:

- **29 intervenciones en los repartos iniciales**, anteriores al comienzo del acto;
- **61 intervenciones dentro del cuerpo del acto I**.

Los repartos se mantienen separados porque las notas indican que intervienen en ellos al menos dos manos no autógrafas vinculables al ámbito de la representación, pero no existe todavía base suficiente para identificarlas con hB1 y hB2, las dos manos observadas en las correcciones del cuerpo dramático.

## 3. Evidencia para distinguir hB1 y hB2 en el cuerpo

La nota asociada a la primera secuencia sistemática de correcciones establece que dos manos, distinguibles por color, grosor de tinta y grafía, intervienen sobre los antropónimos:

1. una primera mano tacha y sustituye nombres;
2. una segunda mano restituye la lección primitiva.

La misma nota afirma que el fenómeno se repite a lo largo de la pieza.

Sobre esta base, el modelo utiliza:

- `#hB1` para la mano que realiza la primera sustitución;
- `#hB2` para la mano que interviene después restaurando la lección previa en los lugares donde esa secuencia es visible.

La identificación se aplica únicamente a los casos materialmente análogos.

## 4. Revisión de la cronología de B

La primera versión del modelo utilizaba:

```xml
change="#stage-B1"
change="#stage-B2"
```

Esta solución identificaba de hecho cada mano con una campaña cronológica global.

Se abandona ahora esa equivalencia.

El modelo actual utiliza:

```xml
change="#stage-B"
```

para todas las intervenciones postautoriales del cuerpo.

La distinción entre las manos se conserva en:

```xml
hand="#hB1"
hand="#hB2"
```

y el orden local, cuando existe, mediante:

```xml
seq="1"
seq="2"
```

De esta forma, una secuencia local hB1→hB2 no se convierte automáticamente en una afirmación sobre la cronología global de todas las intervenciones de ambas manos.

## 5. Sustituciones simples de hB1

Los cambios sistemáticos de antropónimos y abreviaturas se modelan como sustituciones B.

Por ejemplo:

```xml
<mod xml:id="gB..."
     type="subst"
     hand="#hB1"
     change="#stage-B"
     ana="#layer-B">
  <del ana="#layer-A0">Mar</del>
  <add ana="#layer-B">Cond</add>
</mod>
```

El mismo patrón se aplica, entre otros, a:

- `marqués → conde`;
- `Henrique → Fadrique`;
- `Hen → Fad`;
- `Ma → Con/Cond`.

En estos casos no se introduce `@seq`, porque solo se conserva una intervención B en ese punto.

## 6. Secuencias locales hB1 → hB2

Cuando la segunda mano vuelve sobre una lectura introducida por hB1, la segunda modificación se anida en la lección añadida por la primera:

```xml
<mod xml:id="gB001-1"
     type="subst"
     hand="#hB1"
     change="#stage-B"
     ana="#layer-B"
     seq="1">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">
    <mod xml:id="gB001-2"
         type="subst"
         hand="#hB2"
         change="#stage-B"
         ana="#layer-B"
         seq="2">
      <del ana="#layer-B">conde</del>
      <add ana="#layer-B">marqués</add>
    </mod>
  </add>
</mod>
```

El archivo piloto contiene actualmente **17 intervenciones de hB2**, todas ellas ligadas a secuencias locales de este tipo.

La lección restaurada por hB2 sigue llevando `ana="#layer-B"`: aunque coincida gráficamente con A0, es una nueva inscripción producida por una mano posterior.

## 7. B sobre una lección A1

Un caso conserva una cadena:

```text
A0 → A1 → hB1 → hB2
```

El evento A1 se mantiene como modificación autorial inmediata. Dentro de su nueva lección se anidan las dos modificaciones B.

Esto permite conservar simultáneamente:

- la lectura inicial A0;
- la corrección inmediata A1;
- la sustitución de hB1;
- la restauración de hB2.

## 8. B sobre una lección A2

El caso `Fili → He → Fad` se interpreta como:

- A0: `Fili`;
- A2: `He`;
- B/hB1: `Fad`.

La modificación B debe cancelar, por tanto, una lección A2:

```xml
<mod type="subst"
     hand="#Lope"
     change="#stage-A2"
     ana="#layer-A2">
  <del ana="#layer-A0">Fili</del>
  <add ana="#layer-A2">
    <mod type="subst"
         hand="#hB1"
         change="#stage-B"
         ana="#layer-B">
      <del ana="#layer-A2">He</del>
      <add ana="#layer-B">Fad</add>
    </mod>
  </add>
</mod>
```

Este caso confirma la utilidad de separar el estrato del evento del estrato de la lección.

## 9. Cancelación extensa de los vv. 410–415

La construcción heredada con `from/to` se ha sustituido por el mecanismo TEI correcto:

```xml
<l n="410">
  <anchor xml:id="l_410"/>
  <delSpan xml:id="gB020"
           spanTo="#l_415"
           hand="#hB1"
           change="#stage-B"
           ana="#layer-B"/>
  Ya habrás oído mil veces
</l>
...
<anchor xml:id="l_415"/>
```

La nota atribuye expresamente la tachadura a la primera mano, por lo que la asignación a hB1 es suficientemente segura.

## 10. Casos del cuerpo todavía no migrados

Quedan **tres aparatos B** dentro del cuerpo del acto I.

### Corrección de parlamento `Feli → Leo`

La nota indica que la corrección fue realizada «al parecer por otra mano», pero no permite identificar con seguridad esa mano como hB1 o hB2.

Se mantiene provisionalmente en la codificación heredada.

### `Siéntense`

Es una adición escénica no autógrafa. Todavía no se ha atribuido con seguridad a hB1/hB2.

Se mantiene provisionalmente en la codificación heredada.

### `díjese`

La palabra aparece junto a la cancelación extensa de los vv. 410–415. La tachadura está atribuida a hB1, pero no se ha considerado suficiente esta proximidad para atribuir automáticamente también `díjese` a la misma mano.

Se mantiene provisionalmente en la codificación heredada hasta comprobar la grafía.

## 11. Repartos iniciales

Los **29 aparatos B de los repartos** no se han migrado todavía.

La razón no es técnica sino filológica: las notas reconocen al menos dos manos no autógrafas, pero no debe suponerse que estas coincidan con hB1/hB2 del cuerpo dramático.

La migración de los repartos requerirá:

1. distinguir materialmente las manos;
2. asignar identificadores específicos si no coinciden con hB1/hB2;
3. decidir si cada entrada debe representarse como adición, inscripción de reparto u otra estructura documental;
4. mantener separada esta información de las modificaciones del texto dramático.

## 12. Estado actual

En `EMN_mod_act1_pilot.xml` se han migrado **58 de las 61 intervenciones B del cuerpo del acto I**.

El archivo contiene actualmente:

- **58 referencias a hB1**, incluida la cancelación extensa;
- **17 referencias a hB2**, correspondientes a restauraciones locales;
- **75 referencias a `change="#stage-B"`**;
- **3 aparatos B pendientes en el cuerpo**;
- **29 aparatos B pendientes en los repartos iniciales**.

El modelo B del cuerpo puede considerarse estructuralmente estabilizado, aunque la atribución de algunas intervenciones concretas requiere todavía comprobación paleográfica.
