import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
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
  selector: 'app-sim-e-damped-oscillations',
  imports: [FormsModule],
  templateUrl: './sim-e-damped-oscillations.html',
  styleUrl: './sim-e-damped-oscillations.css',
  // canvas content is drawn imperatively outside Angular's bindings, so SSR hydration
  // can't reconcile it and ends up replacing the subtree right after the first paint
  host: { ngSkipHydration: 'true' },
})
export class SimEDampedOscillations implements AfterViewInit, OnDestroy {
    @ViewChild('canPend') canPendRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('canRotPend') canRotPendRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('canTime') canTimeRef!: ElementRef<HTMLCanvasElement>;

    private canPend!: HTMLCanvasElement;
    private canRotPend!: HTMLCanvasElement;
    private canTime!: HTMLCanvasElement;
    private ctxPend!: CanvasRenderingContext2D;
    private ctxRot!: CanvasRenderingContext2D;
    private ctxTime!: CanvasRenderingContext2D;

    // slider-bound parameters
    dampingConstant = 0.1;
    springConstant = 2.0;
    initialAngle = 20;
    initialVelocity = 0.0;

    // toolbar state
    showPendulum = false;
    showRotPendulum = true;
    showTimeDiagram = true;
    dynamicMode = true;
    startButtonLabel = 'Start';
    interactionHintText = '';

    private wasPendulumVisible = false;
    private wasRotPendulumVisible = true;
    private isRunning = false;
    private firstRun = true;
    private interactionCount = 0;
    private raf = 0;

    private readonly state = {
        k: 2, m: 1, dt: 0.03, dx: 20,
        t: 0, y0: 20, v0: 0, omega: Math.sqrt(2), gamma: 0,
        alpha0: 20 / (2 * Math.PI), omega0: 0,
        pointsTime: [] as Point[],
    };

