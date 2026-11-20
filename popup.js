// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

const DEFAULT_CONFIG = {

    features: {
        statusColors: true,
        teamColors: true,
        summaryMarkers: true
    },


    // =================================================
    // COLORI STATI
    // =================================================

    statusColors: {

        // -------------------------
        // ARRIVO
        // -------------------------

        "nuovo": {
            bg: "#e8923a",
            border: "#c0731f",
            color: "#2b1700"
        },

        "riassegnato": {
            bg: "#b65c02",
            border: "#8f4800",
            color: "#ffffff"
        },

        "in carico": {
            bg: "#e0b020",
            border: "#b88f10",
            color: "#2b2100"
        },

        "in approvazione": {
            bg: "#c2417a",
            border: "#9a3260",
            color: "#ffffff"
        },


        // -------------------------
        // HD1
        // -------------------------

        "sospeso - in attesa terze parti hd1": {
            bg: "#12356b",
            border: "#0b2447",
            color: "#ffffff"
        },

        "in lavorazione hd1": {
            bg: "#1d5fbf",
            border: "#154a96",
            color: "#ffffff"
        },

        "in attesa del cliente hd1": {
            bg: "#5a98e6",
            border: "#3d7ccb",
            color: "#0b2447"
        },

        "in risoluzione hd1": {
            bg: "#a9ccf7",
            border: "#86b0e3",
            color: "#0b2447"
        },


        // -------------------------
        // HD2
        // -------------------------

        "sospeso - in attesa di terze parti hd2": {
            bg: "#0a4a54",
            border: "#063640",
            color: "#ffffff"
        },

        "assegnazione a hd2": {
            bg: "#0f6572",
            border: "#0a4e59",
            color: "#ffffff"
        },

        "in lavorazione hd2": {
            bg: "#138a9b",
            border: "#0e6e7c",
            color: "#ffffff"
        },

        "in attesa del cliente hd2": {
            bg: "#4db8c6",
            border: "#2f9aa8",
            color: "#05313a"
        },

        "in risoluzione hd2": {
            bg: "#9adfe8",
            border: "#78c8d3",
            color: "#05313a"
        },


        // -------------------------
        // PIANIFICAZIONE
        // -------------------------

        "pianificato": {
            bg: "#8f3fb8",
            border: "#722f94",
            color: "#ffffff"
        },

        "onsite": {
            bg: "#b98be3",
            border: "#9a67c8",
            color: "#2a0f40"
        },


        // -------------------------
        // CHIUSI
        // -------------------------

        "rifiutato": {
            bg: "#373b41",
            border: "#5a5f68",
            color: "#ffffff"
        },

        "chiuso": {
            bg: "#50565f",
            border: "#3a3f46",
            color: "#ffffff"
        },

        "risolto onsite": {
            bg: "#6b727d",
            border: "#535962",
            color: "#ffffff"
        }
    },


    // =================================================
    // COLORI TEAM
    // =================================================

    // IMPORTANTE:
    // manteniamo ESATTAMENTE gli 8 caratteri originali
    // #RRGGBBAA

    teamColors: {

        "sistemistica": "#74005511",
        "programmazione": "#13017511",
        "helpdesk": "#36014011"

    },


    // =================================================
    // SUMMARY MARKERS
    // =================================================

    summaryMarkers: {

        "warning": "#e8923a",
        "error": "#d32f2f",
        "success": "#2e7d32"

    }

};


// Configurazione attualmente caricata

let config = null;



// =====================================================
// STORAGE
// =====================================================

