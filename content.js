// =====================================================
// JSM-utils
// Content Script
// =====================================================


// =====================================================
// CONFIGURAZIONE DEFAULT
// =====================================================

const DEFAULT_CONFIG = {
  features: {
    statusColors: true,
    teamColors: true,
    summaryMarkers: true,
  },

  statusColors: {
    // Arrivo
    "nuovo": {
      bg: "#e8923a",
      border: "#c0731f",
      color: "#2b1700",
    },

    "riassegnato": {
      bg: "#b65c02",
      border: "#8f4800",
      color: "#ffffff",
    },

    "in carico": {
      bg: "#e0b020",
      border: "#b88f10",
      color: "#2b2100",
    },

    "in approvazione": {
      bg: "#c2417a",
      border: "#9a3260",
      color: "#ffffff",
    },

    // HD1
    "sospeso - in attesa terze parti hd1": {
      bg: "#12356b",
      border: "#0b2447",
      color: "#ffffff",
    },

    "in lavorazione hd1": {
      bg: "#1d5fbf",
      border: "#154a96",
      color: "#ffffff",
    },

    "in attesa del cliente hd1": {
      bg: "#5a98e6",
      border: "#3d7ccb",
      color: "#0b2447",
    },

    "in risoluzione hd1": {
      bg: "#a9ccf7",
      border: "#86b0e3",
      color: "#0b2447",
    },

    // HD2
    "sospeso - in attesa di terze parti hd2": {
      bg: "#0a4a54",
      border: "#063640",
      color: "#ffffff",
    },

    "assegnazione a hd2": {
      bg: "#0f6572",
      border: "#0a4e59",
      color: "#ffffff",
    },

    "in lavorazione hd2": {
      bg: "#138a9b",
      border: "#0e6e7c",
      color: "#ffffff",
    },

    "in attesa del cliente hd2": {
      bg: "#4db8c6",
      border: "#2f9aa8",
      color: "#05313a",
    },

    "in risoluzione hd2": {
      bg: "#9adfe8",
      border: "#78c8d3",
      color: "#05313a",
    },

    // Pianificazione
    "pianificato": {
      bg: "#8f3fb8",
      border: "#722f94",
      color: "#ffffff",
    },

    "onsite": {
      bg: "#b98be3",
      border: "#9a67c8",
      color: "#2a0f40",
    },

    // Chiusi
    "rifiutato": {
      bg: "#373b41",
      border: "#5a5f68",
      color: "#ffffff",
    },

    "chiuso": {
      bg: "#50565f",
      border: "#3a3f46",
      color: "#ffffff",
    },

    "risolto onsite": {
      bg: "#6b727d",
      border: "#535962",
      color: "#ffffff",
    },
  },

  // IMPORTANTISSIMO:
  // manteniamo gli alpha originali.
  teamColors: {
    "sistemistica": "#74005511",
    "programmazione": "#13017511",
    "helpdesk": "#36014011",
  },

  summaryMarkers: {
    warning: "#e8923a",
    error: "#d32f2f",
    success: "#2e7d32",
  },
};


// =====================================================
// CONFIGURAZIONE CORRENTE
// =====================================================

let CONFIG = cloneConfig(DEFAULT_CONFIG);


// =====================================================
// UTILITÀ
// =====================================================

function cloneConfig(config) {
  return JSON.parse(JSON.stringify(config));
}


function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


// =====================================================
// MERGE CONFIGURAZIONE
// =====================================================

/*
 * Fa un merge profondo tra:
 *
 * DEFAULT_CONFIG
 * +
 * configurazione salvata
 *
 * In questo modo se in futuro aggiungiamo una nuova
 * impostazione, le vecchie configurazioni continuano
 * a funzionare.
 */

