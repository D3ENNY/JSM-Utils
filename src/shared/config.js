/* =====================================================
   Costruzione della configurazione effettiva
   ===================================================== */

import { DEFAULT_CONFIG } from "./default-config.js";
import { mergeWithDefaults } from "./object-utils.js";

/** Copia modificabile dei default. */
export function createDefaultConfig() {
    return structuredClone(DEFAULT_CONFIG);
}

/** Configurazione salvata (anche parziale o assente) + default. */
export function resolveConfig(storedConfig) {
    return mergeWithDefaults(DEFAULT_CONFIG, storedConfig);
}
