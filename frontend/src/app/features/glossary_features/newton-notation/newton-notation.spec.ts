import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtonNotation } from './newton-notation';

describe('NewtonNotation', () => {
    let component: NewtonNotation;
    let fixture: ComponentFixture<NewtonNotation>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewtonNotation],
        }).compileComponents();

        fixture = TestBed.createComponent(NewtonNotation);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
