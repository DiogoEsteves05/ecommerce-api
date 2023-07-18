import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/OrderModel.js";
import Product from "../model/ProductModel.js";
import User from "../model/UserModel.js";

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

//@desc create orders
//@route POST /api/orders
//@access private
export const createOrder = asyncHandler(async (req, res) => {
  // obter cupao
  const { coupon } = req?.query;
  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });
  if (couponFound?.isExpired) {
    throw new Error("Coupon has expired");
  }
  if (!couponFound) {
    throw new Error("Coupon does exists");
  }
  // obter desconto
  const discount = couponFound?.discount / 100;

  // parametros a receber
  const { orderItems, shippingAddress, totalPrice } = req.body;
  // encontrar utilizador
  const user = await User.findById(req.userAuthId);
  // valida se utilizador tem uma morada de entrega
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  // valida se compra tem items
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  // cria a ordem de compra
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });

  // procura os produtos da compra para atualizar quantidades
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  // adiciona compra ao utilizador
  user.orders.push(order?._id);
  await user.save();

  // pagamento via stripe
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });
});

//@desc get all orders
//@route GET /api/orders
//@access private
export const getAllorders = asyncHandler(async (req, res) => {
  // encontra todas as compras do utilizador
  const orders = await Order.find().populate("user");
  // envia mensagem de sucesso
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

//@desc get single order
//@route GET /api/orders/:id
//@access private/admin
export const getSingleOrder = asyncHandler(async (req, res) => {
  // obter id dos parametros
  const id = req.params.id;
  // encontra compra pelo id
  const order = await Order.findById(id);
  // envia mensagem de sucesso
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

//@desc update order to delivered
//@route PUT /api/orders/update/:id
//@access private/admin
export const updateOrder = asyncHandler(async (req, res) => {
  // obter id dos parametros
  const id = req.params.id;
  // encontra compra pelo id e atualiza o seu estado
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  // envia resposta de sucesso
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

//@desc get sales sum of orders
//@route GET /api/orders/sales/sum
//@access private/admin
export const getOrderStats = asyncHandler(async (req, res) => {
  // obter estatisticas das compras
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  // envia resposta
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
