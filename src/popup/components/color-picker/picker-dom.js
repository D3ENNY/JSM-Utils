/* =====================================================
   Costruzione del DOM del color picker
   ===================================================== */

export const RGBA_CHANNELS = Object.freeze([
    { key: "r", shortLabel: "R", label: "Rosso" },
    { key: "g", shortLabel: "G", label: "Verde" },
    { key: "b", shortLabel: "B", label: "Blu" },
    { key: "a", shortLabel: "A", label: "Opacità (alfa)" }
]);

let idSequence = 0;

/** Id univoci per collegare etichette, dialog e messaggi. */
export function createPickerIds() {
    const id = ++idSequence;
    return {
        panel:    `color-panel-${id}`,
        title:    `color-panel-title-${id}`,
        hex:      `color-hex-${id}`,
        hexError: `color-hex-error-${id}`
    };
}

function createElement(tag, properties = {}, attributes = {}) {
    const element = Object.assign(document.createElement(tag), properties);
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }
    return element;
}

/** Pulsante che apre il pannello (mostra il campione colore). */
export function buildTrigger(ids) {

    const wrapper = createElement("div", { className: "custom-color-picker" });

    const trigger = createElement(
        "button",
        { type: "button", className: "color-preview" },
        { "aria-haspopup": "dialog", "aria-expanded": "false", "aria-controls": ids.panel }
    );

    const swatch = createElement("span", { className: "color-preview-swatch" }, { "aria-hidden": "true" });

    trigger.appendChild(swatch);
    wrapper.appendChild(trigger);

    return { wrapper, trigger, swatch };
}

function buildSliderRow(channel) {

    const row = createElement("div", { className: "color-slider-row" });

    const shortLabel = createElement(
        "span",
        { className: "color-slider-label", textContent: channel.shortLabel },
        { "aria-hidden": "true" }
    );

    const slider = createElement(
        "input",
        { type: "range", className: "color-slider", min: 0, max: 255, step: 1 },
        { "aria-label": channel.label }
    );

    row.append(shortLabel, slider);
    return { row, slider };
}

/** Pannello (dialog) con anteprima, campo HEX, slider RGBA e "Chiudi". */
export function buildPanel(ids, label) {

    const panel = createElement(
        "div",
        { id: ids.panel, className: "color-panel" },
        { role: "dialog", "aria-labelledby": ids.title }
    );

    const title = createElement("h2", {
        id: ids.title,
        className: "color-title",
        textContent: label ? `Colore: ${label}` : "Seleziona colore"
    });

    const largePreview = createElement("div", { className: "color-large-preview" }, { "aria-hidden": "true" });

    const hexLabel = createElement("label", {
        className: "color-hex-label",
        htmlFor: ids.hex,
        textContent: "HEX"
    });

    const hexInput = createElement(
        "input",
        {
            id: ids.hex,
            type: "text",
            className: "color-hex-input",
            maxLength: 9,
            spellcheck: false,
            autocomplete: "off"
        },
        { "aria-describedby": ids.hexError }
    );

    // Messaggio d'errore annunciato dagli screen reader (WCAG 3.3.1)
    const hexError = createElement(
        "p",
        { id: ids.hexError, className: "color-hex-error" },
        { "aria-live": "polite" }
    );

    panel.append(title, largePreview, hexLabel, hexInput, hexError);

    const sliders = {};
    for (const channel of RGBA_CHANNELS) {
        const { row, slider } = buildSliderRow(channel);
        panel.appendChild(row);
        sliders[channel.key] = slider;
    }

    const closeButton = createElement("button", {
        type: "button",
        className: "color-close-button",
        textContent: "Chiudi"
    });

    panel.appendChild(closeButton);

    return { panel, largePreview, hexInput, hexError, sliders, closeButton };
}