function mergeConfig(defaults, saved) {

  const result =
    Array.isArray(defaults)
      ? [...defaults]
      : { ...defaults };

  if (!saved || typeof saved !== "object") {
    return result;
  }

  for (const key of Object.keys(saved)) {

    const value = saved[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      defaults[key] &&
      typeof defaults[key] === "object" &&
      !Array.isArray(defaults[key])
    ) {

      result[key] =
        mergeConfig(
          defaults[key],
          value
        );

    } else {

      result[key] = value;
    }
  }

  return result;
}


// =====================================================
// LETTURA CONFIG
// =====================================================

async function loadConfig() {

  try {

    const stored =
      await chrome.storage.sync.get(
        "config"
      );

    CONFIG =
      mergeConfig(
        DEFAULT_CONFIG,
        stored.config
      );

    console.log(
      "[JSM-utils] Configurazione caricata:",
      CONFIG
    );

  } catch (error) {

    console.error(
      "[JSM-utils] Errore caricamento configurazione:",
      error
    );

    CONFIG =
      cloneConfig(
        DEFAULT_CONFIG
      );
  }
}


// =====================================================
// COLORI STATI
// =====================================================

const unknownLogged =
  new Set();


function colorStatusButtons() {

  /*
   * Se la funzione è disabilitata,
   * rimuoviamo i nostri stili inline.
   */

  const buttons =
    document.querySelectorAll(
      'button[type="button"]'
    );


  buttons.forEach(btn => {

    /*
     * Solo i bottoni che hanno la freccia SVG,
     * come nel content.js originale.
     */

    if (!btn.querySelector("svg")) {
      return;
    }


    const raw =
      btn.textContent.trim();

    const key =
      normalize(raw);

    const style =
      CONFIG.statusColors[key];


    /*
     * Se i colori stato sono disabilitati,
     * oppure lo stato non è presente nella mappa,
     * rimuoviamo eventuali modifiche precedenti.
     */

    if (
      !CONFIG.features.statusColors ||
      !style
    ) {

      btn.style.removeProperty(
        "background-color"
      );

      btn.style.removeProperty(
        "border-color"
      );

      btn.style.removeProperty(
        "color"
      );


      const textEl =
        btn.querySelector(
          "span span"
        );

      if (textEl) {

        textEl.style.removeProperty(
          "color"
        );
      }


      return;
    }


    /*
     * Log degli stati sconosciuti.
     */

    if (
      !style &&
      raw &&
      !unknownLogged.has(raw)
    ) {

      unknownLogged.add(raw);

      console.log(
        "[JSM-utils] Stato non in mappa:",
        raw
      );
    }


    /*
     * Applica i colori configurati
     * dalla GUI.
     */

    btn.style.setProperty(
      "background-color",
      style.bg,
      "important"
    );

    btn.style.setProperty(
      "border-color",
      style.border,
      "important"
    );

    btn.style.setProperty(
      "color",
      style.color,
      "important"
    );


    const textEl =
      btn.querySelector(
        "span span"
      );

    if (textEl) {

      textEl.style.setProperty(
        "color",
        style.color,
        "important"
      );
    }
  });
}


// =====================================================
// COLORI TEAM + SUMMARY MARKERS
// =====================================================

function getTeamDefinitions() {

  return Object.entries(
    CONFIG.teamColors
  ).map(([name, bg]) => ({
    name,
    match: name,
    bg,
  }));
}


// =====================================================
// AGGIUNTA STILI LISTA
// =====================================================

