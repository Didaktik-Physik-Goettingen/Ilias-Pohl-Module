import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { NavBar } from './shared/nav-bar/nav-bar';
import { Analytics } from './core/services/analytics';
import { DataExport } from './core/services/data-export';



@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, NavBar],
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
        // resume only when the student comes in through the start page (the bridge); a reload or a link stays put
        this.dataExport.loadProgress().then(lastPage => {
            if (!lastPage) return;      // also on the server, which has no window
            const onStartPage = window.location.pathname === new URL(document.baseURI).pathname;
            if (onStartPage) this.router.navigateByUrl(lastPage);
        });
    }
}
