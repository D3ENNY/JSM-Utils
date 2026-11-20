/* =====================================================
   Messaggi di stato per gli screen reader (WCAG 4.1.3)
   ===================================================== */

const STATUS_MESSAGE_ID = "status-message";

export function announce(message) {

    const region = document.getElementById(STATUS_MESSAGE_ID);

    if (!region) {
        return;
    }

    // Svuota e riscrive per forzare l'annuncio anche se il testo è uguale.
    region.textContent = "";
    requestAnimationFrame(() => {
        region.textContent = message;
    });
}
