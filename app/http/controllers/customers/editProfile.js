const express = require('express');
const router = express.Router();
const User = require("../../models/user");
function editProfile() {
    return {
        async index(req, res) {
          const users = await User.find({});
          return res.render("customers/editProfile", { users });
        },
        
    async editMenus(req, res) {
      try {
        req.user = await User.findById(req.params.id);
        console.log("Eto naganahhhhahhha ako")
        let user = req.user
        user.Firstname = req.body.Firstname
        try {
            user = user.save()
            res.redirect("/customer/profile");
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
module.exports = editProfile;
