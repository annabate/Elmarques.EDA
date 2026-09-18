# Documentazione del modello di codifica genetica di *El marqués de las Navas*

**Progetto:** *El marqués de las Navas. Estudio y edición en el entorno digital*  
**Responsabile scientifica:** Anna Abate  
**Stato del documento:** documentazione metodologica di lavoro  
**Versione TEI di riferimento:** TEI P5 4.12.0  
**Branch di sviluppo:** `tei-genetic-model-prototype`

---

## 1. Scopo di questo documento

Questo documento ricostruisce in modo unitario il percorso che ha portato dalla prima codifica genetica di *El marqués de las Navas* al nuovo modello TEI attualmente in fase di sperimentazione e validazione.

L'obiettivo non è soltanto descrivere **come** è stato modificato il file XML, ma soprattutto spiegare **perché** sono state prese determinate decisioni. La codifica genetica non è infatti un puro problema tecnico: ogni scelta XML implica una particolare interpretazione del manoscritto, della successione degli interventi e della relazione tra testo, autore, mani successive e stati documentari.

La documentazione è pensata per essere leggibile a più livelli:

- come introduzione al modello per chi non conosce nel dettaglio la TEI;
- come memoria delle decisioni editoriali prese durante lo sviluppo;
- come base per la sezione metodologica della tesi o di una futura pubblicazione;
- come manuale di riferimento per la conversione dell'intero file genetico;
- come ponte tra la codifica XML e la futura interfaccia web.

Il principio di fondo che guida l'intero lavoro è il seguente:

> **La codifica deve descrivere il fenomeno documentario nel modo più corretto possibile secondo la TEI, ma deve anche preservare tutte le informazioni necessarie per ricostruire e visualizzare separatamente gli strati genetici A0, A1, A2 e B.**

Questi due obiettivi — correttezza semantica e visualizzabilità — non sono alternativi. Il nuovo modello nasce precisamente dal tentativo di tenerli insieme senza forzare la TEI in funzione dell'interfaccia.

---

## 2. Il punto di partenza: il modello genetico iniziale

Il file genetico originario, `edition/EMN_mod.xml`, era stato costruito per rendere visibili nell'interfaccia diversi strati del processo di scrittura. La soluzione adottata faceva ricorso agli elementi dell'apparato critico TEI:

```xml
<app>
  <rdg wit="A0" varSeq="0" hand="authorial">...</rdg>
  <lem wit="A1" varSeq="1" hand="authorial">...</lem>
</app>
```

oppure:

```xml
<app>
  <rdg wit="A0" varSeq="0" hand="authorial">a los más sabios</rdg>
  <lem wit="A1" varSeq="1" hand="authorial">
    <subst>
      <del>a los más sabios</del>
      <add>como lo esperes</add>
    </subst>
  </lem>
</app>
```

Le sigle A0, A1, A2 e B erano quindi impiegate attraverso `@wit`, come se rappresentassero testimoni differenti. L'attributo personalizzato `@varSeq` indicava inoltre l'ordine delle trasformazioni, mentre `@hand` assumeva valori liberi come:

```xml
hand="authorial"
hand="non-authorial"
```

Questa soluzione aveva una ragione pratica chiara. Consentiva di trattare ogni modifica come una successione di “letture” e rendeva relativamente semplice costruire una visualizzazione nella quale i diversi strati potessero essere evidenziati con colori differenti.

Dal punto di vista dell'interfaccia, dunque, il modello funzionava: A0, A1, A2 e B erano facilmente riconoscibili dal codice JavaScript e trasformabili in classi o filtri.

Il problema emergeva invece sul piano **semantico e filologico**.

---

## 3. Perché il modello iniziale era problematico

### 3.1 A0, A1, A2 e B non sono testimoni

L'attributo `@wit` appartiene al modello dell'apparato critico e serve a indicare i **testimoni** che sostengono una determinata lezione.

Nel caso di *El marqués de las Navas*, però:

- A0 non è un manoscritto;
- A1 non è un secondo testimone;
- A2 non è una copia alternativa;
- B non è un testimone indipendente.

Sono invece categorie editoriali che descrivono **strati o momenti differenti della storia dello stesso documento**.

L'uso di `<app>`, `<lem>`, `<rdg>` e `@wit` produceva quindi una sovrapposizione tra due modelli concettualmente distinti:

