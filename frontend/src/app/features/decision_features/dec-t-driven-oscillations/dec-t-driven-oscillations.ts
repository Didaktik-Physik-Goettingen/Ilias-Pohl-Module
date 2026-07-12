import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevModeService } from '../../../core/services/dev-mode';
import { TestTracking } from '../../../core/services/test-tracking';



@Component({
    selector: 'app-dec-t-driven-oscillations',
    imports: [],
    templateUrl: './dec-t-driven-oscillations.html',
    styleUrl: './dec-t-driven-oscillations.css',
})
export class DecTDrivenOscillations implements OnInit {
    learningModuleLink = '/learning/t4-driven-oscillations';
    testLink = '/test/t-driven-osc';
    simulationLink = '/simulation/sim-t-driven';
    nextLink = '/learning/t-setup';
    testDisabled = false;
    learningCompleted = false;

    constructor(public router: Router, public devMode: DevModeService, private testTracking: TestTracking) {}

    ngOnInit() {
        const result = this.testTracking.getTestResults('driven-oscillations');
        if (result?.percentageScore !== undefined && result.percentageScore < 80) {
            this.testDisabled = true;
        }
        this.learningCompleted = sessionStorage.getItem('learning-done-t-driven') === 'true';
    }

    navigateToLearning() {
        this.router.navigate([this.learningModuleLink], { queryParams: { flow: 'learning-first' } });
    }

    navigateToSimulation() {
        if (this.learningCompleted) {
            this.router.navigate([this.simulationLink], { queryParams: { flow: 'learning-first' } });
        } else {
            this.router.navigate([this.simulationLink]);
        }
    }

    navigateNext() {
        this.router.navigate([this.nextLink]);
    }

    goBack() {
          this.router.navigate(['/learning/t3-damped-oscillations'], { queryParams: { page: 5 } });
    }
}
