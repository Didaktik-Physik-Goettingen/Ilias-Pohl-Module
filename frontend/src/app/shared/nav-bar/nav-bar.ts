import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostBinding } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DevModeService } from '../../core/services/dev-mode';


interface SubpageItem {
    label: string;
    route: string;
    queryParams?: Record<string, string>;
}

interface SegmentDef {
    id: string;
    label: string;
    strand: 'e' | 't';
    subpages: SubpageItem[];
    conditional?: boolean;
}


const E_SEGMENTS: SegmentDef[] = [
    {
        id: 'e1-intro', label: 'Einstieg Versuchaufbau', strand: 'e',
        subpages: [
            { label: '(1/4) - Einführung', route: '/learning/e1-intro-experiment', queryParams: { page: '1' } },
            { label: '(2/4) - Komponenten', route: '/learning/e1-intro-experiment', queryParams: { page: '2' } },
            { label: '(3/4) - Direktionsmoment', route: '/learning/e1-intro-experiment', queryParams: { page: '3' } },
            { label: '(4/4) - Winkel-Zeit', route: '/learning/e1-intro-experiment', queryParams: { page: '4' } },
        ]
    },
    {
        id: 'e2-damped', label: 'Gedämpfte Schwingungen', strand: 'e',
        subpages: [
            { label: '(1/4) - Grundlagen', route: '/learning/e2-damped-oscillations', queryParams: { page: '1' } },
            { label: '(2/4) - Lösung der Differentialgleichung', route: '/learning/e2-damped-oscillations', queryParams: { page: '2' } },
            { label: '(3/4) - Logarithmisches Dekrement', route: '/learning/e2-damped-oscillations', queryParams: { page: '3' } },
            { label: 'Simulation', route: '/simulation/sim-e-damped' },
            { label: 'Test', route: '/test/test-e-damped' },
        ]
    },
    {
        id: 'e3-driven', label: 'Getriebene Schwingungen', strand: 'e',
        subpages: [
            { label: '(1/7) - Versuchsaufbau', route: '/learning/e3-driven-oscillations', queryParams: { page: '1' } },
            { label: '(2/7) - Lösungsansatz', route: '/learning/e3-driven-oscillations', queryParams: { page: '2' } },
            { label: '(3/7) - Einschwingvorgang', route: '/learning/e3-driven-oscillations', queryParams: { page: '3' } },
            { label: '(4/7) - Amplitude im Stationärzustand', route: '/learning/e3-driven-oscillations', queryParams: { page: '4' } },
            { label: '(5/7) - Resonanz', route: '/learning/e3-driven-oscillations', queryParams: { page: '5' } },
            { label: '(6/7) - Vorbereitung', route: '/learning/e3-driven-oscillations', queryParams: { page: '6' } },
            { label: '(7/7) - Phasenverschiebung', route: '/learning/e3-driven-oscillations', queryParams: { page: '7' } },
            { label: 'Simulation', route: '/simulation/sim-e-driven' },
            { label: 'Test', route: '/test/test-e-driven' },
        ]
    },
];

