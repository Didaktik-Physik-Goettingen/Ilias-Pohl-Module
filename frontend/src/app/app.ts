import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { Analytics } from './core/services/analytics';
import { DataExport } from './core/services/data-export';
import { isPrintMode } from './core/print-mode';



@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer],
    templateUrl: './app.html',
    styleUrl: './app.css'
})



export class App implements OnInit {
    protected readonly title = signal('ilias-pohl-module');

    constructor(
        private _analytics: Analytics,
        private dataExport: DataExport,
        private router: Router
    ) {}

    ngOnInit() {
        // In print mode we still hydrate progress (so answers render), but must NOT
        // auto-redirect to the last page — the report renders each URL explicitly.
        this.dataExport.loadProgress().then(lastPage => {
            if (lastPage && !isPrintMode()) this.router.navigateByUrl(lastPage);
        });
    }
}
