const Menu = require("../models/menu");

function homeController() {
  return {
    async index(req, res) {
      const order = await Menu.find();
      return res.render("home", { order: order });
    },
  };
}

module.exports = homeController;
