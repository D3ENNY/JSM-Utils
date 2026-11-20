// ===== Palette =====
const C = {
  // Arrivo / presa in carico
  orange:     { bg: '#b65c02', border: '#8f4800', color: '#ffffff' },
  orangeLite: { bg: '#e8923a', border: '#c0731f', color: '#2b1700' },
  gold:       { bg: '#e0b020', border: '#b88f10', color: '#2b2100' },
  pink:       { bg: '#c2417a', border: '#9a3260', color: '#ffffff' },

  // HD1 (blu): dal più scuro al più chiaro
  hd1Susp:    { bg: '#12356b', border: '#0b2447', color: '#ffffff' },
  hd1Work:    { bg: '#1d5fbf', border: '#154a96', color: '#ffffff' },
  hd1Wait:    { bg: '#5a98e6', border: '#3d7ccb', color: '#0b2447' },
  hd1Resol:   { bg: '#a9ccf7', border: '#86b0e3', color: '#0b2447' },

  // HD2 (teal): dal più scuro al più chiaro
  hd2Susp:    { bg: '#0a4a54', border: '#063640', color: '#ffffff' },
  hd2Assign:  { bg: '#0f6572', border: '#0a4e59', color: '#ffffff' },
  hd2Work:    { bg: '#138a9b', border: '#0e6e7c', color: '#ffffff' },
  hd2Wait:    { bg: '#4db8c6', border: '#2f9aa8', color: '#05313a' },
  hd2Resol:   { bg: '#9adfe8', border: '#78c8d3', color: '#05313a' },

  // Pianificazione (viola)
  purple:     { bg: '#8f3fb8', border: '#722f94', color: '#ffffff' },
  purpleLite: { bg: '#b98be3', border: '#9a67c8', color: '#2a0f40' },

  // Chiusi (scala di grigi)
  greyDark:   { bg: '#373b41', border: '#5a5f68', color: '#ffffff' },
  greyMid:    { bg: '#50565f', border: '#3a3f46', color: '#ffffff' },
  greyLight:  { bg: '#6b727d', border: '#535962', color: '#ffffff' },
};

// ===== Mappa stato =====
const STATUS_COLORS = {
  // Arrivo
  'nuovo':                                   C.orangeLite,
  'riassegnato':                             C.orange,
  'in carico':                               C.gold,
  'in approvazione':                         C.pink,

  // HD1
  'sospeso - in attesa terze parti hd1':     C.hd1Susp,
  'in lavorazione hd1':                      C.hd1Work,
  'in attesa del cliente hd1':               C.hd1Wait,
  'in risoluzione hd1':                      C.hd1Resol,

  // HD2
  'sospeso - in attesa di terze parti hd2':  C.hd2Susp,
  'assegnazione a hd2':                      C.hd2Assign,
  'in lavorazione hd2':                      C.hd2Work,
  'in attesa del cliente hd2':               C.hd2Wait,
  'in risoluzione hd2':                      C.hd2Resol,

  // Pianificazione
  'pianificato':                             C.purple,
  'onsite':                                  C.purpleLite,

  // Chiusi
  'rifiutato':                               C.greyDark,
  'chiuso':                                  C.greyMid,
  'risolto onsite':                          C.greyLight,
};

function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

const unknownLogged = new Set();


function colorStatusButtons() {
  const buttons = document.querySelectorAll('button[type="button"]');

  buttons.forEach(btn => {
    // Solo i bottoni con la freccina 
    if (!btn.querySelector('svg')) return;

    const raw = btn.textContent.trim();
    const style = STATUS_COLORS[normalize(raw)];

    if (!style) {
      if (raw && !unknownLogged.has(raw)) {
        unknownLogged.add(raw);
        console.log('[JSM-utils] Stato non in mappa:', raw);
      }
      return;
    }

    btn.style.setProperty('background-color', style.bg, 'important');
    btn.style.setProperty('border-color', style.border, 'important');
    btn.style.setProperty('color', style.color, 'important');

    const textEl = btn.querySelector('span span');
    if (textEl) textEl.style.setProperty('color', style.color, 'important');
  });
}

// ===== Colori team e riepiloghi =====
const TEAM_COLORS = [
  { name: 'sistemistica', match: 'sistemistica', bg: '#74005511' },
  { name: 'programmazione', match: 'programmazione', bg: '#13017511' },
  { name: 'helpdesk', match: 'helpdesk', bg: '#36014011' },
];

