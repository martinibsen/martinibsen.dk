// Reader annotations for playbook pages.
// Flow: select text → toolbar appears → click → modal → submit → highlight + appears in list.
// Admin-only delete via localStorage token.

interface Annotation {
    id: string;
    pageSlug: string;
    quote: string;
    contextBefore: string;
    contextAfter: string;
    paragraphIndex: number;
    comment: string;
    author: string;
    createdAt: string;
}

const CONTEXT_LEN = 30;
const ADMIN_TOKEN_KEY = 'pb-admin-token';

function findElements() {
    const article = document.querySelector<HTMLElement>('.pb-article-body[data-pagefind-body]');
    const toolbar = document.getElementById('pb-anno-toolbar');
    const modal = document.getElementById('pb-anno-modal') as HTMLDialogElement | null;
    const popover = document.getElementById('pb-anno-popover');
    const list = document.getElementById('pb-anno-list');
    if (!article || !toolbar || !modal || !popover || !list) return null;
    return { article, toolbar, modal, popover, list };
}

export async function initPlaybookAnnotations() {
    const els = findElements();
    if (!els) return;
    const { article, toolbar, modal, popover, list } = els;

    const slug = derivePageSlug();
    if (!slug) return;

    const modalForm = modal.querySelector<HTMLFormElement>('form')!;
    const modalQuoteEl = modal.querySelector<HTMLElement>('.pb-anno-modal-quote')!;
    const modalCommentInput = modal.querySelector<HTMLTextAreaElement>('textarea[name="comment"]')!;
    const modalAuthorInput = modal.querySelector<HTMLInputElement>('input[name="author"]')!;
    const modalHoneypot = modal.querySelector<HTMLInputElement>('input[name="website"]')!;
    const modalError = modal.querySelector<HTMLElement>('.pb-anno-error')!;
    const modalSubmit = modal.querySelector<HTMLButtonElement>('.pb-anno-submit')!;
    const listItems = list.querySelector<HTMLOListElement>('.pb-anno-list-items')!;
    const listCount = list.querySelector<HTMLElement>('.pb-anno-count')!;

    let annotations: Annotation[] = [];
    let pending: {
        quote: string;
        contextBefore: string;
        contextAfter: string;
        paragraphIndex: number;
    } | null = null;

    // ---------------- Initial load ----------------
    try {
        const res = await fetch(`/api/playbook-annotations?slug=${encodeURIComponent(slug)}`);
        const data = (await res.json()) as { ok: boolean; annotations?: Annotation[] };
        if (data.ok && data.annotations) annotations = data.annotations;
    } catch {
        // fail quietly — feature is non-critical
    }

    renderAll();

    // ---------------- Selection → toolbar ----------------
    document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
            hideToolbar();
            return;
        }
        const range = sel.getRangeAt(0);
        if (!isInsideArticle(range)) {
            hideToolbar();
            return;
        }
        // Only show on selections within a single block element
        const startBlock = findBlock(range.startContainer);
        const endBlock = findBlock(range.endContainer);
        if (!startBlock || startBlock !== endBlock) {
            hideToolbar();
            return;
        }
        positionToolbar(range);
    });

    // Don't kill the selection when clicking the toolbar
    toolbar.addEventListener('mousedown', (e) => e.preventDefault());

    toolbar.querySelector<HTMLButtonElement>('[data-pb-anno-comment]')?.addEventListener('click', () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
        const range = sel.getRangeAt(0);
        const startBlock = findBlock(range.startContainer);
        if (!startBlock) return;

        const quote = sel.toString().trim();
        if (quote.length < 3) return;

        const blockText = startBlock.textContent ?? '';
        const startOff = computeOffsetInBlock(startBlock, range.startContainer, range.startOffset);
        const endOff = startOff + quote.length;

        const paragraphs = blockElements(article);
        const paragraphIndex = paragraphs.indexOf(startBlock);

        pending = {
            quote,
            contextBefore: blockText.slice(Math.max(0, startOff - CONTEXT_LEN), startOff),
            contextAfter: blockText.slice(endOff, endOff + CONTEXT_LEN),
            paragraphIndex: paragraphIndex >= 0 ? paragraphIndex : 0,
        };

        openModal();
    });

    // ---------------- Modal ----------------
    function openModal() {
        if (!pending) return;
        modalQuoteEl.textContent = pending.quote;
        modalCommentInput.value = '';
        modalAuthorInput.value = '';
        modalHoneypot.value = '';
        modalError.hidden = true;
        modalError.textContent = '';
        modalSubmit.disabled = false;
        modalSubmit.textContent = 'Send';
        if (typeof modal.showModal === 'function') {
            modal.showModal();
        } else {
            modal.setAttribute('open', '');
        }
        setTimeout(() => modalCommentInput.focus(), 30);
    }

    function closeModal() {
        if (modal.open) modal.close();
        else modal.removeAttribute('open');
        pending = null;
        // Clear selection so toolbar disappears
        window.getSelection()?.removeAllRanges();
        hideToolbar();
    }

    modal.querySelectorAll('[data-pb-anno-close]').forEach((el) => {
        el.addEventListener('click', () => closeModal());
    });
    modal.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeModal();
    });

    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!pending) return;
        const comment = modalCommentInput.value.trim();
        if (comment.length < 2) {
            showError('Skriv en kommentar.');
            return;
        }
        if (modalHoneypot.value) {
            // Bot caught — silent close
            closeModal();
            return;
        }
        modalSubmit.disabled = true;
        modalSubmit.textContent = 'Sender…';
        try {
            const res = await fetch('/api/playbook-annotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageSlug: slug,
                    quote: pending.quote,
                    contextBefore: pending.contextBefore,
                    contextAfter: pending.contextAfter,
                    paragraphIndex: pending.paragraphIndex,
                    comment,
                    author: modalAuthorInput.value.trim(),
                    website: modalHoneypot.value,
                }),
            });
            const data = (await res.json()) as { ok: boolean; annotation?: Annotation; error?: string };
            if (!res.ok || !data.ok) {
                showError(data.error ?? 'Noget gik galt — prøv igen.');
                modalSubmit.disabled = false;
                modalSubmit.textContent = 'Send';
                return;
            }
            if (data.annotation) {
                annotations.push(data.annotation);
                renderAll();
            }
            closeModal();
        } catch {
            showError('Kunne ikke nå serveren — prøv igen.');
            modalSubmit.disabled = false;
            modalSubmit.textContent = 'Send';
        }
    });

    function showError(msg: string) {
        modalError.textContent = msg;
        modalError.hidden = false;
    }

    // ---------------- Render ----------------
    function renderAll() {
        renderHighlights();
        renderList();
    }

    function renderHighlights() {
        // Strip any existing marks first
        article.querySelectorAll('mark.pb-anno-mark').forEach((m) => {
            const parent = m.parentNode!;
            while (m.firstChild) parent.insertBefore(m.firstChild, m);
            parent.removeChild(m);
            parent.normalize();
        });
        if (annotations.length === 0) return;

        const blocks = blockElements(article);
        // Group annotations by paragraphIndex for efficiency
        const byBlock = new Map<number, Annotation[]>();
        for (const a of annotations) {
            const arr = byBlock.get(a.paragraphIndex) ?? [];
            arr.push(a);
            byBlock.set(a.paragraphIndex, arr);
        }
        for (const [idx, list] of byBlock.entries()) {
            const block = blocks[idx];
            if (!block) continue;
            for (const a of list) {
                wrapQuoteInBlock(block, a);
            }
        }
    }

    function wrapQuoteInBlock(block: HTMLElement, ann: Annotation) {
        const text = block.textContent ?? '';
        // Find a unique occurrence of quote, optionally disambiguated by context
        const candidates: number[] = [];
        let from = -1;
        while (true) {
            const i = text.indexOf(ann.quote, from + 1);
            if (i === -1) break;
            candidates.push(i);
            from = i;
        }
        if (candidates.length === 0) return;

        let target: number | undefined;
        if (candidates.length === 1) {
            target = candidates[0];
        } else {
            target = candidates.find((i) => {
                const before = text.slice(Math.max(0, i - ann.contextBefore.length), i);
                const after = text.slice(i + ann.quote.length, i + ann.quote.length + ann.contextAfter.length);
                const beforeOk = ann.contextBefore === '' || before.endsWith(ann.contextBefore);
                const afterOk = ann.contextAfter === '' || after.startsWith(ann.contextAfter);
                return beforeOk && afterOk;
            });
        }
        if (target === undefined) return;

        const range = rangeFromOffset(block, target, target + ann.quote.length);
        if (!range) return;
        wrapRangeWithMark(range, ann);
    }

    function wrapRangeWithMark(range: Range, ann: Annotation) {
        // Walk text nodes intersecting the range and wrap each portion
        const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT);
        const textNodes: Text[] = [];
        let node = walker.nextNode();
        while (node) {
            if (range.intersectsNode(node)) textNodes.push(node as Text);
            node = walker.nextNode();
        }
        // commonAncestorContainer might itself be a text node
        if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
            textNodes.length = 0;
            textNodes.push(range.commonAncestorContainer as Text);
        }

        for (const tn of textNodes) {
            const start = tn === range.startContainer ? range.startOffset : 0;
            const end = tn === range.endContainer ? range.endOffset : (tn.textContent?.length ?? 0);
            if (start >= end) continue;
            const text = tn.textContent ?? '';
            const before = text.slice(0, start);
            const middle = text.slice(start, end);
            const after = text.slice(end);

            const mark = document.createElement('mark');
            mark.className = 'pb-anno-mark';
            mark.dataset.annoId = ann.id;
            mark.tabIndex = 0;
            mark.textContent = middle;
            mark.addEventListener('mouseenter', () => showPopover(mark, ann));
            mark.addEventListener('mouseleave', () => hidePopover());
            mark.addEventListener('focus', () => showPopover(mark, ann));
            mark.addEventListener('blur', () => hidePopover());
            mark.addEventListener('click', () => {
                // Scroll to comment in list
                const item = listItems.querySelector(`[data-anno-id="${ann.id}"]`);
                item?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (item as HTMLElement)?.classList.add('is-flash');
                setTimeout(() => (item as HTMLElement)?.classList.remove('is-flash'), 1200);
            });

            const parent = tn.parentNode!;
            if (before) parent.insertBefore(document.createTextNode(before), tn);
            parent.insertBefore(mark, tn);
            if (after) parent.insertBefore(document.createTextNode(after), tn);
            parent.removeChild(tn);
        }
    }

    function renderList() {
        listItems.innerHTML = '';
        const sorted = [...annotations].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        listCount.textContent = String(sorted.length);
        if (sorted.length === 0) {
            list.hidden = true;
            return;
        }
        list.hidden = false;
        const isAdmin = !!localStorage.getItem(ADMIN_TOKEN_KEY);
        for (const a of sorted) {
            const li = document.createElement('li');
            li.className = 'pb-anno-card';
            li.dataset.annoId = a.id;
            li.innerHTML = `
                <blockquote class="pb-anno-card-quote"></blockquote>
                <p class="pb-anno-card-comment"></p>
                <div class="pb-anno-card-foot">
                    <span class="pb-anno-card-author"></span>
                    <span class="pb-anno-card-date"></span>
                </div>
            `;
            (li.querySelector('.pb-anno-card-quote') as HTMLElement).textContent = a.quote;
            (li.querySelector('.pb-anno-card-comment') as HTMLElement).textContent = a.comment;
            (li.querySelector('.pb-anno-card-author') as HTMLElement).textContent = a.author || 'Anonym';
            (li.querySelector('.pb-anno-card-date') as HTMLElement).textContent = formatDate(a.createdAt);
            if (isAdmin) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'pb-anno-delete';
                btn.textContent = 'Slet';
                btn.addEventListener('click', () => deleteAnnotation(a.id));
                li.querySelector('.pb-anno-card-foot')!.appendChild(btn);
            }
            li.addEventListener('click', (e) => {
                if ((e.target as HTMLElement).closest('.pb-anno-delete')) return;
                const mark = article.querySelector(`mark.pb-anno-mark[data-anno-id="${a.id}"]`);
                if (mark) {
                    mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    (mark as HTMLElement).classList.add('is-flash');
                    setTimeout(() => (mark as HTMLElement).classList.remove('is-flash'), 1200);
                }
            });
            listItems.appendChild(li);
        }
    }

    async function deleteAnnotation(id: string) {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (!token) return;
        if (!confirm('Slet denne kommentar?')) return;
        try {
            const res = await fetch(`/api/playbook-annotations?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                alert('Kunne ikke slette — token forkert?');
                return;
            }
            annotations = annotations.filter((a) => a.id !== id);
            renderAll();
        } catch {
            alert('Kunne ikke nå serveren.');
        }
    }

    // ---------------- Popover ----------------
    function showPopover(target: HTMLElement, ann: Annotation) {
        const isAdmin = !!localStorage.getItem(ADMIN_TOKEN_KEY);
        popover.innerHTML = `
            <div class="pb-anno-pop-comment"></div>
            <div class="pb-anno-pop-meta">
                <span class="pb-anno-pop-author"></span>
                <span class="pb-anno-pop-date"></span>
            </div>
        `;
        (popover!.querySelector('.pb-anno-pop-comment') as HTMLElement).textContent = ann.comment;
        (popover!.querySelector('.pb-anno-pop-author') as HTMLElement).textContent = ann.author || 'Anonym';
        (popover!.querySelector('.pb-anno-pop-date') as HTMLElement).textContent = formatDate(ann.createdAt);
        if (isAdmin) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pb-anno-pop-delete';
            btn.textContent = '🗑';
            btn.title = 'Slet kommentar';
            btn.addEventListener('mousedown', (e) => e.preventDefault());
            btn.addEventListener('click', () => {
                hidePopover();
                deleteAnnotation(ann.id);
            });
            popover.querySelector('.pb-anno-pop-meta')!.appendChild(btn);
        }
        popover.hidden = false;
        const r = target.getBoundingClientRect();
        const top = window.scrollY + r.bottom + 8;
        const left = Math.max(12, Math.min(window.innerWidth - 320, window.scrollX + r.left));
        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
    }

    function hidePopover() {
        popover.hidden = true;
    }

    // ---------------- Toolbar ----------------
    function positionToolbar(range: Range) {
        const r = range.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) {
            hideToolbar();
            return;
        }
        toolbar.hidden = false;
        // Place above selection if room, else below
        const tbHeight = 36;
        const padding = 8;
        let top = window.scrollY + r.top - tbHeight - padding;
        if (top < window.scrollY + 10) {
            top = window.scrollY + r.bottom + padding;
        }
        const tbWidth = 140;
        const left = Math.max(12, Math.min(window.innerWidth - tbWidth - 12, window.scrollX + r.left + r.width / 2 - tbWidth / 2));
        toolbar.style.top = `${top}px`;
        toolbar.style.left = `${left}px`;
    }

    function hideToolbar() {
        toolbar.hidden = true;
    }

    // ---------------- Helpers ----------------
    function isInsideArticle(range: Range): boolean {
        return article.contains(range.startContainer) && article.contains(range.endContainer);
    }

    function blockElements(root: HTMLElement): HTMLElement[] {
        return Array.from(root.querySelectorAll<HTMLElement>('p, li, blockquote'));
    }

    function findBlock(node: Node): HTMLElement | null {
        let n: Node | null = node;
        while (n && n !== article) {
            if (n.nodeType === Node.ELEMENT_NODE) {
                const el = n as HTMLElement;
                if (el.matches?.('p, li, blockquote')) return el;
            }
            n = n.parentNode;
        }
        return null;
    }

    function computeOffsetInBlock(block: HTMLElement, container: Node, offset: number): number {
        // Walk text nodes and accumulate length until we hit `container`
        let total = 0;
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
            if (node === container) return total + offset;
            total += node.textContent?.length ?? 0;
            node = walker.nextNode();
        }
        return total;
    }

    function rangeFromOffset(root: HTMLElement, start: number, end: number): Range | null {
        const range = document.createRange();
        let pos = 0;
        let startSet = false;
        let endSet = false;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
            const len = node.textContent?.length ?? 0;
            const nodeEnd = pos + len;
            if (!startSet && start >= pos && start <= nodeEnd) {
                range.setStart(node, start - pos);
                startSet = true;
            }
            if (!endSet && end >= pos && end <= nodeEnd) {
                range.setEnd(node, end - pos);
                endSet = true;
                break;
            }
            pos = nodeEnd;
            node = walker.nextNode();
        }
        return startSet && endSet ? range : null;
    }
}

function derivePageSlug(): string | null {
    const path = window.location.pathname.replace(/\/+$/, '');
    const m = path.match(/\/playbook\/([^/]+)$/);
    return m ? m[1] : null;
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}.${d.getFullYear()}`;
}
