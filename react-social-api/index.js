const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get("/images/:filename", (req, res) => {
  const { filename } = req.params;
  console.log("Requested Filename:", filename);
  res.sendFile(path.join(__dirname, `public/images/${filename}`));
});

app.use(cors());

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     // const fileName = Date.now() + file.originalname;
//     cb(null, req.body.name);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueFileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res
      .status(200)
      .json({
        message: "File uploaded successfully!",
        data: req.file.originalname,
      });
  } catch (err) {
    console.error("Error handling file upload:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
// app.use(
//   "/api/posts",
//   (req, res, next) => {
//     console.log(`Request received for ${req.url}`);
//     next();
//   },
//   postRoute
// );

app.listen(8800, () => {
  console.log("Backend sever is running fast!");
});
