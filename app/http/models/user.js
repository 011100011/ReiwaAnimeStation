const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    displayName: {
      type: String,
      default: null,
    },
    name: {
      firstname: { type: String, trim: true, default: null },
      middlename: { type: String, trim: true },
      lastname: { type: String, trim: true, default: null },
    },
    email: { type: String, unique: true, trim: true },
    Firstname: { type: String, trim: true, default: null },
    Lastname: { type: String, trim: true, default: null },
    home_address: { type: String, required: true },
    cities: { type: String, required: true },
    landmarks: { type: String, required: true },
    zipcode: { type: Number, required: true },
    country: { type: String, default: "Philippines" },
    address_type: { type: String, default: "Home" },
    phonenumber: { type: Number, default: null, trim: true },
    password: { type: String, required: true },
    confirmPassword:  { type: String, required: true },
    gender: { type: String, default: null },
    role: {
      type: String,
      default: "customer",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.displayName) this.displayName = this.name.firstName;

  next();
});

module.exports = mongoose.model('User', userSchema)
