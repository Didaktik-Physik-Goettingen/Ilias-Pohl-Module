import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-dec-e-damped-oscillations',
  imports: [RouterLink],
  templateUrl: './dec-e-damped-oscillations.html',
  styleUrl: './dec-e-damped-oscillations.css',
})
export class DecEDampedOscillations {
    // TODO: point to the dedicated experimental-line learning page for damped oscillations once it exists
    learningModuleLink = '/learning/e2-damped-oscillations';
    testLink = '/test/e-damped-osc';
    simulationLink = '/simulation/sim-e-damped-osc';

    constructor(private router: Router) {}

    goBack() {
        this.router.navigate(['/learning/e1-intro-experiment'], { queryParams: { page: 4 } });
    }
}