1. **apparato critico**, che confronta lezioni trasmesse da testimoni diversi;
2. **codifica genetico-documentaria**, che descrive modificazioni avvenute sullo stesso oggetto manoscritto.

Questa distinzione è particolarmente importante nel progetto, perché l'edizione critica e l'edizione genetico-evolutiva sono volutamente separate anche a livello di interfaccia. Il modello genetico non deve quindi simulare un apparato critico.

### 3.2 Le sigle mescolavano informazioni di natura diversa

Nel sistema originario A0/A1/A2/B sembravano appartenere a una stessa sequenza omogenea:

```text
A0 → A1 → A2 → B
```

In realtà non descrivono esattamente la stessa cosa.

- **A0** indica la prima stesura.
- **A1** indica gli interventi immediati prodotti durante l'atto stesso di scrittura.
- **A2** indica una revisione autoriale differita.
- **B** indica interventi non autografi e quindi introduce anche una diversa dimensione di responsabilità grafica.

A1 è quindi, almeno in prima istanza, una **modalità dell'intervento**, mentre A2 è una **campagna di revisione** e B implica anche l'identificazione di **mani diverse**.

La codifica iniziale appiattiva queste dimensioni sotto la sola categoria di “variante”.

### 3.3 `hand="authorial"` e `hand="non-authorial"` erano troppo generici

Il manoscritto presenta interventi di mani differenti. In almeno alcuni passaggi è possibile distinguere due mani non autografe, una delle quali sostituisce alcuni nomi e l'altra restituisce la lezione precedente.

Scrivere semplicemente:

```xml
hand="non-authorial"
```

impedisce di conservare questa informazione.

Nel nuovo modello le mani vengono invece dichiarate nel `teiHeader` mediante `<handNotes>` e `<handNote>`, e richiamate poi tramite puntatori:

```xml
hand="#Lope"
hand="#hB1"
hand="#hB2"
```

In questo modo la responsabilità materiale dell'intervento non è più una stringa descrittiva ma una relazione esplicita con una mano documentata.

### 3.4 `@varSeq` era un attributo locale non standard

`@varSeq` era stato introdotto per conservare l'ordine delle modificazioni. La TEI mette però già a disposizione `@seq` per esprimere l'ordine relativo degli interventi trascrizionali.

L'eliminazione di `@varSeq` riduce quindi la quantità di markup personalizzato e rende il modello più leggibile anche fuori dal progetto.

### 3.5 Alcuni fenomeni strutturali richiedevano elementi specifici

Le modifiche che attraversano più versi erano rappresentate in modo non conforme, ad esempio tramite una costruzione del tipo:

```xml
<delSpan from="#l_410" to="#l_415">...</delSpan>
```

La TEI usa invece `<delSpan>` come elemento vuoto che segnala **l'inizio** della cancellazione e richiede `@spanTo` per puntare a un `<anchor>` finale:

```xml
<delSpan spanTo="#end"/>
...
<anchor xml:id="end"/>
```

Questo caso ha mostrato in modo molto concreto la necessità di ripensare il modello a partire dalla semantica del modulo `transcr`.

---

## 4. Il cambio di prospettiva: dal “testimone” all'evento genetico

Il passaggio decisivo è stato smettere di trattare ogni trasformazione come un rapporto tra “lezioni concorrenti” e descriverla invece come un **evento avvenuto sul documento**.

La domanda non è più soltanto:

> Qual è la lezione A0 e qual è la lezione A1?

ma:

> Che cosa è successo materialmente? Chi è intervenuto? In quale momento? Quale lezione è stata eliminata e quale è stata introdotta?

Questa prospettiva porta naturalmente al modulo TEI per la **Representation of Primary Sources**, che mette a disposizione elementi e attributi specificamente pensati per cancellazioni, aggiunte, sostituzioni, mani, revisioni, modifiche estese e campagne genetiche.

Il nucleo del nuovo modello è costituito da:

- `<mod>`: evento di modificazione;
- `<del>`: materiale cancellato;
- `<add>`: materiale aggiunto;
- `@hand`: mano responsabile;
- `@instant`: correzione immediata o no;
- `@change`: appartenenza a una fase/campagna;
- `@seq`: ordine relativo di più interventi;
- `@ana`: classificazione analitica del progetto;
- `<listChange>` / `<change>`: descrizione delle campagne o fasi documentarie;
- `<handNotes>` / `<handNote>`: descrizione delle mani;
- `<addSpan>` / `<delSpan>`: interventi che attraversano confini strutturali.

