import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { DevModeService } from '../../../core/services/dev-mode';

@Component({
  selector: 'app-tar-experiment',
  imports: [],
  templateUrl: './tar-experiment.html',
  styleUrl: './tar-experiment.css',
})
export class TarExperiment {
  constructor(
    public devMode: DevModeService,
    private location: Location,
  ) {}

  goBack(): void {
    this.location.back();
  }
}
