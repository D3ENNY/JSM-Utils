/* =====================================================
   JSM-utils - Custom Color Picker
   ===================================================== */


/* =====================================================
   CONFIG
   ===================================================== */

/*
 * Sfondo neutro reale utilizzato da Jira.
 *
 * I colori con alpha vengono visualizzati sopra questo
 * colore per rendere l'anteprima fedele a Jira.
 */
const JIRA_PREVIEW_BACKGROUND = "#1f1f21";


/* =====================================================
   COLOR UTILITIES
   ===================================================== */

/**
 * Converte:
 *
 *   #RGB
 *   #RGBA
 *   #RRGGBB
 *   #RRGGBBAA
 *
 * in RGBA.
 */
function hexToRgba(hex) {

    if (!hex) {
        return {
            r: 0,
            g: 0,
            b: 0,
            a: 255
        };
    }

    hex = String(hex)
        .trim()
        .replace(/^#/, "");

    /*
     * #RGB
     */
    if (hex.length === 3) {

        hex =
            hex[0] + hex[0] +
            hex[1] + hex[1] +
            hex[2] + hex[2];
    }

    /*
     * #RGBA
     */
    else if (hex.length === 4) {

        hex =
            hex[0] + hex[0] +
            hex[1] + hex[1] +
            hex[2] + hex[2] +
            hex[3] + hex[3];
    }

    /*
     * Se non è presente l'alpha,
     * assumiamo FF.
     */
    if (hex.length === 6) {
        hex += "FF";
    }

    /*
     * Valore non valido.
     */
    if (
        hex.length !== 8 ||
        !/^[0-9a-fA-F]{8}$/.test(hex)
    ) {

        hex = "000000FF";
    }

    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: parseInt(hex.substring(6, 8), 16)
    };
}


/**
 * Converte RGBA in #RRGGBBAA.
 */
function rgbaToHex(r, g, b, a) {

    const toHex = value => {

        return Math.max(
            0,
            Math.min(
                255,
                Math.round(Number(value))
            )
        )
        .toString(16)
        .padStart(2, "0")
        .toUpperCase();
    };

    return (
        "#" +
        toHex(r) +
        toHex(g) +
        toHex(b) +
        toHex(a)
    );
}


/**
 * Converte RGBA in rgba(...).
 */
function rgbaToCss(r, g, b, a) {

    return `rgba(
        ${r},
        ${g},
        ${b},
        ${(a / 255).toFixed(3)}
    )`;
}


/* =====================================================
   GLOBAL STATE
   ===================================================== */

let activeColorPicker = null;


/* =====================================================
   CLOSE ACTIVE PICKER
   ===================================================== */

function closeActiveColorPicker() {

    if (!activeColorPicker) {
        return;
    }

    activeColorPicker.close();

    activeColorPicker = null;
}


/* =====================================================
   POSITION PANEL
   ===================================================== */

function positionColorPanel(wrapper, panel) {

    const rect =
        wrapper.getBoundingClientRect();

    const panelWidth =
        panel.offsetWidth;

    const panelHeight =
        panel.offsetHeight;

    const viewportWidth =
        window.innerWidth;

    const viewportHeight =
        window.innerHeight;


    const GAP = 8;
    const MARGIN = 8;


    /* -------------------------------------------------
       ORIZZONTALE
       ------------------------------------------------- */

    let left =
        rect.right - panelWidth;


    if (left < MARGIN) {

        left = MARGIN;
    }


    if (
        left + panelWidth >
        viewportWidth - MARGIN
    ) {

        left =
            viewportWidth -
            panelWidth -
            MARGIN;
    }


    /* -------------------------------------------------
       VERTICALE
       ------------------------------------------------- */

    const spaceBelow =
        viewportHeight -
        rect.bottom -
        GAP;

    const spaceAbove =
        rect.top -
        GAP;


    let top;


    /*
     * Preferiamo aprire sotto.
     *
     * Se sotto non c'è abbastanza spazio
     * e sopra ce n'è di più, apriamo sopra.
     */

    if (
        spaceBelow >= panelHeight ||
        spaceBelow >= spaceAbove
    ) {

        top =
            rect.bottom +
            GAP;

    } else {

        top =
            rect.top -
            panelHeight -
            GAP;
    }


    /* -------------------------------------------------
       Clamp finale
       ------------------------------------------------- */

    if (top < MARGIN) {
        top = MARGIN;
    }


    if (
        top + panelHeight >
        viewportHeight - MARGIN
    ) {

        top =
            viewportHeight -
            panelHeight -
            MARGIN;
    }


    panel.style.left =
        `${Math.round(left)}px`;

    panel.style.top =
        `${Math.round(top)}px`;
}


