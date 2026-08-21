/**
 * Site behaviour for olibartfast.github.io.
 *
 * No runtime dependencies — compiled to js/main.js with `npm run build`
 * and loaded as an ES module. Every feature degrades to nothing if the
 * elements it needs are absent, so the same bundle can ship on the landing
 * page, the blog index and the article pages.
 */

type FxMode = "on" | "off";

const FX_STORAGE_KEY = "olibartfast:fx";
const SCROLLED_CLASS = "is-scrolled";
const SCROLLED_AT = 24;

const root = document.documentElement;

const prefersReducedMotion = (): boolean =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------------------------------------
   Effects switch: scanlines, beam, glitch. Persisted, and off by default for
   anyone who asked the OS for reduced motion.
   -------------------------------------------------------------------------- */

function readStoredFx(): FxMode | null {
    try {
        const stored = window.localStorage.getItem(FX_STORAGE_KEY);
        return stored === "on" || stored === "off" ? stored : null;
    } catch {
        // Private mode / blocked storage: fall back to the OS preference.
        return null;
    }
}

function storeFx(mode: FxMode): void {
    try {
        window.localStorage.setItem(FX_STORAGE_KEY, mode);
    } catch {
        /* not fatal */
    }
}

function applyFx(mode: FxMode): void {
    root.dataset.fx = mode;
}

function initFxToggle(): void {
    const mount = document.querySelector<HTMLElement>(".nav, .blog-view-wrapper");
    let mode: FxMode = readStoredFx() ?? (prefersReducedMotion() ? "off" : "on");
    applyFx(mode);

    if (!mount) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "fx-toggle";
    button.title = "Toggle visual effects (scanlines, glitch, beam)";

    const render = (): void => {
        button.textContent = `FX:${mode.toUpperCase()}`;
        button.setAttribute("aria-pressed", String(mode === "on"));
        button.setAttribute(
            "aria-label",
            mode === "on" ? "Turn visual effects off" : "Turn visual effects on",
        );
    };

    button.addEventListener("click", () => {
        mode = mode === "on" ? "off" : "on";
        applyFx(mode);
        storeFx(mode);
        render();
    });

    render();
    mount.appendChild(button);
}

/* --------------------------------------------------------------------------
   Sticky nav: mark it once the page has scrolled off the top.
   -------------------------------------------------------------------------- */

function initNavState(): void {
    const nav = document.querySelector<HTMLElement>(".nav");
    if (!nav) return;

    let queued = false;
    const sync = (): void => {
        queued = false;
        nav.classList.toggle(SCROLLED_CLASS, window.scrollY > SCROLLED_AT);
    };

    window.addEventListener(
        "scroll",
        () => {
            if (queued) return;
            queued = true;
            window.requestAnimationFrame(sync);
        },
        { passive: true },
    );

    sync();
}

/* --------------------------------------------------------------------------
   In-page navigation: scroll clear of the sticky nav, keep the hash and the
   keyboard focus in sync.
   -------------------------------------------------------------------------- */

function navHeight(): number {
    const nav = document.querySelector<HTMLElement>(".nav");
    return nav ? nav.getBoundingClientRect().height : 0;
}

// Article pages scroll inside .blog-scrollable-content rather than the window,
// so an in-page link has to move whichever element actually scrolls.
function scrollParentOf(target: HTMLElement): HTMLElement | null {
    for (let el = target.parentElement; el; el = el.parentElement) {
        const overflowY = getComputedStyle(el).overflowY;
        const scrolls = overflowY === "auto" || overflowY === "scroll";
        if (scrolls && el.scrollHeight > el.clientHeight) return el;
    }
    return null;
}

function scrollToTarget(target: HTMLElement): void {
    const behavior: ScrollBehavior =
        prefersReducedMotion() || root.dataset.fx === "off" ? "auto" : "smooth";

    const container = scrollParentOf(target);
    if (container) {
        const offset =
            target.getBoundingClientRect().top - container.getBoundingClientRect().top;
        container.scrollTo({ top: container.scrollTop + offset - 12, behavior });
    } else {
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight() - 12;
        window.scrollTo({ top, behavior });
    }

    // Anchors are not focusable by default; make the landing spot the next tab
    // stop without letting the browser jump the scroll position again.
    const hadTabIndex = target.hasAttribute("tabindex");
    if (!hadTabIndex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (!hadTabIndex) {
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
            once: true,
        });
    }
}

function initSmoothScroll(): void {
    document.addEventListener("click", (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
        if (!link) return;

        const hash = link.hash;
        if (!hash || hash === "#") return;
        if (link.pathname !== window.location.pathname || link.host !== window.location.host) {
            return;
        }

        const target = document.querySelector<HTMLElement>(hash);
        if (!target) return;

        event.preventDefault();
        scrollToTarget(target);
        history.pushState(null, "", hash);
    });
}

/* --------------------------------------------------------------------------
   Scrollspy: mark the nav link for the section currently in view.
   -------------------------------------------------------------------------- */

function initScrollSpy(): void {
    const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(".nav a[href*='#']:not(.btn)"),
    );

    const sections = new Map<Element, HTMLAnchorElement>();
    for (const link of links) {
        if (link.pathname !== window.location.pathname) continue;
        const section = link.hash ? document.querySelector(link.hash) : null;
        if (section) sections.set(section, link);
    }
    if (sections.size === 0) return;

    // Pages that already declare a current page (e.g. the blog index) keep it.
    const preset = links.find((link) => link.getAttribute("aria-current") === "page");

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            }

            const active = Array.from(sections.keys()).find((section) => visible.has(section));
            for (const [section, link] of sections) {
                if (link === preset) continue;
                if (section === active) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            }
        },
        { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    for (const section of sections.keys()) observer.observe(section);
}

/* --------------------------------------------------------------------------
   Decode-in effect for [data-scramble] text.
   -------------------------------------------------------------------------- */

const SCRAMBLE_GLYPHS = "01<>[]{}/\\|=+*#%$&@!?ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SCRAMBLE_FRAME_MS = 34;

function scramble(element: HTMLElement): void {
    const final = element.textContent ?? "";
    if (!final.trim()) return;

    const chars = Array.from(final);
    const settleAt = chars.map((_, index) => 6 + index * 0.9 + Math.random() * 8);
    const totalFrames = Math.ceil(Math.max(...settleAt)) + 1;

    let frame = 0;
    element.setAttribute("aria-label", final);

    const tick = (): void => {
        const rendered = chars.map((char, index) => {
            if (frame >= settleAt[index] || char === " ") return char;
            return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
        });

        element.textContent = rendered.join("");
        frame += 1;

        if (frame <= totalFrames) {
            window.setTimeout(tick, SCRAMBLE_FRAME_MS);
        } else {
            element.textContent = final;
            element.removeAttribute("aria-label");
        }
    };

    tick();
}

function initScramble(): void {
    const targets = document.querySelectorAll<HTMLElement>("[data-scramble]");
    if (targets.length === 0) return;
    if (prefersReducedMotion() || root.dataset.fx === "off") return;

    for (const target of targets) scramble(target);
}

/* -------------------------------------------------------------------------- */

function init(): void {
    initFxToggle();
    initNavState();
    initSmoothScroll();
    initScrollSpy();
    initScramble();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}
