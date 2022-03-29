import { Router } from 'express';
import cpuRouter from './cpu-router';

// Init
const apiRouter = Router();

// Add api routes
apiRouter.use('/cpu', cpuRouter);

// Export default
export default apiRouter;
