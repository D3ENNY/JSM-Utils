/* =====================================================
   Raggruppamento degli stati nel popup
   -----------------------------------------------------
   id del contenitore in popup.html → stati mostrati,
   nell'ordine. Le chiavi devono esistere in
   DEFAULT_CONFIG.statusColors.
   ===================================================== */

export const STATUS_GROUPS = Object.freeze({
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
});
