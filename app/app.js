import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";
dotenv.config();
import express from "express";
import dbConnect from "../config/DBConfig.js";
import { errorHandler, notFound } from "../middlewares/ErrorHandler.js";
import brandsRouter from "../routes/BrandsRoute.js";
import categoriesRouter from "../routes/CategoriesRoute.js";
import orderRouter from "../routes/OrdersRoute.js";
import productsRouter from "../routes/ProductsRoute.js";
import reviewRouter from "../routes/ReviewRoute.js";
import userRouter from "../routes/UserRoute.js";
import couponsRouter from "../routes/CouponsRoute.js";
import Order from "../model/OrderModel";

//connection to the db
dbConnect();

const app = express();
// cors
app.use(cors());
// Stripe webhook
// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_2a222b6d6b7abb9982f25d1da9e63f4d0a78f6935259e4ff65cae8df7b5fdde5";

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (request, response) => {
        const sig = request.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
            console.log("event");
        } catch (err) {
            console.log("err", err.message);
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        if (event.type === "checkout.session.completed") {
            // atializar order
            const session = event.data.object;
            const { orderId } = session.metadata;
            const paymentStatus = session.payment_status;
            const paymentMethod = session.payment_method_types[0];
            const totalAmount = session.amount_total;
            const currency = session.currency;
            // encontrar order
            const order = await Order.findByIdAndUpdate(
                JSON.parse(orderId),
                {
                totalPrice: totalAmount / 100,
                currency,
                paymentMethod,
                paymentStatus,
                },
                {
                new: true,
                }
            );

        } else {
            return;
        }
        // retorna ok 200 como resposta a' recepcao do evento
        response.send();
    }
);

// para conseguirmos aceder aos dados passados por json
app.use(express.json());
// url encoded
app.use(express.urlencoded({ extended: true }));
// server static files
app.use(express.static("public"));

// routes
// Home route
app.get("/", (req, res) => {
res.sendFile(path.join("public", "index.html"));
});
app.use("/api/users/", userRouter);
app.use("/api/products/", productsRouter);
app.use("/api/categories/", categoriesRouter);
app.use("/api/brands/", brandsRouter);
app.use("/api/reviews/", reviewRouter);
app.use("/api/orders/", orderRouter);
app.use("/api/coupons/", couponsRouter);
// erro middleware
// primeiro se o pedido não existir e' apanhada no middleware de notFound que envia o erro 404 de pagina nao encontrada
app.use(notFound);
// caso o pedido tenha um excepção, essa é apanhada no middleware do errorHandler que envia o erro para o utilizador com o estatos 500 por default caso o mesmo não tenha sido definido
app.use(errorHandler);

export default app;
