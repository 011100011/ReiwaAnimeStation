const { json } = require("express");
const User = require("../../models/user");
function cartController() {
  return {
    async index(req, res) {
      const users = await User.find({});
      return res.render("customers/cart", { users });
    },
    update(req, res) {
      // for the first time creating cart and adding basic object structure
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 40,
        };
      }
      let cart = req.session.cart;

      // Check if item does not exist in cart
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }
      return res.json({ totalQty: req.session.cart.totalQty });
    },
    minusUpdate(req, res){
      //First time creating cart and adding basic object structure
       if(!req.session.cart){
           req.session.cart = {
               items: {},
               totalQty: 0,
               totalPrice: 0
           }
       }
       let cart = req.session.cart

       console.log("Item removed from the cart")
       console.log(req.body)
       //Check if item doesn't exist in cart
       if(cart.items[req.body._id]){
         if(cart.items[req.body._id].qty > 1){
          cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1
          cart.totalQty = cart.totalQty - 1
          cart.totalPrice = cart.totalPrice - req.body.price
         }
         else{
          cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1
          cart.totalQty = cart.totalQty - 1
          cart.totalPrice = cart.totalPrice - req.body.price
          delete req.session.cart.items[req.body._id];
         }
        }
       else{
         delete req.session.cart;
        }
        delete res.json({ totalQty: req.session.cart.totalQty })
    },
    deleteItem(req, res) {
      let cart = req.session.cart;
      if (!cart.items) {
        delete req.session.cart;
      }
      cart.totalQty = cart.totalQty - req.session.cart.items[req.body.id].qty;
      cart.totalPrice =
        cart.totalPrice -
        req.session.cart.items[req.body.id].item.price *
          req.session.cart.items[req.body.id].qty;
      delete req.session.cart.items[req.body.id];
      return res.redirect("/cart");
    },
    async deleteAddress(req, res) {
      const id = req.params.id;
      const user = await User.findOneAndDelete({
        address: {
          _id: id,
        },
      });
      console.log(user);
      res.redirect("/cart");
    },
  };
}

module.exports = cartController;