/* =====================================================
   CREATE COLOR PICKER
   ===================================================== */

function createColorPicker(
    initialColor,
    onChange
) {

    let currentColor =
        hexToRgba(initialColor);


    let originalParent = null;
    let originalNextSibling = null;

    let isOpen = false;


    /* =================================================
       WRAPPER
       ================================================= */

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "custom-color-picker";


    /* =================================================
       PREVIEW BUTTON
       ================================================= */

    const preview =
        document.createElement("button");

    preview.type =
        "button";

    preview.className =
        "color-preview";


    /* =================================================
       SWATCH
       ================================================= */

    const swatch =
        document.createElement("span");

    swatch.className =
        "color-preview-swatch";


    /* =================================================
       COMPATIBILITY ELEMENTS
       ================================================= */

    /*
     * Restano presenti per compatibilità
     * con il CSS precedente.
     */

    const value =
        document.createElement("span");

    value.className =
        "color-preview-value";


    const arrow =
        document.createElement("span");

    arrow.className =
        "color-preview-arrow";

    arrow.textContent =
        "▼";


    preview.appendChild(swatch);
    preview.appendChild(value);
    preview.appendChild(arrow);

    wrapper.appendChild(preview);


    /* =================================================
       PANEL
       ================================================= */

    const panel =
        document.createElement("div");

    panel.className =
        "color-panel";


    /* =================================================
       TITLE
       ================================================= */

    const title =
        document.createElement("div");

    title.className =
        "color-title";

    title.textContent =
        "Seleziona colore";

    panel.appendChild(title);


    /* =================================================
       LARGE PREVIEW
       ================================================= */

    const largePreview =
        document.createElement("div");

    largePreview.className =
        "color-large-preview";

    panel.appendChild(largePreview);


    /* =================================================
       HEX LABEL
       ================================================= */

    const hexLabel =
        document.createElement("label");

    hexLabel.textContent =
        "HEX";

    panel.appendChild(hexLabel);


    /* =================================================
       HEX INPUT
       ================================================= */

    const hexInput =
        document.createElement("input");

    hexInput.type =
        "text";

    hexInput.maxLength =
        9;

    hexInput.spellcheck =
        false;

    panel.appendChild(hexInput);


    /* =================================================
       SLIDER CREATION
       ================================================= */

    function createSlider(
        labelText,
        min,
        max,
        value
    ) {

        const row =
            document.createElement("div");

        row.className =
            "color-slider-row";


        const label =
            document.createElement("span");

        label.className =
            "color-slider-label";

        label.textContent =
            labelText;


        const slider =
            document.createElement("input");

        slider.type =
            "range";

        slider.min =
            min;

        slider.max =
            max;

        slider.value =
            value;

        slider.className =
            "color-slider";


        row.appendChild(label);
        row.appendChild(slider);

        panel.appendChild(row);

        return slider;
    }


    /* =================================================
       RGB + ALPHA
       ================================================= */

    const redSlider =
        createSlider(
            "R",
            0,
            255,
            currentColor.r
        );


    const greenSlider =
        createSlider(
            "G",
            0,
            255,
            currentColor.g
        );


    const blueSlider =
        createSlider(
            "B",
            0,
            255,
            currentColor.b
        );


    const alphaSlider =
        createSlider(
            "A",
            0,
            255,
            currentColor.a
        );


    /* =================================================
       CLOSE BUTTON
       ================================================= */

    const closeButton =
        document.createElement("button");

    closeButton.type =
        "button";

    closeButton.textContent =
        "Chiudi";

    panel.appendChild(closeButton);


    /* =================================================
       UPDATE UI
       ================================================= */

    function updateUI() {

        const hex =
            rgbaToHex(
                currentColor.r,
                currentColor.g,
                currentColor.b,
                currentColor.a
            );


        const cssColor =
            rgbaToCss(
                currentColor.r,
                currentColor.g,
                currentColor.b,
                currentColor.a
            );


        /*
         * ------------------------------------------------
         * SWATCH
         * ------------------------------------------------
         *
         * Il colore viene visualizzato sopra lo stesso
         * background che usa Jira.
         *
         * Il valore originale con alpha NON viene perso.
         */

        swatch.style.background =
            `linear-gradient(
                ${cssColor},
                ${cssColor}
            ), ${JIRA_PREVIEW_BACKGROUND}`;


        /*
         * ------------------------------------------------
         * LARGE PREVIEW
         * ------------------------------------------------
         */

        largePreview.style.background =
            `linear-gradient(
                ${cssColor},
                ${cssColor}
            ), ${JIRA_PREVIEW_BACKGROUND}`;


        /*
         * ------------------------------------------------
         * HEX
         * ------------------------------------------------
         */

        hexInput.value =
            hex;


        /*
         * ------------------------------------------------
         * SLIDERS
         * ------------------------------------------------
         */

        redSlider.value =
            currentColor.r;

        greenSlider.value =
            currentColor.g;

        blueSlider.value =
            currentColor.b;

        alphaSlider.value =
            currentColor.a;


        /*
         * Compatibilità con il vecchio trigger.
         */

        value.textContent =
            hex;
    }


    /* =================================================
       APPLY COLOR
       ================================================= */

    function applyColor(
        rgba,
        triggerChange = true
    ) {

        currentColor = {

            r: Math.max(
                0,
                Math.min(
                    255,
                    Math.round(
                        rgba.r
                    )
                )
            ),

            g: Math.max(
                0,
                Math.min(
                    255,
                    Math.round(
                        rgba.g
                    )
                )
            ),

            b: Math.max(
                0,
                Math.min(
                    255,
                    Math.round(
                        rgba.b
                    )
                )
            ),

            a: Math.max(
                0,
                Math.min(
                    255,
                    Math.round(
                        rgba.a
                    )
                )
            )
        };


        updateUI();


        if (
            triggerChange &&
            typeof onChange ===
                "function"
        ) {

            onChange(
                rgbaToHex(
                    currentColor.r,
                    currentColor.g,
                    currentColor.b,
                    currentColor.a
                )
            );
        }
    }


    /* =================================================
       RGB / ALPHA EVENTS
       ================================================= */

    redSlider.addEventListener(
        "input",
        () => {

            applyColor({

                ...currentColor,

                r:
                    Number(
                        redSlider.value
                    )
            });
        }
    );


    greenSlider.addEventListener(
        "input",
        () => {

            applyColor({

                ...currentColor,

                g:
                    Number(
                        greenSlider.value
                    )
            });
        }
    );


    blueSlider.addEventListener(
        "input",
        () => {

            applyColor({

                ...currentColor,

                b:
                    Number(
                        blueSlider.value
                    )
            });
        }
    );


    alphaSlider.addEventListener(
        "input",
        () => {

            applyColor({

                ...currentColor,

                a:
                    Number(
                        alphaSlider.value
                    )
            });
        }
    );


    /* =================================================
       HEX INPUT
       ================================================= */

    hexInput.addEventListener(
        "change",
        () => {

            let value =
                hexInput.value.trim();


            if (
                !value.startsWith("#")
            ) {

                value =
                    "#" + value;
            }


            /*
             * Formati supportati:
             *
             * #RGB
             * #RGBA
             * #RRGGBB
             * #RRGGBBAA
             */

            const valid =
                /^#[0-9a-fA-F]{3}$/.test(value) ||
                /^#[0-9a-fA-F]{4}$/.test(value) ||
                /^#[0-9a-fA-F]{6}$/.test(value) ||
                /^#[0-9a-fA-F]{8}$/.test(value);


            if (valid) {

                applyColor(
                    hexToRgba(value)
                );

            } else {

                /*
                 * Input non valido:
                 * ripristiniamo il valore precedente.
                 */

                updateUI();
            }
        }
    );


    /* =================================================
       OPEN
       ================================================= */

    function open() {

        if (isOpen) {
            return;
        }


        /*
         * Chiudi eventuale altro picker aperto.
         */

        if (
            activeColorPicker &&
            activeColorPicker !== api
        ) {

            activeColorPicker.close();
        }


        /*
         * Memorizziamo la posizione originale
         * del pannello.
         */

        originalParent =
            panel.parentNode;

        originalNextSibling =
            panel.nextSibling;


        /*
         * =================================================
         * IMPORTANTE
         * =================================================
         *
         * Spostiamo temporaneamente il panel direttamente
         * nel BODY.
         *
         * In questo modo non è più limitato da:
         *
         * - .color-row
         * - .collapsible
         * - .collapsible-content
         * - overflow
         * - stacking context delle card
         *
         */

        document.body.appendChild(
            panel
        );


        panel.classList.add(
            "open"
        );

        wrapper.classList.add(
            "is-open"
        );


        isOpen =
            true;


        /*
         * Aspettiamo che il browser abbia
         * renderizzato il pannello per
         * calcolarne le dimensioni.
         */

        requestAnimationFrame(
            () => {

                positionColorPanel(
                    wrapper,
                    panel
                );
            }
        );


        activeColorPicker =
            api;
    }


    /* =================================================
       CLOSE
       ================================================= */

    function close() {

        if (!isOpen) {
            return;
        }


        panel.classList.remove(
            "open"
        );

        wrapper.classList.remove(
            "is-open"
        );


        isOpen =
            false;


        /*
         * Riportiamo il panel nel suo
         * contenitore originale.
         */

        if (originalParent) {

            if (
                originalNextSibling &&
                originalNextSibling.parentNode ===
                    originalParent
            ) {

                originalParent.insertBefore(
                    panel,
                    originalNextSibling
                );

            } else {

                originalParent.appendChild(
                    panel
                );
            }
        }


        if (
            activeColorPicker ===
                api
        ) {

            activeColorPicker =
                null;
        }
    }


    /* =================================================
       TOGGLE
       ================================================= */

    function toggle() {

        if (isOpen) {

            close();

        } else {

            open();
        }
    }


    /* =================================================
       PREVIEW CLICK
       ================================================= */

    preview.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            toggle();
        }
    );


    /* =================================================
       CLOSE BUTTON
       ================================================= */

    closeButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            close();
        }
    );


    /* =================================================
       PANEL CLICK
       ================================================= */

    panel.addEventListener(
        "click",
        event => {

            event.stopPropagation();
        }
    );


    /* =================================================
       OUTSIDE CLICK
       ================================================= */

    function outsideClick(event) {

        if (!isOpen) {
            return;
        }


        /*
         * Il panel è temporaneamente nel body,
         * quindi dobbiamo controllare sia il panel
         * sia il trigger originale.
         */

        if (
            panel.contains(
                event.target
            ) ||
            wrapper.contains(
                event.target
            )
        ) {

            return;
        }


        close();
    }


    document.addEventListener(
        "click",
        outsideClick
    );


    /* =================================================
       WINDOW RESIZE
       ================================================= */

    function reposition() {

        if (!isOpen) {
            return;
        }


        positionColorPanel(
            wrapper,
            panel
        );
    }


    window.addEventListener(
        "resize",
        reposition
    );


    /*
     * Catturiamo anche lo scroll dei
     * contenitori interni.
     */

    window.addEventListener(
        "scroll",
        reposition,
        true
    );


    /* =================================================
       PUBLIC API
       ================================================= */

    const api = {

        element:
            wrapper,


        getColor() {

            return rgbaToHex(
                currentColor.r,
                currentColor.g,
                currentColor.b,
                currentColor.a
            );
        },


        setColor(color) {

            applyColor(
                hexToRgba(color),
                false
            );
        },


        open,
        close,
        toggle
    };


    /* =================================================
       INITIALIZE
       ================================================= */

    updateUI();


    return wrapper;
}