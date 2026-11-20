/* =====================================================
   Pulsante "Ripristina impostazioni"
   ===================================================== */

import { configStore } from "./config-store.js";

const RESET_BUTTON_ID = "reset";
const CONFIRM_MESSAGE = "Ripristinare tutte le impostazioni predefinite?";

/** onReset viene chiamata dopo il salvataggio dei default. */
export function bindResetButton(onReset) {

    const resetButton = document.getElementById(RESET_BUTTON_ID);

    if (!resetButton) {
        return;
    }

    resetButton.addEventListener("click", async () => {

        if (!confirm(CONFIRM_MESSAGE)) {
            return;
        }

        await configStore.reset();
        onReset();
    });
}
