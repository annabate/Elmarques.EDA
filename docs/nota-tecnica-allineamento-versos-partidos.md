# Nota tecnica — ottimizzazione dell'allineamento dei *versos partidos*

**Progetto:** edizione digitale di *El marqués de las Navas* (Lope de Vega).  
**Ambiente:** ramo di sviluppo `tei-genetic-act1-2-integration`, interfaccia genetica su Vercel.  
**Data della verifica:** 7 novembre 2026.

## Problema e implicazioni ecdotiche

La visualizzazione genetica consente di passare tra le ricostruzioni cumulative A1, A2 e B e la modalità di genesi completa. La resa dei *versos partidos*, distribuiti tra battute diverse, richiede un allineamento orizzontale basato sulla larghezza effettivamente occupata dai frammenti precedenti. Tale misura varia con il carattere, la larghezza delle colonne e il contenuto testuale restituito dalla fase selezionata. Un rientro fisso non garantirebbe pertanto una rappresentazione affidabile della continuità metrica.

Durante le prove, il cambio di strato richiedeva all'incirca sei secondi, compromettendo la comparazione tra le fasi. L'interfaccia ricostruiva il DOM della lettura selezionata e ne ricalcolava l'impaginazione. Una prima ottimizzazione ha limitato il riallineamento alle colonne effettivamente interessate e accorpato gli aggiornamenti grafici; una seconda ha introdotto una cache delle ricostruzioni TEI già elaborate. Entrambe si sono rivelate insufficienti a eliminare il ritardo percepito.

## Diagnosi e intervento

L'analisi con Chrome DevTools, nella scheda Performance, ha mostrato un'incidenza rilevante delle operazioni di layout e delle misurazioni geometriche mediante `getClientRects()`. Nel codice precedente, `alignSplitVerses()` alternava la modifica del `padding-left` di un frammento e la misurazione delle coordinate dei suoi elementi. Questa alternanza poteva provocare ricalcoli sincroni dell'impaginazione (*forced reflow*).

La funzione è stata riorganizzata in due passaggi: prima raccoglie le misure dei frammenti senza modificare lo stile, poi calcola e applica i rientri. Si evita così l'alternanza ripetuta fra letture geometriche e scritture nel DOM. L'intervento è circoscritto al livello di presentazione e non modifica la codifica XML-TEI né l'attribuzione degli interventi alle fasi A1, A2 e B.

## Verifica e limiti

Dopo la modifica, l'utente ha riferito che il passaggio tra gli strati era «praticamente immediato» e ha confermato la correttezza dell'allineamento dei versi divisi nelle condizioni provate. Le registrazioni Performance prima e dopo non sono direttamente confrontabili come benchmark quantitativo, poiché coprono intervalli e attività differenti; non si attribuisce pertanto un fattore numerico di accelerazione. Il risultato è una verifica funzionale e percettiva positiva, non una misurazione controllata su più dispositivi.

## Tracciabilità

- Ottimizzazione del riallineamento per colonna e accorpamento dei frame: commit `ee84699ca668eea52aabe2f1cc398e3aea4b23aa`.
- Cache delle ricostruzioni genetiche: commit `dddc14d37ea5960335dd75b9bba8e55fabef8f1b`.
- Strumentazione diagnostica: commit `6d505e47a76255842059ecaae0e7328f3d93a360`.
- Separazione fra misurazioni e aggiornamenti di layout: commit `067f3124a45c318643469902378656cd43c08b59`.

**Rilevanza metodologica:** il caso documenta come una scelta di visualizzazione motivata dalla struttura metrica e drammatica del testo richieda un algoritmo di impaginazione adattivo, e come l'ottimizzazione di tale algoritmo incida direttamente sulla possibilità di confrontare le fasi redazionali senza sacrificare la fedeltà della rappresentazione.
