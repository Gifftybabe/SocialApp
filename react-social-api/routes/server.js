const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the "assets" directory in the client's public folder
app.use(
  "/assets",
  express.static(path.join(__dirname, "client/public/assets"))
);

// Your other routes and configurations...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
