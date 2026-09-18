# Manuale di codifica genetica — *El marqués de las Navas*

Versione di lavoro per la branch `tei-genetic-model-prototype`.

Questo documento traduce il modello teorico e l'ODD del progetto in regole operative di codifica. Il principio generale è separare sempre:

1. **l'evento genetico**: che cosa succede materialmente e in quale momento/campagna;
2. **la lezione coinvolta**: a quale strato editoriale appartiene il testo scritto, cancellato o sostituito;
3. **la mano**: chi realizza materialmente l'intervento;
4. **la visualizzazione**: come l'interfaccia filtra gli interventi e ricostruisce gli stati del testo.

## 1. Vocabolario di progetto

| Sigla | Significato editoriale | Espressione TEI principale | Uso nell'interfaccia |
| --- | --- | --- | --- |
| A0 | prima stesura autografa | stato di base; `change="#stage-A0"` ereditato dal `body`; `ana="#layer-A0"` sulle lezioni coinvolte in modifiche | ricostruzione della prima stesura; colore A0 quando la lezione è coinvolta in un intervento |
| A1 | intervento autoriale immediato durante la prima stesura | `hand="#Lope"` + `instant="true"` + `ana="#layer-A1"` sull'evento | filtro A1; applicazione delle correzioni immediate nella ricostruzione A0+A1 |
| A2 | revisione autoriale differita | `hand="#Lope"` + `change="#stage-A2"` + `ana="#layer-A2"` sull'evento | filtro A2; applicazione della revisione nella ricostruzione A0+A1+A2 |
| B | intervento non autografo | `hand="#hB…"` + `change="#stage-B…"` + `ana="#layer-B"` | filtro B; applicazione degli interventi post-autoriali nello stato documentario finale |

A1, A2 e B sono quindi **categorie editoriali interrogabili**; non sono testimoni e non devono essere codificati con `@wit`.

## 2. Regola fondamentale: evento e lezione

Sul contenitore dell'intervento si codifica **l'evento**:

```xml
<mod
  xml:id="g..."
  type="subst"
  hand="#Lope"
  instant="true"
  ana="#layer-A1">
```

Su `<del>` e `<add>` si codifica invece **lo strato della lezione**:

```xml
<del ana="#layer-A0">lezione precedente</del>
<add ana="#layer-A1">lezione introdotta</add>
```

Ne consegue questa regola generale:

- `mod/@ana` = **event layer**;
- `add/@ana` e `del/@ana` = **reading layer**.

La lezione cancellata non è necessariamente A0: se A2 cancella una lezione introdotta in A1, il `<del>` avrà `ana="#layer-A1"`. Analogamente, un intervento B2 può cancellare una lezione introdotta da B1.

## 3. Tabella normativa dei fenomeni

