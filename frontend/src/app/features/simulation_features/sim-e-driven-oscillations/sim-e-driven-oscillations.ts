import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare global {
    interface Window {
        MathJax: any;
    }
}

interface Point {
    x: number;
    y: number;
    alpha: number;
}

interface Vec2 {
    x: number;
    y: number;
}

@Component({
    selector: 'app-sim-e-driven-oscillations',
    imports: [FormsModule],
    templateUrl: './sim-e-driven-oscillations.html',
    styleUrl: './sim-e-driven-oscillations.css',
    host: { ngSkipHydration: 'true' },
})
export class SimEDrivenOscillations implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('canPend')    canPendRef!:    ElementRef<HTMLCanvasElement>;
    @ViewChild('canRotPend') canRotPendRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('canTime')    canTimeRef!:    ElementRef<HTMLCanvasElement>;
    @ViewChild('canPhase')   canPhaseRef!:   ElementRef<HTMLCanvasElement>;

    private canPend!:    HTMLCanvasElement;
    private canRotPend!: HTMLCanvasElement;
    private canTime!:    HTMLCanvasElement;
    private canPhase!:   HTMLCanvasElement;
    private ctxPend!:    CanvasRenderingContext2D;
    private ctxRot!:     CanvasRenderingContext2D;
    private ctxTime!:    CanvasRenderingContext2D;
    private ctxPhase!:   CanvasRenderingContext2D;

    // slider-bound parameters
    dampingConstant = 0.1;
    springConstant  = 2.0;
    motorAmplitude  = 0;
    motorOmega      = 2.0;
    initialAngle    = 20;
    initialVelocity = 0.0;

    // toolbar state
    showPendulum    = false;
    showRotPendulum = true;
    showTimeDiagram = true;
    showPhase       = false;
    showMotor       = true;   // true = show motor (red); false = show solution parts (green/blue)
    dynamicMode     = true;
    startButtonLabel = 'Start';

    private wasPendulumVisible    = false;
    private wasRotPendulumVisible = true;
    private wasPhaseVisible       = false;
    private isRunning  = false;
    private firstRun   = true;
    private interactionCount = 0;
    private raf = 0;

    private readonly state = {
        k: 2, m: 1, dt: 0.03, dx: 20,
        t: 0, y0: 20, v0: 0,
        omega: Math.sqrt(2), gamma: 0,
        alpha0: 20 / (2 * Math.PI), omega0: 0,
        alpha0Motor: 0, omega0Motor: 0,
        motorA: 0, motorOmega: 2,
        pointsTime:      [] as Point[],
        pointsTimeMotor: [] as Point[],
        pointsTimeHom:   [] as Point[],
        pointsTimeInhom: [] as Point[],
        pointsPhase:     [] as Point[],
    };

    private prevPointsTime:  Point[] = [];
    private prevPointsPhase: Point[] = [];

    navigationFlow: string = '';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.navigationFlow = this.route.snapshot.queryParamMap.get('flow') ?? '';
    }

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.canPend    = this.canPendRef.nativeElement;
        this.canRotPend = this.canRotPendRef.nativeElement;
        this.canTime    = this.canTimeRef.nativeElement;
        this.canPhase   = this.canPhaseRef.nativeElement;
        this.ctxPend    = this.canPend.getContext('2d')!;
        this.ctxRot     = this.canRotPend.getContext('2d')!;
        this.ctxTime    = this.canTime.getContext('2d')!;
        this.ctxPhase   = this.canPhase.getContext('2d')!;

        this.drawAxes(this.ctxTime,  this.canTime,  't',    'φ(t)', this.state.dx,              this.canTime.height  * 0.5);
        this.drawAxes(this.ctxPhase, this.canPhase, 'φ(t)', 'ω(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
        this.drawPohl(0, 0);
        this.renderMath();
    }

    ngOnDestroy() {
        if (this.raf) cancelAnimationFrame(this.raf);
    }

    goBack() { this.location.back(); }

    goForward() {
        if (this.navigationFlow === 'sim-first') {
            this.router.navigate(['/learning/e3-driven-oscillations'], { queryParams: { flow: 'sim-first' } });
        } else {
            this.router.navigate(['/target/tar-experiment']);
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

    // ── UI event handlers ────────────────────────────────────────────────

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
            this.savePrev();
            this.reset();
            if (this.isRunning) this.raf = requestAnimationFrame(this.step);
        } else {
            this.reset();
            this.drawFunctions();
        }
    }

    onDynamicToggle() {
        if (!this.dynamicMode) {
            if (this.raf) cancelAnimationFrame(this.raf);
            this.isRunning = false;
            this.startButtonLabel = 'Start';
            this.wasPendulumVisible    = this.showPendulum;
            this.wasRotPendulumVisible = this.showRotPendulum;
            this.wasPhaseVisible       = this.showPhase;
            this.showPendulum    = false;
            this.showRotPendulum = false;
            this.reset();
            this.drawFunctions();
        } else {
            this.showPendulum    = this.wasPendulumVisible;
            this.showRotPendulum = this.wasRotPendulumVisible;
            this.showPhase       = this.wasPhaseVisible;
            this.reset();
        }
    }

    onToggleCanvas(which: 'pend' | 'rot' | 'time' | 'phase') {
        this.interactionCounter();
        if      (which === 'time'  && this.showTimeDiagram) this.drawAxes(this.ctxTime,  this.canTime,  't',    'φ(t)', this.state.dx,             this.canTime.height  * 0.5);
        else if (which === 'phase' && this.showPhase)       this.drawAxes(this.ctxPhase, this.canPhase, 'φ(t)', 'ω(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
        else if (which === 'pend'  && this.showPendulum)    this.drawPendulum(0);
        else if (which === 'rot'   && this.showRotPendulum) this.drawPohl(0, 0);
    }

    onMotorToggle() {
        if (!this.dynamicMode) { this.reset(); this.drawFunctions(); }
    }

    onParameterChange() {
        if (!this.dynamicMode) { this.reset(); this.drawFunctions(); }
    }

    // ── interaction threshold — unlocks the continue button ──────────────

    get interactionThresholdReached(): boolean { return this.interactionCount > 8; }

    private interactionCounter() {
        if (this.interactionCount <= 8) this.interactionCount += 1;
    }

    // ── physics ──────────────────────────────────────────────────────────

    private reset() {
        this.state.y0         = this.initialAngle;
        this.state.v0         = this.initialVelocity;
        this.state.k          = this.springConstant;
        this.state.gamma      = this.dampingConstant;
        this.state.omega      = Math.sqrt(this.state.k / this.state.m);
        this.state.motorA     = this.motorAmplitude;
        this.state.motorOmega = this.motorOmega;
        this.state.alpha0      = this.state.y0       / 360 * 2 * Math.PI;
        this.state.omega0      = this.state.v0       / (2 * Math.PI * 100);
        this.state.alpha0Motor = this.state.motorA   / (2 * Math.PI * 20);
        this.state.omega0Motor = this.state.motorOmega / (2 * Math.PI * 100);

        this.state.t             = 0;
        this.state.pointsTime    = [];
        this.state.pointsTimeMotor = [];
        this.state.pointsTimeHom   = [];
        this.state.pointsTimeInhom = [];
        this.state.pointsPhase   = [];

        if (this.showTimeDiagram) this.drawAxes(this.ctxTime,  this.canTime,  't',    'φ(t)', this.state.dx,             this.canTime.height  * 0.5);
        if (this.showPhase)       this.drawAxes(this.ctxPhase, this.canPhase, 'φ(t)', 'ω(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
        if (this.showPendulum)    this.drawPendulum(0);
        if (this.showRotPendulum) this.drawPohl(0, 0);
    }

    private computePhysics(t: number) {
        const w      = this.state.omega;
        const safeW  = w === 0 ? 1e-12 : w;
        const mOmega = this.state.motorOmega;

        const xi    = w * w - mOmega * mOmega;
        const B_abs = 1 / Math.sqrt(xi * xi + 4 * this.state.gamma * this.state.gamma * mOmega * mOmega);
        let phi_0   = Math.atan((2 * mOmega * this.state.gamma) / xi);
        if (w > mOmega) phi_0 += Math.PI;

        const xmotor  = this.state.motorA      * Math.cos(mOmega * t);
        const almotor = this.state.alpha0Motor * Math.cos(mOmega * t);

        const x_hom   = (this.state.y0 * Math.cos(w * t) + (this.state.v0 / safeW) * Math.sin(w * t)) * Math.exp(-this.state.gamma * t);
        const x_inhom = -this.state.motorA * B_abs * Math.cos(mOmega * t - phi_0);
        const x       = x_hom + x_inhom;
        const v       = (-this.state.y0 * w * Math.sin(w * t) + this.state.v0 * Math.cos(w * t)) * Math.exp(-this.state.gamma * t)
                      + x_hom * (-this.state.gamma)
                      + this.state.motorA * B_abs * mOmega * Math.sin(mOmega * t - phi_0);
        const al      = (this.state.alpha0 * Math.cos(w * t) + (this.state.omega0 / safeW) * Math.sin(w * t)) * Math.exp(-this.state.gamma * t)
                      - this.state.alpha0Motor * B_abs * Math.cos(mOmega * t - phi_0);

        return { x, x_hom, x_inhom, v, al, xmotor, almotor };
    }

    private readonly step = () => {
        if (!this.isRunning) return;

        const t    = this.state.t;
        const phys = this.computePhysics(t);

        if (this.showTimeDiagram) {
            this.drawAxes(this.ctxTime, this.canTime, 't', 'φ(t)', this.state.dx, this.canTime.height * 0.5);
            const xPix = this.state.dx + 10 * t;
            this.state.pointsTimeMotor.push({ x: xPix, y: this.canTime.height * 0.5 - phys.xmotor,   alpha: 0.5 });
            this.state.pointsTimeHom.push(  { x: xPix, y: this.canTime.height * 0.5 - phys.x_hom,   alpha: 0.5 });
            this.state.pointsTimeInhom.push({ x: xPix, y: this.canTime.height * 0.5 - phys.x_inhom, alpha: 0.5 });
            this.state.pointsTime.push(     { x: xPix, y: this.canTime.height * 0.5 - phys.x,       alpha: 1   });
            if (this.showMotor) {
                this.drawTrail(this.ctxTime, this.state.pointsTimeMotor, '#ff6666');
            } else {
                this.drawTrail(this.ctxTime, this.state.pointsTimeHom,   'green');
                this.drawTrail(this.ctxTime, this.state.pointsTimeInhom, 'blue');
            }
            this.drawFadingPoints(this.ctxTime, this.state.pointsTime, '50,50,255', 3, 0.05);
            this.drawTrail(this.ctxTime, this.state.pointsTime, 'black');
            this.drawPrevTime();
        }

        if (this.showPhase) {
            this.drawAxes(this.ctxPhase, this.canPhase, 'φ(t)', 'ω(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
            const px = this.canPhase.width  * 0.5 + phys.x;
            const py = this.canPhase.height * 0.5 + phys.v;
            this.state.pointsPhase.push({ x: px, y: py, alpha: 1 });
            this.drawFadingPoints(this.ctxPhase, this.state.pointsPhase, '50,50,255', 3, 0.05);
            this.drawFadingTrail(this.ctxPhase, this.state.pointsPhase, 'black');
            this.drawPrevPhase();
        }

        if (this.showPendulum)    this.drawPendulum(phys.x);
        if (this.showRotPendulum) this.drawPohl(phys.al, phys.almotor);

        const xPixNext = this.state.dx + 10 * this.state.t;
        if (xPixNext < 0.94 * this.canTime.width) {
            this.state.t += this.state.dt;
            this.raf = requestAnimationFrame(this.step);
        } else {
            this.isRunning = false;
            this.firstRun  = true;
            this.savePrev();
            this.startButtonLabel = 'Restart';
        }
    };

    private savePrev() {
        if (this.state.pointsTime.length  > 0) this.prevPointsTime  = this.state.pointsTime.slice();
        if (this.state.pointsPhase.length > 0) this.prevPointsPhase = this.state.pointsPhase.slice();
    }

    private drawFunctions() {
        this.interactionCounter();
        const pointsTime:      Point[] = [];
        const pointsTimeMotor: Point[] = [];
        const pointsTimeHom:   Point[] = [];
        const pointsTimeInhom: Point[] = [];
        const pointsPhase:     Point[] = [];
        let t = 0;
        while (10 * t + this.state.dx < 0.94 * this.canTime.width) {
            const phys = this.computePhysics(t);
            const xPix = this.state.dx + 10 * t;
            pointsTime.push(     { x: xPix, y: this.canTime.height * 0.5 - phys.x,       alpha: 1   });
            pointsTimeMotor.push({ x: xPix, y: this.canTime.height * 0.5 - phys.xmotor,  alpha: 0.5 });
            pointsTimeHom.push(  { x: xPix, y: this.canTime.height * 0.5 - phys.x_hom,   alpha: 0.5 });
            pointsTimeInhom.push({ x: xPix, y: this.canTime.height * 0.5 - phys.x_inhom, alpha: 0.5 });
            if (this.showPhase) pointsPhase.push({ x: this.canPhase.width * 0.5 + phys.x, y: this.canPhase.height * 0.5 + phys.v, alpha: 1 });
            t += this.state.dt;
        }
        if (this.showTimeDiagram) {
            this.drawAxes(this.ctxTime, this.canTime, 't', 'φ(t)', this.state.dx, this.canTime.height * 0.5);
            if (this.showMotor) {
                this.drawTrail(this.ctxTime, pointsTimeMotor, '#ff6666');
            } else {
                this.drawTrail(this.ctxTime, pointsTimeHom,   'green');
                this.drawTrail(this.ctxTime, pointsTimeInhom, 'blue');
            }
            this.drawTrail(this.ctxTime, pointsTime, 'black');
        }
        if (this.showPhase) {
            this.drawAxes(this.ctxPhase, this.canPhase, 'φ(t)', 'ω(t)', this.canPhase.width * 0.5, this.canPhase.height * 0.5);
            this.drawTrail(this.ctxPhase, pointsPhase, 'black');
        }
    }

    private drawPrevTime() {
        if (this.prevPointsTime.length  < 2) return;
        this.drawTrail(this.ctxTime,  this.prevPointsTime,  'rgba(130,130,130,0.6)');
    }

    private drawPrevPhase() {
        if (this.prevPointsPhase.length < 2) return;
        this.drawTrail(this.ctxPhase, this.prevPointsPhase, 'rgba(130,130,130,0.6)');
    }

    // ── canvas drawing helpers ────────────────────────────────────────────

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
        ctx.beginPath(); ctx.moveTo(0.05 * w, ypos);   ctx.lineTo(0.95 * w, ypos);   ctx.stroke();
        this.arrowhead(ctx, { x: 0.05 * w, y: ypos },   { x: 0.95 * w, y: ypos });
        ctx.beginPath(); ctx.moveTo(xpos, 0.9 * h); ctx.lineTo(xpos, 0.1 * h); ctx.stroke();
        this.arrowhead(ctx, { x: xpos, y: 0.9 * h }, { x: xpos, y: 0.1 * h });
        ctx.font = '16px Arial';
        ctx.fillText(xLabel, 0.92 * w, 0.54 * h);
        ctx.fillText(yLabel, xpos + 8,  0.12 * h);
    }

    private drawTrail(ctx: CanvasRenderingContext2D, pts: Point[], color = 'black') {
        if (pts.length < 2) return;
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
    }

    private drawFadingPoints(ctx: CanvasRenderingContext2D, pts: Point[], color = '50,50,255', radius = 3, fade = 0.05) {
        for (const p of pts) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
            ctx.fill();
            p.alpha = Math.max(0, p.alpha - fade);
        }
    }

    private drawFadingTrail(ctx: CanvasRenderingContext2D, pts: Point[], color = 'black', fade = 0.05, fadeStart = 400) {
        if (pts.length < 2) return;
        if (pts.length < fadeStart) {
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();
        } else {
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
            ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
            for (let i = 1; i < fadeStart; i++) ctx.lineTo(pts[pts.length - 1 - i].x, pts[pts.length - 1 - i].y);
            ctx.stroke();
            let lw = 2;
            for (let i = fadeStart; i < pts.length && lw > 0; i++) {
                ctx.beginPath();
                ctx.moveTo(pts[pts.length - i].x,     pts[pts.length - i].y);
                ctx.lineTo(pts[pts.length - 1 - i].x, pts[pts.length - 1 - i].y);
                ctx.strokeStyle = color; ctx.lineWidth = lw;
                lw = Math.max(0, lw - fade);
                ctx.stroke();
            }
        }
    }

    private drawSpiralLinear(ctx: CanvasRenderingContext2D, a: Vec2, b: Vec2) {
        const steps = 60, turns = 5, inc = 2 * Math.PI / steps;
        let theta = 0, x = a.x, y = a.y;
        const progress = (b.y - a.y) / (turns * steps);
        ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(a.x, a.y);
        for (let i = 0; i < turns * steps; i++) {
            x += 3 * Math.cos(theta);
            y += 0.7 * Math.sin(theta) + progress;
            ctx.lineTo(x, y);
            theta += inc;
        }
        ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    private drawSpiralPolar(ctx: CanvasRenderingContext2D, center: Vec2, radius: number, startAngle: number, endAngle: number) {
        const r0 = 12;
        const totalArc = 2 * Math.PI * 3 + endAngle - startAngle;
        const dth = 100, steps = 500;
        const inc = totalArc / ((steps / dth + Math.exp(-steps / dth)) - 1);
        ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(center.x + r0 * Math.cos(startAngle), center.y - r0 * Math.sin(startAngle));
        for (let i = 0; i <= steps; i++) {
            const r  = (radius - r0) * i / steps + r0;
            const th = ((i / dth + Math.exp(-i / dth)) - 1) * inc;
            ctx.lineTo(center.x + r * Math.cos(startAngle + th), center.y - r * Math.sin(startAngle + th));
        }
        ctx.stroke();
    }

    private drawPendulum(yOsc: number) {
        const xC = this.canPend.width * 0.5;
        const yC = this.canPend.height * 0.5 - yOsc;
        this.ctxPend.clearRect(0, 0, this.canPend.width, this.canPend.height);
        this.drawSpiralLinear(this.ctxPend, { x: xC, y: 0 }, { x: xC, y: yC });
        this.ctxPend.beginPath();
        this.ctxPend.fillStyle = '#0057c1';
        this.ctxPend.arc(xC, yC, 8, 0, 2 * Math.PI); this.ctxPend.fill();
    }

    private drawRotPendulum(angle: number, motorAngle: number) {
        angle      += Math.PI / 2;
        motorAngle += Math.PI / 2;
        const center = { x: this.canRotPend.width * 0.5, y: this.canRotPend.height * 0.5 };
        const radius = 0.2 * this.canRotPend.width;
        this.ctxRot.beginPath();
        this.ctxRot.fillStyle = 'black';
        this.ctxRot.arc(center.x, center.y, 16, 0, 2 * Math.PI); this.ctxRot.fill();
        this.drawSpiralPolar(this.ctxRot, center, radius, angle, motorAngle);
        this.ctxRot.beginPath();
        this.ctxRot.fillStyle = '#ff6666';
        this.ctxRot.arc(center.x + radius * Math.cos(motorAngle), center.y - radius * Math.sin(motorAngle), 8, 0, 2 * Math.PI);
        this.ctxRot.fill();
    }

    private drawRotWheel(angle: number) {
        const ctx    = this.ctxRot;
        const center = { x: this.canRotPend.width * 0.5, y: this.canRotPend.height * 0.5 };
        const radius = 0.3 * this.canRotPend.width;

        ctx.beginPath(); ctx.arc(center.x, center.y, radius,        0, 2 * Math.PI); ctx.lineWidth = 40; ctx.strokeStyle = '#B87333'; ctx.stroke();
        ctx.beginPath(); ctx.arc(center.x, center.y, 0.25 * radius, 0, 2 * Math.PI); ctx.lineWidth = 40; ctx.strokeStyle = '#B87333'; ctx.stroke();

        const len = 0.9 * radius;
        const a0  = -Math.PI / 2 + angle;
        [a0, a0 + 2 / 3 * Math.PI, a0 + 4 / 3 * Math.PI].forEach(a => {
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(center.x + len * Math.cos(a), center.y - len * Math.sin(a));
            ctx.stroke();
        });

        const bw = 16;
        ctx.beginPath(); ctx.fillStyle = '#262626';
        ctx.arc(center.x - radius * Math.sin(angle), center.y - radius * Math.cos(angle), bw / 2, 0, 2 * Math.PI); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(center.x - bw/2*Math.cos(angle) - radius*Math.sin(angle), center.y + bw/2*Math.sin(angle) - radius*Math.cos(angle));
        ctx.lineTo(center.x + bw/2*Math.cos(angle) - radius*Math.sin(angle), center.y - bw/2*Math.sin(angle) - radius*Math.cos(angle));
        ctx.lineTo(center.x - 1.35*radius*Math.sin(angle),                   center.y - 1.35*radius*Math.cos(angle));
        ctx.lineTo(center.x - bw/2*Math.cos(angle) - radius*Math.sin(angle), center.y + bw/2*Math.sin(angle) - radius*Math.cos(angle));
        ctx.fillStyle = '#262626'; ctx.fill();
    }

    private drawScale() {
        const ctx    = this.ctxRot;
        const center = { x: this.canRotPend.width * 0.5, y: this.canRotPend.height * 0.5 };
        const radius = 0.4 * this.canRotPend.width;
        ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI); ctx.lineWidth = 30; ctx.strokeStyle = 'gray'; ctx.stroke();
        const s0 = radius - 15;
        for (let i = 0; i <= 36; i++) {
            const s1    = i % 3 === 0 ? radius + 7.5 : radius - 3.75;
            const angle = 2 * Math.PI / 36 * i + Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(center.x + s0 * Math.cos(angle), center.y - s0 * Math.sin(angle));
            ctx.lineTo(center.x + s1 * Math.cos(angle), center.y - s1 * Math.sin(angle));
            ctx.lineWidth = 2; ctx.strokeStyle = 'black'; ctx.stroke();
        }
    }

    private drawPohl(angle: number, motorAngle: number) {
        this.ctxRot.clearRect(0, 0, this.canRotPend.width, this.canRotPend.height);
        this.drawScale();
        this.drawRotWheel(angle);
        this.drawRotPendulum(angle, motorAngle);
    }
}
