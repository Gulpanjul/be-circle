import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerOutput from './swagger-output.json'; // ganti dengan path kamu jika berbeda

export default function docs(app: Express) {
  const css = `
    .swagger-ui .topbar { display: none } 
    .information-container.wrapper { background:rgb(0, 255, 60); padding: 2rem } 
    .information-container .info { margin: 0 } 
    .information-container .info .main { margin: 0 !important } 
    .information-container .info .main .title { color: rgb(0, 0, 0) } 
    .renderedMarkdown p { margin: 0 !important; color: rgb(0, 0, 0) !important }
  `;

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCss: css,
      customSiteTitle: 'Circle App API',
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );
}