async function loadConfig() {

    if (
        !chrome.storage ||
        !chrome.storage.sync
    ) {

        console.error(
            "JSM-utils: chrome.storage.sync non disponibile."
        );

        config =
            structuredClone(DEFAULT_CONFIG);

        return;
    }


    const result =
        await chrome.storage.sync.get("config");


    // Prima apertura

    if (!result.config) {

        config =
            structuredClone(DEFAULT_CONFIG);

        await saveConfig();

        return;
    }


    // Merge dei valori salvati con i default.
    //
    // Serve per evitare che l'aggiunta futura di una
    // nuova funzione o di un nuovo stato rompa le
    // configurazioni già esistenti.

    config = {

        ...structuredClone(DEFAULT_CONFIG),

        ...result.config,


        features: {

            ...DEFAULT_CONFIG.features,

            ...(result.config.features || {})

        },


        statusColors: {

            ...DEFAULT_CONFIG.statusColors,

            ...(result.config.statusColors || {})

        },


        teamColors: {

            ...DEFAULT_CONFIG.teamColors,

            ...(result.config.teamColors || {})

        },


        summaryMarkers: {

            ...DEFAULT_CONFIG.summaryMarkers,

            ...(result.config.summaryMarkers || {})

        }

    };
}



async function saveConfig() {

    await chrome.storage.sync.set({
        config: config
    });

}



// =====================================================
// FUNZIONALITÀ
// =====================================================

function setupFeatureToggles() {

    const statusToggle =
        document.getElementById(
            "enableStatusColors"
        );

    const teamToggle =
        document.getElementById(
            "enableTeamColors"
        );

    const summaryToggle =
        document.getElementById(
            "enableSummaryMarkers"
        );


    // Sicurezza: evita errori se un elemento manca
    if (!statusToggle ||
        !teamToggle ||
        !summaryToggle) {

        console.error(
            "JSM-utils: uno o più toggle non sono presenti nell'HTML."
        );

        return;
    }


    // -----------------------------------------------
    // Stato iniziale
    // -----------------------------------------------

    statusToggle.checked =
        config.features.statusColors;

    teamToggle.checked =
        config.features.teamColors;

    summaryToggle.checked =
        config.features.summaryMarkers;



    // -----------------------------------------------
    // Colori stati
    // -----------------------------------------------

    statusToggle.addEventListener(
        "change",
        async () => {

            config.features.statusColors =
                statusToggle.checked;

            await saveConfig();

        }
    );



    // -----------------------------------------------
    // Colori team
    // -----------------------------------------------

    teamToggle.addEventListener(
        "change",
        async () => {

            config.features.teamColors =
                teamToggle.checked;

            await saveConfig();

        }
    );



    // -----------------------------------------------
    // Marker summary
    // -----------------------------------------------

    summaryToggle.addEventListener(
        "change",
        async () => {

            config.features.summaryMarkers =
                summaryToggle.checked;

            await saveConfig();

        }
    );
}



// =====================================================
// GRUPPI STATI
// =====================================================

const STATUS_GROUPS = {

    "status-arrivo": [

        "nuovo",
        "riassegnato",
        "in carico",
        "in approvazione"

    ],


    "status-hd1": [

        "sospeso - in attesa terze parti hd1",
        "in lavorazione hd1",
        "in attesa del cliente hd1",
        "in risoluzione hd1"

    ],


    "status-hd2": [

        "sospeso - in attesa di terze parti hd2",
        "assegnazione a hd2",
        "in lavorazione hd2",
        "in attesa del cliente hd2",
        "in risoluzione hd2"

    ],


    "status-pianificazione": [

        "pianificato",
        "onsite"

    ],


    "status-chiusi": [

        "rifiutato",
        "chiuso",
        "risolto onsite"

    ]

};



// =====================================================
// COLORI STATI
// =====================================================

function renderStatusColors() {

    for (const [containerId, statuses] of Object.entries(STATUS_GROUPS)) {

        const container = document.getElementById(containerId);

        if (!container) {
            continue;
        }

        container.innerHTML = "";

        for (const status of statuses) {

            const data = config.statusColors[status];

            if (!data) {
                continue;
            }

            // -----------------------------------------
            // Riga
            // -----------------------------------------

            const row = document.createElement("div");
            row.className = "color-row";


            // -----------------------------------------
            // Nome
            // -----------------------------------------

            const name = document.createElement("span");
            name.className = "color-name";
            name.textContent = prettifyStatus(status);


            // -----------------------------------------
            // Color picker
            // -----------------------------------------

            const picker = createColorPicker(
                data.bg,
                async newColor => {

                    config.statusColors[status].bg = newColor;

                    await saveConfig();
                }
            );


            // -----------------------------------------
            // DOM
            // -----------------------------------------

            row.appendChild(name);
            row.appendChild(picker);

            container.appendChild(row);
        }
    }
}



