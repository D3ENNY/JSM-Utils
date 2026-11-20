/* =====================================================
   Riconoscimento dei marker [warning] / [error] /
   [success] nel summary di una riga
   ===================================================== */

import { SELECTORS, SUMMARY_MARKER_REGEX, summaryClassName } from "./constants.js";

function findMarkedElement(row, cells) {

    for (const element of row.querySelectorAll(SELECTORS.summaryCandidate)) {
        if (SUMMARY_MARKER_REGEX.test(element.textContent)) {
            return element;
        }
    }

    return cells.find(cell =>
        !cell.querySelector(SELECTORS.teamColumnInside) &&
        SUMMARY_MARKER_REGEX.test(cell.textContent)
    ) || null;
}

/**
 * Elemento da sottolineare e relativa classe CSS,
 * oppure null se la riga non contiene marker.
 */
export function findSummaryMarker(row, cells) {

    const element = findMarkedElement(row, cells);
    const match = element?.textContent.match(SUMMARY_MARKER_REGEX);

    return match
        ? { element, className: summaryClassName(match[1].toLowerCase()) }
        : null;
}
