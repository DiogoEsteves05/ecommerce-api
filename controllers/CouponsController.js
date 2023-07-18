import asyncHandler from "express-async-handler";
import Coupon from "../model/CouponModel.js";

// @desc    Create new Coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  // parametros a receber
  const { code, startDate, endDate, discount } = req.body;
  // verifica se cupao ja existe
  const couponsExists = await Coupon.findOne({
    code,
  });
  // se existir da erro
  if (couponsExists) {
    throw new Error("Coupon already exists");
  }
  // valida se desconto e' um numero
  if (isNaN(discount)) {
    throw new Error("Discount value must be a number");
  }
  // cria cupao de desconto
  const coupon = await Coupon.create({
    code: code,
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  // envia resposta de sucesso com cupao criado
  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
  // procura cupoes existentes
  const coupons = await Coupon.find();
  // envia resposta de sucesso com os cupoes encontrados
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
export const getCoupon = asyncHandler(async (req, res) => {
  // procura cupao por id
  const coupon = await Coupon.findOne({ code: req.query.code });
  // se cupao nao existir da erro
  if (coupon === null) {
    throw new Error("Coupon not found");
  }
  // se o cupao nao estiver dentro da validade da erro
  if (coupon.isExpired) {
    throw new Error("Coupon Expired");
  }
  // envia resposta de sucesso com o cupao
  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  // parametros a receber
  const { code, startDate, endDate, discount } = req.body;
  // procura cupao por id e atualiza com novos parametros
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );
  // envia resposta de sucesso com cupao atualizado
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

// @desc    delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  // procura cupao por id e apaga
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  // envia resposta de sucesso do cupao apagado
  res.json({
    status: "success",
    message: "Coupon deleted successfully",
    coupon,
  });
});
