import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostBinding, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DevModeService } from '../../core/services/dev-mode';
import { NavDrawerService } from '../../core/services/nav-drawer';
import { TestTracking } from '../../core/services/test-tracking';
import { VisitedPages } from '../../core/services/visited-pages';
import { STORAGE_PREFIX } from '../../core/services/storage-prefix';


interface SubpageItem {
    label: string;
    route: string;
    queryParams?: Record<string, string>;
    testId?: string;    // test rows: the id the test page tracks itself under
}

interface SegmentDef {
    id: string;
    label: string;
    decisionRoute?: string;    // a segment can be entered here without opening any of its sub-pages
    icon?: string;             // SVG path for the marker, in place of a number
    subpages: SubpageItem[];
}


// On the theory strand every way to the Anleitung leads through this page, so there it is a station of the line.
// The experiment strand only reaches it from the optional pages.
const SETUP_SEGMENT: SegmentDef = {
    id: 'opt-setup', label: 'Versuchsaufbau',
    icon: 'M14.6 4.1 12 6.7 9.3 4l2.6-2.6a4 4 0 0 0-5.3 5L1.6 11.4a2.1 2.1 0 0 0 3 3l5-5a4 4 0 0 0 5-5.3z',
    subpages: [
        { label: '(1/1) - Versuchsaufbau', route: '/learning/opt-setup' },
    ]
};

// also read by the optional pages, whose way back depends on the strand
export const NAV_STRAND_KEY = STORAGE_PREFIX + 'nav-chosen-strand';

const E_SEGMENTS: SegmentDef[] = [
    {
        id: 'e1-intro', label: 'Einstieg: Versuchsaufbau',
        subpages: [
            { label: '(1/4) - Einführung', route: '/learning/e1-intro-experiment', queryParams: { page: '1', path: 'learn' } },
            { label: '(2/4) - Komponenten', route: '/learning/e1-intro-experiment', queryParams: { page: '2', path: 'learn' } },
            { label: '(3/4) - Direktionsmoment', route: '/learning/e1-intro-experiment', queryParams: { page: '3', path: 'learn' } },
            { label: '(4/4) - Winkel-Zeit', route: '/learning/e1-intro-experiment', queryParams: { page: '4', path: 'learn' } },
        ]
    },
    {
        id: 'e2-damped', label: 'Gedämpfte Schwingungen', decisionRoute: '/decision/dec-e-damped',
        subpages: [
            { label: '(1/3) - Grundlagen', route: '/learning/e2-damped-oscillations', queryParams: { page: '1', path: 'learn' } },
            { label: '(2/3) - Lösung der Differentialgleichung', route: '/learning/e2-damped-oscillations', queryParams: { page: '2', path: 'learn' } },
            { label: '(3/3) - Logarithmisches Dekrement', route: '/learning/e2-damped-oscillations', queryParams: { page: '3', path: 'learn' } },
            { label: 'Simulation', route: '/simulation/sim-e-damped', queryParams: { path: 'sim' } },
            { label: 'Test', route: '/test/test-e-damped', queryParams: { path: 'test' }, testId: 'e-damped-oscillations-test' },
        ]
    },
    {
        id: 'e3-driven', label: 'Getriebene Schwingungen', decisionRoute: '/decision/dec-e-driven',
        subpages: [
            { label: '(1/7) - Versuchsaufbau', route: '/learning/e3-driven-oscillations', queryParams: { page: '1', path: 'learn' } },
            { label: '(2/7) - Lösungsansatz', route: '/learning/e3-driven-oscillations', queryParams: { page: '2', path: 'learn' } },
            { label: '(3/7) - Einschwingvorgang', route: '/learning/e3-driven-oscillations', queryParams: { page: '3', path: 'learn' } },
            { label: '(4/7) - Amplitude im Stationärzustand', route: '/learning/e3-driven-oscillations', queryParams: { page: '4', path: 'learn' } },
            { label: '(5/7) - Resonanz', route: '/learning/e3-driven-oscillations', queryParams: { page: '5', path: 'learn' } },
            { label: '(6/7) - Vorbereitung', route: '/learning/e3-driven-oscillations', queryParams: { page: '6', path: 'learn' } },
            { label: '(7/7) - Phasenverschiebung', route: '/learning/e3-driven-oscillations', queryParams: { page: '7', path: 'learn' } },
            { label: 'Simulation', route: '/simulation/sim-e-driven', queryParams: { path: 'sim' } },
            { label: 'Test', route: '/test/test-e-driven', queryParams: { path: 'test' }, testId: 'e-driven-oscillations-test' },
        ]
    },
];

