import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-dec-e-damped-oscillations',
  imports: [RouterLink],
  templateUrl: './dec-e-damped-oscillations.html',
  styleUrl: './dec-e-damped-oscillations.css',
})
export class DecEDampedOscillations {
    // TODO: point to the dedicated experimental-line learning/test pages for damped oscillations once they exist
    learningModuleLink = '/learning/intro-experiment';
    testLink = '/test/e-damped-oscillations';
    simulationLink = '/simulation/damped-oscillations-experiment';

    constructor(private router: Router) {}

    goBack() {
        this.router.navigate(['/learning/intro-experiment'], { queryParams: { page: 4 } });
    }
}
