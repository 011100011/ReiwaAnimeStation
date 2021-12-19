const Order = require("../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PVT_KEY);
// const shortid = require("shortid");
// const Razorpay = require("razorpay");
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

function orderController() {
  return {
    store(req, res) {
      // validate request
      const {
        paymentType,
        phone,
        total,
        address,
        firstname,
        lastname,
        landmark,
        city,
        branch,
        pincode,
        stripeToken,
      } = req.body;

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        paymentType: paymentType,
        address: {
          firstName: firstname,
          lastName: lastname,
          street_address: address,
          landmark: landmark,
          city: city,
          branch: branch,
          pincode: pincode,
          phone: phone,
          total: total,
        },
      });
      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
            // Stripe Payment
            if (paymentType === "stripe") {
              stripe.charges
                .create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "php",
                  description: `Food order Id: ${placedOrder._id}`,
                })
                .then(() => {
                  placedOrder.paymentStatus = true;
                  placedOrder.paymentType = paymentType;
                  placedOrder
                    .save()
                    .then((order) => {
                      // Emit event
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", order);
                      delete req.session.cart;
                      return res.status(200).json({
                        message:
                          "Payment successful, Order placed successfully",
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  delete req.session.cart;
                  return res.status(422).json({
                    message:
                      "Order Placed but Payment Failed, You can pay at delivery time",
                  });
                });
            }
            if (
              paymentType === "paytm" ||
              paymentType === "gPay" ||
              paymentType === "amazonPay" ||
              paymentType === "razorpay"
            ) {
              return;
            } else {
              delete req.session.cart;
              return res
                .status(200)
                .json({ message: "Order placed successfully" });
            }
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Something went wrong" });
        });
    },
    async index(req, res) {
      try {
        const orders = await Order.find({customerId: req.user._id,},
          null,
          { sort: { createdAt: -1 } } );
        res.header("Cache-Control","no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
        res.render("customers/orders", { orders: orders, moment: moment });
      }catch (error) {
        console.log(error);
      }
    },
    async show(req, res) {
      try {
        const order = await Order.findById(req.params.id);
        res.render("customers/singleOrder", { order });
      } catch (error) {
        console.log(console.error());
      }
    },
  };
}

module.exports = orderController;
