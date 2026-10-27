# Revisión sistemática de A2 en el acto I

**Archivo de trabajo:** `edition/prototype/EMN_mod_A1_pilot.xml`  
**Fecha:** 27 de octubre de 2026

## 1. Objetivo

Esta revisión parte de los casos que la codificación heredada clasificaba como A2 y los contrasta con las notas filológicas y con el nuevo modelo genético.

El criterio adoptado es conservador: un caso solo se mantiene como A2 cuando existe una base suficiente para interpretarlo como revisión autorial posterior. Si la propia nota describe una corrección inmediata o atribuye la intervención a otra mano, se reclasifica.

## 2. Casos heredados inicialmente como A2

### Caso inicial: `Leo → Feli`

La codificación heredada lo trataba como A2. Sin embargo, la nota indica que Lope se percata enseguida del error y sobrescribe la atribución antes de completar la didascalia de la forma habitual.

Por tanto, se reclasifica como **A1 inmediata**:

```xml
<mod xml:id="g030" type="subst"
     hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">Leo</del>
  <add ana="#layer-A1">Feli</add>
</mod>
```

### Caso del parlamento `Feli → Leo`

La codificación heredada presentaba una secuencia anómala `B → A2`, pero la nota afirma que la atribución errónea a Feliciana está corregida «al parecer por otra mano», a juzgar por el color y grosor de la tinta.

Este caso **no debe mantenerse como A2**. Se remite a la revisión de B, porque la evidencia disponible apunta a una intervención no autógrafa.

### Reajuste `las caras / de noche`

Los dos lugares correspondientes a los vv. 219–220 se interpretan como una misma operación de revisión posterior. La nota señala un trazo ligeramente más grueso y una tinta más diluida, lo que apoya la separación respecto de la primera redacción.

Se mantienen como dos eventos A2 coordinados:

```xml
<mod xml:id="g054" type="subst"
     hand="#Lope" change="#stage-A2" ana="#layer-A2">
  <del ana="#layer-A0">las caras</del>
  <add ana="#layer-A2">de noche</add>
</mod>
```

```xml
<mod xml:id="g055" type="subst"
     hand="#Lope" change="#stage-A2" ana="#layer-A2">
  <del ana="#layer-A0">de noche</del>
  <add ana="#layer-A2">las caras</add>
</mod>
```

### Caso `Fili → He → Fad`

La secuencia heredada combina:

1. una corrección autorial `Fili → He`, etiquetada como A2;
2. una modificación posterior `He → Fad` atribuida a una mano no autógrafa.

El primer paso es compatible con A2, pero no se ha migrado todavía porque el segundo paso debe integrarse correctamente en la futura modelización de B. El lugar se conserva como **A2 + B pendiente de codificación conjunta**.

### Caso `que los angeles → que angel que viene`

La sustitución se mantiene como A2:

```xml
<mod xml:id="g129" type="subst"
     hand="#Lope" change="#stage-A2" ana="#layer-A2">
  <del ana="#layer-A0">que los angeles</del>
  <add ana="#layer-A2">que angel que viene</add>
</mod>
```

## 3. Nuevo A2 identificado en el v. 597

La revisión del aparato permite distinguir una cancelación inmediata A1 de una revisión posterior A2.

La secuencia es:

- A0: `te? has trazado`;
- A1: se cancela `te?`;
- A2: `trazado → pensado`.

La sustitución A2 se codifica:

```xml
<mod xml:id="g093b" type="subst"
     hand="#Lope" change="#stage-A2" ana="#layer-A2">
  <del ana="#layer-A0">trazado</del>
  <add ana="#layer-A2">pensado</add>
</mod>
```

La lección `trazado` pertenece todavía a A0 porque la intervención A1 anterior no la modifica.

## 4. Estado actual de A2

En el archivo piloto hay actualmente **cuatro eventos A2 ya migrados**:

1. `las caras → de noche`;
2. `de noche → las caras`;
3. `trazado → pensado`;
4. `que los angeles → que angel que viene`.

Queda un caso compuesto **A2 + B** pendiente de migración conjunta:

- `Fili → He → Fad`.

Un antiguo A2 ha sido reclasificado como A1:

- `Leo → Feli`.

Otro antiguo A2 ha sido remitido a B:

- `Feli → Leo`.

## 5. Caso limítrofe A1/A2 aún abierto

Permanece sin resolver `la defenden → resplandecen`. La nota lo vincula con la cancelación inmediatamente anterior y habla de un único proceso de enmienda «llevado a cabo, al parecer, en dos fases diferentes».

La codificación heredada lo clasifica como A1, pero la referencia a dos fases aconseja no fijar todavía `instant="true"` sin decidir si la segunda intervención pertenece realmente a una revisión posterior.

Este caso constituye, por tanto, el único punto limítrofe entre A1 y A2 todavía abierto en el acto I.

## 6. Conclusión

La revisión reduce sensiblemente los A2 heredados y mejora su fundamento filológico.

El siguiente paso es doble:

- resolver el caso limítrofe `la defenden → resplandecen`;
- pasar a la revisión de B, empezando por los lugares en que B se superpone a una revisión autorial previa, como `Fili → He → Fad`.
