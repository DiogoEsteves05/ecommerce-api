import exppress from "express";
import {
  createOrder,
  getAllorders,
  getSingleOrder,
  updateOrder,
  getOrderStats,
} from "../controllers/OrderController.js";
import { isLoggedIn } from "../middlewares/LoginStatus.js";

const orderRouter = exppress.Router();

// valida se o user esta login primeiro - todos os endpoints
orderRouter.post("/", isLoggedIn, createOrder);
orderRouter.get("/", isLoggedIn, getAllorders);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStats);
orderRouter.put("/update/:id", isLoggedIn, updateOrder);
orderRouter.get("/:id", isLoggedIn, getSingleOrder);

export default orderRouter;
