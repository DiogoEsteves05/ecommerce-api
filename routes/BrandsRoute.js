import exppress from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
} from "../controllers/BrandsController.js";

import isAdmin from "../middlewares/AdminRole.js";
import { isLoggedIn } from "../middlewares/LoginStatus.js";

const brandsRouter = exppress.Router();

// valida se o user esta conectado e se e' administrador
brandsRouter.post("/", isLoggedIn, isAdmin, createBrand);
brandsRouter.get("/", getAllBrands);
brandsRouter.get("/:id", getSingleBrand);
// valida se o user esta conectado e se e' administrador
brandsRouter.delete("/:id", isLoggedIn, isAdmin, deleteBrand);
// valida se o user esta conectado e se e' administrador
brandsRouter.put("/:id", isLoggedIn, isAdmin, updateBrand);

export default brandsRouter;