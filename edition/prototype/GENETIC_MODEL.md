# Prototipo del modello genetico TEI

Questo documento definisce una prima proposta di ricodifica per l'edizione genetico-evolutiva di *El marqués de las Navas*.

## Principi

1. L'informazione genetica non viene più modellata come apparato critico (`app/lem/rdg`).
2. Gli interventi materiali sono descritti mediante gli elementi del modulo `transcr`; nel modello EMN le sostituzioni inline sono normalizzate come `mod type="subst"` contenente `del` e `add`, mentre `addSpan`/`delSpan` sono riservati agli interventi estesi.
3. Le vere campagne o fasi documentarie sono descritte con `listChange/change` e richiamate con `@change`.
4. Le mani sono dichiarate in `handNotes/handNote` e richiamate con `@hand`.
5. Gli strati editoriali A0/A1/A2/B restano sempre interrogabili tramite una tassonomia e `@ana`.
6. A1 non è trattato come una campagna autonoma: rappresenta gli interventi immediati prodotti durante la prima stesura ed è espresso soprattutto tramite `@instant="true"`, mantenendo `@ana="#layer-A1"` per la filtrabilità.
7. I colori appartengono esclusivamente al frontend; il TEI conserva soltanto gli identificatori semantici degli strati.

## Strati editoriali

- `#layer-A0`: prima stesura autografa.
- `#layer-A1`: lezione introdotta da una correzione immediata nel corso della prima stesura.
- `#layer-A2`: lezione introdotta durante una revisione autoriale successiva.
- `#layer-B`: lezione introdotta da una mano non autografa.

## Fasi documentarie

- `#stage-A0`: prima stesura autografa.
- `#stage-A2`: revisione autoriale successiva.
- `#stage-B1`, `#stage-B2`, ecc.: campagne non autografe, solo quando l'ordinamento è paleograficamente sostenibile.

## Regole di visualizzazione

La trasformazione verso HTML dovrà esporre separatamente almeno due informazioni:

- `data-reading-layer`: strato al quale appartiene una determinata lezione (`A0`, `A1`, `A2`, `B`).
- `data-event-layer`: classe dell'intervento che la produce o la elimina.

Questo consente due funzioni diverse:

- **filtro degli interventi**: mostra/nasconde A1, A2, B e relative evidenziazioni;
- **ricostruzione dello stato testuale**: restituisce A0, A0+A1, A0+A1+A2 e lo stato documentario con B.

A0, A1, A2 e B restano quindi categorie dell'edizione e dell'interfaccia, ma non vengono impropriamente codificate come `@wit`.

## Esempi

### Cancellazione immediata

```xml
<mod xml:id="g0005" type="del" hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">m</del>
</mod>
```

### Sostituzione immediata

```xml
<mod xml:id="g0065" type="subst" hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">a los más sabios</del>
  <add ana="#layer-A1">como lo esperes</add>
</mod>
```

### Revisione autoriale successiva

```xml
<mod xml:id="g0777" type="subst" hand="#Lope" change="#stage-A2" ana="#layer-A2">
  <del ana="#layer-A0">que los angeles</del>
  <add ana="#layer-A2">que angel que viene</add>
</mod>
```

### Intervento di altra mano

```xml
<mod xml:id="gB001" type="subst" hand="#hB1" change="#stage-B1" ana="#layer-B">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">conde</add>
</mod>
```

## Stato attuale

Il modello è stato formalizzato in `EMN_genetic.odd` e validato su casi A1, A2, B, sequenze B1→B2 e cancellazioni long-span. Le regole operative complete sono raccolte in `GENETIC_ENCODING_GUIDE.md`.

Restano da verificare paleograficamente la distinzione tra le mani non autografe e le attribuzioni dubbie A1/A2 dell'attuale file prima della conversione integrale.