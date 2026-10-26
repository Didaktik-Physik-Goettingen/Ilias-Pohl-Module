import { Provider, EnvironmentProviders } from '@angular/core';
import { provideRouter } from '@angular/router';

// Global providers for all unit tests (angular.json → test.options.providersFile).
// Session (injected by most components via the tracking services) needs ActivatedRoute.
const testProviders: (Provider | EnvironmentProviders)[] = [
    provideRouter([]),
];

export default testProviders;
