import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ResultsTracking } from '../../../core/services/results-tracking';
import { GlossaryOverlay } from '../../../shared/glossary-overlay/glossary-overlay.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test implements OnInit, OnDestroy {

  constructor(
    private trackingService: ResultsTracking,
    public glossaryOverlay: GlossaryOverlay
  ) {}

  ngOnInit() {
    this.trackingService.startModule('test');
  }

  ngOnDestroy() {
    this.trackingService.endModule();
  }
}