    private prevPointsTime: Point[] = [];

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private location: Location
    ) {}

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.canPend = this.canPendRef.nativeElement;
        this.canRotPend = this.canRotPendRef.nativeElement;
        this.canTime = this.canTimeRef.nativeElement;
        this.ctxPend = this.canPend.getContext('2d')!;
        this.ctxRot = this.canRotPend.getContext('2d')!;
        this.ctxTime = this.canTime.getContext('2d')!;

        this.drawAxes(this.ctxTime, this.canTime, 't', 'φ(t)', this.state.dx, this.canTime.height * 0.5);
        this.drawPohl(0);

        this.renderMath();
    }

    ngOnDestroy() {
        if (this.raf) cancelAnimationFrame(this.raf);
    }

    goBack() {
        this.location.back();
    }

    // trigger MathJax rendering
    renderMath() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                if (window.MathJax) {
                    const elements = document.querySelectorAll('.MathJax');
                    elements.forEach(el => el.remove());
                    window.MathJax.typesetPromise();
                }
            }, 100);
        }
    }

    // ── UI event handlers ──────────────────────────────────────────────

    onStartClick() {
        this.interactionCounter();
        if (!this.isRunning) {
            if (this.firstRun) {
                this.reset();
                this.firstRun = false;
            }
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
            if (this.isRunning) {
                this.raf = requestAnimationFrame(this.step);
            }
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
            this.wasPendulumVisible = this.showPendulum;
            this.wasRotPendulumVisible = this.showRotPendulum;
            this.showPendulum = false;
            this.showRotPendulum = false;
            this.reset();
            this.drawFunctions();
        } else {
            this.showPendulum = this.wasPendulumVisible;
            this.showRotPendulum = this.wasRotPendulumVisible;
            this.reset();
        }
    }

    onToggleCanvas(which: 'pend' | 'rot' | 'time') {
        this.interactionCounter();
        if (which === 'time' && this.showTimeDiagram) {
            this.drawAxes(this.ctxTime, this.canTime, 't', 'φ(t)', this.state.dx, this.canTime.height * 0.5);
        } else if (which === 'pend' && this.showPendulum) {
            this.drawPendulum(0);
        } else if (which === 'rot' && this.showRotPendulum) {
            this.drawPohl(0);
        }
    }

    onParameterChange() {
        if (!this.dynamicMode) {
            this.reset();
            this.drawFunctions();
        }
    }

    // ── interaction hint (placeholder for follow-up links) ─────────────

    private interactionCounter() {
        if (this.interactionCount > 8) {
            this.interactionHintText = 'Wählen Sie abhängig davon, welche theoretischen Kapitel Sie bereits erarbeitet haben: Hier würden jetzt die weiterführenden Links erscheinen.';
        } else {
            this.interactionCount += 1;
            this.interactionHintText = '';
        }
    }

    // ── physics ──────────────────────────────────────────────────────

    private reset() {
        this.state.y0 = this.initialAngle;
        this.state.v0 = this.initialVelocity;
        this.state.k = this.springConstant;
        this.state.gamma = this.dampingConstant;
        this.state.omega = Math.sqrt(this.state.k / this.state.m);
        this.state.alpha0 = this.state.y0 / 360 * 2 * Math.PI;
        this.state.omega0 = this.state.v0 / (2 * Math.PI * 100);

        this.state.t = 0;
        this.state.pointsTime = [];

        if (this.showTimeDiagram) this.drawAxes(this.ctxTime, this.canTime, 't', 'φ(t)', this.state.dx, this.canTime.height * 0.5);
        if (this.showPendulum) this.drawPendulum(0);
        if (this.showRotPendulum) this.drawPohl(0);
    }

    // homogeneous solution of the damped harmonic oscillator
    private computePhysics(t: number) {
        const w = this.state.omega;
        const safeW = w === 0 ? 1e-12 : w;
        const decay = Math.exp(-this.state.gamma * t);

        const x = (this.state.y0 * Math.cos(w * t) + (this.state.v0 / safeW) * Math.sin(w * t)) * decay;
        const v = (-this.state.y0 * w * Math.sin(w * t) + this.state.v0 * Math.cos(w * t)) * decay
            - this.state.gamma * x;
        const al = (this.state.alpha0 * Math.cos(w * t) + (this.state.omega0 / safeW) * Math.sin(w * t)) * decay;

        return { x, v, al };
    }

    private readonly step = () => {
        if (!this.isRunning) return;

        const t = this.state.t;
        const phys = this.computePhysics(t);

        if (this.showTimeDiagram) {
            this.drawAxes(this.ctxTime, this.canTime, 't', 'φ(t)', this.state.dx, this.canTime.height * 0.5);
            const xPix = this.state.dx + 10 * t;
            const yPix = this.canTime.height * 0.5 - phys.x;
            this.state.pointsTime.push({ x: xPix, y: yPix, alpha: 1 });
            this.drawFadingPoints(this.ctxTime, this.state.pointsTime, '50,50,255', 3, 0.05);
            this.drawTrail(this.ctxTime, this.state.pointsTime, 'black');
            this.drawPrevTime();
        }

        if (this.showPendulum) this.drawPendulum(phys.x);
        if (this.showRotPendulum) this.drawPohl(phys.al);

        const xPixNext = this.state.dx + 10 * this.state.t;
        if (xPixNext < 0.94 * this.canTime.width) {
            this.state.t += this.state.dt;
            this.raf = requestAnimationFrame(this.step);
        } else {
            this.isRunning = false;
            this.firstRun = true;
            this.savePrev();
            this.startButtonLabel = 'Restart';
        }
    };

    private savePrev() {
        if (this.state.pointsTime.length > 0) {
            this.prevPointsTime = this.state.pointsTime.slice();
        }
    }

    // draws the whole trajectory at once (static mode)
    private drawFunctions() {
        this.interactionCounter();
        const points: Point[] = [];
        let t = 0;
        const dt = this.state.dt;
        while (10 * t + this.state.dx < 0.94 * this.canTime.width) {
            const phys = this.computePhysics(t);
            const tPix = this.state.dx + 10 * t;
            const yPix = this.canTime.height * 0.5 - phys.x;
            points.push({ x: tPix, y: yPix, alpha: 1 });
            t += dt;
        }
        if (this.showTimeDiagram) {
            this.drawAxes(this.ctxTime, this.canTime, 't', 'φ(t)', this.state.dx, this.canTime.height * 0.5);
            this.drawTrail(this.ctxTime, points, 'black');
        }
    }

    private drawPrevTime() {
        if (this.prevPointsTime.length < 2) return;
        this.drawTrail(this.ctxTime, this.prevPointsTime, 'rgba(130,130,130,0.6)');
    }

    // ── canvas drawing helpers ───────────────────────────────────────

    private arrowhead(ctx: CanvasRenderingContext2D, from: Vec2, to: Vec2, r = 6) {
        const ang = Math.atan2(to.y - from.y, to.x - from.x);
        ctx.strokeStyle = '#000'; ctx.fillStyle = '#000'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const a = ang + i * (2 * Math.PI / 3);
            const x = to.x + r * Math.cos(a), y = to.y + r * Math.sin(a);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill();
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

    private drawFadingPoints(ctx: CanvasRenderingContext2D, pts: Point[], color = '50,50,255', radius = 3, fade = 0.05) {
        for (const p of pts) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
            ctx.fill();
            p.alpha = Math.max(0, p.alpha - fade);
        }
    }

    private drawSpiralLinear(ctx: CanvasRenderingContext2D, a: Vec2, b: Vec2) {
        const steps = 60, turns = 5, inc = 2 * Math.PI / steps;
        let theta = 0, x = a.x, y = a.y;
        const progress = (b.y - a.y) / (turns * steps);
        ctx.strokeStyle = '#000'; ctx.fillStyle = '#000'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(a.x, a.y);
        for (let i = 0; i < turns * steps; i++) {
            x += 3 * Math.cos(theta);
            y += 0.7 * Math.sin(theta) + progress;
            ctx.lineTo(x, y);
            theta += inc;
        }
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }

    // draws the spiral spring connecting the wheel to its fixed anchor point
    private drawSpiralPolar(ctx: CanvasRenderingContext2D, center: Vec2, radius: number, startAngle: number, endAngle: number) {
        const r0 = 12;
        const totalArc = 2 * Math.PI * 3 + endAngle - startAngle;
        const dth = 100;
        const steps = 500;
        const inc = totalArc / ((steps / dth + Math.exp(-steps / dth)) - 1);
        ctx.strokeStyle = '#000'; ctx.fillStyle = '#000'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(center.x + r0 * Math.cos(startAngle), center.y - r0 * Math.sin(startAngle));
        for (let i = 0; i <= steps; i++) {
            const r = (radius - r0) * i / steps + r0;
            const th = ((i / dth + Math.exp(-i / dth)) - 1) * inc;
            const x = center.x + r * Math.cos(startAngle + th);
            const y = center.y - r * Math.sin(startAngle + th);
            ctx.lineTo(x, y);
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
        this.ctxPend.arc(xC, yC, 8, 0, 2 * Math.PI);
        this.ctxPend.fill();
    }

    // motorAngle stays fixed at 0: in this (non-driven) setup the spring's far end is anchored, not excited
    private drawRotPendulum(angle: number, motorAngle = 0) {
        angle += Math.PI / 2;
        motorAngle += Math.PI / 2;
        const center = { x: this.canRotPend.width * 0.5, y: this.canRotPend.height * 0.5 };
        const radius = 0.2 * this.canRotPend.width;
        this.ctxRot.beginPath();
        this.ctxRot.fillStyle = 'black';
        this.ctxRot.arc(center.x, center.y, 16, 0, 2 * Math.PI);
        this.ctxRot.fill();
        this.drawSpiralPolar(this.ctxRot, center, radius, angle, motorAngle);
        const x = center.x + radius * Math.cos(motorAngle);
        const y = center.y - radius * Math.sin(motorAngle);
        this.ctxRot.beginPath();
        this.ctxRot.fillStyle = '#ff6666';
        this.ctxRot.arc(x, y, 8, 0, 2 * Math.PI);
        this.ctxRot.fill();
    }

    private drawRotWheel(angle: number) {
        const ctx = this.ctxRot;
        const center = { x: this.canRotPend.width * 0.5, y: this.canRotPend.height * 0.5 };
        const radius = 0.3 * this.canRotPend.width;

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 40;
        ctx.strokeStyle = '#B87333';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center.x, center.y, 0.25 * radius, 0, 2 * Math.PI);
        ctx.lineWidth = 40;
        ctx.strokeStyle = '#B87333';
        ctx.stroke();

        const connectorLen = 0.9 * radius;
        const connectorAAngle = -Math.PI / 2 + angle;
        const connectorBAngle = connectorAAngle + 2 / 3 * Math.PI;
        const connectorCAngle = connectorAAngle + 4 / 3 * Math.PI;
        const connectorAEnd = { x: center.x + connectorLen * Math.cos(connectorAAngle), y: center.y - connectorLen * Math.sin(connectorAAngle) };
        const connectorBEnd = { x: center.x + connectorLen * Math.cos(connectorBAngle), y: center.y - connectorLen * Math.sin(connectorBAngle) };
        const connectorCEnd = { x: center.x + connectorLen * Math.cos(connectorCAngle), y: center.y - connectorLen * Math.sin(connectorCAngle) };
        ctx.beginPath();
        ctx.moveTo(center.x, center.y); ctx.lineTo(connectorAEnd.x, connectorAEnd.y); ctx.stroke();
        ctx.moveTo(center.x, center.y); ctx.lineTo(connectorBEnd.x, connectorBEnd.y); ctx.stroke();
        ctx.moveTo(center.x, center.y); ctx.lineTo(connectorCEnd.x, connectorCEnd.y); ctx.stroke();

        const baseWidth = 16;
        ctx.beginPath();
        ctx.fillStyle = '#262626';
        ctx.arc(center.x - radius * Math.sin(angle), center.y - radius * Math.cos(angle), baseWidth / 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(center.x - baseWidth / 2 * Math.cos(angle) - radius * Math.sin(angle), center.y + baseWidth / 2 * Math.sin(angle) - radius * Math.cos(angle));
        ctx.lineTo(center.x + baseWidth / 2 * Math.cos(angle) - radius * Math.sin(angle), center.y - baseWidth / 2 * Math.sin(angle) - radius * Math.cos(angle));
        ctx.lineTo(center.x - 1.35 * radius * Math.sin(angle), center.y - 1.35 * radius * Math.cos(angle));
        ctx.lineTo(center.x - baseWidth / 2 * Math.cos(angle) - radius * Math.sin(angle), center.y + baseWidth / 2 * Math.sin(angle) - radius * Math.cos(angle));
        ctx.fillStyle = '#262626';
        ctx.fill();
    }

    private drawScale() {
        const ctx = this.ctxRot;
        const center = { x: this.canRotPend.width * 0.5, y: this.canRotPend.height * 0.5 };
        const radius = 0.4 * this.canRotPend.width;

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 30;
        ctx.strokeStyle = 'gray';
        ctx.stroke();

        const scaleStartLen = radius - 15;
        for (let i = 0; i <= 36; i++) {
            const scaleEndLen = i % 3 === 0 ? radius + 15 / 2 : radius - 15 / 4;
            const angle = 2 * Math.PI / 36 * i + Math.PI / 2;
            const scaleStart = { x: center.x + scaleStartLen * Math.cos(angle), y: center.y - scaleStartLen * Math.sin(angle) };
            const scaleEnd = { x: center.x + scaleEndLen * Math.cos(angle), y: center.y - scaleEndLen * Math.sin(angle) };
            ctx.beginPath();
            ctx.moveTo(scaleStart.x, scaleStart.y);
            ctx.lineTo(scaleEnd.x, scaleEnd.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }

    private drawPohl(angle: number) {
        this.ctxRot.clearRect(0, 0, this.canRotPend.width, this.canRotPend.height);
        this.drawScale();
        this.drawRotWheel(angle);
        this.drawRotPendulum(angle);
    }
}
