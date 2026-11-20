/* =====================================================
   JSM-utils — Loader del content script
   -----------------------------------------------------
   I content script dichiarati nel manifest non possono
   essere moduli ES: questo file classico importa
   dinamicamente il vero entry point (main.js), così
   tutto il resto del codice può usare import/export.
   I moduli sono esposti solo ai domini Atlassian
   (manifest → web_accessible_resources).
   ===================================================== */

(async () => {
    try {
        const { init } = await import(chrome.runtime.getURL("src/content/main.js"));
        await init();
    } catch (error) {
        console.error("[JSM-utils] Avvio del content script non riuscito:", error);
    }
})();
