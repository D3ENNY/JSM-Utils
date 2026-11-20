/* =====================================================
   Configurazione predefinita (unica fonte di verità)
   ===================================================== */

import { deepFreeze } from "./object-utils.js";

export const DEFAULT_CONFIG = deepFreeze({

    features: {
        statusColors: true,
        teamColors: true,
        summaryMarkers: true
    },

    statusColors: {
        // Arrivo
        "nuovo":           { bg: "#e8923a", border: "#c0731f", color: "#2b1700" },
        "riassegnato":     { bg: "#b65c02", border: "#8f4800", color: "#ffffff" },
        "in carico":       { bg: "#e0b020", border: "#b88f10", color: "#2b2100" },
        "in approvazione": { bg: "#c2417a", border: "#9a3260", color: "#ffffff" },

        // HD1
        "sospeso - in attesa terze parti hd1": { bg: "#12356b", border: "#0b2447", color: "#ffffff" },
        "in lavorazione hd1":                  { bg: "#1d5fbf", border: "#154a96", color: "#ffffff" },
        "in attesa del cliente hd1":           { bg: "#5a98e6", border: "#3d7ccb", color: "#0b2447" },
        "in risoluzione hd1":                  { bg: "#a9ccf7", border: "#86b0e3", color: "#0b2447" },

        // HD2
        "sospeso - in attesa di terze parti hd2": { bg: "#0a4a54", border: "#063640", color: "#ffffff" },
        "assegnazione a hd2":                     { bg: "#0f6572", border: "#0a4e59", color: "#ffffff" },
        "in lavorazione hd2":                     { bg: "#138a9b", border: "#0e6e7c", color: "#ffffff" },
        "in attesa del cliente hd2":              { bg: "#4db8c6", border: "#2f9aa8", color: "#05313a" },
        "in risoluzione hd2":                     { bg: "#9adfe8", border: "#78c8d3", color: "#05313a" },

        // Pianificazione
        "pianificato": { bg: "#8f3fb8", border: "#722f94", color: "#ffffff" },
        "onsite":      { bg: "#b98be3", border: "#9a67c8", color: "#2a0f40" },

        // Chiusi
        "rifiutato":      { bg: "#373b41", border: "#5a5f68", color: "#ffffff" },
        "chiuso":         { bg: "#50565f", border: "#3a3f46", color: "#ffffff" },
        "risolto onsite": { bg: "#6b727d", border: "#535962", color: "#ffffff" }
    },

    // IMPORTANTE: si mantengono gli 8 caratteri #RRGGBBAA
    // (l'alpha originale è parte del colore).
    teamColors: {
        "sistemistica":   "#74005511",
        "programmazione": "#13017511",
        "helpdesk":       "#36014011"
    },

    summaryMarkers: {
        warning: "#e8923a",
        error:   "#d32f2f",
        success: "#2e7d32"
    }
});
