import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerOutput from './swagger-output.json';
import fs from 'fs';
import path from 'path';

export default function docs(app: Express) {
  const css = fs.readFileSync(
    path.resolve(
      __dirname,
      '../../node_modules/swagger-ui-dist/swagger-ui.css',
    ),
    'utf-8',
  );

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCss:
        css +
        `
        .swagger-ui .topbar { display: none; }
        .information-container.wrapper { background:#04A51E; padding:2rem; }
        .information-container .info .main .title,
        .swagger-ui .renderedMarkdown p,
        .swagger-ui .info .description,
        .swagger-ui .info {
        color: white !important;
      }
      `,
      customSiteTitle: 'Circle App API',
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );
}
