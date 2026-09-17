# Prototipo del modello genetico TEI

Questo documento definisce una prima proposta di ricodifica per l'edizione genetico-evolutiva di *El marqués de las Navas*.

## Principi

1. L'informazione genetica non viene più modellata come apparato critico (`app/lem/rdg`).
2. Gli interventi materiali sono descritti mediante gli elementi del modulo `transcr`, in particolare `mod`, `add`, `del`, `subst`, `addSpan`, `delSpan` quando necessari.
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

## Questioni aperte

- stabilire quando usare `mod` come contenitore obbligatorio e quando lasciare `add`/`del` autonomi;
- verificare paleograficamente la distinzione tra `#hB1`, `#hB2`, ecc.;
- verificare caso per caso le attribuzioni A1/A2 dell'attuale file;
- definire i casi long-span con `mod/@spanTo`, `addSpan` o `delSpan`;
- formalizzare queste regole in un ODD/Schematron dedicato.