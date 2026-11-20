/* =====================================================
   Foglio di stile iniettato per le liste
   -----------------------------------------------------
   Definisce le classi usate da "Colori team" e
   "Marker summary" con i colori della configurazione.
   ===================================================== */

import {
    LIST_STYLE_ELEMENT_ID,
    SUMMARY_MARKER_TYPES,
    summaryClassName,
    teamClassName
} from "./constants.js";

function buildTeamCss(teamColors) {
    return Object.entries(teamColors)
        .map(([teamName, background]) => `
            .${teamClassName(teamName)} {
                background-color: ${background} !important;
            }`)
        .join("\n");
}

function buildSummaryCss(summaryMarkers) {
    return SUMMARY_MARKER_TYPES
        .filter(type => summaryMarkers[type])
        .map(type => `
            .${summaryClassName(type)} {
                text-decoration: underline !important;
                text-decoration-color: ${summaryMarkers[type]} !important;
                text-decoration-thickness: 2px !important;
                text-underline-offset: 2px !important;
            }`)
        .join("\n");
}

/** Crea/aggiorna il <style>, o lo rimuove se nessuna funzione è attiva. */
export function renderListStyles(config) {

    const { teamColors, summaryMarkers } = config.features;
    let styleElement = document.getElementById(LIST_STYLE_ELEMENT_ID);

    if (!teamColors && !summaryMarkers) {
        styleElement?.remove();
        return;
    }

    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = LIST_STYLE_ELEMENT_ID;
        document.head.appendChild(styleElement);
    }

    const css =
        (teamColors ? buildTeamCss(config.teamColors) : "") +
        (summaryMarkers ? buildSummaryCss(config.summaryMarkers) : "");

    // Non riscrive il <style> (ricalcolo stili) se nulla è cambiato.
    if (styleElement.textContent !== css) {
        styleElement.textContent = css;
    }
}