---

## 5. La distinzione fondamentale: evento e lezione

Il nuovo modello introduce una distinzione che è essenziale sia filologicamente sia per la futura visualizzazione.

### 5.1 Il contenitore `<mod>` descrive l'evento

Per esempio:

```xml
<mod xml:id="g0065"
     type="subst"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
```

dice che:

- esiste un intervento identificabile con `xml:id="g0065"`;
- si tratta di una sostituzione;
- la mano è quella di Lope;
- l'intervento è immediato;
- nella tassonomia editoriale del progetto appartiene ad A1.

### 5.2 `<del>` e `<add>` descrivono le lezioni coinvolte

All'interno dello stesso evento:

```xml
<del ana="#layer-A0">a los más sabios</del>
<add ana="#layer-A1">como lo esperes</add>
```

il primo elemento dice che la lezione eliminata appartiene allo strato A0; il secondo dice che la nuova lezione viene introdotta nello strato A1.

Da qui deriva una distinzione molto utile:

```text
mod/@ana          = strato dell'EVENTO
del/@ana, add/@ana = strato della LEZIONE
```

Questo evita un problema importante. Una revisione A2, per esempio, può cancellare una lezione che non appartiene ad A0 ma ad A1. In quel caso avremo:

```xml
<mod ana="#layer-A2" ...>
  <del ana="#layer-A1">...</del>
  <add ana="#layer-A2">...</add>
</mod>
```

L'intervento è A2, ma la lezione eliminata è A1.

---

## 6. Ridefinire A0, A1, A2 e B

### 6.1 A0: prima stesura

A0 rappresenta il testo di prima stesura.

Non è necessario marcare ogni parola ordinaria con:

```xml
ana="#layer-A0"
```

perché questo renderebbe il file molto pesante e ridondante.

Nel modello di progetto il `<body>` viene associato alla prima stesura:

```xml
<body change="#stage-A0">
```

Il testo non coinvolto da modificazioni appartiene quindi implicitamente alla base A0.

`ana="#layer-A0"` viene usato soprattutto quando è necessario identificare esplicitamente una lezione eliminata o sostituita.

### 6.2 A1: correzione immediata

A1 è stato il punto che ha richiesto la revisione concettuale più importante.

Le TEI distinguono le modifiche effettuate dopo la scrittura dalle cosiddette **instant corrections**, cioè correzioni prodotte immediatamente durante l'atto di scrittura. In questi casi `@instant="true"` segnala che la modifica appartiene allo stesso momento genetico del contesto di scrittura.

Per questa ragione A1 non viene trattato come una campagna autonoma equivalente ad A2.

Un caso A1 è codificato, per esempio, così:

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

Il punto importante è che:

- `instant="true"` esprime la semantica TEI;
- `ana="#layer-A1"` conserva la categoria editoriale del progetto.

A1 resta dunque perfettamente filtrabile nell'interfaccia senza essere trasformato artificialmente in un `<change>`.

### 6.3 A2: revisione autoriale differita

A2 corrisponde invece a una vera revisione successiva, riconoscibile paleograficamente o materialmente come distinta dalla prima stesura.

Per questo viene dichiarata una campagna:

```xml
<change xml:id="stage-A2">
  Campagna di revisione autoriale successiva.
</change>
```

e gli interventi vengono collegati a essa:

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

Qui `@change` e `@ana` hanno funzioni diverse:

- `@change` collega il fenomeno alla campagna documentaria;
- `@ana` lo collega alla classificazione editoriale A2 usata anche dall'interfaccia.

### 6.4 B: interventi non autografi

B rimane uno strato editoriale unitario, utile soprattutto sul piano della visualizzazione.

Internamente, però, può essere articolato quando la documentazione paleografica lo consente.

Per esempio:

```xml
<handNote xml:id="hB1">Prima mano non autografa.</handNote>
<handNote xml:id="hB2">Seconda mano non autografa.</handNote>
```

e:

```xml
<change xml:id="stage-B1">Prima campagna non autografa.</change>
<change xml:id="stage-B2">Seconda campagna non autografa.</change>
```

Tutti questi interventi possono continuare ad avere:

```xml
ana="#layer-B"
```

così l'interfaccia conserva un solo filtro B, mentre il TEI mantiene una granularità molto maggiore.

