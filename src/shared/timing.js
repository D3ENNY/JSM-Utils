/* =====================================================
   Utilità di temporizzazione
   ===================================================== */

/**
 * Raggruppa le chiamate ravvicinate: `fn` viene eseguita
 * una sola volta, `delay` ms dopo la prima richiesta.
 */
export function createDebouncedTask(fn, delay) {
    let timerId = null;
    return () => {
        if (timerId !== null) {
            return;
        }
        timerId = setTimeout(() => {
            timerId = null;
            fn();
        }, delay);
    };
}

/**
 * Esegue `task` al più una volta ogni `interval` ms.
 * La prima richiesta dopo una pausa parte subito; quelle
 * successive vengono accorpate in un'unica esecuzione.
 */
export function createThrottledTask(task, interval) {

    let lastRunAt = 0;
    let timerId = null;

    function run() {
        timerId = null;
        lastRunAt = Date.now();
        return task();
    }

    return {
        schedule() {
            if (timerId !== null) {
                return;
            }
            const wait = Math.max(0, interval - (Date.now() - lastRunAt));
            timerId = setTimeout(run, wait);
        },

        /** Esegue subito l'eventuale esecuzione in attesa. */
        flush() {
            if (timerId === null) {
                return Promise.resolve();
            }
            clearTimeout(timerId);
            return run();
        },

        cancel() {
            clearTimeout(timerId);
            timerId = null;
        }
    };
}
