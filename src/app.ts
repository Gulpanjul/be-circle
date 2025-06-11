import express from 'express';
import routes from './routes';
import db from './utils/database';
import docs from './swagger/routes';

async function init() {
  try {
    const result = await db();

    console.log('database status: ', result);

    const app = express();
    const PORT = 3001;

    app.get('/', (req, res) => {
      res.status(200).json({
        message: 'Server is running',
        data: null,
      });
    });

    app.use(express.json());
    app.use(routes);
    docs(app);

    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