const T_SEGMENTS: SegmentDef[] = [
    {
        id: 't1-intro', label: 'Einstieg Theorie', strand: 't',
        subpages: [
            { label: '(1/1) - Grundlagen', route: '/learning/t1-intro-theory' },
        ]
    },
    {
        id: 't2-free', label: 'Freie Schwingungen', strand: 't',
        subpages: [
            { label: '(1/2) - Differentialgleichung und Lösungsansatz', route: '/learning/t2-free-oscillations', queryParams: { page: '1' } },
            { label: '(2/2) - Phasenraum', route: '/learning/t2-free-oscillations', queryParams: { page: '2' } },
            { label: 'Simulation', route: '/simulation/sim-t-undamped' },
        ]
    },
    {
        id: 't3-damped', label: 'Gedämpfte Schwingungen', strand: 't',
        subpages: [
            { label: '(1/5) - Exponentialansatz', route: '/learning/t3-damped-oscillations', queryParams: { page: '1' } },
            { label: '(2/5) - Schwingfall', route: '/learning/t3-damped-oscillations', queryParams: { page: '2' } },
            { label: '(3/5) - Kriechfall', route: '/learning/t3-damped-oscillations', queryParams: { page: '3' } },
            { label: '(4/5) - Aperiodischer Grenzfall', route: '/learning/t3-damped-oscillations', queryParams: { page: '4' } },
            { label: '(5/5) - Zusammenfassung', route: '/learning/t3-damped-oscillations', queryParams: { page: '5' } },
            { label: 'Simulation', route: '/simulation/sim-t-damped' },
            { label: 'Test', route: '/test/test-t-damped' },
        ]
    },
    {
        id: 't4-driven', label: 'Getriebene Schwingungen', strand: 't',
        subpages: [
            { label: '(1/8) - Differentialgleichung', route: '/learning/t4-driven-oscillations', queryParams: { page: '1' } },
            { label: '(2/8) - Gesamtlösung', route: '/learning/t4-driven-oscillations', queryParams: { page: '2' } },
            { label: '(3/8) - Stationäre Lösung', route: '/learning/t4-driven-oscillations', queryParams: { page: '3' } },
            { label: '(4/8) - Partikuläre Lösung', route: '/learning/t4-driven-oscillations', queryParams: { page: '4' } },
            { label: '(5/8) - Dämpfungsfälle', route: '/learning/t4-driven-oscillations', queryParams: { page: '5' } },
            { label: '(6/8) - Einschwingvorgang', route: '/learning/t4-driven-oscillations', queryParams: { page: '6' } },
            { label: '(7/8) - Resonanzamplitude', route: '/learning/t4-driven-oscillations', queryParams: { page: '7' } },
            { label: '(8/8) - Phasenverschiebung', route: '/learning/t4-driven-oscillations', queryParams: { page: '8' } },
            { label: 'Simulation', route: '/simulation/sim-t-driven' },
            { label: 'Test', route: '/test/test-t-driven' },
        ]
    },
    {
        id: 't-chaos', label: 'Chaos', strand: 't', conditional: true,
        subpages: [
            { label: '(1/2) - Nichtlineares Pendel', route: '/learning/t-chaos', queryParams: { page: '1' } },
            { label: '(2/2) - Bewegungsgleichung', route: '/learning/t-chaos', queryParams: { page: '2' } },
        ]
    },
    {
        id: 't-simulation', label: 'Simulation', strand: 't', conditional: true,
        subpages: [
            { label: '(1/1) - Numerische Methoden', route: '/learning/t-simulation' },
        ]
    },
    {
        id: 't-setup', label: 'Aufbau', strand: 't', conditional: true,
        subpages: [
            { label: '(1/1) Versuchsaufbau', route: '/learning/t-setup' },
        ]
    },
];


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
    visitedConditionalT: Set<string> = new Set();

    readonly eSegments = E_SEGMENTS;
    readonly tSegments = T_SEGMENTS;

    private routerSub: Subscription | null = null;
    private readonly STRAND_KEY = 'nav-chosen-strand';
    private readonly VISITED_CONDITIONAL_KEY = 'nav-visited-conditional-t';

    constructor(
        public router: Router,
        public devMode: DevModeService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const strand = localStorage.getItem(this.STRAND_KEY);
            if (strand === 'e' || strand === 't') this.chosenStrand = strand;

            try {
                const visited = localStorage.getItem(this.VISITED_CONDITIONAL_KEY);
                if (visited) JSON.parse(visited).forEach((id: string) => this.visitedConditionalT.add(id));
            } catch {}
        }

        this.updateFromUrl(this.router.url);

        this.routerSub = this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe(e => this.updateFromUrl(e.urlAfterRedirects));
    }

    ngOnDestroy() {
        this.routerSub?.unsubscribe();
    }

    private updateFromUrl(url: string) {
        this.activeSegment = this.segmentFromUrl(url);
        const strand = this.strandFromSegment(this.activeSegment);
        if (strand) {
            this.chosenStrand = strand;
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(this.STRAND_KEY, strand);
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
        if (path.startsWith('/learning/t2') || path === '/simulation/sim-t-undamped') return 't2-free';
        if (path.startsWith('/learning/t3') || path === '/decision/dec-t-damped' ||
            path === '/test/test-t-damped' || path === '/simulation/sim-t-damped') return 't3-damped';
        if (path.startsWith('/learning/t4') || path === '/decision/dec-t-driven' ||
            path === '/test/test-t-driven' || path === '/simulation/sim-t-driven' ||
            path === '/simulation/sim-t-driven-advanced') return 't4-driven';
        if (path.startsWith('/learning/t-chaos')) return 't-chaos';
        if (path.startsWith('/learning/t-simulation')) return 't-simulation';
        if (path.startsWith('/learning/t-setup')) return 't-setup';
        if (path.startsWith('/target/')) return 'anleitung';
        return null;
    }

    private strandFromSegment(seg: string | null): 'e' | 't' | null {
        if (!seg) return null;
        if (seg.startsWith('e')) return 'e';
        if (seg.startsWith('t')) return 't';
        return null;
    }

    isSegmentVisible(seg: SegmentDef): boolean {
        if (!seg.conditional) return true;
        if (this.devMode.isEnabled) return true;
        return this.activeSegment === seg.id;
    }

    getSegmentClass(seg: SegmentDef): Record<string, boolean> {
        const isActive = this.activeSegment === seg.id;
        return {
            'seg-active': isActive,
            'seg-dev': this.devMode.isEnabled && !isActive,
        };
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
        if (!this.devMode.isEnabled) return;
        this.router.navigate([sub.route], { queryParams: sub.queryParams ?? {} });
    }

    onSegmentClick(seg: SegmentDef) {
        if (!this.devMode.isEnabled) return;
        const first = seg.subpages[0];
        if (first) this.navigateToSubpage(first);
    }

    switchStrand(strand: 'e' | 't') {
        if (!this.devMode.isEnabled) return;
        const segments = strand === 'e'
            ? this.eSegments
            : this.tSegments.filter(s => this.isSegmentVisible(s));
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

    get anleitungRoute(): string {
        return this.chosenStrand === 't' ? '/target/tar-theory' : '/target/tar-experiment';
    }

    @HostBinding('style.visibility')
    get hostVisibility(): string {
        return (!this.devMode.isEnabled && this.activeSegment === 'home') ? 'hidden' : '';
    }

    get isAnleitungClickable(): boolean {
        return this.devMode.isEnabled || this.activeSegment === 'anleitung';
    }

    goAnleitung() {
        if (this.isAnleitungClickable) {
            this.router.navigate([this.anleitungRoute]);
        }
    }
}
