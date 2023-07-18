import exppress from "express";
import { createReview } from "../controllers/ReviewsController.js";
import { isLoggedIn } from "../middlewares/LoginStatus.js";

const reviewRouter = exppress.Router();

// valida se o user esta login primeiro
reviewRouter.post("/:productID", isLoggedIn, createReview);

export default reviewRouter;