| Fenomeno manoscritto | Codifica TEI di progetto | Attributi obbligatori | Strato della lezione | Comportamento nell'interfaccia |
| --- | --- | --- | --- | --- |
| Testo di prima stesura non modificato | testo normale nel `body` | nessuno specifico sul singolo segmento | A0 per eredità | visibile nello stato A0 e in tutti gli stati successivi finché non viene modificato |
| Cancellazione immediata autoriale | `<mod type="del"><del>…</del></mod>` | `xml:id`, `hand="#Lope"`, `instant="true"`, `ana="#layer-A1"` | `del/@ana` = strato della lezione eliminata, normalmente A0 | filtro A1 evidenzia l'evento; A0 mostra la lezione, A0+A1 la elimina |
| Aggiunta immediata autoriale | `<mod type="add"><add>…</add></mod>` | `xml:id`, `hand="#Lope"`, `instant="true"`, `ana="#layer-A1"` | `add/@ana="#layer-A1"` | nascosta in A0; visibile da A0+A1 in poi |
| Sostituzione immediata autoriale | `<mod type="subst"><del>…</del><add>…</add></mod>` | `xml:id`, `hand="#Lope"`, `instant="true"`, `ana="#layer-A1"` | `del` = strato precedente; `add="#layer-A1"` | A0 mostra il `del`; A0+A1 mostra l'`add` |
| Cancellazione autoriale differita | `<mod type="del"><del>…</del></mod>` | `xml:id`, `hand="#Lope"`, `change="#stage-A2"`, `ana="#layer-A2"` | `del` = A0 o A1 secondo la storia reale della lezione | visibile fino allo stato precedente ad A2; eliminata nello stato A2 |
| Aggiunta autoriale differita | `<mod type="add"><add>…</add></mod>` | `xml:id`, `hand="#Lope"`, `change="#stage-A2"`, `ana="#layer-A2"` | `add/@ana="#layer-A2"` | nascosta prima di A2; visibile nello stato A2 |
| Sostituzione autoriale differita | `<mod type="subst"><del>…</del><add>…</add></mod>` | `xml:id`, `hand="#Lope"`, `change="#stage-A2"`, `ana="#layer-A2"` | `del` = strato precedente; `add="#layer-A2"` | ricostruisce automaticamente pre-A2 e A2 |
| Cancellazione non autografa | `<mod type="del"><del>…</del></mod>` | `xml:id`, `hand="#hB…"`, `change="#stage-B…"`, `ana="#layer-B"` | `del` = strato della lezione cancellata | filtro B; la lezione resta nello stato autoriale finale e scompare nello stato documentario B |
| Aggiunta non autografa | `<mod type="add"><add>…</add></mod>` | `xml:id`, `hand="#hB…"`, `change="#stage-B…"`, `ana="#layer-B"` | `add/@ana="#layer-B"` | assente nello stato autoriale finale; presente nello stato B |
| Sostituzione non autografa | `<mod type="subst"><del>…</del><add>…</add></mod>` | `xml:id`, `hand="#hB…"`, `change="#stage-B…"`, `ana="#layer-B"` | `del` = strato precedente; `add="#layer-B"` | consente confronto tra stato autoriale e stato documentario |
| Due interventi successivi sulla stessa lezione | `<mod>` annidato nella lezione introdotta dalla modifica precedente | oltre agli attributi dello strato: `seq="1"`, `seq="2"`, ecc. | ogni `del/add` conserva lo strato della propria lezione | può ricostruire anche B1 e B2, pur mantenendo un unico filtro/colore B |
| Cancellazione che attraversa più elementi/versi | `<delSpan ... spanTo="#end"/>` + `<anchor xml:id="end"/>` | `xml:id`, `spanTo`, `hand`, `ana`; inoltre `instant` o `change` secondo A1/A2/B | lo span è trattato come evento; il testo attraversato mantiene la propria struttura | il renderer oscura/ripristina l'intero intervallo senza distruggere la struttura dei versi |
| Aggiunta che attraversa più elementi/versi | `<addSpan ... spanTo="#end"/>` + `<anchor xml:id="end"/>` | come per `delSpan` | lo span appartiene allo strato dell'evento che lo introduce | il renderer può attivare/disattivare l'intero intervallo |
| Ripristino materiale di testo precedentemente cancellato | `<restore>` **solo se il fenomeno materiale corrisponde davvero a un ripristino di una precedente cancellazione** | da definire sul caso reale: almeno identificazione della mano/fase quando ricostruibili | dipende dalla lezione ripristinata | non usare come scorciatoia per una seconda sostituzione B |
| Ripasso grafico di lettere già scritte | `<retrace>` quando è materialmente un ripasso dei tratti | mano e fase quando ricostruibili | non crea automaticamente un nuovo strato testuale | visualizzazione paleografica, non necessariamente cambio di stato |
| Segno o istruzione grafica non assimilabile al testo | `<metamark>` | `xml:id`; eventuali `function`, `target`, `spanTo`, `hand` secondo il fenomeno | normalmente nessuno strato di lettura autonomo | visualizzazione documentaria; può comandare collegamenti o relazioni |
| Trasposizione di segmenti | `<listTranspose>` / `<transpose>` e riferimenti ai segmenti coinvolti | identificatori stabili dei segmenti e ordine esplicito | le parole conservano il proprio strato; cambia l'ordine | ricostruzione dell'ordine precedente/successivo; da implementare quando compare un caso reale |

## 4. Esempi canonici

### A1 — sostituzione immediata

```xml
<mod xml:id="g0065"
     type="subst"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
  <del ana="#layer-A0">a los más sabios</del>
  <add ana="#layer-A1">como lo esperes</add>
</mod>
```

### A2 — revisione successiva

```xml
<mod xml:id="g0219a"
     type="subst"
     hand="#Lope"
     change="#stage-A2"
     ana="#layer-A2">
  <del ana="#layer-A0">las caras</del>
  <add ana="#layer-A2">de noche</add>
</mod>
```

### B1 → B2 — due mani successive

```xml
<mod xml:id="gB0170-1"
     type="subst"
     hand="#hB1"
     change="#stage-B1"
     ana="#layer-B"
     seq="1">
  <del ana="#layer-A0">marqués</del>
  <add ana="#layer-B">
    <mod xml:id="gB0170-2"
         type="subst"
         hand="#hB2"
         change="#stage-B2"
         ana="#layer-B"
         seq="2">
      <del ana="#layer-B">conde</del>
      <add ana="#layer-B">marqués</add>
    </mod>
  </add>
</mod>
```

