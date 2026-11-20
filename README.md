# JSM-utils

## Utizzo

1. aprire un terminale e incollare il seguente comando

   ```batch
   $ git clone https://github.com/D3ENNY/jsm-utils
   ```

   in caso in cui tu non abbia installato git sul pc è possibile scaricare lo zip ed estrarlo attraverso l'apposito tasto: **Code** > **Download Zip**
2. se si utiizza __google chrome__ andare su: ``chrome:\\extension``

   in alternativa se non si usa il browser chrome sarà possibile andare nel vostro browser (chromium based) sul gestore delle estensioni
3. premere su: **importa estensione non pacchettizzata** o simili in base al browser in utilizzo
4. importare l'intera cartella scaricata in precedenza

## Funzioni

- Nella lista dei ticket, le righe vengono colorate in base al team assegnatario: Sistemistica, Programmazione o Helpdesk.
- I riepiloghi contenenti `[Warning]`, `[Error]` o `[Success]` vengono sottolineati rispettivamente in arancione, rosso o verde.

---

## Struttura del progetto

Nessun build step: il codice usa moduli ES nativi del browser.

```text
manifest.json
assets/icons/
src/
├── shared/                      codice usato da popup e content script
│   ├── default-config.js        configurazione predefinita (unica fonte)
│   ├── config.js                default + configurazione salvata
│   ├── storage.js               accesso a chrome.storage.sync
│   ├── object-utils.js          deepFreeze, merge profondo
│   └── timing.js                debounce / throttle
├── content/                     script iniettato nelle pagine Jira
│   ├── loader.js                content script classico → importa main.js
│   ├── main.js                  avvio, sync con il popup, MutationObserver
│   ├── constants.js             selettori, classi CSS, marker
│   ├── dom-utils.js
│   ├── status-buttons.js        funzione "Colori stati"
│   ├── list-styles.js           <style> iniettato per team e marker
│   ├── issue-rows.js            funzioni "Colori team" e "Marker summary"
│   ├── team-matcher.js
│   └── summary-marker.js
└── popup/
    ├── popup.html / popup.js    pagina ed entry point
    ├── config-store.js          stato + salvataggio della configurazione
    ├── feature-toggles.js       interruttori "Funzionalità"
    ├── color-lists.js           liste "Colori stati" e "Colori team"
    ├── status-groups.js         raggruppamento degli stati
    ├── reset-button.js
    ├── announcer.js             messaggi per screen reader
    ├── text-format.js
    ├── components/color-picker/ componente color picker (JS + CSS)
    └── styles/
        ├── index.css            importa tutti i fogli nell'ordine giusto
        ├── tokens.css           variabili CSS (font, spaziature, colori)
        ├── base.css / layout.css
        └── components/          un file per componente
```

**Dove intervenire:**

- nuovo stato o colore predefinito → `src/shared/default-config.js` (e, per mostrarlo nel popup, `src/popup/status-groups.js`);
- nuova funzione sulla pagina Jira → nuovo modulo in `src/content/`, richiamato da `applyAll()` in `main.js`;
- colori e dimensioni dell'interfaccia → `src/popup/styles/tokens.css`.

---

## Contributors

- Denys Raimondi
