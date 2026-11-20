/* =====================================================
   JSM-utils — Custom Color Picker (RGBA)
   -----------------------------------------------------
   createColorPicker(initialColor, onChange, { label })
     → HTMLElement da inserire nel DOM.

   onChange(hex) riceve sempre "#RRGGBBAA".
   label è il nome accessibile (es. "Nuovo").
   ===================================================== */

import {
    buildPreviewBackground,
    clampRgba,
    hexToRgba,
    isValidHexColor,
    rgbaToHex
} from "./color-utils.js";
import { positionPanel } from "./panel-position.js";
import { buildPanel, buildTrigger, createPickerIds, RGBA_CHANNELS } from "./picker-dom.js";
import { releaseActivePicker, setActivePicker } from "./picker-registry.js";
import { attachDialogKeyboard } from "./focus-trap.js";

export { closeActiveColorPicker } from "./picker-registry.js";

const INVALID_HEX_MESSAGE = "Formato non valido. Usa #RGB, #RGBA, #RRGGBB o #RRGGBBAA.";


export function createColorPicker(initialColor, onChange, { label = "" } = {}) {

    const ids = createPickerIds();
    const { wrapper, trigger, swatch } = buildTrigger(ids);
    const { panel, largePreview, hexInput, hexError, sliders, closeButton } = buildPanel(ids, label);

    let currentColor = hexToRgba(initialColor);
    let isOpen = false;


    /* ---------------- Rendering ---------------- */

    function render() {

        const hex = rgbaToHex(currentColor);
        const background = buildPreviewBackground(currentColor);

        swatch.style.background = background;
        largePreview.style.background = background;
        hexInput.value = hex;

        for (const { key } of RGBA_CHANNELS) {
            sliders[key].value = currentColor[key];
        }

        trigger.setAttribute(
            "aria-label",
            label ? `Modifica colore ${label}, attuale ${hex}` : `Modifica colore, attuale ${hex}`
        );
    }

    function setHexError(message) {
        hexError.textContent = message;
        hexInput.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function applyColor(rgba, { notify = true } = {}) {
        currentColor = clampRgba(rgba);
        render();
        if (notify && typeof onChange === "function") {
            onChange(rgbaToHex(currentColor));
        }
    }


    /* ---------------- Apertura / chiusura ---------------- */

    function open() {

        if (isOpen) {
            return;
        }

        setActivePicker(api);

        /*
         * Il pannello viene montato direttamente nel <body>,
         * così non è limitato da overflow / stacking context
         * di .color-row, .collapsible, .card, ecc.
         */
        document.body.appendChild(panel);
        panel.classList.add("open");
        wrapper.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        isOpen = true;

        // Attende il layout per misurare il pannello.
        requestAnimationFrame(() => {
            positionPanel(wrapper, panel);
            hexInput.focus({ preventScroll: true });
        });
    }

    function close({ restoreFocus = true } = {}) {

        if (!isOpen) {
            return;
        }

        panel.classList.remove("open");
        wrapper.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        setHexError("");
        panel.remove();
        isOpen = false;

        releaseActivePicker(api);

        if (restoreFocus) {
            trigger.focus();
        }
    }

    const toggle = () => (isOpen ? close() : open());


    /* ---------------- Eventi ---------------- */

    for (const { key } of RGBA_CHANNELS) {
        sliders[key].addEventListener("input", () => {
            applyColor({ ...currentColor, [key]: Number(sliders[key].value) });
        });
    }

    hexInput.addEventListener("change", () => {

        const raw = hexInput.value.trim();
        const value = raw.startsWith("#") ? raw : `#${raw}`;

        if (isValidHexColor(value)) {
            setHexError("");
            applyColor(hexToRgba(value));
        } else {
            // Input non valido: si ripristina il valore precedente
            setHexError(INVALID_HEX_MESSAGE);
            render();
        }
    });

    trigger.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    });

    closeButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        close();
    });

    panel.addEventListener("click", event => event.stopPropagation());

    attachDialogKeyboard(
        panel,
        [hexInput, ...Object.values(sliders), closeButton],
        () => close()
    );


    /* ---------------- API (usata dal registro) ---------------- */

    const api = {
        element: wrapper,

        getColor: () => rgbaToHex(currentColor),
        setColor: color => applyColor(hexToRgba(color), { notify: false }),

        open,
        close,
        toggle,

        reposition() {
            if (isOpen) {
                positionPanel(wrapper, panel);
            }
        },

        handleOutsideClick(event) {
            if (isOpen && !panel.contains(event.target) && !wrapper.contains(event.target)) {
                close({ restoreFocus: false });
            }
        }
    };

    render();

    return wrapper;
}
