const Menu = require("../../models/menu");

function adminMenuController() {
    return {
        async index(req, res) {
          const order = await Menu.find();
          return res.render( "admin/adminMenu", { menu: order });
        },
      };
}
module.exports = adminMenuController;



 
