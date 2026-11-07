# Piano di audit filologico e tecnico della codifica genetica

## Ambito e criteri

Revisione del file `edition/prototype/EMN_mod_act1-2.xml` (atti I–II) sulla base dell'apparato genetico originale, con riferimento alle convenzioni Masai–Presotto fornite dall'editrice. Il testo XML attuale non costituisce da solo una fonte sufficiente per ricostruire le modalità materiali delle correzioni.

### Convenzioni dell'apparato

- `<-A>`: cassatura; `<del>`.
- `<-?>`: cassatura illeggibile; `<del><gap reason="illegible"/></del>` con estensione se nota.
- `<A+B>`: sovrascrittura sulla lezione precedente; `<subst><del>A</del><add rend="overwritten">B</add></subst>`.
- `<-A//B>`: correzione nel margine destro; `<add place="margin right">`.
- `<-A\\B>`: correzione nel margine sinistro; `<add place="margin left">`.
- `<-A\B>`: correzione nell'interlinea superiore; `<add place="above">`.
- `<-A/B>`: correzione nell'interlinea inferiore; `<add place="below">`.

Le forme in questa tabella sono modelli da validare contro le TEI P5 e la personalizzazione ODD; la grafia di `@place` va verificata nella specifica adottata. L'attribuzione `@change` e `@hand` resta distinta dalla posizione materiale dell'intervento. Non trasformare in massa `<mod>` in `<subst>` prima di aggiornare il modello JavaScript e i test.

## Inventario iniziale (7 novembre 2026)

Nel file di lavoro sono stati individuati 345 `<mod>`, nessun `<subst>`, 3 `<delSpan>`, 10 `<addSpan>` e un segnaposto `[lectura anterior]` ancora presente al v. 1518. I conteggi sono rilevazioni testuali preliminari, non una validazione XML né un inventario esaustivo degli interventi.

## Loci prioritari

1. **vv. 1321–1325:** collazione già avviata con l'apparato; distinguere sostituzioni puntuali, versi invariati, sovrascrittura `aguard<e+a>` e correzione interlineare superiore `<-o muerta o remediada\ras muerta o uengada>`. Verificare anche la corretta resa della prima aggiunta al v. 1321.
2. **v. 1518:** recuperare la lezione precedente dall'apparato; non sostituire il segnaposto con una congettura.
3. **vv. 906–909:** cassatura estesa da B e ripristino integrale; verificare le ricostruzioni cumulative e pulite.
4. **vv. 1689–1695:** cassatura estesa da B e ripristino dei soli vv. 1689–1692, trascritti altrove nel manoscritto; distinguere intervento materiale, collocazione della restituzione e lettura ricostruita.
5. **Tutti gli interventi `<mod type="subst">`:** verificare che la sostituzione riguardi soltanto la porzione effettivamente corretta e che le lezioni anteriori non siano state inventate o generalizzate.
6. **Tutte le aggiunte e soppressioni estese:** verificare limiti degli intervalli, inclusione di didascalie o cambi di battuta, ordine delle operazioni e attribuzione delle mani.

## Procedura

- Acquisire la versione integrale e aggiornata dell'apparato genetico.
- Collazionare ogni intervento, mantenendo un registro con locus, lezione anteriore, lezione risultante, segno dell'apparato, mano, fase, modalità materiale, stato della verifica.
- Distinguere errori certi, casi da verificare sul facsimile e scelte di modellazione.
- Correggere in piccoli gruppi con commit separati e verificare le modalità «genesi completa», A1, A2, B e testo senza marche.
- Validare XML, schema TEI/ODD e regressioni dell'interfaccia prima di integrare in produzione.

**Stato:** audit preliminare avviato; non è stata eseguita una ricodifica massiva né una verifica integrale contro l'apparato.
