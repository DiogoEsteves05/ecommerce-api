import exppress from "express";
import {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/CouponsController.js";

import isAdmin from "../middlewares/AdminRole.js";
import { isLoggedIn } from "../middlewares/LoginStatus.js";

const couponsRouter = exppress.Router();

// valida se o user esta login primeiro
couponsRouter.post("/", isLoggedIn, createCoupon);
couponsRouter.get("/", getAllCoupons);
// valida se o user esta conectado e se e' administrador
couponsRouter.put("/update/:id", isLoggedIn, isAdmin, updateCoupon);
// valida se o user esta conectado e se e' administrador
couponsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCoupon);
couponsRouter.get("/single", getCoupon);

export default couponsRouter;
