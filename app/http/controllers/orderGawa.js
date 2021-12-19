const orders = require("../models/order");

function orderGawa() {
  return {
    async index(req, res) {
      const order = await orders.find();
      return res.render("admin/orders", { order: order });    
    },
  };
}

module.exports = orderGawa;
