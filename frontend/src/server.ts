import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { generateReportPdf, ReportUserNotFoundError } from './report/generate-report-pdf';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * PDF report of everything a specific user saw while working through the module.
 * Renders each visited page once (first-visit order) via headless Chromium and
 * merges them into one PDF. Must be registered before the Angular catch-all.
 *
 * API_BASE_URL points at the PHP backend (default: local dev server on :8000).
 */
app.get('/report/:username', async (req, res) => {
  const port = process.env['PORT'] || 4000;
  const origin = process.env['REPORT_ORIGIN'] || `http://localhost:${port}`;
  const apiBaseUrl = process.env['API_BASE_URL'] || 'http://localhost:8000';
  const username = req.params.username;

  try {
    const pdf = await generateReportPdf({ username, origin, apiBaseUrl });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report-${encodeURIComponent(username)}.pdf"`,
    );
    res.end(Buffer.from(pdf));
  } catch (err) {
    if (err instanceof ReportUserNotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Report generation failed:', err);
    res.status(500).json({ error: 'Report generation failed' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