function addListStyles() {

  let style =
    document.getElementById(
      "jsm-utils-list-styles"
    );


  /*
   * Se nessuna delle due funzioni è attiva,
   * eliminiamo completamente il nostro <style>.
   */

  if (
    !CONFIG.features.teamColors &&
    !CONFIG.features.summaryMarkers
  ) {

    if (style) {
      style.remove();
    }

    return;
  }


  /*
   * Creiamo lo style se non esiste.
   */

  if (!style) {

    style =
      document.createElement(
        "style"
      );

    style.id =
      "jsm-utils-list-styles";

    document.head.appendChild(
      style
    );
  }


  let css = "";


  // ---------------------------------------------------
  // TEAM COLORS
  // ---------------------------------------------------

  if (
    CONFIG.features.teamColors
  ) {

    const teamStyles =
      getTeamDefinitions()
        .map(team => {

          return `
            .jsm-utils-team--${team.name} {
              background-color: ${team.bg} !important;
            }
          `;
        })
        .join("\n");

    css += teamStyles;
  }


  // ---------------------------------------------------
  // SUMMARY MARKERS
  // ---------------------------------------------------

  if (
    CONFIG.features.summaryMarkers
  ) {

    const markers =
      CONFIG.summaryMarkers;


    if (markers.warning) {

      css += `
        .jsm-utils-summary--warning {
          text-decoration: underline !important;
          text-decoration-color: ${markers.warning} !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 2px !important;
        }
      `;
    }


    if (markers.error) {

      css += `
        .jsm-utils-summary--error {
          text-decoration: underline !important;
          text-decoration-color: ${markers.error} !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 2px !important;
        }
      `;
    }


    if (markers.success) {

      css += `
        .jsm-utils-summary--success {
          text-decoration: underline !important;
          text-decoration-color: ${markers.success} !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 2px !important;
        }
      `;
    }
  }


  style.textContent =
    css;
}


// =====================================================
// TROVA TEAM DELLA RIGA
// =====================================================

function getTeamForRow(cells) {

  const teams =
    getTeamDefinitions();


  /*
   * Prima cerchiamo una vera colonna team/squad.
   */

  const teamColumnCells =
    cells.filter(cell => {

      const column = [
        cell.getAttribute(
          "data-column-id"
        ),

        cell.getAttribute(
          "data-testid"
        ),

        cell.getAttribute(
          "aria-label"
        ),
      ]
        .join(" ")
        .toLowerCase();


      return (
        column.includes("team") ||
        column.includes("squad")
      );
    });


  /*
   * Individuiamo le celle summary,
   * così da non confondere il testo del ticket
   * con il nome del team.
   */

  const summaryCells =
    cells.filter(cell => {

      const column = [
        cell.getAttribute(
          "data-column-id"
        ),

        cell.getAttribute(
          "data-testid"
        ),

        cell.getAttribute(
          "aria-label"
        ),
      ]
        .join(" ")
        .toLowerCase();


      return (
        column.includes("summary") ||
        cell.querySelector(
          'a[href*="/browse/"]'
        )
      );
    });


  /*
   * Se abbiamo trovato una colonna team,
   * usiamo esclusivamente quella.
   *
   * Altrimenti manteniamo il comportamento
   * del vecchio content.js.
   */

  const candidates =
    teamColumnCells.length
      ? teamColumnCells
      : cells.filter(
          cell =>
            !summaryCells.includes(
              cell
            )
        );


  return (
    teams.find(team =>
      candidates.some(cell =>
        normalize(
          cell.textContent
        ).includes(
          normalize(
            team.match
          )
        )
      )
    ) ||
    null
  );
}


// =====================================================
// COLORA RIGHE ISSUE
// =====================================================