const T_SEGMENTS: SegmentDef[] = [
    {
        id: 't1-intro', label: 'Einstieg: Theorie',
        subpages: [
            { label: '(1/1) - Grundlagen', route: '/learning/t1-intro-theory' },
        ]
    },
    {
        id: 't2-free', label: 'Freie Schwingungen',
        subpages: [
            { label: '(1/2) - Differentialgleichung und Lösungsansatz', route: '/learning/t2-free-oscillations', queryParams: { page: '1' } },
            { label: '(2/2) - Phasenraum', route: '/learning/t2-free-oscillations', queryParams: { page: '2' } },
            { label: 'Simulation', route: '/simulation/sim-t-free' },
        ]
    },
    {
        id: 't3-damped', label: 'Gedämpfte Schwingungen', decisionRoute: '/decision/dec-t-damped',
        subpages: [
            { label: '(1/5) - Exponentialansatz', route: '/learning/t3-damped-oscillations', queryParams: { page: '1', path: 'learn' } },
            { label: '(2/5) - Schwingfall', route: '/learning/t3-damped-oscillations', queryParams: { page: '2', path: 'learn' } },
            { label: '(3/5) - Kriechfall', route: '/learning/t3-damped-oscillations', queryParams: { page: '3', path: 'learn' } },
            { label: '(4/5) - Aperiodischer Grenzfall', route: '/learning/t3-damped-oscillations', queryParams: { page: '4', path: 'learn' } },
            { label: '(5/5) - Zusammenfassung', route: '/learning/t3-damped-oscillations', queryParams: { page: '5', path: 'learn' } },
            { label: 'Simulation', route: '/simulation/sim-t-damped', queryParams: { path: 'sim' } },
            { label: 'Test', route: '/test/test-t-damped', queryParams: { path: 'test' }, testId: 't-damped-oscillations-test' },
        ]
    },
    {
        id: 't4-driven', label: 'Getriebene Schwingungen', decisionRoute: '/decision/dec-t-driven',
        subpages: [
            { label: '(1/8) - Differentialgleichung', route: '/learning/t4-driven-oscillations', queryParams: { page: '1', path: 'learn' } },
            { label: '(2/8) - Gesamtlösung', route: '/learning/t4-driven-oscillations', queryParams: { page: '2', path: 'learn' } },
            { label: '(3/8) - Stationäre Lösung', route: '/learning/t4-driven-oscillations', queryParams: { page: '3', path: 'learn' } },
            { label: '(4/8) - Partikuläre Lösung', route: '/learning/t4-driven-oscillations', queryParams: { page: '4', path: 'learn' } },
            { label: '(5/8) - Dämpfungsfälle', route: '/learning/t4-driven-oscillations', queryParams: { page: '5', path: 'learn' } },
            { label: '(6/8) - Einschwingvorgang', route: '/learning/t4-driven-oscillations', queryParams: { page: '6', path: 'learn' } },
            { label: '(7/8) - Resonanzamplitude', route: '/learning/t4-driven-oscillations', queryParams: { page: '7', path: 'learn' } },
            { label: '(8/8) - Phasenverschiebung', route: '/learning/t4-driven-oscillations', queryParams: { page: '8', path: 'learn' } },
            { label: 'Simulation', route: '/simulation/sim-t-driven', queryParams: { path: 'sim' } },
            { label: 'Test', route: '/test/test-t-driven', queryParams: { path: 'test' }, testId: 't-driven-oscillations-test' },
        ]
    },
    SETUP_SEGMENT,
];

// Optional deep dives — reachable from both strands, shown as their own group.
const OPTIONAL_SEGMENTS: SegmentDef[] = [
    {
        id: 'opt-chaos', label: 'Chaos',
        subpages: [
            { label: '(1/2) - Nichtlineares Pendel', route: '/learning/opt-chaos', queryParams: { page: '1', path: 'learn' } },
            { label: '(2/2) - Bewegungsgleichung', route: '/learning/opt-chaos', queryParams: { page: '2', path: 'learn' } },
        ]
    },
    {
        id: 'opt-simulation', label: 'Simulation',
        subpages: [
            { label: '(1/1) - Numerische Methoden', route: '/learning/opt-simulation' },
        ]
    },
    SETUP_SEGMENT,
];

const TARGET_ROUTES = ['/target/tar-experiment', '/target/tar-theory', '/target/tar-chaos', '/target/tar-simulation'];

const TEST_ROWS = [...E_SEGMENTS, ...T_SEGMENTS].flatMap(seg => seg.subpages).filter(sub => sub.testId);


