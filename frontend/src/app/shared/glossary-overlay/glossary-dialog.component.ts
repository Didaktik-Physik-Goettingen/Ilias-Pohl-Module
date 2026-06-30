import { Component, Inject, Injector, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { GLOSSARY_IS_OVERLAY } from './glossary-is-overlay.token';

import { Amplitude }           from '../../features/glossary_features/amplitude/amplitude';
import { AngularFrequency }    from '../../features/glossary_features/angular-frequency/angular-frequency';
import { AngularMomentum }     from '../../features/glossary_features/angular-momentum/angular-momentum';
import { CriticalDamping }     from '../../features/glossary_features/critical-damping/critical-damping';
import { DampingCoefficient }  from '../../features/glossary_features/damping-coefficient/damping-coefficient';
import { DirectiveMoment }     from '../../features/glossary_features/directive-moment/directive-moment';
import { ExponentialAnsatz }   from '../../features/glossary_features/exponential-ansatz/exponential-ansatz';
import { HomDgl }              from '../../features/glossary_features/hom-dgl/hom-dgl';
import { InhomDgl }            from '../../features/glossary_features/inhom-dgl/inhom-dgl';
import { MomentOfInertia }     from '../../features/glossary_features/moment-of-inertia/moment-of-inertia';
import { NaturalFrequency }    from '../../features/glossary_features/natural-frequency/natural-frequency';
import { SpringConstant }      from '../../features/glossary_features/spring-constant/spring-constant';

const TERM_MAP: Record<string, Type<any>> = {
    'amplitude':           Amplitude,
    'angular-frequency':   AngularFrequency,
    'angular-momentum':    AngularMomentum,
    'critical-damping':    CriticalDamping,
    'damping-coefficient': DampingCoefficient,
    'directive-moment':    DirectiveMoment,
    'exponential-ansatz':  ExponentialAnsatz,
    'hom-dgl':             HomDgl,
    'inhom-dgl':           InhomDgl,
    'moment-of-inertia':   MomentOfInertia,
    'natural-frequency':   NaturalFrequency,
    'spring-constant':     SpringConstant,
};

@Component({
    selector: 'app-glossary-dialog',
    standalone: true,
    imports: [NgComponentOutlet],
    templateUrl: './glossary-dialog.component.html',
    styleUrl: './glossary-dialog.component.css',
})
export class GlossaryDialogComponent {
    component: Type<any> | null;
    overlayInjector: Injector;

    constructor(
        @Inject(DIALOG_DATA) public data: { term: string },
        private dialogRef: DialogRef,
        private injector: Injector
    ) {
        this.component = TERM_MAP[data.term] ?? null;

        // Provide GLOSSARY_IS_OVERLAY=true so the glossary component hides its back button.
        this.overlayInjector = Injector.create({
            providers: [{ provide: GLOSSARY_IS_OVERLAY, useValue: true }],
            parent: this.injector,
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
