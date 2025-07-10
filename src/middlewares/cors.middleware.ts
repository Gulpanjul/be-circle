import cors from 'cors';

const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'https://gulpanjul-fe-circle.vercel.app'],
  credentials: true,
});

export default corsMiddleware;