function colorIssueRows() {

  const rows =
    document.querySelectorAll(
      'tr, [role="row"]'
    );


  const teamClasses =
    Object.keys(
      CONFIG.teamColors
    )
      .map(
        team =>
          `jsm-utils-team--${team}`
      );


  const summaryClasses = [
    "jsm-utils-summary--warning",
    "jsm-utils-summary--error",
    "jsm-utils-summary--success",
  ];


  rows.forEach(row => {

    /*
     * -------------------------------------------------
     * CELLS
     * -------------------------------------------------
     */

    const cells =
      Array.from(
        row.querySelectorAll(
          `
          td,
          [role="cell"],
          [role="gridcell"],
          [data-testid*="cell"]
          `
        )
      );


    /*
     * -------------------------------------------------
     * RIMOZIONE CLASSI TEAM PRECEDENTI
     * -------------------------------------------------
     */

    const previousTeamElements = [
      row,
      ...cells,
    ];


    if (teamClasses.length) {

      previousTeamElements.forEach(
        element => {

          element.classList.remove(
            ...teamClasses
          );
        }
      );


      row.querySelectorAll(
        teamClasses
          .map(
            cls =>
              `.${cls}`
          )
          .join(",")
      ).forEach(element => {

        element.classList.remove(
          ...teamClasses
        );
      });
    }


    /*
     * -------------------------------------------------
     * TEAM
     * -------------------------------------------------
     */

    if (
      CONFIG.features.teamColors
    ) {

      const team =
        getTeamForRow(
          cells
        );


      if (team) {

        const className =
          `jsm-utils-team--${team.name}`;


        [
          row,
          ...cells,
        ].forEach(element => {

          element.classList.add(
            className
          );
        });
      }
    }


    /*
     * -------------------------------------------------
     * RIMOZIONE SUMMARY PRECEDENTI
     * -------------------------------------------------
     */

    row.querySelectorAll(
      summaryClasses
        .map(
          cls =>
            `.${cls}`
        )
        .join(",")
    ).forEach(element => {

      element.classList.remove(
        ...summaryClasses
      );
    });


    /*
     * -------------------------------------------------
     * SUMMARY MARKERS
     * -------------------------------------------------
     */

    if (
      !CONFIG.features.summaryMarkers
    ) {
      return;
    }


    const summaryCandidates =
      Array.from(
        row.querySelectorAll(
          `
          [data-column-id*="summary"],
          [data-testid*="summary"],
          [aria-label*="summary"],
          a[href*="/browse/"]
          `
        )
      );


    const markedSummary =
      summaryCandidates.find(
        element =>
          /\[(warning|error|success)\]/i.test(
            element.textContent
          )
      ) ||
      cells.find(cell =>
        !cell.querySelector(
          `
          [data-column-id*="team"],
          [data-testid*="team"]
          `
        ) &&
        /\[(warning|error|success)\]/i.test(
          cell.textContent
        )
      );


    if (markedSummary) {

      const marker =
        markedSummary.textContent.match(
          /\[(warning|error|success)\]/i
        );


      if (marker) {

        markedSummary.classList.add(
          `jsm-utils-summary--${marker[1].toLowerCase()}`
        );
      }
    }
  });
}


// =====================================================
// APPLICA TUTTE LE REGOLE
// =====================================================

function applyAll() {

  colorStatusButtons();

  addListStyles();

  colorIssueRows();
}


// =====================================================
// STORAGE CHANGE LISTENER
// =====================================================

/*
 * Questo è il collegamento vero e proprio
 * tra popup.js e content.js.
 *
 * Quando il popup salva:
 *
 * chrome.storage.sync.set({ config: ... })
 *
 * questo listener viene chiamato automaticamente
 * anche nella pagina Jira già aperta.
 */

chrome.storage.onChanged.addListener(
  async (changes, areaName) => {

    if (
      areaName !== "sync" ||
      !changes.config
    ) {
      return;
    }


    const newConfig =
      changes.config.newValue;


    CONFIG =
      mergeConfig(
        DEFAULT_CONFIG,
        newConfig
      );


    console.log(
      "[JSM-utils] Configurazione aggiornata:",
      CONFIG
    );


    /*
     * Applichiamo immediatamente
     * la nuova configurazione.
     */

    applyAll();
  }
);


// =====================================================
// MUTATION OBSERVER
// =====================================================

let scheduled =
  false;


const observer =
  new MutationObserver(() => {

    if (scheduled) {
      return;
    }


    scheduled =
      true;


    setTimeout(() => {

      scheduled =
        false;

      applyAll();

    }, 200);
  });


function startObserver() {

  if (!document.body) {
    return;
  }


  observer.observe(
    document.body,
    {
      childList: true,
      characterData: true,
      subtree: true,
    }
  );
}


// =====================================================
// AVVIO
// =====================================================

(async function init() {

  await loadConfig();

  applyAll();

  startObserver();

})();