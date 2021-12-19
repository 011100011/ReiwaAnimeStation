const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: { type: Object, required: true, },
    address: {
        firstName:{ type:String, required: true, },
        lastName:{ type:String, required: true, },
        street_address:{ type: String, required: true, },
        landmark:{ type: String, required: true, },
        city: { type: String, required: true },
        branch: {type: String, required: true},
        pincode:{ type: Number, required: true, },
        phone: { type: Number, required: true, },
        total: { type: Number, required: true, },
      },
    paymentType:{ type: String, default: "COD", },
    paymentStatus:{ type:Boolean, default:false },
    status:{ type: String, default: "order_placed", },
  },{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema)