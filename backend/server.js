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
import bodyParser from "body-parser";
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import departmentRoute from "./routes/department.route.js";
import requestRoute from "./routes/request.route.js";
import applicationRoute from "./routes/application.route.js";
import ExpressError from "./utils/ExpressError.js"
import logger from "morgan";

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
app.use(logger("dev")); // Use morgan middleware for logging HTTP requests
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
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

// Handle preflight requests explicitly
app.options("*", cors(corsOptions)); // Respond to preflight requests for all routes

// Ensure CORS headers are set for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const sessionOptions = {
  secret: process.env.SECRET_KEY || "defaultSecret", // Ensure SECRET_KEY is set
  resave: false, // Avoid unnecessary session resaving
  saveUninitialized: false, // Do not save uninitialized sessions
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true, // Prevent client-side access to cookies
    secure: process.env.NODE_ENV === "production" && process.env.SECURE_COOKIES === "true", // Use secure cookies only if explicitly enabled
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-origin cookies in production
  },
};

// middleware
app.use(session(sessionOptions));
app.use(cors({ ...corsOptions, credentials: true })); // Ensure credentials are allowed
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID
});

passport.deserializeUser((id, done) => {
  // Replace with your user fetching logic
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use((req, res, next) => {
  console.log(`Incoming request from origin: ${req.headers.origin}`); // Log request origin
  console.log(`${req.method} ${req.url}`); // Log incoming requests
  next();
});

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/department", departmentRoute);
app.use("/api/v1/requests",  requestRoute);
app.use("/api/v1/application", applicationRoute);

// Handle undefined API routes
app.all("/api/*", (req, res, next) => {
  res.status(404).json({ error: "API endpoint not found" });
});

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
