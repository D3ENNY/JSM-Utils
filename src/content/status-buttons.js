/* =====================================================
   Funzione "Colori stati"
   -----------------------------------------------------
   Colora i pulsanti di stato di Jira (quelli con la
   freccia SVG) in base a config.statusColors.
   ===================================================== */

import { SELECTORS } from "./constants.js";
import { normalizeText } from "./dom-utils.js";

/** Proprietà CSS inline ↔ campo della configurazione stato. */
const STATUS_STYLE_MAP = Object.freeze([
    ["background-color", "bg"],
    ["border-color",     "border"],
    ["color",            "color"]
]);

function getStatusTextElement(button) {
    return button.querySelector(SELECTORS.statusButtonText);
}

function clearStatusStyle(button) {
    for (const [cssProperty] of STATUS_STYLE_MAP) {
        button.style.removeProperty(cssProperty);
    }
    getStatusTextElement(button)?.style.removeProperty("color");
}

function applyStatusStyle(button, statusStyle) {
    for (const [cssProperty, configKey] of STATUS_STYLE_MAP) {
        button.style.setProperty(cssProperty, statusStyle[configKey], "important");
    }
    getStatusTextElement(button)?.style.setProperty("color", statusStyle.color, "important");
}

/**
 * Se la funzione è disattivata o lo stato non è mappato,
 * rimuove gli stili applicati in precedenza.
 */
export function colorStatusButtons(config) {

    const enabled = config.features.statusColors;

    for (const button of document.querySelectorAll(SELECTORS.statusButton)) {

        if (!button.querySelector("svg")) {
            continue;
        }

        const statusStyle = enabled
            ? config.statusColors[normalizeText(button.textContent)]
            : undefined;

        if (statusStyle) {
            applyStatusStyle(button, statusStyle);
        } else {
            clearStatusStyle(button);
        }
    }
}
