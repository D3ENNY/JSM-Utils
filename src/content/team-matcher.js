/* =====================================================
   Riconoscimento del team di una riga
   ===================================================== */

import { SELECTORS, teamClassName } from "./constants.js";
import { getCellDescriptor, normalizeText } from "./dom-utils.js";

/** Team pre-elaborati una sola volta per passata. */
export function buildTeamMatchers(teamColors) {
    return Object.keys(teamColors).map(name => ({
        className: teamClassName(name),
        needle: normalizeText(name)
    }));
}

function isTeamColumnCell(cell) {
    const descriptor = getCellDescriptor(cell);
    return descriptor.includes("team") || descriptor.includes("squad");
}

function isSummaryCell(cell) {
    return (
        getCellDescriptor(cell).includes("summary") ||
        cell.querySelector(SELECTORS.issueLink) !== null
    );
}

/**
 * Restituisce il team della riga o null.
 *
 * 1. Se esiste una vera colonna team/squad, usa solo quella.
 * 2. Altrimenti cerca in tutte le celle tranne il summary,
 *    per non confondere il titolo del ticket con il team.
 */
export function findTeamForRow(cells, teamMatchers) {

    const teamColumnCells = cells.filter(isTeamColumnCell);

    const candidates = teamColumnCells.length
        ? teamColumnCells
        : cells.filter(cell => !isSummaryCell(cell));

    const candidateTexts = candidates.map(cell => normalizeText(cell.textContent));

    return teamMatchers.find(team =>
        candidateTexts.some(text => text.includes(team.needle))
    ) || null;
}
