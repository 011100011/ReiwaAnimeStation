const orders = require("../../models/order");
const users = require("../../models/user");

function adminLandingController() {
  return {
   async index(req, res) {
      orders
        .find({ status: { $ne: "completed" } }, null, {
          sort: { createdAt: -1 },
        })
        .populate("customerId", "-password")
        .exec((err, orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render("admin/adminLanding");
          }
        });
    },
  };
}
module.exports = adminLandingController;
