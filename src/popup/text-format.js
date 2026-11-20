/* =====================================================
   Formattazione delle etichette
   ===================================================== */

/** "in lavorazione hd1" → "In Lavorazione HD1" */
export function formatStatusLabel(status) {
    return status
        .replace(/\bhd([12])\b/gi, "HD$1")
        .replace(/\b\w/g, char => char.toUpperCase());
}

/** "helpdesk" → "Helpdesk" */
export function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
