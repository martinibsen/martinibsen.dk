// Lazy-loaded Pagefind UI for /playbook search.
// Loads CSS + JS only on first open, so dev (where /pagefind/ doesn't exist
// until `npm run build`) has no 404s, and the production initial-page bundle
// stays small.

declare global {
    interface Window {
        PagefindUI?: new (config: Record<string, unknown>) => unknown;
    }
}

function loadStylesheet(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`link[data-pb-search][href="${href}"]`)) {
            resolve();
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.dataset.pbSearch = '1';
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load ${href}`));
        document.head.appendChild(link);
    });
}

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[data-pb-search][src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.dataset.pbSearch = '1';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

const TRANSLATIONS = {
    placeholder: 'Søg i playbook…',
    clear_search: 'Ryd',
    load_more: 'Vis flere resultater',
    search_label: 'Søg playbook',
    filters_label: 'Filtre',
    zero_results: 'Ingen resultater for [SEARCH_TERM]',
    many_results: '[COUNT] resultater for [SEARCH_TERM]',
    one_result: '1 resultat for [SEARCH_TERM]',
    alt_search: 'Ingen resultater for [SEARCH_TERM] — viser i stedet [DISPLAY_QUERY]',
    search_suggestion: 'Ingen resultater for [SEARCH_TERM] — prøv [DISPLAY_QUERY]',
    searching: 'Søger…',
};

export function initPlaybookSearch(overlayId = 'pb-search', mountId = 'pb-search-ui') {
    const overlay = document.getElementById(overlayId);
    const mount = document.getElementById(mountId);
    if (!overlay || !mount) return;

    let pagefindReady: Promise<void> | null = null;
    let inited = false;
    let failed = false;

    function ensureLoaded(): Promise<void> {
        if (pagefindReady) return pagefindReady;
        pagefindReady = Promise.all([
            loadStylesheet('/pagefind/pagefind-ui.css'),
            loadScript('/pagefind/pagefind-ui.js'),
        ]).then(() => undefined);
        return pagefindReady;
    }

    function ensureInit() {
        if (inited || failed) return;
        if (typeof window.PagefindUI === 'undefined') return;
        new window.PagefindUI({
            element: `#${mountId}`,
            showSubResults: true,
            showImages: false,
            resetStyles: false,
            placeholder: 'Søg i playbook…',
            translations: TRANSLATIONS,
        });
        inited = true;
    }

    function showFallback(message: string) {
        if (mount && !inited) {
            mount.innerHTML = `<p style="font-family:var(--font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);padding:24px 4px;">${message}</p>`;
        }
    }

    function open() {
        overlay!.hidden = false;
        document.body.style.overflow = 'hidden';
        ensureLoaded()
            .then(() => {
                ensureInit();
                setTimeout(() => {
                    const input = mount!.querySelector('input');
                    if (input) (input as HTMLInputElement).focus();
                }, 30);
            })
            .catch(() => {
                failed = true;
                showFallback('Søgeindeks ikke tilgængeligt — bygger med “npm run build”.');
            });
    }

    function close() {
        overlay!.hidden = true;
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-pb-search-open]').forEach((btn) => {
        btn.addEventListener('click', open);
    });
    document.querySelectorAll('[data-pb-search-close]').forEach((btn) => {
        btn.addEventListener('click', close);
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            overlay.hidden ? open() : close();
        } else if (e.key === 'Escape' && !overlay.hidden) {
            close();
        }
    });
}
