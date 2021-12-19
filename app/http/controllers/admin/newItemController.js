const express = require('express');
const router = express.Router();
const Menu = require("../../models/menu");
function newItemController() {
  return {
   async index(request, response) {
   return response.render("admin/newItem");
    },
    async getItem(request, response){
      console.log("tng ina mo");
      response.render(request.params.id);
    },
    async postItem(request, response) {
      let menu = new Menu({
          name: request.body.name,
          image: request.file.filename,
          price: request.body.price,
          status: request.body.status,
      });
      try {
        menu = await menu.save()
        response.redirect(`/admin/adminMenu/`);
      } catch (error) {
        console.log(error)
      }
    },
    async showMenu(req, res) {
      try {
        const menu = await Menu.findById(req.params.id);
        console.log("Eto naganaggg ako")
        res.render("admin/singleMenu", { menu });
      } catch (error) {
        console.log(console.error());
      }
    },

    async viewMenu(req, res) {
      try {
        const menu = await Menu.findById(req.params.id);
        console.log("Eto naganahhh ako")
        res.render("admin/editMenu", { menu });
      } catch (error) {
        console.log(console.error());
      }
    },

    async editMenus(req, res) {
      try {
        req.menu = await Menu.findById(req.params.id);
        console.log("Eto ahhahhhha ako")
        let menu = req.menu
        menu.name = req.body.name
        menu.price = req.body.price
        menu.image = req.file.filename
        menu.status = req.body.status
        try {
          menu = menu.save()
          res.redirect(`/admin/adminMenu/`);
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(console.error());
      }
    },

    async deleteMenus(req, res) {
    await Menu.findByIdAndDelete(req.params.id);
        res.redirect(`/admin/adminMenu/`);

    },

  };

}

module.exports = router;
module.exports = newItemController;
