import exppress from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateShippingAddres,
} from "../controllers/UserController.js";
import { isLoggedIn } from "../middlewares/LoginStatus.js";

const userRouter = exppress.Router();
// passar o endpoint e o respetivo controlador
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
// valida se o user esta login primeiro
userRouter.get("/profile", isLoggedIn, getUserProfile);
// valida se o user esta login primeiro
userRouter.put("/update/shipping", isLoggedIn, updateShippingAddres);
export default userRouter;
