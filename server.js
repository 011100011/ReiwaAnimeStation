const express = require("express");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo").default;
const passport = require("passport");
const Emitter = require("events");
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);

// dotenv
require("dotenv").config({ path: "./app/config/config.env" });

mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true, });
const connection = mongoose.connection
.once('open', () => 
    console.log('Database connected...')
).on('error', error => {
    console.log('Connection failed...')
});

app.use(flash());
app.use(cors());
// Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: MongoDbStore.create({
      mongoUrl: process.env.MONGO_CONNECTION_URL
  }),
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hours
}))

// Passport config
const passportInit = require("./app/config/passport")(passport);
const facebookInit = require("./app/config/passportAuth/facebook")(passport);
const googleInit = require("./app/config/passportAuth/google")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// view engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

app.use(methodOverride('_method'))

require("./routes/web")(app);

// PORT
const PORT = process.env.PORT || 80;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

const io = require("socket.io")(server);

// Socket
io.on("connection", (socket) => {
  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
