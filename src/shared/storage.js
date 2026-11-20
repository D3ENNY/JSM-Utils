/* =====================================================
   Accesso a chrome.storage.sync
   -----------------------------------------------------
   Unico punto dell'estensione che conosce la chiave e
   l'area di storage: popup e content script passano
   solo da qui.
   ===================================================== */

const STORAGE_AREA = "sync";
const STORAGE_KEY  = "config";

export function isStorageAvailable() {
    return Boolean(globalThis.chrome?.storage?.[STORAGE_AREA]);
}

/** Configurazione salvata così com'è (può essere undefined). */
export async function readStoredConfig() {
    const stored = await chrome.storage[STORAGE_AREA].get(STORAGE_KEY);
    return stored[STORAGE_KEY];
}

export function writeStoredConfig(config) {
    return chrome.storage[STORAGE_AREA].set({ [STORAGE_KEY]: config });
}

/**
 * Notifica ogni modifica alla configurazione salvata,
 * anche quelle fatte da un altro contesto (es. il popup).
 */
export function onStoredConfigChange(callback) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        const change = changes[STORAGE_KEY];
        if (areaName === STORAGE_AREA && change) {
            callback(change.newValue);
        }
    });
}
