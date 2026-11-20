/* =====================================================
   Registro del picker aperto
   -----------------------------------------------------
   Un solo picker può essere aperto alla volta. Un unico
   set di listener globali (click esterno, resize, scroll)
   inoltra gli eventi al picker attivo, invece di
   aggiungerne 3 per ogni picker creato.
   ===================================================== */

let activePicker = null;
let globalListenersInstalled = false;

function installGlobalListeners() {

    if (globalListenersInstalled) {
        return;
    }
    globalListenersInstalled = true;

    document.addEventListener("click", event => activePicker?.handleOutsideClick(event));
    window.addEventListener("resize", () => activePicker?.reposition());

    // capture: intercetta anche lo scroll dei contenitori interni
    window.addEventListener("scroll", () => activePicker?.reposition(), true);
}

/** Registra `picker` come attivo, chiudendo l'eventuale precedente. */
export function setActivePicker(picker) {
    installGlobalListeners();
    if (activePicker && activePicker !== picker) {
        activePicker.close({ restoreFocus: false });
    }
    activePicker = picker;
}

export function releaseActivePicker(picker) {
    if (activePicker === picker) {
        activePicker = null;
    }
}

export function closeActiveColorPicker() {
    activePicker?.close({ restoreFocus: false });
}