// =====================================================
// COLORI TEAM
// =====================================================

// =====================================================
// COLORI TEAM
// =====================================================

function renderTeamColors() {

    // Compatibilità con entrambi gli ID usati nell'HTML.
    // Se il tuo HTML attuale usa "teamColors", viene usato quello.
    // Se invece hai ancora "team-color-list", funziona comunque.
    const container =
        document.getElementById("teamColors") ||
        document.getElementById("team-color-list");

    if (!container) {
        console.error(
            "JSM-utils: contenitore colori team non trovato."
        );
        return;
    }

    container.innerHTML = "";

    for (const [team, color] of Object.entries(config.teamColors)) {

        // ---------------------------------------------
        // Riga
        // ---------------------------------------------

        const row =
            document.createElement("div");

        row.className = "color-row";


        // ---------------------------------------------
        // Nome team
        // ---------------------------------------------

        const name =
            document.createElement("span");

        name.className = "color-name";

        name.textContent =
            capitalize(team);


        // ---------------------------------------------
        // Custom color picker
        // ---------------------------------------------

        const picker =
            createColorPicker(
                color,
                async newColor => {

                    /*
                     * Il nuovo color picker restituisce sempre
                     * il colore completo in formato:
                     *
                     * #RRGGBBAA
                     *
                     * quindi NON dobbiamo più usare:
                     *
                     * toRGB()
                     * getAlpha()
                     *
                     * né ricostruire manualmente il colore.
                     */

                    config.teamColors[team] =
                        newColor;

                    await saveConfig();
                }
            );


        // ---------------------------------------------
        // DOM
        // ---------------------------------------------

        row.appendChild(name);
        row.appendChild(picker);

        container.appendChild(row);
    }
}



// =====================================================
// COLOR UTILITIES
// =====================================================

function toRGB(color) {

    if (
        typeof color !== "string"
    ) {

        return "#000000";

    }


    // #RRGGBBAA
    if (
        /^#[0-9a-fA-F]{8}$/.test(color)
    ) {

        return color.substring(
            0,
            7
        );

    }


    // #RRGGBB
    if (
        /^#[0-9a-fA-F]{6}$/.test(color)
    ) {

        return color;

    }


    return "#000000";
}



function getAlpha(color) {

    if (
        typeof color === "string" &&
        /^#[0-9a-fA-F]{8}$/.test(color)
    ) {

        return color.substring(7, 9);

    }


    // Default alpha se non presente

    return "FF";
}



// =====================================================
// TEXT UTILITIES
// =====================================================

function prettifyStatus(status) {

    return status

        .replace(
            /\bhd1\b/gi,
            "HD1"
        )

        .replace(
            /\bhd2\b/gi,
            "HD2"
        )

        .replace(
            /\b\w/g,
            char =>
                char.toUpperCase()
        );
}



function capitalize(text) {

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}



// =====================================================
// RESET
// =====================================================

function setupResetButton() {

    const resetButton =
        document.getElementById(
            "reset"
        );


    if (!resetButton) {
        return;
    }


    resetButton.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Ripristinare tutte le impostazioni predefinite?"
                );


            if (!confirmed) {
                return;
            }


            // Ricrea una copia completa
            // dei default originali.

            config =
                structuredClone(
                    DEFAULT_CONFIG
                );


            await saveConfig();


            // Ridisegna GUI

            setupFeatureToggles();

            renderStatusColors();

            renderTeamColors();

        }
    );

}



// =====================================================
// INIT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadConfig();

        setupFeatureToggles();

        renderStatusColors();

        renderTeamColors();

        setupResetButton();

    }
);