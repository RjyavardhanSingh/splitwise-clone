import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import groupRoutes from './src/routes/group.routes.js';
import expenseRoutes from './src/routes/expense.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import miscRoutes from './src/routes/misc.routes.js';
import errorHandler from './src/middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL, process.env.CLIENT_URL.replace(/\/$/, '')] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const match = allowedOrigins.find(o => origin === o || origin === o.replace(/\/$/, ''));
    if (match) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/groups', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', miscRoutes);

app.use(errorHandler);

export default app;
