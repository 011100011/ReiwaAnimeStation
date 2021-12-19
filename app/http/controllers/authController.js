const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === "admin" ? "/admin/adminLanding" : "customer/orders";
  };
  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        // show error msg
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.login(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { Firstname, Lastname, home_address, cities, landmarks, zipcode, phonenumber, email, password, confirmPassword } = req.body;
      console.log(req.body);

      //Password Confirmation
      if(password == ""){
        req.flash('error', 'Password fields are required')
        req.flash('email', email)
        req.flash('Firstname', Firstname)
        req.flash('Lastname', Lastname)
        req.flash('home_address', home_address)
        req.flash('cities', cities)
        req.flash('landmarks', landmarks)
        req.flash('zipcode', zipcode)
        req.flash('phonenumber', phonenumber)
        return res.redirect('/register')
      }
      else if(password != confirmPassword){
        req.flash('error', "Password didn't match try again")
        req.flash('email', email)
        req.flash('Firstname', Firstname)
        req.flash('Lastname', Lastname)
        req.flash('home_address', home_address)
        req.flash('cities', cities)
        req.flash('landmarks', landmarks)
        req.flash('zipcode', zipcode)
        req.flash('phonenumber', phonenumber)
        return res.redirect('/register')
      }
      // check if email exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "The email address has already been taken");
          req.flash('email', email)
          req.flash('Firstname', Firstname)
          req.flash('Lastname', Lastname)
          req.flash('home_address', home_address)
          req.flash('cities', cities)
          req.flash('landmarks', landmarks)
          req.flash('zipcode', zipcode)
          req.flash('phonenumber', phonenumber)
          return res.redirect("/register");
        }
      });

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        Firstname,
        Lastname,
        home_address,
        cities,
        landmarks,
        zipcode,
        phonenumber,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
      });

      user
        .save()
        .then(() => {
          return res.redirect("/login");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong please try again");
          console.log(err);
        });
    },
    logout(req, res) {
      req.logout();
      return res.redirect("/");
    },
  };
}

module.exports = authController;
