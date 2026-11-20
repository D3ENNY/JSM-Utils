/* =====================================================
   Costanti del content script
   ===================================================== */

export const LOG_PREFIX = "[JSM-utils]";

/** Attesa prima di riapplicare le regole dopo modifiche al DOM. */
export const DOM_UPDATE_DEBOUNCE_MS = 200;

export const SELECTORS = Object.freeze({
    statusButton:     'button[type="button"]',
    statusButtonText: "span span",
    row:              'tr, [role="row"]',
    cell:             'td, [role="cell"], [role="gridcell"], [data-testid*="cell"]',
    issueLink:        'a[href*="/browse/"]',
    summaryCandidate: '[data-column-id*="summary"], [data-testid*="summary"], [aria-label*="summary"], a[href*="/browse/"]',
    teamColumnInside: '[data-column-id*="team"], [data-testid*="team"]'
});


/* ---------------- Classi CSS iniettate ---------------- */

export const LIST_STYLE_ELEMENT_ID = "jsm-utils-list-styles";

const TEAM_CLASS_PREFIX    = "jsm-utils-team--";
const SUMMARY_CLASS_PREFIX = "jsm-utils-summary--";

export const teamClassName    = teamName => TEAM_CLASS_PREFIX + teamName;
export const summaryClassName = markerType => SUMMARY_CLASS_PREFIX + markerType;


/* ---------------- Marker nel summary ---------------- */

export const SUMMARY_MARKER_TYPES = Object.freeze(["warning", "error", "success"]);
export const SUMMARY_MARKER_REGEX = /\[(warning|error|success)\]/i;
