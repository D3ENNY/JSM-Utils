/* =====================================================
   Utilità DOM / testo
   ===================================================== */

export function normalizeText(text) {
    return String(text || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

/** Testo "identificativo" di una cella: id colonna, test-id, aria-label. */
export function getCellDescriptor(cell) {
    return [
        cell.getAttribute("data-column-id"),
        cell.getAttribute("data-testid"),
        cell.getAttribute("aria-label")
    ]
        .join(" ")
        .toLowerCase();
}

/** Selettore CSS che corrisponde a una qualsiasi delle classi. */
export function toClassSelector(classNames) {
    return classNames.map(cls => `.${cls}`).join(",");
}
