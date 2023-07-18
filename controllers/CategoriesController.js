import asyncHandler from "express-async-handler";
import Category from "../model/CategoryModel.js";

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  // parametros a receber
  const { name } = req.body;
  // procura se categoria existe pelo nome
  const categoryFound = await Category.findOne({ name });
  // se nome de categoria já existir emite erro
  if (categoryFound) {
    throw new Error("Category already exists");
  }
  // cria categoria
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req?.file?.path,
  });
  // envia resposta de sucesso com categoria criada
  res.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  // procura categorias existentes
  const categories = await Category.find();
  // envia resposta de sucesso com categorias encontradas
  res.json({
    status: "success",
    message: "Categories fetched successfully",
    categories,
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getSingleCategory = asyncHandler(async (req, res) => {
  // procura categoria pelo id
  const category = await Category.findById(req.params.id);
  // envia resposta de sucesso com categoria encontrada
  res.json({
    status: "success",
    message: "Category fetched successfully",
    category,
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  // parametros a receber
  const { name } = req.body;
  // encontra categoria por id e atualiza
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  // envia resposta de sucesso com categoria atualizada
  res.json({
    status: "success",
    message: "category updated successfully",
    category,
  });
});

// @desc    delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  // procura categoria por id e apaga
  await Category.findByIdAndDelete(req.params.id);
  // envia resposta de sucesso de categoria apagada
  res.json({
    status: "success",
    message: "Category deleted successfully",
  });
});
