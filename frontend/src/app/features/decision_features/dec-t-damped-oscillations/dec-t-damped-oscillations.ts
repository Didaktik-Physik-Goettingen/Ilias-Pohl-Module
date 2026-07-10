import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevModeService } from '../../../core/services/dev-mode';
import { TestTracking } from '../../../core/services/test-tracking';



@Component({
    selector: 'app-dec-t-damped-oscillations',
    imports: [],
    templateUrl: './dec-t-damped-oscillations.html',
    styleUrl: './dec-t-damped-oscillations.css',
})
export class DecTDampedOscillations implements OnInit {
    learningModuleLink = '/learning/t3-damped-oscillations';
    testLink = '/test/t-damped-osc';
    simulationLink = '/simulation/theory-damped';
    nextLink = '/decision/t-driven-oscillations';
    testDisabled = false;
    learningCompleted = false;

    constructor(public router: Router, public devMode: DevModeService, private testTracking: TestTracking) {}

    ngOnInit() {
        const result = this.testTracking.getTestResults('t-damped-oscillations');
        if (result?.percentageScore !== undefined && result.percentageScore < 80) {
            this.testDisabled = true;
        }
        this.learningCompleted = sessionStorage.getItem('learning-done-t-damped') === 'true';
    }

    navigateToLearning() {
        this.router.navigate([this.learningModuleLink], { queryParams: { flow: 'learning-first' } });
    }

    navigateToSimulation() {
        const flow = this.learningCompleted ? 'learning-first' : 'sim-first';
        this.router.navigate([this.simulationLink], { queryParams: { flow } });
    }

    navigateNext() {
        this.router.navigate([this.nextLink]);
    }

    goBack() {
        this.router.navigate(['/learning/t2-free-oscillations'], { queryParams: { page: 2 } });
    }
}
