import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';



@Component({
    selector: 'app-damped-oscillations-experiment',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './damped-oscillations-experiment.html',
    styleUrl: './damped-oscillations-experiment.css'
})
export class SimDampedOscillationsExperiment implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('canvasWheel', { static: false }) canvasWheel!: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasTime', { static: false }) canvasTime!: ElementRef<HTMLCanvasElement>;

    // Canvas contexts
    private ctxWheel?: CanvasRenderingContext2D;
    private ctxTime?: CanvasRenderingContext2D;

    // Display toggles
    showWheel = true;
    showTimeSeries = true;
    isDynamic = true;

    // Parameters
    damping = 0.1;          // β (gamma)
    springConstant = 2.0;   // k
    initialAngle = 20;      // φ₀ (degrees)
    initialVelocity = 0.0;  // φ̇₀

    // Simulation state
    isPlaying = false;
    time = 0;
    dt = 0.03;
    animationFrameId?: number;

    // Data points for plotting
    timePoints: Array<{ x: number, y: number }> = [];
    previousTimePoints: Array<{ x: number, y: number }> = [];

    // Derived parameters
    private get omega0(): number {
        return Math.sqrt(this.springConstant);
    }

    private get alpha0(): number {
        return (this.initialAngle / 360) * 2 * Math.PI;
    }

    private get omega0_initial(): number {
        return this.initialVelocity / (2 * Math.PI * 100);
    }

    // Interaction counter
    interactionCount = 0;
    showLinks = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    ngOnInit() {
        // Component initialization
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.initCanvases();
            this.drawInitialState();
        }
    }

    ngOnDestroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    private initCanvases() {
        if (this.canvasWheel) {
            this.ctxWheel = this.canvasWheel.nativeElement.getContext('2d')!;
        }
        if (this.canvasTime) {
            this.ctxTime = this.canvasTime.nativeElement.getContext('2d')!;
        }
    }

    private drawInitialState() {
        if (this.showWheel && this.ctxWheel) {
            this.drawWheel(0);
        }
        if (this.showTimeSeries && this.ctxTime) {
            this.drawAxes();
        }
    }

    // Physics calculations
    private computePhysics(t: number): { angle: number, velocity: number } {
        const omega = this.omega0;
        const safeOmega = omega === 0 ? 1e-12 : omega;
        
        const angle = (
            this.alpha0 * Math.cos(omega * t) + 
            (this.omega0_initial / safeOmega) * Math.sin(omega * t)
        ) * Math.exp(-this.damping * t);
        
        const velocity = (
            this.alpha0 * omega * Math.sin(omega * t) - 
            this.omega0_initial * Math.cos(omega * t)
        ) * (-this.damping) * Math.exp(-this.damping * t);
        
        return { angle, velocity };
    }

    // Drawing functions
    private drawWheel(angle: number) {
        if (!this.ctxWheel) return;

        const canvas = this.canvasWheel.nativeElement;
        const ctx = this.ctxWheel;
        const center = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
        const radius = canvas.width * 0.3;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw outer scale
        this.drawScale(ctx, center, canvas.width * 0.4);

        // Draw wheel
        this.drawRotatingWheel(ctx, center, radius, angle);

        // Draw spring connection
        this.drawSpring(ctx, center, radius * 0.2, angle);
    }

    private drawScale(ctx: CanvasRenderingContext2D, center: { x: number, y: number }, radius: number) {
        // Outer steel frame
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 30;
        ctx.strokeStyle = '#999';
        ctx.stroke();

        // Scale lines
        const scaleStartLen = radius - 15;
        for (let i = 0; i <= 36; i++) {
            const scaleEndLen = i % 3 === 0 ? radius + 7.5 : radius - 3.75;
            const angle = (2 * Math.PI / 36) * i + Math.PI / 2;
            const scaleStart = {
                x: center.x + scaleStartLen * Math.cos(angle),
                y: center.y - scaleStartLen * Math.sin(angle)
            };
            const scaleEnd = {
                x: center.x + scaleEndLen * Math.cos(angle),
                y: center.y - scaleEndLen * Math.sin(angle)
            };
            ctx.beginPath();
            ctx.moveTo(scaleStart.x, scaleStart.y);
            ctx.lineTo(scaleEnd.x, scaleEnd.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
    }

    private drawRotatingWheel(ctx: CanvasRenderingContext2D, center: { x: number, y: number }, radius: number, angle: number) {
        // Outer wheel
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 40;
        ctx.strokeStyle = '#B87333';
        ctx.stroke();

        // Inner wheel
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius * 0.25, 0, 2 * Math.PI);
        ctx.lineWidth = 40;
        ctx.strokeStyle = '#B87333';
        ctx.stroke();

        // Connectors (spokes)
        const connectorLen = radius * 0.9;
        for (let i = 0; i < 3; i++) {
            const connectorAngle = -Math.PI / 2 + angle + (i * 2 * Math.PI / 3);
            const connectorEnd = {
                x: center.x + connectorLen * Math.cos(connectorAngle),
                y: center.y - connectorLen * Math.sin(connectorAngle)
            };
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(connectorEnd.x, connectorEnd.y);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }

        // Pointer
        const baseWidth = 16;
        const pointerX = center.x - radius * Math.sin(angle);
        const pointerY = center.y - radius * Math.cos(angle);

        ctx.beginPath();
        ctx.arc(pointerX, pointerY, baseWidth / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#262626';
        ctx.fill();

        // Triangle pointer
        ctx.beginPath();
        ctx.moveTo(
            center.x - (baseWidth / 2) * Math.cos(angle) - radius * Math.sin(angle),
            center.y + (baseWidth / 2) * Math.sin(angle) - radius * Math.cos(angle)
        );
        ctx.lineTo(
            center.x + (baseWidth / 2) * Math.cos(angle) - radius * Math.sin(angle),
            center.y - (baseWidth / 2) * Math.sin(angle) - radius * Math.cos(angle)
        );
        ctx.lineTo(
            center.x - 1.35 * radius * Math.sin(angle),
            center.y - 1.35 * radius * Math.cos(angle)
        );
        ctx.closePath();
        ctx.fillStyle = '#262626';
        ctx.fill();

        // Center circle
        ctx.beginPath();
        ctx.arc(center.x, center.y, 16, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
    }

    private drawSpring(ctx: CanvasRenderingContext2D, center: { x: number, y: number }, radius: number, angle: number) {
        angle += Math.PI / 2;
        const r0 = 12;
        const totalArc = 2 * Math.PI * 3 + angle - Math.PI / 2;
        const dth = 100;
        const steps = 500;
        const inc = totalArc / ((steps / dth + Math.exp(-steps / dth)) - 1);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(center.x + r0 * Math.cos(Math.PI / 2), center.y - r0 * Math.sin(Math.PI / 2));

        for (let i = 0; i <= steps; i++) {
            const r = ((radius - r0) * i) / steps + r0;
            const th = ((i / dth + Math.exp(-i / dth)) - 1) * inc;
            const x = center.x + r * Math.cos(Math.PI / 2 + th);
            const y = center.y - r * Math.sin(Math.PI / 2 + th);
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Fixed point (red dot)
        const fixedX = center.x + radius * Math.cos(angle);
        const fixedY = center.y - radius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(fixedX, fixedY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff6666';
        ctx.fill();
    }

    private drawAxes() {
        if (!this.ctxTime) return;

        const canvas = this.canvasTime.nativeElement;
        const ctx = this.ctxTime;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.lineWidth = 2;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(w * 0.05, h * 0.5);
        ctx.lineTo(w * 0.95, h * 0.5);
        ctx.stroke();
        this.drawArrowhead(ctx, { x: w * 0.05, y: h * 0.5 }, { x: w * 0.95, y: h * 0.5 });

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(20, h * 0.9);
        ctx.lineTo(20, h * 0.1);
        ctx.stroke();
        this.drawArrowhead(ctx, { x: 20, y: h * 0.9 }, { x: 20, y: h * 0.1 });

        // Labels
        ctx.font = '16px Arial';
        ctx.fillText('t', w * 0.92, h * 0.54);
        ctx.fillText('φ(t)', 28, h * 0.12);
    }

    private drawArrowhead(ctx: CanvasRenderingContext2D, from: { x: number, y: number }, to: { x: number, y: number }, r = 6) {
        const ang = Math.atan2(to.y - from.y, to.x - from.x);
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const a = ang + i * (2 * Math.PI / 3);
            const x = to.x + r * Math.cos(a);
            const y = to.y + r * Math.sin(a);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.fill();
    }

    private drawTimeSeries() {
        if (!this.ctxTime) return;

        const canvas = this.canvasTime.nativeElement;
        
        this.drawAxes();

        // Draw previous run (gray)
        if (this.previousTimePoints.length > 1) {
            this.drawTrail(this.ctxTime, this.previousTimePoints, 'rgba(130,130,130,0.6)');
        }

        // Draw current run (black)
        if (this.timePoints.length > 1) {
            this.drawTrail(this.ctxTime, this.timePoints, '#000');
        }
    }

    private drawTrail(ctx: CanvasRenderingContext2D, points: Array<{ x: number, y: number }>, color: string) {
        if (points.length < 2) return;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }

    // Simulation control
    start() {
        if (!this.isPlaying) {
            if (this.time === 0) {
                this.reset();
            }
            this.isPlaying = true;
            this.animate();
        } else {
            this.isPlaying = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
        }
        this.incrementInteractionCount();
    }

    reset() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.isPlaying = false;

        // Save current run to previous
        if (this.timePoints.length > 0) {
            this.previousTimePoints = [...this.timePoints];
        }

        this.time = 0;
        this.timePoints = [];

        this.drawInitialState();
        this.incrementInteractionCount();
    }

    private animate() {
        if (!this.isPlaying) return;

        const phys = this.computePhysics(this.time);
        const canvas = this.canvasTime?.nativeElement;

        // Draw wheel
        if (this.showWheel) {
            this.drawWheel(phys.angle);
        }

        // Update time series
        if (this.showTimeSeries && canvas) {
            const xPix = 20 + this.time * 10;
            const yPix = canvas.height * 0.5 - (phys.angle / (2 * Math.PI)) * 360;
            this.timePoints.push({ x: xPix, y: yPix });
            this.drawTimeSeries();

            // Stop when off screen
            if (xPix >= canvas.width * 0.94) {
                this.isPlaying = false;
                return;
            }
        }

        this.time += this.dt;
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    // Parameter change handlers
    onParameterChange() {
        if (!this.isDynamic) {
            this.drawStatic();
        }
        this.incrementInteractionCount();
    }

    private drawStatic() {
        this.reset();
        const canvas = this.canvasTime?.nativeElement;
        if (!canvas) return;

        let t = 0;
        while (20 + t * 10 < canvas.width * 0.94) {
            const phys = this.computePhysics(t);
            const xPix = 20 + t * 10;
            const yPix = canvas.height * 0.5 - (phys.angle / (2 * Math.PI)) * 360;
            this.timePoints.push({ x: xPix, y: yPix });
            t += this.dt;
        }
        this.drawTimeSeries();
    }

    toggleDynamic() {
        this.isDynamic = !this.isDynamic;
        if (!this.isDynamic) {
            this.isPlaying = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            this.drawStatic();
        } else {
            this.reset();
        }
    }

    toggleWheel() {
        this.showWheel = !this.showWheel;
        this.incrementInteractionCount();
    }

    toggleTimeSeries() {
        this.showTimeSeries = !this.showTimeSeries;
        this.incrementInteractionCount();
    }

    private incrementInteractionCount() {
        this.interactionCount++;
        if (this.interactionCount > 8) {
            this.showLinks = true;
        }
    }
}