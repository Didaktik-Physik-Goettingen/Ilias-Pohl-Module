import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // These routes are SSR-safe and prerendered at build time
  { path: '',                    renderMode: RenderMode.Prerender },
  { path: 'glossary',            renderMode: RenderMode.Prerender },
  { path: 'glossary/**',         renderMode: RenderMode.Prerender },
  { path: 'target/tar-experiment', renderMode: RenderMode.Prerender },

  // All other routes use browser APIs (canvas, MathJax, CanActivateFn redirects).
  // Angular SSR serves the CSR shell so the client-side router takes over.
  { path: '**',                  renderMode: RenderMode.Client },
];
