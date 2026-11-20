/* =====================================================
   Interruttori "Funzionalità"
   ===================================================== */

import { configStore } from "./config-store.js";

/** id del checkbox → chiave in config.features */
const FEATURE_TOGGLES = Object.freeze({
    enableStatusColors:   "statusColors",
    enableTeamColors:     "teamColors",
    enableSummaryMarkers: "summaryMarkers"
});

function getFeatureToggles() {
    return Object.entries(FEATURE_TOGGLES).map(([inputId, featureKey]) => ({
        input: document.getElementById(inputId),
        featureKey
    }));
}

/** Collega i listener: va chiamata UNA sola volta. */
export function bindFeatureToggles() {

    const toggles = getFeatureToggles();

    if (toggles.some(({ input }) => !input)) {
        console.error("JSM-utils: uno o più toggle non sono presenti nell'HTML.");
        return;
    }

    for (const { input, featureKey } of toggles) {
        input.addEventListener("change", () => {
            configStore.current.features[featureKey] = input.checked;
            configStore.saveNow();
        });
    }
}

/** Allinea i checkbox alla configurazione corrente. */
export function syncFeatureToggles() {
    for (const { input, featureKey } of getFeatureToggles()) {
        if (input) {
            input.checked = Boolean(configStore.current.features[featureKey]);
        }
    }
}
