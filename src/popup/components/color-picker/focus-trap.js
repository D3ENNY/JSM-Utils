/* =====================================================
   Gestione tastiera del pannello
   -----------------------------------------------------
   Esc → onEscape(); Tab / Shift+Tab ciclano tra gli
   elementi focusabili senza uscire dal pannello.
   ===================================================== */

export function attachDialogKeyboard(container, focusableElements, onEscape) {

    container.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onEscape();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const first = focusableElements[0];
        const last  = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}
