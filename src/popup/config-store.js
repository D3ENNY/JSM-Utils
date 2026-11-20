/* =====================================================
   Stato della configurazione nel popup
   -----------------------------------------------------
   Tiene la configurazione corrente e ne gestisce il
   salvataggio. Gli altri moduli leggono/modificano
   `configStore.current` e poi chiedono di salvare.
   ===================================================== */

import { createDefaultConfig, resolveConfig } from "../shared/config.js";
import { isStorageAvailable, readStoredConfig, writeStoredConfig } from "../shared/storage.js";
import { createThrottledTask } from "../shared/timing.js";

const LOG_PREFIX = "JSM-utils:";

/*
 * chrome.storage.sync accetta al massimo 120 scritture/minuto:
 * trascinando uno slider se ne generavano decine al secondo.
 * Le modifiche frequenti (colori) vengono quindi raggruppate.
 */
const FREQUENT_SAVE_INTERVAL_MS = 600;

let current = createDefaultConfig();

async function persist() {

    if (!isStorageAvailable()) {
        return;
    }

    try {
        await writeStoredConfig(current);
    } catch (error) {
        console.error(LOG_PREFIX, "salvataggio non riuscito.", error);
    }
}

const throttledPersist = createThrottledTask(persist, FREQUENT_SAVE_INTERVAL_MS);


export const configStore = {

    get current() {
        return current;
    },

    async load() {

        if (!isStorageAvailable()) {
            console.error(LOG_PREFIX, "chrome.storage.sync non disponibile.");
            current = createDefaultConfig();
            return;
        }

        const storedConfig = await readStoredConfig();

        if (!storedConfig) {
            // Prima apertura: salva i default.
            current = createDefaultConfig();
            await this.saveNow();
            return;
        }

        // Il merge con i default evita che l'aggiunta di nuovi
        // stati/funzioni rompa le configurazioni già salvate.
        current = resolveConfig(storedConfig);
    },

    /** Ripristina i default e li salva subito. */
    async reset() {
        current = createDefaultConfig();
        await this.saveNow();
    },

    /** Salvataggio immediato (toggle, reset). */
    saveNow() {
        throttledPersist.cancel();
        return persist();
    },

    /** Salvataggio raggruppato (modifiche continue, es. slider). */
    scheduleSave() {
        throttledPersist.schedule();
    },

    /** Salva subito l'eventuale modifica in attesa. */
    flush() {
        return throttledPersist.flush();
    }
};
