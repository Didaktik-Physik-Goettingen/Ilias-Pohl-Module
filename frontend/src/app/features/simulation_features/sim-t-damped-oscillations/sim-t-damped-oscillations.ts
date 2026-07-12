import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DevModeService } from '../../../core/services/dev-mode';
import { FormsModule } from '@angular/forms';

declare global { interface Window { MathJax: any; } }

interface Point { x: number; y: number; alpha: number; }
interface Vec2  { x: number; y: number; }

@Component({
    selector: 'app-sim-t-damped-oscillations',
    imports: [FormsModule],
    templateUrl: './sim-t-damped-oscillations.html',
    styleUrl: './sim-t-damped-oscillations.css',
    host: { ngSkipHydration: 'true' },
})
export class SimTDampedOscillations implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('canPend')  canPendRef!:  ElementRef<HTMLCanvasElement>;
    @ViewChild('canTime')  canTimeRef!:  ElementRef<HTMLCanvasElement>;
    @ViewChild('canPhase') canPhaseRef!: ElementRef<HTMLCanvasElement>;

    private canPend!:  HTMLCanvasElement;
    private canTime!:  HTMLCanvasElement;
    private canPhase!: HTMLCanvasElement;
    private ctxPend!:  CanvasRenderingContext2D;
    private ctxTime!:  CanvasRenderingContext2D;
    private ctxPhase!: CanvasRenderingContext2D;

    springConstant   = 2.0;
    dampingConstant  = 0.1;
    initialX         = 20;
    initialVelocity  = 0.0;

    showPhase        = false;
    dynamicMode      = true;
    startButtonLabel = 'Start';

    private isRunning = false;
    private firstRun  = true;
    private interactionCount = 0;
    private raf = 0;

    private readonly state = {
        k: 2, m: 1, dt: 0.03, dx: 20,
        t: 0, y0: 20, v0: 0, omega: Math.sqrt(2), gamma: 0.1,
        pointsTime:  [] as Point[],
        pointsPhase: [] as Point[],
    };
    private prevPointsTime:  Point[] = [];
    private prevPointsPhase: Point[] = [];

    navigationFlow = '';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        public devMode: DevModeService,
    ) {}

    ngOnInit() { this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? ''; }

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;
        this.canPend  = this.canPendRef.nativeElement;
        this.canTime  = this.canTimeRef.nativeElement;
        this.canPhase = this.canPhaseRef.nativeElement;
        this.ctxPend  = this.canPend.getContext('2d')!;
        this.ctxTime  = this.canTime.getContext('2d')!;
        this.ctxPhase = this.canPhase.getContext('2d')!;
        this.drawAxes(this.ctxTime,  this.canTime,  't',    'x(t)', this.state.dx,             this.canTime.height * 0.5);
        this.drawAxes(this.ctxPhase, this.canPhase, 'x(t)', 'ẋ(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
        this.drawPendulum(0);
        this.renderMath();
    }

    ngOnDestroy() { if (this.raf) cancelAnimationFrame(this.raf); }

    goBack() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.location.back();
    }

    goForward() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.navigationFlow !== 'learning-first') {
            this.router.navigate(['/learning/t3-damped-oscillations']);
        } else {
            this.router.navigate(['/decision/t-driven-oscillations']);
        }
    }

    renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    document.querySelectorAll('.MathJax').forEach(el => el.remove());
                    window.MathJax.typesetPromise();
                }
            }, 100);
        }
    }

    onStartClick() {
        this.interactionCounter();
        if (!this.isRunning) {
            if (this.firstRun) { this.reset(); this.firstRun = false; }
            this.isRunning = true;
            this.raf = requestAnimationFrame(this.step);
            this.startButtonLabel = 'Stop';
        } else {
            this.isRunning = false;
            if (this.raf) cancelAnimationFrame(this.raf);
            this.startButtonLabel = 'Start';
        }
    }

    onResetClick() {
        if (this.dynamicMode) {
            this.interactionCounter();
            if (this.raf) cancelAnimationFrame(this.raf);
            this.savePrev(); this.reset();
            if (this.isRunning) this.raf = requestAnimationFrame(this.step);
        } else {
            this.reset(); this.drawFunctions();
        }
    }

    onDynamicToggle() {
        if (!this.dynamicMode) {
            if (this.raf) cancelAnimationFrame(this.raf);
            this.isRunning = false; this.startButtonLabel = 'Start';
            this.reset(); this.drawFunctions();
        } else {
            this.reset();
        }
    }

    onTogglePhase() {
        this.interactionCounter();
        if (this.showPhase) this.drawAxes(this.ctxPhase, this.canPhase, 'x(t)', 'ẋ(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
    }

    onParameterChange() { if (!this.dynamicMode) { this.reset(); this.drawFunctions(); } }

    get interactionThresholdReached(): boolean { return this.interactionCount > 8; }
    private interactionCounter() { if (this.interactionCount <= 8) this.interactionCount++; }

    private reset() {
        this.state.y0    = this.initialX;
        this.state.v0    = this.initialVelocity;
        this.state.k     = this.springConstant;
        this.state.gamma = this.dampingConstant;
        this.state.omega = Math.sqrt(this.state.k / this.state.m);
        this.state.t = 0;
        this.state.pointsTime  = [];
        this.state.pointsPhase = [];
        this.drawAxes(this.ctxTime, this.canTime, 't', 'x(t)', this.state.dx, this.canTime.height * 0.5);
        if (this.showPhase) this.drawAxes(this.ctxPhase, this.canPhase, 'x(t)', 'ẋ(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
        this.drawPendulum(0);
    }

    private computePhysics(t: number) {
        const w = this.state.omega, safeW = w === 0 ? 1e-12 : w;
        const decay = Math.exp(-this.state.gamma * t);
        const x = (this.state.y0 * Math.cos(w * t) + (this.state.v0 / safeW) * Math.sin(w * t)) * decay;
        const v = (-this.state.y0 * w * Math.sin(w * t) + this.state.v0 * Math.cos(w * t)) * decay - this.state.gamma * x;
        return { x, v };
    }

    private readonly step = () => {
        if (!this.isRunning) return;
        const { x, v } = this.computePhysics(this.state.t);

        this.drawAxes(this.ctxTime, this.canTime, 't', 'x(t)', this.state.dx, this.canTime.height * 0.5);
        this.state.pointsTime.push({ x: this.state.dx + 10 * this.state.t, y: this.canTime.height * 0.5 - x, alpha: 1 });
        this.drawFadingPoints(this.ctxTime, this.state.pointsTime, '50,50,255', 3, 0.05);
        this.drawTrail(this.ctxTime, this.state.pointsTime, 'black');
        this.drawPrevTime();

        if (this.showPhase) {
            this.drawAxes(this.ctxPhase, this.canPhase, 'x(t)', 'ẋ(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
            this.state.pointsPhase.push({ x: this.canPhase.width * 0.5 + x, y: this.canPhase.height * 0.5 + v, alpha: 1 });
            this.drawFadingPoints(this.ctxPhase, this.state.pointsPhase, '50,50,255', 3, 0.05);
            this.drawFadingTrail(this.ctxPhase, this.state.pointsPhase, 'black');
            this.drawPrevPhase();
        }
        this.drawPendulum(x);

        if (this.state.dx + 10 * this.state.t < 0.94 * this.canTime.width) {
            this.state.t += this.state.dt;
            this.raf = requestAnimationFrame(this.step);
        } else {
            this.isRunning = false; this.firstRun = true; this.savePrev(); this.startButtonLabel = 'Restart';
        }
    };

    private savePrev() {
        if (this.state.pointsTime.length  > 0) this.prevPointsTime  = this.state.pointsTime.slice();
        if (this.state.pointsPhase.length > 0) this.prevPointsPhase = this.state.pointsPhase.slice();
    }

    private drawFunctions() {
        this.interactionCounter();
        const pts: Point[] = [], ptsPh: Point[] = [];
        let t = 0;
        while (this.state.dx + 10 * t < 0.94 * this.canTime.width) {
            const { x, v } = this.computePhysics(t);
            pts.push({ x: this.state.dx + 10 * t, y: this.canTime.height * 0.5 - x, alpha: 1 });
            if (this.showPhase) ptsPh.push({ x: this.canPhase.width * 0.5 + x, y: this.canPhase.height * 0.5 + v, alpha: 1 });
            t += this.state.dt;
        }
        this.drawAxes(this.ctxTime, this.canTime, 't', 'x(t)', this.state.dx, this.canTime.height * 0.5);
        this.drawTrail(this.ctxTime, pts, 'black');
        if (this.showPhase) {
            this.drawAxes(this.ctxPhase, this.canPhase, 'x(t)', 'ẋ(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
            this.drawTrail(this.ctxPhase, ptsPh, 'black');
        }
    }

    private drawPrevTime()  { if (this.prevPointsTime.length  >= 2) this.drawTrail(this.ctxTime,  this.prevPointsTime,  'rgba(130,130,130,0.6)'); }
    private drawPrevPhase() { if (this.prevPointsPhase.length >= 2) this.drawTrail(this.ctxPhase, this.prevPointsPhase, 'rgba(130,130,130,0.6)'); }

    private arrowhead(ctx: CanvasRenderingContext2D, from: Vec2, to: Vec2, r = 6) {
        const ang = Math.atan2(to.y - from.y, to.x - from.x);
        ctx.strokeStyle = '#000'; ctx.fillStyle = '#000'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const a = ang + i * (2 * Math.PI / 3);
            i === 0 ? ctx.moveTo(to.x + r * Math.cos(a), to.y + r * Math.sin(a))
                    : ctx.lineTo(to.x + r * Math.cos(a), to.y + r * Math.sin(a));
        }
        ctx.closePath(); ctx.fill();
    }

    private drawAxes(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, xLabel: string, yLabel: string, xpos: number, ypos: number) {
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#000'; ctx.fillStyle = '#000'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0.05 * w, ypos); ctx.lineTo(0.95 * w, ypos); ctx.stroke();
        this.arrowhead(ctx, { x: 0.05 * w, y: ypos }, { x: 0.95 * w, y: ypos });
        ctx.beginPath(); ctx.moveTo(xpos, 0.9 * h); ctx.lineTo(xpos, 0.1 * h); ctx.stroke();
        this.arrowhead(ctx, { x: xpos, y: 0.9 * h }, { x: xpos, y: 0.1 * h });
        ctx.font = '16px Arial';
        ctx.fillText(xLabel, 0.92 * w, 0.54 * h);
        ctx.fillText(yLabel, xpos + 8, 0.12 * h);
    }

    private drawTrail(ctx: CanvasRenderingContext2D, pts: Point[], color = 'black') {
        if (pts.length < 2) return;
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
    }

    private drawFadingTrail(ctx: CanvasRenderingContext2D, pts: Point[], color = 'black', fade = 0.05, fadeStart = 400) {
        if (pts.length < 2) return;
        if (pts.length < fadeStart) { this.drawTrail(ctx, pts, color); return; }
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        for (let i = 1; i < fadeStart; i++) ctx.lineTo(pts[pts.length - 1 - i].x, pts[pts.length - 1 - i].y);
        ctx.stroke();
        let lw = 2;
        for (let i = fadeStart; i < pts.length && lw > 0; i++) {
            ctx.beginPath();
            ctx.moveTo(pts[pts.length - i].x, pts[pts.length - i].y);
            ctx.lineTo(pts[pts.length - 1 - i].x, pts[pts.length - 1 - i].y);
            ctx.strokeStyle = color; ctx.lineWidth = lw; lw = Math.max(0, lw - fade); ctx.stroke();
        }
    }

    private drawFadingPoints(ctx: CanvasRenderingContext2D, pts: Point[], color = '50,50,255', radius = 3, fade = 0.05) {
        for (const p of pts) {
            ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(${color}, ${p.alpha})`; ctx.fill();
            p.alpha = Math.max(0, p.alpha - fade);
        }
    }

    private drawSpiralLinear(ctx: CanvasRenderingContext2D, a: Vec2, b: Vec2) {
        const steps = 60, turns = 5, inc = 2 * Math.PI / steps;
        let theta = 0, x = a.x, y = a.y;
        const progress = (b.y - a.y) / (turns * steps);
        ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(a.x, a.y);
        for (let i = 0; i < turns * steps; i++) {
            x += 3 * Math.cos(theta); y += 0.7 * Math.sin(theta) + progress;
            ctx.lineTo(x, y); theta += inc;
        }
        ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    private drawPendulum(yOsc: number) {
        const xC = this.canPend.width * 0.5, yC = this.canPend.height * 0.5 - yOsc;
        this.ctxPend.clearRect(0, 0, this.canPend.width, this.canPend.height);
        this.drawSpiralLinear(this.ctxPend, { x: xC, y: 0 }, { x: xC, y: yC });
        this.ctxPend.beginPath(); this.ctxPend.fillStyle = '#0057c1';
        this.ctxPend.arc(xC, yC, 8, 0, 2 * Math.PI); this.ctxPend.fill();
    }
}
