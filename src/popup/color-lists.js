/* =====================================================
   Liste "Colori stati" e "Colori team"
   ===================================================== */

import { closeActiveColorPicker, createColorPicker } from "./components/color-picker/color-picker.js";
import { configStore } from "./config-store.js";
import { STATUS_GROUPS } from "./status-groups.js";
import { capitalize, formatStatusLabel } from "./text-format.js";

const TEAM_LIST_ID = "team-color-list";

function createColorRow({ label, color, onColorChange }) {

    const row = document.createElement("div");
    row.className = "color-row";
    row.setAttribute("role", "listitem");

    const name = document.createElement("span");
    name.className = "color-name";
    name.textContent = label;

    row.append(name, createColorPicker(color, onColorChange, { label }));
    return row;
}

function renderStatusColors() {

    const { statusColors } = configStore.current;

    for (const [containerId, statuses] of Object.entries(STATUS_GROUPS)) {

        const container = document.getElementById(containerId);

        if (!container) {
            continue;
        }

        const rows = statuses
            .filter(status => statusColors[status])
            .map(status => createColorRow({
                label: formatStatusLabel(status),
                color: statusColors[status].bg,
                onColorChange: newColor => {
                    configStore.current.statusColors[status].bg = newColor;
                    configStore.scheduleSave();
                }
            }));

        container.replaceChildren(...rows);
    }
}

function renderTeamColors() {

    const container = document.getElementById(TEAM_LIST_ID);

    if (!container) {
        console.error("JSM-utils: contenitore colori team non trovato.");
        return;
    }

    // Il picker restituisce sempre #RRGGBBAA: l'alpha è già incluso.
    const rows = Object.entries(configStore.current.teamColors)
        .map(([team, color]) => createColorRow({
            label: capitalize(team),
            color,
            onColorChange: newColor => {
                configStore.current.teamColors[team] = newColor;
                configStore.scheduleSave();
            }
        }));

    container.replaceChildren(...rows);
}

/** (Ri)disegna tutte le liste colore dalla configurazione corrente. */
export function renderColorLists() {
    closeActiveColorPicker();
    renderStatusColors();
    renderTeamColors();
}