---

## 7. Un caso decisivo: `marqués → conde → marqués`

Uno dei passaggi più utili per mettere alla prova il modello è quello in cui due mani non autografe intervengono successivamente sullo stesso testo.

La sequenza materiale è:

```text
A0   marqués
      ↓ prima mano non autografa
B1   conde
      ↓ seconda mano non autografa
B2   marqués
```

Nel vecchio modello entrambe le trasformazioni erano semplicemente classificate come B.

Nel nuovo modello si conserva la successione reale annidando il secondo intervento nella lezione introdotta dal primo:

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

Questa costruzione permette di conservare simultaneamente:

- la prima lezione autografa;
- la nuova lezione della prima mano;
- la seconda modifica;
- l'ordine degli interventi;
- la responsabilità delle due mani;
- l'appartenenza complessiva allo strato B.

È importante sottolineare che non si usa automaticamente `<restore>`. Il fatto che la seconda mano ristabilisca una parola uguale alla lezione originaria non significa necessariamente che stia “ripristinando” materialmente una cancellazione nel senso tecnico previsto dalla TEI. Se compie una nuova sostituzione sulla lezione precedente, descriverla come seconda `<mod>` è più prudente e più aderente al fenomeno osservabile.

---

## 8. Le modifiche che attraversano più versi

Il manoscritto contiene casi in cui un unico intervento interessa una sequenza di versi.

In questi casi un elemento inline come `<del>` non può semplicemente contenere tutti i versi, perché ciò produrrebbe conflitti con la struttura gerarchica del testo.

La soluzione TEI è usare uno span:

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

Il vantaggio è evidente:

- i versi restano codificati normalmente;
- la cancellazione può attraversare più elementi;
- il renderer può identificare l'intervallo completo;
- non è necessario duplicare o deformare il testo.

Questo modello sostituisce le precedenti costruzioni non standard con `from/to`.

---

## 9. Le mani nel nuovo modello

Le mani vengono dichiarate nel `profileDesc`:

```xml
<handNotes>
  <handNote xml:id="Lope"
            scope="major"
            scribe="author">
    Mano autografa di Lope de Vega.
  </handNote>

  <handNote xml:id="hB1"
            scope="minor">
    Prima mano non autografa.
  </handNote>

  <handNote xml:id="hB2"
            scope="minor">
    Seconda mano non autografa.
  </handNote>
</handNotes>
```

Gli interventi richiamano poi questi identificatori:

```xml
hand="#Lope"
hand="#hB1"
hand="#hB2"
```

Questo sistema presenta diversi vantaggi:

1. evita valori testuali incoerenti o errori di battitura;
2. consente di aggiungere una descrizione paleografica della mano una sola volta;
3. permette di modificare in seguito l'identificazione senza cambiare tutti gli interventi;
4. rende possibile distinguere responsabilità grafica e campagna cronologica.

Un punto metodologico importante è che **mano e campagna non coincidono necessariamente**.

La stessa mano potrebbe essere intervenuta in momenti differenti. Viceversa, una stessa fase potrebbe contenere interventi di più mani. Le due informazioni vengono quindi mantenute separate.

---

## 10. Le campagne di revisione

Le campagne o fasi documentarie vengono descritte mediante `<listChange>`:

```xml
<creation>
  <listChange ordered="true">

    <change xml:id="stage-A0">
      Prima stesura autografa.
    </change>

    <change xml:id="stage-A2">
      Campagna di revisione autoriale successiva.
    </change>

    <listChange xml:id="stage-B" ordered="true">

      <change xml:id="stage-B1">
        Prima campagna non autografa.
      </change>

      <change xml:id="stage-B2">
        Seconda campagna non autografa.
      </change>

    </listChange>

  </listChange>
</creation>
```

L'annidamento è utile perché consente di esprimere una gerarchia senza fingere che tutti gli strati abbiano lo stesso statuto.

A0 e A2 appartengono alla storia autoriale. B raccoglie invece una storia post-autoriale che può a sua volta articolarsi internamente.

Questa struttura deve comunque rimanere prudente: B1 e B2 vengono utilizzati solo quando l'ordine tra le mani è sostenibile paleograficamente.

---

## 11. Perché `@ana` è essenziale per il progetto

La TEI descrive il fenomeno documentario attraverso `@instant`, `@change`, `@hand`, `@seq` e gli elementi trascrizionali.

