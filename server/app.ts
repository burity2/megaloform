import express from 'express';
import cors from 'cors';
import router from './router';

const app = express();

// Lock CORS to known origins. CORS_ORIGIN can be a single URL or a
// comma-separated list (e.g. for staging + prod). Falls back to Vite's
// dev port for local development.
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.send('Let\'s serve some candidates!');
})

export default app;
