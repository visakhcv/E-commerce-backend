import { Router } from 'express';
import { IndexController } from '../apps/controllers/index.controller';

const router = Router();
const indexController = new IndexController();

router.route('/').get(indexController.welcome.bind(indexController));
router.route('/protected').get(indexController.protected.bind(indexController));

export default router;
