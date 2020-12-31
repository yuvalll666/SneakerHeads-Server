const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    user: {
      type: Array,
      default: [],
    },
    paymentData: {
      type: Array,
      default: [],
    },
    product: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// Create mongoose Payment model with schema
const Payment = mongoose.model("Payment", paymentSchema);

exports.Payment = Payment;
