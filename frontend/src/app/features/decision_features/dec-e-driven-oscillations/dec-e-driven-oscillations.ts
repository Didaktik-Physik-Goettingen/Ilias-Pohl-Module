import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DevModeService } from '../../../core/services/dev-mode';
import { TestTracking } from '../../../core/services/test-tracking';



@Component({
  selector: 'app-dec-e-driven-oscillations',
  imports: [],
  templateUrl: './dec-e-driven-oscillations.html',
  styleUrl: './dec-e-driven-oscillations.css',
})
export class DecEDrivenOscillations implements OnInit {
    learningModuleLink = '/learning/e3-driven-oscillations';
    testLink = '/test/e-driven-osc';
    simulationLink = '/simulation/sim-e-driven-osc';
    nextLink = '/target/tar-experiment';
    testDisabled = false;
    learningCompleted = false;

    constructor(public router: Router, public devMode: DevModeService, private testTracking: TestTracking) {}

    ngOnInit() {
        const result = this.testTracking.getTestResults('e-driven-oscillations');
        if (result?.percentageScore !== undefined && result.percentageScore < 80) {
            this.testDisabled = true;
        }
        this.learningCompleted = sessionStorage.getItem('learning-done-e-driven') === 'true';
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
        this.router.navigate(['/decision/e2-damped-oscillations'], { queryParams: { page: 7 } });
    }
}