L'interfaccia, però, deve continuare a lavorare con le categorie editoriali A0/A1/A2/B.

Per evitare di deformare la TEI in funzione del frontend, il modello usa `@ana` come **ponte tra i due livelli**.

Nel `teiHeader` viene definita una tassonomia:

```xml
<taxonomy xml:id="genetic-layers">

  <category xml:id="layer-A0">
    <catDesc>Prima stesura autografa.</catDesc>
  </category>

  <category xml:id="layer-A1">
    <catDesc>Intervento immediato.</catDesc>
  </category>

  <category xml:id="layer-A2">
    <catDesc>Revisione autoriale successiva.</catDesc>
  </category>

  <category xml:id="layer-B">
    <catDesc>Intervento non autografo.</catDesc>
  </category>

</taxonomy>
```

Gli elementi possono quindi essere classificati con:

```xml
ana="#layer-A1"
ana="#layer-A2"
ana="#layer-B"
```

La visualizzazione non deve interpretare tutta la logica paleografica. Può semplicemente leggere questi identificatori.

---

## 12. Codifica e visualizzazione: due livelli separati

La futura trasformazione TEI → HTML dovrà esportare almeno due informazioni:

```html
data-event-layer="A1"
data-reading-layer="A0"
```

La prima indica **a quale strato appartiene l'intervento**.

La seconda indica **a quale strato appartiene quella specifica lezione**.

Questo rende possibili due funzioni dell'interfaccia che devono essere mantenute distinte.

### 12.1 Filtrare gli interventi

L'utente può decidere di mostrare soltanto:

- A1;
- A2;
- B;
- una combinazione di questi.

Questa modalità serve a studiare il **processo di scrittura**.

I colori attualmente associati agli strati rimangono pienamente utilizzabili, ma la palette appartiene al CSS/frontend e non viene memorizzata nel TEI.

### 12.2 Ricostruire gli stati del testo

L'utente può invece chiedere di vedere il testo ricostruito a un determinato livello:

```text
A0
A0 + A1
A0 + A1 + A2
A0 + A1 + A2 + B
```

Questa modalità risponde a una domanda diversa:

> Come si legge il testo se applico tutte le modifiche fino a questo punto?

È importante precisare che `A0 + A1` è una **ricostruzione editoriale cumulativa**, non necessariamente uno stato materiale dell'intero manoscritto esistito simultaneamente in un preciso istante.

### 12.3 Testo autoriale finale e stato documentario finale

Il nuovo modello consente inoltre di distinguere con chiarezza:

```text
ultimo stato autoriale = A0 + A1 + A2

stato documentario finale = A0 + A1 + A2 + B
```

Questa distinzione è filologicamente significativa e dovrebbe essere mantenuta anche nell'interfaccia futura.

---

## 13. Perché i colori non devono essere codificati nell'XML

Il TEI registra concetti, non decisioni grafiche temporanee.

Per questo il file XML contiene:

```xml
ana="#layer-A1"
```

e non:

```xml
color="..."
```

Il colore viene assegnato nel frontend.

Questo produce un vantaggio di sostenibilità importante: una futura modifica della grafica, del CSS o dell'intera piattaforma non richiederà di modificare i dati TEI.

Lo stesso principio vale per Jekyll, Astro, CETEIcean o qualsiasi altra tecnologia di pubblicazione. Il modello documentario deve rimanere indipendente dallo strumento usato per renderlo.

---

## 14. Il ruolo dell'ODD

Il nuovo modello non viene lasciato soltanto alla documentazione prose.

È stato creato un ODD di progetto:

```text
edition/prototype/EMN_genetic.odd
```

che fissa la versione:

```xml
<schemaSpec
    ident="emn-genetic"
    start="TEI"
    source="tei:4.12.0">
```

Il riferimento esplicito a TEI P5 4.12.0 è importante per la riproducibilità. Il progetto non dipende così automaticamente da future modifiche di `tei:current`.

Il modulo `textcrit` non è incluso nel modello genetico.

Sono invece inclusi i moduli necessari per:

- struttura TEI;
- header;
- testo;
- teatro;
- verso;
- trascrizione delle fonti primarie;
- analisi;
- linking;
- descrizione manoscritta;
- nomi e date.

---

## 15. Le regole Schematron del progetto

