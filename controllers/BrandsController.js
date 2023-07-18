import asyncHandler from "express-async-handler";
import Brand from "../model/BrandModel.js";

// @desc    Create new Brand
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = asyncHandler(async (req, res) => {
  // parametros a receber
  const { name } = req.body;
  // procura se a marca existe
  const brandFound = await Brand.findOne({ name });
  // se o nome da marca ja' existir da' erro
  if (brandFound) {
    throw new Error("Brand already exists");
  }
  // cria a marca
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  // envia resposta de sucesso
  res.json({
    status: "success",
    message: "Brand created successfully",
    brand,
  });
});

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getAllBrands = asyncHandler(async (req, res) => {
  // procura todas as marcas
  const brands = await Brand.find();
  // envia resposta com as marcas encontradas
  res.json({
    status: "success",
    message: "Brands fetched successfully",
    brands,
  });
});

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
export const getSingleBrand = asyncHandler(async (req, res) => {
  // procura marca pelo id
  const brand = await Brand.findById(req.params.id);
  // se a marca nao existir da' erro
  if (brand) {
    throw new Error("Brand doesn't exist");
  }
  // envia resposta com a marca encontrada
  res.json({
    status: "success",
    message: "brand fetched successfully",
    brand,
  });
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrand = asyncHandler(async (req, res) => {
  // parametros a receber
  const { name } = req.body;
  // procura marca e atualiza
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  // envia resposta de sucesso com a marca atualizada
  res.json({
    status: "success",
    message: "brand updated successfully",
    brand,
  });
});

// @desc    delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrand = asyncHandler(async (req, res) => {
  // procura marca e apaga
  await Brand.findByIdAndDelete(req.params.id);
  // envia resposta de sucesso sobre a marca apagada
  res.json({
    status: "success",
    message: "brand deleted successfully",
  });
});