/* =====================================================
   Funzioni "Colori team" e "Marker summary"
   -----------------------------------------------------
   Aggiunge/rimuove le classi (definite in list-styles.js)
   sulle righe delle liste ticket.
   ===================================================== */

import { SELECTORS, SUMMARY_MARKER_TYPES, summaryClassName } from "./constants.js";
import { toClassSelector } from "./dom-utils.js";
import { buildTeamMatchers, findTeamForRow } from "./team-matcher.js";
import { findSummaryMarker } from "./summary-marker.js";

const SUMMARY_CLASSES  = SUMMARY_MARKER_TYPES.map(summaryClassName);
const SUMMARY_SELECTOR = toClassSelector(SUMMARY_CLASSES);


/* ---------------- Team ---------------- */

function resetTeamClasses(row, cells, teamClasses, teamSelector) {
    for (const element of [row, ...cells]) {
        element.classList.remove(...teamClasses);
    }
    for (const element of row.querySelectorAll(teamSelector)) {
        element.classList.remove(...teamClasses);
    }
}

function applyTeam(row, cells, teamMatchers) {
    const team = findTeamForRow(cells, teamMatchers);
    if (!team) {
        return;
    }
    for (const element of [row, ...cells]) {
        element.classList.add(team.className);
    }
}


/* ---------------- Summary ---------------- */

function resetSummaryClasses(row) {
    for (const element of row.querySelectorAll(SUMMARY_SELECTOR)) {
        element.classList.remove(...SUMMARY_CLASSES);
    }
}

function applySummaryMarker(row, cells) {
    const marker = findSummaryMarker(row, cells);
    marker?.element.classList.add(marker.className);
}


/* ---------------- Entry point ---------------- */

export function colorIssueRows(config) {

    const { teamColors: teamEnabled, summaryMarkers: summaryEnabled } = config.features;

    const teamMatchers = buildTeamMatchers(config.teamColors);
    const teamClasses  = teamMatchers.map(team => team.className);
    const teamSelector = toClassSelector(teamClasses);

    for (const row of document.querySelectorAll(SELECTORS.row)) {

        const cells = Array.from(row.querySelectorAll(SELECTORS.cell));

        if (teamClasses.length) {
            resetTeamClasses(row, cells, teamClasses, teamSelector);
        }
        if (teamEnabled) {
            applyTeam(row, cells, teamMatchers);
        }

        resetSummaryClasses(row);
        if (summaryEnabled) {
            applySummaryMarker(row, cells);
        }
    }
}
