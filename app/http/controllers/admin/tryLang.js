const express = require('express');
const router = express.Router();
const Menu = require("../../models/menu");
function tryLang() {
  return {
   async index(request, response) {
       console.log(request.params.id);
       console.log("pakyu bente");
        response.render(request.params.id);
    },
    async postItem(request, response) {
      let menu = new Menu({
          name: request.body.name,
          image: request.file.filename,
          price: request.body.price,
      });
      try {
        menu = await menu.save()  
        response.redirect(`/admin/newItem/${menu.id}`);
      } catch (error) {
        console.log(error)
      }
    },
  };

}

module.exports = router;
module.exports = tryLang;
