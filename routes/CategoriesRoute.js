import exppress from "express";
import catetgoryFileUpload from "../config/CategoryUpload.js";
import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoriesController.js";

import { isLoggedIn } from "../middlewares/LoginStatus.js";

const categoriesRouter = exppress.Router();

categoriesRouter.post(
  "/",
  isLoggedIn,
  catetgoryFileUpload.single("file"),
  createCategory
);
categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getSingleCategory);
categoriesRouter.delete("/:id", deleteCategory);
categoriesRouter.put("/:id", updateCategory);
export default categoriesRouter;