### B long-span — cancellazione vv. 410–415

```xml
<l n="410">
  <delSpan xml:id="gB0410"
           spanTo="#gB0415-end"
           hand="#hB1"
           change="#stage-B1"
           ana="#layer-B"/>
  Ya habrás oído mil veces
</l>
...
<l n="415">antigüedades ni historia.</l>
<anchor xml:id="gB0415-end"/>
```

## 5. Regole per `@hand`

Le mani devono essere dichiarate una sola volta in `<handNotes>` e richiamate tramite puntatore:

```xml
<handNotes>
  <handNote xml:id="Lope" scope="major" scribe="author">
    Mano autografa di Lope de Vega.
  </handNote>
  <handNote xml:id="hB1" scope="minor">
    Prima mano non autografa.
  </handNote>
  <handNote xml:id="hB2" scope="minor">
    Seconda mano non autografa.
  </handNote>
</handNotes>
```

Non sono ammessi valori liberi come:

```xml
hand="authorial"
hand="non-authorial"
hand="non--authorial"
```

L'identificazione di hB1/hB2 deve restare prudente: stessa mano e stessa campagna non sono automaticamente sinonimi. L'associazione tra una mano e una campagna si stabilisce solo quando il dato paleografico consente di sostenerla.

## 6. Regole per `@change`, `@instant` e `@seq`

- `@instant="true"` indica un intervento immediato durante l'atto di scrittura e caratterizza A1.
- `@change="#stage-A2"` indica una revisione autoriale differita.
- `@change="#stage-B1"`, `#stage-B2`, ecc. identifica campagne non autografe quando il loro ordinamento è sostenibile.
- `@seq` si usa quando occorre esprimere l'ordine relativo di più interventi sulla stessa porzione di testo.
- `@seq` non sostituisce `@change`: il primo esprime una sequenza locale, il secondo una campagna/stadio documentario.

## 7. Regole per gli identificatori

Ogni evento genetico che deve essere interrogato, collegato al facsimile, annotato o visualizzato deve avere un `xml:id` stabile.

Convenzione provvisoria:

- `gNNNN` = intervento autoriale;
- `gBNNNN` = intervento non autografo;
- suffissi `-1`, `-2` = successione locale di interventi sullo stesso punto.

La convenzione degli ID è tecnica, non semantica: la classificazione scientifica resta negli attributi TEI.

## 8. Regole di rendering

La trasformazione TEI → HTML dovrà esportare almeno:

```html
data-event-layer="A1|A2|B"
data-reading-layer="A0|A1|A2|B"
data-hand="Lope|hB1|hB2|..."
data-change="stage-A2|stage-B1|..."
data-seq="..."
```

I colori non sono codificati nel TEI.

L'interfaccia dovrà offrire due meccanismi distinti:

### Filtri degli interventi

Permettono di evidenziare o nascondere gli eventi A1, A2 e B senza alterare la ricostruzione testuale.

### Ricostruzione degli stati

Ordine editoriale di default:

```text
A0
A0 + A1
A0 + A1 + A2
A0 + A1 + A2 + B
```

L'ultimo stato autoriale è **A0+A1+A2**. Lo stato con B è invece lo **stato documentario post-autoriale**.

Quando la cronologia interna di B è sufficientemente sicura, il renderer potrà offrire opzionalmente:

```text
... + B1
... + B1 + B2
```

senza introdurre necessariamente colori distinti per B1 e B2.

## 9. Criterio di prudenza

La codifica non deve trasformare un'ipotesi paleografica in un fatto strutturale.

Quando non è possibile stabilire con sicurezza:

- se un intervento è A1 o A2;
- quale mano non autografa interviene;
- l'ordine tra due campagne B;

la soluzione deve conservare l'incertezza e rinviare la classificazione forte. Non si deve assegnare `@instant`, `@change`, `@hand` o `@seq` più specifici di quanto consentano i dati materiali.

## 10. Stato del modello

Sono già stati validati formalmente contro l'ODD di progetto:

- cancellazioni e sostituzioni A1;
- revisioni A2;
- interventi B semplici;
- sequenze B1 → B2;
- cancellazioni long-span con `delSpan/@spanTo`.

I file di test sono:

- `EMN_mod_sample.xml`;
- `EMN_complex_cases.xml`.

Il passo successivo è applicare queste regole sistematicamente all'intero `EMN_mod.xml`, registrando separatamente i casi che richiedono una decisione filologica.
