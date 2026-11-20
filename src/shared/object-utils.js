/* =====================================================
   Utilità generiche per oggetti
   ===================================================== */

export function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Congela ricorsivamente un oggetto (evita mutazioni accidentali). */
export function deepFreeze(object) {
    for (const value of Object.values(object)) {
        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
}

/**
 * Unisce in profondità `saved` sopra `defaults` e restituisce
 * SEMPRE un oggetto nuovo, senza riferimenti ai default.
 *
 * - chiavi solo nei default → aggiunte (retro-compatibilità);
 * - chiavi solo nel salvato → mantenute.
 */
export function mergeWithDefaults(defaults, saved) {

    const result = structuredClone(defaults);

    if (!isPlainObject(saved)) {
        return result;
    }

    for (const [key, value] of Object.entries(saved)) {
        result[key] =
            isPlainObject(value) && isPlainObject(defaults[key])
                ? mergeWithDefaults(defaults[key], value)
                : structuredClone(value);
    }

    return result;
}
