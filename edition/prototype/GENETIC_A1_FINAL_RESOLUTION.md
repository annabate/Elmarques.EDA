# Resolución final del piloto A1

**Fecha:** 27 de octubre de 2026  
**Archivo de referencia:** `edition/prototype/EMN_mod_A1_pilot.xml`

Este documento fija el estado final del piloto A1 después de la revisión de los cuatro últimos casos dudosos. Debe considerarse la referencia actual para estos lugares; los registros anteriores conservan el valor de documentación histórica del proceso de revisión.

## 1. Resultado general

Los **38 casos A0→A1** seleccionados para el piloto han sido resueltos y migrados.

No queda ningún caso A1 pendiente dentro de este grupo.

La revisión del v. 597 ha permitido identificar además un evento A2 independiente que la codificación anterior agrupaba dentro de A1.

## 2. Vv. 565–566

La primera redacción presenta la secuencia «q traydor fue para mi / de noche».

En A1 se reescriben dos lugares: «fue para mi» pasa a «Gerarda, fue» y «de noche» pasa a «para mí», antes de «de noche vino».

La codificación adoptada es:

```xml
<mod xml:id="g088" type="subst"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">fue para mí</del>
  <add ana="#layer-A1">, Gerarda, fue</add>
</mod>
```

y:

```xml
<mod xml:id="g089" type="subst"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">de noche</del>
  <add ana="#layer-A1">para mí!</add>
</mod>
De noche vino.
```

## 3. V. 597

La secuencia genética revisada distingue dos momentos:

- A0: «escriuele q te?»
- A1: se cancela «te?» y queda «has trazado»
- A2: «trazado» se sustituye por «pensado»

Por ello se codifican dos eventos:

```xml
<mod xml:id="g093a" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    <unclear cert="low">te</unclear>
  </del>
</mod>
has
<mod xml:id="g093b" type="subst"
     hand="#Lope" change="#stage-A2" ana="#layer-A2">
  <del ana="#layer-A0">trazado</del>
  <add ana="#layer-A2">pensado</add>
</mod>
```

«trazado» mantiene `ana="#layer-A0"` porque la intervención A1 no lo modifica.

## 4. V. 646

La lectura de A0 es «gi(?) a su», cancelada en A1.

La incertidumbre afecta únicamente a «gi»:

```xml
<mod xml:id="g098" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    <unclear cert="low">gi</unclear> a su
  </del>
</mod>
```

No se emplea `<gap>`, porque existe una propuesta de lectura para la secuencia dudosa.

## 5. V. 755

La lectura de A0 es «ya se?», posteriormente cancelada en A1.

La incertidumbre se limita a «se»:

```xml
<mod xml:id="g127" type="del"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">
    ya <unclear cert="low">se</unclear>
  </del>
</mod>
```

## 6. Consecuencia metodológica

El piloto A1 puede considerarse cerrado.

La revisión confirma tres principios del modelo:

1. las lecturas inciertas deben expresarse estructuralmente mediante `<unclear>`, no mediante signos interrogativos incorporados al texto;
2. un aparato heredado puede contener más de un evento genético y debe descomponerse cuando las fases son distintas;
3. la pertenencia de una lección a A0, A1 o A2 depende de su historia material, no simplemente del contenedor en que aparecía en la codificación anterior.

El siguiente bloque de trabajo es la revisión sistemática de A2.