L'ODD contiene anche regole specifiche che trasformano le scelte metodologiche in controlli automatici.

Fra le condizioni verificate:

- ogni `<mod>` deve avere un `xml:id`;
- ogni `<mod>` deve dichiarare il tipo di intervento;
- ogni `<mod>` deve avere una mano;
- A1 deve essere autografo e avere `instant="true"`;
- A2 deve essere autografo e puntare a `#stage-A2`;
- B deve essere associato a una mano non autografa dichiarata;
- `<add>` e `<del>` devono avere uno strato leggibile dall'interfaccia;
- una sostituzione deve contenere sia `<del>` sia `<add>`;
- una cancellazione deve contenere `<del>` ma non `<add>`;
- un'aggiunta deve contenere `<add>` ma non `<del>`;
- gli interventi annidati devono dichiarare `@seq`;
- la seconda modifica di una sequenza deve avere un numero di sequenza superiore alla prima;
- `<delSpan>` e `<addSpan>` devono avere `@spanTo`;
- il file genetico non deve reintrodurre `<app>`, `<lem>` o `<rdg>`.

Questi controlli hanno una funzione scientifica, non soltanto informatica. Impediscono che la codifica perda progressivamente coerenza durante il lavoro sull'intero testo.

---

## 16. La validazione eseguita

Il modello è stato provato su due file campione.

### 16.1 `EMN_mod_sample.xml`

Contiene un primo segmento ricodificato fino circa al v. 150 e comprende:

- cancellazioni immediate;
- sostituzioni immediate;
- interventi non autografi;
- casi riclassificati rispetto alla codifica iniziale.

### 16.2 `EMN_complex_cases.xml`

È stato creato come vero e proprio **stress test** e contiene:

- un caso A2 differito;
- una sequenza B1 → B2;
- una cancellazione long-span attraverso più versi.

Entrambi i file sono stati verificati contro:

1. lo schema RELAX NG generato dall'ODD;
2. le regole Schematron specifiche del progetto.

La validazione viene eseguita automaticamente tramite GitHub Actions nel workflow:

```text
.github/workflows/validate-genetic-tei.yml
```

Lo schema ODD viene compilato con gli Stylesheets TEI e ogni modifica ai file del prototipo può quindi essere controllata in maniera riproducibile.

Al momento gli stress test hanno superato tutte le regole attive.

---

## 17. Un esempio di riclassificazione filologica

La revisione del modello ha già mostrato che correggere la sintassi XML non basta: alcuni casi devono essere rivalutati anche filologicamente.

Un esempio è la correzione del nome del parlante:

```text
Leo → Feli
```

Nel file iniziale era codificata come A2.

La nota editoriale, tuttavia, descrive un intervento che sembra avvenire immediatamente: Lope si sarebbe accorto dell'errore prima ancora di completare normalmente la didascalia del parlante.

Se questa interpretazione viene confermata, il fenomeno è più coerente con:

```xml
<mod type="subst"
     hand="#Lope"
     instant="true"
     ana="#layer-A1">
  <del ana="#layer-A0">Leo</del>
  <add ana="#layer-A1">Feli</add>
</mod>
```

Questo esempio mostra un principio fondamentale della migrazione:

> **La conversione non può essere un semplice find/replace.**

Ogni trasformazione automatica dovrà essere accompagnata da una revisione dei casi in cui la precedente etichetta A1/A2 potrebbe non corrispondere all'analisi materiale descritta nelle note.

---

## 18. Cosa non cambia

Il nuovo modello non modifica alcuni principi fondamentali dell'edizione.

### 18.1 L'edizione critica e quella genetica restano separate

Non si intende riunificare tutto in un unico XML.

La separazione fra:

- edizione critica;
- edizione genetico-evolutiva

resta metodologicamente valida e risponde a esigenze differenti.

L'edizione critica usa il modello dell'apparato e dei testimoni.

L'edizione genetica descrive il manoscritto autografo e le sue trasformazioni.

### 18.2 A0/A1/A2/B restano il linguaggio editoriale dell'interfaccia

Il fatto che questi strati non vengano più codificati con `@wit` non significa che vengano abbandonati.

Al contrario, il nuovo modello li rende più espliciti come **categorie analitiche di progetto**.

### 18.3 Restano possibili filtri e colori

La nuova codifica non riduce le possibilità dell'interfaccia attuale.

Permette anzi di distinguere più precisamente:

