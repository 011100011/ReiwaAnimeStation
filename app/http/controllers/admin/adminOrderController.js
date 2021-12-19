const orders = require("../../models/order");
const users = require("../../models/user");

function AdminOrderController() {
  return {
   async index(req, res) {
      orders
        .find({ status: { $ne: "delivered" } }, null, {
          sort: { createdAt: -1 },
        })
        .populate("customerId", "-password")
        .exec((err, orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render("admin/orders");
          }
        });
    },
  };
}
module.exports = AdminOrderController;