@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './nav-bar.html',
    styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit, OnDestroy {
    activeSegment: string | null = null;
    chosenStrand: 'e' | 't' | null = null;
    private segmentFlow: Map<string, 'learn' | 'sim' | 'test'> = new Map();
    private previousUrl: string = '';

    readonly eSegments = E_SEGMENTS;
    readonly tSegments = T_SEGMENTS;

    get strandSegments(): SegmentDef[] {
        return this.chosenStrand === 't' ? this.tSegments : this.chosenStrand === 'e' ? this.eSegments : [];
    }

    private routerSub: Subscription | null = null;

    constructor(
        public router: Router,
        public devMode: DevModeService,
        public drawer: NavDrawerService,
        private visited: VisitedPages,
        private testTracking: TestTracking,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const strand = localStorage.getItem(NAV_STRAND_KEY);
            if (strand === 'e' || strand === 't') this.chosenStrand = strand;
        }

        this.updateFromUrl(this.router.url);

        this.routerSub = this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe(e => {
                this.updateFromUrl(e.urlAfterRedirects);
                this.drawer.close();
            });
    }

    @HostListener('document:keydown.escape')
    onEscape() {
        this.drawer.close();
    }

    ngOnDestroy() {
        this.routerSub?.unsubscribe();
    }

    private updateFromUrl(url: string) {
        const prevPath = this.previousUrl.split('?')[0];
        this.activeSegment = this.segmentFromUrl(url);
        this.previousUrl = url;

        const currentPath = url.split('?')[0];
        let flow: 'learn' | 'sim' | 'test' | undefined;
        if (currentPath.startsWith('/simulation/')) flow = 'sim';
        else if (currentPath.startsWith('/test/')) flow = 'test';
        else if (currentPath.startsWith('/learning/')) flow = 'learn';

        const cameFromDecision = prevPath.startsWith('/decision/');
        const isFirstVisit = this.activeSegment !== null && !this.segmentFlow.has(this.activeSegment);
        if (this.activeSegment && flow && (cameFromDecision || isFirstVisit)) {
            this.segmentFlow.set(this.activeSegment, flow);
        }

        const strand = this.strandFromSegment(this.activeSegment);
        if (strand) {
            this.chosenStrand = strand;
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(NAV_STRAND_KEY, strand);
            }
        }
    }

    segmentFromUrl(url: string): string | null {
        const path = url.split('?')[0];
        if (path === '/' || path === '') return 'home';
        if (path.includes('/glossary')) return 'glossary';
        // Experimental strand
        if (path.startsWith('/learning/e1')) return 'e1-intro';
        if (path.startsWith('/learning/e2') || path === '/decision/dec-e-damped' ||
            path === '/test/test-e-damped' || path === '/simulation/sim-e-damped') return 'e2-damped';
        if (path.startsWith('/learning/e3') || path === '/decision/dec-e-driven' ||
            path === '/test/test-e-driven' || path === '/simulation/sim-e-driven') return 'e3-driven';
        // Theory strand
        if (path.startsWith('/learning/t1')) return 't1-intro';
        if (path.startsWith('/learning/t2') || path === '/simulation/sim-t-free') return 't2-free';
        if (path.startsWith('/learning/t3') || path === '/decision/dec-t-damped' ||
            path === '/test/test-t-damped' || path === '/simulation/sim-t-damped') return 't3-damped';
        if (path.startsWith('/learning/t4') || path === '/decision/dec-t-driven' ||
            path === '/test/test-t-driven' || path === '/simulation/sim-t-driven' ||
            path === '/simulation/sim-t-driven-advanced') return 't4-driven';
        if (path.startsWith('/learning/opt-chaos')) return 'opt-chaos';
        if (path.startsWith('/learning/opt-simulation')) return 'opt-simulation';
        if (path.startsWith('/learning/opt-setup')) return 'opt-setup';
        if (path.startsWith('/target/')) return 'anleitung';
        return null;
    }

    private strandFromSegment(seg: string | null): 'e' | 't' | null {
        if (!seg) return null;
        if (seg.startsWith('e')) return 'e';
        if (seg.startsWith('t')) return 't';
        return null;
    }

    getVisibleSubpages(seg: SegmentDef): SubpageItem[] {
        if (this.devMode.isEnabled) return seg.subpages;
        const flow = this.segmentFlow.get(seg.id) ?? 'learn';
        const path = (s: SubpageItem) => s.queryParams?.['path'];
        if (flow === 'test') {
            return seg.subpages.filter(s => path(s) === 'test' || this.isVisited(s));
        }
        if (flow === 'sim') {
            const sim   = seg.subpages.filter(s => path(s) === 'sim');
            const learn = seg.subpages.filter(s => path(s) !== 'sim' && path(s) !== 'test');
            const test  = seg.subpages.filter(s => path(s) === 'test' && this.isVisited(s));
            return [...sim, ...learn, ...test];
        }
        // 'learn' (default): learn + sim items, the test only once it was visited
        return seg.subpages.filter(s => path(s) !== 'test' || this.isVisited(s));
    }

    // Aufbau is a station of the theory line, so it isn't optional there
    get optionalSegments(): SegmentDef[] {
        return OPTIONAL_SEGMENTS.filter(seg => !(this.chosenStrand === 't' && T_SEGMENTS.includes(seg)));
    }

    // outside dev mode an optional segment (and its group headline) only shows while it is open
    isOptionalVisible(seg: SegmentDef): boolean {
        return this.devMode.isEnabled || this.activeSegment === seg.id;
    }

    get hasVisibleOptional(): boolean {
        return this.optionalSegments.some(seg => this.isOptionalVisible(seg));
    }

    // Reached: the path so far, drawn with filled markers and a dark line. Doesn't say the row can be opened.
    isVisited(sub: SubpageItem): boolean {
        return this.visited.has(sub.route, sub.queryParams?.['page']);
    }

    isSegmentReached(seg: SegmentDef): boolean {
        return this.activeSegment === seg.id
            || (!!seg.decisionRoute && this.visited.has(seg.decisionRoute))
            || seg.subpages.some(sub => this.isVisited(sub));
    }

    get isHomeReached(): boolean {
        return this.visited.has('/');
    }

    get isAnleitungReached(): boolean {
        return this.activeSegment === 'anleitung' || TARGET_ROUTES.some(route => this.visited.has(route));
    }

    // A test can be reopened and has no route guard: while it is unfinished, no row may lead to a page with the answers.
    get isTestLocked(): boolean {
        if (this.devMode.isEnabled) return false;
        const path = this.router.url.split('?')[0];
        const test = TEST_ROWS.find(sub => sub.route === path);
        return !!test && !this.testTracking.isTestFinished(test.testId!);
    }

    // Clickable: outside dev mode only the sub-pages of the current chapter (the only ones listed) that were visited.
    // A test left unfinished stays closed, like its decision page keeps it closed (testDisabled).
    canOpen(sub: SubpageItem): boolean {
        if (this.devMode.isEnabled) return true;
        if (this.isTestLocked || !this.isVisited(sub)) return false;
        return !sub.testId || this.testTracking.isTestFinished(sub.testId);
    }

    isSubpageActive(sub: SubpageItem): boolean {
        const url = this.router.url;
        const path = url.split('?')[0];
        if (path !== sub.route) return false;
        if (sub.queryParams?.['page']) {
            const match = url.match(/[?&]page=([^&]*)/);
            const activePage = match ? match[1] : '1'; // no param → component defaults to page 1
            return activePage === sub.queryParams['page'];
        }
        return true;
    }

    navigateToSubpage(sub: SubpageItem) {
        if (!this.canOpen(sub) || this.isSubpageActive(sub)) return;
        // within a page the URL keeps what the page came with (flow)
        const samePage = this.router.url.split('?')[0] === sub.route;
        this.router.navigate([sub.route], { queryParams: sub.queryParams ?? {}, queryParamsHandling: samePage ? 'merge' : '' });
    }

    onSegmentClick(seg: SegmentDef) {
        if (!this.devMode.isEnabled) return;
        const first = seg.subpages[0];
        if (first) this.navigateToSubpage(first);
    }

    switchStrand(strand: 'e' | 't') {
        if (!this.devMode.isEnabled) return;
        const segments = strand === 'e' ? this.eSegments : this.tSegments;
        const firstSub = segments[0]?.subpages[0];
        if (firstSub) this.navigateToSubpage(firstSub);
    }

    goHome() {
        if (!this.devMode.isEnabled) return;
        this.router.navigate(['/']);
    }

    goGlossary() {
        if (!this.devMode.isEnabled) return;
        this.router.navigate(['/glossary']);
    }

    get isOnDecisionPage(): boolean {
        return this.router.url.split('?')[0].startsWith('/decision/');
    }

    get anleitungRoute(): string {
        return this.chosenStrand === 't' ? '/target/tar-theory' : '/target/tar-experiment';
    }

    @HostBinding('style.visibility')
    get hostVisibility(): string {
        return (this.activeSegment === 'home') ? 'hidden' : '';
    }

    // the page grid drops the nav's column for this (styles.css)
    @HostBinding('class.nav-hidden')
    get isHidden(): boolean {
        return this.activeSegment === 'home';
    }

    goAnleitung() {
        if (!this.devMode.isEnabled) return;
        this.router.navigate([this.anleitungRoute]);
    }
}
