/* =====================================================
   JSM-utils — Popup (entry point)
   ===================================================== */

import { announce } from "./announcer.js";
import { renderColorLists } from "./color-lists.js";
import { configStore } from "./config-store.js";
import { bindFeatureToggles, syncFeatureToggles } from "./feature-toggles.js";
import { bindResetButton } from "./reset-button.js";

function renderAll() {
    syncFeatureToggles();
    renderColorLists();
}

async function init() {

    await configStore.load();

    bindFeatureToggles();
    bindResetButton(() => {
        renderAll();
        announce("Impostazioni predefinite ripristinate.");
    });

    renderAll();

    // Chiudendo il popup non si perde l'ultima modifica in sospeso.
    window.addEventListener("pagehide", () => configStore.flush());
}

// I moduli sono eseguiti in modalità "defer": il DOM è già pronto.
init();
