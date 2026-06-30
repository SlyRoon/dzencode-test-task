import { Router } from 'express';

import { orderController } from '../controllers/order.controller';
const router = Router();


router.get('/', orderController.getAll);
router.post('/', orderController.create);
router.delete('/:id', orderController.deleteById);

export default router;
