const User = require("../../models/user");

function profileController() {
  return {
    async index(req, res) {
      const users = await User.find({});
      return res.render("customers/profile", { users });
    },
    async updateProfileInfo(req, res) {
      const id = req.body.userId;

      const user = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            gender: req.body.gender,
            name: {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
            },
            email: req.body.email,
          },
        },
        { useFindAndModify: false, new: true }
      );
      console.log(user);
      res.redirect("/customer/profile");
    },
    async updateAddressInfo(req, res) {
      const id = req.body.userId;
      const {
        firstname,
        lastname,
        phone,
        locality,
        streetAddress,
        city,
        state,
        landmark,
        pincode,
        address_type,
      } = req.body;

      const user = await User.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            address: {
              firstname: firstname,
              lastname: lastname,
              street_address: streetAddress,
              locality: locality,
              city: city,
              state: state,
              landmark: landmark,
              pincode: pincode,
              phone,
              address_type: address_type,
            },
          },
        },
        { useFindAndModify: false, new: true }
      );
      console.log(user);
      res.redirect("/customer/profile");
    },
    async editAddressInfo(req, res) {
      const id = req.body.userId;
      const {
        firstname,
        lastname,
        phone,
        locality,
        streetAddress,
        city,
        state,
        landmark,
        pincode,
        address_type,
      } = req.body;

      const user = await User.findOneAndUpdate(
        {
          address: {
            $elemMatch: {
              _id: id,
            },
          },
        },
        {
          $set: {
            address: {
              firstname: firstname,
              lastname: lastname,
              street_address: streetAddress,
              locality: locality,
              city: city,
              state: state,
              landmark: landmark,
              pincode: pincode,
              phone,
              address_type: address_type,
            },
          },
        }
      );
      console.log(user);
      res.redirect("/customer/profile");
    },
    async deleteAddress(req, res) {
      try {
        const id = req.params.id;
        const user = await User.findOneAndDelete({
          _id: id,
        });
        console.log(user);
        res.redirect("/customer/profile");
      } catch (error) {
        console.log(error);
      }
    },

    async editProfile(req, res){
      try {
        req.user = await User.findById(req.params.id);
        console.log("Eto naganahhhhahhha ako")
        let user = req.user
        user.Firstname = req.body.Firstname
        user.Lastname = req.body.Lastname
        user.gender = req.body.gender
        user.email = req.body.email
        user.home_address = req.body.home_address
        try {
          user = user.save()
          res.redirect(`/customer/profile/`);
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.log(console.error());
      }
    },

    async editMenuss(req, res) {
      try {
        req.user = await User.findById(req.params.id);
        console.log("Eto naganahhhhahhha ako")
        let user = req.user
        user.Firstname = req.body.Firstname
        user.Lastname = req.body.Lastname
        user.phonenumber = req.body.phonenumber
        user.home_address = req.body.home_address
        user.cities = req.body.cities
        user.landmarks = req.body.landmarks
        user.zipcode = req.body.zipcode
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
    

  };
}

module.exports = profileController;
