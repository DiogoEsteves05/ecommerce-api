import asyncHandler from "express-async-handler";
import Product from "../model/ProductModel.js";
import Review from "../model/ReviewModel.js";

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/Admin
export const createReview = asyncHandler(async (req, res) => {
  // obter parametros
  const { product, message, rating } = req.body;
  // encontrar produto de avaliacao
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  // se produto nao existir da erro
  if (!productFound) {
    throw new Error("Product Not Found");
  }
  // valida se utilizador ja fez avaliacao do produto
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("You have already reviewed this product");
  }
  // cria avaliacao
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });
  // adiciona avaliacao ao produto
  productFound.reviews.push(review?._id);
  await productFound.save();
  // envia resposta de sucesso
  res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});
