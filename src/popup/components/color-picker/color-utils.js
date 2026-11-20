/* =====================================================
   Conversioni colore (funzioni pure)
   ===================================================== */

/*
 * Sfondo neutro reale usato da Jira: i colori con alpha
 * vengono mostrati sopra di esso per un'anteprima fedele.
 */
const JIRA_PREVIEW_BACKGROUND = "#1f1f21";

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Formati accettati: #RGB, #RGBA, #RRGGBB, #RRGGBBAA. */
export function isValidHexColor(value) {
    return HEX_COLOR_PATTERN.test(value);
}

export function clampByte(value) {
    return Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
}

export function clampRgba({ r, g, b, a }) {
    return { r: clampByte(r), g: clampByte(g), b: clampByte(b), a: clampByte(a) };
}

/** Hex (3/4/6/8 cifre) → {r,g,b,a}. Valori non validi → nero opaco. */
export function hexToRgba(hex) {

    let digits = String(hex || "").trim().replace(/^#/, "");

    if (digits.length === 3 || digits.length === 4) {
        digits = [...digits].map(char => char + char).join("");
    }

    if (digits.length === 6) {
        digits += "FF";
    }

    if (!/^[0-9a-f]{8}$/i.test(digits)) {
        digits = "000000FF";
    }

    return {
        r: parseInt(digits.slice(0, 2), 16),
        g: parseInt(digits.slice(2, 4), 16),
        b: parseInt(digits.slice(4, 6), 16),
        a: parseInt(digits.slice(6, 8), 16)
    };
}

/** {r,g,b,a} → "#RRGGBBAA" (maiuscolo). */
export function rgbaToHex({ r, g, b, a }) {
    const toHex = value => clampByte(value).toString(16).padStart(2, "0").toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

/** {r,g,b,a} → "rgba(r, g, b, alpha)". */
export function rgbaToCss({ r, g, b, a }) {
    return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
}

/** Sfondo CSS: colore (con alpha) sopra lo sfondo di Jira. */
export function buildPreviewBackground(rgba) {
    const cssColor = rgbaToCss(rgba);
    return `linear-gradient(${cssColor}, ${cssColor}), ${JIRA_PREVIEW_BACKGROUND}`;
}
