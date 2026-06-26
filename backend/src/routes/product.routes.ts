import { Router } from "express";
import { productController } from "../controllers/product.controller";

const router = Router();

router.get('/', productController.getAll);
router.post('/', productController.create);
router.delete('/:id', productController.deleteById);

export default router;
