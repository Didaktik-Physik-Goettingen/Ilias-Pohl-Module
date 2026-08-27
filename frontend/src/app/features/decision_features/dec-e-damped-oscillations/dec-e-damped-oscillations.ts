import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevModeService } from '../../../core/services/dev-mode';
import { TestTracking } from '../../../core/services/test-tracking';



@Component({
  selector: 'app-dec-e-damped-oscillations',
  imports: [],
  templateUrl: './dec-e-damped-oscillations.html',
  styleUrl: './dec-e-damped-oscillations.css',
})
export class DecEDampedOscillations implements OnInit {
    learningModuleLink = '/learning/e2-damped-oscillations';
    testLink = '/test/test-e-damped';
    simulationLink = '/simulation/sim-e-damped';
    nextLink = '/decision/dec-e-driven';
    testDisabled = false;
    learningCompleted = false;

    constructor(public router: Router, public devMode: DevModeService, private testTracking: TestTracking) {}

    ngOnInit() {
        const result = this.testTracking.getTestResults('e-damped-oscillations-test');
        if (result?.percentageScore !== undefined && result.percentageScore < 80) {
            this.testDisabled = true;
        }
        this.learningCompleted = sessionStorage.getItem('learning-done-e-damped') === 'true';
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
        this.router.navigate(['/learning/e1-intro-experiment'], { queryParams: { page: 4 } });
    }
}
