import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      name: {
        type: String,
      },
      address: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      city: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

//compile / map the schema into model
const User = mongoose.model("User", UserShema);

export default User;