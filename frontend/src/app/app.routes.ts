import { Component } from '@angular/core';
import { CanActivateFn, Routes } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

import { Home } from './features/home/home';
import { GLOSSARY_TERMS } from './features/glossary/glossary-terms';


// learning features
import { E1IntroExperiment } from './features/learning_features/e1-intro-experiment/e1-intro-experiment';
import { E2DampedOscillation } from './features/learning_features/e2-damped-oscillation/e2-damped-oscillation';
import { E3DrivenOscillations } from './features/learning_features/e3-driven-oscillations/e3-driven-oscillations';
import { T1IntroTheory } from './features/learning_features/t1-intro-theory/t1-intro-theory';
import { T2FreeOscillations } from './features/learning_features/t2-free-oscillations/t2-free-oscillations';
import { T3DampedOscillations } from './features/learning_features/t3-damped-oscillations/t3-damped-oscillations';
import { T4DrivenOscillations } from './features/learning_features/t4-driven-oscillations/t4-driven-oscillations';
import { OptChaos } from './features/learning_features/opt-chaos/opt-chaos';
import { OptSimulation } from './features/learning_features/opt-simulation/opt-simulation';
import { OptSetup } from './features/learning_features/opt-setup/opt-setup';

// decision features
import { DecEDampedOscillations } from './features/decision_features/dec-e-damped-oscillations/dec-e-damped-oscillations';
import { DecEDrivenOscillations } from './features/decision_features/dec-e-driven-oscillations/dec-e-driven-oscillations';
import { DecTDampedOscillations } from './features/decision_features/dec-t-damped-oscillations/dec-t-damped-oscillations';
import { DecTDrivenOscillations } from './features/decision_features/dec-t-driven-oscillations/dec-t-driven-oscillations';

// test features
import { TestEDampedOscillations } from './features/test_features/test-e-damped-oscillations/test-e-damped-oscillations';
import { TestTDampedOscillation } from './features/test_features/test-t-damped-oscillation/test-t-damped-oscillation';
import { TestTDrivenOscillation } from './features/test_features/test-t-driven-oscillation/test-t-driven-oscillation';
import { TestEDrivenOscillations } from './features/test_features/test-e-driven-oscillations/test-e-driven-oscillations';

// simulation features
import { SimEDampedOscillations } from './features/simulation_features/sim-e-damped-oscillations/sim-e-damped-oscillations';
import { SimEDrivenOscillations } from './features/simulation_features/sim-e-driven-oscillations/sim-e-driven-oscillations';
import { SimTFreeOscillations } from './features/simulation_features/sim-t-free-oscillations/sim-t-free-oscillations';
import { SimTDampedOscillations } from './features/simulation_features/sim-t-damped-oscillations/sim-t-damped-oscillations';
import { SimTDrivenXOscillations } from './features/simulation_features/sim-t-driven-x-oscillations/sim-t-driven-x-oscillations';
import { SimTDrivenPhiOscillations } from './features/simulation_features/sim-t-driven-phi-oscillations/sim-t-driven-phi-oscillations';

// target features
import { TarExperiment } from './features/target_features/tar-experiment/tar-experiment';
import { TarTheory } from './features/target_features/tar-theory/tar-theory';
import { TarChaos } from './features/target_features/tar-chaos/tar-chaos';
import { TarSimulation } from './features/target_features/tar-simulation/tar-simulation';



export const routes: Routes = [
    { path: '', component: Home, title: 'Pohlsches Rad' },

    // glossary terms, for direct links; students open them in the overlay (shared/glossary-overlay)
    ...GLOSSARY_TERMS.map(t => ({ path: 'glossary/' + t.slug, component: t.component, title: t.title })),

    // conventional learning module pages
    { path: 'learning/e1-intro-experiment', component: E1IntroExperiment, title: 'Einstieg: Versuchsaufbau' },
    { path: 'learning/e2-damped-oscillations', component: E2DampedOscillation, title: 'Experiment: Gedämpfte Schwingungen' },
    { path: 'learning/e3-driven-oscillations', component: E3DrivenOscillations, title: 'Experiment: Getriebene Schwingungen' },
    { path: 'learning/t1-intro-theory',        component: T1IntroTheory,        title: 'Einstieg: Theorie' },
    { path: 'learning/t2-free-oscillations',   component: T2FreeOscillations,   title: 'Theorie: Freie Schwingung' },
    { path: 'learning/t3-damped-oscillations', component: T3DampedOscillations, title: 'Theorie: Gedämpfte Schwingung' },
    { path: 'learning/t4-driven-oscillations', component: T4DrivenOscillations, title: 'Theorie: Angetriebene Schwingung' },
    { path: 'learning/opt-chaos',             component: OptChaos,             title: 'Grundlagen nichtlineare Schwingung und Chaos' },
    { path: 'learning/opt-simulation',        component: OptSimulation,        title: 'Grundbausteine Simulation' },
    { path: 'learning/opt-setup',             component: OptSetup,             title: 'Versuchsaufbau: Der Pohlsche Resonator' },


    // decision pages
    { path: 'decision/dec-e-damped', component: DecEDampedOscillations, title: 'Entscheidung: Gedämpfte Schwingungen' },
    { path: 'decision/dec-e-driven', component: DecEDrivenOscillations, title: 'Entscheidung: Getriebene Schwingungen' },
    { path: 'decision/dec-t-damped', component: DecTDampedOscillations, title: 'Entscheidung: Gedämpfte Schwingungen' },
    { path: 'decision/dec-t-driven', component: DecTDrivenOscillations, title: 'Entscheidung: Getriebene Schwingungen' },

    // test pages
    { path: 'test/test-e-damped', component: TestEDampedOscillations, title: 'Test: Gedämpfte Schwingungen' },
    { path: 'test/test-e-driven', component: TestEDrivenOscillations, title: 'Test: Getriebene Schwingungen'},
    { path: 'test/test-t-damped', component: TestTDampedOscillation, title: 'Test: Gedämpfte Schwingungen' },
    { path: 'test/test-t-driven', component: TestTDrivenOscillation, title: 'Test: Getriebene Schwingungen'},

    // simulation pages
    { path: 'simulation/sim-e-damped', component: SimEDampedOscillations, title: 'Simulation: Gedämpfte Schwingungen' },
    { path: 'simulation/sim-e-driven', component: SimEDrivenOscillations, title: 'Simulation: Getriebene Schwingungen' },
    { path: 'simulation/sim-t-free', component: SimTFreeOscillations, title: 'Simulation: Ungedämpfte Schwingungen' },
    { path: 'simulation/sim-t-damped', component: SimTDampedOscillations, title: 'Simulation: Gedämpfte Schwingung' },
    { path: 'simulation/sim-t-driven', component: SimTDrivenXOscillations, title: 'Simulation: Gedämpfte getriebene Schwingung' },
    { path: 'simulation/sim-t-driven-advanced', component: SimTDrivenPhiOscillations,  title: 'Simulation: Gedämpfte getriebene Drehschwingung' },

    // target pages
    { path: 'target/tar-experiment', component: TarExperiment, title: 'Anleitung: Versuchsdurchführung' },
    { path: 'target/tar-theory', component: TarTheory, title: 'Anleitung: Versuchsaufbau' },
    { path: 'target/tar-chaos', component: TarChaos, title: 'Anleitung: Chaos' },
    { path: 'target/tar-simulation', component: TarSimulation, title: 'Anleitung: Simulation' },
];
