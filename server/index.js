require("dotenv").config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require("path");

const app = express();
app.use(express.json());

// serve frontend files
app.use(express.static(path.join(__dirname, "dist")));

const router = require("./routes");
app.use("/api", router);

// main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

// ✅ catch-all route (fix)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectToMongoDB();

  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
};

startServer();