# Arquitectura del frontend genético

**Rama de trabajo:** `tei-genetic-model-prototype`  
**Estado:** prototipo funcional para el acto I

## 1. Objetivo

La interfaz genética deja de depender del antiguo aparato `app/lem/rdg` y pasa a consumir directamente el modelo TEI validado basado en:

- `mod`;
- `del`;
- `add`;
- `delSpan/addSpan`;
- `@ana`;
- `@change`;
- `@instant`;
- `@seq`.

El archivo cargado por la edición genética es:

```text
edition/prototype/EMN_mod_act1_pilot.xml
```

La edición crítica permanece separada y no se modifica.

## 2. Componentes

### `assets/genetic/model.js`

Contiene la lógica del modelo genético en el navegador:

- identificación del estrato de cada evento;
- reconstrucción acumulativa de A0, A0+A1, A0+A1+A2 y A0+A1+A2+B;
- resolución de modificaciones anidadas;
- tratamiento de `delSpan/addSpan`;
- filtrado de intervenciones A1/A2/B;
- lectura de las categorías funcionales internas de B.

### `assets/genetic/facsimile.js`

Gestiona:

- navegación por folios;
- asociación entre `pb/@n` y las imágenes de `facs/`;
- sincronización por folio de las columnas textuales;
- zoom básico del facsímil.

La asociación con las imágenes sigue utilizando de forma provisional la convención de nombres de archivo derivada de `pb/@n`. Una futura normalización mediante `@facs` podrá sustituir este mecanismo sin alterar la interfaz.

### `assets/genetic/app.js`

Coordina la aplicación:

- carga TEI mediante CETEIcean;
- visualización del acto I genético y de la transcripción diplomática;
- reconstrucción de estados textuales;
- filtros de intervenciones;
- búsqueda;
- navegación por verso;
- notas;
- sincronización con el facsímil.

La transcripción diplomática se limita al acto I para mantener el mismo alcance que el archivo genético actualmente migrado.

### `css/genetic-edition.css`

Define el layout de la edición genética de manera independiente del antiguo `css/tei.css`.

La interfaz usa tres paneles:

1. facsímil;
2. edición genética;
3. transcripción diplomática.

El diseño se adapta a dos columnas y a una columna en pantallas más estrechas.

## 3. Distinción entre filtrado y reconstrucción

La interfaz separa explícitamente dos operaciones.

### Filtrar intervenciones

Permite seleccionar de forma independiente:

- A1;
- A2;
- B.

El objetivo es inspeccionar los eventos genéticos, no reconstruir un estado textual completo.

Las capas no seleccionadas se resuelven silenciosamente según su posición cronológica para conservar el contexto necesario de las intervenciones seleccionadas.

### Reconstruir texto

Permite generar cuatro estados acumulativos:

```text
A0
A0 + A1
A0 + A1 + A2
A0 + A1 + A2 + B
```

El tercer estado corresponde al último estado autorial; el cuarto, al estado documental postautorial.

Durante una reconstrucción, los controles de filtrado de intervenciones quedan desactivados para evitar mezclar dos operaciones conceptualmente distintas.

## 4. B en la interfaz

B se presenta como un único estrato postautorial.

La interfaz no presupone identidades de mano no demostradas.

Cuando existen datos adicionales, puede leer:

- `#B-substitution`;
- `#B-restoration`;
- `#B-performance`;
- `@seq`.

Estas informaciones son secundarias respecto de `#layer-B`.

## 5. Validación

La infraestructura cuenta ahora con dos workflows independientes:

### `validate-genetic-tei.yml`

Comprueba:

- XML bien formado;
- ODD → RELAX NG;
- validación RELAX NG;
- Schematron del proyecto;
- ausencia de aparato B legacy.

### `validate-genetic-frontend.yml`

Comprueba:

- sintaxis JavaScript de los módulos;
- uso de `EMN_mod_act1_pilot.xml`;
- presencia de los controles de filtrado y reconstrucción;
- ausencia de dependencias del antiguo modelo `EMN_mod.xml`, `tei-rdg/tei-lem` y `varSeq`.

## 6. Decisiones deliberadamente pospuestas

No se han realizado todavía:

- migración a Astro u otro generador;
- transformación TEI → HTML en build time;
- deployment privado;
- introducción sistemática de `@facs` en los `pb`;
- migración de los actos II y III.

Estas decisiones no son necesarias para probar el nuevo modelo con el acto I.

## 7. Criterio de desarrollo

El acto I validado funciona como corpus de referencia para estabilizar la infraestructura antes de ampliar la migración textual.

La prioridad actual es mantener una correspondencia directa y comprobable:

```text
TEI validado
    ↓
parser genético
    ↓
DOM semántico
    ↓
filtros / reconstrucciones
    ↓
facsímil y navegación
```
