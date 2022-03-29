
import { Request, Response, Router } from 'express';
import { getCpuLoad } from '@services/cpu-load';

const router = Router();

router.get("/load", (req: Request, res: Response) => {
    const cpuLoadAverage = getCpuLoad();
    res.send({cpuLoadAverage});
})

// Export router
export default router;
