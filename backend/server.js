import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import methodoverride from "method-override";
import ejsMate from "ejs-mate";
//import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import favicon from "serve-favicon";
//import logger from "morgan";
import bodyParser from "body-parser";
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import departmentRoute from "./routes/department.route.js";
import requestRoute from "./routes/request.route.js";
import applicationRoute from "./routes/application.route.js";
import ExpressError from "./utils/ExpressError.js"

const app = express();
app.set("view engine", "ejs");
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.set("views", path.join(__dirname, "/views"));

//middleware to show static files
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({}));
dotenv.config({});

//databse connection
connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL, // Explicitly allow the frontend's URL
  credentials: true, // Allow cookies and credentials
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Ensure OPTIONS is allowed
  allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
};
app.use(cors(corsOptions)); // Apply CORS middleware

// Handle preflight requests explicitly
app.options("*", cors(corsOptions)); // Respond to preflight requests for all routes

const sessionOptions = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true, //crossscripting attack is secured
  },
};

// middleware
app.use(session(sessionOptions));
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`Incoming request from origin: ${req.headers.origin}`); // Log request origin
  console.log(`${req.method} ${req.url}`); // Log incoming requests
  next();
});

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/department", departmentRoute);
app.use("/api/v1/requests", requestRoute);
app.use("/api/v1/application", applicationRoute);

// Handle undefined API routes
app.all("/api/*", (req, res, next) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// app.use(favicon(path.join(__dirname, '/favicon/', 'favicon.ico')))
// use static authenticate method of model in LocalStrategy
// passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });

// app.get('/demouser',async (req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   })
//   const registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  console.error(err);
  res.status(statusCode).json({ error: message }); // Ensure JSON response for errors
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
