const homeController = require("../app/http/controllers/homeController");
const orderGawa = require("../app/http/controllers/orderGawa");

const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/adminOrderController");
const statusController = require("../app/http/controllers/admin/statusController");
const profileController = require("../app/http/controllers/customers/profileController");

const editProfile = require("../app/http/controllers/customers/editProfile");


//gawa gawa
const adminOrderControllerMakati = require("../app/http/controllers/admin/adminOrderControllerMakati");

const statusControllerMakati = require("../app/http/controllers/admin/statusControllerMakati");

const adminOrderControllerOrtigas = require("../app/http/controllers/admin/adminOrderControllerOrtigas");

const adminLandingController = require("../app/http/controllers/admin/adminLandingController");

const statusControllerOrtigas = require("../app/http/controllers/admin/statusControllerOrtigas");

const adminMenuController = require("../app/http/controllers/admin/adminMenuController");

const newItemController = require("../app/http/controllers/admin/newItemController");

const tryLang = require("../app/http/controllers/admin/tryLang");

//rider makati
const adminRiderOrderControllerMakati = require("../app/http/controllers/admin/adminRiderOrderControllerMakati");
const riderStatusControllerMakati = require("../app/http/controllers/admin/riderStatusControllerMakati");

//rider ortigas
const adminRiderOrderControllerOrtigas = require("../app/http/controllers/admin/adminRiderOrderControllerOrtigas");
const riderStatusControllerOrtigas = require("../app/http/controllers/admin/riderStatusControllerOrtigas");

//rider main
const adminRiderOrderControllerMain = require("../app/http/controllers/admin/adminRiderOrderControllerMain");
const riderStatusControllerMain = require("../app/http/controllers/admin/riderStatusControllerMain");




const passport = require("passport");

// middleware
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");

function initRoutes(app) {

  app.get("/", homeController().index);

  app.get("/login", guest, authController().login);

  app.get("/logout", authController().logout);

  app.post("/login", authController().postLogin);

  app.get("/register", guest, authController().register);

  app.post("/register", authController().postRegister);

  // cart
  app.get("/cart", cartController().index);

  app.post("/cart/remove-item", cartController().deleteItem);

  //rider makati
  app.get("/admin/makatiRider", admin, adminRiderOrderControllerMakati().index);
  app.post("/admin/makatiRider/status", admin, riderStatusControllerMakati().update);

  //rider ortigas
  app.get("/admin/ortigasRider", admin, adminRiderOrderControllerOrtigas().index);
  app.post("/admin/ortigasRider/status", admin, riderStatusControllerOrtigas().update);

  //rider main
  app.get("/admin/mainRider", admin, adminRiderOrderControllerMain().index);
  app.post("/admin/mainRider/status", admin, riderStatusControllerMain().update);



const multer = require('multer')
const storage = multer.diskStorage({
  destination:function(request, file, callback){
    callback(null, './public/img/REIWAImg/REIWAMenu/TurningJapanese');
  },
  filename:function(request, file, callback){
    callback(null,Date.now() + file.originalname)
  }
});
const upload = multer({
 storage:storage,
 limits:{
   fieldSize: 1024*1024*100,
 }
});
  //app.post("/viewItem", upload.single('image'), newItemController().postItem);

  app.post("/viewItem", admin, upload.single('image'), newItemController().postItem);
  app.put("/viewItem1/:id", admin, upload.single('image'), newItemController().editMenus);
  app.delete("/deleteItem/:id", admin, newItemController().deleteMenus);


  //app.put("/editProfile/:id", profileController().editProfile);

  app.get("/customer/editProfile/", editProfile().index);

  app.put("/viewItem2/:id", upload.single('image'), editProfile().editMenus);

  app.put("/viewItem3/:id", upload.single('image'), profileController().editMenuss);

  //app.post("/viewItem/:id", upload.single('image'), newItemController().editMenu);

  app.post('/update-minus-cart', cartController().minusUpdate)

  app.get("/cart/deleteaddress/:id", auth, cartController().deleteAddress);

  app.post("/update-cart", cartController().update);
  // cart ends

  app.get('/offers', (req, res) => {
    res.render('customers/offers')
  })

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      authType: "reauthenticate",
      scope: ["email"],
    })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      failureRedirect: "/login",
      successRedirect: "/",
    })
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: "https://www.googleapis.com/auth/plus.login",
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      successRedirect: "/",
    })
  );

  app.get("/admin/adminMenu/:id", admin, newItemController().showMenu);
  app.get("/admin/editMenu/:id", admin, newItemController().viewMenu);



  // customer routes

  app.post("/orders", auth, orderController().store);
  app.get("/customer/orders", auth, orderController().index);
  app.get("/customer/orders/:id", auth, orderController().show);
  app.get("/customer/profile/", auth, profileController().index);
  app.post("/customer/profile/", auth, profileController().updateProfileInfo);

  app.post(
    "/customer/profile/updateaddressinfo",
    auth,
    profileController().updateAddressInfo
  );
  app.post(
    "/customer/profile/editaddressinfo/",
    auth,
    profileController().editAddressInfo
  );

  // Admin orders
  //app.get("/admin/orders", admin, orderGawa().index);

  app.get("/admin/orders", admin, adminOrderController().index);

  app.get("/admin/adminLanding", admin, adminLandingController().index);

  app.post("/admin/order/status", admin, statusController().update);
  
  app.get("/admin/ordersMakati", admin, adminOrderControllerMakati().index);
  app.post("/admin/orderMakati/status", admin, statusControllerMakati().update);

  app.get("/admin/ordersOrtigas", admin, adminOrderControllerOrtigas().index);
  app.post("/admin/orderOrtigas/status", admin, statusControllerOrtigas().update);

  app.get("/admin/adminMenu", admin, adminMenuController().index);

  app.get("/admin/newItem", admin, newItemController().index);
  //app.get("/:id", admin, newItemController().getItem);

  
}

module.exports = initRoutes;
