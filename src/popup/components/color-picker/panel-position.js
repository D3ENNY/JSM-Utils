/* =====================================================
   Posizionamento del pannello rispetto al trigger
   ===================================================== */

const PANEL_GAP       = 8;   // distanza tra trigger e pannello
const VIEWPORT_MARGIN = 8;   // margine minimo dai bordi della finestra

/**
 * Funzione pura. Preferisce l'apertura sotto il trigger,
 * allineata a destra; apre sopra se lì c'è più spazio.
 * In entrambi gli assi il limite destro/inferiore,
 * applicato per ultimo, ha la precedenza.
 */
export function computePanelPosition(anchorRect, panelSize, viewportSize) {

    const { width: panelWidth, height: panelHeight } = panelSize;
    const { width: viewportWidth, height: viewportHeight } = viewportSize;

    let left = Math.max(anchorRect.right - panelWidth, VIEWPORT_MARGIN);
    if (left + panelWidth > viewportWidth - VIEWPORT_MARGIN) {
        left = viewportWidth - panelWidth - VIEWPORT_MARGIN;
    }

    const spaceBelow = viewportHeight - anchorRect.bottom - PANEL_GAP;
    const spaceAbove = anchorRect.top - PANEL_GAP;

    const preferredTop =
        spaceBelow >= panelHeight || spaceBelow >= spaceAbove
            ? anchorRect.bottom + PANEL_GAP
            : anchorRect.top - panelHeight - PANEL_GAP;

    let top = Math.max(preferredTop, VIEWPORT_MARGIN);
    if (top + panelHeight > viewportHeight - VIEWPORT_MARGIN) {
        top = viewportHeight - panelHeight - VIEWPORT_MARGIN;
    }

    return { left: Math.round(left), top: Math.round(top) };
}

export function positionPanel(anchor, panel) {
    const { left, top } = computePanelPosition(
        anchor.getBoundingClientRect(),
        { width: panel.offsetWidth, height: panel.offsetHeight },
        { width: window.innerWidth, height: window.innerHeight }
    );
    panel.style.left = `${left}px`;
    panel.style.top  = `${top}px`;
}
