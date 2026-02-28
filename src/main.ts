import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { logger } from './utils/logger.js';

dotenv.config({ quiet: true });

const APP_PORT = process.env.APP_PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', apiRoutes);

app.listen(APP_PORT, () => logger.info(`Server running...`))
  .on('error', (err) => {
    logger.error('Failed to start server', err);
    process.exit(1);
  });