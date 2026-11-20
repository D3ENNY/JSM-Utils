/* =====================================================
   JSM-utils — Content script (entry point)
   -----------------------------------------------------
   Carica la configurazione, applica le funzioni alla
   pagina Jira e le riapplica quando:
   - il popup salva nuove impostazioni;
   - Jira (SPA) modifica il DOM.
   ===================================================== */

import { createDefaultConfig, resolveConfig } from "../shared/config.js";
import { onStoredConfigChange, readStoredConfig } from "../shared/storage.js";
import { createDebouncedTask } from "../shared/timing.js";
import { DOM_UPDATE_DEBOUNCE_MS, LOG_PREFIX } from "./constants.js";
import { colorStatusButtons } from "./status-buttons.js";
import { renderListStyles } from "./list-styles.js";
import { colorIssueRows } from "./issue-rows.js";

let config = createDefaultConfig();


function applyAll() {
    colorStatusButtons(config);
    renderListStyles(config);
    colorIssueRows(config);
}

const scheduleApplyAll = createDebouncedTask(applyAll, DOM_UPDATE_DEBOUNCE_MS);


async function loadConfig() {
    try {
        config = resolveConfig(await readStoredConfig());
        console.log(`${LOG_PREFIX} Configurazione caricata:`, config);
    } catch (error) {
        console.error(`${LOG_PREFIX} Errore caricamento configurazione:`, error);
        config = createDefaultConfig();
    }
}

function handleConfigChange(storedConfig) {
    config = resolveConfig(storedConfig);
    console.log(`${LOG_PREFIX} Configurazione aggiornata:`, config);
    applyAll();
}

function startDomObserver() {

    if (!document.body) {
        return;
    }

    new MutationObserver(scheduleApplyAll).observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true
    });
}


export async function init() {
    onStoredConfigChange(handleConfigChange);
    await loadConfig();
    applyAll();
    startDomObserver();
}