const SUMMARY_MARKERS = {
  warning: '#e8923a',
  error: '#d32f2f',
  success: '#2e7d32',
};

function addListStyles() {
  if (document.getElementById('jsm-utils-list-styles')) return;

  const style = document.createElement('style');
  style.id = 'jsm-utils-list-styles';
  const teamStyles = TEAM_COLORS.map(team =>
    `.jsm-utils-team--${team.name} { background-color: ${team.bg} !important; }`
  ).join('\n');
  style.textContent = `
    ${teamStyles}
    .jsm-utils-summary--warning {
      text-decoration: underline !important;
      text-decoration-color: ${SUMMARY_MARKERS.warning} !important;
      text-decoration-thickness: 2px !important;
      text-underline-offset: 2px !important;
    }
    .jsm-utils-summary--error {
      text-decoration: underline !important;
      text-decoration-color: ${SUMMARY_MARKERS.error} !important;
      text-decoration-thickness: 2px !important;
      text-underline-offset: 2px !important;
    }
    .jsm-utils-summary--success {
      text-decoration: underline !important;
      text-decoration-color: ${SUMMARY_MARKERS.success} !important;
      text-decoration-thickness: 2px !important;
      text-underline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);
}

function getTeamForRow(cells) {
  const teamColumnCells = cells.filter(cell => {
    const column = [
      cell.getAttribute('data-column-id'),
      cell.getAttribute('data-testid'),
      cell.getAttribute('aria-label'),
    ].join(' ').toLowerCase();
    return column.includes('team') || column.includes('squad');
  });
  const summaryCells = cells.filter(cell => {
    const column = [
      cell.getAttribute('data-column-id'),
      cell.getAttribute('data-testid'),
      cell.getAttribute('aria-label'),
    ].join(' ').toLowerCase();
    return column.includes('summary') || cell.querySelector('a[href*="/browse/"]');
  });
  const candidates = teamColumnCells.length
    ? teamColumnCells
    : cells.filter(cell => !summaryCells.includes(cell));

  return TEAM_COLORS.find(team =>
    candidates.some(cell => normalize(cell.textContent).includes(team.match))
  ) || null;
}

function colorIssueRows() {
  const rows = document.querySelectorAll('tr, [role="row"]');
  const teamClasses = TEAM_COLORS.map(team => `jsm-utils-team--${team.name}`);
  const summaryClasses = Object.keys(SUMMARY_MARKERS)
    .map(marker => `jsm-utils-summary--${marker}`);

  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td, [role="cell"], [role="gridcell"], [data-testid*="cell"]'));
    const previousTeamElements = [row, ...cells];
    previousTeamElements.forEach(element => element.classList.remove(...teamClasses));
    row.querySelectorAll(`.${teamClasses.join(',.')}`).forEach(element => {
      element.classList.remove(...teamClasses);
    });

    const team = getTeamForRow(cells);
    if (team) {
      [row, ...cells].forEach(element => {
        element.classList.add(`jsm-utils-team--${team.name}`);
      });
    }

    row.querySelectorAll(`.${summaryClasses.join(',.')}`).forEach(element => {
      element.classList.remove(...summaryClasses);
    });

    const summaryCandidates = Array.from(row.querySelectorAll(
      '[data-column-id*="summary"], [data-testid*="summary"], [aria-label*="summary"], a[href*="/browse/"]'
    ));
    const markedSummary = summaryCandidates.find(element =>
      /\[(warning|error|success)\]/i.test(element.textContent)
    ) || cells.find(cell =>
      !cell.querySelector('[data-column-id*="team"], [data-testid*="team"]') &&
      /\[(warning|error|success)\]/i.test(cell.textContent)
    );

    if (markedSummary) {
      const marker = markedSummary.textContent.match(/\[(warning|error|success)\]/i);
      if (marker) markedSummary.classList.add(`jsm-utils-summary--${marker[1].toLowerCase()}`);
    }
  });
}

// ===== Elenco delle regole =====
const rules = [colorStatusButtons, addListStyles, colorIssueRows];

function applyAll() {
  rules.forEach(rule => rule());
}

// ===== Observer (max 1 esecuzione ogni 200 ms) =====
let scheduled = false;
const observer = new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => {
    scheduled = false;
    applyAll();
  }, 200);
});

observer.observe(document.body, { childList: true, characterData: true, subtree: true });

applyAll();