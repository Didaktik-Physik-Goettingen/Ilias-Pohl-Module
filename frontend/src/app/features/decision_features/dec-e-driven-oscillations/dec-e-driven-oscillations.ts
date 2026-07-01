import { Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dec-e-driven-oscillations',
  imports: [],
  templateUrl: './dec-e-driven-oscillations.html',
  styleUrl: './dec-e-driven-oscillations.css',
})
export class DecEDrivenOscillations {
    learningModuleLink = '/learning/e3-driven-oscillations';
    testLink = '/test/e-driven-osc';
    simulationLink = '/simulation/sim-e-driven-osc';

    constructor(public router: Router) {}

    goBack() {
        this.router.navigate(['/decision/e-damped-oscillations']);
    }
}