- strato;
- mano;
- fase;
- ordine;
- tipo di intervento;
- lezione precedente;
- lezione successiva.

---

## 19. Cosa cambia

Il cambiamento può essere riassunto così.

### Prima

```text
variante = app + rdg/lem
A0/A1/A2/B = wit
ordine = varSeq
mano = stringa libera
```

### Dopo

```text
evento documentario = mod / add / del / spans
fase = change
immediatezza = instant
ordine locale = seq
mano = hand → handNote
categoria editoriale = ana → taxonomy
```

Il nuovo modello separa quindi informazioni che prima erano compresse nello stesso costrutto.

---

## 20. Principio di prudenza interpretativa

L'ODD è volutamente rigoroso, ma non deve costringere a dichiarare informazioni che il manoscritto non permette realmente di conoscere.

Se non è possibile stabilire con sicurezza:

- se un intervento è immediato o differito;
- se una mano è hB1 o hB2;
- se due interventi appartengono alla stessa campagna;
- quale sia l'ordine preciso fra due modificazioni;

la codifica deve conservare l'incertezza.

La modellazione non deve trasformare un'ipotesi filologica in una falsa certezza strutturale.

Questo principio sarà particolarmente importante durante la conversione dell'intero file.

---

## 21. Strategia prevista per la migrazione completa

La conversione di `EMN_mod.xml` dovrebbe procedere in più passaggi.

### Fase 1 — inventario

Individuare tutti gli attuali:

- `<app>`;
- `<lem>`;
- `<rdg>`;
- `<subst>`;
- `<add>`;
- `<del>`;
- costruzioni long-span;
- valori di `@wit`;
- valori di `@hand`;
- valori di `@varSeq`.

### Fase 2 — classificazione

Per ogni caso registrare:

- fenomeno materiale;
- lezione precedente;
- lezione nuova;
- A1/A2/B;
- mano;
- eventuale ordine locale;
- eventuale incertezza.

### Fase 3 — conversione automatizzabile

Convertire i casi non ambigui mediante script.

Per esempio:

```text
A0 → A1 + subst
```

può spesso essere trasformato in:

```xml
<mod type="subst" hand="#Lope" instant="true" ana="#layer-A1">
  <del ana="#layer-A0">...</del>
  <add ana="#layer-A1">...</add>
</mod>
```

### Fase 4 — revisione filologica

Isolare i casi nei quali:

- la nota contraddice la vecchia classificazione;
- il numero delle mani è incerto;
- la cronologia è dubbia;
- il fenomeno materiale richiede un elemento più specifico.

### Fase 5 — validazione

Ogni nuova sezione convertita deve superare:

- RELAX NG;
- Schematron;
- controlli sui puntatori;
- test di ricostruzione degli stati.

### Fase 6 — integrazione con il frontend

Solo quando la struttura TEI sarà stabilizzata sarà opportuno riscrivere il renderer.

Questo ordine evita di costruire una nuova interfaccia intorno a un modello ancora instabile.

---

## 22. La relazione con la futura interfaccia

La trasformazione potrà produrre markup HTML del tipo:

```html
<span
  data-event-layer="A2"
  data-reading-layer="A0"
  data-hand="Lope"
  data-change="stage-A2">
  ...
</span>
```

Da qui l'interfaccia potrà implementare senza conoscere la sintassi TEI completa:

- filtri A1/A2/B;
- legenda;
- colori;
- popup con la mano;
- informazioni sulla fase;
- ricostruzione A0;
- ricostruzione A0+A1;
- ricostruzione A0+A1+A2;
- stato documentario con B;
- eventualmente B1/B2 nei casi in cui l'ordine sia sicuro.

In altre parole, il TEI conserva la complessità scientifica; l'HTML espone soltanto i dati necessari alla navigazione.

---

## 23. Sostenibilità del modello

Il nuovo sistema risponde anche all'obiettivo generale di sostenibilità del progetto.

La distinzione tra:

```text
dati TEI
        ↓
trasformazione
        ↓
HTML
        ↓
CSS / JavaScript
```

impedisce che la semantica dipenda da una specifica tecnologia di pubblicazione.

La scelta di:

- usare elementi TEI standard;
- limitare gli attributi personalizzati;
- fissare una release TEI;
- mantenere un ODD;
- validare automaticamente;
- separare colori e dati;

