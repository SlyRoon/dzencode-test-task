import { Router } from "express";
import orderRoutes from "./order.routes";
import productRoutes from "./product.routes";

const apiRouter = Router();
apiRouter.use("/orders", orderRoutes);
apiRouter.use("/products", productRoutes);

export default apiRouter;
