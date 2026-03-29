import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { responseFormat } from './middlewares/response';
import { errorHandler } from './middlewares/error';
import { versionMiddleware } from './middlewares/version';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(responseFormat);

app.get('/api/health', (req, res) => {
  res.success({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1', versionMiddleware, routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API version: 1.0.0`);
});

export default app;