riduce il rischio che il progetto diventi inutilizzabile quando cambieranno framework o librerie frontend.

---

## 24. File prodotti durante la revisione

Nella branch `tei-genetic-model-prototype` sono attualmente presenti:

### `edition/prototype/EMN_mod_sample.xml`

Primo campione di conversione.

### `edition/prototype/EMN_complex_cases.xml`

Casi complessi usati per stressare il modello.

### `edition/prototype/EMN_genetic.odd`

ODD di progetto con schema e regole Schematron.

### `edition/prototype/GENETIC_MODEL.md`

Sintesi concettuale del modello.

### `edition/prototype/GENETIC_ENCODING_GUIDE.md`

Manuale normativo operativo: fenomeno → codifica → attributi → visualizzazione.

### `.github/workflows/validate-genetic-tei.yml`

Workflow automatico di validazione.

### `edition/prototype/GENETIC_MODEL_DOCUMENTATION.md`

Il presente documento, che ricostruisce la storia e le ragioni della revisione.

---

## 25. Riferimenti TEI principali

Il modello è stato sviluppato assumendo come riferimento TEI P5 4.12.0, con particolare attenzione al capitolo **Representation of Primary Sources** e agli elementi del modulo `transcr`.

Riferimenti principali:

- TEI P5 4.12.0, *Representation of Primary Sources*:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/PH.html
- `<mod>`:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-mod.html
- `<change>`:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-change.html
- `<handNotes>`:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-handNotes.html
- `<delSpan>`:  
  https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-delSpan.html

La documentazione TEI sottolinea in particolare che:

- `@change` collega un elemento a uno stato o a una campagna di revisione;
- `@instant="true"` è previsto per false starts e correzioni immediate;
- `<listChange>` può esprimere campagne ordinate e può essere annidato;
- `<mod>` dispone di attributi come `@seq`, `@instant`, `@hand` e `@spanTo`;
- `<delSpan>` richiede `@spanTo` e consente di rappresentare cancellazioni attraverso più elementi strutturali.

---

## 26. Sintesi finale

Il modello iniziale aveva un grande vantaggio: rendeva immediatamente leggibili A0/A1/A2/B e funzionava bene per il frontend.

Il suo limite era però quello di rappresentare la genesi del manoscritto mediante strumenti pensati per l'apparato critico.

La revisione non ha quindi abbandonato l'intuizione originaria — la possibilità di vedere separatamente gli strati — ma ha cercato di darle una base più corretta.

Il risultato può essere sintetizzato in quattro principi.

### 1. Descrivere prima il manoscritto

La codifica deve partire dal fenomeno materiale:

```text
cancellazione
aggiunta
sostituzione
ripasso
span
mano
campagna
ordine
```

### 2. Non confondere il dato con l'interpretazione

```text
TEI documentario     ≠     categoria editoriale
```

`@instant`, `@change`, `@hand` descrivono il documento.

`@ana="#layer-A1/A2/B"` conserva la tassonomia interpretativa del progetto.

### 3. Non sacrificare la visualizzazione

A0/A1/A2/B devono restare sempre interrogabili e filtrabili.

Il modello deve permettere sia di **mostrare il processo** sia di **ricostruire gli stati**.

### 4. Rendere le decisioni verificabili

ODD, Schematron, file di test e validazione automatica fanno sì che il modello non dipenda soltanto dalla memoria dell'editore o dal comportamento contingente del JavaScript.

La codifica genetica diventa così contemporaneamente:

- un'interpretazione filologica;
- una descrizione documentaria;
- un modello computabile;
- una base sostenibile per la pubblicazione digitale.

---

## 27. Stato attuale e prossimi passi

Il modello ha superato i primi test formali e i principali casi complessi finora selezionati.

La fase successiva consiste nella conversione sistematica dell'intero `EMN_mod.xml`.

Questa migrazione dovrà produrre due risultati paralleli:

1. **un nuovo file TEI geneticamente coerente e validabile**;
2. **un registro dei casi dubbi**, in cui l'incertezza filologica venga esplicitata e non nascosta dalla codifica.

Solo dopo questa fase sarà opportuno intervenire in modo strutturale sulla nuova interfaccia web.

La priorità rimane quindi:

```text
manoscritto
    ↓
interpretazione filologica
    ↓
modello TEI
    ↓
validazione
    ↓
trasformazione
    ↓
interfaccia
```

e non il percorso inverso.
