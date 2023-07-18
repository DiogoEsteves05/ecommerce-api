import exppress from "express";
import upload from "../config/FileUpload.js";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductsController.js";
import isAdmin from "../middlewares/AdminRole.js";
import { isLoggedIn } from "../middlewares/LoginStatus.js";

const productsRouter = exppress.Router();

// valida se o user esta conectado e se e' administrador
productsRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  createProduct
);

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);
// valida se o user esta conectado e se e' administrador
productsRouter.put("/:id", isLoggedIn, isAdmin, updateProduct);
// valida se o user esta conectado e se e' administrador
productsRouter.delete("/:id/delete", isLoggedIn, isAdmin, deleteProduct);
export default productsRouter;
